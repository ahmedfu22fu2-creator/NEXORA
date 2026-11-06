# The Squad v172 — Build Status

- Base: v171 Member Journey; original files preserved.
- Added: local-first Events Hub for creating, filtering, RSVP toggling, completing, and deleting personal events.
- Events are scoped by signed-in UID in localStorage. This release does not claim cross-user publishing, invitations, shared attendance, or server synchronization.
- Firebase rules and backend were not changed.
- Automated checks: run `npm test`; release-specific test is `scripts/v172-events-hub-check.mjs`.
- Browser/mobile visual QA and live multi-user Firebase tests are not performed in this environment.
- Vite build status depends on Vite being installed in the environment.
