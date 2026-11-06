# The Squad v185 — Test Report

- `npm test`: PASS (full existing regression suite plus v185 runtime tests).
- Production audit: PASS — 99 local HTML references checked.
- Smoke tests: PASS — 55 local scripts resolved; 63 JavaScript files parsed.
- Release integrity: PASS — v185 manifests synchronized; 109 Service Worker precache entries exist.
- v185 runtime: PASS — 22 feature registrations, anonymous first-login adoption, account A/B isolation, account switching, malformed remote-state rejection, and cloud/rules wiring.
- JavaScript syntax: PASS — v184 feature module and v185 sync module.
- Existing files: 0 deleted; 4 files added. Legacy source files, Firebase config, Storage rules, Functions backend, and Firebase deployment config retained. Firestore rules received one additive v185 owner-only collection block.

## Not passed / not run
- `npm run build:preflight`: NOT READY because `vite` and `esbuild` are not installed.
- `npm run build`: BLOCKED (`vite: not found`).
- Live Firebase Rules compilation/deployment: NOT run.
- Live Firebase Auth/Firestore and two-device sync: NOT run; requires the user's Firebase project and deployed rules.
- Browser visual QA, real voice/video calls, real-time multiplayer, and third-party AI provider tests: NOT run.

A passing local test suite is not a production deployment or proof that live cloud services work.
