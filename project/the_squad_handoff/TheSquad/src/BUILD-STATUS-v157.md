# Build Status — The Squad v157

- Release: `v157-zero-cost-messaging-foundation` (build 157).
- Build is based on the verified v156 ZIP workspace.
- No new paid provider, API subscription, or npm dependency was introduced.
- New chat images and voice notes are compressed in the browser and stored in bounded Firestore message fields; new chat uploads no longer require Firebase Storage.
- The chat list now derives a one-message unread badge from the last-message timestamp and the user's own read receipt when a server unread trigger is absent.
- Existing 100-message active-chat query and Firestore local persistence remain.
- Legacy Storage media paths remain readable for projects where Storage access exists.
- All 679 files from v156 remain; 3 new files were added and 10 existing files were modified. No original file was deleted.
- All four deployed and source `chanse1`–`chanse4` folders remain present.
- `npm test`: passed, including the v157 zero-cost messaging checks.
- JavaScript syntax: 180 `.js` / `.mjs` files parsed successfully with `node --check`.
- Firebase rules, Storage rules, Firebase config, Authentication code, and Cloud Functions source were byte-for-byte unchanged.

## Not certified / external prerequisites

- No Firebase Emulator or live sign-in/media upload test was run.
- No browser, mobile-device, or real-network load test was run.
- No Vite production build was run in this environment because the Vite dependency is not installed in the workspace.
- This release is not Signal/Double-Ratchet E2EE, does not provide millions of simultaneous connections, and does not replace the Firebase callable backend.
- Firebase Storage dependencies remain in Social Feed and Cinema; existing Storage-backed chat attachments also need Storage access. Those paths must be migrated separately for full Spark compatibility.
- Firebase Functions are still required by some existing account, username, economy, and admin flows. Spark cannot deploy Cloud Functions; preserve those security checks until a tested free Worker replacement exists.
- Firebase configuration still targets `chatapp-67eb6`; historical handoff notes mention `the-squad-e36e7`. No target project was changed.
