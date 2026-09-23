Here's the day sheet for 23 Sep.

## Day sheet, The Ampang Row Hotel, 23 Sep

| Job | Status | Key number | Team send |
|---|---|---|---|
| morning-flash | done | Occupancy 80.8% (report showed 81.5%, see note) | Draft is waiting in Ampang Row duty managers (WhatsApp) |
| work-orders | done | 1 new order logged, WO-2609-016 | included in maintenance draft below |
| turnover-board | done | 24 rooms assignable, 512 excluded (OOO) | Draft is waiting in Ampang Row housekeeping (WhatsApp) |
| review-replies | done | 3 reviews, 0 escalations | folded into managers draft (review note line) |
| rate-check | skipped | not stated as due | needs pace export, 30 to 90 days |
| staff-roster | skipped | not stated as due | needs next week's forecast and staff list |
| group-displacement | skipped | no inquiry pasted | needs the inquiry and pace |
| ota-reconciliation | skipped | not month end | needs OTA statements and PMS stays |
| owner-report | skipped | not month end | needs month P&L, budget, last year |

### Cross-check fixes
1. Occupancy: the manager's report showed 81.5%, which is 97 divided by 119 (rooms available minus the out of order room). This flash uses 97 divided by 120 total keys, giving 80.8%, since USALI and STR keep a short term out of order room in inventory. Both figures are shown so this isn't mistaken for an error.
2. Room 512 is a departure today and was the room a VIP repeat guest (Tan Wei Ming) was booked into for arrival, but it is out of order (aircon compressor dead). Not placed on the turnover board for cleaning or resale. Flagged as decision 1 for managers, SOP 03.
3. Room 318 is a same-day flip with two open P1 work orders (door lock, and a newly logged ceiling leak from a guest review). Held off the "ready" path pending both. SOP 16 for the leak.
4. The stayover list (10 rooms) doesn't match what 97 rooms sold minus 15 departures would imply (82). Per the rule that a pasted list stands over a derived count, this gap is flagged to the GM as a missing export, not treated as an oversell or acted on.

### Morning flash (yesterday's close and today)

**Yesterday, 22 Sep**
| Metric | Actual | Budget |
|---|---|---|
| Rooms available (total keys) | 120 | no comparator provided |
| Out of order | 1 (room 512) | no comparator provided |
| Rooms sold, paid | 97 | no comparator provided |
| Comps | not provided, taken as none | no comparator provided |
| Occupancy | 80.8% | 72% |
| Rooms revenue | MYR 29,391.00 | no comparator provided |
| ADR | MYR 303.01 | MYR 300 |
| RevPAR | MYR 244.93 | MYR 216 |
| F&B revenue | MYR 3,120.00 | no comparator provided |
| TRevPAR | MYR 270.93 | no comparator provided |

No last year comparator provided.

**Today, 23 Sep**
- Arrivals: 38 rooms, including 512, 318, 402, 605.
- Departures: 15 rooms (101, 105, 110, 204, 210, 214, 305, 318, 402, 415, 512, 520, 603, 605, 610).
- Out of order: 1, room 512, aircon compressor dead, WO-2609-014, parts eta 25 Sep.
- Same day flips: 318, 402, 605.
- Rooms on the books tonight and rooms left to sell tonight: not computable, the stayover list is incomplete (see cross-check 4).

VIP: Tan Wei Ming, repeat guest, 2 nights, deluxe king, booked into room 512, which is out of order. Action today: room move decision under SOP 03 before arrival.

**Next 7 days:** not provided.

**Risks**
1. Room 512, VIP repeat guest due today, out of order for a dead aircon compressor, parts not due until 25 Sep. Owner: duty manager, 23 Sep.
2. Room 318, same day flip, open P1 door lock plus a newly reported ceiling leak with no attendance recorded. Owner: engineering, 23 Sep.
3. Stayover list (10 rooms) short of the 82 rooms implied by yesterday's figures; rooms on the books tonight unconfirmed. Owner: front office, 23 Sep.

**Three decisions**
1. Move Tan Wei Ming out of room 512 to another deluxe king before arrival. Yes: reassign now, cost not provided. No: risk walking a VIP on arrival, cost not provided.
2. Hold room 318 out of tonight's saleable inventory until the lock and leak both close. Yes: one fewer room to sell tonight, cost not provided. No: risk repeating the same defects for today's guest, cost not provided.
3. Confirm engineering has WO-2609-016 for the 318 ceiling leak, since it wasn't on the prior open list. Yes: logged under SOP 16, cost not provided. No: risk it recurs before inspection, cost not provided.

Saved: kpis row for 2026-09-22 appended (32 rows now in hotel-data.json).

### Work orders

**WO-2609-016, Room 318 bathroom ceiling, P1**
Opened: not given. SLA due: not given, time reported not given. Status: open. Assignee: not given. Cost: null.

Dispatch message: "The Ampang Row Hotel, Room 318 bathroom ceiling, P1: guest reported water leaking onto the bathroom floor overnight, towels were used to contain it. Find the source of the leak. Isolate the water supply feeding that bathroom. Check for wet electrics before anyone enters, SOP 16. Access window not provided, front desk to confirm. Contact +60 3 0000 0000. Done is a photo of the dry ceiling and floor." (message drafted, not sent yet)

Note: WO-2609-014 and WO-2609-015 are both past their pasted SLA due times (21 Sep, 15:10 and 17:30) and still open/in progress; flagged to maintenance, not closed by this run.

Saved: WO-2609-016 appended (7 rows now in hotel-data.json).

### Turnover board

Header: 15 departures, 10 stayovers named, 38 arrivals, 1 out of order, 3 attendants (siti 8h, ravi 8h, mei 4h).

Ready rule: no room is ready until its photo set is posted and a supervisor has ticked the inspection list (SOP 10).

**Conflicts / flags at top**
- Room 512: departure today, out of order, and the room a VIP arrival was booked into. Excluded from cleaning and tonight's sellable count.
- Stayover list (10 rooms) looks short against the 82 implied by yesterday's figures; credit totals below may be understated if more rooms are due.
- Room types: only room 512 (deluxe king) is known from the paste; all other rooms show "type not given."

**Same-day flips:** 318, 402, 605 (arrival and departure times not given, so the under-4-hour threshold couldn't be confirmed; flagged anyway per the paste).

**Assignments** (1 credit = 30 min; departure 1 credit, stayover 0.67 credit, since types aren't given the suite/family 1.5 multiplier wasn't applied)
| Attendant | Capacity | Rooms | Credits used |
|---|---|---|---|
| Siti (8h) | 16 | 101, 105, 110, 102, 103, 204, 210, 214, 207, 305, 318, 301, 309 | 11.35 |
| Ravi (8h) | 16 | 402, 415, 410, 520, 501, 507 | 5.01 |
| Mei (4h) | 8 | 603, 605, 610, 601, 608 | 4.34 |

No shortfall, all attendants within capacity. Room 512: out of order, not assigned.

Inspection list (9 items): bathroom clean and dry, bed linen fresh and tight, no hair on any surface, amenities at par, bins empty and lined, wifi and TV on, aircon or heating set to the standard, safe open and empty, nothing left from the previous guest.

No delta from this job (morning board emits none).

### Review replies

1. **Google, 5 stars, Priya S**, praise.
Reply: "Thank you, Priya, for the five stars and for mentioning breakfast. We're glad Aina made your check in easy. We hope to welcome you back to The Ampang Row Hotel soon.
Aina, Front Office Manager"
Private note: none.

2. **Booking.com, 6.0, J. Morris**, facility miss, water leak.
Reply: "Thank you for staying with us, J. Morris, and for letting us know about the ceiling leak in your bathroom. We are sorry it left you dealing with towels on the floor overnight, that is not the stay we want for our guests. We appreciate you taking the time to tell us.
Aina, Front Office Manager"
Private note: matches WO-2609-016, room 318, points to SOP 16. Owner: engineering. Date: 23 Sep.

3. **Agoda, 7.5, Kenji**, service miss, check-in wait.
Reply: "Thank you, Kenji, for the kind word about our location. We are sorry check in took 25 minutes on your visit, that is longer than we want it to be. We hope to welcome you back to The Ampang Row Hotel soon.
Aina, Front Office Manager"
Private note: no PMS trace given to confirm queue length. Owner: front office manager. Date: 23 Sep.

No escalations.

Batch tally: 3 reviews. Positive themes: breakfast (1), front desk staff (1), location (1). Negative themes: facility/leak (1), slow check-in (1).

Reviews delta not written: each platform's displayed overall rating and total review count weren't pasted, only this batch's individual review ratings.

## Team message drafts
- Managers: "Draft is waiting in Ampang Row duty managers (WhatsApp). Open Beeper, check it, press send."
- Housekeeping: "Draft is waiting in Ampang Row housekeeping (WhatsApp). Open Beeper, check it, press send."
- Maintenance: "Draft is waiting in Ampang Row engineering (WhatsApp). Open Beeper, check it, press send."

All three are drafts, not sent, say "send it straight away" for any of them and I'll send it. The dashboard rebuilds itself from the updated hotel-data.json since `open-conxi dashboard` is already running.

**Still open, needs your input:** the full stayover export (only 10 of an implied 82 rooms were named), and confirmation on whether to move Tan Wei Ming out of room 512 before he arrives.
