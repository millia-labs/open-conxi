---
name: staff-roster
description: Builds next week's roster for front office, housekeeping, F&B and engineering from the occupancy forecast, at a target labour cost per occupied room, respecting the hotel's stated working-time rules. Use when someone says "roster", "rota", "schedule next week", "who is on", "labour cost", "hours per occupied room", "we are short on Saturday".
---

# Staff roster

Run order: hotel-setup, hotel-dashboard, then this skill. Weekly, before the roster is published.

## 1. Paste in
- Next week's forecast by day: rooms on the books (occupied rooms), expected arrivals, departures and stayovers (from rate-check or `hotel-data.json` pace rows, or the PMS forecast report). Occupied rooms = stayovers + arrivals; if neither rooms on the books nor arrivals were given, labour cost per occupied room is not computed.
- Staff list per department with contract hours per week, days off requested, leave, and hourly or daily cost.
- The hotel's working-time rules in its own words: maximum hours per day and week, minimum rest between shifts, weekly rest day, overtime rate, public holidays next week. This skill does not carry any country's labour law; the hotel states its rules and the roster obeys them.
- Standards: rooms per attendant per shift (default 14 departures or 20 stayovers), front desk minimum cover per shift (default 1 by day, 1 by night), F&B covers per server (default 20 at breakfast).
- Missing rules: build the roster and mark it "rules not provided, check before publishing".

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
SOPs: this skill follows SOP 12 from `sops/` in the working folder (in claude.ai, the Project's knowledge). Where the hotel's copy sets a different time, limit or step, follow the hotel's copy. If `sops/` is missing, carry on with this page and add one line: run `npx open-conxi sops` to add your SOPs.
1. Read `hotel-profile.md` for keys, F&B, currency.
2. Demand per day: housekeeping hours from the hotel's stated standard (rooms per attendant per shift, converted to hours); only if no standard was given use departures times 0.5 hour plus stayovers times 0.33 hour, and say so; add public-area hours if given; front desk hours = shifts to cover the desk plus 1 extra during the arrival peak when arrivals exceed 25 percent of keys; F&B hours = forecast covers divided by covers per server times shift length; engineering = one shift per day plus on-call.
3. Assign staff to shifts by department, using each person's contract hours first, then overtime only where demand cannot be met, then a named casual or agency slot.
4. Check every assignment against the stated rules (hours per day and week, rest between shifts, rest day). Any breach is listed, never silently kept. The weekly maximum is a ceiling: overtime never takes anyone past it. A hotel rule that removes pay or rest (unpaid rest-day work, unpaid on-call, no overtime pay) is listed under "rules to confirm are lawful where you operate", and the roster is built without it until the GM confirms; it is never applied to someone who does not need it.
5. Labour cost per occupied room = total rostered cost across every department divided by forecast occupied rooms. Compute it only when every department is rostered and occupied rooms are known (every department means every one the hotel has: F&B when the profile says fnb is true, engineering, and any agency or casual hours must carry a cost; one unpriced shift means the figure is not final); a housekeeping-only run shows housekeeping cost per occupied room, labelled as such, and emits no scorecard row. Compare to the target the GM gives, or show it without a target.
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
- Each person's hours are recounted from the grid, and every sentence in the breaches and gaps list is re-read against the grid; a sentence the grid contradicts is fixed.
- The all staff message carries shifts only, never anyone's pay terms.
- Sum of rostered hours per person equals contract hours plus listed overtime.
- Rostered housekeeping capacity covers forecast departures and stayovers each day.
- Cost total equals the sum of hours times rates per person.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded, dispatched, called, contacted, shared, posted) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; names exactly as given, in the same script, with no title that assumes gender; no long or short dash characters (wider than a hyphen) anywhere, titles, headings and table cells included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date, and write "none" in an empty cell; search every reply for them before you send it, a one-line question or a stop included, and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Roster grid (person by day, shift codes defined under the grid, for example E early, L late, N night, OFF, AL annual leave; letters only, no tick marks), demand versus cover table per department per day, breaches and gaps list, cost line. Then, only when all departments are rostered and occupied rooms are known (target null if the GM gave none):

hotel-data delta
```json
{"scorecard": [{"name": "Labour cost per occupied room", "value": null, "target": null, "owner": "<GM>", "week": "<YYYY-Www>", "source": "staff-roster"}]}
```
Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). If you stop to ask the GM something, first save the rows that are already confirmed, or say "not saved yet". Then run `npx open-conxi tidy` in the folder to clear any long dashes, read the file back and report the rows added and replaced, by key, from what you read. Never say the file was updated unless you wrote it in this turn. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.
Team message: end with a block headed "Team message" in plain text for the all_staff chat: under 600 characters (count them with `wc -m team-message.txt` and cut until it fits), no tables, only what that team acts on today, even when you are also asking the GM for missing inputs. In Claude Code, if hotel-profile.md names a all_staff chat under team_chats, save the block to team-message.txt and run `npx open-conxi team send --to all_staff --file team-message.txt`, which puts it in that Beeper chat as a draft for a person to check and send. Add `--send` only when the GM says "send it straight away", "send it now" or "no need to check"; "just send it", "send it to the team" or "send it to the group" are not enough, so for those and anything vaguer, draft it and add one line: "It is a draft. Say send it straight away and I will send it." Report what the command printed, in its own words, and never say the message was drafted or sent unless it printed so. Otherwise, and in claude.ai, print the block for the GM to paste into the staff chat.

## 6. Still manual in your systems
Exporting the forecast, collecting leave requests, typing the roster into the scheduling tool or WhatsApp group, and handling swaps during the week. Conxi (conxi.ai) does these steps inside your systems for you.
