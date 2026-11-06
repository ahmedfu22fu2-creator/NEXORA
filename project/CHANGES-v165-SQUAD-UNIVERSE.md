# The Squad v165 — Squad Universe

## Release intent
An additive expansion of the existing v164 platform. The legacy social app, authentication, chat, calls, communities, 3D district/world, café, cinema, Firebase configuration, Firestore rules, Storage rules, and backend functions are retained.

## Added
- **Squad Workspace:** device-local task list and notes with create, complete, and delete actions.
- **Avatar Studio:** local visual preset, accent color, and accessory preferences. It does not overwrite the public account photo or profile.
- **My Digital Home:** local home name/style and inventory selection. These are prototype preferences, not a live multiplayer property system.
- **Squad Memories:** device-local saved memory cards.
- **Virtual World Map:** curated virtual destinations only; no GPS or real-world location is requested or displayed. Destinations are a design layer and still need integration with the 3D district engine.
- **Social Circles:** shortcuts to the existing communities, friends, and feed sections; no duplicate social graph is created.
- **AI Toolbox:** official ChatGPT, Claude, and Gemini links opened in a separate tab. No account data is sent to those services and no API integration is claimed.
- **Universe overview:** a new launcher in the social header, responsive navigation, and local summary counters.

## Data and privacy
New v165 workspace, avatar, home, and memories data is stored in browser localStorage, partitioned by the currently signed-in Firebase UID (or a guest key before sign-in). It is not synced across devices and may be lost if browser site data is cleared. No new Firestore collection or security rule was added. The sample points balance is illustrative only; it is not money, a purchasable currency, or a redeemable wallet.

## Preserved
- All pre-existing project files and the `source/The-Squad-v137` archive remain in the ZIP.
- Existing v164 platform expansion and Firestore rules remain present.
- Existing Firebase configuration, backend functions, Storage rules, and 3D room/game files are not rewritten by v165.

## Verification
- `npm test`: passed all included production audit, smoke, localization, owner/account monitoring, release integrity, v156-v165 regression and integration checks.
- `node --check site/v165-squad-universe.js`: passed.
- `node --check site/sw.js`: passed.
- `npm run build`: not run successfully because Vite is not installed in this environment (`vite: not found`).
- Firebase live synchronization, cross-device persistence, actual 3D destination routing, and browser/mobile visual behavior still require live testing after deployment.
