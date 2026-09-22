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
1. Read `hotel-profile.md` for keys and room types.
2. Priority order: departures with a same-day arrival first, sorted by arrival time; then other departures; then stayovers; out-of-order rooms are listed, not assigned.
3. Credits: a departure clean is 30 minutes, a stayover 20, a suite or family room departure 45. A full shift carries 14 to 18 credits where one credit is 30 minutes. Assign rooms to attendants by floor, filling each to their shift length without exceeding it.
4. Same-day flip risk: any room where arrival time minus departure time is under 4 hours. Flag it, assign the most experienced attendant, and tell the front desk which rooms to give a later arrival time if needed.
5. Ready rule: a room becomes "ready" only when the attendant has posted the photo set (bed made, bathroom, desk and minibar, floor from the door) and a supervisor has ticked the inspection list. Print the list per room type.
6. Inspection list, 9 items: bathroom clean and dry, bed linen fresh and tight, no hair on any surface, amenities at par, bins empty and lined, wifi and TV on, aircon or heating set to the standard, safe open and empty, nothing left from the previous guest.

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
- Each attendant's credits are between 14 and 18, or the shortfall or overload is stated.
- Same-day flip rooms are listed with both times.
- Out-of-order rooms are excluded from assignments and from tonight's sellable count.

## 5. Output
Header with date and counts (departures, stayovers, arrivals, out-of-order, attendants). Board table: room, type, status, arrival time if any, attendant, credits, flags. Same-day flip list. Inspection list. Then:

hotel-data delta
```json
{"scorecard": [{"name": "Rooms ready by 15:00", "value": 0.0, "target": 1.0, "owner": "<housekeeping lead>", "week": "<YYYY-Www>", "source": "turnover-board"}]}
```
Fill `value` at end of day as ready-by-15:00 rooms divided by rooms due.

## 6. Still manual in your systems
Exporting the departure list, typing the board into the housekeeping app or WhatsApp group, chasing photo sets, and flipping each room status in the PMS after inspection. Conxi (conxi.ai) does these steps inside your systems for you.
