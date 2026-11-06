# The Squad v159 — Elevator Controls & Performance

## Main work
- Added interactive elevator calling and floor selection to the existing city buildings.
- Added a responsive, accessible lift panel with floor labels, arrival state, and keyboard/touch controls.
- Added player cabin attachment during travel and a safe floor-level exit after the doors open.
- Retained the original time-driven elevator route for elevators not interacted with.
- Kept the elevator command local to the current client to avoid additional Firestore writes, changes to the existing presence schema, or new paid services.
- Presence sends the rider's last lobby position during the local ride and publishes the actual arrival position at the destination; remote clients do not receive a synchronized moving-cabin animation in this release.
- Added the browser Save-Data signal to the existing constrained-device graphics profile; retained adaptive device-pixel-ratio scaling and reduced update cadence for expensive world animation.

## Preservation
- No original files or directories were deleted, renamed, or moved.
- `chanse1` through `chanse4` are retained.
- The maintained source copies of the two city runtime files are byte-identical to the deployed copies.
- Firestore rules, Firebase configuration, authentication, chat, and economy files are unchanged.
- No new Firestore fields, cloud functions, or paid service dependencies were added.

## Verification
- `npm test` includes the complete existing release suite plus the v159 elevator/performance simulation.
- The elevator test checks valid and invalid floor calls, arrival state, door isolation, intermediate interpolation, exact floor height, and preserved automatic mode for untouched elevators.
- The movement stress pass runs 1,800 simulation frames and checks finite values and world bounds.
- JavaScript syntax checks and production build are run where the local environment has the required build dependencies.
- Browser-based visual and live Firebase multiplayer tests are not claimed unless run separately.

## Final verification notes
- Destination buttons stay disabled until the cabin is parked at the lobby and its rendered door-open amount exceeds 0.92; the click handler repeats the same guard.
- `npm run build` could not execute because Vite is not installed in this workspace (`vite: not found`). This is an environment limitation; no dependency was installed and no build success is claimed.
- Headless browser visual QA and live Firebase multiplayer tests were not completed; automated structural, syntax, and simulation tests are the verified scope.

## Preservation and compatibility counts
- The v158 archive contained 688 files. All 688 are present in this release; 3 new files were added and 14 existing files were updated. No original file or folder is missing.
- The sensitive rules, Firebase config, authentication, and backend function files compare byte-for-byte equal to the v158 source.
- The legacy v33 diagnostic outside `npm test` reports 212/239 checks on both the v159 core and the untouched v158 baseline core. Its same 3 pre-existing failures concern the old admin-gate walk expectation, an obsolete fixed coin count of 115, and driving through the open gate; these are not introduced by v159 and are not represented as passing.
