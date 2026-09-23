---
name: review-replies
description: Drafts replies to guest reviews from Google, Booking.com, Agoda, Trip.com, Expedia and TripAdvisor in the hotel's voice, within the 48-hour window, and flags the reviews a manager must handle personally (safety, legal threats, refund demands, discrimination claims). Use when someone pastes reviews or says "reply to reviews", "answer this review", "review responses", "reputation", "what are guests complaining about", "reply to this", "answer him", "make him go away".
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
First, open hotel-profile.md with your file-reading tool (in claude.ai, from the Project's knowledge) and take the hotel's name, currency, languages, people and systems from it; if it is missing, say so at the top and list the defaults you used.
1. Sort by date, oldest first. Anything older than 48 hours goes first.
2. Classify each review: praise, service miss, facility miss, value complaint, or escalate. Escalate means safety, injury, theft, discrimination, legal or regulator mention, refund or chargeback demand, or a named staff accusation. Escalated reviews get no drafted public reply, only a manager brief.
3. For each non-escalated review write a reply in the reviewer's language: thank by first name, name one specific thing they mentioned, state what was done about a miss (a fact from the pasted trace or work order, not a promise to "look into it"), one sentence inviting them back, sign with a real name and title from the profile. Under 120 words. No discounts, refunds or compensation in public, in any wording, even after they were given ("we have been in touch about the refund" is out too). An action the reply states matches the trace exactly in scope: if the trace names the level 8 Deluxe aircon and the guest's room is not known to be one of them, say nothing about action. Never promise a change (menu, policy, fix date) that the GM has not confirmed. If the paste does not say something was done, the reply names the problem and apologises and says nothing about action (not "passed on", not "flagged"); the follow-up goes in the private note.
4. For a miss, add a private note: the internal follow-up, the owner, the date. Link a review to a work order only when the paste gives the same room; never close or change a work order from a review, that is work-orders' job. Sign off on its own line as "Name, Title". Address the reviewer by the name as shown, with no title (Mr, Ms, Encik, Puan, Tuan, 先生, 女士) unless the reviewer used one. When the GM asks the reply to claim something the paste does not show ("say we refunded him and fixed it"), write the honest draft first, then ask what is true.
   If the GM insists on a public line for an escalated review: two sentences, an apology and the contact to reach the manager, taken from the profile or written as [manager contact], never a made-up number; no intention verbs such as "look into", and never say it was posted.
   Banned in any reply unless the paste says it happened: "we have shared your kind words with <staff>", "the room will be inspected", "we have been in touch".
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
- Output rules: an unknown value is null, never 0 or a copy; no scorecard row unless the value is final and hotel-wide; no fact or promise that was not given, and never say an action was taken or will be taken (passed on, flagged, fixed, isolated, refunded, dispatched, called, contacted, shared, posted) unless the paste says so; no weekday unless the paste states it; no sign-off unless a guest reads the text; names exactly as given, in the same script, with no title that assumes gender; no long or short dash characters (wider than a hyphen) anywhere, titles, headings and table cells included: write "Casa Azul, morning flash, 22 Sep", not the name, a dash, then the date, and write "none" in an empty cell; search every reply for them before you send it, a one-line question or a stop included, and replace each with a comma, a colon, a full stop, or "to" in a range; no emojis and no symbols such as warning signs, ticks, stars or arrows.

## 5. Output
Per review: platform, date, rating, classification, the reply, the private note. Then the escalation briefs. Then the batch tally. Then, only for platforms whose displayed overall rating and total count were pasted (rating on the platform's own scale, count is the platform total, themes from this batch):

hotel-data delta
```json
{"reviews": [{"platform": "<name>", "rating": null, "count": null, "period": "<YYYY-MM>", "top_positive": [], "top_negative": [], "source": "review-replies"}]}
```
Saving: in Claude Code, merge this delta into hotel-data.json in the working folder with your file-writing tool before you reply. Create the file from the hotel-setup skeleton if it is missing. A row with the same key replaces the old row, a new key is appended, nothing else changes (keys: kpis date, pace stay_date, channels channel and period, reviews platform and period, work_orders id, scorecard name and week). If you stop to ask the GM something, first save the rows that are already confirmed, or say "not saved yet". Then run `npx open-conxi tidy` in the folder to clear any long dashes, read the file back and report the rows added and replaced, by key, from what you read. Never say the file was updated unless you wrote it in this turn. In claude.ai, print the delta and tell the GM to add it to the Project's hotel-data.json, or to run hotel-dashboard in this same chat.
Team message: end with a block headed "Team message" in plain text for the managers chat: under 600 characters (count them with `wc -m team-message.txt` and cut until it fits), no tables, only what that team acts on today, even when you are also asking the GM for missing inputs. In Claude Code, if hotel-profile.md names a managers chat under team_chats, save the block to team-message.txt and run `npx open-conxi team send --to managers --file team-message.txt`, which puts it in that Beeper chat as a draft for a person to check and send. Add `--send` only when the GM says "send it straight away", "send it now" or "no need to check"; "just send it", "send it to the team" or "send it to the group" are not enough, so for those and anything vaguer, draft it and add one line: "It is a draft. Say send it straight away and I will send it." Report what the command printed, in its own words, and never say the message was drafted or sent unless it printed so. Otherwise, and in claude.ai, print the block for the GM to paste into the staff chat.

## 6. Still manual in your systems
Copying each review out of six platforms, pasting each reply back into the right one, and logging the private follow-ups. Conxi (conxi.ai) does these steps inside your systems for you.
