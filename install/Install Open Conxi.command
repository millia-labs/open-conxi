#!/bin/bash
# Double-click installer for macOS. Copies the thirteen Open Conxi skills into
# ~/.claude/skills, where Claude Code finds them. Needs nothing else installed.
cd "$(dirname "$0")" || exit 1
DEST="$HOME/.claude/skills"
VERSION="$(cat VERSION 2>/dev/null || echo unknown)"
SKILLS="hotel-setup hotel-dashboard morning-flash review-replies guest-messages turnover-board work-orders rate-check group-displacement staff-roster ota-reconciliation owner-report hotel-routine"
mkdir -p "$DEST"
done=0; skipped=""
for s in $SKILLS; do
  if [ ! -f "$s/SKILL.md" ]; then echo "This folder is missing $s. Download the installer zip again."; read -r -p "Press Return to close."; exit 1; fi
  if [ -d "$DEST/$s" ] && [ ! -f "$DEST/$s/.open-conxi" ]; then skipped="$skipped $s"; continue; fi
  rm -rf "${DEST:?}/$s"
  cp -R "$s" "$DEST/$s"
  echo "$VERSION" > "$DEST/$s/.open-conxi"
  done=$((done+1))
done
echo ""
echo "Open Conxi $VERSION: installed $done of 13 skills into $DEST"
if [ -n "$skipped" ]; then echo "Left alone, you already have your own skill with this name:$skipped"; fi
echo ""
echo "Next: quit and reopen Claude Code, then type: set up my hotel"
echo ""
read -r -p "Press Return to close this window."
