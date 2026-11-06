# The Squad v164 — Platform Expansion

This release adds a ten-section Platform Hub without replacing the legacy chat, authentication, social feed, communities, 3D district/world, café, cinema, calls, account settings, or backend functions.

## Included
1. Achievements and badges calculated from the signed-in account's existing published posts, friendships, following edges, and owned communities. Achievement snapshots are saved in the user's existing private `users/{uid}/dev` space.
2. Community discovery and joining reusing the existing `communities` and `chats` collections and membership model. Community creation remains in the existing community flow.
3. Marketplace listings with owner-only create/update/delete controls and signed-in read access. No payment processor or escrow is claimed.
4. Events with future date validation and per-user attendance records.
5. Profile appearance preferences (accent, tagline) stored in the private user `dev` space. Existing profile editor remains the source for public name/photo/bio.
6. Live notification center reusing `users/{uid}/notifications` and Firestore `onSnapshot`.
7. Close-friends list stored in `users/{uid}/dev/closeFriends`; this is a private selection list and does not silently change post audience rules.
8. Bounded search across public profiles, public posts, communities, marketplace listings, and events. It does not search private chats or private account fields.
9. Selectable Arabic/English UI dictionary translation for known strings; uncovered legacy strings may remain in their original language.
10. Low-data/low-motion mode with lazy/low-priority image loading and reduced animation.

## Security and deployment
- Existing Firestore rules were preserved as the v158 baseline in `FIRESTORE-RULES-v158.rules`.
- New marketplace and events policies were appended to the active rules in `site/chanse1/firestore.rules`, mirrored to `source/The-Squad-v137/chanse1/firestore.rules`, and copied to `FIRESTORE-RULES-v164.rules`.
- Publish the complete `site/chanse1/firestore.rules` file to Firebase before expecting marketplace/event writes to work. Do not replace it with the old v158 snapshot.
- Existing `users/{uid}/dev/{doc}` permissions are owner-only and are reused for private preferences, achievements, and close-friends data.
- No paid external services were added.

## Verification
- `npm test` passed all existing release/regression checks plus the v164 static integration check.
- `node --check` passed for the new platform module and localization module.
- `npm run build` could not run in this environment because Vite is not installed (`vite: not found`). Install the declared dependencies locally (`npm install`) before running the production build.
- Firebase deployment, live Firestore writes, push delivery, and cross-device behavior still require testing against the actual Firebase project.
