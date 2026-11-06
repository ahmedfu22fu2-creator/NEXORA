# The Squad v154 — Account Monitoring

## Delivered
- Added Account Monitoring to the private Owner Control Center.
- Exact account lookup by 10-digit SID or username.
- Profile/status metadata and aggregate activity summary.
- Read-only report queue compatible with the existing legacy and social report shapes.
- Added server-side callable endpoints with owner UID verification and rate limits.
- Kept the new Functions deployment source outside the public `site/` directory.
- Kept English/LTR interface and advanced the Service Worker cache to v154.
- Preserved all four `chanse1`–`chanse4` directories in both source and site trees.

## Preservation
- All 373 files under `source/The-Squad-v137/` are byte-for-byte identical to the v153 package.
- Existing Firestore rules, Storage rules, Firebase configuration, and original backend baseline were not edited.
- New Cloud Functions are supplied separately under `backend/firebase-functions/` with a minimal `backend/firebase.json`.

## Automated checks
- Production audit passed.
- Smoke tests passed (36 local script references; 44 JavaScript files parsed; basic Firestore checks).
- Localization integration passed.
- Owner monitoring checks: 12/12.
- Account monitoring checks: 13/13.
- `node --check` passed for the updated dashboard and new backend source.
- ZIP integrity verified.

## Not tested
- No live Firebase deployment, browser/mobile session, two-account test, or live report lookup.
- Vite production build not run in this environment.
- New account/report functions must be deployed before the corresponding dashboard tools return live data.
