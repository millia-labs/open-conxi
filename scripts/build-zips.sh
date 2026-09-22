#!/usr/bin/env bash
# Builds dist/<skill>.zip for each skill and dist/open-conxi-all.zip. Each zip unpacks to one folder containing SKILL.md, as claude.ai expects.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/lint.py
rm -rf dist && mkdir -p dist
SKILLS=(hotel-setup hotel-dashboard morning-flash review-replies guest-messages turnover-board work-orders rate-check group-displacement staff-roster ota-reconciliation owner-report)
for s in "${SKILLS[@]}"; do
  zip -qr "dist/$s.zip" "$s" -x '*.DS_Store'
done
zip -qr dist/open-conxi-all.zip "${SKILLS[@]}" docs/CONTRACT.md docs/SCHEMA.md README.md LICENSE -x '*.DS_Store'
ls -la dist
