---
name: group-displacement
description: Decides whether to take a group block by comparing the group's total contribution with the transient revenue it displaces, priced on the opportunity cost of each night rather than on ADR. Use when someone says "group inquiry", "should we take this block", "displacement", "group rate", "RFP", "10 rooms for 3 nights", "wedding block", "corporate block".
---

# Group displacement

Run order: hotel-setup, hotel-dashboard, then this skill. On every group inquiry of 8 rooms or more.

## 1. Paste in
- The inquiry: dates, rooms per night, rate offered or asked, F&B or meeting spend if any, deposit and cancellation terms, decision date.
- Pace for those dates and the same dates last year (see rate-check for the exports), or the latest `hotel-data.json` pace rows.
- Current rate on those dates and the comp-set median if available.
- `hotel-profile.md` for keys, currency, F&B, meeting space.
- Missing pace: use last year alone and mark the answer low-confidence.

## 2. Do
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. For each night of the block, forecast transient demand without the group: last year rooms sold on that night adjusted by this year's pace ratio (rooms on books now divided by rooms on books at the same lead time last year, when known; otherwise 1.0). Then take the larger of that forecast and the rooms already on the books tonight, because sold rooms cannot forecast lower than themselves.
2. Displaced rooms per night = max(0, that larger figure + group rooms minus keys). Displaced contribution per night = displaced rooms times (the transient rate expected that night, minus the transient acquisition cost, minus the variable cost per occupied room). Transient acquisition cost = that rate times the blended effective commission from the `channels` rows of `hotel-data.json` for the latest period (open the file with your file-reading tool; in claude.ai, from the Project's knowledge), weighted by share when shares exist; if there is none, use none and label the floor rate an upper bound. Both sides of the comparison are net: a displaced guest would also have cost the variable cost and the commission.
3. Opportunity cost of the block = sum of displaced contribution across the nights. A night with spare rooms has zero opportunity cost. This is why a 4-night group at a lower rate can beat a 1-night at a higher one: the shoulder nights cost nothing.
4. Group contribution = group rooms revenue net of commission, minus the variable cost per occupied room from the profile (`economics.variable_cost_per_occupied_room`; if null, use 15 percent of the group rate and say so), plus F&B and meeting revenue at the profile's `economics.fnb_margin` (if null, 60 percent, and say so), minus the cost of anything included in the group rate (breakfast, transfers), minus the cost of any comp rooms and rebates.
5. Decision: accept if contribution exceeds opportunity cost by a margin of 10 percent or more; counter with a floor rate if within 10 percent; decline or offer alternative dates if below. Floor rate per room night = (opportunity cost plus variable cost for all group room nights plus the cost of anything included in the rate, minus F&B and meeting contribution) divided by group room nights, floored at the variable cost per occupied room. Show it as a number.
6. Terms: attrition (rooms the group may release without penalty, default 10 percent), cutoff date (default 30 days before arrival, or at contract signing if that is later), deposit (default 25 percent at contract). State them and mark them as defaults until agreed.

## 3. Checklist
READ-DO, before a group rate is quoted.
- [ ] Every night of the block has a transient forecast and its source.
- [ ] Displacement was computed per night and summed, not averaged.
- [ ] Commission on the group channel is deducted before comparison, and the displaced transient side is netted of its variable cost and commission too.
- [ ] F&B and meeting revenue counted at margin, not at gross.
- [ ] The floor rate is stated as a number, and the variable cost it rests on is named as profile value or default.
- [ ] Attrition, cutoff and deposit terms are stated.
- [ ] The decision date is before the cutoff date the hotel would need.

## 4. Check yourself
- Sum of nightly displaced rooms is not above group rooms times nights.
- Opportunity cost is net, the same way contribution is. Worked check: 38 displaced room nights worth 6,286 at list rates, variable cost 22, no commission data, give an opportunity cost of 6,286 minus 836 = 5,450, not 6,286. A 42 room night block with 924 variable cost and 378 breakfast cost then has a floor of (5,450 + 924 + 378) / 42 = 161.
- Contribution minus opportunity cost equals the stated margin.
- Confidence is marked low when pace was missing.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; no long or short dash characters (wider than a hyphen) anywhere, titles and headings included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date; before replying, search the whole reply for them and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Per-night table (date, keys, forecast transient, group rooms, displaced rooms, transient rate, displaced revenue). Contribution table. Decision line with the floor rate and terms. This skill emits no hotel-data delta.

## 6. Still manual in your systems
Pulling pace for the dates, blocking the rooms in the PMS with the cutoff date, writing the contract, and releasing unpicked rooms at cutoff. Conxi (conxi.ai) does these steps inside your systems for you.
