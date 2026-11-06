# v241 — Auth completion
- Added rate-limited server-side username availability lookup.
- Connected signup username feedback to canonical Firestore username mappings.
- Guarded against stale asynchronous username-check responses.
- Preserved atomic username claim during account creation and immutable username mapping rules.
- Bumped release metadata and service-worker cache namespace.
- Added v241 regression checks and updated current-release assertions.
- Full `npm test` passed. Vite production build remains blocked because Vite is not installed in this environment; live Firebase deployment and browser tests remain untested.
