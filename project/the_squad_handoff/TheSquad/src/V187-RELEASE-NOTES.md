# The Squad v187 — Call Network Reliability

## Base and preservation
- Built on the v186 source tree; no restart from a blank project.
- Compared with the v186 ZIP: 807 prior files retained, 0 deleted, 2 new files added, and 38 existing files updated.
- Existing Firebase web config, Firestore rules, Storage rules, and legacy app folders were not replaced.
- Canonical Firebase Functions deployment target remains `backend/firebase-functions` as declared in `firebase.json`.

## Implemented
- Added authenticated callable `getCallIceServers` in the canonical Firebase Functions backend.
- The callable returns the existing public STUN fallback and, when configured, short-lived (one-hour) TURN credentials generated server-side with HMAC-SHA1. The TURN shared secret is never sent to the browser.
- Existing WebRTC call setup now requests fresh ICE configuration before starting or accepting a call and falls back to the configured STUN list if the callable is unavailable.
- Added ICE failure recovery hooks using `restartIce()` where supported.
- Added a runtime diagnostic API on `window.SquadCallNetwork`.
- Added `.env.example` guidance for `TURN_SERVER_URL` and `TURN_SHARED_SECRET`.
- Updated release manifests, Service Worker cache, and regression checks to v187.

## Required activation by project owner
1. Obtain a TURN endpoint and REST shared secret from a TURN provider that supports coturn REST-style temporary credentials.
2. From the project root, set the Firebase secrets interactively:
   - `firebase functions:secrets:set TURN_SERVER_URL`
   - `firebase functions:secrets:set TURN_SHARED_SECRET`
3. Deploy the callable: `firebase deploy --only functions:getCallIceServers`.
4. Test calls from two separate devices on different networks. Do not treat a successful local source test as proof of cross-network calling.

Never paste the TURN shared secret into chat, source files, or browser configuration.

## Verification and limits
- `npm test`: PASS, including the new v187 static integration check and all existing regression checks.
- JavaScript syntax checks: PASS for the modified call client, backend, and new test.
- ZIP integrity: verified after packaging.
- Production build: NOT completed. Vite and esbuild are absent; `npm install --no-audit --no-fund` timed out in this environment.
- Firebase deployment and real two-device call tests: NOT performed.
- TURN relay behavior is inactive until the project owner configures provider values and deploys the callable.
- This release improves call network reliability only; it does not make the 22 Universe Suite local-first prototypes into live AI, live translation, full multiplayer city, streaming cinema, or real commerce.
