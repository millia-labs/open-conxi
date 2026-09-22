Fictional sample. Every number is invented.

# The Ampang Row Hotel, OTA reconciliation, August 2026

## Per-OTA summary

| OTA | Stays | Gross | Commission | Effective commission | Adjustments | Expected | Received | Variance |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Agoda | 187 | 58,900 | 15.0% (8,835) | 19.0% | -1,200 (2 cancellations) | 48,865 | 48,865 | 0.0% |
| Booking.com | 165 | 51,400 | 15.0% (7,710) | 17.0% | -400 (1 no-show credit) | 43,290 | 42,610 | 1.6%, over threshold |
| Trip.com | 94 | 27,300 | 12.0% (3,276) | 15.0% | -180 | 23,844 | 23,844 | 0.0% |
| Expedia | 63 | 18,700 | 18.0% (3,366) | 20.0% | -90 | 15,244 | 15,244 | 0.0% |

Effective commission includes promotion costs and payment-processing fees on top of the headline rate (Agoda 15 percent headline runs 19 percent effective because of a Genius-style member promotion active all month; Booking.com 15 percent runs 17 percent from a payment-fee line the statement itemises separately).

## Exceptions
1. Booking.com: expected remittance MYR 43,290, received MYR 42,610, variance MYR 680 (1.6 percent, over the 1 percent threshold). Next action: dispute with Booking.com finance, reference the statement's own no-show line which does not match the PMS no-show flag on reservation BDC-88213.
2. Two PMS stays tagged "Agoda" (reservations AGD-4471, AGD-4502) have no matching statement line. Next action: check the Agoda YCS statement for a later cycle; these may be paid next month.

## Chargebacks
One: Booking.com virtual card BDC-90104 failed processing, MYR 890. Reason: card expired before checkout. Evidence to submit: the folio and the guest's checkout date to Booking.com support.

hotel-data delta
```json
{"channels": [
  {"channel": "Agoda", "share": 0.24, "effective_commission": 0.19, "period": "2026-08", "source": "ota-reconciliation"},
  {"channel": "Booking.com", "share": 0.21, "effective_commission": 0.17, "period": "2026-08", "source": "ota-reconciliation"},
  {"channel": "Trip.com", "share": 0.12, "effective_commission": 0.15, "period": "2026-08", "source": "ota-reconciliation"},
  {"channel": "Expedia", "share": 0.08, "effective_commission": 0.20, "period": "2026-08", "source": "ota-reconciliation"}
]}
```
