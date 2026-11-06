# The Squad v173 — Shared Events

- Base release: v172 Events Hub. This is an additive release; v172 personal events and all existing project files remain in place.
- Added a separate shared-events interface at `site/v173-shared-events.js` and `site/v173-shared-events.css`.
- Shared events are stored in the existing Firestore `events/{eventId}` collection.
- Friends can be selected from the signed-in user's existing `users/{uid}/friends` collection.
- Invitations are stored at `events/{eventId}/invitations/{inviteeUid}`. The invitee can accept or reject their own pending invitation.
- Accepting an invitation and creating the attendee record are committed in one Firestore batch. Rules require the accepted invitation (or event ownership) before attendance can be created.
- Event owners alone can edit/cancel/delete their events. Only a member can create/delete their own attendee record. Invitation writes are restricted to the event owner and existing friends; invitees can only change invitation status and timestamp.
- No phone numbers, birth dates, account SID, or private profile documents are used by the shared-events interface.
- Updated `site/chanse1/firestore.rules` and the deploy copy `FIRESTORE-RULES-v173.rules`; existing chat, account, social, privacy, and storage rules were retained.
- Automated verification: `npm test` passed all existing regression checks plus the v173 static integration/security-contract checks; JavaScript syntax checks pass; ZIP integrity and file-preservation checks pass.
- Build limitation: `npm run build` could not run because Vite is not installed in this environment (`vite: not found`); this is an environment/dependency limitation, not a successful production build.
- Not verified in this environment: live Firebase project deployment, Firestore Emulator rule execution, actual two-account/multi-device session, push notifications, and browser/mobile visual QA.
- Important deployment requirement: publish `FIRESTORE-RULES-v173.rules` to the same Firebase project used by the app before expecting shared event creation/invitations to work. The ZIP does not deploy rules or change the live Firebase project automatically.
- Invitation inbox uses a Firestore collection-group query filtered by `inviteeUid`; no composite index is expected for this single-field query. The public event list uses the existing single-field `eventAt` ordering.
