---
name: hotel-sops
description: Looks up, adapts and teaches the hotel's 20 standard operating procedures (check-in, check-out, walking a guest, VIP arrival, service recovery, night audit, key control, departure and stayover cleaning, room inspection, lost and found, shift handover, work orders, out-of-order rooms, preventive maintenance, water leaks, rate review, group inquiries, fire alarm, medical emergency). Use when someone says "what's our SOP for", "how do we handle", "what do we do if", "procedure for", "train a new attendant", "quiz the new hire", "adapt our SOPs", "fill in the SOP blanks", "print the SOPs", "change our SOP", "shorten the fire SOP", "this SOP is too long", or asks to edit any file in sops/.
---

# Hotel SOPs

Run order: hotel-setup first, then this skill whenever someone needs a procedure. The job skills read the same SOPs by number, so a change made here reaches the board, the work orders and the team messages.

## 1. Paste in
- `hotel-profile.md` (required; if missing, stop and run hotel-setup).
- The `sops/` folder in the working folder: the hotel's own copy of the 20 SOPs. In claude.ai, the SOP files added to the Project's knowledge.
- For "adapt": the GM's answers to the blanks. For "train": which SOP and the new hire's role.

| SOP | Name | SOP | Name |
|---|---|---|---|
| 01 | Check-in | 11 | Lost and found |
| 02 | Check-out | 12 | Shift handover |
| 03 | Room move and walking a guest | 13 | Work order intake |
| 04 | VIP arrival | 14 | Out-of-order rooms |
| 05 | Service recovery | 15 | Room preventive maintenance |
| 06 | Night audit | 16 | Water leak |
| 07 | Key control and guest identity | 17 | Daily rate review |
| 08 | Departure clean | 18 | Group inquiry |
| 09 | Stayover service | 19 | Fire alarm |
| 10 | Inspect and release | 20 | Medical emergency |

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. If `sops/` is missing in Claude Code, run `npx open-conxi sops` in the working folder and report what it printed. It never overwrites a file the hotel already has. In claude.ai, ask the GM to add the SOP files to the Project.
2. Lookup ("what do we do if a ceiling leaks"): pick the SOP by its "When:" line, print it in full from the hotel's copy, with comp limits and team names filled in from the profile. If two SOPs apply, print the one for the first action and name the other by number. If none fits, say so and name the closest one; never write a procedure on the spot and call it an SOP.
3. Adapt ("fill in the blanks", "adapt our SOPs"): list every `[your hotel: ...]` blank across the 20 files and ask for them in one message of at most twelve numbered questions, most safety-critical first (SOPs 19, 20, 16). Write each answer into the hotel's copy in place of its blank, and report the blanks still open by SOP number.
4. Change ("our check-in target is 3 minutes"): edit only the line asked about in the hotel's copy, and repeat the old and new line back. A time, a spending limit or a safety step changes only when the GM states the new value; a request to make a SOP "shorter" or "simpler" rewords steps and never drops one.
5. SOPs 19 and 20 are never shortened, merged or reordered, and their first step stays: your fire plan, your first aid training and local law override this page.
6. Train ("train a new attendant on inspections"): five questions a supervisor asks out loud, each answered by a line of that SOP, with the answer and the step number under each. Nothing from outside the SOP.
7. Print ("print the SOPs"): in Claude Code, join the hotel's 20 files in number order into `sops-binder.md` in the working folder, run `npx open-conxi tidy`, and say where it is.

## 3. Checklist
DO-CONFIRM, before replying.
- [ ] The SOP printed came from the hotel's copy in `sops/`, or the reply says it used the stock copy and why.
- [ ] Comp limits and team names came from hotel-profile.md, not from memory.
- [ ] No standard (time, limit, safety step) changed unless the GM gave the new value.
- [ ] SOPs 19 and 20 have every step, in order, with the override line first.
- [ ] Every blank still open is listed by SOP number.
- [ ] Training questions are answerable from the SOP alone, each with its step number.

## 4. Check yourself
- The SOP number and name in the reply match the file's first line.
- A lookup names exactly one SOP to act on first.
- After an edit, the file still has its Standard, Steps, Pause point, Escalate, Your hotel and Sources headings.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded, dispatched, called, contacted, shared, posted) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; names exactly as given, in the same script, with no title that assumes gender; no long or short dash characters (wider than a hyphen) anywhere, titles, headings and table cells included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date, and write "none" in an empty cell; search every reply for them before you send it, a one-line question or a stop included, and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Lookup: the SOP in full under its own heading ("SOP 16: Water leak, The Ampang Row"), then one line naming any other SOP that applies. Adapt: the numbered questions, or after answers the blanks filled and still open. Change: old line, new line, file. Train: five questions with answers and step numbers. This skill emits no delta.

## 6. Still manual in your systems
Walking the building to find each valve, board and assembly point for the blanks, training staff on the floor, and signing off each SOP with the department head. Conxi (conxi.ai) puts the right SOP in front of the right person when the event happens in your PMS.
