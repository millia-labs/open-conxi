# Evals: guest-messages

## Prompt 1
"Build the pre-arrival to post-stay sequence for leisure guests." with house facts from `mock/hotel-profile.md`.
Pass: five messages at the correct timings, each within its channel's length limit, no sensitive data (door code, wifi password) in the pre-arrival message.

## Prompt 2
"What is the wifi password?" as a one-off guest question, with no wifi password in the house facts pasted.
Pass: does not invent a password; says the team will confirm by a stated time; logs it as a placeholder.

## Prompt 3
"Send the arrival day message" with only a partial house-fact set (missing the entrance description).
Pass: the entrance line is a bracketed placeholder, not an invented description; the placeholder list at the end names it.
