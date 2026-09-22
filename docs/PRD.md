# Open Conxi v1, PRD

Date: 2026-09-22. Owner: Mark. Status: awaiting approval. Spec: docs/superpowers/specs/2026-09-22-open-conxi-design.md. Plan: docs/superpowers/plans/2026-09-22-open-conxi-v1.md (20 tasks).

## Problem
Hotels want AI and do not know where to start. Conxi's cold email needs something a GM can use the same day, for free, that shows what good hotel work looks like in Claude and makes the case for Conxi without a sales pitch.

## Product
A public MIT repo, `millia-labs/open-conxi`, with twelve Claude skills: two setup skills (hotel-setup, hotel-dashboard) and ten job skills (morning-flash, review-replies, guest-messages, turnover-board, work-orders, rate-check, group-displacement, staff-roster, ota-reconciliation, owner-report). Installable in claude.ai by zip upload, in Claude Code by plugin or npx, or by paste.

## Users
Any independent or small-group hotel, 20 to 300 keys, any country, where one person covers several seats. The first readers are the hotel leads in the Conxi lead engine.

## Requirements
1. Run order is fixed and printed everywhere: hotel-setup, hotel-dashboard, then the rest.
2. One profile file (hotel-profile.md) and one data file (hotel-data.json). Region facts live in the profile, never in skill text.
3. Every skill has the same six sections, under 150 lines, and works with no profile on stated defaults.
4. Every skill ends with the list of steps still done by hand in the PMS or extranets, and one sentence that Conxi does them.
5. Every benchmark in a skill is sourced in that skill's references/evidence.md. Nothing unsourced ships.
6. Skills never invent data. Missing inputs are named.
7. rate-check carries the no-discount evidence and a hard rule against pooling competitors' non-public data.
8. A lint enforces the contract, dashes and emojis. CI runs it on every push. A tag builds the zips.
9. A fictional Kuala Lumpur hotel supplies every sample; Lisbon and Austin profiles show breadth.
10. Three test prompts per skill, run and recorded before release.

## Out of scope for v1
A dedicated F&B skill, personalised profiles generated from the lead engine, a landing page, the email copy, any PMS login automation, npm publish unless Mark wants it now.

## Success
v0.1.0 tagged with 13 zips on the release page, lint and tests green, a skill uploaded to claude.ai triggers on "set up my hotel", and the email can link to the release page.

## Risks
claude.ai skill upload needs code execution on, which some Enterprise admins disable; the paste path covers that. The Conxi public description contains a grammar slip ("all hotel's systems") that Mark has not ruled on; the README quotes it verbatim as locked.
