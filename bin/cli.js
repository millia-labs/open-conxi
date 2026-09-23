#!/usr/bin/env node
// Open Conxi installer. The skills ship inside this npm package, so install
// needs no git and no GitHub access. Each skill is copied to
// ~/.claude/skills/<skill>/ which is where Claude Code discovers personal skills.
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const PKG_ROOT = path.join(__dirname, "..");
const VERSION = require(path.join(PKG_ROOT, "package.json")).version;
const SKILLS = ["hotel-setup","hotel-dashboard","morning-flash","review-replies","guest-messages","turnover-board","work-orders","rate-check","group-displacement","staff-roster","ota-reconciliation","owner-report","hotel-routine"];
const MARKER = ".open-conxi";

function skillsDir() {
  if (process.env.CLAUDE_SKILLS_DIR) return process.env.CLAUDE_SKILLS_DIR;
  const h = os.homedir();
  if (!h) { console.error("Cannot find the home directory."); process.exit(1); }
  return path.join(h, ".claude", "skills");
}
const ours = (dir) => fs.existsSync(path.join(dir, MARKER));

function usage() {
  console.log(`open-conxi ${VERSION}\n`);
  console.log("Usage: npx open-conxi <install|update|uninstall|list|dashboard|team|tidy|help>\n");
  console.log("  install    copy the thirteen skills into ~/.claude/skills");
  console.log("  update     same as install, replaces older Open Conxi copies");
  console.log("  uninstall  remove the Open Conxi skills, nothing else");
  console.log("  list       print the skills in run order");
  console.log("  dashboard  open the hotel dashboard for this folder; it updates after every skill run");
  console.log("  team       send a skill's team message to a staff chat through Beeper Desktop");
  console.log("  tidy       clean long dashes out of this folder's hotel files");
  console.log("\nAdd --force to replace a same-named skill that Open Conxi did not install.");
}
function list() {
  console.log("Run order: hotel-setup, hotel-dashboard, then any of the rest. hotel-routine runs the day's jobs in order.\n");
  SKILLS.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s}`));
}
function install() {
  const force = process.argv.includes("--force");
  const base = skillsDir();
  fs.mkdirSync(base, { recursive: true });
  const skipped = [];
  let done = 0;
  for (const s of SKILLS) {
    const src = path.join(PKG_ROOT, s);
    const dst = path.join(base, s);
    if (!fs.existsSync(path.join(src, "SKILL.md"))) { console.error(`Package is missing ${s}/SKILL.md. Reinstall with: npx open-conxi@latest install`); process.exit(1); }
    if (fs.existsSync(dst)) {
      if (!ours(dst) && !force) { skipped.push(s); continue; }
      fs.rmSync(dst, { recursive: true, force: true });
    }
    fs.cpSync(src, dst, { recursive: true });
    fs.writeFileSync(path.join(dst, MARKER), `${VERSION}\n`);
    done++;
  }
  console.log(`Installed ${done} of ${SKILLS.length} skills (v${VERSION}) to ${base}`);
  if (skipped.length) {
    console.log(`\nSkipped, a skill with the same name already exists and was not installed by Open Conxi:\n  ${skipped.join("\n  ")}\nRe-run with --force to replace them.`);
  }
  // Clean up the folder older versions cloned into.
  const legacy = path.join(base, "open-conxi");
  if (fs.existsSync(path.join(legacy, ".git"))) {
    fs.rmSync(legacy, { recursive: true, force: true });
    console.log(`Removed the old install at ${legacy}`);
  }
  console.log("\nRestart Claude Code, then say: set up my hotel.");
}
function uninstall() {
  const base = skillsDir();
  let n = 0;
  for (const s of SKILLS) {
    const dst = path.join(base, s);
    if (fs.existsSync(dst) && ours(dst)) { fs.rmSync(dst, { recursive: true, force: true }); n++; }
  }
  console.log(n ? `Removed ${n} Open Conxi skills from ${base}.` : "Nothing to remove.");
}

const cmd = process.argv[2] || "help";
function dashboard() {
  const a = process.argv;
  const i = a.indexOf("--port");
  require("./dashboard.js").start({ port: i > -1 ? Number(a[i + 1]) : 4747, open: !a.includes("--no-open") });
}

function team() {
  require("./team.js").cli(process.argv.slice(3)).catch((e) => { console.error(e.message); process.exit(1); });
}

function tidy() {
  const out = require("./tidy.js").tidy();
  console.log(out.length ? out.join("\n") : "Nothing to tidy.");
}

const fns = { install, dashboard, team, tidy, update: install, uninstall, list, help: usage, "--help": usage, "-h": usage, "--version": () => console.log(VERSION), "-v": () => console.log(VERSION) };
if (!fns[cmd]) {
  const guess = Object.keys(fns).find((k) => !k.startsWith("-") && (k.startsWith(cmd.slice(0, 3)) || cmd.startsWith(k.slice(0, 3))));
  console.error(`Unknown command: ${cmd}${guess ? `. Did you mean: npx open-conxi ${guess}` : ""}\n`);
  usage();
  process.exit(1);
}
fns[cmd]();
