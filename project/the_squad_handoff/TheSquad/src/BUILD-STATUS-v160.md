# The Squad v160 — Aurora Command Center

## What was added (additive only)
- `site/v160-aurora.js` / `site/v160-aurora.css`: loaded deferred, no new dependency, no paid service.
- **Command palette** (Ctrl/Cmd+K, `/`, or the floating ⌘K button): fuzzy search with Arabic normalization across navigation, open City / Café / Cinema, your conversations, and system actions. Keyboard and screen-reader accessible. Built lazily on first open.
- **Adaptive performance**: frame-pacing governor switches weak devices to the existing `squad-lite` profile; manual auto/lite/full; animations paused in hidden tabs; images decoded async and lazy-loaded; `content-visibility` for older messages (last 30 always rendered).
- **Live HUD** (FPS, LCP, CLS, long tasks, heap): palette action or `?perf` in the URL.
- **Ambient aurora** behind the social shell (GPU transform only, off in lite/reduced-motion/hidden tab), gold focus rings, press feedback, theme-switch cross-fade, slim scrollbars.
- **Neon Dash**: small offline canvas game (best score kept in localStorage).

## Preservation
- No file deleted, renamed or moved. Changed: `index.html` (+2 tags), `sw.js` (cache name + 2 precache entries), both `version.json`, `package.json`, and the release-pin assertions in older check scripts (v159 -> v160 only).
- Firestore rules, Firebase config, auth, chat, economy and backend untouched.

## Verified
- Real headless Chromium run of the site: palette opens (Ctrl+K and `/`), Arabic query finds the performance action, performance mode cycles, HUD reports FPS/LCP/CLS, Neon Dash runs/collides/saves best score/closes with Esc, zero errors from the new code.
## Not verified
- Signed-in flows (conversation list, City/Café entries) because Firebase could not be reached in the test sandbox; those actions click the same existing controls the app already uses.
- Real low-end phone frame pacing; Vite production build (vite not installed here).
