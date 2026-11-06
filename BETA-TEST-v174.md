# The Squad v174 — Beta / Startup Recovery QA

Date: 2026-11-02
Base: v173 beta (all existing project files retained; additive startup recovery changes)

## What changed

- Added `site/v174-startup-recovery.js`, loaded before Firebase SDK scripts.
- Added a 9-second startup watchdog. If startup has not completed, it dismisses the splash and reveals the sign-in screen with a cause-oriented message.
- Added recovery for failed script loads/runtime errors during startup and Firebase/network-related unhandled rejections.
- Added a clear `file://` warning explaining that Firebase-backed sign-in must be tested from a local HTTP server or a deployed HTTPS origin.
- Marked successful Firebase auth-state initialization so the fallback does not replace a healthy app session.
- Updated Service Worker cache name/precache, release manifests, and regression checks to v174.
- Preserved the v173 shared-events code and Firestore rules; no Firebase rules were deployed.

## Tests actually run

- `npm test`: PASS, all configured checks completed.
- Production local-reference audit: 86 HTML references checked.
- Smoke checks: 48 local scripts resolved; 56 JavaScript files parsed.
- Localization, owner monitor, account monitor, release integrity, and regression checks v156–v174: PASS.
- v173 shared-events static integration/security checks: PASS.
- v174 recovery behavior simulation: PASS for `file://` guidance, missing Firebase SDK guidance, successful-startup guard, and recovery UI visibility.
- Local HTTP serving check using Python's static server: PASS for `/`, `index.html`, recovery script, app script, Firebase config, Service Worker, and version manifest (all returned HTTP 200).
- ZIP integrity: PASS — 758 archive entries; `testzip()` returned no errors.

## Not verified / limitations

- `npm install` did not finish within the available execution window; Vite is not installed in this environment. Therefore `npm run build` could not run (`vite: not found`).
- No browser automation runtime was available for a real interactive Chrome session.
- Firebase Emulator / live Firebase project / two-account online test were not run. Real sign-in, Firestore permissions, invitations, messaging, calls, storage, and push notifications still need live environment testing.
- The site has not been deployed by this QA run. No production Firebase rules were changed or deployed.

## How to open locally on Windows without opening index.html directly

From the extracted project folder, run PowerShell or Command Prompt:

```powershell
py -m http.server 8000 --directory site
```

Then open `http://localhost:8000/` in Chrome. Keep the terminal window open while testing. Stop the server with `Ctrl+C`.

If Python is unavailable but Node dependencies are installed, run `npm run dev` from the project root and open the Vite URL shown in the terminal (normally `http://localhost:5173/`).

## Beta status

Static and simulated startup-recovery tests passed. This does not certify live Firebase behavior or a production deployment. The local HTTP server verified file delivery only, not browser-side authentication.
