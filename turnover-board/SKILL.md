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
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. Read `hotel-profile.md` for keys and room types. Take each room's type from the room map or PMS list that was pasted, room by room; if a room's type cannot be read from it, write "type not given" rather than guessing from the floor.
2. Conflict scan before anything else: list every room that appears in two lists that cannot both be true (a stayover also on arrivals, an out-of-order room on arrivals or stayovers, a departure also on stayovers). Each conflict goes at the top of the board with the question the front desk must answer.
3. Priority order: departures with a same-day arrival first, sorted by arrival time; then other departures; then stayovers; out-of-order rooms are listed, not assigned.
4. Credits: one credit is 30 minutes. A standard departure clean is 1 credit, a stayover 0.67, a suite or family room departure 1.5. An attendant's capacity is shift hours times 2, so an 8-hour shift is 16 credits; plan to 14 to 16 of them and treat anything above 16 as overload. Assign rooms to attendants by floor, filling each to capacity without exceeding it, and state any rooms left unassigned as a shortfall with the fix (relief attendant, extended shift, or stayovers cut to a spot service).
5. Same-day flip risk: any room where arrival time minus departure time is under 4 hours. Flag it, assign the most experienced attendant, and tell the front desk which rooms to give a later arrival time if needed.
6. Ready rule: a room becomes "ready" only when the attendant has posted the photo set (bed made, bathroom, desk and minibar, floor from the door) and a supervisor has ticked the inspection list. Print the list once, then any extra items a room type needs (cot check for family rooms, kitchenette for suites).
7. Inspection list, 9 items: bathroom clean and dry, bed linen fresh and tight, no hair on any surface, amenities at par, bins empty and lined, wifi and TV on, aircon or heating set to the standard, safe open and empty, nothing left from the previous guest.

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
- Every room number was checked against every other list for conflicts, and each conflict is at the top.
- Each attendant's credits are at or below shift hours times 2, or the overload is stated; unassigned rooms are listed as a shortfall.
- Same-day flip rooms are listed with both times.
- Out-of-order rooms are excluded from assignments and from tonight's sellable count.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; no long or short dash characters (wider than a hyphen) anywhere, titles and headings included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date; before replying, search the whole reply for them and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Header with date and counts (departures, stayovers, arrivals, out-of-order, attendants). Board table: room, type, status, arrival time if any, attendant, credits, flags. Same-day flip list. Inspection list. The morning board emits no delta. At end of day, when the GM pastes the count of rooms ready by 15:00, emit:

hotel-data delta
```json
{"scorecard": [{"name": "Rooms ready by 15:00", "value": null, "target": 1.0, "owner": "<housekeeping lead>", "week": "<YYYY-Www>", "source": "turnover-board"}]}
```
with `value` = rooms ready by 15:00 divided by rooms due, as a fraction.
Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). Then read the file back and report the rows added and replaced from what you read. Never say the file was updated unless you wrote it in this turn. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.
Team message: end with a block headed "Team message" in plain text for the housekeeping chat: under 600 characters, no tables, only what that team acts on today. In Claude Code, if hotel-profile.md names a housekeeping chat under team_chats, save the block to team-message.txt and run `npx open-conxi team send --to housekeeping --file team-message.txt`, which puts it in that Beeper chat as a draft for a person to check and send; add `--send` only when the GM asks for it to go straight out. Report what the command printed, and never say the message was drafted or sent unless it printed so. Otherwise, and in claude.ai, print the block for the GM to paste into the staff chat.

## 6. Still manual in your systems
Exporting the departure list, typing the board into the housekeeping app or WhatsApp group, chasing photo sets, and flipping each room status in the PMS after inspection. Conxi (conxi.ai) does these steps inside your systems for you.
