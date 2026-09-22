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

## Rules every output obeys
These were added after the first cold-run QA, where a fresh model followed each skill exactly and the gaps below showed up.

1. Unknown is null. A value the inputs do not support is written as `null` in the hotel-data delta, never as 0, never as a copy of a neighbouring field, never as a placeholder to fill later. In the output text it reads "not provided".
2. A scorecard row is emitted only when its value is final and hotel-wide. A partial run (one department, one batch of reviews, one OTA) emits no scorecard row.
3. Deltas carry achieved figures only. A recommended rate, a forecast, or an estimate never goes into a field that names an actual.
4. Nothing invented, extended to people, promises and actions: do not state a fact about a person or a situation that was not given (that a guest is calm, that a room is vacant), do not promise a change nobody has approved (a menu change, a refund, a fix date), and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so. Print a weekday only when the paste states it.
5. Output style: plain sentences, no em dashes, no en dashes, no emojis, no symbols (warning signs, ticks, stars, arrows). Models type dashes by habit, so the rule tells them to search the finished reply and replace each one. Sign off with a name and title only in text a guest will read (guest-messages, review-replies). Reports and tables carry no sign-off.
6. Regional words: write "lift (elevator)" and "aircon (HVAC)" on first use so the text reads in every market.
7. Saving. In Claude Code a job skill merges its own delta into `hotel-data.json` before it replies, so the dashboard sees the data in any later conversation. In claude.ai it prints the delta for the GM to save. The live run on 22 Sep 2026 showed that printing alone loses the data between chats.

The output-rules line (section 4) and the saving line (section 5) are canonical: `scripts/lint.py` holds the exact text as `OUTPUT_RULES` and `SAVING` and fails any skill whose copy differs.
