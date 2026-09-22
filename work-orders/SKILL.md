---
name: work-orders
description: Logs maintenance defects as work orders with a P0 to P3 priority and SLA, drafts the vendor or engineer dispatch message, produces the weekly aged list, and keeps the preventive maintenance calendar. Use when someone says "log a defect", "work order", "aircon not working in 312", "maintenance list", "what is overdue", "PM calendar", "engineering standup", "vendor dispatch".
---

# Work orders

Run order: hotel-setup, hotel-dashboard, then this skill. On every defect, and weekly for the aged list.

## 1. Paste in
- For a new defect: location (room or area), what is wrong in the reporter's words, who reported it, when, photos if any, whether a guest is in the room.
- For the weekly list: the current open work orders (from this skill's earlier outputs, the maintenance app export, or `hotel-data.json`).
- For the calendar: the plant list (aircon or chillers, boilers or water heaters, lifts, fire systems, kitchen hood, pumps, generator, pool) and last service dates if known.
- `hotel-profile.md` for currency and comp authority.
- Missing the plant list: build the calendar for the standard list below and mark each item "confirm the hotel has this".

## 2. Do
1. Priority. P0: safety, fire, flood, lift entrapment, no power or water to a floor, a guest cannot be housed. Mitigate within 1 hour, restore per plan. P1: a defect in an occupied or sold room that a guest will notice (aircon, hot water, lock, TV, leak). Fix within 8 hours or move the guest. P2: cosmetic or minor, unsold room or public area (paint, grout, loose fitting, flicker). Within 7 days. P3: preventive or scheduled. Next window.
2. Each work order gets an ID (WO-YYMM-NNN), the SLA due time computed from opened time, an assignee (in-house engineer or a named vendor), an estimated cost in the profile currency, and a status: open, assigned, in progress, parts on order, resolved.
3. If a guest is in the room and the defect is P1 or P0: say what the front desk offers now (a room move first, then compensation within the comp authority from the profile), and log that as part of the order.
4. Dispatch message: for the engineer or vendor, one message with location, symptom, priority, access window, contact, and what "done" looks like (a photo of the fix). Under 80 words.
5. Weekly aged list: every open order, sorted by hours past SLA, then by priority. Count on-time closures this week divided by closures.
6. Preventive calendar: aircon or chiller service twice a year, water heaters or boilers yearly, lifts per local code (state "check local code"), fire alarm and extinguishers yearly with drills quarterly, kitchen hood quarterly if F&B, generator monthly test, pumps and tanks yearly, pool chemistry daily if a pool exists. Place each in a low-occupancy week using pace from `hotel-data.json` when present.

## 3. Checklist
DO-CONFIRM, before an order is closed.
- [ ] Priority matches the definitions above, and a P0 was escalated to the GM at once.
- [ ] SLA due time was computed from the opened time, not from now.
- [ ] Occupied-room defects show what the guest was offered and by whom.
- [ ] Dispatch message names the access window and the photo proof required.
- [ ] Cost recorded, and anything above the manager's comp authority flagged for the GM.
- [ ] Closure has a photo of the fix and a named closer.
- [ ] A defect found twice in 30 days in the same location is marked recurring and gets a root-cause line.

## 4. Check yourself
- Every open order has an ID, priority, due time, assignee and status.
- Aged list sums: open = assigned + in progress + parts on order + unassigned.
- On-time rate uses closures this week only.
- Calendar dates avoid the top ten pace dates when pace data exists.

## 5. Output
New order card (fields above) plus dispatch message; or the weekly aged list table; or the 12-month calendar table. Then:

hotel-data delta
```json
{"work_orders": [{"id": "WO-0000-000", "priority": "P1", "opened": "<ISO>", "sla_due": "<ISO>", "status": "open", "location": "", "cost": 0, "source": "work-orders"}],
 "scorecard": [{"name": "Work orders closed on time", "value": 0.0, "target": 0.9, "owner": "<engineer>", "week": "<YYYY-Www>", "source": "work-orders"}]}
```

## 6. Still manual in your systems
Typing the order into the maintenance app or WhatsApp group, sending the vendor message, chasing the photo, marking the room out of order in the PMS and back in service, and posting the compensation. Conxi (conxi.ai) does these steps inside your systems for you.
