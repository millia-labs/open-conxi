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
- One expense line missing (utilities not billed yet, say): show GOP, EBITDA and flow-through only as "before <line>", each compared with budget and last year before that same line. Never put budget, last year or an estimate in place of a missing actual, and never say GOP beats or misses budget "either way".
- Numbers already in hotel-data.json are quoted only after reading the row they come from.

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. Map lines to the profile's standard. USALI: departmental revenue and expense to departmental profit, undistributed expenses, gross operating profit (GOP), then fixed charges to EBITDA. Local: keep the hotel's headings and add GOP as a subtotal.
2. For each line: actual, budget, last year, variance to each in currency and percent, only on lines where the comparator was pasted at that level; a total-only budget gives a total-only variance. Variance commentary only where the variance exceeds 5 percent or the larger of 1 percent of revenue; one sentence per line, naming the cause from the pasted data, not a guess.
3. Flow-through = change in GOP divided by change in revenue versus last year. Split it into rate and occupancy only when last year's rooms sold and ADR were pasted; otherwise report the blended figure and say the split needs those two inputs.
4. Outlook: next 60 days on the books versus the same point last year, in rooms and revenue.
5. Three risks: the three items that could move next quarter's GOP by the most, each with an owner and a date.
6. Scorecard: 5 to 15 numbers the GM tracks weekly, each with a target and an owner (occupancy, ADR, RevPAR, GOP percent, rooms ready by 15:00, review rating, work orders closed on time, labour cost per occupied room, effective OTA commission, direct share). Effective OTA commission = OTA commission divided by OTA room revenue, never by all rooms revenue, and only from pasted commission and OTA room revenue, never from the channels rows in hotel-data.json; if OTA room revenue was not pasted, leave that row out of the scorecard and the delta, and mention "OTA commission as a share of rooms revenue" in the risks text only. Labour cost per occupied room goes in only when payroll for every department and every undistributed line was pasted separately; payroll folded into admin, maintenance or other lines means it is left out.
7. One-page executive summary on top: three sentences on the month, the GOP figure, the outlook line.

## 3. Checklist
DO-CONFIRM, before the report goes to the owner.
- [ ] Departmental profits sum to total departmental profit; minus undistributed equals GOP; minus fixed charges equals EBITDA. Show the arithmetic.
- [ ] Every variance sentence names a cause found in the data.
- [ ] Rooms revenue ties to the sum of the month's daily rooms revenue from morning-flash where available; a gap over 0.5 percent goes on the risks list with its cause stated as unknown, not called rounding.
- [ ] Flow-through is stated with its rate versus occupancy split.
- [ ] Outlook uses the same point in time last year, not last year's final.
- [ ] Each risk has an owner and a date.
- [ ] Executive summary is under 80 words.

## 4. Check yourself
- Totals tie across the P&L, budget and last-year columns independently.
- Percentages are of total revenue unless labelled otherwise.
- No line was added that was not in the pasted data.
- Comparators absent are declared at the top.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded, dispatched, called, contacted, shared, posted) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; names exactly as given, in the same script, with no title that assumes gender; no long or short dash characters (wider than a hyphen) anywhere, titles, headings and table cells included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date, and write "none" in an empty cell; search every reply for them before you send it, a one-line question or a stop included, and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Executive summary, P&L table, variance commentary, flow-through line, outlook table, risks, scorecard table. Then a delta where every field the paste did not support is null (rooms_sold, occupancy and ADR need a rooms-sold count; budget and last_year are null objects when only totals were given) and every ratio is a fraction (GOP margin 0.235, not 23.5). Scorecard rows only for measures with a final value this month; a measure with no value is left out, not written as 0.

hotel-data delta
```json
{"kpis": [{"date": "<YYYY-MM>", "grain": "month", "rooms_sold": null, "occupancy": null, "adr": null, "revpar": 0, "trevpar": 0, "gop": 0, "budget": null, "last_year": null, "source": "owner-report"}],
 "scorecard": [{"name": "GOP %", "value": 0.0, "target": null, "owner": "", "week": "<YYYY-Www of the month's last day>", "source": "owner-report"}]}
```
The month row is keyed by the month alone (2026-08), never by its last day, so it can never replace that day's morning-flash row.
Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). If you stop to ask the GM something, first save the rows that are already confirmed, or say "not saved yet". Then run `npx open-conxi tidy` in the folder to clear any long dashes, read the file back and report the rows added and replaced, by key, from what you read. Never say the file was updated unless you wrote it in this turn. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.

## 6. Still manual in your systems
Exporting the P&L and the pace, mapping the accounting lines to USALI each month, and assembling the pack. Conxi (conxi.ai) does these steps inside your systems for you.
