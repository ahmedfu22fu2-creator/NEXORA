# THE SQUAD v214 — Garage cloud foundation

## Work carried forward
- Preserved the existing three-level garage, both drivable switchback ramps, 30 marked bays, and existing district/car code.
- Added visible CCTV-style camera housings at four corners of each of the three garage decks (12 props). These are 3D scene props only: there is no camera feed, recording, playback, or security monitoring yet.
- Replaced the garage reservation flow with a Firestore-backed listener and transactional bay claim when a signed-in Firebase user is available. A local-only fallback remains and is explicitly labelled as temporary.
- Added `FIRESTORE-RULES-v214.rules`: authenticated reads; each player can create an empty bay reservation and only update/delete their own reservation. One document per bay ID provides a unique slot key.
- Added refresh control and release flow. Existing per-account local reservation data is retained as fallback.

## Verification performed
- `node --check site/chanse2/district.js` — PASS.
- `node scripts/v213-smart-garage-check.mjs` — PASS (preserved ramp geometry and three-floor garage).
- `node scripts/v214-garage-cloud-check.mjs` — PASS (static regression checks for Firestore listener, transaction, ownership rules, camera props and release metadata).

## Not verified / external dependencies
- Full `npm test` and Vite production build were not run: dependencies are not installed in this extracted environment (`node_modules` absent).
- Firebase rules have NOT been deployed. Cloud reservation sync will fail until `FIRESTORE-RULES-v214.rules` is reviewed and deployed to the project's Firebase database.
- No live multi-account/browser test was possible; therefore cross-player synchronization is implemented in code but not yet confirmed against the live Firebase project.
- The transaction protects a bay from being overwritten by another user. The current rules do not yet enforce a server-verified vehicle ownership record; that is required before smart gate access and valet can be considered secure.

## Requested six-system phase status
1. Smart ownership-recognition gates — NOT IMPLEMENTED.
2. 3D CCTV — camera housings only; live feeds/monitoring NOT IMPLEMENTED.
3. Valet Parking — NOT IMPLEMENTED.
4. Summon vehicle to player — NOT IMPLEMENTED.
5. Cross-player parking synchronization — implemented client-side against Firestore, pending deployed rules and live test.
6. Garage administration in control panel — NOT IMPLEMENTED.

## Important security note
Do not treat client-provided car IDs or local storage as proof of ownership. The next step must introduce server-authoritative ownership validation (callable Cloud Function or trusted backend) before gates, valet, or vehicle summon are enabled.
