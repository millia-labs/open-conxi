# Data files

Two files, kept by the hotel, never committed to this repo. In Claude Code they live in the working folder. In claude.ai the GM saves them into the Project's knowledge when a skill asks.

## hotel-profile.md

YAML block, then prose notes.

```yaml
profile_version: 1
hotel:
  name: ""
  city: ""
  country: ""            # ISO 3166 name
  currency: ""           # ISO 4217, e.g. MYR
  tax:
    regime: ""           # e.g. SST, GST, VAT, sales+occupancy
    rate_pct: 0
    tourism_levy: ""     # e.g. "MYR 10 per room night", or ""
  keys: 0
  room_types:            # list
    - code: ""
      name: ""
      count: 0
      base_rate: 0
  fnb: false
  meeting_space: false
  ownership: ""          # owner-operated, leased, managed, franchised
  reporting_standard: "" # USALI or local
  fiscal_year_start: ""  # e.g. "01-01"
systems:
  pms: ""                # OPERA Cloud, Cloudbeds, Mews, other
  channel_manager: ""
  booking_engine: ""
  otas: []               # Booking.com, Expedia, Agoda, Trip.com, Traveloka, other
  staff_channel: ""      # WhatsApp, Line, Slack, email
  review_platforms: []   # Google, Booking.com, Agoda, Trip.com, TripAdvisor
people:
  languages: []
  comp_authority:        # who may give what without approval
    front_desk: 0        # in currency
    manager: 0
  service_recovery_budget_per_shift: 0
```

## hotel-data.json

One JSON object. Each skill appends to its array and updates `updated_at`. `hotel-dashboard` reads the whole file.

```json
{
  "schema_version": 1,
  "profile_ref": "hotel-profile.md",
  "updated_at": "2026-09-22T09:00:00+08:00",
  "kpis": [
    {"date": "2026-09-21", "rooms_sold": 0, "occupancy": 0.0, "adr": 0, "revpar": 0, "trevpar": null, "gop": null,
     "budget": {"occupancy": 0.0, "adr": 0, "revpar": 0}, "last_year": {"occupancy": 0.0, "adr": 0, "revpar": 0},
     "source": "morning-flash"}
  ],
  "pace": [
    {"stay_date": "2026-10-01", "otb_rooms": 0, "otb_adr": 0, "pickup_7d": 0, "cancellation_adjusted_otb": 0, "source": "rate-check"}
  ],
  "channels": [
    {"channel": "Booking.com", "share": 0.0, "effective_commission": 0.0, "period": "2026-08", "source": "ota-reconciliation"}
  ],
  "reviews": [
    {"platform": "Google", "rating": 0.0, "count": 0, "period": "2026-09", "top_positive": [], "top_negative": [], "source": "review-replies"}
  ],
  "work_orders": [
    {"id": "WO-0001", "priority": "P1", "opened": "2026-09-21", "sla_due": "2026-09-21T18:00", "status": "open", "location": "", "cost": 0, "source": "work-orders"}
  ],
  "scorecard": [
    {"name": "Rooms ready by 15:00", "value": 0.0, "target": 1.0, "owner": "", "week": "2026-W39", "source": "turnover-board"}
  ]
}
```

Rules: currency values are plain numbers in the profile's currency. Percentages are fractions (0.86, not 86). Dates are ISO. A skill never rewrites another skill's rows.
