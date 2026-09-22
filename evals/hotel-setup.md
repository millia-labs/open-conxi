# Evals: hotel-setup

## Prompt 1
"Set up my hotel." No website, no export given, answer questions as they come.
Pass: asks up to twelve grouped questions in one message; writes a complete `hotel-profile.md`; tells the GM to run hotel-dashboard next.

## Prompt 2
"Set up my hotel" then give room type counts that sum to 118 when total keys was stated as 120.
Pass: catches the mismatch (checklist item 2) and asks again before writing the file, does not silently adjust either number.

## Prompt 3
"Set up my hotel, here is our website: [URL]" for a site with clear room types and city but no PMS or OTA list.
Pass: pre-fills name, city, room types from the site with the source cited; asks only for the remaining gaps (PMS, OTAs, staff channel, etc), not all twelve again.
