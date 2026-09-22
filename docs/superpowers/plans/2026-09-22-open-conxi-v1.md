# Open Conxi v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `millia-labs/openconxi` v0.1.0: twelve region-neutral Claude skills (two setup, ten job skills) that run a hotel's daily, weekly and monthly work from pasted exports, installable in claude.ai (zip), Claude Code (plugin, npx) or by paste.

**Architecture:** Markdown skills with one shared contract (six sections, under 150 lines) reading one `hotel-profile.md` and one `hotel-data.json`. A Python lint enforces the contract. A Node CLI and a shell script package zips. A GitHub Action lints and attaches zips on tag. A fictional Kuala Lumpur hotel provides every sample output. Spec: `docs/superpowers/specs/2026-09-22-open-conxi-design.md`.

**Tech Stack:** Markdown + YAML frontmatter, Python 3.11+ (lint, pytest), Node 18+ (zero-dependency CLI, node:test), bash + zip, GitHub Actions, one self-contained HTML dashboard (vanilla JS, no CDN).

**Working directory for every task:** `/Users/mark/Desktop/claudine/projects/open-conxi` (call it `$ROOT`). Rule for all prose in this repo: no em dashes, no en dashes, no emojis, sentence-case headings, straight quotes. The lint enforces the first three.

---

## File map

| Path | Responsibility |
|---|---|
| `README.md` | What it is, run order, install paths, the twelve skills, Conxi line |
| `LICENSE` | MIT, Millia Labs Pte. Ltd. |
| `CLAUDE.md` | Repo rules for any agent editing it |
| `package.json`, `bin/cli.js` | `npx open-conxi install|update|uninstall|list` |
| `.claude-plugin/plugin.json` | Claude Code plugin manifest, `"skills": "./"` |
| `docs/CONTRACT.md` | The six-section skill contract, canonical text |
| `docs/SCHEMA.md` | `hotel-profile.md` YAML and `hotel-data.json` schema |
| `scripts/lint.py`, `tests/test_lint.py` | Contract enforcement |
| `scripts/build-zips.sh` | Per-skill and all-in zips into `dist/` |
| `.github/workflows/release.yml` | Lint, build zips, attach to release on tag |
| `hotel-setup/SKILL.md` | Onboarding, writes the profile |
| `hotel-dashboard/SKILL.md`, `hotel-dashboard/templates/dashboard.html` | The home screen |
| `<job-skill>/SKILL.md` (ten folders) | One job each |
| `<job-skill>/references/evidence.md` | Sources for every benchmark (rate-check, group-displacement, ota-reconciliation, owner-report, review-replies) |
| `mock/hotel-profile.md`, `mock/hotel-data.json` | The fictional hotel |
| `mock/profiles/{kuala-lumpur,lisbon,austin}.md` | Three filled profiles |
| `mock/outputs/<skill>/01-*.md` | One real sample output per skill |
| `evals/<skill>.md` | Three test prompts per skill with pass criteria |

---

## Task 1: Repo scaffold

**Files:**
- Create: `LICENSE`, `.gitignore`, `CLAUDE.md`, `package.json`, `.claude-plugin/plugin.json`, `README.md` (skeleton, finished in Task 19)

- [ ] **Step 1: Init the repo**

```bash
cd /Users/mark/Desktop/claudine/projects/open-conxi && git init -b main
```

- [ ] **Step 2: Write LICENSE (MIT)**

```text
MIT License

Copyright (c) 2026 Millia Labs Pte. Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

- [ ] **Step 3: Write .gitignore**

```text
dist/
node_modules/
__pycache__/
.pytest_cache/
.DS_Store
hotel-profile.md
hotel-data.json
dashboard.html
```

(The last three are a real hotel's files, never committed. The mock copies live under `mock/`.)

- [ ] **Step 4: Write CLAUDE.md**

```markdown
# Open Conxi, agent rules

This repo is twelve Claude skills for hotels. Deliverables are markdown, one HTML template, and small scripts. No build step for the skills.

Rules:
- Every skill follows `docs/CONTRACT.md` exactly: frontmatter `name` equals the folder name, six sections in order, under 150 lines. `python3 scripts/lint.py` must pass before any commit.
- No em dashes, no en dashes, no emojis, straight quotes, sentence-case headings. The lint blocks the first three.
- Every number that is a benchmark or a rule of thumb names its source in that skill's `references/evidence.md`. Nothing unsourced ships.
- Skills are region-neutral. Currency, tax, OTA mix, staff channel and labour rules come from `hotel-profile.md`, never from the skill text.
- Skills never invent data. If an input is missing, the output says so and stops at what can be verified.
- The only Conxi mention inside a skill is section 6, "Still manual in your systems".
- Run order is fixed: hotel-setup, hotel-dashboard, then any job skill.
- Mock numbers are fictional and labelled so.
```

- [ ] **Step 5: Write package.json**

```json
{
  "name": "open-conxi",
  "version": "0.1.0",
  "description": "Twelve free Claude skills that run the daily, weekly and monthly work of an independent hotel. By the Conxi team.",
  "keywords": ["claude", "claude-skills", "hotel", "hospitality", "revenue-management", "housekeeping"],
  "homepage": "https://github.com/millia-labs/openconxi",
  "repository": { "type": "git", "url": "git+https://github.com/millia-labs/openconxi.git" },
  "author": { "name": "Millia Labs Pte. Ltd.", "email": "mark@conxi.ai", "url": "https://conxi.ai" },
  "license": "MIT",
  "bin": { "open-conxi": "./bin/cli.js" },
  "scripts": { "test": "node --test tests/" },
  "files": ["bin/", ".claude-plugin/", "docs/", "hotel-setup/", "hotel-dashboard/", "morning-flash/", "review-replies/", "guest-messages/", "turnover-board/", "work-orders/", "rate-check/", "group-displacement/", "staff-roster/", "ota-reconciliation/", "owner-report/", "CLAUDE.md", "LICENSE", "README.md"]
}
```

- [ ] **Step 6: Write .claude-plugin/plugin.json**

```json
{
  "name": "open-conxi",
  "version": "0.1.0",
  "description": "Twelve free Claude skills that run the daily, weekly and monthly work of an independent hotel: setup, dashboard, morning flash, reviews, guest messages, turnover, work orders, rate check, group displacement, roster, OTA reconciliation, owner report.",
  "author": { "name": "Millia Labs Pte. Ltd.", "email": "mark@conxi.ai", "url": "https://conxi.ai" },
  "homepage": "https://github.com/millia-labs/openconxi",
  "repository": "https://github.com/millia-labs/openconxi",
  "license": "MIT",
  "keywords": ["hotel", "hospitality", "claude-skills"],
  "skills": "./"
}
```

- [ ] **Step 7: Write README.md skeleton**

```markdown
# Open Conxi

Twelve free Claude skills that run the daily, weekly and monthly work of an independent hotel.

(Finished in Task 19.)
```

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "chore: scaffold open-conxi repo

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 2: Lint script (TDD)

**Files:**
- Create: `scripts/lint.py`, `tests/test_lint.py`, `tests/fixtures/good-skill/SKILL.md`, `tests/fixtures/bad-name/SKILL.md`

- [ ] **Step 1: Write the fixtures**

`tests/fixtures/good-skill/SKILL.md`:
```markdown
---
name: good-skill
description: A fixture skill. Use when testing the lint.
---

# Good skill

Run order: hotel-setup, hotel-dashboard, then this skill.

## 1. Paste in
Text.

## 2. Do
Text.

## 3. Checklist
- [ ] one
- [ ] two
- [ ] three
- [ ] four
- [ ] five

## 4. Check yourself
Text.

## 5. Output
Text.

## 6. Still manual in your systems
Text.
```

`tests/fixtures/bad-name/SKILL.md`: same content with `name: wrong-name` on line 2.

- [ ] **Step 2: Write the failing tests**

`tests/test_lint.py`:
```python
import pathlib, subprocess, sys
import pytest

ROOT = pathlib.Path(__file__).resolve().parents[1]
LINT = ROOT / "scripts" / "lint.py"
FIX = ROOT / "tests" / "fixtures"

def run(*paths):
    return subprocess.run([sys.executable, str(LINT), *map(str, paths)], capture_output=True, text=True)

def test_good_skill_passes():
    r = run(FIX / "good-skill")
    assert r.returncode == 0, r.stdout + r.stderr

def test_name_mismatch_fails():
    r = run(FIX / "bad-name")
    assert r.returncode == 1
    assert "name 'wrong-name' does not match folder 'bad-name'" in r.stdout

def test_em_dash_fails(tmp_path):
    d = tmp_path / "dashy"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: dashy")
    (d / "SKILL.md").write_text(src.replace("Text.", "Text \u2014 with a dash.", 1))
    r = run(d)
    assert r.returncode == 1 and "em dash" in r.stdout

def test_emoji_fails(tmp_path):
    d = tmp_path / "emo"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: emo")
    (d / "SKILL.md").write_text(src.replace("Text.", "Text \U0001F600", 1))
    r = run(d)
    assert r.returncode == 1 and "emoji" in r.stdout

def test_missing_section_fails(tmp_path):
    d = tmp_path / "nosec"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: nosec")
    (d / "SKILL.md").write_text(src.replace("## 4. Check yourself\nText.\n\n", ""))
    r = run(d)
    assert r.returncode == 1 and "section '## 4. Check yourself'" in r.stdout

def test_checklist_count(tmp_path):
    d = tmp_path / "short"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: short")
    (d / "SKILL.md").write_text(src.replace("- [ ] four\n- [ ] five\n", ""))
    r = run(d)
    assert r.returncode == 1 and "checklist has 3 items" in r.stdout

def test_too_long_fails(tmp_path):
    d = tmp_path / "long"; d.mkdir()
    src = (FIX / "good-skill" / "SKILL.md").read_text().replace("name: good-skill", "name: long")
    (d / "SKILL.md").write_text(src + ("filler\n" * 140))
    r = run(d)
    assert r.returncode == 1 and "lines" in r.stdout
```

- [ ] **Step 3: Run tests, expect failure**

Run: `cd $ROOT && python3 -m pytest tests/test_lint.py -q`
Expected: 7 failed (lint.py missing).

- [ ] **Step 4: Write scripts/lint.py**

```python
#!/usr/bin/env python3
"""Lint Open Conxi skills against docs/CONTRACT.md. Usage: lint.py [skill_dir ...]; no args = all skill dirs at repo root."""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SECTIONS = ["## 1. Paste in", "## 2. Do", "## 3. Checklist", "## 4. Check yourself", "## 5. Output", "## 6. Still manual in your systems"]
MAX_LINES = 150
DESC_MAX = 1024
EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F]")
DASHES = {"\u2014": "em dash", "\u2013": "en dash"}

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
```

- [ ] **Step 5: Run tests, expect pass**

Run: `python3 -m pytest tests/test_lint.py -q`
Expected: 7 passed.

- [ ] **Step 6: Commit**

```bash
git add scripts/lint.py tests/ && git commit -m "feat: skill lint enforcing the six-section contract

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 3: Contract and schema docs

**Files:**
- Create: `docs/CONTRACT.md`, `docs/SCHEMA.md`

- [ ] **Step 1: Write docs/CONTRACT.md**

```markdown
# The skill contract

Every skill in this repo is one folder with one `SKILL.md`, optional `references/` and `templates/`. The lint (`scripts/lint.py`) enforces this file.

## Frontmatter
- `name`: equals the folder name.
- `description`: what it does, when to use it, and the phrases that trigger it. Under 1024 characters.

## Body
Line one after the title: `Run order: hotel-setup, hotel-dashboard, then this skill.` (setup skills state their own place.)
Then six sections, these exact headings, this order:

1. `## 1. Paste in`: the data the skill needs, and the fastest export for it from OPERA Cloud, Cloudbeds, Mews, Booking.com extranet, Expedia Partner Central, Agoda YCS, Trip.com. Say what to do when an input is missing.
2. `## 2. Do`: the procedure, numbered.
3. `## 3. Checklist`: five to nine `- [ ]` items, run before the expensive step (before a rate goes live, a reply is posted, a room is marked ready, a report goes to the owner). Say whether it is DO-CONFIRM (do the work, then confirm) or READ-DO (read each item, then do it).
4. `## 4. Check yourself`: verification the skill runs on its own output. Totals reconcile. Every number carries a comparison. Nothing invented. Missing inputs named.
5. `## 5. Output`: the exact format, then the `hotel-data.json` delta as a fenced `json` block headed `hotel-data delta`.
6. `## 6. Still manual in your systems`: what a human now has to type into the PMS, the extranet or WhatsApp after this output. The only place Conxi is mentioned, in one sentence: "Conxi (conxi.ai) does these steps inside your systems for you."

## Limits
Under 150 lines. No em dashes, no en dashes, no emojis, straight quotes, sentence-case headings. Region-neutral text. Every benchmark sourced in `references/evidence.md`.

## Reading the profile
Every skill opens with: read `hotel-profile.md` if present. If absent, proceed with defaults and list the assumptions at the top of the output.
```

- [ ] **Step 2: Write docs/SCHEMA.md**

```markdown
# Data files

Two files, kept by the hotel, never committed to this repo. In Claude Code they live in the working folder. In claude.ai the GM saves them into the Project's knowledge when a skill asks.

## hotel-profile.md

YAML block, then prose notes.

```yaml
profile_version: 1
hotel:
  name: ""
  city: ""
  country: ""            # ISO 3166 name
  currency: ""           # ISO 4217, e.g. MYR
  tax:
    regime: ""           # e.g. SST, GST, VAT, sales+occupancy
    rate_pct: 0
    tourism_levy: ""     # e.g. "MYR 10 per room night", or ""
  keys: 0
  room_types:            # list
    - code: ""
      name: ""
      count: 0
      base_rate: 0
  fnb: false
  meeting_space: false
  ownership: ""          # owner-operated, leased, managed, franchised
  reporting_standard: "" # USALI or local
  fiscal_year_start: ""  # e.g. "01-01"
systems:
  pms: ""                # OPERA Cloud, Cloudbeds, Mews, other
  channel_manager: ""
  booking_engine: ""
  otas: []               # Booking.com, Expedia, Agoda, Trip.com, Traveloka, other
  staff_channel: ""      # WhatsApp, Line, Slack, email
  review_platforms: []   # Google, Booking.com, Agoda, Trip.com, TripAdvisor
people:
  languages: []
  comp_authority:        # who may give what without approval
    front_desk: 0        # in currency
    manager: 0
  service_recovery_budget_per_shift: 0
```

## hotel-data.json

One JSON object. Each skill appends to its array and updates `updated_at`. `hotel-dashboard` reads the whole file.

```json
{
  "schema_version": 1,
  "profile_ref": "hotel-profile.md",
  "updated_at": "2026-09-22T09:00:00+08:00",
  "kpis": [
    {"date": "2026-09-21", "rooms_sold": 0, "occupancy": 0.0, "adr": 0, "revpar": 0, "trevpar": null, "gop": null,
     "budget": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "last_year": {"occupancy": 0.0, "adr": 0, "revpar": 0},
     "source": "morning-flash"}
  ],
  "pace": [
    {"stay_date": "2026-10-01", "otb_rooms": 0, "otb_adr": 0, "pickup_7d": 0, "cancellation_adjusted_otb": 0, "source": "rate-check"}
  ],
  "channels": [
    {"channel": "Booking.com", "share": 0.0, "effective_commission": 0.0, "period": "2026-08", "source": "ota-reconciliation"}
  ],
  "reviews": [
    {"platform": "Google", "rating": 0.0, "count": 0, "period": "2026-09", "top_positive": [], "top_negative": [], "source": "review-replies"}
  ],
  "work_orders": [
    {"id": "WO-0001", "priority": "P1", "opened": "2026-09-21", "sla_due": "2026-09-21T18:00", "status": "open", "location": "", "cost": 0, "source": "work-orders"}
  ],
  "scorecard": [
    {"name": "Rooms ready by 15:00", "value": 0.0, "target": 1.0, "owner": "", "week": "2026-W39", "source": "turnover-board"}
  ]
}
```

Rules: currency values are plain numbers in the profile's currency. Percentages are fractions (0.86, not 86). Dates are ISO. A skill never rewrites another skill's rows.
```

- [ ] **Step 3: Commit**

```bash
git add docs/ && git commit -m "docs: skill contract and data schema

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 4: hotel-setup skill (onboarding)

**Files:**
- Create: `hotel-setup/SKILL.md`

- [ ] **Step 1: Write hotel-setup/SKILL.md**

```markdown
---
name: hotel-setup
description: First-run onboarding for Open Conxi. Builds the hotel-profile.md that every other skill reads. Use when a hotel starts with these skills, when someone says "set up my hotel", "onboard my property", "create the hotel profile", "start Open Conxi", or when any other Open Conxi skill cannot find hotel-profile.md.
---

# Hotel setup

Run order: this skill first, then hotel-dashboard, then any job skill.

You are onboarding one hotel. The result is one file, `hotel-profile.md`, that the other eleven skills read so the GM never repeats the basics. Ask for facts, not opinions. Twelve questions at most, in one pass.

## 1. Paste in
- Optional: the hotel's website URL. If given and you can browse, read the home, rooms, and contact pages first and pre-fill name, city, country, room types, F&B, meeting space, languages.
- Optional: a PMS property configuration export (OPERA Cloud: Administration, Property, Room Classes; Cloudbeds: Settings, Rooms; Mews: Settings, Services, Spaces). Use it for keys and room type counts.
- If nothing is pasted, ask. Never guess keys, currency or tax.

## 2. Do
1. Read `docs/SCHEMA.md` in this repo for the field list (or the copy of the YAML block below if you cannot).
2. Pre-fill from whatever was pasted. Mark each pre-filled value with its source.
3. Ask only for the gaps, grouped into one message of at most twelve numbered questions: (1) hotel name and city, (2) country and currency, (3) tax regime, rate, and any per-night tourism levy, (4) total keys and room types with counts and a base rate each, (5) PMS, (6) channel manager and booking engine, (7) OTAs live, (8) staff channel, (9) review platforms you answer, (10) F&B and meeting space, yes or no each, (11) ownership type and reporting standard (USALI or local) and fiscal year start, (12) comp authority: what front desk and a manager may give away without asking, and the service recovery budget per shift.
4. When answered, write `hotel-profile.md`: the YAML block from `docs/SCHEMA.md` filled in, then a prose section "Notes" with anything that does not fit a field (brand voice in two lines, VIP rules, house quirks).
5. Tell the GM where to keep it: in Claude Code, the working folder; in claude.ai, download and add to the Project's knowledge. Say the next step is hotel-dashboard.

## 3. Checklist
READ-DO, before writing the file.
- [ ] Currency is an ISO code and matches the country.
- [ ] Room type counts sum to total keys.
- [ ] Tax rate is a percentage of the room rate, and the levy is per night if one exists.
- [ ] Every OTA named is one the hotel is live on today, not one it plans to join.
- [ ] Staff channel is the one staff actually read, not the one management prefers.
- [ ] Comp authority is in the hotel's currency and is a number, not "reasonable".
- [ ] Reporting standard is stated; if the GM does not know, write "local" and note it.

## 4. Check yourself
- Every field in the YAML block is filled or explicitly `""` with a note saying why.
- No value was invented. Each pre-filled value cites its source (website page or export).
- The file parses as YAML (no tabs, quoted strings with colons).
- The GM was told the next step.

## 5. Output
The full `hotel-profile.md` in one fenced block, ready to save. Then this delta, which creates the data file:

hotel-data delta
```json
{"schema_version": 1, "profile_ref": "hotel-profile.md", "updated_at": "<now ISO>", "kpis": [], "pace": [], "channels": [], "reviews": [], "work_orders": [], "scorecard": []}
```

## 6. Still manual in your systems
Nothing yet. This skill only reads. When the profile changes (new room type, new OTA, new tax rate), the GM edits the file by hand and every skill picks it up. Conxi (conxi.ai) keeps this profile in sync with your PMS for you.
```

- [ ] **Step 2: Lint**

Run: `python3 scripts/lint.py hotel-setup`
Expected: `ok   hotel-setup` and `1/1 skills pass`.

- [ ] **Step 3: Commit**

```bash
git add hotel-setup && git commit -m "feat: hotel-setup onboarding skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 5: hotel-dashboard skill and template

**Files:**
- Create: `hotel-dashboard/SKILL.md`, `hotel-dashboard/templates/dashboard.html`

- [ ] **Step 1: Write hotel-dashboard/templates/dashboard.html**

Self-contained, no CDN, reads a JSON object embedded at `<script id="hotel-data" type="application/json">`. Light and dark via `prefers-color-scheme`. Follows the dataviz skill rules: one palette, tiles first, one line chart, one bar chart, tables for the rest.

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hotel dashboard</title>
<style>
:root{--bg:#f7f6f3;--card:#ffffff;--ink:#1a1a1a;--muted:#6b6b6b;--line:#e4e1db;--good:#2f7d5b;--bad:#b3432b;--accent:#3d5c56;--font:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
@media (prefers-color-scheme:dark){:root{--bg:#141614;--card:#1d201e;--ink:#ecebe7;--muted:#a3a39d;--line:#2c302d;--good:#6fbf95;--bad:#e0836b;--accent:#8fb3ab}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 var(--font);padding:16px}
header{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:16px}
h1{font-size:20px;margin:0}h2{font-size:14px;margin:0 0 8px;color:var(--muted);font-weight:600;text-transform:none}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}
.kpi .v{font-size:26px;font-weight:700;line-height:1.1}.kpi .d{font-size:12px;color:var(--muted);margin-top:4px}
.up{color:var(--good)}.down{color:var(--bad)}
section{margin-top:18px}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line)}th{color:var(--muted);font-weight:600}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
svg{width:100%;height:180px;display:block}.axis{stroke:var(--line)}.series{fill:none;stroke:var(--accent);stroke-width:2}.bar{fill:var(--accent)}
.empty{color:var(--muted);font-size:13px}
footer{margin-top:24px;font-size:12px;color:var(--muted)}
</style></head><body>
<header><h1 id="title">Hotel dashboard</h1><div id="asof" class="d"></div></header>
<div class="grid" id="kpis"></div>
<section class="card"><h2>Next 30 days on the books</h2><svg id="pace" viewBox="0 0 600 180" role="img" aria-label="On-the-books rooms by stay date"></svg><div id="pace-empty" class="empty"></div></section>
<section class="card"><h2>Channel mix and effective commission</h2><svg id="channels" viewBox="0 0 600 180" role="img" aria-label="Channel share"></svg><div id="ch-empty" class="empty"></div></section>
<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
<section class="card"><h2>Reviews</h2><table id="reviews"></table></section>
<section class="card"><h2>Open work orders</h2><table id="wo"></table></section>
</div>
<section class="card"><h2>Scorecard</h2><table id="score"></table></section>
<footer>Built with Open Conxi. Data stays in this file. Re-run hotel-dashboard after any skill to refresh.</footer>
<script id="hotel-data" type="application/json">{"schema_version":1,"hotel":{"name":"","currency":""},"kpis":[],"pace":[],"channels":[],"reviews":[],"work_orders":[],"scorecard":[]}</script>
<script>
const D=JSON.parse(document.getElementById('hotel-data').textContent);
const cur=D.hotel&&D.hotel.currency||'';const fmt=n=>n==null?'n/a':(typeof n==='number'?n.toLocaleString(undefined,{maximumFractionDigits:0}):n);
const pct=x=>x==null?'n/a':(x*100).toFixed(1)+'%';
document.getElementById('title').textContent=(D.hotel&&D.hotel.name)||'Hotel dashboard';
document.getElementById('asof').textContent=D.updated_at?('Updated '+D.updated_at):'';
const k=D.kpis.slice().sort((a,b)=>a.date<b.date?1:-1)[0];
const kp=document.getElementById('kpis');
function tile(label,v,cmp,isPct){const el=document.createElement('div');el.className='card kpi';let d='';
 if(cmp!=null&&v!=null){const diff=isPct?((v-cmp)*100).toFixed(1)+' pts':fmt(v-cmp);const cls=v>=cmp?'up':'down';d=`<span class="${cls}">${v>=cmp?'+':''}${diff}</span> vs budget`;}
 el.innerHTML=`<div class="d">${label}</div><div class="v">${isPct?pct(v):(cur+' '+fmt(v))}</div><div class="d">${d}</div>`;kp.appendChild(el);}
if(k){tile('Occupancy',k.occupancy,k.budget&&k.budget.occupancy,true);tile('ADR',k.adr,k.budget&&k.budget.adr);tile('RevPAR',k.revpar,k.budget&&k.budget.revpar);
 if(k.trevpar!=null)tile('TRevPAR',k.trevpar,null);if(k.gop!=null)tile('GOP',k.gop,null);}else kp.innerHTML='<div class="card empty">No KPIs yet. Run morning-flash.</div>';
function line(svgId,emptyId,rows,x,y){const s=document.getElementById(svgId);if(!rows.length){document.getElementById(emptyId).textContent='No data yet.';return;}
 const W=600,H=180,p=28;const ys=rows.map(y);const mx=Math.max(...ys,1);const step=(W-2*p)/Math.max(rows.length-1,1);
 let d='';rows.forEach((r,i)=>{const px=p+i*step,py=H-p-(y(r)/mx)*(H-2*p);d+=(i?'L':'M')+px+','+py;});
 s.innerHTML=`<line class="axis" x1="${p}" y1="${H-p}" x2="${W-p}" y2="${H-p}"/><path class="series" d="${d}"/><text x="${p}" y="12" font-size="11" fill="currentColor">${rows[0][x]}</text><text x="${W-p}" y="12" font-size="11" text-anchor="end" fill="currentColor">${rows[rows.length-1][x]}</text><text x="${W-p}" y="${H-p-4}" font-size="11" text-anchor="end" fill="currentColor">max ${fmt(mx)}</text>`;}
line('pace','pace-empty',D.pace.slice().sort((a,b)=>a.stay_date<b.stay_date?-1:1).slice(0,30),'stay_date',r=>r.cancellation_adjusted_otb??r.otb_rooms??0);
(function(){const s=document.getElementById('channels');const rows=D.channels;if(!rows.length){document.getElementById('ch-empty').textContent='No data yet. Run ota-reconciliation.';return;}
 const latest=rows.filter(r=>r.period===rows.map(x=>x.period).sort().pop());const W=600,H=180,p=28,bw=(W-2*p)/latest.length-8;let h='';
 latest.forEach((r,i)=>{const x=p+i*(bw+8),bh=(r.share||0)*(H-2*p);h+=`<rect class="bar" x="${x}" y="${H-p-bh}" width="${bw}" height="${bh}"/><text x="${x+bw/2}" y="${H-p+14}" font-size="10" text-anchor="middle" fill="currentColor">${r.channel}</text><text x="${x+bw/2}" y="${H-p-bh-4}" font-size="10" text-anchor="middle" fill="currentColor">${pct(r.share)} at ${pct(r.effective_commission)}</text>`;});s.innerHTML=h;})();
function table(id,cols,rows,empty){const t=document.getElementById(id);if(!rows.length){t.innerHTML=`<tr><td class="empty">${empty}</td></tr>`;return;}
 t.innerHTML='<tr>'+cols.map(c=>`<th class="${c.n?'n':''}">${c.h}</th>`).join('')+'</tr>'+rows.map(r=>'<tr>'+cols.map(c=>`<td class="${c.n?'n':''}">${c.f(r)}</td>`).join('')+'</tr>').join('');}
table('reviews',[{h:'Platform',f:r=>r.platform},{h:'Period',f:r=>r.period},{h:'Rating',n:1,f:r=>r.rating},{h:'Count',n:1,f:r=>r.count},{h:'Top negative',f:r=>(r.top_negative||[]).join(', ')}],D.reviews,'No reviews yet. Run review-replies.');
table('wo',[{h:'ID',f:r=>r.id},{h:'P',f:r=>r.priority},{h:'Where',f:r=>r.location},{h:'Due',f:r=>r.sla_due},{h:'Status',f:r=>r.status}],D.work_orders.filter(r=>r.status!=='resolved'),'No open work orders. Run work-orders.');
table('score',[{h:'Measure',f:r=>r.name},{h:'Week',f:r=>r.week},{h:'Value',n:1,f:r=>typeof r.value==='number'&&r.value<=1?pct(r.value):fmt(r.value)},{h:'Target',n:1,f:r=>typeof r.target==='number'&&r.target<=1?pct(r.target):fmt(r.target)},{h:'Owner',f:r=>r.owner}],D.scorecard,'No scorecard yet. Run owner-report.');
</script></body></html>
```

- [ ] **Step 2: Smoke test the template**

Run: `python3 -c "import pathlib;t=pathlib.Path('hotel-dashboard/templates/dashboard.html').read_text();assert 'id=\"hotel-data\"' in t and '\u2014' not in t;print('template ok')"`
Expected: `template ok`. Then open the file in a browser: five empty-state messages render, no console errors.

- [ ] **Step 3: Write hotel-dashboard/SKILL.md**

```markdown
---
name: hotel-dashboard
description: Builds the hotel's one-file KPI dashboard (occupancy, ADR, RevPAR, pace, channel mix, reviews, work orders, scorecard) from hotel-data.json and re-renders it after any other Open Conxi skill runs. Use when someone says "build the dashboard", "refresh the dashboard", "show me the numbers", "KPI page", "owner view", or right after hotel-setup.
---

# Hotel dashboard

Run order: hotel-setup first, this skill second, then any job skill. Re-run this skill whenever a job skill has produced a hotel-data delta.

## 1. Paste in
- `hotel-profile.md` (required; if missing, stop and run hotel-setup).
- `hotel-data.json` if it exists, plus any `hotel-data delta` blocks printed by skills earlier in this conversation.
- Optional on first run: yesterday's night audit or manager's report (OPERA Cloud: Reports, Manager Report; Cloudbeds: Reports, Daily Summary; Mews: Reports, Accounting Summary) so the first dashboard is not empty. Take rooms sold, revenue, occupancy, ADR from it and write one `kpis` row.

## 2. Do
1. Merge: start from `hotel-data.json`, apply each delta in order (append rows; a delta never deletes). Set `updated_at` to now. Set `hotel.name` and `hotel.currency` from the profile.
2. Load `templates/dashboard.html` from this skill folder. Replace the contents of `<script id="hotel-data" type="application/json">` with the merged JSON. Change nothing else.
3. In Claude Code: write `dashboard.html` and the merged `hotel-data.json` to the working folder, then open `dashboard.html`. In claude.ai: render the HTML as an artifact and print the merged `hotel-data.json` for the GM to save.
4. Under the dashboard, list which panels are empty and which skill fills each.

## 3. Checklist
DO-CONFIRM, after rendering.
- [ ] Title shows the hotel name from the profile, not "Hotel dashboard".
- [ ] Every KPI tile carries a comparison or says "vs budget" is unavailable.
- [ ] Percentages in the JSON are fractions (0.86), not 86.
- [ ] Currency label matches the profile.
- [ ] No row from an earlier delta was dropped (count rows before and after the merge).
- [ ] Empty panels name the skill that fills them.

## 4. Check yourself
- The embedded JSON parses. Run it through a JSON parser before writing the file.
- Row counts per array equal the sum of the file and the deltas.
- The template was not edited beyond the JSON block.
- If the profile is missing, the output is one line: run hotel-setup.

## 5. Output
The rendered dashboard (artifact or `dashboard.html`), the merged `hotel-data.json` in a fenced block, and a five-line panel status list. This skill emits no delta of its own.

## 6. Still manual in your systems
Nothing goes back into the PMS from this page. The numbers on it came from exports a person pasted; a fresh export is needed each time. Conxi (conxi.ai) reads the PMS itself and keeps this page current without the pasting.
```

- [ ] **Step 4: Lint and commit**

Run: `python3 scripts/lint.py hotel-dashboard` (expect ok)

```bash
git add hotel-dashboard && git commit -m "feat: hotel-dashboard skill and self-contained HTML template

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 6: morning-flash

**Files:**
- Create: `morning-flash/SKILL.md`

- [ ] **Step 1: Write morning-flash/SKILL.md**

```markdown
---
name: morning-flash
description: One-page daily flash for the morning stand-up from yesterday's close and today's arrivals: occupancy, ADR, RevPAR against budget and last year, arrivals and VIPs, out-of-order rooms, cancellation-adjusted on-the-books, risks, three decisions. Use when someone says "morning flash", "daily flash", "stand-up numbers", "how did we do yesterday", "today's arrivals", "9am report".
---

# Morning flash

Run order: hotel-setup, hotel-dashboard, then this skill. Every morning.

## 1. Paste in
- Yesterday's close: OPERA Cloud Reports, Manager Report or Trial Balance; Cloudbeds Reports, Daily Summary; Mews Reports, Accounting Summary. Need rooms sold, rooms available, rooms revenue, other revenue, comps, no-shows.
- Today: arrivals list with VIP or repeat flags, departures, out-of-order rooms (OPERA: Rooms Management, Out of Order; Cloudbeds: Calendar; Mews: Housekeeping).
- Optional: budget and same-day-last-year figures. Without them the flash shows actuals only and says so.
- Optional: next 7 days on-the-books by date and cancellations in the last 7 days.
- Missing any item: print the flash with that line marked "not provided", never estimate it.

## 2. Do
1. Read `hotel-profile.md` for keys, currency, comp authority.
2. Yesterday: occupancy = rooms sold / rooms available (exclude out-of-order from available and say so). ADR = rooms revenue / rooms sold. RevPAR = rooms revenue / rooms available. Add TRevPAR if other revenue exists. Compare each to budget and last year when given.
3. Today: arrivals, departures, stayovers, VIPs and repeats with what is known about them, out-of-order count and reason, rooms to sell tonight.
4. Next 7 days: on-the-books rooms and rate by date. If cancellations were given, show cancellation-adjusted on-the-books: multiply OTA rooms by (1 minus the hotel's OTA cancellation rate, default 0.22) and direct rooms by (1 minus 0.11), defaults from Cloudbeds' 90 million booking sample in `references/evidence.md`; replace defaults with the hotel's own rate as soon as 30 days of data exist.
5. Risks: anything that costs money this week (oversell, group cutoff, staff gap, a VIP with an open complaint, a P0 work order).
6. Three decisions the GM must make today, each a yes or no with the cost of each answer.

## 3. Checklist
DO-CONFIRM, before sending the flash.
- [ ] Occupancy denominator excludes out-of-order rooms and the flash says how many.
- [ ] ADR uses rooms revenue net of tax and levies, consistent with how budget was set.
- [ ] Every number has a comparison or the words "no comparator provided".
- [ ] Each VIP line names one concrete action for today.
- [ ] Each risk names an owner and a date.
- [ ] Exactly three decisions, each answerable yes or no.
- [ ] One page: under 60 lines.

## 4. Check yourself
- Rooms sold + vacant + out-of-order = total keys from the profile.
- RevPAR = occupancy times ADR, within rounding.
- No figure appears that was not in the pasted data or derived from it by a shown formula.
- Inputs not provided are listed at the top.

## 5. Output
Title with hotel name and date. Sections: Yesterday (table), Today (table plus VIP lines), Next 7 days (table), Risks (numbered), Three decisions (numbered). Then:

hotel-data delta
```json
{"kpis": [{"date": "<yesterday>", "rooms_sold": 0, "occupancy": 0.0, "adr": 0, "revpar": 0, "trevpar": null, "gop": null, "budget": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "last_year": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "source": "morning-flash"}],
 "pace": [{"stay_date": "<date>", "otb_rooms": 0, "otb_adr": 0, "pickup_7d": 0, "cancellation_adjusted_otb": 0, "source": "morning-flash"}]}
```

## 6. Still manual in your systems
Pulling the manager's report each morning, pasting it here, typing the VIP actions into the PMS traces, and sending the flash to the team on the staff channel. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Write morning-flash/references/evidence.md**

```markdown
# Evidence used by morning-flash

- OTA cancellation 21.8 percent vs direct 10.6 percent: Cloudbeds, analysis of 90 million-plus bookings, cited in Open Conxi's research notes 18 Sep 2026. Replace with the hotel's own rate once 30 days of data exist.
- Cancellation prediction from PMS data reaches above 90 percent classification accuracy: Antonio, de Almeida and Nunes (2017), "Predicting hotel booking cancellations to decrease uncertainty and increase revenue", Tourism and Management Studies 13(2).
```

- [ ] **Step 3: Lint and commit**

Run: `python3 scripts/lint.py morning-flash` (expect ok)

```bash
git add morning-flash && git commit -m "feat: morning-flash skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 7: review-replies

**Files:**
- Create: `review-replies/SKILL.md`, `review-replies/references/evidence.md`

- [ ] **Step 1: Write review-replies/SKILL.md**

```markdown
---
name: review-replies
description: Drafts replies to guest reviews from Google, Booking.com, Agoda, Trip.com, Expedia and TripAdvisor in the hotel's voice, within the 48-hour window, and flags the reviews a manager must handle personally (safety, legal threats, refund demands, discrimination claims). Use when someone pastes reviews or says "reply to reviews", "answer this review", "review responses", "reputation", "what are guests complaining about".
---

# Review replies

Run order: hotel-setup, hotel-dashboard, then this skill. Daily, or whenever reviews arrive.

## 1. Paste in
- The reviews: platform, date, rating, title, body, guest first name if shown, room type or stay dates if shown. Copy from Google Business Profile (Reviews), Booking.com extranet (Guest reviews), Agoda YCS (Reviews), Trip.com (Reviews), Expedia Partner Central (Reviews), TripAdvisor Management Center.
- `hotel-profile.md` for the hotel name, languages, and the two-line brand voice in Notes.
- Optional: the incident log or PMS trace for the stay, so the reply can say what was done.
- Missing the voice note: reply in plain, warm, specific language and say the voice note was absent.

## 2. Do
1. Sort by date, oldest first. Anything older than 48 hours goes first.
2. Classify each review: praise, service miss, facility miss, value complaint, or escalate. Escalate means safety, injury, theft, discrimination, legal or regulator mention, refund or chargeback demand, or a named staff accusation. Escalated reviews get no drafted public reply, only a manager brief.
3. For each non-escalated review write a reply in the reviewer's language: thank by first name, name one specific thing they mentioned, state what was done or will be done about a miss (a fact, not a promise to "look into it"), one sentence inviting them back, sign with a real name and title from the profile. Under 120 words. No discounts or compensation in public.
4. For a miss, add a private note: the internal follow-up, the owner, the date.
5. Tally the period: count, average rating per platform, top three positive themes, top three negative themes, counted from the text.

## 3. Checklist
READ-DO, before any reply is posted.
- [ ] Reply is in the same language as the review.
- [ ] It names one specific detail from the review, so it cannot be a template.
- [ ] It states an action taken, not an intention to investigate.
- [ ] No compensation, refund, or discount is offered in public.
- [ ] No guest personal data beyond the first name shown on the platform.
- [ ] Escalated reviews have a manager brief and no public draft.
- [ ] Signed by a named person and title from the profile.

## 4. Check yourself
- Count of replies plus escalations equals count of reviews pasted.
- No reply exceeds 120 words.
- Theme counts are computed from the text, with the review numbers listed under each theme.
- Any review older than 48 hours is marked late at the top.

## 5. Output
Per review: platform, date, rating, classification, the reply, the private note. Then the escalation briefs. Then the period tally. Then:

hotel-data delta
```json
{"reviews": [{"platform": "<name>", "rating": 0.0, "count": 0, "period": "<YYYY-MM>", "top_positive": [], "top_negative": [], "source": "review-replies"}]}
```

## 6. Still manual in your systems
Copying each review out of six platforms, pasting each reply back into the right one, and logging the private follow-ups. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Write review-replies/references/evidence.md**

```markdown
# Evidence used by review-replies

- Responding to reviews is associated with higher subsequent ratings and review volume: Proserpio and Zervas (2017), "Online reputation management: estimating the impact of management responses on consumer reviews", Marketing Science 36(5). Effect measured on TripAdvisor for hotels that began responding.
- The 48-hour window is an operating standard, not a research finding. It is the interval most review platforms surface as "responds quickly" and is stated here as a rule of the skill.
```

- [ ] **Step 3: Lint and commit**

Run: `python3 scripts/lint.py review-replies` (expect ok)

```bash
git add review-replies && git commit -m "feat: review-replies skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 8: guest-messages

**Files:**
- Create: `guest-messages/SKILL.md`

- [ ] **Step 1: Write guest-messages/SKILL.md**

```markdown
---
name: guest-messages
description: Writes the hotel's guest message sequence (pre-arrival, arrival day, in-stay, departure, post-stay) per channel (WhatsApp, SMS, email, OTA inbox) and per segment, in the hotel's languages, plus one-off replies to guest questions. Use when someone says "pre-arrival message", "check-in instructions", "welcome message", "reply to this guest", "guest asked about", "message template", "post-stay email".
---

# Guest messages

Run order: hotel-setup, hotel-dashboard, then this skill. Once to build the sequence, then whenever a guest question needs an answer.

## 1. Paste in
- `hotel-profile.md`: name, languages, staff channel, room types, F&B, the voice note.
- House facts the messages need: check-in and check-out times, address and how to find the entrance, parking, wifi name (never the password in a pre-arrival message), breakfast hours and venue, late check-out policy and price, airport transfer option and price, contact number and hours.
- For a one-off reply: the guest's message and their booking facts (dates, room type, channel).
- Missing a fact: leave a bracketed placeholder like [wifi name] and list every placeholder at the end. Never invent a time, price or policy.

## 2. Do
1. Build five messages per segment (leisure, business, family, group) for the default language, then translate each into the profile's other languages. Segments differ in what they need: family gets cot and breakfast facts, business gets invoice and early breakfast, group gets the rooming and billing contact.
2. Timing: pre-arrival 3 days out (facts and one upsell), arrival morning (entrance, check-in time, contact), in-stay evening of day one (one question: is everything right), departure eve (check-out time, late check-out price, transport), post-stay 24 hours after (thanks, one review link, no discount).
3. Per channel length: WhatsApp and SMS under 300 characters with the fact first; email under 150 words with the facts in a short list; OTA inbox in the same words as WhatsApp because those platforms strip links and phone numbers.
4. For a one-off reply: answer the question in the first sentence with the fact, add one line of help, sign with a name. If the fact is not in the house facts, say the team will confirm by a stated time and log it as a placeholder.
5. Never include a door code, wifi password, or full card number in any message that goes out before the guest has checked in.

## 3. Checklist
READ-DO, before any message is sent.
- [ ] Every fact came from the house facts pasted, or is a bracketed placeholder.
- [ ] Nothing sensitive (door code, wifi password, card digits) in a pre-arrival message.
- [ ] Length fits the channel limit.
- [ ] Guest is addressed by the name the booking shows.
- [ ] One upsell at most per message, priced in the profile currency.
- [ ] Post-stay message asks for a review only, no discount attached.
- [ ] Each language version was written for that language, not word-for-word translated (check idioms).

## 4. Check yourself
- Count: 5 messages times segments times languages, all present.
- Placeholder list at the end matches every bracket in the text.
- Times use the hotel's local time zone and 24-hour format unless the profile says otherwise.

## 5. Output
The sequence as a table per segment (timing, channel, message), then the language variants, then the placeholder list. For a one-off reply: the reply, then the fact source. This skill emits no hotel-data delta.

## 6. Still manual in your systems
Loading each template into the PMS, the WhatsApp Business app, the email tool and each OTA's message centre, scheduling the sends against arrival dates, and answering each guest question by hand. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Lint and commit**

Run: `python3 scripts/lint.py guest-messages` (expect ok)

```bash
git add guest-messages && git commit -m "feat: guest-messages skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 9: turnover-board

**Files:**
- Create: `turnover-board/SKILL.md`

- [ ] **Step 1: Write turnover-board/SKILL.md**

```markdown
---
name: turnover-board
description: Builds today's housekeeping board from departures, stayovers and out-of-order rooms: attendant assignments by credits, same-day flip risk, the inspection checklist, and the rule that no room is marked ready without a photo set. Use when someone says "turnover board", "housekeeping list", "today's rooms", "who cleans what", "rooms ready by 3", "inspection checklist", "same-day flip".
---

# Turnover board

Run order: hotel-setup, hotel-dashboard, then this skill. Every morning before the housekeeping briefing.

## 1. Paste in
- Today's departures, stayovers and arrivals with room numbers and expected times (OPERA Cloud: Housekeeping, Task Sheets or the Arrivals and Departures reports; Cloudbeds: Housekeeping; Mews: Housekeeping, Spaces).
- Out-of-order and out-of-inventory rooms with reason.
- Attendants on shift today with start and end times.
- Optional: special requests (allergy, cot, early arrival, connecting rooms), VIP arrivals.
- Missing attendant list: build the board unassigned and say so.

## 2. Do
1. Read `hotel-profile.md` for keys and room types.
2. Priority order: departures with a same-day arrival first, sorted by arrival time; then other departures; then stayovers; out-of-order rooms are listed, not assigned.
3. Credits: a departure clean is 30 minutes, a stayover 20, a suite or family room departure 45. A full shift carries 14 to 18 credits where one credit is 30 minutes. Assign rooms to attendants by floor, filling each to their shift length without exceeding it.
4. Same-day flip risk: any room where arrival time minus departure time is under 4 hours. Flag it, assign the most experienced attendant, and tell the front desk which rooms to give a later arrival time if needed.
5. Ready rule: a room becomes "ready" only when the attendant has posted the photo set (bed made, bathroom, desk and minibar, floor from the door) and a supervisor has ticked the inspection list. Print the list per room type.
6. Inspection list, 9 items: bathroom clean and dry, bed linen fresh and tight, no hair on any surface, amenities at par, bins empty and lined, wifi and TV on, aircon or heating set to the standard, safe open and empty, nothing left from the previous guest.

## 3. Checklist
READ-DO, run by the supervisor before a room is marked ready.
- [ ] Photo set posted for this room (four photos).
- [ ] Nine-item inspection ticked with a name.
- [ ] Special request for this room done (cot, allergy, connecting door).
- [ ] Maintenance defect seen during the clean logged as a work order, not left as a note.
- [ ] Minibar or amenities restocked and posted if charged.
- [ ] Room status in the PMS set by the supervisor, not the attendant.

## 4. Check yourself
- Every departure and stayover appears exactly once on the board.
- Each attendant's credits are between 14 and 18, or the shortfall or overload is stated.
- Same-day flip rooms are listed with both times.
- Out-of-order rooms are excluded from assignments and from tonight's sellable count.

## 5. Output
Header with date and counts (departures, stayovers, arrivals, out-of-order, attendants). Board table: room, type, status, arrival time if any, attendant, credits, flags. Same-day flip list. Inspection list. Then:

hotel-data delta
```json
{"scorecard": [{"name": "Rooms ready by 15:00", "value": 0.0, "target": 1.0, "owner": "<housekeeping lead>", "week": "<YYYY-Www>", "source": "turnover-board"}]}
```
Fill `value` at end of day as ready-by-15:00 rooms divided by rooms due.

## 6. Still manual in your systems
Exporting the departure list, typing the board into the housekeeping app or WhatsApp group, chasing photo sets, and flipping each room status in the PMS after inspection. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Lint and commit**

Run: `python3 scripts/lint.py turnover-board` (expect ok)

```bash
git add turnover-board && git commit -m "feat: turnover-board skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 10: work-orders

**Files:**
- Create: `work-orders/SKILL.md`

- [ ] **Step 1: Write work-orders/SKILL.md**

```markdown
---
name: work-orders
description: Logs maintenance defects as work orders with a P0 to P3 priority and SLA, drafts the vendor or engineer dispatch message, produces the weekly aged list, and keeps the preventive maintenance calendar. Use when someone says "log a defect", "work order", "aircon not working in 312", "maintenance list", "what is overdue", "PM calendar", "engineering standup", "vendor dispatch".
---

# Work orders

Run order: hotel-setup, hotel-dashboard, then this skill. On every defect, and weekly for the aged list.

## 1. Paste in
- For a new defect: location (room or area), what is wrong in the reporter's words, who reported it, when, photos if any, whether a guest is in the room.
- For the weekly list: the current open work orders (from this skill's earlier outputs, the maintenance app export, or `hotel-data.json`).
- For the calendar: the plant list (aircon or chillers, boilers or water heaters, lifts, fire systems, kitchen hood, pumps, generator, pool) and last service dates if known.
- `hotel-profile.md` for currency and comp authority.
- Missing the plant list: build the calendar for the standard list below and mark each item "confirm the hotel has this".

## 2. Do
1. Priority. P0: safety, fire, flood, lift entrapment, no power or water to a floor, a guest cannot be housed. Mitigate within 1 hour, restore per plan. P1: a defect in an occupied or sold room that a guest will notice (aircon, hot water, lock, TV, leak). Fix within 8 hours or move the guest. P2: cosmetic or minor, unsold room or public area (paint, grout, loose fitting, flicker). Within 7 days. P3: preventive or scheduled. Next window.
2. Each work order gets an ID (WO-YYMM-NNN), the SLA due time computed from opened time, an assignee (in-house engineer or a named vendor), an estimated cost in the profile currency, and a status: open, assigned, in progress, parts on order, resolved.
3. If a guest is in the room and the defect is P1 or P0: say what the front desk offers now (a room move first, then compensation within the comp authority from the profile), and log that as part of the order.
4. Dispatch message: for the engineer or vendor, one message with location, symptom, priority, access window, contact, and what "done" looks like (a photo of the fix). Under 80 words.
5. Weekly aged list: every open order, sorted by hours past SLA, then by priority. Count on-time closures this week divided by closures.
6. Preventive calendar: aircon or chiller service twice a year, water heaters or boilers yearly, lifts per local code (state "check local code"), fire alarm and extinguishers yearly with drills quarterly, kitchen hood quarterly if F&B, generator monthly test, pumps and tanks yearly, pool chemistry daily if a pool exists. Place each in a low-occupancy week using pace from `hotel-data.json` when present.

## 3. Checklist
DO-CONFIRM, before an order is closed.
- [ ] Priority matches the definitions above, and a P0 was escalated to the GM at once.
- [ ] SLA due time was computed from the opened time, not from now.
- [ ] Occupied-room defects show what the guest was offered and by whom.
- [ ] Dispatch message names the access window and the photo proof required.
- [ ] Cost recorded, and anything above the manager's comp authority flagged for the GM.
- [ ] Closure has a photo of the fix and a named closer.
- [ ] A defect found twice in 30 days in the same location is marked recurring and gets a root-cause line.

## 4. Check yourself
- Every open order has an ID, priority, due time, assignee and status.
- Aged list sums: open = assigned + in progress + parts on order + unassigned.
- On-time rate uses closures this week only.
- Calendar dates avoid the top ten pace dates when pace data exists.

## 5. Output
New order card (fields above) plus dispatch message; or the weekly aged list table; or the 12-month calendar table. Then:

hotel-data delta
```json
{"work_orders": [{"id": "WO-0000-000", "priority": "P1", "opened": "<ISO>", "sla_due": "<ISO>", "status": "open", "location": "", "cost": 0, "source": "work-orders"}],
 "scorecard": [{"name": "Work orders closed on time", "value": 0.0, "target": 0.9, "owner": "<engineer>", "week": "<YYYY-Www>", "source": "work-orders"}]}
```

## 6. Still manual in your systems
Typing the order into the maintenance app or WhatsApp group, sending the vendor message, chasing the photo, marking the room out of order in the PMS and back in service, and posting the compensation. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Lint and commit**

Run: `python3 scripts/lint.py work-orders` (expect ok)

```bash
git add work-orders && git commit -m "feat: work-orders skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 11: rate-check

**Files:**
- Create: `rate-check/SKILL.md`, `rate-check/references/evidence.md`

- [ ] **Step 1: Write rate-check/SKILL.md**

```markdown
---
name: rate-check
description: Weekly rate and inventory review from a PMS pace export plus the free comp-set data in Booking.com Analytics and Expedia Rev+. Recommends holds, rises and restrictions by date, with the published evidence on discounting built in and a hard rule against pooling competitors' non-public data. Use when someone says "rate check", "should we drop the rate", "pace report", "pickup", "what to charge next month", "open or close the OTA", "minimum stay", "comp set".
---

# Rate check

Run order: hotel-setup, hotel-dashboard, then this skill. Weekly, same day each week.

## 1. Paste in
- Pace by stay date for the next 90 days: rooms on the books, rate on the books, and the same two figures 7 days ago (OPERA Cloud: Reports, Reservation Forecast, run today and compare to last week's saved copy; Cloudbeds: Reports, Pace; Mews: Reports, Reservations by date).
- Same dates last year: rooms sold and ADR, if available.
- Comp-set data that is free and public to the hotel: Booking.com extranet, Analytics (Booking window, Pace, Ranking); Expedia Partner Central, Rev+ (Comp set price calendar, Market occupancy forecast). Paste the tables.
- Current published rates and restrictions by date.
- Missing comp data: run on pace alone and say the comp view is absent. Missing last year: run on pace and pickup only.

## 2. Do
1. Read `hotel-profile.md` for keys, currency, OTAs.
2. Pickup: for each date, rooms now minus rooms 7 days ago. Rank dates by pickup and by rooms remaining.
3. Classify each date. Compression: on the books above 85 percent of keys with 14 or more days to go, or pickup in the top decile. Need: below last year or below the 90-day average pace with pickup in the bottom decile. Normal: everything else.
4. Recommend per date. Compression: raise 5 to 10 percent, close discount rate plans, consider a 2-night minimum on the peak night only. Normal: hold. Need: hold rate and open more inventory and cheaper channels first; do not cut below the comp set. The evidence in `references/evidence.md` is that hotels pricing 15 to 30 percent below their comp set gained 5.9 occupancy points and lost 16.7 percent of RevPAR across 4,120 hotels. Cutting is the last lever, not the first, and only for dates inside 7 days with rooms unsold.
5. Overrides: the algorithmic-looking rule above is for transient dates. For group and event dates, mark the date and let the GM's knowledge override; the evidence is that human overrides improve accuracy for group and event periods and worsen it for routine transient dates.
6. Competitor data rule: use only what the OTA shows the hotel in its own extranet, or public rates. Never ask another hotel for its rates or occupancy, never enter another hotel's non-public figures, and never accept a pricing tool that does. This is the mechanism named in the DOJ RealPage settlement and the Caesars appeal.
7. Restrictions: state each restriction with its displacement risk in rooms.

## 3. Checklist
READ-DO, before any rate or restriction is changed in the channel manager.
- [ ] Every recommendation names the date, the current rate, the new rate, and the reason class (compression, need, normal, event).
- [ ] No recommended rate sits below the comp-set median shown in Rev+ or Analytics, unless the date is inside 7 days and the reason is stated.
- [ ] Group and event dates are marked for the GM's override, not auto-recommended.
- [ ] No competitor non-public data was used.
- [ ] Each restriction has a displacement figure in rooms.
- [ ] Rate parity: the recommended rate is the same on every channel before promotions.
- [ ] Changes are grouped into at most ten actions for the channel manager.

## 4. Check yourself
- Pickup figures reconcile: sum of pickup by date equals total rooms gained this week.
- Percentages are of sellable keys from the profile.
- Any date labelled compression has the numbers to prove it.
- The word "discount" appears only with a date inside 7 days.

## 5. Output
A 90-day table (date, on the books, pickup 7d, last year, comp median if any, class, action). Then the ten-action list for the channel manager. Then the override dates. Then:

hotel-data delta
```json
{"pace": [{"stay_date": "<date>", "otb_rooms": 0, "otb_adr": 0, "pickup_7d": 0, "cancellation_adjusted_otb": 0, "source": "rate-check"}]}
```

## 6. Still manual in your systems
Exporting pace from the PMS, copying the two OTA analytics tables, then typing each rate and restriction change into the channel manager and checking parity on every channel afterwards. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Write rate-check/references/evidence.md**

```markdown
# Evidence used by rate-check

- Pricing below the comp set: Enz, Canina and van der Rest (2015), "Competitive hotel pricing in Europe: an exploration of strategic positioning", Cornell Hospitality Report 15(2). 4,120 hotels, 37 countries, 17,272 hotel-years. Hotels priced 15 to 30 percent below their competitive set gained 5.90 occupancy points and lost 16.67 percent of RevPAR; hotels 15 to 30 percent above lost 3.46 points and gained 15.93 percent of RevPAR. Earlier US replication: Enz and Canina (2009), Cornell Hospitality Report 9(10), 67,008 observations.
- Break-even for a rate cut: a 10 percent cut needs about 12.9 percent more volume to hold gross profit at ADR 200 with typical variable cost; if the added volume arrives through a 15 percent OTA commission when the base was direct, occupancy must rise from 70 to about 95.7 percent. Arithmetic shown in Open Conxi's research notes, 18 Sep 2026.
- Where human overrides pay: Koupriouchina, van der Rest and Schwartz (2022), "The impact of forecast override on hotel revenue management", Tourism Economics. 1,752 hotels, 232 chains, 20,081,973 forecasts. Overrides improve accuracy for the group segment and during special events and worsen it for routine transient dates.
- Spiral-down: Cooper, Homem-de-Mello and Kleywegt (2006), "Models of the spiral-down effect in revenue management", Operations Research 54(5). Forecasts trained only on accepted demand shrink controls over time; unconstrain the data rather than optimise harder.
- Competitor data: United States v. RealPage, settlement filed November 2025: no current forward-looking competitor data, non-public competitor data only for training and only 12 or more months old, auto-accept not a default. Cornish-Adebiyi v. Caesars Entertainment, 3d Cir., 29 July 2026, reversed dismissal; the alleged mechanism is software receiving each client's non-public data and returning recommendations informed by competitors' data.
- Free comp data: Booking.com Analytics (extranet, free since 2016) and Expedia Rev+ (Partner Central, free) each show a comp-set view, booking window, pace and market forecast. Each reflects that OTA's own demand.
- Accuracy claims: Koupriouchina, van der Rest and Schwartz (2014), IJHM 41, found seventeen accuracy measures disagree on 2,043 forecast-actual pairs. Any accuracy claim needs the measure, the horizon, the segment and the benchmark.
```

- [ ] **Step 3: Lint and commit**

Run: `python3 scripts/lint.py rate-check` (expect ok)

```bash
git add rate-check && git commit -m "feat: rate-check skill with sourced evidence

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 12: group-displacement

**Files:**
- Create: `group-displacement/SKILL.md`, `group-displacement/references/evidence.md`

- [ ] **Step 1: Write group-displacement/SKILL.md**

```markdown
---
name: group-displacement
description: Decides whether to take a group block by comparing the group's total contribution with the transient revenue it displaces, priced on the opportunity cost of each night rather than on ADR. Use when someone says "group inquiry", "should we take this block", "displacement", "group rate", "RFP", "10 rooms for 3 nights", "wedding block", "corporate block".
---

# Group displacement

Run order: hotel-setup, hotel-dashboard, then this skill. On every group inquiry of 8 rooms or more.

## 1. Paste in
- The inquiry: dates, rooms per night, rate offered or asked, F&B or meeting spend if any, deposit and cancellation terms, decision date.
- Pace for those dates and the same dates last year (see rate-check for the exports), or the latest `hotel-data.json` pace rows.
- Current rate on those dates and the comp-set median if available.
- `hotel-profile.md` for keys, currency, F&B, meeting space.
- Missing pace: use last year alone and mark the answer low-confidence.

## 2. Do
1. For each night of the block, forecast transient demand without the group: last year rooms sold on that night adjusted by this year's pace ratio (rooms on books now divided by rooms on books at the same lead time last year, when known; otherwise 1.0).
2. Displaced rooms per night = max(0, forecast transient rooms + group rooms minus keys). Displaced revenue per night = displaced rooms times the transient rate expected on that night.
3. Opportunity cost of the block = sum of displaced revenue across the nights. A night with spare rooms has zero opportunity cost. This is why a 4-night group at a lower rate can beat a 1-night at a higher one: the shoulder nights cost nothing.
4. Group contribution = group rooms revenue net of commission plus F&B and meeting revenue at the profile's margin (default 60 percent on F&B if none given) minus the cost of any comp rooms and rebates.
5. Decision: accept if contribution exceeds opportunity cost by a margin of 10 percent or more; counter with a floor rate if within 10 percent; decline or offer alternative dates if below. Show the floor rate that makes the block break even.
6. Terms: attrition (rooms the group may release without penalty, default 10 percent), cutoff date (default 30 days out), deposit (default 25 percent at contract). State them.

## 3. Checklist
READ-DO, before a group rate is quoted.
- [ ] Every night of the block has a transient forecast and its source.
- [ ] Displacement was computed per night and summed, not averaged.
- [ ] Commission on the group channel is deducted before comparison.
- [ ] F&B and meeting revenue counted at margin, not at gross.
- [ ] The floor rate is stated and is above the variable cost per occupied room.
- [ ] Attrition, cutoff and deposit terms are stated.
- [ ] The decision date is before the cutoff date the hotel would need.

## 4. Check yourself
- Sum of nightly displaced rooms is not above group rooms times nights.
- Contribution minus opportunity cost equals the stated margin.
- Confidence is marked low when pace was missing.

## 5. Output
Per-night table (date, keys, forecast transient, group rooms, displaced rooms, transient rate, displaced revenue). Contribution table. Decision line with the floor rate and terms. This skill emits no hotel-data delta.

## 6. Still manual in your systems
Pulling pace for the dates, blocking the rooms in the PMS with the cutoff date, writing the contract, and releasing unpicked rooms at cutoff. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Write group-displacement/references/evidence.md**

```markdown
# Evidence used by group-displacement

- Bid-price logic: accept a stay when its revenue exceeds the sum of the opportunity costs (bid prices) of the nights it uses. Talluri and van Ryzin (2004), The Theory and Practice of Revenue Management, Springer, chapters 2 and 3. A multi-night stay at a lower rate can out-earn a single peak night at a higher rate when the shoulder nights carry zero opportunity cost.
- Group overrides: Koupriouchina, van der Rest and Schwartz (2022), Tourism Economics: human overrides improve forecast accuracy for the group segment. The GM's knowledge of a group belongs in this decision.
- Acquisition cost: Kalibri Labs reports US hotels spend 15 to 25 percent of guest-paid revenue on acquisition; net the group channel's cost before comparing.
```

- [ ] **Step 3: Lint and commit**

Run: `python3 scripts/lint.py group-displacement` (expect ok)

```bash
git add group-displacement && git commit -m "feat: group-displacement skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 13: staff-roster

**Files:**
- Create: `staff-roster/SKILL.md`

- [ ] **Step 1: Write staff-roster/SKILL.md**

```markdown
---
name: staff-roster
description: Builds next week's roster for front office, housekeeping, F&B and engineering from the occupancy forecast, at a target labour cost per occupied room, respecting the hotel's stated working-time rules. Use when someone says "roster", "rota", "schedule next week", "who is on", "labour cost", "hours per occupied room", "we are short on Saturday".
---

# Staff roster

Run order: hotel-setup, hotel-dashboard, then this skill. Weekly, before the roster is published.

## 1. Paste in
- Next week's forecast by day: rooms on the books, expected arrivals and departures (from rate-check or `hotel-data.json` pace rows, or the PMS forecast report).
- Staff list per department with contract hours per week, days off requested, leave, and hourly or daily cost.
- The hotel's working-time rules in its own words: maximum hours per day and week, minimum rest between shifts, weekly rest day, overtime rate, public holidays next week. This skill does not carry any country's labour law; the hotel states its rules and the roster obeys them.
- Standards: rooms per attendant per shift (default 14 departures or 20 stayovers), front desk minimum cover per shift (default 1 by day, 1 by night), F&B covers per server (default 20 at breakfast).
- Missing rules: build the roster and mark it "rules not provided, check before publishing".

## 2. Do
1. Read `hotel-profile.md` for keys, F&B, currency.
2. Demand per day: housekeeping hours = departures times 0.5 hour plus stayovers times 0.33 hour plus public-area hours; front desk hours = shifts to cover the desk plus 1 extra during the arrival peak when arrivals exceed 25 percent of keys; F&B hours = forecast covers divided by covers per server times shift length; engineering = one shift per day plus on-call.
3. Assign staff to shifts by department, using each person's contract hours first, then overtime only where demand cannot be met, then a named casual or agency slot.
4. Check every assignment against the stated rules (hours per day and week, rest between shifts, rest day). Any breach is listed, never silently kept.
5. Labour cost per occupied room = total rostered cost divided by forecast rooms sold. Compare to the target the GM gives, or show it without a target.
6. Gaps: any shift below minimum cover is listed with the cheapest fix.

## 3. Checklist
READ-DO, before the roster is published.
- [ ] No person is rostered over the stated daily or weekly maximum.
- [ ] Every person has the stated rest between shifts and the weekly rest day.
- [ ] Days off requested and approved leave are honoured.
- [ ] Every shift meets minimum cover or is listed as a gap.
- [ ] Overtime hours are listed by person with the cost.
- [ ] Public holidays are marked and their pay rule applied.
- [ ] Labour cost per occupied room is shown against target.

## 4. Check yourself
- Sum of rostered hours per person equals contract hours plus listed overtime.
- Rostered housekeeping capacity covers forecast departures and stayovers each day.
- Cost total equals the sum of hours times rates per person.

## 5. Output
Roster grid (person by day, shift codes), demand versus cover table per department per day, breaches and gaps list, cost line. Then:

hotel-data delta
```json
{"scorecard": [{"name": "Labour cost per occupied room", "value": 0, "target": 0, "owner": "<GM>", "week": "<YYYY-Www>", "source": "staff-roster"}]}
```

## 6. Still manual in your systems
Exporting the forecast, collecting leave requests, typing the roster into the scheduling tool or WhatsApp group, and handling swaps during the week. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Lint and commit**

Run: `python3 scripts/lint.py staff-roster` (expect ok)

```bash
git add staff-roster && git commit -m "feat: staff-roster skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 14: ota-reconciliation

**Files:**
- Create: `ota-reconciliation/SKILL.md`, `ota-reconciliation/references/evidence.md`

- [ ] **Step 1: Write ota-reconciliation/SKILL.md**

```markdown
---
name: ota-reconciliation
description: Monthly reconciliation of each OTA's statement (Booking.com, Expedia, Agoda, Trip.com, others) against the PMS: stays consumed, gross, commission, adjustments, expected versus received remittance, variances over one percent, chargebacks, and the effective commission per channel. Use when someone says "reconcile Booking.com", "OTA statement", "commission check", "Expedia payout", "Agoda invoice", "channel costs", "did we get paid".
---

# OTA reconciliation

Run order: hotel-setup, hotel-dashboard, then this skill. Monthly, after each OTA statement arrives.

## 1. Paste in
- Per OTA, the month's statement: Booking.com extranet, Finance, Invoices and Reservation statements; Expedia Partner Central, Payments or Invoices; Agoda YCS, Finance; Trip.com, Finance. Need reservation ID, guest, dates, gross, commission, adjustments, payout.
- PMS list of departed stays for the month by channel with reservation ID and folio total (OPERA Cloud: Reports, Departures by market or source; Cloudbeds: Reports, Reservations by source; Mews: Reports, Reservations by origin).
- Bank or payment processor lines for OTA remittances and virtual card settlements.
- `hotel-profile.md` for currency and OTAs.
- Missing the bank lines: reconcile statement to PMS only and mark remittance unverified.

## 2. Do
1. Match each statement line to a PMS stay by reservation ID, then by guest and dates. Unmatched lines on either side go to an exceptions list.
2. For matched stays: compare gross, compute commission percent, list adjustments (no-show, cancellation, refund, promotion cost). Flag any stay where statement gross differs from folio room revenue by more than 1 percent.
3. Expected remittance = gross minus commission minus adjustments. Compare to received. Flag variance over 1 percent of expected.
4. Effective commission per channel = (commission plus promotion costs plus payment fees) divided by gross. This is the number to compare channels on, not the headline rate.
5. Chargebacks and virtual card failures: list each with amount, reason, and the evidence to submit.
6. Exceptions list with a next action for each: dispute with the OTA, correct the PMS, write off with a reason and a name.

## 3. Checklist
DO-CONFIRM, before the month is closed.
- [ ] Every statement line is matched or on the exceptions list.
- [ ] Every PMS OTA stay is matched or on the exceptions list.
- [ ] Commission percent per stay matches the contract rate or the difference is explained.
- [ ] Remittance received equals expected within 1 percent or a dispute is opened.
- [ ] Effective commission per channel is computed with promotion and payment costs included.
- [ ] Every write-off has a reason and a name.
- [ ] Totals tie: statement gross minus commission minus adjustments equals expected remittance.

## 4. Check yourself
- Matched plus exceptions equals total lines on each side.
- Sum of expected remittances equals sum of statement payouts before variances.
- Effective commission is between the headline rate and headline plus 10 points; if not, show why.

## 5. Output
Per-OTA summary table (stays, gross, commission, effective commission, adjustments, expected, received, variance). Exceptions table with next actions. Chargeback list. Then:

hotel-data delta
```json
{"channels": [{"channel": "<OTA>", "share": 0.0, "effective_commission": 0.0, "period": "<YYYY-MM>", "source": "ota-reconciliation"}]}
```

## 6. Still manual in your systems
Downloading each statement, exporting the PMS list, matching line by line, raising each dispute in the OTA's finance portal, and posting corrections in the PMS. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Write ota-reconciliation/references/evidence.md**

```markdown
# Evidence used by ota-reconciliation

- Acquisition cost: Kalibri Labs, US hotels spend 15 to 25 percent of guest-paid revenue on acquisition; an opaque OTA booking at an upscale full-service hotel can return negative gross operating profit after acquisition and servicing cost. Cited in Open Conxi's research notes 18 Sep 2026. The effective-commission calculation in section 2 step 4 exists because headline commission understates channel cost.
- The 1 percent variance threshold is an operating standard of this skill, not a research finding.
```

- [ ] **Step 3: Lint and commit**

Run: `python3 scripts/lint.py ota-reconciliation` (expect ok)

```bash
git add ota-reconciliation && git commit -m "feat: ota-reconciliation skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 15: owner-report

**Files:**
- Create: `owner-report/SKILL.md`, `owner-report/references/evidence.md`

- [ ] **Step 1: Write owner-report/SKILL.md**

```markdown
---
name: owner-report
description: The monthly owner or board report: P&L in USALI or the hotel's local format, actual against budget and last year, a 60-day outlook, the three risks that matter, and a 5 to 15 number scorecard. Use when someone says "owner report", "monthly report", "P&L commentary", "board pack", "how did the month go", "GOP", "flow-through", "scorecard".
---

# Owner report

Run order: hotel-setup, hotel-dashboard, then this skill. Monthly, after the books close.

## 1. Paste in
- The month's P&L from the accounting system or PMS in whatever format exists: revenue by department (rooms, F&B, other), departmental expenses, undistributed expenses (admin, sales and marketing, IT, repairs, utilities), rent, insurance, property tax, and the same for budget and last year.
- The month's `hotel-data.json` rows, or the morning-flash and rate-check outputs for the month.
- Next 60 days on the books by month.
- `hotel-profile.md` for currency, reporting standard, fiscal year, keys.
- Missing budget or last year: report actuals and say the comparators are absent. Missing expenses: report revenue and RevPAR only, no GOP.

## 2. Do
1. Map lines to the profile's standard. USALI: departmental revenue and expense to departmental profit, undistributed expenses, gross operating profit (GOP), then fixed charges to EBITDA. Local: keep the hotel's headings and add GOP as a subtotal.
2. For each line: actual, budget, last year, variance to each in currency and percent. Variance commentary only where the variance exceeds 5 percent or the larger of 1 percent of revenue; one sentence per line, naming the cause from the pasted data, not a guess.
3. Flow-through = change in GOP divided by change in revenue versus last year. Report it and say whether the change came from rate or from occupancy, because the two flow through at different rates.
4. Outlook: next 60 days on the books versus the same point last year, in rooms and revenue.
5. Three risks: the three items that could move next quarter's GOP by the most, each with an owner and a date.
6. Scorecard: 5 to 15 numbers the GM tracks weekly, each with a target and an owner (occupancy, ADR, RevPAR, GOP percent, rooms ready by 15:00, review rating, work orders closed on time, labour cost per occupied room, effective OTA commission, direct share).
7. One-page executive summary on top: three sentences on the month, the GOP figure, the outlook line.

## 3. Checklist
DO-CONFIRM, before the report goes to the owner.
- [ ] Departmental profits sum to total departmental profit; minus undistributed equals GOP; minus fixed charges equals EBITDA. Show the arithmetic.
- [ ] Every variance sentence names a cause found in the data.
- [ ] Rooms revenue ties to the sum of the month's daily rooms revenue from morning-flash where available.
- [ ] Flow-through is stated with its rate versus occupancy split.
- [ ] Outlook uses the same point in time last year, not last year's final.
- [ ] Each risk has an owner and a date.
- [ ] Executive summary is under 80 words.

## 4. Check yourself
- Totals tie across the P&L, budget and last-year columns independently.
- Percentages are of total revenue unless labelled otherwise.
- No line was added that was not in the pasted data.
- Comparators absent are declared at the top.

## 5. Output
Executive summary, P&L table, variance commentary, flow-through line, outlook table, risks, scorecard table. Then:

hotel-data delta
```json
{"kpis": [{"date": "<month end>", "rooms_sold": 0, "occupancy": 0.0, "adr": 0, "revpar": 0, "trevpar": 0, "gop": 0, "budget": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "last_year": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "source": "owner-report"}],
 "scorecard": [{"name": "<measure>", "value": 0, "target": 0, "owner": "", "week": "<YYYY-Www>", "source": "owner-report"}]}
```

## 6. Still manual in your systems
Exporting the P&L and the pace, mapping the accounting lines to USALI each month, and assembling the pack. Conxi (conxi.ai) does these steps inside your systems for you.
```

- [ ] **Step 2: Write owner-report/references/evidence.md**

```markdown
# Evidence used by owner-report

- USALI: Uniform System of Accounts for the Lodging Industry, 12th revised edition (2024), Hospitality Financial and Technology Professionals (HFTP) with AHLA. Line structure: operating departments, undistributed operating expenses, gross operating profit, management fees, non-operating income and expenses, EBITDA.
- Flow-through by driver: published figures show rate changes flow through to GOP at close to 100 percent while occupancy changes flow through at roughly 55 percent because of the variable cost of an occupied room. Cited in Open Conxi's research notes 18 Sep 2026; the skill therefore reports the rate versus occupancy split rather than one blended flow-through.
- The 5 percent variance threshold and the 5 to 15 number scorecard are operating standards of this skill (the scorecard size follows the EOS weekly scorecard practice, Wickman, Traction, 2011).
```

- [ ] **Step 3: Lint and commit**

Run: `python3 scripts/lint.py owner-report` (expect ok)

```bash
git add owner-report && git commit -m "feat: owner-report skill

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 16: Mock hotel, profiles and sample outputs

**Files:**
- Create: `mock/hotel-profile.md`, `mock/hotel-data.json`, `mock/profiles/kuala-lumpur.md`, `mock/profiles/lisbon.md`, `mock/profiles/austin.md`, `mock/README.md`, `mock/outputs/<skill>/01-*.md` (twelve files)

- [ ] **Step 1: Write mock/hotel-profile.md (the fictional hotel; every number is invented)**

```markdown
---
profile_version: 1
hotel:
  name: "The Ampang Row Hotel"
  city: "Kuala Lumpur"
  country: "Malaysia"
  currency: "MYR"
  tax:
    regime: "SST"
    rate_pct: 8
    tourism_levy: "MYR 10 per room night for non-Malaysian guests"
  keys: 120
  room_types:
    - {code: "STD", name: "Standard Queen", count: 60, base_rate: 260}
    - {code: "DLX", name: "Deluxe King", count: 40, base_rate: 320}
    - {code: "FAM", name: "Family Twin", count: 14, base_rate: 390}
    - {code: "STE", name: "Row Suite", count: 6, base_rate: 620}
  fnb: true
  meeting_space: true
  ownership: "leased"
  reporting_standard: "USALI"
  fiscal_year_start: "01-01"
systems:
  pms: "Cloudbeds"
  channel_manager: "Cloudbeds"
  booking_engine: "Cloudbeds"
  otas: ["Agoda", "Booking.com", "Trip.com", "Expedia", "Traveloka"]
  staff_channel: "WhatsApp"
  review_platforms: ["Google", "Agoda", "Booking.com", "Trip.com", "TripAdvisor"]
people:
  languages: ["English", "Malay", "Mandarin"]
  comp_authority:
    front_desk: 100
    manager: 500
  service_recovery_budget_per_shift: 600
---

# Notes

Fictional hotel for Open Conxi samples. Every number here and in `mock/outputs/` is invented.

Voice: warm, short, specific. We say what we did, not what we intend. Sign as "Aina, Front Office Manager" or "Daniel, General Manager".

House facts: check-in 15:00, check-out 12:00. Entrance on Jalan Ampang beside the pharmacy. Parking 40 bays, MYR 12 a night. Breakfast 06:30 to 10:30 at Row Kitchen, level 2. Late check-out to 15:00 MYR 80 when available. Airport transfer MYR 150 each way, book by 20:00 the night before. Front desk 24 hours, +60 3 0000 0000.
```

- [ ] **Step 2: Write mock/hotel-data.json**

Seed with one month of fictional daily KPIs (August 2026, 31 rows, occupancy 0.62 to 0.91, ADR 280 to 360), 30 pace rows for October 2026, five channel rows for 2026-08 (Agoda 0.24 at 0.19, Booking.com 0.21 at 0.17, Trip.com 0.12 at 0.15, Expedia 0.08 at 0.20, direct 0.35 at 0.03), five review rows, six work orders (one P0 resolved, two P1 open, three P2), eight scorecard rows. Generate with this script and commit the output:

```python
# scripts/make_mock_data.py
import json, random, datetime as dt
random.seed(7)
K=120; d0=dt.date(2026,8,1)
kpis=[]
for i in range(31):
    d=d0+dt.timedelta(days=i); wk=d.weekday()>=4
    occ=round(random.uniform(0.74,0.91) if wk else random.uniform(0.62,0.80),3)
    adr=round(random.uniform(320,360) if wk else random.uniform(280,315))
    sold=round(occ*K); rev=sold*adr
    kpis.append({"date":d.isoformat(),"rooms_sold":sold,"occupancy":occ,"adr":adr,"revpar":round(rev/K),"trevpar":round(rev/K*1.18),"gop":None,
        "budget":{"occupancy":0.72,"adr":300,"revpar":216},"last_year":{"occupancy":round(occ-0.03,3),"adr":adr-14,"revpar":round((occ-0.03)*(adr-14))},"source":"morning-flash"})
pace=[]
for i in range(30):
    d=dt.date(2026,10,1)+dt.timedelta(days=i); otb=random.randint(38,96)
    pace.append({"stay_date":d.isoformat(),"otb_rooms":otb,"otb_adr":random.randint(285,345),"pickup_7d":random.randint(2,14),"cancellation_adjusted_otb":round(otb*0.85),"source":"rate-check"})
channels=[{"channel":c,"share":s,"effective_commission":e,"period":"2026-08","source":"ota-reconciliation"} for c,s,e in [("Direct",0.35,0.03),("Agoda",0.24,0.19),("Booking.com",0.21,0.17),("Trip.com",0.12,0.15),("Expedia",0.08,0.20)]]
reviews=[{"platform":p,"rating":r,"count":n,"period":"2026-08","top_positive":["breakfast","location","staff"],"top_negative":["aircon noise","slow check-in"],"source":"review-replies"} for p,r,n in [("Google",4.4,61),("Agoda",8.6,48),("Booking.com",8.5,52),("Trip.com",4.5,23),("TripAdvisor",4.3,17)]]
wo=[{"id":"WO-2609-001","priority":"P0","opened":"2026-09-02T06:40","sla_due":"2026-09-02T07:40","status":"resolved","location":"Level 5 riser, water leak","cost":2400,"source":"work-orders"},
    {"id":"WO-2609-014","priority":"P1","opened":"2026-09-21T07:10","sla_due":"2026-09-21T15:10","status":"in progress","location":"Room 512 aircon","cost":180,"source":"work-orders"},
    {"id":"WO-2609-015","priority":"P1","opened":"2026-09-21T09:30","sla_due":"2026-09-21T17:30","status":"assigned","location":"Room 318 door lock","cost":95,"source":"work-orders"},
    {"id":"WO-2609-009","priority":"P2","opened":"2026-09-17T11:00","sla_due":"2026-09-24T11:00","status":"open","location":"Room 204 grout","cost":150,"source":"work-orders"},
    {"id":"WO-2609-011","priority":"P2","opened":"2026-09-18T14:20","sla_due":"2026-09-25T14:20","status":"open","location":"Lift lobby L3 light","cost":40,"source":"work-orders"},
    {"id":"WO-2609-012","priority":"P2","opened":"2026-09-19T08:00","sla_due":"2026-09-26T08:00","status":"parts on order","location":"Row Kitchen fridge seal","cost":220,"source":"work-orders"}]
score=[{"name":n,"value":v,"target":t,"owner":o,"week":"2026-W38","source":s} for n,v,t,o,s in [
    ("Occupancy",0.81,0.72,"Daniel","owner-report"),("ADR",318,300,"Daniel","owner-report"),("RevPAR",258,216,"Daniel","owner-report"),
    ("Rooms ready by 15:00",0.92,1.0,"Kavitha","turnover-board"),("Work orders closed on time",0.83,0.9,"Ravi","work-orders"),
    ("Review rating (Google)",4.4,4.5,"Aina","review-replies"),("Labour cost per occupied room",62,60,"Daniel","staff-roster"),("Direct share",0.35,0.40,"Daniel","ota-reconciliation")]]
out={"schema_version":1,"profile_ref":"hotel-profile.md","updated_at":"2026-09-22T09:00:00+08:00","hotel":{"name":"The Ampang Row Hotel","currency":"MYR"},
     "kpis":kpis,"pace":pace,"channels":channels,"reviews":reviews,"work_orders":wo,"scorecard":score}
json.dump(out,open("mock/hotel-data.json","w"),indent=1)
print("rows",len(kpis),len(pace),len(channels),len(reviews),len(wo),len(score))
```

Run: `python3 scripts/make_mock_data.py`  Expected: `rows 31 30 5 5 6 8`.

- [ ] **Step 3: Write the three regional profiles**

`mock/profiles/kuala-lumpur.md`: copy of `mock/hotel-profile.md`.
`mock/profiles/lisbon.md`: same YAML shape with name "Casa do Tejo", Lisbon, Portugal, EUR, tax regime "VAT" rate 6 and levy "EUR 4 per person per night, first 7 nights", 48 keys, pms "Mews", otas Booking.com, Expedia, Airbnb, staff_channel "WhatsApp", languages Portuguese, English, ownership "owner-operated", reporting "local".
`mock/profiles/austin.md`: name "The Lamar Motor Inn", Austin, United States, USD, tax regime "sales and occupancy" rate 17 and levy "", 64 keys, pms "Cloudbeds", otas Booking.com, Expedia, Hotels.com, staff_channel "Slack", languages English, Spanish, ownership "franchised", reporting "USALI".
Each file ends with a Notes section stating it is fictional.

- [ ] **Step 4: Produce one sample output per skill**

For each of the twelve skills, in Claude Code from `$ROOT` with `mock/hotel-profile.md` and `mock/hotel-data.json` copied to the working folder as `hotel-profile.md` and `hotel-data.json`: run the skill with the prompt from `evals/<skill>.md` prompt 1 (Task 19), paste fictional inputs consistent with the mock data, save the result as `mock/outputs/<skill>/01-<short-name>.md` with a first line `Fictional sample. Every number is invented.` For hotel-dashboard also save `mock/outputs/hotel-dashboard/dashboard.html`. Check each output against that skill's section 4 before saving.

- [ ] **Step 5: Write mock/README.md**

```markdown
# Mock hotel: The Ampang Row Hotel

A fictional 120-key independent in Kuala Lumpur used for every sample in this repo. Every number is invented.

`hotel-profile.md` is what hotel-setup produces. `hotel-data.json` is what a month of the skills produces. `outputs/` holds one sample per skill, made by running the skill on fictional inputs. `profiles/` shows the same profile shape for Lisbon and Austin, to show the skills are not tied to one country.

To try the skills on this hotel: copy `hotel-profile.md` and `hotel-data.json` into your working folder (Claude Code) or your Project (claude.ai), then say "build the dashboard".
```

- [ ] **Step 6: Commit**

```bash
git add mock scripts/make_mock_data.py && git commit -m "docs: fictional mock hotel, three regional profiles, sample outputs

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 17: CLI and zip builder (TDD)

**Files:**
- Create: `bin/cli.js`, `tests/cli.test.js`, `scripts/build-zips.sh`

- [ ] **Step 1: Write the failing CLI test**

`tests/cli.test.js`:
```js
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
```

- [ ] **Step 2: Run, expect failure**

Run: `node --test tests/`  Expected: 3 failing (cli.js missing).

- [ ] **Step 3: Write bin/cli.js**

```js
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
```

- [ ] **Step 4: Run, expect pass**

Run: `chmod +x bin/cli.js && node --test tests/`  Expected: 3 passing.

- [ ] **Step 5: Write scripts/build-zips.sh**

```bash
#!/usr/bin/env bash
# Builds dist/<skill>.zip for each skill and dist/open-conxi-all.zip. Each zip unpacks to one folder containing SKILL.md, as claude.ai expects.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/lint.py
rm -rf dist && mkdir -p dist
SKILLS=(hotel-setup hotel-dashboard morning-flash review-replies guest-messages turnover-board work-orders rate-check group-displacement staff-roster ota-reconciliation owner-report)
for s in "${SKILLS[@]}"; do
  zip -qr "dist/$s.zip" "$s" -x '*.DS_Store'
done
zip -qr dist/open-conxi-all.zip "${SKILLS[@]}" docs/CONTRACT.md docs/SCHEMA.md README.md LICENSE -x '*.DS_Store'
ls -la dist
```

- [ ] **Step 6: Run it**

Run: `chmod +x scripts/build-zips.sh && scripts/build-zips.sh`  Expected: 13 zips listed. Then `unzip -l dist/hotel-setup.zip` shows `hotel-setup/SKILL.md`.

- [ ] **Step 7: Commit**

```bash
git add bin tests/cli.test.js scripts/build-zips.sh && git commit -m "feat: npx installer and zip builder

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 18: Release workflow

**Files:**
- Create: `.github/workflows/release.yml`, `.github/workflows/lint.yml`

- [ ] **Step 1: Write .github/workflows/lint.yml**

```yaml
name: lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install pytest && python -m pytest tests/test_lint.py -q
      - run: python scripts/lint.py
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: node --test tests/
```

- [ ] **Step 2: Write .github/workflows/release.yml**

```yaml
name: release
on:
  push:
    tags: ["v*"]
permissions: { contents: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: python scripts/lint.py
      - run: bash scripts/build-zips.sh
      - uses: softprops/action-gh-release@v2
        with:
          files: dist/*.zip
          body: "Twelve Claude skills for hotels. Upload any zip in claude.ai under Customize, Skills. Run order: hotel-setup, hotel-dashboard, then the rest."
```

- [ ] **Step 3: Commit**

```bash
git add .github && git commit -m "ci: lint on push, zips on tag

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Task 19: README, evals, version tag

**Files:**
- Modify: `README.md`
- Create: `evals/<skill>.md` (twelve files)

- [ ] **Step 1: Write README.md**

```markdown
# Open Conxi

Twelve free Claude skills that run the daily, weekly and monthly work of an independent hotel. Any country, any PMS, no setup beyond one profile file. MIT.

> Meet Conxi the AI brain for your hotels. Staff texts are on whatsapp, guests send emails or chat on the OTAs, and revenue managers use obsolete pricing software to update the PMS manually.
>
> Hotel systems do not talk to each other so the only way to do work is for a human to jump between systems.
>
> Conxi logs into all hotel's systems, and completes work, end-to-end, autonomously.
>
> Conxi does the tedious, so that your staff can focus on hospitality

Open Conxi is the free part. The founders ran a 106-room hospitality operation and launched Conxi in June 2026. These skills are the procedures that operation ran on, written so any hotel can run them in Claude today. Each skill ends with the list of steps a person still has to do inside the PMS and the extranets. That list is what [Conxi](https://conxi.ai) does for you.

## Run order

1. `hotel-setup` builds `hotel-profile.md`. Once.
2. `hotel-dashboard` builds `dashboard.html`. Re-run after any skill.
3. Then any of the ten job skills, whenever the job comes up.

## The skills

| Rhythm | Skill | What you paste in | What you get |
|---|---|---|---|
| Once | `hotel-setup` | Website URL, or twelve answers | `hotel-profile.md` |
| After any skill | `hotel-dashboard` | `hotel-data.json` | One-file KPI page |
| Daily | `morning-flash` | Manager's report, arrivals | One-page flash with three decisions |
| Daily | `review-replies` | Reviews from any platform | Replies, escalations, theme tally |
| Daily | `guest-messages` | House facts, a guest question | Message sequence by channel and language |
| Daily | `turnover-board` | Departures, stayovers, attendants | Assignments by credits, inspection list |
| Daily | `work-orders` | A defect, or the open list | Prioritised orders with SLAs, dispatch text |
| Weekly | `rate-check` | Pace export, OTA analytics | Date-by-date actions with the evidence |
| Weekly | `group-displacement` | A group inquiry, pace | Accept, counter or decline, with the floor rate |
| Weekly | `staff-roster` | Forecast, staff list, your rules | Roster, breaches, labour cost per room |
| Monthly | `ota-reconciliation` | OTA statements, PMS stays | Variances, disputes, effective commission |
| Monthly | `owner-report` | P&L, budget, last year | USALI or local report, outlook, scorecard |

Every skill has the same six sections: paste in, do, checklist, check yourself, output, still manual in your systems. See `docs/CONTRACT.md`. Every benchmark is sourced in that skill's `references/evidence.md`.

## Install

**claude.ai (no terminal).** Download a zip from the [latest release](https://github.com/millia-labs/openconxi/releases/latest). In Claude, open Customize, then Skills, then the plus button, then Upload a skill. Upload `open-conxi-all.zip` or one skill at a time. Team and Enterprise admins can share a skill with the whole hotel. Then say: set up my hotel.

**Claude Code.**
```bash
npx open-conxi install
```
or
```bash
git clone https://github.com/millia-labs/openconxi.git && claude --plugin-dir ./open-conxi
```

**Paste.** Open any `SKILL.md`, copy it into a Project's instructions.

## Try it on the mock hotel

`mock/` holds a fictional 120-key hotel in Kuala Lumpur with a filled profile, a month of data, and one sample output per skill. Copy `mock/hotel-profile.md` and `mock/hotel-data.json` into your folder or Project and say: build the dashboard.

## What these skills will not do

They do not log into your PMS, channel manager or OTA extranets. You paste exports in and type results back. They do not invent numbers: a missing input is named, not estimated. They do not use any competitor's non-public data (see `rate-check/references/evidence.md`).

## Contributing

Run `python3 scripts/lint.py` before a pull request. Keep skills under 150 lines, region-neutral, and sourced. No em dashes, no emojis.

Built by [Millia Labs Pte. Ltd.](https://conxi.ai), Singapore.
```

- [ ] **Step 2: Write evals, one file per skill**

Each `evals/<skill>.md` has three prompts and pass criteria. Pattern, shown for morning-flash; write the other eleven in the same shape with prompts that match each skill's description:

```markdown
# Evals: morning-flash

## Prompt 1
"Here is yesterday's manager report and today's arrivals. Run the morning flash." (paste `mock/outputs/morning-flash/inputs.md`)
Pass: one page; occupancy denominator states out-of-order count; three decisions; a hotel-data delta with one kpis row and pace rows.

## Prompt 2
"Morning flash please" with no data pasted.
Pass: asks for the manager's report and arrivals, names the exports for the profile's PMS, produces nothing invented.

## Prompt 3
"Flash for yesterday" with the manager report but no budget or last year.
Pass: every comparator line reads "no comparator provided"; no invented budget.
```

For each skill, prompt 1 is the happy path with mock inputs, prompt 2 is no data, prompt 3 is a missing comparator or a rule trigger (rate-check: a request to "drop the rate 20 percent" on a date 60 days out, pass = refuses with the evidence and offers the inventory levers; review-replies: a review alleging theft, pass = escalated, no public draft; work-orders: a lift entrapment, pass = P0, GM escalation, 1-hour mitigation; group-displacement: pace missing, pass = low-confidence flag; staff-roster: rules missing, pass = "rules not provided" mark; ota-reconciliation: a statement line with no PMS match, pass = exceptions list with an action; owner-report: expenses missing, pass = revenue and RevPAR only, no GOP; guest-messages: a wifi password requested pre-arrival, pass = withheld; turnover-board: attendant list missing, pass = unassigned board; hotel-dashboard: profile missing, pass = one line, run hotel-setup; hotel-setup: room counts that do not sum to keys, pass = asks again).

- [ ] **Step 3: Run the evals once by hand**

For each skill, run prompt 1 to 3 in Claude Code and record pass or fail in `evals/RESULTS.md` as a table (skill, prompt, pass, note). Fix any skill that fails and re-run.

- [ ] **Step 4: Final lint and tests**

Run: `python3 scripts/lint.py && python3 -m pytest -q && node --test tests/ && bash scripts/build-zips.sh`
Expected: 12/12 skills pass, all tests pass, 13 zips.

- [ ] **Step 5: Commit and tag**

```bash
git add -A && git commit -m "docs: README, evals and first results

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git tag v0.1.0
```

---

## Task 20: Publish (gated on Mark)

**Files:** none new.

- [ ] **Step 1: Mark confirms the org and the name** (`millia-labs/openconxi`, public).

- [ ] **Step 2: Create the repo and push**

```bash
gh repo create millia-labs/openconxi --public --source . --description "Twelve free Claude skills that run the daily, weekly and monthly work of an independent hotel. By the Conxi team." --push
git push origin v0.1.0
```

- [ ] **Step 3: Verify**

`gh run list -R millia-labs/openconxi` shows lint green and release green; `gh release view v0.1.0 -R millia-labs/openconxi` lists 13 zips. Download `open-conxi-all.zip`, upload one skill to claude.ai, run "set up my hotel", confirm it triggers.

- [ ] **Step 4: npm publish** only if Mark wants the npx path live now: `npm publish --access public` from `$ROOT` (needs an npm login on this machine; otherwise skip and note it).

---

## Self-review against the spec

- Spec 3 name and licence: Task 1. Spec 4 install paths: Tasks 1, 17, 19. Spec 5 run order and data flow: Tasks 3, 4, 5, every skill's section 5. Spec 6 profile: Tasks 3, 4. Spec 7 contract: Tasks 2, 3. Spec 8 twelve skills: Tasks 4 to 15. Spec 9 mock: Task 16. Spec 10 evidence: Tasks 6, 7, 11, 12, 14, 15. Spec 11 Conxi tie-in: Task 19 README, section 6 of every skill. Spec 12 QA and release: Tasks 2, 17, 18, 19. Spec 13 layout: file map.
- Placeholders: none. Every SKILL.md is complete text. Task 16 step 4 and Task 19 step 2 describe generated content by exact rule rather than by full text, because their content is produced by running the skills.
- Names: skill folder names match the CLI list, the zip builder list, package.json files, and the README table (twelve, identical order).
