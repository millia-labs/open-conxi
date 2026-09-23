# Hotel SOPs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 20 standard operating procedures with Open Conxi and make the existing skills and the hotel-routine workflow use them, so every team message and board carries the hotel's own procedure for the situation it flags.

**Architecture:** The 20 SOPs are plain markdown files inside a new 14th skill, `hotel-sops/sops/`. `npx open-conxi sops` (and hotel-setup) copies them into the hotel's folder as `sops/`, never overwriting a file the hotel has edited, so the hotel's copy is the one every skill reads, the same way every skill reads `hotel-profile.md`. Each job skill names the SOPs it follows; hotel-routine attaches the relevant SOP's first steps to a team message whenever a cross-check fires. A lint check enforces the SOP format and that every SOP is used by at least one skill.

**Tech Stack:** Markdown skills, Node built-ins only (fs, path, node:test), Python 3 lint script.

---

## The 20 SOPs

| # | File | Owner | Used by | Core standard it encodes |
|---|---|---|---|---|
| 01 | 01-check-in.md | Front office | guest-messages, morning-flash | Greet within 10 seconds of eye contact; ID matches booking before a key is cut; at the desk under 5 minutes |
| 02 | 02-check-out.md | Front office | guest-messages | Folio reviewed with guest; disputes settled within comp authority; pre-authorisation released same day |
| 03 | 03-room-move-and-walk.md | Duty manager | morning-flash, hotel-routine | Decide by 16:00; never walk a VIP, repeat or multi-night guest; hotel pays the first night elsewhere, transport and one call; guest offered return next day |
| 04 | 04-vip-arrival.md | Duty manager | morning-flash, turnover-board | VIP list at the morning brief; room inspected by a manager 2 hours before arrival; greeted by name; preferences from last stay applied |
| 05 | 05-service-recovery.md | Everyone | review-replies, guest-messages | Listen, empathise, apologise, react, notify; fixed on the spot within comp authority; manager told the same shift |
| 06 | 06-night-audit.md | Night auditor | morning-flash | Room and tax posted, no-shows processed, rate discrepancies listed, manager's report run before 03:00 |
| 07 | 07-key-and-identity.md | Front office | guest-messages | Room number never said aloud; no key without ID or a match to the registered guest; masters signed out and back |
| 08 | 08-departure-clean.md | Housekeeping | turnover-board | Strip, air, bathroom top to bottom, bed, dust, restock, floor, check from the door; 30 minutes for a standard room |
| 09 | 09-stayover-service.md | Housekeeping | turnover-board | Guest belongings tidied, never moved or opened; Do Not Disturb respected, welfare check after 24 hours of no entry |
| 10 | 10-inspect-and-release.md | Housekeeping supervisor | turnover-board, hotel-routine | Nine-item inspection plus four-photo set; supervisor, never the attendant, sets the PMS status to ready |
| 11 | 11-lost-and-found.md | Housekeeping | turnover-board | Logged the same shift, bagged and tagged; valuables in the safe with two signatures; owner confirmed before release |
| 12 | 12-shift-handover.md | Every department | hotel-routine, staff-roster | Written log; every open item has one owner; ends with "Anything I'm assuming someone else has?" |
| 13 | 13-work-order-intake.md | Engineering | work-orders | P0 to P3 by the work-orders definitions; logged before it is fixed; guest told the time it will be fixed |
| 14 | 14-out-of-order-rooms.md | Engineering, front office | work-orders, turnover-board, hotel-routine | Out of order leaves inventory, out of service stays in; a room returns only after engineering and housekeeping sign off |
| 15 | 15-room-preventive-maintenance.md | Engineering | work-orders | Every room once a quarter against a fixed list: aircon filter, drains, sealant, lights, safe, smoke detector test |
| 16 | 16-water-leak.md | Engineering | work-orders, review-replies, hotel-routine | Source isolated within 15 minutes; electrics checked; guest moved per SOP 03; dried within 48 hours to stop mould |
| 17 | 17-daily-rate-review.md | Revenue or GM | rate-check | Pace against last year and pickup since yesterday; no rate cut inside 7 days of arrival without the GM |
| 18 | 18-group-inquiry.md | Sales or GM | group-displacement | Reply within 24 hours; displacement checked first; contract names cutoff date, attrition and deposit |
| 19 | 19-fire-alarm.md | Duty manager | hotel-routine | The hotel's fire plan and local law come first; in-house list and guests needing help printed at once; no lifts |
| 20 | 20-medical-emergency.md | Whoever finds it | hotel-routine | Emergency number first; do not move the person; first aider called; no admission of liability; incident report the same shift |

Sources named in each file: Kasavana, *Managing Front Office Operations* (AHLEI); Kappa, Nitschke and Schappert, *Managing Housekeeping Operations* (AHLEI); Hayes and Ninemeier, *Hotel Operations Management*; USALI 12th edition (out-of-order definitions); Meyer, *Setting the Table*; Gawande, *The Checklist Manifesto*; NFPA 101 and the local fire code; HSMAI revenue management guidance. SOPs 19 and 20 open with: "Your fire plan, your first aid training and local law override this page."

## SOP file format

Every file follows this shape, 60 lines at most, enforced by lint:

```markdown
# SOP 16: Water leak

Owner: chief engineer, and the duty engineer on shift.
Used by: work-orders, review-replies, hotel-routine.
When: any water where it should not be: ceiling, wall, floor, fixture, or a guest report of one.

## Standard
- Source isolated within 15 minutes of the report.
- A guest in the room is offered a move before anything else.
- Area dry within 48 hours; anything wet longer is checked for mould.

## Steps
READ-DO.
1. Ask the reporter where the water is and whether it touches a socket, light or appliance.
2. Send the duty engineer with the isolation key; isolate the room or riser valve at [your hotel: valve locations].
3. If water touches anything electrical, cut that circuit at [your hotel: distribution board] before anyone enters.
4. Guest in the room: offer a move now, follow SOP 03, and log the offer.
5. Contain: buckets, towels, wet floor signs; move guest belongings off the floor with the guest present.
6. Photograph the source, the ceiling or wall, and the floor before cleaning up.
7. Log a P0 work order if it spreads beyond one room or touches electrics, otherwise P1, following SOP 13.
8. Book drying and the root cause fix; the room stays out of order until SOP 14 sign-off.

## Pause point
DO-CONFIRM, before the room is sold again.
- [ ] Source fixed, not only stopped.
- [ ] Ceiling, wall and carpet dry to the touch and to a moisture meter if you have one.
- [ ] No smell of damp; no stain spreading since the last photo.
- [ ] Housekeeping inspection passed (SOP 10).

## Escalate to the GM when
Water reaches a second room or a public area, anything electrical got wet, or a guest's belongings were damaged.

## Your hotel
[your hotel: valve locations] [your hotel: distribution board] [your hotel: drying contractor and number]

## Sources
Hayes and Ninemeier, Hotel Operations Management, maintenance chapter; the work-orders skill P0 and P1 definitions.
```

Required headings, in order: `# SOP NN: `, `Owner:`, `Used by:`, `When:`, `## Standard`, `## Steps`, `## Pause point`, `## Escalate to the GM when`, `## Your hotel`, `## Sources`. Steps: 5 to 9 numbered lines. Pause point: 3 to 5 checkbox lines. `[your hotel: ...]` marks a blank the GM fills in once.

## File map

- Create `hotel-sops/SKILL.md`: the 14th skill. Looks up, adapts and teaches the SOPs.
- Create `hotel-sops/sops/01-check-in.md` to `hotel-sops/sops/20-medical-emergency.md`.
- Create `bin/sops.js`: copies stock SOPs into the hotel folder without overwriting.
- Create `tests/sops.test.js`.
- Modify `bin/cli.js`: add `hotel-sops` to SKILLS, add the `sops` command.
- Modify `scripts/lint.py`: add `lint_sops()`.
- Modify `hotel-setup`, `hotel-routine`, `turnover-board`, `work-orders`, `morning-flash`, `review-replies`, `guest-messages`, `rate-check`, `group-displacement`, `staff-roster` SKILL.md files: one line each naming the SOPs they follow.
- Modify `package.json` (files, version 0.3.0, description "Fourteen"), `.claude-plugin/marketplace.json`, `scripts/build-zips.sh`, `README.md`, `docs/CONTRACT.md`.
- Create `evals/hotel-sops.md`, `mock/outputs/hotel-sops/01-lookup.md`.

---

### Task 1: SOP lint

**Files:**
- Modify: `scripts/lint.py`

- [ ] **Step 1: Add the check after `lint_prose()`**

```python
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
        s2, e2 = e, text.find("## Escalate")
        checks = len(re.findall(r"^- \[ \] ", text[s2:e2], re.M)) if s2 >= 0 and e2 > s2 else 0
        if not 3 <= checks <= 5:
            errs.append(f"{rel}: pause point has {checks} items, need 3 to 5")
        if f"SOP {nn}" not in skills_text:
            errs.append(f"{rel}: no skill names SOP {nn}")
    return errs
```

- [ ] **Step 2: Call it from `main()`** right after the prose block, inside `if not argv:`

```python
        sops = lint_sops()
        for e in sops:
            print(f"     - {e}")
        print("sops ok" if not sops else f"sops FAIL ({len(sops)})")
        bad += bool(sops)
```

- [ ] **Step 3: Run it, expect failure**

Run: `python3 scripts/lint.py`
Expected: `sops FAIL (1)` with "hotel-sops/sops has 0 SOPs, expected 20".

- [ ] **Step 4: Commit**

```bash
git add scripts/lint.py
git commit -m "lint: SOP format check"
```

### Task 2: Write the 20 SOPs

**Files:**
- Create: `hotel-sops/sops/01-check-in.md` to `20-medical-emergency.md`

- [ ] **Step 1: Write SOP 16 exactly as in "SOP file format" above.**
- [ ] **Step 2: Write SOPs 01 to 15 and 17 to 20** in the same format, each carrying the standard from the table in its `## Standard` block, 5 to 9 steps, 3 to 5 pause-point checks, its sources, and `[your hotel: ...]` blanks for anything that differs by property (valve locations, retention period, emergency number, assembly point, comp limits come from hotel-profile.md so are not blanks). SOP 10's nine inspection items are the same nine as `turnover-board/SKILL.md` section 2 step 7, word for word. SOP 13's priorities quote work-orders section 2 step 1. SOP 19 and 20 start their Steps with: "Your fire plan, your first aid training and local law override this page."
- [ ] **Step 3: Run lint**

Run: `python3 scripts/lint.py`
Expected: sops errors are now only "no skill names SOP NN" (20 of them) and prose ok.

- [ ] **Step 4: Commit**

```bash
git add hotel-sops/sops
git commit -m "hotel-sops: 20 SOPs"
```

### Task 3: `npx open-conxi sops`

**Files:**
- Create: `bin/sops.js`, `tests/sops.test.js`
- Modify: `bin/cli.js`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run it, expect failure**

Run: `node --test tests/sops.test.js`
Expected: FAIL, "Cannot find module '../bin/sops.js'".

- [ ] **Step 3: Write `bin/sops.js`**

```js
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
```

- [ ] **Step 4: Wire the command in `bin/cli.js`**

Add `"hotel-sops"` to the end of `SKILLS`. Add to the usage text: `console.log("  sops       copy the 20 SOPs into this folder's sops/ (never overwrites yours)");` Add:

```js
function sops() {
  require("./sops.js").cli();
}
```

and `sops,` to the `fns` object.

- [ ] **Step 5: Run all tests**

Run: `npm test`
Expected: all pass (36 existing + 2 new; update the count assertion in `tests/cli.test.js` from 13 to 14 skills if it asserts one).

- [ ] **Step 6: Commit**

```bash
git add bin/sops.js bin/cli.js tests/sops.test.js tests/cli.test.js
git commit -m "cli: npx open-conxi sops"
```

### Task 4: The hotel-sops skill

**Files:**
- Create: `hotel-sops/SKILL.md`

- [ ] **Step 1: Write the skill** in the six-section contract. Description: "Looks up, adapts and teaches the hotel's 20 standard operating procedures (check-in, walking a guest, VIP arrival, service recovery, night audit, room cleaning and inspection, lost and found, shift handover, work orders, out-of-order rooms, preventive maintenance, water leaks, rate review, group inquiries, fire alarm, medical emergency). Use when someone says "what's our SOP for", "how do we handle", "train a new attendant", "adapt our SOPs", "fill in the SOP blanks", "print the SOPs", "procedure for"." Section 2 steps: (1) read `sops/` in the working folder, or run `npx open-conxi sops` first if it is missing; (2) lookup prints the one SOP asked for, with the profile's comp limits and team names filled in; (3) "adapt" walks the GM through every `[your hotel: ...]` blank, at most twelve questions in one message, and writes the answers into the hotel's copy; (4) "train" turns one SOP into a five-question quiz for a new hire, answers from the SOP only; (5) never changes a standard (a time, a limit, a safety step) unless the GM says to, and SOPs 19 and 20 are never shortened. Checklist of 5 to 9 items, OUTPUT_RULES line, PROFILE line, no delta.
- [ ] **Step 2: Run lint on it**

Run: `python3 scripts/lint.py hotel-sops`
Expected: `ok   hotel-sops`, `1/1 skills pass`.

- [ ] **Step 3: Commit**

```bash
git add hotel-sops/SKILL.md
git commit -m "hotel-sops skill"
```

### Task 5: Wire SOPs into the job skills

**Files:**
- Modify: the ten SKILL.md files listed in the file map.

- [ ] **Step 1: Add one line to each skill's section 2**, before the numbered steps, in this form: `SOPs: follow sops/10-inspect-and-release.md (SOP 10) and SOP 08, 09, 11 from the working folder; the hotel's copy wins over this page if they differ; if sops/ is missing, use this page and say "run npx open-conxi sops to add your SOPs".` The SOP numbers per skill are the "Used by" column of the table above.
- [ ] **Step 2: Name the SOP in the team message where it applies.** turnover-board: a VIP room names SOP 04, an out-of-order room SOP 14. work-orders: a leak names SOP 16 and puts its steps 1 to 3 in the dispatch message; a room made out of order names SOP 14. review-replies: an escalation names SOP 05, a review naming a leak names SOP 16. morning-flash: a VIP booked into an out-of-order room names SOP 03 as the decision to take.
- [ ] **Step 3: hotel-setup step 5:** after writing the profile, run `npx open-conxi sops` and say "Your 20 SOPs are in the sops folder. Say adapt our SOPs to fill in the blanks for your building."
- [ ] **Step 4: hotel-routine step 4, add a cross-check line:** "When a cross-check fires, attach the matching SOP by number and its first three steps to that chat's message: VIP into an out-of-order room SOP 03, a leak SOP 16, a room going out of order SOP 14, a room to release SOP 10. Keep the message under 900 characters; cut the SOP steps before the facts." And to section 5 item 2: "Cross-check fixes, one line each, naming the SOP used."
- [ ] **Step 5: Keep every skill under 150 lines and run lint**

Run: `python3 scripts/lint.py`
Expected: `14/14 skills pass`, `prose ok`, `sops ok`.

- [ ] **Step 6: Commit**

```bash
git add */SKILL.md
git commit -m "skills follow the hotel's SOPs"
```

### Task 6: Packaging and docs

**Files:**
- Modify: `package.json`, `.claude-plugin/marketplace.json`, `scripts/build-zips.sh`, `README.md`, `docs/CONTRACT.md`

- [ ] **Step 1:** `package.json`: add `"hotel-sops/"` to `files`, version `0.3.0`, description starts "Fourteen free Claude skills". marketplace.json: add hotel-sops to the skills list, version 0.3.0. build-zips.sh: add hotel-sops to its skill list.
- [ ] **Step 2:** README: a "Your SOPs" section, four lines: what the 20 are, `npx open-conxi sops`, "adapt our SOPs", and that SOPs 19 and 20 never replace the fire plan or first aid training. CONTRACT.md: rule 9, "A skill that follows an SOP names it by number, reads the hotel's copy in sops/, and never changes a standard in it."
- [ ] **Step 3: Verify the package**

Run: `npm pack --dry-run 2>&1 | grep -c "hotel-sops/sops/"` then `bash scripts/build-zips.sh && unzip -l dist/open-conxi-installer.zip | grep -c "sops/"`
Expected: `20` and at least `20`.

- [ ] **Step 4: Commit**

```bash
git add package.json .claude-plugin/marketplace.json scripts/build-zips.sh README.md docs/CONTRACT.md
git commit -m "0.3.0: package the SOPs"
```

### Task 7: Evals and live QA

**Files:**
- Create: `evals/hotel-sops.md`, `mock/outputs/hotel-sops/01-lookup.md`

- [ ] **Step 1: Write `evals/hotel-sops.md`** with four prompts: (1) "what do we do if a guest's ceiling is leaking" returns SOP 16 with the mock hotel's comp limits; (2) "adapt our SOPs" asks at most twelve questions, all for `[your hotel: ...]` blanks; (3) "make the fire SOP shorter" refuses to drop any step of SOP 19 and says why; (4) "train a new attendant on inspections" gives five questions answerable from SOP 10 only.
- [ ] **Step 2: Live runs.** In a clean folder installed from `npm pack`, with the mock profile and the fake Beeper, run the four evals plus the demo `morning.txt` routine with `claude -p --model sonnet --setting-sources project`. Pass for the routine: the engineering draft names SOP 16 with its first steps, the managers draft names SOP 03 for room 512, every draft under 900 characters, no long dashes in any file or draft.
- [ ] **Step 3: Fix what fails, re-run only the failed cases, save the passing routine output to `mock/outputs/hotel-routine/01-routine.md` and the lookup to `mock/outputs/hotel-sops/01-lookup.md`.**
- [ ] **Step 4: Commit and open the PR** (not merged until Mark says so; npm publish 0.3.0 is Mark's step in a real Terminal because of 2FA)

```bash
git add evals mock
git commit -m "evals: hotel-sops, routine with SOPs"
git push -u origin feat/hotel-sops
gh pr create --title "Open Conxi 0.3.0: 20 hotel SOPs wired into the workflows" --body-file /tmp/pr-body.md
```
