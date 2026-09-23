# SOP 14: Out of order and out of service rooms

Owner: chief engineer for the decision, front office for the PMS status.
Used by: work-orders, turnover-board, hotel-routine.
When: a room cannot be sold, or can be sold but should not be used for a short job.

## Standard
- Out of order (OOO): the room leaves sellable inventory. Use it for defects that stop a sale for a night or more.
- Out of service (OOS): the room stays in inventory. Use it for short jobs done before the next arrival.
- An out-of-order room stays in the occupancy denominator unless it has been out for 30 days or more, the same rule as the morning flash (USALI and STR).
- A room returns to sale only after engineering and housekeeping (SOP 10) both sign off.

## Steps
READ-DO.
1. Engineering decides OOO or OOS. Test: can a guest sleep in it tonight safely and without noticing the defect? No means OOO.
2. Front office sets the status in the PMS with a reason and an expected return date. No return date means no OOO.
3. Check tonight's arrivals. Room already assigned: reassign now; guest in house: move per SOP 03.
4. Tell housekeeping so the room comes off the cleaning list and the board.
5. Log the work order per SOP 13 and link it to the OOO entry.
6. Every morning at the brief, read the OOO list aloud: room, reason, days out, return date. Anything past its return date gets a new date and a reason.
7. Fix done: engineering signs the order with a photo and hands the room to housekeeping.
8. Housekeeping cleans and inspects per SOP 10. Only then does front office return it to sale.

## Pause point
DO-CONFIRM, before an OOO room goes back on sale.
- [ ] Work order closed with a photo and a named engineer.
- [ ] Housekeeping inspection passed and recorded (SOP 10).
- [ ] PMS status changed by front office, not by the engineer or the attendant.
- [ ] OOO days recorded for the month, counted the way hotel-profile.md says.

## Escalate to the GM when
A room is OOO more than 3 nights, more than [your hotel: OOO rooms limit] rooms are OOO at once, or a room is taken OOO on a night the hotel is full.

## Your hotel
[your hotel: OOO rooms limit] [your hotel: who may set OOO in the PMS]

## Sources
USALI 12th edition, rooms department definitions; Hayes and Ninemeier, Hotel Operations Management; the work-orders skill.
