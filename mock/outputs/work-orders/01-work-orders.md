Fictional sample. Every number is invented.

# The Ampang Row Hotel, work orders, weekly aged list, 22 Sep 2026

## New order logged today
Location: Room 318. Reported: door lock not reading key cards, front desk, 09:30 today. Guest in room: no, vacant, ready for tonight's arrival.
Priority: P1 (in-room defect, occupied-for-tonight room). SLA due: 17:30 today (8 hours from 09:30).
Assignee: Ravi, in-house engineer. Estimated cost: MYR 95 (lock cylinder swap).
Guest impact: none yet, room not currently occupied; if not fixed by 15:00, front desk holds an alternate room for tonight's arrival.

Dispatch message to Ravi (WhatsApp): "P1: Room 318, door lock not reading cards. Vacant now, needs to be ready for a 15:00 arrival. Access anytime before 14:00. Done = card reads on 3 test taps, photo of the working lock."

## Weekly aged list (open orders, sorted by hours past SLA then priority)

| ID | Priority | Location | Opened | SLA due | Status | Hours past SLA |
|---|---|---|---|---|---|---:|
| WO-2609-014 | P1 | Room 512, aircon | 21 Sep 07:10 | 21 Sep 15:10 | in progress | 25.8 |
| WO-2609-015 | P1 | Room 318, door lock | 22 Sep 09:30 | 22 Sep 17:30 | assigned | 0 (not yet due) |
| WO-2609-012 | P2 | Row Kitchen fridge seal | 19 Sep 08:00 | 26 Sep 08:00 | parts on order | 0 (not yet due) |
| WO-2609-009 | P2 | Room 204, grout | 17 Sep 11:00 | 24 Sep 11:00 | open | 0 (not yet due) |
| WO-2609-011 | P2 | Lift lobby L3, light | 18 Sep 14:20 | 25 Sep 14:20 | open | 0 (not yet due) |

On-time rate this week: 0 of 1 closures on time (WO-2609-001, the Level 5 riser leak, closed 2 Sep within its 1-hour P0 window; no closures yet this week). WO-2609-014 is 25.8 hours past its P1 SLA and is the priority for today; escalated to Daniel (GM) per the checklist rule.

## Preventive maintenance calendar, next 90 days
Aircon and chiller service: scheduled 6 Oct (low-occupancy midweek, per pace). Fire alarm and extinguisher annual: 12 Oct. Kitchen hood (F&B on site): 3 Oct, 3 Jan, 3 Apr, 3 Jul (quarterly). Generator monthly test: 1st of each month. Lifts: check local code, not yet confirmed with the hotel, flagged for Daniel. Pool: not applicable, hotel has no pool.

hotel-data delta
```json
{"work_orders": [{"id": "WO-2609-016", "priority": "P1", "opened": "2026-09-22T09:30", "sla_due": "2026-09-22T17:30", "status": "assigned", "location": "Room 318 door lock", "cost": 95, "source": "work-orders"}],
 "scorecard": [{"name": "Work orders closed on time", "value": 0.0, "target": 0.9, "owner": "Ravi", "week": "2026-W39", "source": "work-orders"}]}
```
