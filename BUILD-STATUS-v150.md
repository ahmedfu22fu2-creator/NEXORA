# v150 build status

- Source integrity: verified 373/373 preserved source files against the SHA-256 manifest from v148; zero missing files and zero hash mismatches.
- Production input audit: passed (60 local HTML references checked; all four `chanse1`–`chanse4` directories present; test fixtures excluded from `site/`).
- JavaScript smoke check: passed (35 local script references resolved; 43 production JavaScript files parsed successfully).
- Vite production build: configured but not executed in this environment because dependency installation timed out. Run `npm install` followed by `npm run build`; deploy the resulting `dist/` directory only.
- Full Firebase Emulator, browser, multiplayer, and load tests: not run. Existing legacy test runner has stale path assumptions and is not represented as passing.
