# The Squad v153 — Build status

## Delivered
- Owner Monitoring Dashboard redesigned in English/LTR with responsive premium styling.
- Overview, platform wallet, reports, and service-status sections.
- Wallet ID sourced from the existing backend response.
- Explicit confirmations for wallet ledger and withdrawal workflow actions.
- Accessibility improvements, Escape close, mobile layout, and Service Worker cache update.
- Four `chanse1`–`chanse4` folders retained in both `site/` and `source/`.
- Original `source/The-Squad-v137/` preserved byte-for-byte relative to the v152 package.

## Automated checks
- Production audit: passed (62 local HTML references checked; all four source/site folders present).
- Smoke tests: passed (36 local script references; 44 JavaScript files parsed; basic Firestore checks).
- English localization integration check: passed.
- Owner dashboard regression checks: 12/12 passed.
- Updated `admin-monitor.js`: `node --check` passed.
- ZIP integrity and prior-file preservation: recorded in the v153 release report.

## Not tested / not claimed
- Vite production build was not run; the environment previously reported `vite: not found`.
- No live browser/mobile, Firebase callable, live wallet, two-account, or deployed Cloud Functions test was run.
- The dashboard displays only the aggregate fields already returned by existing server functions. No new live telemetry, historical charts, moderation actions, or user search are claimed.
- Existing backend functions must be deployed for live dashboard/wallet data. This package does not deploy Firebase Functions.
