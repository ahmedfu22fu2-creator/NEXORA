# The Squad v171 — Member Journey & Achievements

## Added
- A new personal Journey & Achievements panel, reachable from the main Squad hub and social action row.
- Six private badges based on the signed-in member's existing local Workspace counts: first step, planner, writer, memories, organizer, and builder.
- A progress indicator and task/note/memory totals, with a manual refresh action.
- Responsive, namespaced styling and keyboard Escape dismissal.

## Privacy and correctness
- Counts are read only from the current member's existing `squad.v165.{uid}` local Workspace data.
- Achievement progress is stored locally under `squad.v171.{uid}.journey`.
- No public leaderboard, social exposure, private-message scanning, new network calls, Firebase writes, or Firestore rule changes.
- The panel clearly labels its counts as local and not server-verified. This is a personal progress layer, not a trusted reward economy.

## Compatibility
- Additive only: v170 files and legacy systems remain in place.
- Service Worker cache advanced to `squad-v171-member-journey`; both new assets are precached.
- Both release manifests and package version advanced to v171.
