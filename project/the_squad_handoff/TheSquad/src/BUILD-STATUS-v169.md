# The Squad v169 — Sync Conflict Guard

Status: source package assembled; all included automated checks passed.

Base: `TheSquad_v168_universe_integration.zip`.

## Added
- Persistent per-account sync baseline for Workspace tasks, notes, and Memories.
- Conflict detection when local unsynced edits and a different cloud revision both exist.
- Explicit choices to keep this device's data or load the cloud copy.
- Automatic remote replacement is avoided when a conflict is detected, including after closing/reopening the sync panel or reloading the app.
- Existing v168 modules and all earlier project files are preserved; no Firestore rules or data schema were changed.

## Verification
- `node --check site/v168-universe-integration.js`: passed.
- `node scripts/v169-sync-conflict-guard-check.mjs`: passed.
- `npm test`: passed all audit, smoke, localization, owner/account monitoring, release integrity, and v156-v169 regression checks.
- ZIP integrity and preserved-file comparison: recorded after packaging.
- `npm run build`: not completed because Vite is not installed in this environment (`vite: not found`).

## Not claimed as complete
- Live Firebase behavior, two-device conflict testing, browser visual QA, and mobile QA have not been run.
- The conflict UI prevents silent replacement, but it does not merge individual task/note fields automatically; the user selects one complete snapshot.
- No deployment was performed.
