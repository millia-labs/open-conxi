#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const REPO = "https://github.com/millia-labs/openconxi.git";
const SKILLS = ["hotel-setup","hotel-dashboard","morning-flash","review-replies","guest-messages","turnover-board","work-orders","rate-check","group-displacement","staff-roster","ota-reconciliation","owner-report"];

function home() {
  const h = process.env.HOME || process.env.USERPROFILE || (process.env.HOMEDRIVE && process.env.HOMEPATH ? process.env.HOMEDRIVE + process.env.HOMEPATH : null);
  if (!h) { console.error("Cannot find the home directory."); process.exit(1); }
  return h;
}
const target = () => path.join(home(), ".claude", "skills", "open-conxi");

function usage() {
  console.log("Usage: npx open-conxi <install|update|uninstall|list|help>\n");
  console.log("  install    clone the twelve skills into ~/.claude/skills/open-conxi");
  console.log("  update     git pull in that folder");
  console.log("  uninstall  remove that folder");
  console.log("  list       print the skills in run order");
}
function list() {
  console.log("Run order: hotel-setup, hotel-dashboard, then any of the rest.\n");
  SKILLS.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s}`));
}
function ensureGit() { try { execSync("git --version", { stdio: "ignore" }); } catch { console.error("Git is required. https://git-scm.com"); process.exit(1); } }
function install() {
  ensureGit(); const t = target();
  if (fs.existsSync(t)) { console.log(`Already installed at ${t}. Run: npx open-conxi update`); return; }
  fs.mkdirSync(path.dirname(t), { recursive: true });
  execSync(`git clone --depth 1 "${REPO}" "${t}"`, { stdio: "inherit" });
  console.log(`\nInstalled to ${t}. Open Claude Code and say: set up my hotel.`);
}
function update() { ensureGit(); const t = target(); if (!fs.existsSync(t)) { console.log("Not installed. Run: npx open-conxi install"); return; } execSync("git pull --ff-only", { cwd: t, stdio: "inherit" }); }
function uninstall() { const t = target(); if (!fs.existsSync(t)) { console.log("Nothing to remove."); return; } fs.rmSync(t, { recursive: true, force: true }); console.log(`Removed ${t}.`); }

const cmd = process.argv[2] || "help";
const fns = { install, update, uninstall, list, help: usage };
if (!fns[cmd]) { console.error(`Unknown command: ${cmd}\n`); usage(); process.exit(1); }
fns[cmd]();
