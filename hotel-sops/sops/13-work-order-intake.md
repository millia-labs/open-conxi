# SOP 13: Work order intake

Owner: chief engineer, and the duty engineer on shift.
Used by: work-orders.
When: anyone reports a defect: a guest, an attendant, the desk, a walk round, a PM check.

## Standard
- Every defect gets a priority from the work-orders definitions, quoted here:
- P0: safety, fire, flood, lift entrapment, no power or water to a floor, a guest cannot be housed. Mitigate within 1 hour, restore per plan.
- P1: a defect in an occupied or sold room that a guest will notice (aircon, hot water, lock, TV, leak). Fix within 8 hours or move the guest.
- P2: cosmetic or minor, unsold room or public area (paint, grout, loose fitting, flicker). Within 7 days.
- P3: preventive or scheduled. Next window.
- Logged before it is fixed. A fix with no order did not happen.
- A guest who reported it is told the time it will be fixed, and that time is kept.

## Steps
READ-DO.
1. Take location, what is wrong in the reporter's words, who reported it, the time, photos, and whether a guest is in the room.
2. Person at risk or lift entrapment: front desk acts first (keep talking to the person, call the contractor's emergency line, call the fire service if no release in the time the contractor states), log after.
3. Set the priority from the definitions above. Room occupancy not known: treat it as P1 until the desk confirms the room is unsold.
4. Log it in [your hotel: maintenance app or log] with an ID, opened time, SLA due time from the opened time, assignee and status.
5. Same defect already open: add a note to that order. Keep its ID and due time so a breach stays visible.
6. Guest in the room on a P0 or P1: the desk offers a move first (SOP 03), then comp within the authority in hotel-profile.md. Log the offer.
7. Tell the guest a fix time you can meet. Cannot meet 8 hours on a P1: move the guest, do not stretch the promise.
8. Dispatch the engineer or vendor: location, symptom, priority, access window, contact, and a photo of the fix as proof.
9. Room cannot be sold until fixed: take it out of order per SOP 14.

## Pause point
DO-CONFIRM, before the order is closed.
- [ ] Priority matches the definitions, and any P0 went to the GM at once.
- [ ] SLA due time counts from when it was reported, not from now.
- [ ] What the guest was offered, and by whom, is on the order.
- [ ] Photo of the fix and a named closer are on the order.
- [ ] Same defect twice in 30 days in one location is marked recurring with a root cause line.

## Escalate to the GM when
Any P0; a P1 that will miss its 8 hours; a cost above the manager's comp authority; a defect found twice in 30 days in the same place.

## Your hotel
[your hotel: maintenance app or log] [your hotel: duty engineer phone] [your hotel: vendor emergency lines]

## Sources
The work-orders skill priority definitions and SLAs; Hayes and Ninemeier, Hotel Operations Management, maintenance chapter; Gawande, The Checklist Manifesto.
