// Replaces long dashes in the hotel's own files (hotel-profile.md,
// hotel-data.json, team-message.txt) in the working folder. Models type them
// by habit even when told not to, so the skills run this after saving.
const fs = require("node:fs");
const path = require("node:path");

const FILES = ["hotel-profile.md", "hotel-data.json", "team-message.txt"];

function clean(text) {
  return text
    .replace(/(\d)\s*[–—]\s*(\d)/g, "$1 to $2") // 10–12 -> 10 to 12
    .replace(/\s*[–—]\s*/g, ", ")                // a — b -> a, b
    .replace(/,\s*,/g, ",")
    .replace(/,\s*([.:;])/g, "$1");
}

function tidy(dir = process.cwd()) {
  const changed = [];
  for (const f of FILES) {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) continue;
    const before = fs.readFileSync(p, "utf8");
    const n = (before.match(/[–—]/g) || []).length;
    if (!n) continue;
    const after = clean(before);
    if (f.endsWith(".json")) JSON.parse(after); // never write a file that no longer parses
    fs.writeFileSync(p, after);
    changed.push(`${f}: ${n} replaced`);
  }
  return changed;
}

module.exports = { clean, tidy };
