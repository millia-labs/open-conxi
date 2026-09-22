---
name: review-replies
description: Drafts replies to guest reviews from Google, Booking.com, Agoda, Trip.com, Expedia and TripAdvisor in the hotel's voice, within the 48-hour window, and flags the reviews a manager must handle personally (safety, legal threats, refund demands, discrimination claims). Use when someone pastes reviews or says "reply to reviews", "answer this review", "review responses", "reputation", "what are guests complaining about".
---

# Review replies

Run order: hotel-setup, hotel-dashboard, then this skill. Daily, or whenever reviews arrive.

## 1. Paste in
- Today's date, so the 48-hour window can be computed.
- The reviews: platform, date, rating, title, body, guest first name if shown, room type or stay dates if shown. Copy from Google Business Profile (Reviews), Booking.com extranet (Guest reviews), Agoda YCS (Reviews), Trip.com (Reviews), Expedia Partner Central (Reviews), TripAdvisor Management Center.
- For the delta: each platform's displayed overall rating and total review count as shown on the platform today. Without them the reviews delta is not written.
- `hotel-profile.md` for the hotel name, languages, and the two-line brand voice in Notes.
- Optional: the incident log or PMS trace for the stay, so the reply can say what was done.
- Missing the voice note: reply in plain, warm, specific language and say the voice note was absent.

## 2. Do
1. Sort by date, oldest first. Anything older than 48 hours goes first.
2. Classify each review: praise, service miss, facility miss, value complaint, or escalate. Escalate means safety, injury, theft, discrimination, legal or regulator mention, refund or chargeback demand, or a named staff accusation. Escalated reviews get no drafted public reply, only a manager brief.
3. For each non-escalated review write a reply in the reviewer's language: thank by first name, name one specific thing they mentioned, state what was done about a miss (a fact from the pasted trace or work order, not a promise to "look into it"), one sentence inviting them back, sign with a real name and title from the profile. Under 120 words. No discounts or compensation in public. Never promise a change (menu, policy, fix date) that the GM has not confirmed; if nothing was done yet, say the note has been passed to the named owner.
4. For a miss, add a private note: the internal follow-up, the owner, the date.
5. Tally the batch: count, rating per platform in this batch, top three positive themes, top three negative themes, counted from the text. This tally stays in the reply text; the delta carries the platform's running figures, not the batch.

## 3. Checklist
READ-DO, before any reply is posted.
- [ ] Reply is in the same language as the review.
- [ ] It names one specific detail from the review, so it cannot be a template.
- [ ] It states an action taken, not an intention to investigate.
- [ ] No compensation, refund, or discount is offered in public.
- [ ] No guest personal data beyond the first name shown on the platform.
- [ ] Escalated reviews have a manager brief and no public draft.
- [ ] Signed by a named person and title from the profile.

## 4. Check yourself
- Count of replies plus escalations equals count of reviews pasted.
- No reply exceeds 120 words.
- Theme counts are computed from the text, with the review numbers listed under each theme.
- Any review older than 48 hours is marked late at the top.
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given; no sign-off unless a guest reads the text; no em dashes, no emojis.

## 5. Output
Per review: platform, date, rating, classification, the reply, the private note. Then the escalation briefs. Then the batch tally. Then, only for platforms whose displayed overall rating and total count were pasted (rating on the platform's own scale, count is the platform total, themes from this batch):

hotel-data delta
```json
{"reviews": [{"platform": "<name>", "rating": null, "count": null, "period": "<YYYY-MM>", "top_positive": [], "top_negative": [], "source": "review-replies"}]}
```

## 6. Still manual in your systems
Copying each review out of six platforms, pasting each reply back into the right one, and logging the private follow-ups. Conxi (conxi.ai) does these steps inside your systems for you.
