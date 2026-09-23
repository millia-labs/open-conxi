const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { readTeamChats, resolveChat, deliver } = require("../bin/team.js");

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "oct-"));

// A fake Beeper Desktop API with three chats. Records every write.
function fakeBeeper({ draftBusy = false } = {}) {
  const writes = [];
  const chats = [
    { id: "!hk:local", title: "Housekeeping team", network: "WhatsApp", type: "group" },
    { id: "!mt:local", title: "Maintenance", network: "WhatsApp", type: "group" },
    { id: "!mt2:local", title: "Maintenance old", network: "Telegram", type: "group" },
  ];
  const srv = http.createServer((req, res) => {
    let body = "";
    req.on("data", (d) => (body += d));
    req.on("end", () => {
      if (req.headers.authorization !== "Bearer good") { res.writeHead(401); return res.end("{}"); }
      const u = new URL(req.url, "http://x");
      res.setHeader("content-type", "application/json");
      if (u.pathname === "/v1/accounts") return res.end(JSON.stringify([{ accountID: "wa", network: "WhatsApp" }]));
      if (u.pathname === "/v1/chats/search") {
        const q = (u.searchParams.get("query") || "").toLowerCase();
        return res.end(JSON.stringify({ items: chats.filter((c) => c.title.toLowerCase().includes(q)) }));
      }
      const m = u.pathname.match(/^\/v1\/chats\/([^/]+)(\/messages)?$/);
      if (m) {
        writes.push({ method: req.method, chat: decodeURIComponent(m[1]), messages: !!m[2], body: JSON.parse(body || "{}") });
        if (req.method === "PATCH" && draftBusy) { res.writeHead(400); return res.end(JSON.stringify({ message: "Non-empty drafts are only accepted when the current draft is empty" })); }
        return res.end(JSON.stringify({ ok: true, messageID: "m1" }));
      }
      res.writeHead(404); res.end("{}");
    });
  });
  return new Promise((r) => srv.listen(0, "127.0.0.1", () => r({ srv, writes, url: `http://127.0.0.1:${srv.address().port}` })));
}

test("readTeamChats pulls the team_chats block out of hotel-profile.md", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-profile.md"), "```yaml\nhotel:\n  name: \"Casa Azul\"\nteam_chats:\n  housekeeping: \"Housekeeping team\"\n  maintenance: 'Maintenance'\n  managers: \"\"\nsystems:\n  pms: Mews\n```\n");
  assert.deepEqual(readTeamChats(dir), { housekeeping: "Housekeeping team", maintenance: "Maintenance" });
});

test("readTeamChats returns {} when there is no profile or no block", () => {
  assert.deepEqual(readTeamChats(tmp()), {});
});

test("resolveChat picks the exact title, ignoring case", async () => {
  const b = await fakeBeeper();
  const chat = await resolveChat({ url: b.url, token: "good" }, "maintenance");
  b.srv.close();
  assert.equal(chat.id, "!mt:local");
});

test("resolveChat refuses to guess when no title matches exactly", async () => {
  const b = await fakeBeeper();
  await assert.rejects(resolveChat({ url: b.url, token: "good" }, "Maint"), /No Beeper chat is called "Maint"[\s\S]*Maintenance/);
  b.srv.close();
});

test("deliver puts a draft in the chat by default and sends nothing", async () => {
  const b = await fakeBeeper();
  const out = await deliver({ url: b.url, token: "good" }, { to: "Housekeeping team", text: "Room 512 first" });
  b.srv.close();
  assert.equal(b.writes.length, 1);
  assert.equal(b.writes[0].method, "PATCH");
  assert.deepEqual(b.writes[0].body, { draft: { text: "Room 512 first" } });
  assert.match(out, /draft/i);
});

test("deliver --send posts the message", async () => {
  const b = await fakeBeeper();
  await deliver({ url: b.url, token: "good" }, { to: "Housekeeping team", text: "Room 512 first", send: true });
  b.srv.close();
  assert.equal(b.writes[0].method, "POST");
  assert.equal(b.writes[0].messages, true);
  assert.deepEqual(b.writes[0].body, { text: "Room 512 first" });
});

test("deliver never overwrites someone's half-typed draft", async () => {
  const b = await fakeBeeper({ draftBusy: true });
  await assert.rejects(deliver({ url: b.url, token: "good" }, { to: "Maintenance", text: "x" }), /already has unsent text/);
  b.srv.close();
  assert.ok(b.writes.every((w) => w.method === "PATCH" && w.body.draft !== null), "never cleared the draft");
});

test("a bad token gives a plain instruction, not a stack trace", async () => {
  const b = await fakeBeeper();
  await assert.rejects(deliver({ url: b.url, token: "bad" }, { to: "Maintenance", text: "x" }), /npx open-conxi team connect/);
  b.srv.close();
});

test("Beeper not running gives a plain instruction", async () => {
  await assert.rejects(deliver({ url: "http://127.0.0.1:9", token: "good" }, { to: "Maintenance", text: "x" }), /Open Beeper Desktop/);
});

test("empty message is refused before touching Beeper", async () => {
  const b = await fakeBeeper();
  await assert.rejects(deliver({ url: b.url, token: "good" }, { to: "Maintenance", text: "   " }), /empty/);
  b.srv.close();
  assert.equal(b.writes.length, 0);
});

test("readTeamChats also reads the one-line form hotel-setup writes", () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "hotel-profile.md"), 'team_chats: {managers: "Duty managers, KL", housekeeping: "HK team", maintenance: "", all_staff: \'All staff\'}\n');
  assert.deepEqual(readTeamChats(dir), { managers: "Duty managers, KL", housekeeping: "HK team", all_staff: "All staff" });
});

test("a message over 900 characters is refused before touching Beeper", async () => {
  const b = await fakeBeeper();
  await assert.rejects(deliver({ url: b.url, token: "good" }, { to: "Maintenance", text: "x".repeat(901) }), /901 characters/);
  b.srv.close();
  assert.equal(b.writes.length, 0);
});
