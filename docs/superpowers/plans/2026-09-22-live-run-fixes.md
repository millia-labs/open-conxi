# Live-run fixes (v0.1.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 13 findings in `evals/live-2026-09-22/RESULTS.md` and prove each fix with a live re-run.

**Architecture:** All fixes are skill text (SKILL.md, references, docs). Two rules become canonical lines enforced by the lint so they cannot drift across twelve files: the output-rules line and the saving line. Everything else is a targeted rule change inside one skill.

**Tech Stack:** Markdown skills, Python lint + pytest, the live harness in the session scratchpad (claude --print, project settings only, Sonnet 5).

---

### Task 1: Lint enforces two canonical lines (test first)
**Files:** Modify `scripts/lint.py`, `tests/test_lint.py`.
- [ ] Step 1: add tests. (a) a skill whose `- Output rules:` line differs from `OUTPUT_RULES` fails with "output rules line differs"; (b) a job skill with a line `hotel-data delta` in section 5 and no `SAVING` line fails with "saving line missing"; (c) the good fixture still passes (it has neither line).
- [ ] Step 2: run pytest, see (a) and (b) fail.
- [ ] Step 3: add constants `OUTPUT_RULES` and `SAVING` and the two checks to `lint()`. hotel-setup and hotel-dashboard are exempt from (b).
- [ ] Step 4: pytest passes; `python3 scripts/lint.py` now fails on all twelve skills (old line). Expected.

Canonical output rules (every skill, section 4):
`- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; before replying, search the whole reply for long or short dash characters (wider than a hyphen) and replace each with a comma, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.`

Canonical saving line (every delta-emitting job skill, section 5, after the delta):
`Saving: in Claude Code, merge this delta into hotel-data.json in the working folder before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). Say how many rows were added and replaced, and that hotel-dashboard will now show them. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.`

### Task 2: Apply the two lines (finding 1 and 2)
**Files:** all 12 `*/SKILL.md`.
- [ ] Replace the old output-rules line in all 12 with `OUTPUT_RULES`.
- [ ] Add `SAVING` after the delta block in morning-flash, rate-check, ota-reconciliation, owner-report, review-replies, work-orders, staff-roster, turnover-board.
- [ ] hotel-setup section 4 step 5: "In Claude Code, write hotel-profile.md and hotel-data.json (the skeleton below) to the working folder; in claude.ai, print both for the GM to save."
- [ ] hotel-dashboard section 2 step 1: the file is the source of truth; chat deltas are merged on top and are usually already saved.
- [ ] CONTRACT.md rules 4 and 5 and a new rule 7 (saving) match the canonical lines. Lint green.

### Task 3: morning-flash (findings 4, 6)
- [ ] Step 2: rooms sold excludes complimentary rooms (STR reporting guidelines); show comps on their own line; occupancy and ADR use paid rooms sold; if comps were not stated, say rooms sold is taken as paid.
- [ ] Step 3: rooms left to sell tonight = total keys minus out-of-order tonight minus rooms on the books tonight; show the formula.
- [ ] Checklist item for comps. evidence.md cites the STR guideline with its quote.

### Task 4: group-displacement (finding 3)
- [ ] Step 2: displaced contribution per night = displaced rooms times (transient rate net of the transient acquisition cost, minus variable cost). Acquisition cost = the blended effective commission from hotel-data.json channels if present, else none and the floor is labelled an upper bound.
- [ ] Step 5 floor: (opportunity cost + variable cost for all group room nights + group F&B cost minus F&B and meeting contribution) / group room nights.
- [ ] Worked check in section 4 with the Porto inputs: floor about 161, not 181. evidence.md: bid price is a net figure.

### Task 5: turnover-board (finding 7)
- [ ] Step 1: take each room's type from the pasted room map or PMS list; if not given write "type not given".
- [ ] Step 2a: conflict scan first: any room in two of departures-only, stayovers, arrivals, out-of-order where the pair is impossible (stayover plus arrival, out-of-order plus arrival or stayover) is listed at the top with the fix.

### Task 6: guest-messages, owner-report, staff-roster, work-orders, review-replies, hotel-setup (findings 5, 8 to 13)
- [ ] guest-messages: state guests and rooms as separate counts, copied from the paste.
- [ ] owner-report: effective OTA commission = OTA commission / OTA room revenue; if OTA revenue was not pasted the scorecard row is left out and the text shows "commission as a share of rooms revenue" under that name.
- [ ] staff-roster: every department means every department the profile has (F&B when fnb is true, engineering); agency or casual hours that are unpriced also block the row.
- [ ] work-orders: dispatch in the vendor's language, else the first profile language; unknown occupancy of the room means P1 with "drops to P2 once the room is confirmed unsold".
- [ ] review-replies: replace "say the note has been passed to the named owner" with "say nothing about action; name the problem, apologise, and leave the follow-up to the private note".
- [ ] hotel-setup: fiscal_year_start is MM-DD.

### Task 7: Verify live
- [ ] Bump 0.1.2 (package.json, plugin.json). Lint, pytest, node tests green.
- [ ] Re-run with the same inputs in fresh sessions: setup (2 turns), morning-flash, review-replies, turnover-board, work-orders, guest-messages, group-displacement, staff-roster, owner-report. Then persistence: three job skills in three separate chats, then "refresh the dashboard" in a fourth.
- [ ] Grade each finding pass or fail in `evals/live-2026-09-22/RESULTS.md` under "Re-run after v0.1.2". Anything that fails goes back to its task.
- [ ] Commit, tag v0.1.2, push, confirm release green.
