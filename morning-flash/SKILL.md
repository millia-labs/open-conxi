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
