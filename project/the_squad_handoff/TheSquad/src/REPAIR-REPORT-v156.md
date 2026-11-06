# The Squad v156 — Scroll, Stage 4, and Login-Scene Repair

## Changes
- Replaced the broad v149 scroll selector set with document-scroll styling, stable scrollbar gutters, and styling limited to real nested overflow panes. Large desktop feed cards now use `content-visibility: auto` with intrinsic-size hints to reduce off-screen paint work.
- Added a supported social-UI bridge from the IIFE-local `drRender` function. Stage 4 now refreshes its conversation list and unread badges from explicit render/data-change events instead of wrapping globals that are not exposed.
- Corrected the login-scene artwork URL (`chanse3` stylesheet to the artwork in `chanse2`) and added that exact image to the v156 Service Worker precache.
- Bumped release metadata and Service Worker cache namespace to v156 so returning browsers can install the corrected assets.

## Preserved
- Existing Firebase Authentication code, callable login endpoints, Firebase configuration, Firestore rules, Storage rules, and Cloud Functions were not modified.
- Existing source/deployed `chanse1`, `chanse2`, `chanse3`, and `chanse4` folder structures remain intact. No existing project files were deleted or renamed.

## Verification results
- `npm test`: passed, including production audit, smoke checks, localization checks, owner/account monitor checks, release integrity, and the new v156 regression checks.
- `node --check`: 171 JavaScript files checked; zero syntax errors.
- Original archive preservation audit: all 677 original files remain present; zero missing files. Sixteen existing files were modified for the repair/release metadata, and two new files were added (this report and its regression check).
- Critical authentication, Firebase configuration, rules, and Cloud Functions files were compared byte-for-byte with the original ZIP and remain unchanged.
- ZIP CRC/integrity is checked after packaging.

## Limits
- Vite is listed as a development dependency but is not installed in this workspace, so a Vite production build was not run.
- No live Firebase sign-in, Firebase emulator, or real user-account test was performed. The authentication implementation and server callables were preserved and statically checked, but live login success cannot be certified from a ZIP-only inspection.
- A bulk attempt to run every archived historical test file is not a valid release gate: many of those old tests point at files/layouts outside their archived `chanse*` folder or require a browser mock harness. The current root `npm test` suite and the new v156 regression checks are the verified gate.
- No real-device scroll-performance benchmark was run. The CSS repair is based on the actual page scroll structure and is statically checked; browser/device performance still needs to be measured after deployment.
