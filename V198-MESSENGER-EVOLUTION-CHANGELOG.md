# The Squad v198 — Messenger Evolution

## Additive changes
- Added a Messenger overview panel using live in-memory data from the existing chat engine: visible conversation count, unread conversations, groups and pinned conversations.
- Added quick actions that route to the existing new-conversation search and existing group-creation flow.
- Added client-side filters for unread, groups and pinned conversations without changing Firestore collections or message documents.
- Added an optional search bar for the messages currently loaded in the open conversation (up to the existing app's current message window).
- Added Ctrl/Cmd+K to open message search while a conversation is open, or focus the conversation search from the inbox; `/` focuses inbox search.
- Added a read-only `window.SquadMessengerBridge` adapter to expose the existing app's current chat state. It performs no writes.

## Preservation
- Existing Firebase Auth, Firestore chat schema, message sending, media, group management, calls, notifications, and legacy files remain in place.
- No Firebase rules, collections, user documents, or message documents were modified.
- No new paid service or external API was introduced.

## Validation
- JavaScript syntax checks passed for the new module and modified chat engine.
- Static integration checks verify the stylesheet and script are referenced, version metadata is updated, and service-worker cache version is bumped.
- A live Firebase/browser session was not available in this build environment; real account, multi-user, and device testing remains required before deployment.
