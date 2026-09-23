# Open Conxi, agent rules

This repo is thirteen Claude skills for hotels. Deliverables are markdown, one HTML template, and small scripts. No build step for the skills.

Rules:
- Every skill follows `docs/CONTRACT.md` exactly: frontmatter `name` equals the folder name, six sections in order, under 150 lines. `python3 scripts/lint.py` must pass before any commit.
- No em dashes, no en dashes, no emojis, straight quotes, sentence-case headings. The lint blocks the first three.
- Every number that is a benchmark or a rule of thumb names its source in that skill's `references/evidence.md`. Nothing unsourced ships.
- Skills are region-neutral. Currency, tax, OTA mix, staff channel and labour rules come from `hotel-profile.md`, never from the skill text.
- Skills never invent data. If an input is missing, the output says so and stops at what can be verified.
- The only Conxi mention inside a skill is section 6, "Still manual in your systems".
- Run order is fixed: hotel-setup, hotel-dashboard, then any job skill.
- Mock numbers are fictional and labelled so.
