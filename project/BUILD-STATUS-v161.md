# The Squad v161 — Startup Recovery Guard

## Repair
- Added a 12-second startup fallback to the main page. If the Firebase auth-state callback never arrives, the splash screen is dismissed and the sign-in interface displays an explicit connection/configuration warning instead of leaving the user trapped at the loading screen.
- The fallback warning is removed when the actual Firebase auth callback succeeds; normal auth and app behavior is retained.
- Advanced root and legacy version manifests and Service Worker cache namespace to v161 so browsers can obtain the repaired entry files.
- Added a dedicated startup recovery regression check.

## Preservation
- No files were deleted or renamed.
- `source/The-Squad-v137/` retained in the archive.
- `chanse1`, `chanse2`, `chanse3`, and `chanse4` retained in source and site trees.
- Firebase config, Firestore/Storage rules, backend Functions, authentication and chat logic were not altered except for clearing the fallback warning from the existing auth callback.

## Validation
- `npm test`: all existing audits/regression tests and the new v161 startup recovery check passed.
- ZIP integrity verified after packaging.

## Known release blocker
- `site/chanse4/firebase-config.js` still points to Firebase project `chatapp-67eb6`, while the project previously identified by the owner was `the-squad-e36e7`. It was not changed because the correct complete Web App configuration (API key, auth domain, storage bucket, messaging sender ID) must be obtained from the Firebase Console; inventing these values could break sign-in or connect to the wrong data.
- No live Firebase browser test was possible here. This patch prevents indefinite splash-only failure and surfaces startup failure; it does not guarantee Firebase sign-in/data connectivity.
- Vite production build and real browser/mobile test remain unverified.
