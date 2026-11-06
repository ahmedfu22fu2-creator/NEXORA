# v173 — Shared Events

## Added
- Shared events discovery and creation.
- Event type, place, description, and future date/time.
- Friend picker based on the current user's existing friend edges.
- Per-friend invitations with pending / accepted / rejected states.
- Incoming invitation inbox.
- Acceptance writes the invitee's attendee record atomically with the invitation status change.
- Event owner can cancel their own event.
- Attendee view displays the confirmed attendance count without exposing member profile details.

## Security
- Invitation creation is limited to the event owner and an existing friend edge.
- Invitee can only update their own pending invitation, and only its status/timestamp.
- Event owner cannot forge attendance on behalf of another user.
- Attendance creation requires event ownership or an accepted invitation in the same batch.
- Existing rules outside the `/events` match were preserved.

## Limitations
- No push notification delivery; invitations appear in the in-app invitation inbox when the app loads.
- No open public join requests yet; participation is invitation-based.
- Event discovery is visible to signed-in users, consistent with the existing events read policy.
- Firebase rules must be deployed manually; no live deployment or multi-account test was possible here.
