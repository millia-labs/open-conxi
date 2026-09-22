#!/usr/bin/env python3
"""Lint Open Conxi skills against docs/CONTRACT.md. Usage: lint.py [skill_dir ...]; no args = all skill dirs at repo root."""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SECTIONS = ["## 1. Paste in", "## 2. Do", "## 3. Checklist", "## 4. Check yourself", "## 5. Output", "## 6. Still manual in your systems"]
MAX_LINES = 150
DESC_MAX = 1024
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿⬀-⯿️]")
DASHES = {"—": "em dash", "–": "en dash"}

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
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
