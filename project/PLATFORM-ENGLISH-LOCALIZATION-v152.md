# The Squad v152 — English UI Localization

## Changes
1. Added `site/chanse4/english-ui-v152.js`, a mutation-aware localization layer for known UI strings rendered by legacy modules.
2. Set the document language and direction to English/LTR whenever the layer initializes.
3. Added translations for common sign-in errors, navigation, conversation actions, composer labels, account/settings screens, feed actions, comments, stories, channels, communities, friend requests, and notification states.
4. Added the same localization layer to the standalone Services Hub and App Preview.
5. Updated the Service Worker cache version to `squad-v152-english-ui-localization` and precached the new script.
6. Updated package and web build metadata to v152.

## Safety and preservation
- Localization is exact-string based. User-written posts and messages are not automatically translated.
- No Firebase config, rules, Functions, collections, account identifiers, or chat logic were edited.
- `source/The-Squad-v137/` remains byte-for-byte unchanged from v151.
- `chanse1`, `chanse2`, `chanse3`, and `chanse4` remain in both source and site.

## Validation and limitations
Automated source audit and smoke checks passed. The production build was attempted but Vite is not installed in the environment, so no `dist/` build is claimed. No real browser, mobile, Firebase, or multiplayer test was performed. Some low-frequency/legacy strings may remain Arabic and require another localization pass. The original chat mockup was not present, so pixel-perfect mockup matching is not claimed.
