# The Squad v166 — Global Connect

## Preserved base
- Built additively on the v165 archive.
- All 711 files from v164 remain present in v165; v166 retains those files and the five v165 additions.
- Existing Firebase configuration, Firestore and Storage rules, backend functions, authentication, chat, calls, 3D world/café/cinema, social feed, communities, marketplace, events, and previous platform layers are not replaced.

## Added in v166
- Global Connect panel with source and target language selection.
- Translation handoff to Google Translate in a separate tab; no account/chat data is transmitted automatically.
- Optional browser speech dictation using Web Speech API where supported and permitted by the browser.
- Manual paste-back field for translated text, with copy and speech synthesis controls.
- Local caption-draft helper with simple templates; it is not represented as an AI API integration.
- Hybrid black/gold/blue visual layer, responsive controls, new Service Worker cache and precache entries.

## Important limitations
- Translation is performed on the external Google Translate page, not inside The Squad. Users must review/copy/paste the result.
- No automatic translation of messages, voice notes, or live calls is enabled.
- Speech recognition and speech synthesis availability/quality depend on browser, device, language, and permissions.
- No translation API key, paid service, or new backend endpoint was added.
- The remaining Universe concepts (multiplayer property ownership, persistent city instances, real-time events/broadcast, creator marketplace transactions, and in-call interpretation) need separate backend/security/media design and live testing; their existing UI prototypes must not be mistaken for production services.

## Verification
- `npm test`: PASS, including production audit, smoke checks, localization, owner/account monitoring, release integrity, v156-v166 regression/integration checks.
- `node --check site/v166-global-connect.js`: PASS.
- `node --check site/sw.js`: PASS.
- `npm run build`: NOT VERIFIED because Vite is not installed in this environment (`vite: not found`).
- Live Firebase, browser microphone permissions, Google Translate handoff, actual voice playback, cross-device synchronization, and mobile/desktop visual QA remain to be performed before publication.

## Publication
- Not deployed. Do not publish until the remaining browser and service tests are completed and the owner approves.
