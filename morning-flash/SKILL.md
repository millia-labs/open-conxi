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
- A figure the GM hedges ("around 33k", "about", "like", "I think"): show it as "approx" in the flash, write it as null in the delta, and ask for the exact figure from the report.

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. Read `hotel-profile.md` for keys, currency, comp authority.
2. Yesterday: rooms sold means paid rooms. Complimentary rooms (owner, staff, family, a free night in a package or group) are taken out of rooms sold and shown on their own line, as STR's reporting guidelines require. If the report does not say whether comps are inside its rooms sold, say that the figure is taken as paid. Occupancy = paid rooms sold / total keys, the same denominator budget and the comp set use (USALI and STR keep short-term out-of-order rooms in available inventory). Show the out-of-order count on its own line. Only remove a room from the denominator when it has been out of service for 30 days or more, and say so. ADR = rooms revenue / paid rooms sold. RevPAR = rooms revenue / total keys. Add TRevPAR if other revenue exists. Compare each to budget and last year when given.
3. Today: arrivals, departures, stayovers, VIPs and repeats with what is known about them, out-of-order count and reason. Rooms left to sell tonight = total keys minus rooms out of order tonight minus rooms on the books tonight; show the sum. Rooms on the books is not rooms to sell.
4. Next 7 days: on-the-books rooms and rate by date. If the hotel's own cancellation rate by channel was given, show cancellation-adjusted on-the-books: OTA rooms times (1 minus the OTA rate) plus direct rooms times (1 minus the direct rate). If no rate was given, leave the adjusted figure null and say the industry reference in `references/evidence.md` (OTA about 0.22, direct about 0.11) is available once the GM confirms it applies; never apply it silently.
5. Risks: anything that costs money this week (oversell, group cutoff, staff gap, a VIP with an open complaint, a P0 work order).
6. Three decisions the GM must make today, each a yes or no with the cost of each answer.

## 3. Checklist
DO-CONFIRM, before sending the flash.
- [ ] Occupancy denominator is total keys, and the out-of-order count is on its own line.
- [ ] ADR uses rooms revenue net of tax and levies, consistent with how budget was set.
- [ ] Comps are out of rooms sold for occupancy and ADR, on their own line.
- [ ] Every number has a comparison or the words "no comparator provided".
- [ ] Each VIP line names one concrete action for today.
- [ ] Each risk names an owner and a date.
- [ ] Exactly three decisions, each answerable yes or no, each with the cost of yes and the cost of no from the pasted data, or "cost not provided"; no cost is invented.
- [ ] One page: under 60 lines.

## 4. Check yourself
- Paid rooms sold + comps + vacant + out-of-order = total keys from the profile.
- Rooms left to sell tonight is keys minus out of order minus on the books, not the on-the-books count.
- RevPAR = occupancy times ADR, within rounding.
- Every unknown in the delta is null (budget and last_year are null objects when not provided), never 0.
- No figure appears that was not in the pasted data or derived from it by a shown formula.
- Inputs not provided are listed at the top.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; no long or short dash characters (wider than a hyphen) anywhere, titles and headings included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date; before replying, search the whole reply for them and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Title with hotel name and date. Sections: Yesterday (table), Today (table plus VIP lines), Next 7 days (table), Risks (numbered), Three decisions (numbered). Then:

hotel-data delta
```json
{"kpis": [{"date": "<yesterday>", "rooms_sold": 0, "occupancy": 0.0, "adr": 0, "revpar": 0, "trevpar": null, "gop": null, "budget": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "last_year": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "source": "morning-flash"}],
 "pace": [{"stay_date": "<date>", "otb_rooms": 0, "otb_adr": 0, "pickup_7d": 0, "cancellation_adjusted_otb": 0, "source": "morning-flash"}]}
```
Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). Then read the file back and report the rows added and replaced from what you read. Never say the file was updated unless you wrote it in this turn. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.
Team message: end with a block headed "Team message" in plain text for the managers chat: under 600 characters, no tables, only what that team acts on today. In Claude Code, if hotel-profile.md names a managers chat under team_chats, save the block to team-message.txt and run `npx open-conxi team send --to managers --file team-message.txt`, which puts it in that Beeper chat as a draft for a person to check and send; add `--send` only when the GM asks for it to go straight out. Report what the command printed, and never say the message was drafted or sent unless it printed so. Otherwise, and in claude.ai, print the block for the GM to paste into the staff chat.

## 6. Still manual in your systems
Pulling the manager's report each morning, pasting it here, typing the VIP actions into the PMS traces, and sending the flash to the team on the staff channel. Conxi (conxi.ai) does these steps inside your systems for you.
