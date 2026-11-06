# The Squad v169 — Sync Conflict Guard

## Changes
- Improved the v168 private Workspace/Memory cloud sync.
- Stores a per-account local baseline signature after successful cloud reads/writes.
- Compares local and cloud state on reconnect, so unsynced local edits are not silently overwritten after a panel close or page reload.
- When both sides changed, shows an explicit conflict panel with two actions: keep this device's version or load the cloud version.
- Blocks periodic background writes while a conflict is unresolved.
- Keeps the existing `users/{uid}/dev/squadVault` document path and schema. Firestore rules are unchanged.

## Safety and scope
- No passwords, private chat messages, or profile data are added to the vault.
- No automatic merge is claimed. Choosing a version replaces the whole vault snapshot.
- All previous project folders, features, and historical source files remain in the archive.

## Tests
- Full `npm test`: passed, including v169 regression checks.
- `node --check site/v168-universe-integration.js`: passed.
- Production Vite build: unavailable because Vite is not installed in the environment.
- Live Firebase, real multi-device, browser visual, and mobile tests remain pending.
