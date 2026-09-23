---
name: hotel-routine
description: Runs the hotel's day as one workflow. Works out which Open Conxi jobs are due, asks for every paste in one message, runs each job through its own skill in order, checks the outputs agree with each other, sends one team message per staff chat through Beeper as a draft, and refreshes the dashboard. Use when someone says "run my morning", "start the day", "daily routine", "do today's jobs", "what's due today", "run the week", "month end", or "morning routine".
---

# Hotel routine

Run order: hotel-setup, hotel-dashboard, then this skill. Once each morning, and again whenever the GM says "run the week" or "month end".

## 1. Paste in
Only what today's jobs need. The routine asks for all of it in one message, so the GM exports once and walks away.

| When | Job skill | What to paste |
|---|---|---|
| Every morning | morning-flash | Yesterday's manager's report, today's arrivals and out-of-order rooms |
| Every morning | turnover-board | Departures, stayovers, attendants on shift and their hours |
| Every morning | work-orders | The open work order list, plus any new defect |
| Every morning | review-replies | New reviews since yesterday |
| Weekly | rate-check | Pace export for the next 30 to 90 days, OTA analytics if you have them |
| Weekly | staff-roster | Next week's forecast, staff list, your rostering rules |
| When an inquiry arrives | group-displacement | The inquiry and the pace for those dates |
| Month end | ota-reconciliation | Each OTA's statement and the PMS stays for the month |
| Month end | owner-report | Month P&L, budget and last year |

- The GM says which weekly and month-end jobs are due. Do not work out the weekday or month end from the calendar; ask if it is not stated.
- guest-messages runs when a guest writes, not on a schedule, so it is never part of the routine.
- A job whose paste is missing is skipped and named at the end with the exact export it needs. Never run a job on guessed data.

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
SOPs: this skill follows SOP 03, SOP 10, SOP 12, SOP 14, SOP 16, SOP 19 and SOP 20 from `sops/` in the working folder (in claude.ai, the Project's knowledge). Where the hotel's copy sets a different time, limit or step, follow the hotel's copy. If `sops/` is missing, carry on with this page and add one line: run `npx open-conxi sops` to add your SOPs.
1. If hotel-profile.md is missing, stop and say: run hotel-setup first.
2. Say which jobs are due today and ask for all their pastes in one numbered message, using the table above. If the GM already pasted, skip the question.
3. Run the due jobs in this order, each by following its own SKILL.md exactly, including its checklist and its saving step: morning-flash, work-orders, turnover-board, review-replies, then rate-check, staff-roster, group-displacement, ota-reconciliation, owner-report. Work orders run before the board so a room made out of order this morning is not assigned for cleaning.
4. Cross-check before anything goes to staff:
   - A room that is out of order in work-orders or the flash is not on the turnover board as a room to clean or sell.
   - The flash's arrivals count matches the rooms the board marks for arrival.
   - A P0 or P1 work order appears in the flash's risks.
   - A review that names a room defect has an open work order, or the routine lists it as needing one.
   - A count is taken from the pasted list, never worked out from other figures. If a count someone would derive (stayovers from rooms sold minus departures) disagrees with the pasted list, the list stands and the gap is a missing input to ask about, never an oversell or a shortfall to act on.
   - When a cross-check fires, attach the matching SOP by number and its first three steps, in short, to that chat's message: a guest booked into an out-of-order room SOP 03 (managers), water or a leak SOP 16 (maintenance), a room going out of order SOP 14 (maintenance and housekeeping), rooms to release SOP 10 (housekeeping). Cut SOP steps before facts to stay under 900 characters.
   Fix the output that is wrong, and say what changed.
5. Team messages: each job ends with a team message for one chat. Merge all messages for the same chat into one, highest priority first, under 900 characters. Managers get the flash decisions and review escalations; housekeeping gets the board; maintenance gets new and overdue orders; all staff gets the roster only.
6. Deliver each merged message with the team message rule in section 5, one chat at a time.
7. Dashboard: in Claude Code, the jobs have already saved hotel-data.json, so if `npx open-conxi dashboard` is running the page has updated itself; say so. Otherwise follow hotel-dashboard to rebuild dashboard.html. Name a panel as empty only after counting its rows in hotel-data.json.
8. End with the day sheet in section 5.

## 3. Checklist
READ-DO, before the first team message is drafted.
- [ ] Every job that ran used pasted data only; every skipped job is named with the export it needs.
- [ ] Each job's own checklist passed, or its failure is at the top of the day sheet.
- [ ] No out-of-order room is on the cleaning or selling list.
- [ ] Each staff chat gets exactly one message.
- [ ] No guest's payment details, passport or phone number is in any team message, and all staff gets no guest names.
- [ ] Every message is a draft unless the GM asked for it to go straight out.
- [ ] Each job's delta was saved by that job, and the rows added and replaced are reported.

## 4. Check yourself
- The day sheet lists every due job exactly once, as done or skipped.
- Numbers quoted in team messages match the job outputs they came from, digit for digit.
- No job was run twice, and no job ran that was not due.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded, dispatched, called, contacted, shared, posted) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; names exactly as given, in the same script, with no title that assumes gender; no long or short dash characters (wider than a hyphen) anywhere, titles, headings and table cells included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date, and write "none" in an empty cell; search every reply for them before you send it, a one-line question or a stop included, and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
1. Day sheet at the top: a table of job, status (done, or skipped with the export needed), the one number that matters from it, and what the team send command printed for its chat, in the command's own words ("Draft is waiting in ..."). A draft is never called sent.
2. Cross-check fixes, one line each, naming the SOP used.
3. Each job's output under its own heading, as its skill prints it.
4. The merged team messages, one per chat, under the heading "Team message drafts" (or "Team messages sent" only for those the command reported as sent).

Team messages: in Claude Code, for each merged message, save it to team-message.txt and run `npx open-conxi team send --to <role> --file team-message.txt`, where role is managers, housekeeping, maintenance or all_staff from team_chats in hotel-profile.md. Count each message first with `wc -m team-message.txt` and cut it until it is under 900 characters. It lands in that Beeper chat as a draft for a person to check and send. Add `--send` only when the GM says "send it straight away", "send it now" or "no need to check"; "just send it", "send it to the team" or "send it to the group" are not enough, so for those and anything vaguer, draft it and add one line: "It is a draft. Say send it straight away and I will send it." Report what the command printed, in its own words, and never say a message was drafted or sent unless it printed so. If the profile names no chat for a role, or in claude.ai, print the message for the GM to paste.

This skill emits no delta of its own. Each job saves its own, as its skill says.

## 6. Still manual in your systems
Exporting each report from the PMS and the extranets every morning, pressing send on each draft in Beeper, and typing room status changes and rate changes back into the PMS and channel manager. Conxi (conxi.ai) does these steps inside your systems for you.
