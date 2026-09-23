---
name: ota-reconciliation
description: Monthly reconciliation of each OTA's statement (Booking.com, Expedia, Agoda, Trip.com, others) against the PMS: stays consumed, gross, commission, adjustments, expected versus received remittance, variances over one percent, chargebacks, and the effective commission per channel. Use when someone says "reconcile Booking.com", "OTA statement", "commission check", "Expedia payout", "Agoda invoice", "channel costs", "did we get paid".
---

# OTA reconciliation

Run order: hotel-setup, hotel-dashboard, then this skill. Monthly, after each OTA statement arrives.

## 1. Paste in
- Per OTA, the month's statement: Booking.com extranet, Finance, Invoices and Reservation statements; Expedia Partner Central, Payments or Invoices; Agoda YCS, Finance; Trip.com, Finance. Need reservation ID, guest, dates, gross, commission, adjustments, payout.
- PMS list of departed stays for the month by channel with reservation ID and folio total (OPERA Cloud: Reports, Departures by market or source; Cloudbeds: Reports, Reservations by source; Mews: Reports, Reservations by origin).
- Bank or payment processor lines for OTA remittances and virtual card settlements.
- `hotel-profile.md` for currency and OTAs.
- Missing the bank lines: reconcile statement to PMS only and mark remittance unverified.
- Only one OTA or only a question ("is the commission right"): still open hotel-profile.md first, then reconcile what was pasted and name the other statements the month needs.
- A statement in another currency: convert at the rate the statement or remittance shows, and say which rate was used; if none is shown, reconcile in the statement currency and say so.

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. Match each statement line to a PMS stay by reservation ID, then by guest and dates. Unmatched lines on either side go to an exceptions list.
2. For matched stays: compare gross, compute commission percent, list adjustments (no-show, cancellation, refund, promotion cost). Flag any stay where statement gross differs from folio room revenue by more than 1 percent.
   No-shows and cancellations: the folio is the truth. If the folio shows nothing collected, the hotel earned nothing and nothing is posted to the PMS after the fact; never post uncollected revenue to make a statement tie. A no-show or cancelled stay that carries commission on the statement is a dispute line (most OTAs waive commission when the hotel marks the no-show inside their reporting window, usually 48 hours after the arrival date), and the remittance shortfall it causes is expected, not a missing payment.
3. Expected remittance = gross minus commission minus adjustments. Compare to received. Flag variance over 1 percent of expected.
4. Effective commission per channel = (commission plus promotion costs plus payment fees) divided by gross. This is the number to compare channels on, not the headline rate. If promotion costs or payment fees were not pasted, report commission over gross and label it "commission only". Channel share needs total revenue across all channels for the period; if that was not pasted, share is null.
5. Chargebacks and virtual card failures: list each with amount, reason, and the evidence to submit.
6. Exceptions list with a next action for each: dispute with the OTA, correct the PMS, write off with a reason and a name.
7. OTA programme terms (Genius, Preferred, VIP levels, extra points for visibility) come only from the paste or `references/evidence.md`; never state one from memory.

## 3. Checklist
DO-CONFIRM, before the month is closed.
- [ ] Every statement line is matched or on the exceptions list.
- [ ] Every PMS OTA stay is matched or on the exceptions list.
- [ ] Commission percent per stay matches the contract rate or the difference is explained.
- [ ] Remittance received equals expected within 1 percent or a dispute is opened.
- [ ] Effective commission per channel is computed with promotion and payment costs included.
- [ ] Every write-off has a reason and a name.
- [ ] No uncollected no-show or cancellation revenue was posted to the PMS; each is on the dispute list instead.
- [ ] Totals tie: statement gross minus commission minus adjustments equals expected remittance.

## 4. Check yourself
- Matched plus exceptions equals total lines on each side.
- Sum of expected remittances equals sum of statement payouts before variances.
- Effective commission is between the headline rate and headline plus 10 points; if not, show why.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; no long or short dash characters (wider than a hyphen) anywhere, titles and headings included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date; before replying, search the whole reply for them and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Per-OTA summary table (stays, gross, commission, effective commission, adjustments, expected, received, variance). Exceptions table with next actions. Chargeback list. Then:

hotel-data delta
```json
{"channels": [{"channel": "<OTA>", "share": null, "effective_commission": 0.0, "basis": "all_costs", "period": "<YYYY-MM>", "source": "ota-reconciliation"}]}
```
Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). Then read the file back and report the rows added and replaced from what you read. Never say the file was updated unless you wrote it in this turn. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.
Write the whole row, not just the changed field: a row with the same channel and period replaces the old one completely, so `share` is null unless total revenue by channel for the period was pasted, even if the old row had one. `basis` is "all_costs" when promotion costs and payment fees were included, "commission_only" when they were not. Always print the per-OTA summary table and the delta block, even when only one OTA was pasted.

## 6. Still manual in your systems
Downloading each statement, exporting the PMS list, matching line by line, raising each dispute in the OTA's finance portal, and posting corrections in the PMS. Conxi (conxi.ai) does these steps inside your systems for you.
