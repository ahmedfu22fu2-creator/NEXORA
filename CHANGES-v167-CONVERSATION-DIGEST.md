# The Squad v167 — Conversation Digest

## Preserved base
- Built additively on v166; no existing file or feature is removed.
- Firebase configuration, auth, Firestore/Storage rules, legacy chat/calls, 3D world/café/cinema, social feed, communities, marketplace, events, Global Connect, and Creator Studio remain in place.

## Added
- A Conversation Digest tab inside Global Connect.
- User-pasted text is processed locally in the browser; no network request or localStorage persistence is used for the pasted transcript.
- Extractive sentence ranking plus heuristic candidate lists for follow-up actions and questions.
- Copy and clear controls, input size cap, and explicit warning that output is approximate and requires human review.

## Limits
- This is not an AI model and does not automatically access private chats or call audio.
- It cannot guarantee correct decisions, speaker attribution, or task ownership.
- Do not paste passwords or sensitive personal information.

## Verification
- JavaScript syntax check: passed.
- Full `npm test`: passed, including Arabic/English summarizer behavior checks.
- Browser interaction and visual QA: still required before publication.
- Vite production build: not claimed unless Vite is available and the build completes.

## Publication
- Not deployed. Wait for owner approval after remaining QA.
