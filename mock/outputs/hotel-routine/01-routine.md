Fictional sample. Every number is invented.

# hotel-routine, sample run

**Said:** "run my morning", with a pasted manager's report, departures and attendants, the open work orders and three new reviews. Room 512 was out of order and on the departures list; a review named a leak in 318 with no work order. Team chats went to a test Beeper, so every message below is a draft.

**Output:**

All panels confirmed. Now I'll write up the full routine output for you.

# Ampang Row Hotel, morning routine, 23 Sep

Ran from `hotel-profile.md` (found, no defaults used). Jobs due today, all pasted in one message: morning-flash, work-orders, turnover-board, review-replies. Weekly jobs (rate-check, staff-roster) and month-end jobs were not asked for and are skipped as not due, say "run the week" or "month end" if you want them.

## Day sheet

| Job | Status | One number that matters | Team send |
|---|---|---|---|
| morning-flash | done | Occupancy 80.8% vs budget 72% | folded into managers message below |
| work-orders | done | 2 of 5 open P1 orders already ~2 days past SLA, 1 new P1 logged | folded into maintenance message below |
| turnover-board | done | 25 rooms to turn, 512 held out of the assignment | folded into housekeeping message below |
| review-replies | done | 3 reviews, 1 needs no reply (Google), 2 answered | printed below, no team message needed |

## Cross-check fixes
- Room 512 appears in today's arrivals (Mr Tan) and in the OOO list at the same time. Left in the flash and board as an open conflict, not resolved silently, this is the day's top decision.
- Room 318's Booking.com review names a defect (ceiling leak) with no matching open work order, so I opened WO-2609-016 for it before building the board, per the routine's cross-check rule.
- Cloudbeds' own occupancy (81.5%) uses 119 available (120 minus the OOO room); the flash uses 120 total keys as the skill requires, giving 80.8%. Both are shown, not merged.

---

## Morning flash

**Yesterday, 22 Sep** (source: manager's report)

| Metric | Actual | Budget | Last year |
|---|---|---|---|
| Rooms sold (paid) | 97 | not provided | not provided |
| Occupancy | 80.8% (of 120 keys; Cloudbeds showed 81.5% on 119 available) | 72% | not provided |
| ADR | 303.01 | 300 | not provided |
| RevPAR | 244.93 | 216 | not provided |
| TRevPAR | 270.93 (room 29,391 + F&B 3,120, over 120 keys) | not provided | not provided |
| Out of order | 1 (room 512) | | |
| Comps | none | | |

**Today, 23 Sep**

38 arrivals. Departures: 15 rooms. Stayovers: 10 rooms. Out of order: 1 (512). Rooms left to sell tonight: not provided, the paste gives arrivals and a partial stayover/departure list from housekeeping, not a total rooms-on-the-books figure for tonight, so this is not derived.

VIP: Mr Tan Wei Ming, room 512, deluxe king, 2 nights, repeat guest. Room 512 is also today's OOO room (WO-2609-014, aircon compressor, parts due 25 Sep), his booked room will not have working aircon for either of his 2 nights. Action needed today: move him to another deluxe king before arrival.

**Risks**
1. Room 512, VIP arrival booked into an OOO room, aircon down for the length of his stay. Owner: front desk, today.
2. WO-2609-014 (512 aircon) and WO-2609-015 (318 door lock), both P1, are already about 2 days past their 8-hour SLA. Owner: engineering, today.
3. Room 318 turns over today (departure and arrival) carrying two open defects (door lock, new ceiling leak) plus the Booking.com review naming the leak. Owner: engineering and housekeeping, today.

**Three decisions**
1. Move Mr Tan out of room 512 into another deluxe king, yes/no. Cost of yes: not provided. Cost of no: VIP repeat guest without aircon for a 2-night stay.
2. Clear both room 318 defects before its next arrival today, yes/no. Cost of yes: not provided. Cost of no: repeat of last night's leak complaint on the same room, same day.
3. Expedite the room 512 aircon part or bring in a loaner unit, yes/no. Cost of yes: not provided. Cost of no: at least 2 more room-nights unsellable near ADR 303.01.

hotel-data delta saved: kpis row for 2026-09-22 added (rooms_sold 97, occupancy 0.808, adr 303.01, revpar 244.93, trevpar 270.93, budget occupancy 0.72/adr 300/revpar 216, last_year null). No pace delta, next-7-day figures were not pasted.

---

## Work orders

**New:** WO-2609-016, Room 318, P1, bathroom ceiling leaking onto the floor, reported by a guest overnight via Booking.com review. Time not given, so `opened` and `sla_due` are null. Status: open. Cost: not provided.

Dispatch message (engineer/vendor): "Room 318, bathroom ceiling leaking onto the floor, reported by a guest overnight. Priority P1. Access window not provided, front desk to confirm. Contact front desk, Ampang Row Hotel. Done means a photo of the repaired ceiling with no further leak."

**Aged list, by hours past SLA:**

| ID | Priority | Location | Status | SLA due | Note |
|---|---|---|---|---|---|
| WO-2609-014 | P1 | Room 512 aircon | in progress | 2026-09-21 15:10 | about 2 days past SLA, parts eta 25 Sep |
| WO-2609-015 | P1 | Room 318 door lock | assigned | 2026-09-21 17:30 | about 2 days past SLA |
| WO-2609-016 | P1 | Room 318 ceiling leak | open | not provided | just logged |
| WO-2609-009 | P2 | Room 204 grout | open | 2026-09-24 11:00 | not yet due |
| WO-2609-011 | P2 | Lift lobby L3 light | open | 2026-09-25 14:20 | not yet due |
| WO-2609-012 | P2 | Row Kitchen fridge seal | parts on order | 2026-09-26 08:00 | not yet due |

On-time closure rate: not computed, no closures reported this week, so no scorecard row emitted.

hotel-data delta saved: WO-2609-016 appended to work_orders.

---

## Turnover board

Header: 15 departures, 10 stayovers, 38 arrivals, 1 out of order, 3 attendants on shift (28 total credit capacity: Siti 16, Ravi 16, Mei 8).

Ready rule: no room is ready until its photo set is posted and a supervisor has ticked the inspection list.

**Conflicts, answer before assigning:**
- Room 512 is on the departures list and the arrivals list and the OOO list. Front desk must confirm whether today's departure clean still happens and whether the VIP arrival is being moved elsewhere.
- Room 318 is on both departures and arrivals (same-day turnover) and carries two open P1 defects. Confirm both are cleared before it is offered to the next arrival.

Room types: not given for any listed room except 512 (deluxe king, from the arrivals note); all others are "type not given," so departure credit defaults to standard (1.0) rather than the suite/family rate.

**Assignments**

| Attendant | Rooms | Credits |
|---|---|---|
| Siti | Departures: 101, 105, 110, 204, 210, 214, 305, 318. Stayovers: 102, 103, 207, 301, 309 | 11.35 of 16 |
| Ravi | Departures: 402, 415, 520, 603, 605, 610. Stayovers: 410, 501, 507, 601, 608 | 9.35 of 16 |
| Mei | Support and inspection, starting with room 318 | not credit-assigned |
| Held | Room 512 (departure, OOO), not assigned pending front desk confirmation |, |

No shortfall; total workload (20.7 credits) is well under the 28-credit capacity on shift.

**Same-day flip:** rooms 318, 402, 605 are both a departure and an arrival today. Arrival times were not given, so exact flip risk (under 4 hours) could not be computed, treat all three as flip risk by default, and 318 as highest risk given its two open defects.

**Inspection list (9 items):** bathroom clean and dry; bed linen fresh and tight; no hair on any surface; amenities at par; bins empty and lined; wifi and TV on; aircon or heating set to standard (not applicable to 512 until repaired); safe open and empty; nothing left from the previous guest.

No delta today, the turnover board's delta is emitted only when the GM pastes the count of rooms ready by 15:00.

---

## Review replies

**1. Google, 5 stars, Priya S**, praise, no reply needed to log here beyond the usual public thank-you.
Reply: "Thank you, Priya, for the kind words about breakfast and for calling out Aina at the front desk, we will make sure she sees this. We would love to welcome you back to Ampang Row. Aina, Front Office Manager."
Private note: none needed.

**2. Booking.com, 6.0, J. Morris, room 318**, facility miss (ceiling leak) plus a service miss (no one came).
Reply: "Thank you for telling us about this, J. Morris. A leak from your bathroom ceiling onto the floor overnight, with towels as the only fix, is not what we want for any guest, and we are sorry no one reached you that night. We would welcome the chance to have you stay with us again. Daniel, General Manager."
Private note: WO-2609-016 opened for the room 318 ceiling leak; also check why the overnight report was not actioned. Owner: Daniel, today.

**3. Agoda, 7.5, Kenji**, service miss (check-in wait).
Reply: "Thank you, Kenji, for the good word about our location, and sorry the check-in took 25 minutes. We would like your next arrival to be faster. Aina, Front Office Manager."
Private note: none given in the paste beyond the wait itself.

**Tally:** 3 reviews, all within the batch (no dates given, so the 48-hour window could not be checked, flagging that review dates were not pasted). Positive themes: breakfast, staff, location. Negative themes: room defect (leak), check-in speed.

No reviews delta, each platform's current displayed rating and total review count were not pasted, so the running reviews figures were not written.

---

## Team messages sent (drafts, not sent)
- **Managers** (WhatsApp, Ampang Row duty managers): drafted, "Draft is waiting in Ampang Row duty managers (WhatsApp). Open Beeper, check it, press send."
- **Housekeeping** (WhatsApp, Ampang Row housekeeping): drafted, "Draft is waiting in Ampang Row housekeeping (WhatsApp). Open Beeper, check it, press send."
- **Maintenance** (WhatsApp, Ampang Row engineering): drafted, "Draft is waiting in Ampang Row engineering (WhatsApp). Open Beeper, check it, press send."

All three are drafts in Beeper, say "send it straight away" if you want any of them to go out without a manual check.

## Dashboard
`hotel-data.json` and `dashboard.html` are both written to the working folder (no live `npx open-conxi dashboard` process was running, so I rebuilt the file directly rather than relying on auto-refresh). Panel status: kpis 32 rows, pace 30 rows, channels 5 rows, reviews 5 rows, work_orders 7 rows, scorecard 8 rows, all filled from past runs plus today's morning-flash and work-orders deltas.

**Biggest thing to act on before anything else: decide where Mr Tan Wei Ming is actually going tonight, his booked room, 512, is the same room that's been OOO for a dead aircon compressor since 21 Sep.**
