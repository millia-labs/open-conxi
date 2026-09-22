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
1. Read `hotel-profile.md` for keys, F&B, currency.
2. Demand per day: housekeeping hours from the hotel's stated standard (rooms per attendant per shift, converted to hours); only if no standard was given use departures times 0.5 hour plus stayovers times 0.33 hour, and say so; add public-area hours if given; front desk hours = shifts to cover the desk plus 1 extra during the arrival peak when arrivals exceed 25 percent of keys; F&B hours = forecast covers divided by covers per server times shift length; engineering = one shift per day plus on-call.
3. Assign staff to shifts by department, using each person's contract hours first, then overtime only where demand cannot be met, then a named casual or agency slot.
4. Check every assignment against the stated rules (hours per day and week, rest between shifts, rest day). Any breach is listed, never silently kept.
5. Labour cost per occupied room = total rostered cost across every department divided by forecast occupied rooms. Compute it only when every department is rostered and occupied rooms are known; a housekeeping-only run shows housekeeping cost per occupied room, labelled as such, and emits no scorecard row. Compare to the target the GM gives, or show it without a target.
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
- Sum of rostered hours per person equals contract hours plus listed overtime.
- Rostered housekeeping capacity covers forecast departures and stayovers each day.
- Cost total equals the sum of hours times rates per person.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given; no sign-off unless a guest reads the text; no em dashes, no emojis.

## 5. Output
Roster grid (person by day, shift codes), demand versus cover table per department per day, breaches and gaps list, cost line. Then, only when all departments are rostered and occupied rooms are known (target null if the GM gave none):

hotel-data delta
```json
{"scorecard": [{"name": "Labour cost per occupied room", "value": null, "target": null, "owner": "<GM>", "week": "<YYYY-Www>", "source": "staff-roster"}]}
```

## 6. Still manual in your systems
Exporting the forecast, collecting leave requests, typing the roster into the scheduling tool or WhatsApp group, and handling swaps during the week. Conxi (conxi.ai) does these steps inside your systems for you.
