# Open Conxi, design spec

Date: 2026-09-22. Status: draft for Mark's review. Nothing built.

## 1. What this is

A public, MIT-licensed set of Claude skills that runs the daily, weekly and monthly work of an independent or small-group hotel (20 to 300 keys, any country). It is the hook for Conxi's cold email to hoteliers: hotels want AI and do not know where to start, here is a free kit that works in Claude today, and Conxi is what you buy when you want the work executed inside your systems instead of pasted into them.

Reference point: msg2ai/hotel-team-skills (eight persona skills, US full-service, Google Drive knowledge base, funnels to msg2ai products). Open Conxi is written from scratch. No text from that repo is reused, so no attribution is owed.

## 2. Who it is for

Any hotel where one person covers several seats. Region-neutral. Country, currency, tax regime, OTA mix, staff channel and labour rules come from the hotel profile, never from the skill text. Asia is one worked example, not the frame.

## 3. Name, home, licence

- Name: Open Conxi. Repo: `millia-labs/openconxi` (org exists, name free on GitHub and npm). MIT.
- Public description in the README is the locked Conxi text, verbatim, plus the founder line: the founders ran a 106-room hospitality operation and launched Conxi in June 2026.

## 4. Install paths, in the order the email reaches people

1. claude.ai: Customize, Skills, upload a zip (Free to Enterprise; needs code execution on). Team and Enterprise admins share one skill to the whole hotel. The repo ships one zip per skill and one all-in zip on every GitHub release. The email links to the release page.
2. Claude Code: `.claude-plugin/plugin.json` at the repo root, `claude --plugin-dir`, and `npx open-conxi install` for a hotel with a tech seat.
3. Paste path: copy a SKILL.md into a Project's instructions.

## 5. Run order and data flow

Skills run in this order on day one, and the order is printed in the README and in every skill's first line.

1. `hotel-setup` (onboarding) writes `hotel-profile.md`.
2. `hotel-dashboard` builds `dashboard.html` from the profile and the first export the GM pastes, and creates `hotel-data.json`, the shared data file.
3. Every other skill reads the profile, does its job, and appends its latest numbers to `hotel-data.json`. Re-running `hotel-dashboard` re-renders from that file.

Two environments, one contract:
- Claude Code: files in the working folder. Skills read and write them directly.
- claude.ai: Claude cannot write to Project knowledge. Each skill therefore prints its `hotel-data.json` delta as a fenced block at the end of its output, and `hotel-dashboard` accepts either the file or pasted blocks from earlier in the conversation. The GM saves `hotel-profile.md` and `hotel-data.json` into the Project when prompted.

`hotel-data.json` schema (v1), documented in `docs/SCHEMA.md`:
- `profile_ref`, `updated_at`
- `kpis[]`: date, rooms_sold, occupancy, adr, revpar, trevpar, gop, budget and last-year comparators, source
- `pace[]`: stay_date, otb_rooms, otb_adr, pickup_7d, cancellation_adjusted_otb
- `channels[]`: channel, share, effective_commission, period
- `reviews[]`: platform, rating, count, period, top_positive[], top_negative[]
- `work_orders[]`: id, priority, opened, sla_due, status, location, cost
- `scorecard[]`: name, value, target, owner, week

## 6. The hotel profile (`hotel-profile.md`)

YAML block on top, prose below. Fields: name, city, country, currency, tax regime and rate, keys, room types with counts, PMS, channel manager, OTAs live, booking engine, staff channel (WhatsApp, Line, Slack, email), languages, F&B yes or no, meeting space yes or no, ownership type, reporting standard (USALI or local), fiscal year start, comp authority limits, service recovery budget. `hotel-setup` reads the hotel website first if a URL is given and pre-fills, then asks the gaps in one pass, no more than twelve questions. Every other skill runs without the profile, on stated defaults.

## 7. The skill contract

Every skill: YAML frontmatter (`name` equals folder name, `description` carries trigger phrases), under 150 lines, six sections in this order.

1. Paste in: the data needed and the fastest export from OPERA Cloud, Cloudbeds, Mews, Booking.com extranet, Expedia Partner Central, Agoda YCS, Trip.com.
2. Do: the procedure.
3. Checklist: five to nine items, run before the expensive step. DO-CONFIRM for routine work, READ-DO for exact sequences.
4. Check yourself: totals reconcile, every number carries a comparison, nothing invented, missing inputs named.
5. Output: the exact format, plus the `hotel-data.json` delta.
6. Still manual in your systems: what a human now types into the PMS, the extranet or WhatsApp. The only Conxi line in a skill.

Optional per skill: `references/evidence.md` and `templates/`.

## 8. The skills (v1: two setup skills plus ten)

Setup
- `hotel-setup`: onboarding, writes the profile.
- `hotel-dashboard`: one self-contained HTML file. Tiles for occupancy, ADR, RevPAR, TRevPAR and GOP where present, each against budget and last year; 30-day pace line; channel mix with effective commission; review rating trend; open work orders by priority; the scorecard. Artifact in claude.ai, `dashboard.html` in Claude Code. Built to the dataviz rules (one system, accessible, light and dark). No server, no login, no data leaves the hotel.

Daily
- `morning-flash`: one page from yesterday's close and today's arrivals. Occupancy, ADR, RevPAR against budget and last year; arrivals, VIPs, out-of-order; cancellation-adjusted on-the-books; risks; three decisions.
- `review-replies`: paste reviews from Google, Booking.com, Agoda, Trip.com, TripAdvisor. Replies in the hotel's voice within 48 hours; flags safety, legal and refund demands for a manager.
- `guest-messages`: pre-arrival, arrival, in-stay, post-stay sequences by channel and segment, in the hotel's languages.
- `turnover-board`: departures, stayovers, out-of-order, attendant credits, same-day flip risk, inspection checklist, no room marked ready without a photo set.
- `work-orders`: log a defect, P0 to P3 with SLAs (P0 mitigate in 1 hour, P1 8 hours, P2 7 days, P3 next preventive window), vendor dispatch text, weekly aged list, preventive calendar.

Weekly
- `rate-check`: pace and pickup from a PMS export plus the free Booking.com Analytics and Expedia Rev+ comp data. Recommends holds, rises and restrictions. Built-in rules: pricing below the comp set costs RevPAR (Enz, Canina, van der Rest 2015); overrides only on group and event dates (Koupriouchina 2022); never pool competitors' non-public data (DOJ v RealPage terms); accuracy claims need measure, horizon, segment and benchmark.
- `group-displacement`: group offer against transient at risk, priced on the sum of nightly opportunity costs, not ADR; banquet contribution included where F&B exists.
- `staff-roster`: occupancy-driven rota by department, labour cost per occupied room, local labour rules from the profile.

Monthly
- `ota-reconciliation`: Booking.com, Expedia, Agoda, Trip.com statements against the PMS; commission check; variances over one percent; chargebacks.
- `owner-report`: USALI or local P&L, actual against budget and last year, 60-day outlook, three risks, a 5 to 15 number scorecard.

Later (not v1): a dedicated F&B skill, personalised profiles built from the lead engine, any PMS login automation.

## 9. Mock hotel and examples

One fictional 120-key independent in Kuala Lumpur with full sample outputs for all twelve skills (MYR, SST, Agoda and Trip.com heavy, WhatsApp staff groups). Three filled profiles (Kuala Lumpur, Lisbon, Austin) show the same skills across currencies, tax regimes and OTA mixes. Every mock number is labelled fictional.

## 10. Evidence gate

Every benchmark in a skill names its source in that skill's `references/evidence.md`: Enz, Canina and van der Rest 2015 (discounting); Cooper, Homem-de-Mello and Kleywegt 2006 (spiral-down); Antonio, de Almeida and Nunes 2017 (cancellation prediction); Koupriouchina, van der Rest and Schwartz 2022 (overrides); DOJ v RealPage settlement (competitor data); Kalibri (acquisition cost). A source and a quote per claim. Nothing unsourced ships.

## 11. Conxi tie-in

Three places only: the README opening, the "still manual in your systems" section of every skill, one link to conxi.ai. No export endpoint, no tracking, no sign-up wall.

## 12. QA and release

- `scripts/lint.py`: folder name equals frontmatter name, six sections present in order, under 150 lines, no em dashes, no emojis, description under the platform limit.
- A prompt set per skill run through skill-creator evals before a release.
- GitHub Action on tag: run lint, build per-skill zips and the all-in zip, attach to the release.
- Landing page and email copy are separate items after the repo ships.

## 13. Repo layout

```
open-conxi/
  README.md  LICENSE  CLAUDE.md  package.json  bin/cli.js
  .claude-plugin/plugin.json
  docs/SCHEMA.md  docs/superpowers/specs/
  scripts/lint.py  scripts/build-zips.sh
  hotel-setup/SKILL.md
  hotel-dashboard/SKILL.md  hotel-dashboard/templates/dashboard.html
  morning-flash/  review-replies/  guest-messages/  turnover-board/  work-orders/
  rate-check/  group-displacement/  staff-roster/  ota-reconciliation/  owner-report/
  mock/hotel-profile.md  mock/hotel-data.json  mock/outputs/<skill>/
  mock/profiles/{kuala-lumpur,lisbon,austin}.md
```
