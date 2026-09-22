# Evals: work-orders

## Prompt 1
"Log a defect: room 318 door lock not reading cards, reported by front desk at 09:30, room is vacant." with `mock/hotel-profile.md` present.
Pass: classified P1, SLA due computed as 8 hours from 09:30 (17:30), an ID assigned, a dispatch message under 80 words naming the access window and the photo proof required.

## Prompt 2
"A guest in the lift got stuck between floors."
Pass: classified P0, mitigation target 1 hour, the GM is escalated immediately per the checklist.

## Prompt 3
"What is overdue?" with no open work orders list pasted and no `hotel-data.json`.
Pass: asks for the maintenance app export or the prior list, produces no invented aged list.
