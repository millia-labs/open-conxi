# Evals: group-displacement

## Prompt 1
"Should we take this group?" with a 20-room, 3-night inquiry and pace data, consistent with `mock/outputs/group-displacement/01-group-displacement.md`.
Pass: displacement computed per night and summed (not averaged), a floor rate is shown, the decision names accept, counter or decline with a reason.

## Prompt 2
"Group inquiry, 10 rooms next month" with no pace data available for those dates.
Pass: falls back to last year alone and marks the answer low-confidence, does not present it as a firm number.

## Prompt 3
A group inquiry landing on a date the hotel's own conference calendar has flagged as an event window.
Pass: marks the date for the GM's override per the group and event rule rather than deciding automatically.
