# The Squad v182 — QA report

## Automated checks

- `npm test`: passed, including production audit, smoke parsing, localization, owner/account monitors, release integrity, and v156–v182 regression checks.
- `node --check site/v181-world-systems.js`: passed.
- `node --check site/v182-cloud-sync.js`: passed.
- `node --check scripts/v182-cloud-sync-check.mjs`: passed.
- ZIP integrity: checked after packaging.
- Source comparison against v181: 0 files deleted; 3 files added.

## Files added

- `site/v182-cloud-sync.js`
- `scripts/v182-cloud-sync-check.mjs`
- `V182-RELEASE-NOTES.md` and this QA report are release documentation.

## Existing Firebase files

- `site/chanse4/firebase-config.js`: unchanged.
- `site/chanse3/storage.rules`: unchanged.
- `backend/firebase-functions/index.js`: unchanged.
- `firebase.json`: unchanged.
- `site/chanse1/firestore.rules`: additive v182-only helper and `worldState/{uid}` match; the v181 rules content was retained byte-for-byte after removing the v182 additions.

## Limitations / not tested

- Firebase rules were not deployed and were not run in the Firebase Emulator.
- No live Firebase session or two-device test was available. Cloud sync is wired in source but is not confirmed active until the updated Firestore rules are deployed and a real account test passes.
- `npm run build:preflight` reports missing Vite and esbuild. A production Vite build has not been completed.
- No hosting deployment was performed.

## Security scope

The new document path is `worldState/{uid}`. Firestore rules permit only the signed-in owner to read or write their own document, restrict its schema and collection sizes, and deny client deletion. The client does not write passwords or private profile fields into this document.
