Fictional sample. Every number is invented.

# hotel-dashboard, sample run

**Pasted in:** `mock/hotel-profile.md`, `mock/hotel-data.json` (a fictional August 2026 close, October pace, one month of channels and reviews, six work orders, eight scorecard rows).

**Rendered:** `dashboard.html` in this folder. Title reads "The Ampang Row Hotel". Latest KPI tile (31 Aug 2026): occupancy 77.8 percent against budget 72.0 (+5.8 pts), ADR MYR 291 against budget 300 (-9), RevPAR MYR 226 against budget 216 (+10), TRevPAR MYR 266. Pace chart shows 30 October dates from 38 to 96 rooms on the books. Channel mix: Direct 35.0 percent at 3.0 percent effective commission, Agoda 24.0 percent at 19.0, Booking.com 21.0 percent at 17.0, Trip.com 12.0 percent at 15.0, Expedia 8.0 percent at 20.0. Five review rows, five open work orders (two P1, three P2), eight scorecard rows including "Review rating (Google)" at 4.4 against a target of 4.5.

**Panel status:**
1. KPI tiles: filled, from morning-flash / owner-report.
2. Pace chart: filled, from rate-check.
3. Channel mix: filled, from ota-reconciliation.
4. Reviews: filled, from review-replies.
5. Open work orders: filled, from work-orders.
6. Scorecard: filled, from turnover-board, work-orders, review-replies, staff-roster, ota-reconciliation, owner-report.

Verified in a browser before shipping: no console errors, every tile carries a comparison, review rating shows one decimal (4.4, not rounded to 4).
