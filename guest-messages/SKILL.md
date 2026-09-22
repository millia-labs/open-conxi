---
name: guest-messages
description: Writes the hotel's guest message sequence (pre-arrival, arrival day, in-stay, departure, post-stay) per channel (WhatsApp, SMS, email, OTA inbox) and per segment, in the hotel's languages, plus one-off replies to guest questions. Use when someone says "pre-arrival message", "check-in instructions", "welcome message", "reply to this guest", "guest asked about", "message template", "post-stay email".
---

# Guest messages

Run order: hotel-setup, hotel-dashboard, then this skill. Once to build the sequence, then whenever a guest question needs an answer.

## 1. Paste in
- `hotel-profile.md`: name, languages, staff channel, room types, F&B, the voice note.
- House facts the messages need: check-in and check-out times, address and how to find the entrance, parking, wifi name (never the password in a pre-arrival message), breakfast hours and venue, late check-out policy and price, airport transfer option and price, contact number and hours.
- For a one-off reply: the guest's message and their booking facts (dates, room type, channel).
- Missing a fact: leave a bracketed placeholder like [wifi name] and list every placeholder at the end. Never invent a time, price or policy.

## 2. Do
1. Build five messages per segment (leisure, business, family, group) for the default language, then translate each into the profile's other languages. Segments differ in what they need: family gets cot and breakfast facts, business gets invoice and early breakfast, group gets the rooming and billing contact.
2. Timing: pre-arrival 3 days out (facts and one upsell), arrival morning (entrance, check-in time, contact), in-stay evening of day one (one question: is everything right), departure eve (check-out time, late check-out price, transport), post-stay 24 hours after (thanks, one review link, no discount).
3. Per channel length: WhatsApp and SMS under 300 characters with the fact first; email under 150 words with the facts in a short list; OTA inbox in the same words as WhatsApp because those platforms strip links and phone numbers.
4. For a one-off reply: answer the question in the first sentence with the fact, add one line of help, sign with a name. If the fact is not in the house facts, say the team will confirm by a stated time and log it as a placeholder.
5. Never include a door code, wifi password, or full card number in any message that goes out before the guest has checked in.

## 3. Checklist
READ-DO, before any message is sent.
- [ ] Every fact came from the house facts pasted, or is a bracketed placeholder.
- [ ] Nothing sensitive (door code, wifi password, card digits) in a pre-arrival message.
- [ ] Length fits the channel limit.
- [ ] Guest is addressed by the name the booking shows.
- [ ] One upsell at most per message, priced in the profile currency.
- [ ] Post-stay message asks for a review only, no discount attached.
- [ ] Each language version was written for that language, not word-for-word translated (check idioms).

## 4. Check yourself
- Count: 5 messages times segments times languages, all present.
- Placeholder list at the end matches every bracket in the text.
- Times use the hotel's local time zone and 24-hour format unless the profile says otherwise.

## 5. Output
The sequence as a table per segment (timing, channel, message), then the language variants, then the placeholder list. For a one-off reply: the reply, then the fact source. This skill emits no hotel-data delta.

## 6. Still manual in your systems
Loading each template into the PMS, the WhatsApp Business app, the email tool and each OTA's message centre, scheduling the sends against arrival dates, and answering each guest question by hand. Conxi (conxi.ai) does these steps inside your systems for you.
