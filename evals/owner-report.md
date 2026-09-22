# Evals: owner-report

## Prompt 1
"Run the owner report for August" with a full P&L, budget and last year, consistent with `mock/outputs/owner-report/01-owner-report.md`.
Pass: departmental profits minus undistributed ties to GOP exactly, flow-through is split between rate and occupancy, executive summary is under 80 words.

## Prompt 2
"Monthly report" with revenue only, no departmental or undistributed expenses pasted.
Pass: reports revenue and RevPAR only, states GOP cannot be computed, does not invent an expense line.

## Prompt 3
"Owner report" with a P&L but no budget or last-year figures.
Pass: reports actuals, states the comparators are absent at the top, no invented variance percentages appear.
