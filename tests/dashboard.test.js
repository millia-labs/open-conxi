const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { render, createServer } = require("../bin/dashboard.js");
const TPL = path.join(__dirname, "..", "hotel-dashboard", "templates", "dashboard.html");
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "ocd-"));
const block = (html) => html.match(/<script id="hotel-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const listen = (srv) => new Promise((r) => srv.listen(0, "127.0.0.1", () => r(srv.address().port)));
const get = (port, p) => new Promise((r, j) => http.get({ host: "127.0.0.1", port, path: p }, (res) => { let b = ""; res.on("data", (d) => (b += d)); res.on("end", () => r({ status: res.statusCode, body: b })); }).on("error", j));

test("render embeds hotel-data.json from the folder", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), JSON.stringify({ schema_version: 1, hotel: { name: "Casa Azul", currency: "EUR" } }));
  assert.equal(JSON.parse(block(render(dir, TPL))).hotel.name, "Casa Azul");
});

test("render falls back to the template's empty block when the file is missing", () => {
  assert.deepEqual(JSON.parse(block(render(tmp(), TPL))).kpis, []);
});

test("a broken file shows a plain warning, not an empty hotel", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), "{ half written");
  const html = render(dir, TPL);
  assert.deepEqual(JSON.parse(block(html)).kpis, []);
  assert.match(html, /has a mistake in it/);
});

test("a broken file keeps showing the last good data", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), "{ half written");
  const html = render(dir, TPL, { hotel: { name: "Casa Azul" } });
  assert.equal(JSON.parse(block(html)).hotel.name, "Casa Azul");
  assert.match(html, /Showing the last good version/);
});

test("render escapes </script> inside the data", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), JSON.stringify({ hotel: { name: "</script><b>x" } }));
  assert.equal(JSON.parse(block(render(dir, TPL))).hotel.name, "</script><b>x");
});

test("GET / serves the page with the data embedded", async () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-data.json"), JSON.stringify({ hotel: { name: "Casa Azul" } }));
  const srv = createServer({ dir, templatePath: TPL });
  const port = await listen(srv);
  const res = await get(port, "/");
  srv.close();
  assert.equal(res.status, 200);
  assert.match(res.body, /Casa Azul/);
});

test("unknown paths return 404 and never read other files", async () => {
  const srv = createServer({ dir: tmp(), templatePath: TPL });
  const port = await listen(srv);
  const res = await get(port, "/../../etc/passwd");
  srv.close();
  assert.equal(res.status, 404);
});

test("/events sends update after a valid save and nothing after a broken one", async () => {
  const dir = tmp();
  const f = path.join(dir, "hotel-data.json");
  fs.writeFileSync(f, "{}");
  const srv = createServer({ dir, templatePath: TPL });
  const port = await listen(srv);
  const events = [];
  const req = http.get({ host: "127.0.0.1", port, path: "/events" }, (res) => res.on("data", (d) => events.push(String(d))));
  await wait(200);
  fs.writeFileSync(f, "{ broken");
  await wait(700);
  assert.ok(!events.join("").includes("event: update"), "no update for broken JSON");
  fs.writeFileSync(f, JSON.stringify({ updated_at: "2026-09-23T10:00:00+08:00" }));
  await wait(700);
  req.destroy(); srv.close();
  assert.ok(events.join("").includes("event: update"));
});

test("close() finishes even with a page still listening", async () => {
  const srv = createServer({ dir: tmp(), templatePath: TPL });
  const port = await listen(srv);
  let ended = false;
  http.get({ host: "127.0.0.1", port, path: "/events" }, (res) => { res.resume(); res.on("end", () => (ended = true)); });
  await wait(200);
  await new Promise((r) => srv.close(r));
  await wait(100);
  assert.ok(ended, "event stream ended");
});
