---
name: rate-check
description: Weekly rate and inventory review from a PMS pace export plus the free comp-set data in Booking.com Analytics and Expedia Rev+. Recommends holds, rises and restrictions by date, with the published evidence on discounting built in and a hard rule against pooling competitors' non-public data. Use when someone says "rate check", "should we drop the rate", "pace report", "pickup", "what to charge next month", "open or close the OTA", "minimum stay", "comp set".
---

# Rate check

Run order: hotel-setup, hotel-dashboard, then this skill. Weekly, same day each week.

## 1. Paste in
- Pace by stay date for the next 90 days: rooms on the books, rate on the books, and the same two figures 7 days ago (OPERA Cloud: Reports, Reservation Forecast, run today and compare to last week's saved copy; Cloudbeds: Reports, Pace; Mews: Reports, Reservations by date).
- Same dates last year: rooms sold and ADR, if available.
- Comp-set data that is free and public to the hotel: Booking.com extranet, Analytics (Booking window, Pace, Ranking); Expedia Partner Central, Rev+ (Comp set price calendar, Market occupancy forecast). Paste the tables.
- Current published rates and restrictions by date.
- Missing comp data: run on pace alone and say the comp view is absent. Missing last year: run on pace and pickup only.

## 2. Do
1. Read `hotel-profile.md` for keys, currency, OTAs.
2. Pickup: for each date, rooms now minus rooms 7 days ago. Rank dates by pickup and by rooms remaining.
3. Classify each date. Compression: on the books above 85 percent of keys with 14 or more days to go, or pickup in the top decile. Need: below last year or below the 90-day average pace with pickup in the bottom decile. Normal: everything else.
4. Recommend per date. Compression: raise 5 to 10 percent, close discount rate plans, consider a 2-night minimum on the peak night only. Normal: hold. Need: hold rate and open more inventory and cheaper channels first; do not cut below the comp set. The evidence in `references/evidence.md` is that hotels pricing 15 to 30 percent below their comp set gained 5.9 occupancy points and lost 16.7 percent of RevPAR across 4,120 hotels. Cutting is the last lever, not the first, and only for dates inside 7 days with rooms unsold.
5. Overrides: the algorithmic-looking rule above is for transient dates. For group and event dates, mark the date and let the GM's knowledge override; the evidence is that human overrides improve accuracy for group and event periods and worsen it for routine transient dates.
6. Competitor data rule: use only what the OTA shows the hotel in its own extranet, or public rates. Never ask another hotel for its rates or occupancy, never enter another hotel's non-public figures, and never accept a pricing tool that does. This is the mechanism named in the DOJ RealPage settlement and the Caesars appeal.
7. Restrictions: state each restriction with its displacement risk in rooms.

## 3. Checklist
READ-DO, before any rate or restriction is changed in the channel manager.
- [ ] Every recommendation names the date, the current rate, the new rate, and the reason class (compression, need, normal, event).
- [ ] No recommended rate sits below the comp-set median shown in Rev+ or Analytics, unless the date is inside 7 days and the reason is stated.
- [ ] Group and event dates are marked for the GM's override, not auto-recommended.
- [ ] No competitor non-public data was used.
- [ ] Each restriction has a displacement figure in rooms.
- [ ] Rate parity: the recommended rate is the same on every channel before promotions.
- [ ] Changes are grouped into at most ten actions for the channel manager.

## 4. Check yourself
- Pickup figures reconcile: sum of pickup by date equals total rooms gained this week.
- Percentages are of sellable keys from the profile.
- Any date labelled compression has the numbers to prove it.
- The word "discount" appears only with a date inside 7 days.

## 5. Output
A 90-day table (date, on the books, pickup 7d, last year, comp median if any, class, action). Then the ten-action list for the channel manager. Then the override dates. Then:

hotel-data delta
```json
{"pace": [{"stay_date": "<date>", "otb_rooms": 0, "otb_adr": 0, "pickup_7d": 0, "cancellation_adjusted_otb": 0, "source": "rate-check"}]}
```

## 6. Still manual in your systems
Exporting pace from the PMS, copying the two OTA analytics tables, then typing each rate and restriction change into the channel manager and checking parity on every channel afterwards. Conxi (conxi.ai) does these steps inside your systems for you.
