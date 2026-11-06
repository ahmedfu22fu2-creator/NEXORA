# The Squad v182 — Account Cloud Sync

## Scope

v182 continues from v181. It adds optional Firebase Firestore synchronization for the existing World Systems state, scoped to the currently authenticated account. Existing local-first storage remains the offline fallback.

## Changes

- Added `site/v182-cloud-sync.js` to observe the existing Firebase Auth session and synchronize `worldState/{uid}`.
- Added a debounced write queue, remote snapshot listener, basic size/schema validation, and offline fallback.
- Added `getSnapshot` / `applyRemoteState` / sync-status hooks to the existing v181 World Systems module.
- Added owner-only Firestore rules for `worldState/{uid}`. Other users cannot read or write that document; deletion is denied.
- Updated service-worker cache and release manifests to v182.
- Preserved existing Firebase configuration, chat collections, and storage rules.

## What this does and does not do

- Personal World Systems state can sync between devices using the same Firebase account once the v182 Firestore rules are deployed.
- This is not yet a shared live city, multiplayer economy, live radio, real-time translation, or connected AI.
- It does not publish private memories or private progress to other users.
- The new Firestore rules are source changes only until deployed to the Firebase project.

## Verification

- Run `npm test` for the full static regression suite.
- Live Firebase authentication, Firestore rule enforcement, offline queue behavior, and two-device conflict behavior still require Firebase Emulator or live project tests with two sessions.
- Production Vite build remains dependent on installing Vite/esbuild in an environment with npm registry access.
