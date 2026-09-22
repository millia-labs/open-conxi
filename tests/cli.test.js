const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
const CLI = path.join(__dirname, "..", "bin", "cli.js");

test("list prints all twelve skills", () => {
  const out = execFileSync("node", [CLI, "list"], { encoding: "utf8" });
  for (const s of ["hotel-setup","hotel-dashboard","morning-flash","review-replies","guest-messages","turnover-board","work-orders","rate-check","group-displacement","staff-roster","ota-reconciliation","owner-report"]) {
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
const ALL = ["hotel-setup","hotel-dashboard","morning-flash","review-replies","guest-messages","turnover-board","work-orders","rate-check","group-displacement","staff-roster","ota-reconciliation","owner-report"];
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
