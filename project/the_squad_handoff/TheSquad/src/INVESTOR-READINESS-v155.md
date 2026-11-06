# The Squad v155 — Investor Presentation Readiness Repair

## What changed
- Added the missing root `site/version.json` used by the main page's update checker; kept the historical `site/chanse4/version.json` synchronized.
- Rebuilt the root Service Worker precache list from real local assets referenced by the live entry points. The previous list referenced many legacy root-level paths even though the assets live under `chanse1`–`chanse4`.
- Added a new versioned cache namespace (`squad-v155-investor-readiness`) and corrected notification icon/badge paths.
- Repaired the legacy `site/chanse3/index.html` entry point: it now uses the correct root base URL and resolves its local assets to their actual canonical locations. This removed 36 broken local references in that page.
- Changed the remaining inline update notice in the main page and legacy entry point to English.
- Added a release-integrity test that verifies both manifests, all Service Worker precache paths, and the presence of all four source/site folders.
- Updated release metadata and the version-specific test expectations to v155.

## Preservation
- `source/The-Squad-v137/` is unchanged from v154. Its 373 files were compared against the v154 archive; no differences were reported.
- `chanse1`, `chanse2`, `chanse3`, and `chanse4` remain present in both source and site trees.
- Firestore rules, Storage rules, frontend Firebase config, `.firebaserc`, and existing backend business logic were not changed in this release.

## Verification performed
- `npm test`: passed all production audit, smoke, localization, owner dashboard, account-monitoring, and release-integrity checks.
- HTML local-reference scan across all site HTML files: 126 references checked, 0 missing after repairing the legacy `chanse3/index.html` entry point.
- Service Worker precache: 71 entries; every listed local file exists.
- ZIP integrity: checked separately after packaging.

## Important limitations / release blockers
- A full Vite production build was **not** completed. `node_modules` was absent; offline install had no cached Vite/esbuild packages and online npm installation timed out. Do not describe this as a successful production build.
- No real browser/device test, Firebase live test, two-account chat test, WebRTC call test, or multiplayer session test was possible in this run.
- The deployed Functions are not verified. Account monitoring requires the v154 callable functions to be deployed to the intended Firebase project.
- The current packaged frontend Firebase config and `.firebaserc` point to `chatapp-67eb6`, while a previously identified The Squad project ID is `the-squad-e36e7`. This discrepancy was deliberately **not** changed. Confirm the actual production project in Firebase Console before deploying Functions or presenting live account data.
- This is a repair candidate for controlled staging/demo validation, not a certification that every game and social feature is production-ready.

## Hosting
For a static Cloudflare Pages upload, use the contents of `site/` only. Do not upload `backend/` as static assets. Deploy Functions separately only after confirming the correct Firebase project and reviewing the backend deployment target.
