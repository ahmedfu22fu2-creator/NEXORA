# THE SQUAD v238 — Social Interaction Notifications

- Added owner notifications for post likes and comments.
- Kept notification writes in the same Firestore transaction as the interaction.
- Restricted notification creation to the owner of an existing published post.
- Preserved existing friend notifications, authentication flows, and all game/world files.
- Updated release metadata and service-worker cache identifier.
