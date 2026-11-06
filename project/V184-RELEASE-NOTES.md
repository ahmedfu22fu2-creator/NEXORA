# The Squad v184 — Universe Suite

## Scope
v184 continues from the v183 shared-city source. It adds one lightweight, namespaced Universe Suite entry point containing 22 interactive local-first feature modules across AI/creativity, virtual city life, social experiences, and economy/challenges.

## Added files
- `site/v184-universe-suite.js`
- `site/v184-universe-suite.css`
- `scripts/v184-universe-suite-check.mjs`
- `V184-RELEASE-NOTES.md`

## Integration
- Main entry loads the stylesheet and deferred script.
- Service Worker cache is `squad-v184-universe-suite` and precaches both new assets.
- Root and legacy version manifests are synchronized at build 184.
- Existing v183 account sync and shared-city modules remain in place.

## Important feature boundaries
The 22 modules are a unified, lightweight front-end prototype, not 22 completed production services. Current interactive records are stored in browser localStorage. They do not sync between users/devices through Firebase in this release. The AI companion and NPC dialogue are fixed local guidance, the builder produces text outlines rather than 3D assets, translation is a phrase notebook rather than live translation, and cinema/events/radio/multiplayer/commerce are planning interfaces rather than live streaming or transactions. The city/transport/season features do not create a persistent 3D simulation. Real-time multiplayer, live AI, translation provider, payment, global rankings, and creator publishing require separate backend/provider integration and security review.

## Checks run
- `npm test` — passed, including v184 static integration check.
- `node --check site/v184-universe-suite.js` — passed.
- `npm run build:preflight` — reports missing Vite and esbuild.
- `npm run build` — blocked (`vite: not found`, exit 127); no production bundle was generated.
- No live Firebase multi-account, browser visual, or device multiplayer test was performed.

## Preservation
No existing files were intentionally deleted. Existing Firebase config, Firestore/Storage rules, backend Functions, chats, accounts, and prior world modules are retained from the v183 baseline.
