# The Squad v186 — Test Report

## Passed
- `npm test`: PASS — production audit, smoke tests, localization, owner/account monitoring, release integrity, v156–v185 regressions, and the new v186 control-center check.
- Production audit: 101 local HTML references checked.
- Smoke tests: 56 local scripts resolved; 64 JavaScript files parsed.
- Release integrity: root and nested manifests synchronized at v186; 111 Service Worker precache entries verified.
- New v186 check: preference keys, weak-device/accessibility controls, diagnostics disclosures, release wiring, and escaped local-memory rendering verified.
- Archive integrity: ZIP test passed.
- Preservation comparison against v185: 802 previous files retained, 0 deleted, 3 added.
- Byte-for-byte unchanged: `site/chanse1/firestore.rules`, `site/chanse3/storage.rules`, `site/chanse4/firebase-config.js`, `backend/firebase-functions/index.js`, `firebase.json`.

## Not passed / not run
- Production build: BLOCKED because Vite and esbuild are not installed (`vite: not found`).
- Live Firebase Auth/Firestore, deployed rules and multi-device sync: not tested.
- Browser visual QA, real voice/video calls, real-time 3D multiplayer and third-party AI: not tested.

Passing automated source checks do not establish that the application is production-ready or all advertised systems are live.
