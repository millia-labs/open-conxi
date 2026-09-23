---
name: hotel-dashboard
description: Builds the hotel's one-file KPI dashboard (occupancy, ADR, RevPAR, pace, channel mix, reviews, work orders, scorecard) from hotel-data.json and re-renders it after any other Open Conxi skill runs. Use when someone says "build the dashboard", "refresh the dashboard", "show me the numbers", "KPI page", "owner view", or right after hotel-setup.
---

# Hotel dashboard

Run order: hotel-setup first, this skill second, then any job skill. Re-run this skill whenever a job skill has produced a hotel-data delta.

## 1. Paste in
- `hotel-profile.md` (required; if missing, stop and run hotel-setup).
- `hotel-data.json` from the working folder. In Claude Code every job skill saves its own rows there, so the file is the source of truth. Also any `hotel-data delta` blocks printed earlier in this conversation (in claude.ai these may not be saved yet; in Claude Code they usually are, and merging them again changes nothing).
- Optional on first run: yesterday's night audit or manager's report (OPERA Cloud: Reports, Manager Report; Cloudbeds: Reports, Daily Summary; Mews: Reports, Accounting Summary) so the first dashboard is not empty. Take rooms sold, revenue, occupancy, ADR from it and write one `kpis` row.

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. If `hotel-data.json` does not parse, tell the GM in one plain line ("Your data file has a typing mistake in it, I can fix it"), copy it to hotel-data.bak.json, fix only the broken characters, and say what changed in plain words. Never start a fresh file over the old one. Merge: start from `hotel-data.json`, apply each delta in order. Rows are keyed (kpis by date, pace by stay_date, channels by channel and period, reviews by platform and period, work_orders by id, scorecard by name and week, see `docs/SCHEMA.md`). A delta row with the same key as an existing row replaces it; a new key is appended; nothing is deleted. Count the rows replaced and say so in the reply. Set `updated_at` to now. Set `hotel.name` and `hotel.currency` from the profile.
2. Load `templates/dashboard.html` from this skill folder. Replace the contents of `<script id="hotel-data" type="application/json">` with the merged JSON. Change nothing else.
3. In Claude Code: write `dashboard.html` and the merged `hotel-data.json` to the working folder, then open `dashboard.html`. Tell the GM that `npx open-conxi dashboard`, run in this folder, keeps the page current after every skill without re-running this one. In claude.ai: render the HTML as an artifact and print the merged `hotel-data.json` for the GM to save.
4. Under the dashboard, list which panels are empty, counted from the rows in the file, and which skill fills each. Write for a GM, not a developer: no words like JSON, template or script block in the reply.

## 3. Checklist
DO-CONFIRM, after rendering.
- [ ] Title shows the hotel name from the profile, not "Hotel dashboard".
- [ ] Every KPI tile carries a comparison or says "vs budget" is unavailable.
- [ ] Percentages in the JSON are fractions (0.86), not 86.
- [ ] Currency label matches the profile.
- [ ] Rows after the merge = rows before + new keys, and every replaced key is listed in the reply.
- [ ] No 0 stands in for an unknown; unknowns are null and the tile shows n/a.
- [ ] Empty panels name the skill that fills them.

## 4. Check yourself
- The embedded JSON parses. Run it through a JSON parser before writing the file.
- Row counts per array equal the file's rows plus the deltas' new keys; no two rows share a key.
- The template was not edited beyond the JSON block.
- If the profile is missing, the output is one line: run hotel-setup.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded, dispatched, called, contacted, shared, posted) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; names exactly as given, in the same script, with no title that assumes gender; no long or short dash characters (wider than a hyphen) anywhere, titles, headings and table cells included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date, and write "none" in an empty cell; search every reply for them before you send it, a one-line question or a stop included, and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
The rendered dashboard (artifact or `dashboard.html`), the merged `hotel-data.json` in a fenced block, and a five-line panel status list. This skill emits no delta of its own.

## 6. Still manual in your systems
Nothing goes back into the PMS from this page. The numbers on it came from exports a person pasted; a fresh export is needed each time. Conxi (conxi.ai) reads the PMS itself and keeps this page current without the pasting.
