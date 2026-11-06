# The Squad v163 — Community Evolution

## Implemented (additive)
- Added `site/v163-community-evolution.js` and `site/v163-community-evolution.css`.
- Added a separate **المجتمع** launcher beside the v162 Global Hub launcher; the existing v162 hub remains intact.
- **Moments:** shows recent public, published posts using the existing `posts` collection and opens the existing feed for full interactions.
- **Discover:** searches public profile documents only and uses the existing `SquadSocial.follow` API.
- **Creator preview:** previews up to four supported local images, validates JPEG/PNG/WebP and 2 MB per image before passing files to the existing `SquadSocial.publish` API, and saves/restores text drafts locally per signed-in user.
- Added responsive, namespaced styling, keyboard Escape dismissal, dialog semantics, and Service Worker precache entries.
- Updated both release manifests and package version to 163.0.0.

## Preservation
- No existing application feature, room, world, source archive, Firebase config, Firestore rules, Storage rules, or backend Functions were intentionally removed or rewritten.
- v162 Global Hub assets and integrations remain loaded as a separate layer.
- No new Firebase collection, database schema, security rule, paid API, or paid service was introduced.

## Validation
- `node --check site/v163-community-evolution.js`: passed.
- `npm test`: passed all included production audit, smoke, localization, owner/account monitoring, release integrity, v156-v163 regression checks.
- ZIP entry preservation is checked against the original v162 archive during packaging.

## Not verified
- `npm run build` could not run because Vite is not installed in this environment (`vite: not found`).
- Firebase live queries, profile permissions, follow transactions, image uploads, and publishing were not exercised against the owner's live Firebase project.
- Real browser/mobile visual testing and deployment remain to be done. This ZIP is a tested source update, not a claim that it has already been deployed or live-tested.
