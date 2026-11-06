# v170 — Personal Vault

A small but practical data-protection feature was added without replacing the existing app architecture.

### User-facing feature
- Open **درع بياناتي** from the social actions row or Squad Hub.
- Export a JSON backup of Workspace tasks, notes, memories, and the local demo wallet.
- Restore a previously exported JSON file after schema validation and a clear confirmation.
- Backups are generated locally and are not uploaded. Authentication secrets and private chat messages are intentionally excluded.

### Safety and compatibility
- Restore is restricted to the current signed-in user's existing local storage namespace.
- Imports are limited to 2 MB, known schema version 1, bounded arrays, and bounded text fields.
- The user is warned to check v169's sync-conflict guard before syncing restored data.
- No Firestore rules, Storage rules, backend callables, or legacy features were changed.
