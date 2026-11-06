# The Squad v149 — Repair Baseline

## Done in this package
- Preserved the complete v148 archive tree under `source/`.
- Kept all four original folders `chanse1`–`chanse4` in both the preserved source and static candidate.
- Built a separate `site/` publish directory with `index.html` at its root.
- Rewrote local HTML `src`/`href` references when a matching file exists in the four folders. Duplicate basenames prefer the index folder.
- Corrected the audited lazy-load paths: `world.js` → `chanse2`, `district-core.js` → `chanse1`, `district.js` → `chanse2`.
- Added visible scrollbar styling for existing scrollable app areas.
- Added SHA-256 hashes for every original extracted file.
- Excluded test fixtures and backend-only function folders from the public `site/` copy only; they remain preserved under `source/`.

## Important: this is not yet a fully repaired production release
- The interface still contains Arabic strings. We intentionally did not pretend that changing HTML metadata translates the application. Full English localization needs a string-by-string pass.
- Asset reference rewriting is filename-based; duplicate names may need manual review.
- Scroll styling was not validated in a real browser, so some views may need selector-specific adjustment.
- Firebase config and Firestore/Storage rules are unchanged. Verify the intended Firebase project before deployment; rules have not been emulator-tested.
- Economy transaction authority/security and chat XSS review are not fully remediated or certified.
- No browser, multiplayer, emulator, or load tests were run in this packaging pass.

## Deployment
Use `site/` as the static publish directory. Keep `source/` as the untouched backup. Do not deploy `source/` as the website root.
