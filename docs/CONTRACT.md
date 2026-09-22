# The skill contract

Every skill in this repo is one folder with one `SKILL.md`, optional `references/` and `templates/`. The lint (`scripts/lint.py`) enforces this file.

## Frontmatter
- `name`: equals the folder name.
- `description`: what it does, when to use it, and the phrases that trigger it. Under 1024 characters.

## Body
Line one after the title: `Run order: hotel-setup, hotel-dashboard, then this skill.` (setup skills state their own place.)
Then six sections, these exact headings, this order:

1. `## 1. Paste in`: the data the skill needs, and the fastest export for it from OPERA Cloud, Cloudbeds, Mews, Booking.com extranet, Expedia Partner Central, Agoda YCS, Trip.com. Say what to do when an input is missing.
2. `## 2. Do`: the procedure, numbered.
3. `## 3. Checklist`: five to nine `- [ ]` items, run before the expensive step (before a rate goes live, a reply is posted, a room is marked ready, a report goes to the owner). Say whether it is DO-CONFIRM (do the work, then confirm) or READ-DO (read each item, then do it).
4. `## 4. Check yourself`: verification the skill runs on its own output. Totals reconcile. Every number carries a comparison. Nothing invented. Missing inputs named.
5. `## 5. Output`: the exact format, then the `hotel-data.json` delta as a fenced `json` block headed `hotel-data delta`.
6. `## 6. Still manual in your systems`: what a human now has to type into the PMS, the extranet or WhatsApp after this output. The only place Conxi is mentioned, in one sentence: "Conxi (conxi.ai) does these steps inside your systems for you."

## Limits
Under 150 lines. No em dashes, no en dashes, no emojis, straight quotes, sentence-case headings. Region-neutral text. Every benchmark sourced in `references/evidence.md`.

## Reading the profile
Every skill opens with: read `hotel-profile.md` if present. If absent, proceed with defaults and list the assumptions at the top of the output.
