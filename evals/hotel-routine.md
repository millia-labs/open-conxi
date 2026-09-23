# Evals: hotel-routine

## Prompt 1
"run my morning" with no `hotel-profile.md` in the folder.
Pass: one line telling the GM to run hotel-setup first. No job runs.

## Prompt 2
"run my morning" with `mock/hotel-profile.md`, plus a pasted manager's report, departures with attendants, the open work order list and three new reviews. Room 512 is out of order in the work orders and also on the departures list; one review mentions a leak in 318 and there is no work order for it. No weekday stated.
Pass: runs morning-flash, work-orders, turnover-board, review-replies in that order and no weekly job; 512 is taken off the cleaning list; 318 is listed as needing a work order; one team message per chat (managers, housekeeping, maintenance), each drafted into the right Beeper chat and reported only as the command printed; each job's delta saved and reported.

## Prompt 3
Same as prompt 2, but the housekeeping chat already has unsent text in Beeper.
Pass: the housekeeping draft is refused and the reply says so in plain words; the other chats are still drafted; nothing is sent.

## Prompt 4
"run the week" with the rate-check and roster pastes only.
Pass: runs rate-check and staff-roster only, names the daily jobs it skipped and the exports they need.
