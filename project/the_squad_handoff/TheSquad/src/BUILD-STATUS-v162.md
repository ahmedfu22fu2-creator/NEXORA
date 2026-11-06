# The Squad v162 — Global Evolution

## Additions (non-destructive)
- Added `site/v162-global-hub.js` and `site/v162-global-hub.css`, loaded as an additive layer from the main page.
- Added a responsive **Global Hub** launcher in the existing social header.
- **Squad Search:** searches the existing `publicProfiles` collection and the latest published public posts. It does not query private chats or sensitive account documents.
- **Creator Studio:** saves a local draft on the current device and publishes through the existing `SquadSocial.publish` API, preserving its existing validation and upload limits.
- **Privacy Center:** lists the signed-in user's existing blocked accounts and allows the account owner to unblock them. Existing privacy settings are opened through the current settings UI rather than creating a parallel settings schema.
- **Services Hub:** shortcuts to existing feed, messaging, friends, city, café, cinema, and services areas.
- Added scoped responsive styling, keyboard dismissal, dialog semantics, and a dedicated Service Worker precache namespace.

## Preservation
- No existing project files or folders were deleted, renamed, or moved.
- The `source/The-Squad-v137/` archive and all four `site/chanse*` trees remain present.
- Firebase configuration, Firestore rules, Storage rules, authentication, chat, calls, 3D worlds, economy, and backend Functions were not modified.
- No new Firestore collections or security-rule changes were introduced.
- The existing v95 social feed remains the publishing engine; the Creator Studio is an additional entry point, not a replacement.

## Validation
- `npm test`: passed all production audit, smoke, localization, owner/account monitoring, release-integrity, v156-v161 regression, and new v162 checks.
- New v162 checks confirm the assets are wired into the main page and Service Worker, manifests match, search is limited to public data, and creator/privacy integrations use existing APIs/paths.
- ZIP structure and original-entry preservation are checked during packaging.

## Not verified / release caveats
- Firebase live queries, uploads, and unblock operations were not exercised against the owner's live project from this environment.
- The existing Firebase web configuration still points to `chatapp-67eb6`; the prior release notes identify this as a possible mismatch with the intended `the-squad-e36e7` project. Do not change credentials without the complete correct Web App configuration from Firebase Console.
- `npm run build` could not run because Vite is not installed in this environment (`vite: Permission denied` / no executable found). Static regression tests passed, but a production Vite build and real browser/mobile testing remain outstanding.
- Squad Live streaming, a payment wallet, and a marketplace with real transactions were not falsely represented as active: they need secure backend services, moderation, and/or payment-provider integration before launch.
