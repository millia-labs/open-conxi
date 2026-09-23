// Copies the stock SOPs into the hotel's folder. A file the hotel already has is never touched.
const fs = require("node:fs");
const path = require("node:path");

function stockDir() {
  return path.join(__dirname, "..", "hotel-sops", "sops");
}

function copySops(dir, src = stockDir()) {
  const to = path.join(dir, "sops");
  fs.mkdirSync(to, { recursive: true });
  const added = [], kept = [];
  for (const f of fs.readdirSync(src).filter((f) => /^\d\d-.+\.md$/.test(f)).sort()) {
    const dst = path.join(to, f);
    if (fs.existsSync(dst)) { kept.push(f); continue; }
    fs.copyFileSync(path.join(src, f), dst);
    added.push(f);
  }
  return { added, kept };
}

function cli(dir = process.cwd()) {
  const { added, kept } = copySops(dir);
  console.log(`Added ${added.length} SOPs to ${path.join(dir, "sops")}${kept.length ? `. Kept your ${kept.length} existing ones as they are` : ""}.`);
  console.log("Edit any file in sops/ to match how your hotel works. The skills read your copy.");
}

module.exports = { copySops, cli, stockDir };
