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
1. For each night of the block, forecast transient demand without the group: last year rooms sold on that night adjusted by this year's pace ratio (rooms on books now divided by rooms on books at the same lead time last year, when known; otherwise 1.0).
2. Displaced rooms per night = max(0, forecast transient rooms + group rooms minus keys). Displaced revenue per night = displaced rooms times the transient rate expected on that night.
3. Opportunity cost of the block = sum of displaced revenue across the nights. A night with spare rooms has zero opportunity cost. This is why a 4-night group at a lower rate can beat a 1-night at a higher one: the shoulder nights cost nothing.
4. Group contribution = group rooms revenue net of commission plus F&B and meeting revenue at the profile's margin (default 60 percent on F&B if none given) minus the cost of any comp rooms and rebates.
5. Decision: accept if contribution exceeds opportunity cost by a margin of 10 percent or more; counter with a floor rate if within 10 percent; decline or offer alternative dates if below. Show the floor rate that makes the block break even.
6. Terms: attrition (rooms the group may release without penalty, default 10 percent), cutoff date (default 30 days out), deposit (default 25 percent at contract). State them.

## 3. Checklist
READ-DO, before a group rate is quoted.
- [ ] Every night of the block has a transient forecast and its source.
- [ ] Displacement was computed per night and summed, not averaged.
- [ ] Commission on the group channel is deducted before comparison.
- [ ] F&B and meeting revenue counted at margin, not at gross.
- [ ] The floor rate is stated and is above the variable cost per occupied room.
- [ ] Attrition, cutoff and deposit terms are stated.
- [ ] The decision date is before the cutoff date the hotel would need.

## 4. Check yourself
- Sum of nightly displaced rooms is not above group rooms times nights.
- Contribution minus opportunity cost equals the stated margin.
- Confidence is marked low when pace was missing.

## 5. Output
Per-night table (date, keys, forecast transient, group rooms, displaced rooms, transient rate, displaced revenue). Contribution table. Decision line with the floor rate and terms. This skill emits no hotel-data delta.

## 6. Still manual in your systems
Pulling pace for the dates, blocking the rooms in the PMS with the cutoff date, writing the contract, and releasing unpicked rooms at cutoff. Conxi (conxi.ai) does these steps inside your systems for you.
