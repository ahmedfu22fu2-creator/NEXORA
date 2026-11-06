# The Squad v175 — Beta QA Report

Date: 2026-11-02  
Base: TheSquad_v174_startup_recovery.zip  
Release: v175 — Startup Diagnostics & Recovery

## Changes verified
- Clearer recovery state for direct `file://` opening, offline devices, missing Firebase SDK, and Firebase initialization problems.
- Startup timeout increased to 12 seconds.
- Retry control reloads the page on user action.
- Online/offline events update the recovery message.
- Successful auth-state startup marker still prevents fallback from replacing a working session.
- Service Worker cache and root/legacy version manifests advanced to v175.
- Existing v156–v173 feature files, rules, and folders retained.

## Tests run
- `npm test`: PASS. All configured production audit, smoke, localization, owner-monitor, account-monitor, release-integrity, and regression checks v156–v175 passed.
- Production audit: 86 local HTML references checked.
- Smoke tests: 48 local scripts resolved; 56 JavaScript files parsed.
- Owner monitor: 12/12 checks passed.
- Account monitor: 13/13 checks passed.
- Release integrity: v175 manifests synchronized; 96 precache entries valid.
- v173 shared-events static integration/security checks passed.
- v175 startup diagnostics simulation passed: file protocol guidance, offline/online update, missing SDK diagnosis, retry action, timeout, and successful-start guard.
- Local HTTP static-server check: `/`, `index.html`, `v175-startup-recovery.js`, `chanse1/app.js`, `chanse4/firebase-config.js`, `sw.js`, `version.json`, and `v173-shared-events.js` all returned HTTP 200.
- ZIP integrity checked after packaging; no corrupt entries.

## Not verified
- `npm run build` could not run because Vite is not installed in this environment (`vite: not found`).
- No real browser automation session was available; UI behavior was simulated in Node tests.
- Firebase Emulator and live Firebase project tests were not run. Real account creation/login, Firestore rules, chat, invitations, calls, storage, and push still require live testing.
- No Firebase rules were deployed and no production site was published.

## Local run
From the extracted project root:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`). Do not double-click `site/index.html`; Firebase-backed features need an HTTP(S) origin.
