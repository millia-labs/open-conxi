#!/usr/bin/env python3
"""Lint Open Conxi skills against docs/CONTRACT.md. Usage: lint.py [skill_dir ...]; no args = all skill dirs at repo root."""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SECTIONS = ["## 1. Paste in", "## 2. Do", "## 3. Checklist", "## 4. Check yourself", "## 5. Output", "## 6. Still manual in your systems"]
MAX_LINES = 150
DESC_MAX = 1024
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿⬀-⯿️]")
DASHES = {"—": "em dash", "–": "en dash"}

# Canonical lines. Every skill that carries them carries them word for word,
# so a fix made once reaches every skill (see docs/CONTRACT.md).
OUTPUT_RULES = ('- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and '
    'hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed '
    'on, flagged, fixed, isolated, refunded, dispatched, called, contacted, shared, posted) unless the paste says '
    'so; no weekday unless the paste states it; no sign-off unless a guest reads the text; names exactly as given, '
    'in the same script, with no title that assumes gender; no long or short dash characters (wider than a hyphen) '
    'anywhere, titles, headings and table cells included: write "Casa Azul, morning flash, 22 Sep", not the name, a '
    'dash, then the date, and write "none" in an empty cell; search every reply for them before you send it, a '
    'one-line question or a stop included, and replace each with a comma, a colon, a full stop, or "to" in a range; '
    'no emojis and no symbols such as warning signs, ticks, stars or arrows.')
SAVING = ('Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing '
    'tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key '
    'replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels '
    'channel and period, reviews platform and period, work_orders id, scorecard name and week). If you stop to ask '
    'the GM something, first save the rows that are already confirmed, or say "not saved yet". Then run `npx '
    'open-conxi tidy` in the folder to clear any long dashes, read the file back and report the rows added and '
    'replaced, by key, from what you read. Never say the file was updated unless you wrote it in this turn. In '
    "claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run "
    'hotel-dashboard in this same chat.')
SAVING_EXEMPT = {"hotel-setup", "hotel-dashboard"}
# Skills whose output a staff team acts on, and the team_chats role each one goes to.
TEAM_ROLES = {"morning-flash": "managers", "review-replies": "managers", "turnover-board": "housekeeping",
    "work-orders": "maintenance", "staff-roster": "all_staff"}
TEAM = ('Team message: end with a block headed "Team message" in plain text for the {role} chat: under 600 characters '
    '(count them with `wc -m team-message.txt` and cut until it fits), no tables, only what that team acts on '
    'today, even when you are also asking the GM for missing inputs. In Claude Code, if hotel-profile.md names a '
    '{role} chat under team_chats, save the block to team-message.txt and run `npx open-conxi team send --to {role} '
    '--file team-message.txt`, which puts it in that Beeper chat as a draft for a person to check and send. Add '
    '`--send` only when the GM says "send it straight away", "send it now" or "no need to check"; "just send it", '
    '"send it to the team" or "send it to the group" are not enough, so for those and anything vaguer, draft it and '
    'add one line: "It is a draft. Say send it straight away and I will send it." Report what the command printed, '
    'in its own words, and never say the message was drafted or sent unless it printed so. Otherwise, and in '
    'claude.ai, print the block for the GM to paste into the staff chat.')
PROFILE = ("First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, "
    "people and systems from it; if it is missing, say so at the top and list the defaults you used.")

def skill_dirs():
    return sorted(p for p in ROOT.iterdir() if p.is_dir() and (p / "SKILL.md").exists())

def lint(d: pathlib.Path):
    errs = []
    f = d / "SKILL.md"
    text = f.read_text(encoding="utf-8")
    lines = text.splitlines()
    if len(lines) > MAX_LINES:
        errs.append(f"{len(lines)} lines, limit {MAX_LINES} lines")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        errs.append("missing YAML frontmatter")
    else:
        fm = dict(re.findall(r"^(\w+):\s*(.*)$", m.group(1), re.M))
        if fm.get("name") != d.name:
            errs.append(f"name '{fm.get('name')}' does not match folder '{d.name}'")
        if len(fm.get("description", "")) > DESC_MAX or not fm.get("description"):
            errs.append("description missing or over 1024 chars")
    for ch, label in DASHES.items():
        for i, ln in enumerate(lines, 1):
            if ch in ln:
                errs.append(f"line {i}: {label}")
    for i, ln in enumerate(lines, 1):
        if EMOJI.search(ln):
            errs.append(f"line {i}: emoji")
    pos = -1
    for s in SECTIONS:
        p = text.find("\n" + s + "\n")
        if p < 0:
            errs.append(f"section '{s}' missing")
        elif p < pos:
            errs.append(f"section '{s}' out of order")
        else:
            pos = p
    a, b = text.find("\n## 3. Checklist\n"), text.find("\n## 4. Check yourself\n")
    if a >= 0 and b > a:
        n = len(re.findall(r"^- \[ \] ", text[a:b], re.M))
        if not 5 <= n <= 9:
            errs.append(f"checklist has {n} items, need 5 to 9")
    for ln in lines:
        if ln.startswith("- Output rules:") and ln != OUTPUT_RULES:
            errs.append("output rules line differs from OUTPUT_RULES in scripts/lint.py")
    a5, a6 = text.find("\n## 5. Output\n"), text.find("\n## 6.")
    if a5 >= 0 and d.name not in SAVING_EXEMPT and "\nhotel-data delta\n" in text[a5:a6] and SAVING not in text:
        errs.append("saving line missing from section 5")
    if d.name in TEAM_ROLES and TEAM.format(role=TEAM_ROLES[d.name]) not in text[a5:a6]:
        errs.append("team message line missing from section 5")
    if d.name != "hotel-setup" and OUTPUT_RULES in text:
        if PROFILE not in text:
            errs.append("profile line missing from section 2")
    return errs

def lint_prose():
    """Dash and emoji scan for every other markdown file in the repo (references, docs, mock)."""
    errs = []
    for f in sorted(ROOT.rglob("*.md")):
        rel = f.relative_to(ROOT)
        if f.name == "SKILL.md" or rel.parts[0] in (".venv", "node_modules", "dist") or "superpowers" in rel.parts:
            continue
        for i, ln in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            for ch, label in DASHES.items():
                if ch in ln:
                    errs.append(f"{rel}:{i}: {label}")
            if EMOJI.search(ln):
                errs.append(f"{rel}:{i}: emoji")
    return errs

SOP_HEADS = ["Owner:", "Used by:", "When:", "## Standard", "## Steps", "## Pause point", "## Escalate to the GM when", "## Your hotel", "## Sources"]

def lint_sops():
    """Format check for hotel-sops/sops/*.md, and every SOP must be named by at least one skill."""
    errs = []
    folder = ROOT / "hotel-sops" / "sops"
    files = sorted(folder.glob("[0-9][0-9]-*.md")) if folder.exists() else []
    if len(files) != 20:
        errs.append(f"hotel-sops/sops has {len(files)} SOPs, expected 20")
    skills_text = "\n".join((d / "SKILL.md").read_text(encoding="utf-8") for d in skill_dirs() if d.name != "hotel-sops")
    for f in files:
        rel, text = f.relative_to(ROOT), f.read_text(encoding="utf-8")
        lines, nn = text.splitlines(), f.name[:2]
        if len(lines) > 60:
            errs.append(f"{rel}: {len(lines)} lines, limit 60")
        if not lines or not lines[0].startswith(f"# SOP {nn}: "):
            errs.append(f"{rel}: first line must be '# SOP {nn}: <name>'")
        pos = 0
        for h in SOP_HEADS:
            p = text.find(h, pos)
            if p < 0:
                errs.append(f"{rel}: '{h}' missing or out of order")
            else:
                pos = p
        s, e = text.find("## Steps"), text.find("## Pause point")
        steps = len(re.findall(r"^\d+\. ", text[s:e], re.M)) if s >= 0 and e > s else 0
        if not 5 <= steps <= 9:
            errs.append(f"{rel}: {steps} steps, need 5 to 9")
        e2 = text.find("## Escalate")
        checks = len(re.findall(r"^- \[ \] ", text[e:e2], re.M)) if e >= 0 and e2 > e else 0
        if not 3 <= checks <= 5:
            errs.append(f"{rel}: pause point has {checks} items, need 3 to 5")
        if f"SOP {nn}" not in skills_text:
            errs.append(f"{rel}: no skill names SOP {nn}")
    return errs

def main(argv):
    dirs = [pathlib.Path(a) for a in argv] or skill_dirs()
    bad = 0
    for d in dirs:
        errs = lint(d)
        status = "ok" if not errs else "FAIL"
        print(f"{status:4} {d.name}")
        for e in errs:
            print(f"     - {e}")
        bad += bool(errs)
    print(f"{len(dirs) - bad}/{len(dirs)} skills pass")
    if not argv:
        prose = lint_prose()
        for e in prose:
            print(f"     - {e}")
        print("prose ok" if not prose else f"prose FAIL ({len(prose)})")
        bad += bool(prose)
        sops = lint_sops()
        for e in sops:
            print(f"     - {e}")
        print("sops ok" if not sops else f"sops FAIL ({len(sops)})")
        bad += bool(sops)
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
