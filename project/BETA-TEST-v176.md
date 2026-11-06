# The Squad v176 — Vite Build Readiness Report

## Scope

v176 continues from v175 without replacing the existing application. It updates the release metadata and Service Worker cache version, adds a build preflight command, and adds a static readiness regression test.

## Changes

- Root package version: `176.0.0`.
- Site and legacy manifests synchronized to `v176-vite-build-readiness` / build `176`.
- Service Worker cache advanced to `squad-v176-build-readiness` to prevent stale cached assets from being treated as the current release.
- Added `npm run build:preflight` (`scripts/v176-build-preflight.mjs`) to check the Node runtime and whether Vite/esbuild are installed, with actionable install instructions.
- Added `scripts/v176-build-readiness-check.mjs` and included it in `npm test`.
- Existing features and v156-v175 regression checks retained.

## Checks actually run

- ZIP source integrity before extraction: passed (811 entries, no corrupt member).
- `node --check scripts/v176-build-preflight.mjs`: passed.
- `node --check scripts/v176-build-readiness-check.mjs`: passed.
- `npm test`: passed, including production audit, 86 local HTML references, 48 local scripts resolved, 56 JavaScript files parsed, localization, owner monitor 12/12, account monitor 13/13, release integrity (96 valid precache entries), v156-v175 regression checks, and v176 readiness check.
- `npm run build:preflight`: ran and correctly reported missing `vite` and `esbuild`.

## Vite production build — blocked, not passed

- Attempted `npm install --no-audit --no-fund`.
- npm could not resolve `registry.npmjs.org`; log reported `EAI_AGAIN` (DNS/network resolution failure).
- No usable local npm cache contained Vite or esbuild.
- Attempted `npm run build`; it failed with `vite: not found` (exit 127).

This is an environment/network dependency blocker, not proof of a Vite source-code error. A production bundle has **not** been generated or verified. Once network access to the npm registry is available, run:

```bash
npm install --no-audit --no-fund
npm run build:preflight
npm run build
```

Then verify the generated `dist/` output in a browser and run the live Firebase checks separately.

## Not tested

- Real Firebase Authentication/Firestore/Storage against the configured project.
- Two-account live invitations and shared events.
- Production browser QA after a successful Vite bundle.
- Deployment to the user's hosting provider.

## Result

Static project tests passed. Vite build remains blocked by unavailable npm registry DNS and missing local dependencies. Do not describe v176 as a successful production build until the three commands above complete successfully.
