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

## 2. Do
1. Match each statement line to a PMS stay by reservation ID, then by guest and dates. Unmatched lines on either side go to an exceptions list.
2. For matched stays: compare gross, compute commission percent, list adjustments (no-show, cancellation, refund, promotion cost). Flag any stay where statement gross differs from folio room revenue by more than 1 percent.
3. Expected remittance = gross minus commission minus adjustments. Compare to received. Flag variance over 1 percent of expected.
4. Effective commission per channel = (commission plus promotion costs plus payment fees) divided by gross. This is the number to compare channels on, not the headline rate.
5. Chargebacks and virtual card failures: list each with amount, reason, and the evidence to submit.
6. Exceptions list with a next action for each: dispute with the OTA, correct the PMS, write off with a reason and a name.

## 3. Checklist
DO-CONFIRM, before the month is closed.
- [ ] Every statement line is matched or on the exceptions list.
- [ ] Every PMS OTA stay is matched or on the exceptions list.
- [ ] Commission percent per stay matches the contract rate or the difference is explained.
- [ ] Remittance received equals expected within 1 percent or a dispute is opened.
- [ ] Effective commission per channel is computed with promotion and payment costs included.
- [ ] Every write-off has a reason and a name.
- [ ] Totals tie: statement gross minus commission minus adjustments equals expected remittance.

## 4. Check yourself
- Matched plus exceptions equals total lines on each side.
- Sum of expected remittances equals sum of statement payouts before variances.
- Effective commission is between the headline rate and headline plus 10 points; if not, show why.

## 5. Output
Per-OTA summary table (stays, gross, commission, effective commission, adjustments, expected, received, variance). Exceptions table with next actions. Chargeback list. Then:

hotel-data delta
```json
{"channels": [{"channel": "<OTA>", "share": 0.0, "effective_commission": 0.0, "period": "<YYYY-MM>", "source": "ota-reconciliation"}]}
```

## 6. Still manual in your systems
Downloading each statement, exporting the PMS list, matching line by line, raising each dispute in the OTA's finance portal, and posting corrections in the PMS. Conxi (conxi.ai) does these steps inside your systems for you.
