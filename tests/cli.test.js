const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
const CLI = path.join(__dirname, "..", "bin", "cli.js");

test("list prints all fourteen skills", () => {
  const out = execFileSync("node", [CLI, "list"], { encoding: "utf8" });
  for (const s of ["hotel-setup","hotel-dashboard","morning-flash","review-replies","guest-messages","turnover-board","work-orders","rate-check","group-displacement","staff-roster","ota-reconciliation","owner-report","hotel-routine","hotel-sops"]) {
    assert.ok(out.includes(s), s);
  }
});

test("help exits 0 and names the commands", () => {
  const out = execFileSync("node", [CLI, "help"], { encoding: "utf8" });
  assert.match(out, /install/); assert.match(out, /update/); assert.match(out, /uninstall/);
});

test("unknown command exits 1", () => {
  assert.throws(() => execFileSync("node", [CLI, "bogus"], { stdio: "pipe" }));
});

const fs = require("node:fs");
const os = require("node:os");
const ALL = ["hotel-setup","hotel-dashboard","morning-flash","review-replies","guest-messages","turnover-board","work-orders","rate-check","group-displacement","staff-roster","ota-reconciliation","owner-report","hotel-routine","hotel-sops"];
const run = (dir, ...args) => execFileSync("node", [CLI, ...args], { encoding: "utf8", env: { ...process.env, CLAUDE_SKILLS_DIR: dir } });

test("install copies every skill flat, with SKILL.md at the top of each folder", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oc-"));
  run(dir, "install");
  for (const s of ALL) assert.ok(fs.existsSync(path.join(dir, s, "SKILL.md")), s);
  assert.ok(fs.existsSync(path.join(dir, "hotel-dashboard", "templates", "dashboard.html")));
});

test("install leaves a same-named skill alone unless --force", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oc-"));
  fs.mkdirSync(path.join(dir, "rate-check"));
  fs.writeFileSync(path.join(dir, "rate-check", "SKILL.md"), "mine");
  assert.match(run(dir, "install"), /Skipped/);
  assert.equal(fs.readFileSync(path.join(dir, "rate-check", "SKILL.md"), "utf8"), "mine");
  run(dir, "install", "--force");
  assert.notEqual(fs.readFileSync(path.join(dir, "rate-check", "SKILL.md"), "utf8"), "mine");
});

test("update re-copies and uninstall removes only Open Conxi skills", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oc-"));
  fs.mkdirSync(path.join(dir, "someone-else"));
  run(dir, "install"); run(dir, "update");
  run(dir, "uninstall");
  for (const s of ALL) assert.ok(!fs.existsSync(path.join(dir, s)), s);
  assert.ok(fs.existsSync(path.join(dir, "someone-else")));
});

test("help lists the dashboard command", () => {
  const out = execFileSync("node", [CLI, "help"], { encoding: "utf8" });
  assert.match(out, /dashboard/);
});

test("team with no Beeper token explains how to connect", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "och-"));
  let err = "";
  try { execFileSync("node", [CLI, "team", "send", "--to", "x", "--text", "hi"], { stdio: "pipe", env: { ...process.env, HOME: home, BEEPER_TOKEN: "" } }); }
  catch (e) { err = String(e.stderr); }
  assert.match(err, /npx open-conxi team connect/);
});

test("team send never takes another flag as the message", () => {
  let err = "";
  try { execFileSync("node", [CLI, "team", "send", "--to", "x", "--text", "--send"], { stdio: "pipe", env: { ...process.env, BEEPER_TOKEN: "t", BEEPER_URL: "http://127.0.0.1:9" } }); }
  catch (e) { err = String(e.stderr); }
  assert.match(err, /--text needs a value/);
});

test("a typo gets a did-you-mean", () => {
  let err = "";
  try { execFileSync("node", [CLI, "instal"], { stdio: "pipe" }); } catch (e) { err = String(e.stderr); }
  assert.match(err, /Did you mean: npx open-conxi install/);
});
