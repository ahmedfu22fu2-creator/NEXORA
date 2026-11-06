# The Squad v183 — Account Sync + Shared City

## What's included

- Per-account cloud backup for the World Systems state in `worldState/{uid}`.
- Local storage is separated by Firebase UID so switching accounts on one browser does not carry one signed-in account's world progress into another account.
- Offline-first local saving; cloud synchronization retries when connectivity returns.
- A shared City Community board backed by `worldCommunity/{uid}`. It publishes only a small curated feed of proposals, project ideas, and challenge entries. Personal memories and journal entries are not published.
- The community board is readable to signed-in users; each account can write/delete only its own board document.
- Existing chat, account, Storage, Functions, and older project files are retained.

## Required before live use

1. Publish the updated Firestore rules from `site/chanse1/firestore.rules` to the Firebase project. The root `firebase.json` already points to this file.
2. Install the project's dependencies with `npm install --no-audit --no-fund` in an environment with npm registry access.
3. Run `npm run build` and deploy the resulting `dist/` directory using the project's existing hosting configuration.
4. Test with two real Firebase accounts on separate browsers/devices. Verify private account state is not visible to the other account and shared City Community entries appear to both.

## Honest verification status

- `npm test`: passed, including the full historical regression suite and v183 shared-city checks.
- `node --check` for the changed JavaScript files: passed.
- ZIP archive integrity: checked when packaged.
- Production Vite build: **not completed**; this environment has no installed `vite` or `esbuild`, and npm dependency installation is still required.
- Firebase Rules Emulator and live Firebase multi-account tests: **not run**; no live project credentials/emulator were available in this build environment.
- This release adds a shared activity board, not a synchronized real-time 3D player simulation. Real-time avatar movement, live voice/video rooms, and server-authoritative game economy remain separate work.

## Files added in v183

- `scripts/v183-shared-city-check.mjs`
- `RELEASE-v183-SHARED-CITY.md`

## Files updated in v183

- `site/v181-world-systems.js`
- `site/v182-cloud-sync.js`
- `site/chanse1/firestore.rules`
- `site/sw.js`
- `site/version.json`
- `site/chanse4/version.json`
- `package.json`
- Existing regression checks now validate the current release metadata/cache and additive Firestore rules.
