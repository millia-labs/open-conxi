# Eval results, v0.1.0

Two passes on 22 Sep 2026.

Pass 1 checked that each skill's text contained the instruction each eval depends on. That is a contract check, not a performance test, and it found nothing wrong. It is kept only as a record of what a text inspection misses.

Pass 2 was a cold run. For each skill, a fresh model instance received only the SKILL.md (plus its references folder), the mock hotel profile, and one realistic pasted input that carried a deliberate trap. No other context. The output was then graded against what a hotelier would expect. This is the pass that matters.

## Cold-run results

| Skill | Trap in the input | Result | What the run exposed |
|---|---|---|---|
| hotel-setup | Room counts sum to 34 against a stated 36 keys; reporting standard and fiscal year missing | Pass | Caught the mismatch, asked only the four gaps. Exposed that the skill promised a YAML block "below" that did not exist, so a claude.ai install had no field list. Fixed: the block is now in the file. |
| hotel-dashboard | A morning-flash delta carrying the same date as an existing kpis row, with different numbers | Fail on spec | The append-only merge rule stacked both rows and the headline tile became arbitrary. The model flagged it rather than hiding it. Fixed: rows are keyed and a later row replaces an earlier one; the skill reports replaced rows. |
| morning-flash | No budget, no last year, no cancellation data, two rooms out of order into a near-sellout weekend | Pass | ADR and TRevPAR right, every comparator "not provided", nothing invented, sellout risk flagged. Exposed a wrong rule: excluding out-of-order rooms from the occupancy denominator breaks comparison to budget and comp set. Fixed: denominator is total keys, out-of-order shown on its own line. |
| review-replies | One review alleging a duplicate charge and a bank dispute; one in Chinese; two past 48 hours; one about a room with an open work order | Pass | Escalated the dispute with no public draft, replied in Chinese, flagged the late ones, cross-referenced the work order. Exposed two defects: the reply promised a menu change nobody had approved, and the delta wrote a one-review batch as the platform's rating. Fixed: no unapproved promises; the delta carries the platform's displayed running rating and total count, pasted in. |
| guest-messages | Guest asks for the wifi password and a 12:00 check-in before arrival; neither fact is in the house facts | Pass | Withheld the password, did not invent an early check-in price or a yes, 268 characters. |
| turnover-board | 84 credits of work against 3 attendants; three 2-hour flips; two rooms out of order | Pass | Stated the shortfall, flagged all three flips, excluded the out-of-order rooms. Exposed that "14 to 18 credits" contradicts an 8-hour shift (16 credits) and that the inspection list printed three times. Fixed: capacity is shift hours times 2; list printed once; no scorecard row until end of day. |
| work-orders | Lift entrapment reported at 10:42 | Pass | P0, due 11:42, GM escalation, what front desk does now, dispatch under 80 words. Exposed one invention: "guest is calm and on the intercom" was never reported. Fixed: dispatch text states only what was given. |
| rate-check | GM asks for a 20 percent cut across October; two compression dates, two need dates | Pass | Refused the blanket cut with the evidence, offered channel and inventory levers, used no competitor data. Exposed two defects: the recommended 330 was written into the achieved-rate field, and a date at 80 percent on the books 12 days out was classed normal. Fixed: deltas carry achieved figures only; compression threshold is 75 percent with 10 or more days to go, or top-20-percent pickup. |
| group-displacement | 96 rooms already on the books plus a 30-room group on a 120-key night, while the formula's forecast said 85 | Pass, model beat the spec | Used the larger of forecast and rooms on the books, 6 rooms displaced. Exposed that the skill's formula only used the forecast, and that no floor rate could be computed without a variable cost. Fixed: formula uses the larger figure; the profile gained an economics section with variable cost and F&B margin, with stated defaults. |
| staff-roster | Saturday needs 6.4 attendant shifts with 4 people; occupied rooms not given | Pass on rules, fail on data | Honoured every rule, listed gaps with the cheapest fix. Invented rooms sold as departures plus stayovers and emitted a housekeeping-only figure to the hotel-wide scorecard. Fixed: occupied rooms = stayovers + arrivals or not computed; scorecard row only when every department is rostered. |
| ota-reconciliation | A no-show charged commission on the statement, folio zero, remittance short by exactly that line | Fail on domain | Matched every line and tied the shortfall to the no-show, then advised posting the uncollected fee to the PMS, which overstates revenue. Fixed: folio is the truth, uncollected revenue is never posted, no-show commission goes to the dispute list; share is null without total revenue. |
| owner-report | Budget and last year given only as totals; no rooms-sold count | Pass, best of the set | Every subtotal tied, no line variances invented, flow-through split refused for lack of inputs. Exposed zeros written for unknowns and a margin written as 23.47 not 0.2347. Fixed: unknowns null, ratios as fractions. Also exposed that the shipped sample had the wrong GOP margin (39.6 percent instead of 23.5). Fixed. |

## Counts
Twelve of twelve produced usable output. None invented a comparator. Three invented a fact or figure (a calm guest, a menu change, a rooms-sold count). Six wrote placeholder zeros or copied fields into hotel-data.json. Five skill rules were wrong or missing (occupancy denominator, credit range, compression threshold, displacement formula, no-show handling). One shipped sample had wrong arithmetic.

## What changed as a result
- `docs/CONTRACT.md` gained six output rules: unknown is null, scorecard rows only when final and hotel-wide, deltas carry achieved figures only, no invented facts or promises, plain output style with sign-off only in guest-facing text, regional word pairs.
- `docs/SCHEMA.md` gained row keys with a replace rule, the top-level hotel object the template reads, an economics section in the profile, and the reviews field definition.
- Every skill's section 5 delta now shows null where a value may be unknown.
- The lint now scans every markdown file in the repo for dashes and emojis, not only SKILL.md.

## Re-run after the fixes
Same trap inputs, fresh model instances, the four skills whose rules changed most.

| Skill | Result |
|---|---|
| hotel-dashboard | Pass. 31 kpis rows and 30 pace rows after the merge, one row per key, the newer delta replaced the older, and the reply named the two replaced keys. |
| group-displacement | Pass. Used the larger of forecast and rooms on the books (6 rooms displaced), declared both defaults, gave a numeric floor rate, moved the cutoff to contract signing, no sign-off. |
| ota-reconciliation | Pass. Nothing posted for the uncollected no-show, its commission on the dispute list, the remittance gap explained as expected, share written as null, commission labelled "commission only". |
| staff-roster | Pass on the two fixes: refused to compute labour cost per occupied room without occupied rooms, emitted no scorecard row. Exposed two more things, both fixed: it signed off on a report because the sign-off rule lived only in CONTRACT.md, which a per-skill zip never ships, so every SKILL.md now carries a one-line output rules block; and its fixed hours per room contradicted the hotel's stated standard, so the standard is now the source and the fixed hours the fallback. |

## Samples
Every file in `mock/outputs/` is the output of a real run of the skill on fictional inputs. The turnover-board and morning-flash samples were first patched by hand to the corrected rules, then regenerated cold; the regenerated morning flash corrected two last-year figures the patched version had wrong and added the TRevPAR row the skill requires, and the regenerated turnover board flagged an inconsistency in the test input rather than guessing.

## Automated checks
`python3 scripts/lint.py`: 12/12 skills pass, prose ok. `pytest tests/test_lint.py`: 7 passed. `node --test tests/*.test.js`: 3 passed. `bash scripts/build-zips.sh`: 13 zips.
