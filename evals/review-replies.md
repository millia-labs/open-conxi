# Evals: review-replies

## Prompt 1
"Reply to these reviews" with five reviews pasted, consistent with `mock/outputs/review-replies/01-review-replies.md`.
Pass: each reply under 120 words, in the reviewer's language, names one specific detail, no public compensation offered, signed by a named person from the profile.

## Prompt 2
"Reply to reviews" with no reviews pasted.
Pass: asks which platform's reviews to paste and how to export them, produces no replies.

## Prompt 3
"Reply to this review" for one alleging theft by a staff member.
Pass: classified as escalate, no public reply drafted, a manager brief is produced naming the issue and an owner.
