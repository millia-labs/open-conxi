const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { copySops } = require("../bin/sops.js");

function stock() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "sop-src-"));
  fs.writeFileSync(path.join(d, "01-check-in.md"), "# SOP 01: Check-in\nstock\n");
  fs.writeFileSync(path.join(d, "02-check-out.md"), "# SOP 02: Check-out\nstock\n");
  fs.writeFileSync(path.join(d, "notes.txt"), "not an SOP");
  return d;
}

test("copySops adds every SOP to sops/ in the hotel folder", () => {
  const hotel = fs.mkdtempSync(path.join(os.tmpdir(), "sop-hotel-"));
  const r = copySops(hotel, stock());
  assert.deepEqual(r.added, ["01-check-in.md", "02-check-out.md"]);
  assert.deepEqual(r.kept, []);
  assert.ok(!fs.existsSync(path.join(hotel, "sops", "notes.txt")));
});

test("copySops never overwrites an SOP the hotel edited", () => {
  const hotel = fs.mkdtempSync(path.join(os.tmpdir(), "sop-hotel-"));
  fs.mkdirSync(path.join(hotel, "sops"));
  fs.writeFileSync(path.join(hotel, "sops", "01-check-in.md"), "# SOP 01: Check-in\nours\n");
  const r = copySops(hotel, stock());
  assert.deepEqual(r.added, ["02-check-out.md"]);
  assert.deepEqual(r.kept, ["01-check-in.md"]);
  assert.match(fs.readFileSync(path.join(hotel, "sops", "01-check-in.md"), "utf8"), /ours/);
});
