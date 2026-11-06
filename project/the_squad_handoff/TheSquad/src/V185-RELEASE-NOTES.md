# The Squad v185 — Universe Suite Stability

## What changed
- Added account-scoped local storage for all 22 Universe Suite modules.
- First sign-in adopts the existing anonymous Universe Suite data once; subsequent accounts receive isolated data.
- Added Firebase Auth-aware sync for `universeSuiteState/{uid}` with offline/local fallback, bounded payload validation, pending-write handling, and remote timestamp checks.
- Added owner-only Firestore rules for the new private collection. The existing v182 World Systems and v183 community rules remain in place.
- Added runtime tests for feature registration, first-login adoption, account isolation, account switching, and invalid remote data rejection.
- Updated release metadata and Service Worker cache to v185.

## Important deployment step
The new Firestore rule block is included in `site/chanse1/firestore.rules`, but it is **not deployed automatically**. Publish the updated rules in the Firebase project before expecting cloud sync. Until then, the Universe Suite continues to save locally and shows a clear sync warning.

## Honest limitations
- Firebase sync has not been tested against the user's live Firebase project or multiple physical devices.
- The existing 22 modules remain lightweight application features; this release does not turn local templates into live AI, 3D multiplayer, streaming, real-money commerce, or real-world transport.
- A production Vite build must still be run in an environment where the declared Vite/esbuild dependencies are installed.
