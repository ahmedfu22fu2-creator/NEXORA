# THE SQUAD — isolated test candidate

## Package contents
This archive contains the saved v193 project snapshot as a separate local test candidate. It preserves the site's existing source tree, legacy feature folders (`chanse1`–`chanse4`), Firebase configuration/rules and backend source. No live website or Firebase data was modified.

## Automated checks run in this environment
`npm test` completed with exit code 0. The suite reports PASS for:
- Production static audit: 47 local HTML references.
- Smoke checks: 55 local scripts resolved and 66 JavaScript files parsed.
- Arabic/English localization wiring and Service Worker wiring.
- Owner monitoring checks: 12/12.
- Account monitoring checks: 13/13.
- Release-integrity check: 112 valid precache entries.
- Regression checks from v156 through v188, including messaging safeguards, startup recovery, account isolation, wallet hardening, feature modules, and call-network source wiring.

The complete console output is in `npm-test-final.log`.

## Important limitations — do not treat as release-ready
- The repository metadata is inconsistent: root `package.json` still says `187.0.0`; the site package says `0.191.0`; the archive folder is named v193. These labels do not prove a coherent v193 release. Original metadata was preserved rather than silently rewritten.
- A production Vite build has not been verified. Vite is declared as a dev dependency but is not installed in this environment; the attempted build previously returned `vite: not found`.
- No browser-based visual QA was run.
- Firebase live authentication, Firestore reads/writes, callable endpoints, Storage, hosting, and multi-device WebRTC calls were not tested against the user's live project.
- TURN service credentials/provider configuration and real calls across restrictive networks remain unverified.
- Static checks verify wiring and source invariants; they do not prove that every UI control or feature works in production.

## Safe next step
Use this only as an isolated test candidate. Before replacing the live site, reconcile release metadata, install dependencies and complete a production build, then test Firebase-backed flows and calls in a separate staging Firebase project or with explicitly approved test accounts. Never put production secrets in the archive or public repository.
