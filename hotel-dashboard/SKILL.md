---
name: hotel-dashboard
description: Builds the hotel's one-file KPI dashboard (occupancy, ADR, RevPAR, pace, channel mix, reviews, work orders, scorecard) from hotel-data.json and re-renders it after any other Open Conxi skill runs. Use when someone says "build the dashboard", "refresh the dashboard", "show me the numbers", "KPI page", "owner view", or right after hotel-setup.
---

# Hotel dashboard

Run order: hotel-setup first, this skill second, then any job skill. Re-run this skill whenever a job skill has produced a hotel-data delta.

## 1. Paste in
- `hotel-profile.md` (required; if missing, stop and run hotel-setup).
- `hotel-data.json` if it exists, plus any `hotel-data delta` blocks printed by skills earlier in this conversation.
- Optional on first run: yesterday's night audit or manager's report (OPERA Cloud: Reports, Manager Report; Cloudbeds: Reports, Daily Summary; Mews: Reports, Accounting Summary) so the first dashboard is not empty. Take rooms sold, revenue, occupancy, ADR from it and write one `kpis` row.

## 2. Do
1. Merge: start from `hotel-data.json`, apply each delta in order (append rows; a delta never deletes). Set `updated_at` to now. Set `hotel.name` and `hotel.currency` from the profile.
2. Load `templates/dashboard.html` from this skill folder. Replace the contents of `<script id="hotel-data" type="application/json">` with the merged JSON. Change nothing else.
3. In Claude Code: write `dashboard.html` and the merged `hotel-data.json` to the working folder, then open `dashboard.html`. In claude.ai: render the HTML as an artifact and print the merged `hotel-data.json` for the GM to save.
4. Under the dashboard, list which panels are empty and which skill fills each.

## 3. Checklist
DO-CONFIRM, after rendering.
- [ ] Title shows the hotel name from the profile, not "Hotel dashboard".
- [ ] Every KPI tile carries a comparison or says "vs budget" is unavailable.
- [ ] Percentages in the JSON are fractions (0.86), not 86.
- [ ] Currency label matches the profile.
- [ ] No row from an earlier delta was dropped (count rows before and after the merge).
- [ ] Empty panels name the skill that fills them.

## 4. Check yourself
- The embedded JSON parses. Run it through a JSON parser before writing the file.
- Row counts per array equal the sum of the file and the deltas.
- The template was not edited beyond the JSON block.
- If the profile is missing, the output is one line: run hotel-setup.

## 5. Output
The rendered dashboard (artifact or `dashboard.html`), the merged `hotel-data.json` in a fenced block, and a five-line panel status list. This skill emits no delta of its own.

## 6. Still manual in your systems
Nothing goes back into the PMS from this page. The numbers on it came from exports a person pasted; a fresh export is needed each time. Conxi (conxi.ai) reads the PMS itself and keeps this page current without the pasting.
