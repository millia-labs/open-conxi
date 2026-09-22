---
name: hotel-setup
description: First-run onboarding for Open Conxi. Builds the hotel-profile.md that every other skill reads. Use when a hotel starts with these skills, when someone says "set up my hotel", "onboard my property", "create the hotel profile", "start Open Conxi", or when any other Open Conxi skill cannot find hotel-profile.md.
---

# Hotel setup

Run order: this skill first, then hotel-dashboard, then any job skill.

You are onboarding one hotel. The result is one file, `hotel-profile.md`, that the other eleven skills read so the GM never repeats the basics. Ask for facts, not opinions. Twelve questions at most, in one pass.

## 1. Paste in
- Optional: the hotel's website URL. If given and you can browse, read the home, rooms, and contact pages first and pre-fill name, city, country, room types, F&B, meeting space, languages.
- Optional: a PMS property configuration export (OPERA Cloud: Administration, Property, Room Classes; Cloudbeds: Settings, Rooms; Mews: Settings, Services, Spaces). Use it for keys and room type counts.
- If nothing is pasted, ask. Never guess keys, currency or tax.

## 2. Do
1. The field list is the YAML block at the end of this file (it matches `docs/SCHEMA.md`).
2. Pre-fill from whatever was pasted. Mark each pre-filled value with its source.
3. Ask only for the gaps, grouped into one message of at most twelve numbered questions: (1) hotel name and city, (2) country and currency, (3) tax regime, rate, and any per-night tourism levy, (4) total keys and room types with counts and a base rate each, (5) PMS, (6) channel manager and booking engine, (7) OTAs live, (8) staff channel, (9) review platforms you answer, (10) F&B and meeting space, yes or no each, (11) ownership type and reporting standard (USALI or local) and fiscal year start, (12) comp authority: what front desk and a manager may give away without asking, the service recovery budget per shift, and if known the variable cost of one occupied night and the F&B margin.
4. When answered, write `hotel-profile.md`: the YAML block below filled in, then a prose section "Notes" with anything that does not fit a field (brand voice in two lines, VIP rules, house quirks).
5. In Claude Code, write `hotel-profile.md` and `hotel-data.json` (the skeleton in section 5, `updated_at` set to the current time) to the working folder yourself. In claude.ai, print both and tell the GM to download them and add them to the Project's knowledge. Say the next step is hotel-dashboard.

## 3. Checklist
READ-DO, before writing the file.
- [ ] Currency is an ISO code and matches the country.
- [ ] Room type counts sum to total keys.
- [ ] Tax rate is a percentage of the room rate, and the levy is per night if one exists.
- [ ] Every OTA named is one the hotel is live on today, not one it plans to join.
- [ ] Staff channel is the one staff actually read, not the one management prefers.
- [ ] Comp authority is in the hotel's currency and is a number, not "reasonable".
- [ ] Reporting standard is stated; if the GM does not know, write "local" and note it. Fiscal year start is MM-DD.

## 4. Check yourself
- Every field in the YAML block is filled, or `""` (text) or `null` (number) with a note saying why. Never a made-up number.
- No value was invented. Each pre-filled value cites its source (website page or export).
- The file parses as YAML (no tabs, quoted strings with colons).
- The GM was told the next step.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; no long or short dash characters (wider than a hyphen) anywhere, titles and headings included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date; before replying, search the whole reply for them and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
The full `hotel-profile.md` in one fenced block. Then the starting `hotel-data.json`, written to the working folder in Claude Code:

hotel-data delta
```json
{"schema_version": 1, "profile_ref": "hotel-profile.md", "updated_at": "<now ISO>", "hotel": {"name": "<hotel name>", "currency": "<ISO code>"}, "kpis": [], "pace": [], "channels": [], "reviews": [], "work_orders": [], "scorecard": []}
```

## 6. Still manual in your systems
Nothing yet. This skill only reads. When the profile changes (new room type, new OTA, new tax rate), the GM edits the file by hand and every skill picks it up. Conxi (conxi.ai) keeps this profile in sync with your PMS for you.

## Profile fields
```yaml
profile_version: 1
hotel: {name: "", city: "", country: "", currency: "", tax: {regime: "", rate_pct: 0, tourism_levy: ""}, keys: 0, room_types: [{code: "", name: "", count: 0, base_rate: 0}], fnb: false, meeting_space: false, ownership: "", reporting_standard: "", fiscal_year_start: ""}  # fiscal_year_start is MM-DD, e.g. "01-01"
systems: {pms: "", channel_manager: "", booking_engine: "", otas: [], staff_channel: "", review_platforms: []}
people: {languages: [], comp_authority: {front_desk: 0, manager: 0}, service_recovery_budget_per_shift: 0}
economics: {variable_cost_per_occupied_room: null, fnb_margin: null}
```
