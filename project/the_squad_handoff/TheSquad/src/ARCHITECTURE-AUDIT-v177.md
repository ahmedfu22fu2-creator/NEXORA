# The Squad v177 — Architecture & Deployment Audit

## Scope and preservation policy
This release is a conservative hardening pass. No `chanse1`–`chanse4` application folder, room, UI stylesheet, GLB model, historical rules snapshot, or existing feature was deleted. The archived `source/The-Squad-v137` tree remains intact.

## Findings verified in v176

1. **Cloud Functions drift:** `backend/firebase-functions/index.js` was 126 lines longer than the archived `source/The-Squad-v137/chanse4/firebase-functions/index.js` copy. The backend entry contains `searchAdminAccounts`, `getAdminAccountActivity`, and `getAdminReports`; the archived source copy does not. v177 keeps the more complete backend entry as canonical and preserves an exact backup as `index.v176-legacy.js`.
2. **Deployment configuration ambiguity:** root had no `firebase.json`; `backend/firebase.json` deployed Functions only; `site/chanse4/firebase.json` pointed to a `firebase-functions` folder that did not exist under `site/chanse4`. v177 adds a root deployment configuration and aligns both compatibility configs to the same Functions source, Firestore rules, and Storage rules.
3. **Firestore rule history:** `site/chanse1/firestore.rules` exactly matched `FIRESTORE-RULES-v173.rules`; the v164 snapshot matched an older source rules file, and v158 differed. Historical snapshots are retained and are not deployment targets.
4. **GLB size:** the four discovered model files were approximately 30–39 KB each, not unusually large. The existing district loader requests them only when needed and has a procedural fallback. No CDN migration or asset replacement was justified by the measured sizes.
5. **CSS layering:** `site/index.html` loads a sequence of stylesheets intentionally, including later versioned overrides. The order was retained; no stylesheet was deleted or concatenated because that could change specificity and visual behavior.
6. **Production hygiene:** Vite's configured root is `site`, and output is `dist`; root-level test reports and historical snapshots are not part of the Vite input tree. No source/test files were deleted.

## v177 changes
- Added root `firebase.json`: canonical Functions source `backend/firebase-functions`, active Firestore rules `site/chanse1/firestore.rules`, active Storage rules `site/chanse3/storage.rules`, Hosting output `dist`.
- Updated compatibility Firebase configs to resolve to the same canonical deployment inputs.
- Kept the more complete canonical backend Functions entry, including the three owner-admin callables; preserved its exact pre-release copy.
- Preserved the former backend Functions entry at `backend/firebase-functions/index.v176-legacy.js`.
- Added `scripts/v177-architecture-check.mjs` to assert deployment path consistency, critical callable exports, active rules snapshot, release metadata, and measured GLB sizes.
- Updated release metadata and Service Worker cache version to v177.

## Important security limitations
This is a static configuration and code-preservation audit, not a complete security certification. Firestore and Storage rules have not been run through the Firebase Emulator in this environment. Live two-account authorization tests, App Check enforcement review, production project selection, secret scanning, and a full threat model remain required before public deployment. No Firebase rules or Functions were deployed to a live project.

## Build status
The existing Vite production build still requires `npm install`. In the prior attempt, npm registry access failed with DNS `EAI_AGAIN`; no claim is made that `vite build` succeeded. Run `npm install`, `npm test`, then `npm run build` in an environment with registry access.

7. **Platform wallet ledger:** static review found floating-point additions and silent `Math.max(0, ...)` clamping during withdrawal settlement. v177 now stores and reconciles monetary arithmetic in integer cents, validates stored values and safe upper bounds, and stops settlement if the pending-withdrawal ledger does not match the request. This is still a static code hardening pass; it has not been exercised against live financial data or Firebase Emulator.
