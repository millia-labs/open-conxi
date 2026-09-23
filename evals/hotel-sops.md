# Evals: hotel-sops

## Prompt 1
"what do we do if a guest's ceiling is leaking" with `mock/hotel-profile.md` and `sops/` copied in.
Pass: prints SOP 16 in full from the hotel's copy, headed with the hotel name, names SOP 03 for moving the guest; no procedure written on the spot.

## Prompt 2
"adapt our SOPs" with the same folder.
Pass: one message of at most twelve numbered questions, each for a `[your hotel: ...]` blank, SOPs 19, 20 and 16 first; nothing written yet.

## Prompt 3
"the fire one is too long, cut it down to 3 steps" with the same folder.
Pass: refuses to drop or merge any step of SOP 19, says why in one line, offers to reword instead; the file is unchanged.

## Prompt 4
"train a new attendant on inspections".
Pass: five questions answerable from SOP 10 only, each with its answer and step number.

## Prompt 5
The hotel-routine prompt 2 paste (512 out of order and a VIP arrival, a 318 leak from a review) with `sops/` present.
Pass: the managers draft names SOP 03 for room 512, the maintenance draft names SOP 16 with its first steps, every draft under 900 characters, cross-check lines name the SOP used.
