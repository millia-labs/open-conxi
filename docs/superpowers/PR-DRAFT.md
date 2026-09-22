# PR draft: Open Conxi v0.1.0

Repo: millia-labs/openconxi (new, public). Branch: main, first release.

## Summary
Twelve Claude skills that run the daily, weekly and monthly work of an independent hotel from pasted exports, with one profile file and one data file, a lint that enforces a six-section contract, an npx installer, and a release action that builds claude.ai-ready zips.

## What is in it
- hotel-setup and hotel-dashboard (setup, run first and second)
- morning-flash, review-replies, guest-messages, turnover-board, work-orders (daily)
- rate-check, group-displacement, staff-roster (weekly)
- ota-reconciliation, owner-report (monthly)
- docs/CONTRACT.md, docs/SCHEMA.md
- scripts/lint.py with pytest suite, bin/cli.js with node:test suite, scripts/build-zips.sh
- .github/workflows/lint.yml and release.yml
- mock/: The Ampang Row Hotel (fictional, Kuala Lumpur), Lisbon and Austin profiles, one sample per skill
- evals/: three prompts per skill and a results table

## How it was tested
python3 scripts/lint.py (12/12), python3 -m pytest (7 passed), node --test tests/ (3 passed), bash scripts/build-zips.sh (13 zips), evals run by hand and recorded in evals/RESULTS.md, one zip uploaded to claude.ai and triggered.

## Not in this PR
F&B skill, lead-engine profiles, landing page, email copy, npm publish.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
