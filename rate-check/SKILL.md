---
name: rate-check
description: Weekly rate and inventory review from a PMS pace export plus the free comp-set data in Booking.com Analytics and Expedia Rev+. Recommends holds, rises and restrictions by date, with the published evidence on discounting built in and a hard rule against pooling competitors' non-public data. Use when someone says "rate check", "should we drop the rate", "pace report", "pickup", "what to charge next month", "open or close the OTA", "minimum stay", "comp set".
---

# Rate check

Run order: hotel-setup, hotel-dashboard, then this skill. Weekly, same day each week.

## 1. Paste in
- Pace by stay date for whatever horizon the GM has, 90 days is ideal and 14 is fine: rooms on the books, rate on the books, and the same two figures 7 days ago (OPERA Cloud: Reports, Reservation Forecast, run today and compare to last week's saved copy; Cloudbeds: Reports, Pace; Mews: Reports, Reservations by date). State the horizon covered at the top of the output.
- Same dates last year: rooms sold and ADR, if available.
- Comp-set data that is free and public to the hotel: Booking.com extranet, Analytics (Booking window, Pace, Ranking); Expedia Partner Central, Rev+ (Comp set price calendar, Market occupancy forecast). Paste the tables.
- Current published rates and restrictions by date.
- Missing comp data: run on pace alone and say the comp view is absent. Missing last year: run on pace and pickup only. The pace rows in hotel-data.json carry no last-year figures, so never state a comparison with last year from them.
- A question with no pace pasted ("competitor dropped, should I follow?"): answer with step 6 and the evidence in step 4, then ask for the pace export; no rate figure for any date.

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. Read `hotel-profile.md` for keys, currency, OTAs.
2. Pickup: for each date, rooms now minus rooms 7 days ago. Rank dates by pickup and by rooms remaining.
3. Classify each date. Compression: on the books at or above 75 percent of keys with 10 or more days to go, or pickup in the top 20 percent of the dates pasted. Need: below the same date last year, or below the average on-the-books of the dates pasted with pickup in the bottom 20 percent. Normal: everything else. Top 20 percent means the dates whose pickup is at or above the pickup of the date ranked at 20 percent down the list, rounded up, ties included. Apply compression, then need, then normal, to every date, in that order, and print the rule that fired beside each date. These three classes plus "event" are the only ones; no new class names. Show the threshold numbers used.
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
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; no long or short dash characters (wider than a hyphen) anywhere, titles and headings included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date; before replying, search the whole reply for them and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
A table for the horizon pasted (date, on the books, pickup 7d, last year, comp median if any, class and the rule that fired, action); an empty cell reads "none". Under it, the pickup total for the week. Then the ten-action list for the channel manager. Then the override dates. Then a delta of achieved figures only: `otb_adr` is the rate on the books as pasted, never the recommended rate or the BAR; `cancellation_adjusted_otb` is null unless the hotel's cancellation rate was given; any field not in the paste is null.

hotel-data delta
```json
{"pace": [{"stay_date": "<date>", "otb_rooms": 0, "otb_adr": null, "pickup_7d": 0, "cancellation_adjusted_otb": null, "source": "rate-check"}]}
```
Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). Then read the file back and report the rows added and replaced from what you read. Never say the file was updated unless you wrote it in this turn. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.

## 6. Still manual in your systems
Exporting pace from the PMS, copying the two OTA analytics tables, then typing each rate and restriction change into the channel manager and checking parity on every channel afterwards. Conxi (conxi.ai) does these steps inside your systems for you.
