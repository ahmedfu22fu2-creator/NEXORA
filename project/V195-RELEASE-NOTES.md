# The Squad v195 — Minimal Premium Navigation

## Changes
- Replaced the old five-item social rail with six fixed, collapsible navigation groups and all 13 agreed destinations.
- Added a persistent account/profile entry at the bottom of the desktop rail.
- Added a dark minimal-premium black/gold navigation treatment with keyboard focus states and reduced-motion support.
- Connected destinations to existing routes and modules: feed, messenger, profile, updates, calls, cinema, city, civilization, games, services hub, owner dashboard, and settings.
- Kept the existing mobile bottom navigation, legacy navigation, authentication, chat, Firebase configuration/rules, 3D modules, and service modules intact.
- Added only two new files; no existing project files were deleted.
- Updated release metadata and Service Worker cache namespace to v195.

## Limitations
- AI Hub and Store currently open the existing Services Hub; their separate dedicated in-app screens are a later implementation stage.
- Games remain tied to an open conversation, as in the existing implementation.
- Admin dashboard remains visible only to the server-authorized owner account.
- No production build, live Firebase test, or real-device browser test is claimed by this release.
