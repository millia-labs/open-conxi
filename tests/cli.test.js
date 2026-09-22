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
