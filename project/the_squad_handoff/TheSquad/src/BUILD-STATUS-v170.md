# The Squad v170 — Personal Vault

Status: source package assembled; automated test suite passed.

Base: `TheSquad_v169_sync_conflict_guard.zip`.

## Added
- New **درع بياناتي / Personal Vault** entry points in the social actions area and Squad Hub.
- Offline JSON backup and restore for the signed-in account's local Workspace tasks, notes, memories, and demo wallet.
- Strict schema and field-size validation before restore; 2 MB import cap.
- Explicit confirmation before replacing local Workspace data.
- Privacy notice: backup stays on the device; passwords, sign-in data, and private messages are excluded.
- Restore guidance warns the user to review the v169 sync-conflict panel before uploading restored data.
- New namespaced responsive CSS, Service Worker cache version, manifests, and regression test.

## Preserved
- All v169 files and existing modules retained.
- No Firebase schema or Firestore/Storage rules changed.
- No existing chat, call, city, room, or account modules replaced.

## Verification
- `node --check site/v170-personal-vault.js`: passed.
- `node scripts/v170-personal-vault-check.mjs`: passed.
- `npm test`: passed all audit, smoke, localization, owner/account monitoring, release integrity, and v156-v170 regression checks.
- ZIP integrity and preserved-file comparison performed after packaging.

## Not claimed as complete
- Browser visual QA, mobile device QA, and live account testing were not run.
- Backup/restore is local-device data portability, not a cloud backup service.
- `npm run build` status is recorded separately; Firebase live behavior and deployment were not tested.
