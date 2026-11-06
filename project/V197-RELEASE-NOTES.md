# The Squad v197 — Home Command Center

## Product direction
The Home destination now acts as a personal command center rather than immediately dropping the user into the legacy social feed. The dashboard uses the existing black-and-gold Minimal Premium identity and offers a clearer gateway into the platform's current sections.

## Implemented
- Added `site/v197-home-command.js` and `site/v197-home-command.css` as additive files.
- Added a personalized welcome header using the existing Firebase-authenticated user display name when available.
- Added a compact control deck with counts derived only from currently rendered conversation and story elements. No fake online-friend, notification, or activity counts are generated.
- Added four primary portals: Squad World, Messenger, 3D Cinema, and Profile.
- Added secondary shortcuts to Civilization, AI Hub, and Store.
- Connected portal actions to the existing `SquadPremiumNavigation.open()` route bridge.
- Added responsive mobile layout and reduced-motion handling.
- Updated the release metadata, package versions, Service Worker cache namespace and precache list.
- Updated historical regression checks that intentionally assert the active release version/cache namespace.
- Kept existing feature folders, Firebase rules/configuration, backend files and legacy modules in place.

## Verification
- Full root `npm test`: PASSED.
- Production static audit: PASSED (49 local HTML references checked).
- Smoke tests: PASSED (57 local scripts resolved; 69 JavaScript files parsed).
- Localization check: PASSED.
- Owner monitor: 12/12 PASSED.
- Account monitor: 13/13 PASSED.
- Release integrity: PASSED (122 valid Service Worker precache entries; root and legacy version manifests synchronized).
- Existing v156–v196 regression checks: PASSED.
- New v197 Home Command check: PASSED.

## Known limitations
- `npm run build` was attempted but could not run because Vite is not installed in this execution environment (`vite: not found`). No claim of a successful production bundle is made.
- No live Firebase, deployed-site, or physical-device browser test was performed.
- Dashboard metrics are intentionally limited to rendered UI elements and do not imply server-verified online presence or complete account-wide totals.
- This release is a Home experience milestone; it does not claim completion of all 13 roadmap sections.
