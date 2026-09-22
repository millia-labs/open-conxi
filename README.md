# Open Conxi

Twelve free Claude skills that run the daily, weekly and monthly work of an independent hotel. Any country, any PMS, no setup beyond one profile file. MIT.

> Meet Conxi the AI brain for your hotels. Staff texts are on whatsapp, guests send emails or chat on the OTAs, and revenue managers use obsolete pricing software to update the PMS manually.
>
> Hotel systems do not talk to each other so the only way to do work is for a human to jump between systems.
>
> Conxi logs into all hotel's systems, and completes work, end-to-end, autonomously.
>
> Conxi does the tedious, so that your staff can focus on hospitality

Open Conxi is the free part. The founders ran a 106-room hospitality operation and launched Conxi in June 2026. These skills are the procedures that operation ran on, written so any hotel can run them in Claude today. Each skill ends with the list of steps a person still has to do inside the PMS and the extranets. That list is what [Conxi](https://conxi.ai) does for you.

## Run order

1. `hotel-setup` builds `hotel-profile.md`. Once.
2. `hotel-dashboard` builds `dashboard.html`. Re-run after any skill.
3. Then any of the ten job skills, whenever the job comes up.

## The skills

| Rhythm | Skill | What you paste in | What you get |
|---|---|---|---|
| Once | `hotel-setup` | Website URL, or twelve answers | `hotel-profile.md` |
| After any skill | `hotel-dashboard` | `hotel-data.json` | One-file KPI page |
| Daily | `morning-flash` | Manager's report, arrivals | One-page flash with three decisions |
| Daily | `review-replies` | Reviews from any platform | Replies, escalations, theme tally |
| Daily | `guest-messages` | House facts, a guest question | Message sequence by channel and language |
| Daily | `turnover-board` | Departures, stayovers, attendants | Assignments by credits, inspection list |
| Daily | `work-orders` | A defect, or the open list | Prioritised orders with SLAs, dispatch text |
| Weekly | `rate-check` | Pace export, OTA analytics | Date-by-date actions with the evidence |
| Weekly | `group-displacement` | A group inquiry, pace | Accept, counter or decline, with the floor rate |
| Weekly | `staff-roster` | Forecast, staff list, your rules | Roster, breaches, labour cost per room |
| Monthly | `ota-reconciliation` | OTA statements, PMS stays | Variances, disputes, effective commission |
| Monthly | `owner-report` | P&L, budget, last year | USALI or local report, outlook, scorecard |

Every skill has the same six sections: paste in, do, checklist, check yourself, output, still manual in your systems. See `docs/CONTRACT.md`. Every benchmark is sourced in that skill's `references/evidence.md`.

## Install

**claude.ai (no terminal).** Download a zip from the [latest release](https://github.com/millia-labs/open-conxi/releases/latest). In Claude, open Customize, then Skills, then the plus button, then Upload a skill. Upload `open-conxi-all.zip` or one skill at a time. Team and Enterprise admins can share a skill with the whole hotel. Then say: set up my hotel.

**Claude Code.** Needs Node 18 or later. No git needed.
```bash
npx open-conxi install
```
This copies the twelve skills into `~/.claude/skills`. Restart Claude Code and say: set up my hotel. Later, `npx open-conxi@latest update` gets new versions and `npx open-conxi uninstall` removes them. A skill of yours with the same name is never overwritten unless you add `--force`.

Or load the repo as a plugin:
```bash
git clone https://github.com/millia-labs/open-conxi.git && claude --plugin-dir ./open-conxi
```

**Paste.** Open any `SKILL.md`, copy it into a Project's instructions.

## Try it on the mock hotel

`mock/` holds a fictional 120-key hotel in Kuala Lumpur with a filled profile, a month of data, and one sample output per skill. Copy `mock/hotel-profile.md` and `mock/hotel-data.json` into your folder or Project and say: build the dashboard.

## What these skills will not do

They do not log into your PMS, channel manager or OTA extranets. You paste exports in and type results back. They do not invent numbers: a missing input is named, not estimated. They do not use any competitor's non-public data (see `rate-check/references/evidence.md`).

## Contributing

Run `python3 scripts/lint.py` before a pull request. Keep skills under 150 lines, region-neutral, and sourced. No em dashes, no emojis.

Built by [Millia Labs Pte. Ltd.](https://conxi.ai), Singapore.
