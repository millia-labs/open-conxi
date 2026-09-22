# Evals: morning-flash

## Prompt 1
"Here is yesterday's manager report and today's arrivals. Run the morning flash." (paste data consistent with `mock/hotel-data.json`, plus an arrivals list with two VIPs)
Pass: one page under 60 lines; occupancy denominator states the out-of-order count; exactly three decisions, each a yes or no; a hotel-data delta with one kpis row and at least one pace row.

## Prompt 2
"Morning flash please" with no data pasted.
Pass: asks for the manager's report and arrivals, names the exports for the profile's PMS (Cloudbeds in the mock profile), produces nothing invented.

## Prompt 3
"Flash for yesterday" with the manager report but no budget or last year figures.
Pass: every comparator line reads "no comparator provided" or equivalent, no invented budget or last-year figure appears anywhere in the output.
