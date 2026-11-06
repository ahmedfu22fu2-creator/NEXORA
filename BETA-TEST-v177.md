# BETA TEST — The Squad v177

## Results

- `npm test`: **PASS** — full existing suite plus v177 architecture and wallet-hardening checks.
- Production HTML reference audit: **PASS** — 86 local references.
- Smoke checks: **PASS** — 48 local scripts resolved; 56 JavaScript files parsed.
- Owner monitor: **12/12 PASS**.
- Account monitor: **13/13 PASS**.
- Release integrity: **PASS** — v177 manifests synchronized; 96 Service Worker precache entries valid.
- Regressions v156–v176: **PASS**.
- Architecture/deployment configuration: **PASS** — root, backend compatibility, and site compatibility configs resolve to the same Functions, Firestore, and Storage inputs.
- Wallet hardening: **8/8 PASS** — integer-cent arithmetic, bounded stored values, server-admin checks, pending ledger consistency, and manual payout status gates.
- `node --check backend/firebase-functions/index.js`: **PASS**.
- Firebase JSON/package/version parsing: **PASS**.

## Build limitation

`npm run build:preflight`: **BLOCKED** — Vite and esbuild are not installed.

`npm install --no-audit --no-fund --fetch-retries=0`: **BLOCKED** — npm registry DNS returned `EAI_AGAIN` for `registry.npmjs.org`.

Therefore `npm run build` has **not** been verified, and no production `dist` bundle is included or claimed.

## Not tested

- Firebase Emulator rules tests.
- Live Firebase deployment or project selection.
- Two-account shared-events, chat, and permissions tests.
- Browser visual testing across mobile/desktop.
- Real-world wallet reconciliation or payout; payouts remain manual and the app does not transfer funds.

## Preservation

No `chanse1`–`chanse4` app folder, existing CSS layer, GLB model, historical Firestore rules snapshot, or feature module was deleted. The previous backend Functions file is preserved as `backend/firebase-functions/index.v176-legacy.js`.
