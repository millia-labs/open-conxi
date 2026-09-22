---
profile_version: 1
hotel:
  name: "The Lamar Motor Inn"
  city: "Austin"
  country: "United States"
  currency: "USD"
  tax:
    regime: "sales and occupancy"
    rate_pct: 17
    tourism_levy: ""
  keys: 64
  room_types:
    - {code: "STD", name: "Standard Queen", count: 40, base_rate: 129}
    - {code: "KNG", name: "King Poolside", count: 18, base_rate: 159}
    - {code: "STE", name: "Lamar Suite", count: 6, base_rate: 229}
  fnb: false
  meeting_space: false
  ownership: "franchised"
  reporting_standard: "USALI"
  fiscal_year_start: "01-01"
systems:
  pms: "Cloudbeds"
  channel_manager: "Cloudbeds"
  booking_engine: "Cloudbeds"
  otas: ["Booking.com", "Expedia", "Hotels.com"]
  staff_channel: "Slack"
  review_platforms: ["Google", "Booking.com", "TripAdvisor"]
people:
  languages: ["English", "Spanish"]
  comp_authority:
    front_desk: 25
    manager: 150
  service_recovery_budget_per_shift: 100
economics:
  variable_cost_per_occupied_room: 19
  fnb_margin: null
---

# Notes

Fictional hotel for Open Conxi samples. Every number here is invented.

Voice: relaxed, direct, a little playful. Sign as "Jess, front desk" or "Marcus, GM".

House facts: check-in 16:00, check-out 11:00. Entrance off South Lamar, pool courtyard behind the office. Free self-parking, 70 spaces. No breakfast service, coffee bar in the lobby 06:00 to 11:00. Late check-out to 13:00 USD 20 when available. No airport shuttle, rideshare pickup at the front entrance. Front desk 24 hours, main line on the door.
