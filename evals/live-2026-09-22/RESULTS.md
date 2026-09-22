# Live run, 22 Sep 2026 (v0.1.1)

Method. Skills installed with the npx installer into a fictional 42-key hotel folder (Casa do Largo, Porto, EUR). Each skill run in a fresh Claude Code session (Sonnet 5), project settings only, no other skills, triggered by plain hotelier phrasing. Setup ran as a real two-turn conversation. Inputs, with planted traps, are the .txt files in this folder. Chain test: morning-flash, review-replies, work-orders, then "refresh the dashboard" in one conversation, and separately a refresh in a new conversation.

Triggering: 12 of 12 skills fired from plain phrasing.

## Structural
1. Data does not persist between conversations in Claude Code. Job skills print a delta and never write it; hotel-setup prints hotel-data.json and never writes it. A refresh in a new chat finds no data. Merge works inside one chat (3 deltas, 14 rows, 0 lost).
2. Em dashes in nearly every output, including public review replies and the saved hotel-profile.md. Warning and check-mark symbols in headings. The one-line output rule is not enough.

## Rule bugs
3. group-displacement: opportunity cost is displaced revenue gross, group contribution is net of variable cost. Floor came out 181; netting variable cost on both sides gives about 161, lower again net of OTA commission on the displaced transient.
4. morning-flash asks for comps but gives no rule. Runs disagreed (ADR 144 including the comp vs 148 excluding it; occupancy included it both times).
5. staff-roster wrote a scorecard row for a labour cost it said was incomplete (breaks output rule 2).

## Wrong facts
6. morning-flash: "rooms to sell tonight 37" is rooms on the books; 3 were left to sell.
7. turnover-board: dated Tuesday 22 Sep as Monday; missed 206 listed as both stayover and arrival; typed 208 as Twin (it is a Double).
8. guest-messages: read "4 cyclists, 2 Twins" as 6 guests.
9. owner-report: scorecard "Effective OTA commission 10.7%" is commissions over all rooms revenue; the reconciled rate is 17%.

## Invented actions stated as done
10. review-replies: "we've passed your note on", "we've flagged the drain" in public replies.
11. work-orders: dispatch says "power isolated" when nobody said so. Dispatch written in English to a Porto contractor although the profile lists Portuguese.

## Minor
12. hotel-setup wrote fiscal_year_start "January" instead of "01-01".
13. Same input, different priority across runs (402 drain P1 vs P2).

## Held up
Agoda (not live yet) kept off the OTA list; WhatsApp chosen over Slack; allergy plus lawyer review escalated with no public reply; water through a light fitting made P0 with power isolation first; van parking not invented; OTA reconciliation found all three exceptions; owner report arithmetic all correct; roster covered every constraint and priced the real 20h gap; rate-check refused the 99 cut with evidence; group-displacement caught that the free-cancellation window lapses before the decision date.

## Re-run after v0.1.2 (same inputs, fresh sessions, Sonnet 5)

| # | Finding | Result |
|---|---|---|
| 1 | Data lost between chats | Fixed. Setup writes both files. Morning flash, review replies and OTA reconciliation each saved rows in separate chats; a fifth chat's dashboard refresh showed all of them. |
| 2 | Dashes and symbols | Improved, not solved. Zero in review replies, guest messages and vendor dispatches, the text other people read. Still some in internal headings of review-replies, work-orders and guest-messages. No symbols. |
| 3 | Displacement floor | Fixed. Floor 161, matching the worked check. Opportunity cost netted of variable cost; commission not netted when channel shares are unknown, labelled an upper bound. |
| 4 | Comp rooms | Fixed. 33 paid rooms, occupancy 78.6 percent, ADR 148.36, comp on its own line. |
| 5 | Roster scorecard row | Fixed. No row written; says why. |
| 6 | Rooms left to sell | Fixed. 3, with the sum shown. |
| 7 | Turnover weekday, 206, 208 | Fixed. Tuesday, 206 flagged as a conflict, 208 a Double. |
| 8 | Guest count | Fixed. 4 guests, 2 rooms. |
| 9 | Effective OTA commission | Fixed. Row left out of the scorecard; labour cost row left out because payroll was not complete. |
| 10 | Invented actions in replies | Fixed. Replies name the problem and apologise; follow-up only in private notes. |
| 11 | Dispatch language, power isolated | Fixed. Dispatch in Portuguese, no claim that power was cut. |
| 12 | Fiscal year format | Fixed. 01-01. |
| 13 | Priority drift | Fixed by rule. 402 drain P1 with "drops to P2 once confirmed unsold". |

New in the re-run, also fixed: review-replies once claimed a save it had not written (the saving line now requires writing, reading back, and reporting from what was read); six skills never opened hotel-profile.md (a canonical read-the-profile line is now in every skill and enforced by the lint); group-displacement did not open hotel-data.json for commission (now explicit).
