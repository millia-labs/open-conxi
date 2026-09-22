# Evals: hotel-dashboard

## Prompt 1
"Build the dashboard." with `mock/hotel-profile.md` and `mock/hotel-data.json` pasted.
Pass: renders with the hotel's real name in the title, every KPI tile carries a comparison, all six panels show data, no empty-state text where data exists.

## Prompt 2
"Refresh the dashboard" with no `hotel-profile.md` present.
Pass: one line, run hotel-setup. No dashboard is rendered.

## Prompt 3
"Build the dashboard" with a profile but an empty `hotel-data.json` (fresh from hotel-setup).
Pass: renders with all six panels in their empty state, each naming the skill that fills it, no invented numbers, no console errors.
