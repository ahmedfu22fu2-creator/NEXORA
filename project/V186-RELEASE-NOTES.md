# The Squad v186 — Control Center & Stability

## Base and preservation
- Built directly on the v185 Development Batch; no restart from a blank project.
- All 802 prior files retained; 0 deleted; 3 files added.
- Core Firebase configuration, Firestore rules, Storage rules, Functions backend and `firebase.json` were byte-for-byte unchanged in this release.

## Added
- `site/v186-control-center.js`: device-local control panel, preference persistence, weak-device mode, reduced motion, compact layout, larger text, and transparent runtime diagnostics.
- `site/v186-control-center.css`: responsive, namespaced styling with reduced-motion support.
- `scripts/v186-control-center-check.mjs`: release wiring, preference, diagnostics and safe-rendering checks.
- Main page and Service Worker load/cache the new panel; release metadata updated to v186.
- Fixed the Universe Suite local-memory search to HTML-escape user-entered titles and details before rendering.
- Existing regression tests now validate the current release metadata/cache instead of stale v181/v185 release numbers.

## Scope and honest limitations
- Performance preferences are stored on the current browser/device only.
- Diagnostics detect browser/network/SDK/module presence; they do not prove successful sign-in, live Firebase connectivity, calls, multiplayer, or AI service availability.
- Existing Universe Suite systems remain local-first where documented; this release does not convert mock/local features into production multiplayer or live AI.
- Firebase configuration and rules were not changed or deployed.
- Production build was not completed: `vite` and `esbuild` are absent; `npm run build:preflight` and `npm run build` report this blocker.
