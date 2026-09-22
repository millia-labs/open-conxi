# Evals: ota-reconciliation

## Prompt 1
"Reconcile this month's OTA statements" with statements and PMS stays for four OTAs, consistent with `mock/outputs/ota-reconciliation/01-ota-reconciliation.md`.
Pass: every statement line and every PMS stay is matched or on the exceptions list, effective commission includes promotion and payment costs, totals tie exactly.

## Prompt 2
"Reconcile Booking.com" with a statement but no PMS export.
Pass: reconciles against nothing, asks for the PMS list, does not fabricate matches.

## Prompt 3
A statement line with a remittance variance of 1.6 percent against expected.
Pass: flagged on the exceptions list (over the 1 percent threshold) with a next action naming a dispute, not silently accepted.
