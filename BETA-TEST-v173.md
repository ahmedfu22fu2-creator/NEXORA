# The Squad v173 — Beta QA Report

## Scope
A pre-deployment beta/static QA pass was run against the v173 ZIP. No live Firebase credentials or deployed project access were available, so this report does not claim a real two-account or multi-device test.

## Checks completed
- ZIP integrity: passed before extraction (`testzip() == None`).
- Full regression suite: `npm test` passed, including production audit, smoke parsing, localization, owner/account checks, release integrity, v156-v172 regression checks, and v173 shared-events checks.
- v173 JavaScript parses successfully through the smoke suite and dedicated `vm.Script` test.
- HTML/CSS/JS/Service Worker wiring and release manifests: passed.
- Source Firestore rules and deployment-copy equality: passed.
- Invitation collection-group read rule was tightened to authorize only records whose `inviteeUid` matches the signed-in user (or event owner), avoiding an unnecessary path-wildcard equality in the collection-group query rule.
- Existing project files preserved: archive contains 754 entries; no file deletion was part of this beta pass.

## Not tested / required before public beta
- Firebase Emulator rule execution (Firebase CLI/emulator not installed in this environment).
- Deployment of `FIRESTORE-RULES-v173.rules` to the target Firebase project.
- Real two-account invite, accept, reject, RSVP, cancel, and unauthorized-access tests.
- Browser/mobile visual QA and push notifications.
- Production Vite build (`node_modules` are absent; Vite is not installed here).

## Manual two-account beta checklist
1. Publish `FIRESTORE-RULES-v173.rules` to the same Firebase project configured by the app.
2. Sign in as Account A and Account B in separate browser profiles/devices; make them friends.
3. As A, create a future event and invite B.
4. As B, open Shared Events > My Invitations; verify the invitation appears.
5. Accept as B; verify the event attendee count increases by one.
6. Reject a second invitation as B; verify no attendee record is created.
7. As B, attempt to edit/cancel A's event and create an attendee record without acceptance; both must be denied.
8. As A, cancel the event; verify B can no longer accept the cancelled event.
9. Repeat with a non-friend account; invitation creation must be denied.

## Beta status
**Static beta checks passed. Live multi-account beta remains pending deployment and the manual checklist above.**
