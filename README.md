# Open Conxi

Fourteen free Claude skills that run the daily, weekly and monthly work of an independent hotel. Any country, any PMS, no setup beyond one profile file. MIT.

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
3. Then any of the ten job skills, whenever the job comes up (they follow the 20 SOPs in `hotel-sops`), or say "run my morning" and `hotel-routine` runs the day's jobs in order.

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
| Daily | `hotel-routine` | Whatever today's jobs need, asked for once | Every due job run in order, cross-checked, one team message per staff chat |
| Any time | `hotel-sops` | A question ("what do we do if a ceiling leaks") | The hotel's own SOP, a filled-in copy, or a five-question staff quiz |

Every skill has the same six sections: paste in, do, checklist, check yourself, output, still manual in your systems. See `docs/CONTRACT.md`. Every benchmark is sourced in that skill's `references/evidence.md`.

## Your SOPs

Twenty one-page standard operating procedures ship with the skills: check-in, check-out, walking a guest, VIP arrival, service recovery, night audit, key control, departure and stayover cleaning, inspection, lost and found, shift handover, work orders, out-of-order rooms, preventive maintenance, water leaks, rate review, group inquiries, fire alarm and medical emergency. Each has a standard you can measure, 5 to 9 steps, a check before the costly moment, and its sources.

`npx open-conxi sops` copies them into a `sops` folder next to your profile, and hotel-setup does it for you. Edit any file to match how your hotel works; the skills read your copy, and the command never overwrites it. Say "adapt our SOPs" to fill in the blanks for your building. The board, the work orders and the morning routine name the SOP for what they flag, so the team message says what to do, not only what is wrong.

The fire alarm and medical emergency SOPs never replace your fire plan, your first aid training or local law.

## Install

Pick the line that matches you.

**I use Claude Code and never open a terminal.** Download `open-conxi-installer.zip` from the [latest release](https://github.com/millia-labs/open-conxi/releases/latest) and unzip it. On a Mac, double-click `Install Open Conxi.command` (the first time, right-click it and choose Open, because the Mac cannot check who made it). On Windows, double-click `Install Open Conxi.cmd`. Quit and reopen Claude Code, then say: set up my hotel.

**I use Claude Code and a terminal.** Needs Node 18 or later.
```bash
npx open-conxi install
```
Or from inside Claude Code, add it as a plugin, which also keeps it updated:
```
/plugin marketplace add millia-labs/open-conxi
/plugin install open-conxi@open-conxi
```
Later, `npx open-conxi@latest update` gets new versions and `npx open-conxi uninstall` removes them. A skill of yours with the same name is never overwritten unless you add `--force`.

**I use claude.ai in the browser.** Download the single-skill zips from the [latest release](https://github.com/millia-labs/open-conxi/releases/latest). In Claude, open Customize, then Skills, then the plus button, then Upload a skill, one zip at a time. Start with `hotel-setup.zip` and `hotel-dashboard.zip`. Team and Enterprise admins can share a skill with the whole hotel. Then say: set up my hotel.

**Paste.** Open any `SKILL.md`, copy it into a Project's instructions.

## A dashboard that updates itself

In Claude Code, open a terminal in your hotel folder and run:
```bash
npx open-conxi dashboard
```
The dashboard opens in your browser and updates every time a skill saves `hotel-data.json`. Leave the window open. Nothing leaves your computer. Ctrl+C stops it.

## Tell the team through Beeper

Five skills end with a message for a staff chat: the morning flash and review escalations for managers, the board for housekeeping, work orders for maintenance, the roster for all staff. If your team chats run on WhatsApp, Telegram, Signal or Slack and you use [Beeper Desktop](https://www.beeper.com), Open Conxi can put each message straight into the right chat.

1. `npx open-conxi team connect` and paste a Beeper Desktop access token (Beeper, Settings, Developers). Once.
2. `npx open-conxi team chats` lists your chat names. Put them in `hotel-profile.md` under `team_chats` (hotel-setup asks for them).
3. That is all. After a skill runs, its team message waits in the chat as a draft. A person reads it and presses send. Say "send it straight away" if you want it to go out without the check.

Open Conxi never clears text someone is halfway through typing in a chat. It stops and says so.

## Try it on the mock hotel

`mock/` holds a fictional 120-key hotel in Kuala Lumpur with a filled profile, a month of data, and one sample output per skill. Copy `mock/hotel-profile.md` and `mock/hotel-data.json` into your folder or Project and say: build the dashboard.

## What these skills will not do

They do not log into your PMS, channel manager or OTA extranets. You paste exports in and type results back. They do not invent numbers: a missing input is named, not estimated. They do not use any competitor's non-public data (see `rate-check/references/evidence.md`).

## Contributing

Run `python3 scripts/lint.py` before a pull request. Keep skills under 150 lines, region-neutral, and sourced. No em dashes, no emojis.

Built by [Millia Labs Pte. Ltd.](https://conxi.ai), Singapore.
