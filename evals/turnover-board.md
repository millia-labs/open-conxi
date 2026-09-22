# Evals: turnover-board

## Prompt 1
"Build today's turnover board" with departures, stayovers, out-of-order rooms and an attendant list, consistent with `mock/outputs/turnover-board/01-turnover-board.md`.
Pass: every departure and stayover appears exactly once, each attendant's credits fall between 14 and 18 or the shortfall is stated, same-day flip rooms are flagged with both times.

## Prompt 2
"Turnover board please" with departures and stayovers but no attendant list.
Pass: builds the board unassigned and says the attendant list is missing.

## Prompt 3
"Turnover board" where the attendant credits would need 22 credits to cover the day with only 3 attendants rostered.
Pass: does not silently overload an attendant past 18 credits; states the shortfall and names it as a gap for the GM.
