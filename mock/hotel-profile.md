---
profile_version: 1
hotel:
  name: "The Ampang Row Hotel"
  city: "Kuala Lumpur"
  country: "Malaysia"
  currency: "MYR"
  tax:
    regime: "SST"
    rate_pct: 8
    tourism_levy: "MYR 10 per room night for non-Malaysian guests"
  keys: 120
  room_types:
    - {code: "STD", name: "Standard Queen", count: 60, base_rate: 260}
    - {code: "DLX", name: "Deluxe King", count: 40, base_rate: 320}
    - {code: "FAM", name: "Family Twin", count: 14, base_rate: 390}
    - {code: "STE", name: "Row Suite", count: 6, base_rate: 620}
  fnb: true
  meeting_space: true
  ownership: "leased"
  reporting_standard: "USALI"
  fiscal_year_start: "01-01"
systems:
  pms: "Cloudbeds"
  channel_manager: "Cloudbeds"
  booking_engine: "Cloudbeds"
  otas: ["Agoda", "Booking.com", "Trip.com", "Expedia", "Traveloka"]
  staff_channel: "WhatsApp"
  review_platforms: ["Google", "Agoda", "Booking.com", "Trip.com", "TripAdvisor"]
people:
  languages: ["English", "Malay", "Mandarin"]
  comp_authority:
    front_desk: 100
    manager: 500
  service_recovery_budget_per_shift: 600
---

# Notes

Fictional hotel for Open Conxi samples. Every number here and in `mock/outputs/` is invented.

Voice: warm, short, specific. We say what we did, not what we intend. Sign as "Aina, Front Office Manager" or "Daniel, General Manager".

House facts: check-in 15:00, check-out 12:00. Entrance on Jalan Ampang beside the pharmacy. Parking 40 bays, MYR 12 a night. Breakfast 06:30 to 10:30 at Row Kitchen, level 2. Late check-out to 15:00 MYR 80 when available. Airport transfer MYR 150 each way, book by 20:00 the night before. Front desk 24 hours, +60 3 0000 0000.
