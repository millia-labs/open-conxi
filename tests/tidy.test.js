const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { clean, tidy } = require("../bin/tidy.js");

test("clean turns ranges into 'to' and other dashes into commas", () => {
  assert.equal(clean("Check-in 14–15"), "Check-in 14 to 15");
  assert.equal(clean("SST 6% — unconfirmed"), "SST 6%, unconfirmed");
  assert.equal(clean("Done — files written."), "Done, files written.");
});

test("tidy fixes the hotel files, keeps JSON valid, leaves hyphens alone", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oct-"));
  fs.writeFileSync(path.join(dir, "hotel-profile.md"), "- SST — unconfirmed\ncheck-in: 15:00\n");
  fs.writeFileSync(path.join(dir, "hotel-data.json"), JSON.stringify({ note: "a – b", id: "WO-2609-001" }));
  const out = tidy(dir);
  assert.equal(out.length, 2);
  assert.equal(fs.readFileSync(path.join(dir, "hotel-profile.md"), "utf8"), "- SST, unconfirmed\ncheck-in: 15:00\n");
  const d = JSON.parse(fs.readFileSync(path.join(dir, "hotel-data.json"), "utf8"));
  assert.equal(d.note, "a, b"); assert.equal(d.id, "WO-2609-001");
  assert.deepEqual(tidy(dir), []);
});
