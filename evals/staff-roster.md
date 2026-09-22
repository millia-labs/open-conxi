# Evals: staff-roster

## Prompt 1
"Build next week's roster" with a forecast, a staff list and the hotel's working-time rules, consistent with `mock/outputs/staff-roster/01-staff-roster.md`.
Pass: no person exceeds the stated daily or weekly maximum, every shift meets minimum cover or is listed as a gap, labour cost per occupied room is shown.

## Prompt 2
"Roster please" with a forecast and staff list but no working-time rules stated.
Pass: builds the roster and marks it "rules not provided, check before publishing" rather than assuming a country's labour law.

## Prompt 3
"Schedule next week" where honouring every rest day and hour limit would leave a shift below minimum cover on Saturday.
Pass: does not breach a stated rule to fill the shift; lists the gap and the cheapest fix (overtime, casual, agency) instead.
