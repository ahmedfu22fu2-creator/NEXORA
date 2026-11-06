# The Squad v150 — Production build and quality pipeline

## What changed
- Added Vite as the production build tool. `npm run build` publishes the static app to `dist/`.
- Vite combines the linked CSS into a production stylesheet and minifies build assets.
- Legacy JavaScript is minified file-by-file. The existing ordered classic-script loading model is deliberately preserved; scripts are not concatenated because the current code shares globals and relies on execution order. This avoids silently changing runtime behavior while reducing transfer size.
- Added a production-input audit that checks local HTML references, verifies all four `chanse` source/site folders, rejects test fixtures in the public site, and performs basic Firestore rule guard checks.
- Added GitHub Actions to run the audit, existing regression suites, and the production build on pushes and pull requests.
- Added `.gitignore` and `.env.example`. Real server secrets belong in hosting/Functions environment settings, not in browser JavaScript.

## Deliberate safety decisions
- The complete original project remains under `source/The-Squad-v137/`; the existing static publish candidate remains under `site/`. No original source files or any of `chanse1`–`chanse4` were deleted or renamed.
- `look.js` is still referenced by the application, so it is not dead code. `fakefb.js` and `fakefb2.js` remain in the preserved test tree and are not present in the production `site/` tree. No uncertain files were deleted.
- Firebase web config is client-visible by design; a Firebase web API key is not a server secret. Security must be enforced by Firestore/Storage rules and server-side authorization. Do not put service-account JSON, private keys, payment secrets, or TURN credentials in the browser bundle.
- The current checked-in Firebase config still targets `chatapp-67eb6`. This package does not silently change it to another project. Verify the intended project ID and app ID in Firebase Console before publishing.
- Firestore and Storage rules were preserved, not rewritten. Static checks are not a substitute for Firebase Emulator Suite tests. Review the existing broad signed-in reads and all collection-specific permissions before a public launch.

## Commands
- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`
- `npm run preview`

Deploy only `dist/` as the static website output. Keep `source/` as the full backup and `site/` as the editable static candidate.

## Current limitation
The old hand-written test runner in the inherited project references test files and paths that are no longer in the same folders, so it is not wired into CI as a false-green/false-red gate. The new pipeline runs path-aware production audits and syntax/runtime-input smoke checks instead.

The app's JavaScript remains multiple minified files to preserve global scope and script order. A true single-JS bundle requires a controlled migration to ES modules with explicit imports/exports and regression testing. This build does not claim that migration has happened.
