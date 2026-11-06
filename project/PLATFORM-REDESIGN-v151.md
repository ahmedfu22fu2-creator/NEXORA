# The Squad v151 — Platform & Chat Visual Foundation

## Implemented
- Added a unified premium dark / warm-metal visual layer for the social platform and messaging UI.
- Switched the main public entry document to English language metadata and left-to-right layout.
- Translated the primary social navigation, major sidebar shortcuts, landing shortcuts, sign-in labels, and common Stage 4 chat-list strings.
- Reworked desktop layout into a three-column social shell with responsive two-column and mobile layouts.
- Added document-level vertical scrolling and removed fixed-height/overflow traps from the social shell.
- Updated the chat list, conversation cards, message bubbles, composer and chat overlay styling without replacing existing chat/Firebase logic.
- Kept the original complete source tree under `source/The-Squad-v137/` byte-for-byte intact. The editable static candidate is `site/`.
- Preserved all four `chanse1`–`chanse4` directories in both source and site trees.

## Validation run
- Production audit: passed (61 local HTML references, no missing paths; four source/site folders present; fixture exclusion and basic Firestore guard checks passed).
- Smoke tests: passed (35 local script references resolved; 43 JavaScript files parsed; basic Firestore checks passed).
- `node --check` on the edited Stage 4 chat UI script: passed.
- ZIP integrity: checked when packaging.

## Not claimed / remaining work
- Vite production build was not run in this environment; install dependencies and run `npm run build` before deployment.
- No live browser, mobile-device, WebGL, Firebase, two-account chat, or multiplayer test was performed.
- The previously supplied visual chat mockup is not present among the files available in this working set. This release is a cohesive first visual pass, not a pixel-exact mockup match. Reattach the mockup for the next refinement pass.
- Many deeper feature screens still generate Arabic strings from legacy JavaScript modules; full English localization requires a controlled pass through those modules.
- Firebase configuration and Firestore/Storage rules were not changed.
