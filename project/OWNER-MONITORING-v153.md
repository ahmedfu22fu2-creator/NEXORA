# The Squad v153 — Owner Monitoring Dashboard

## Focus of this release
The first priority is the private owner monitoring screen. The existing v148 dashboard was present but displayed Arabic labels inside an English/LTR platform and had a compact, inconsistent layout. The wallet label was also hardcoded in the UI rather than read from the wallet callable response.

## Changes
- Rebuilt the owner dashboard presentation in English and LTR with a premium dark / warm-metal visual system.
- Added a section navigation bar for Overview, Platform Wallet, Reports, and Services.
- Organized platform counters into responsive metric cards, including accounts, online users, active city players, conversations, reports, channels, posts, calls, rooms, stories, communities, game sessions, and public profiles.
- Added clearer service-state labels and a report list that displays only the existing reason/timestamp fields.
- Reworked the wallet area into separate balance metrics, income-entry form, withdrawal-request form, withdrawal queue, and recent ledger list.
- Added confirmation prompts before recording income, creating withdrawals, approving/rejecting requests, or marking a manual payment complete.
- Wallet ID is now taken from the authenticated backend response; the admin account SID remains separately displayed as `1000000000`.
- Added Escape-to-close, focus handling, accessible dialog/status labels, responsive mobile layout, and reduced-motion support.
- Added the dashboard JS/CSS to the Service Worker precache and advanced the cache namespace to v153.

## Security / data boundaries
- No Firestore rules, Storage rules, Firebase configuration, Functions, collections, account mappings, or wallet backend logic were changed.
- All dashboard access still requires the server callable `checkAdminAccess`, which checks the authenticated UID against `ids/1000000000`.
- Dashboard metrics continue to come from `getAdminDashboard`; wallet actions continue to use the existing server-authorized callable functions.
- The UI does not display passwords or private message bodies.
- Wallet activity is accounting/request tracking only. Approving a withdrawal does not send money; manual payment must occur outside the site and only then be marked as paid.
- Original `source/The-Squad-v137/` remains untouched. All four `chanse1`–`chanse4` folders remain in both source and site trees.

## Validation
- `node --check` on the updated dashboard JavaScript.
- `npm test` including the new owner-monitor static regression checks.
- ZIP integrity and source/site folder-presence checks after packaging.

## Limitations
- No live browser, Firebase, or second-account test was available in this run.
- The dashboard only displays fields already returned by the existing backend; it does not yet provide user search, moderation actions, detailed analytics history, or live service probes.
- Cloud Functions must already be deployed for real dashboard data and wallet actions to work.
