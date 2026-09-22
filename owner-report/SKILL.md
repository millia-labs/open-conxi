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
