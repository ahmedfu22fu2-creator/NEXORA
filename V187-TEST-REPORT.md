# The Squad v187 — Test Report

## Passed
- `npm test`: PASS — production audit, smoke tests, localization, owner/account monitors, release integrity, v156–v186 regressions, and v187 call-network checks.
- Production audit: 102 local HTML references checked.
- Smoke tests: 57 local scripts resolved; 65 JavaScript files parsed.
- Release integrity: v187 root and nested manifests synchronized; 112 Service Worker precache entries verified.
- New v187 check: authenticated callable declaration, HMAC temporary TURN credentials, one-hour expiry, STUN fallback, client refresh integration, ICE restart hooks, and release wiring.
- Source preservation compared with v186 ZIP: 807 files retained, 0 deleted, 2 new files, 38 updated files.
- Existing canonical Firebase web configuration and Firestore/Storage rules were not changed.

## Not completed / not run
- Production build: blocked because Vite and esbuild are not installed. A dependency installation attempt timed out.
- Firebase Functions deployment: not run.
- TURN provider configuration: not supplied or configured.
- Real calls across different networks/devices: not tested.
- Browser visual QA and live multiplayer tests: not run.

Passing automated checks confirm source wiring and static guards; they do not prove a live TURN relay or production-ready calls.
