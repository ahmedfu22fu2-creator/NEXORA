# The Squad v175 — Startup Diagnostics & Recovery

## Changes
- Replaced the generic v174 splash fallback with a more actionable recovery panel.
- Increased the startup watchdog to 12 seconds to reduce false alarms on slow connections/devices.
- Added distinct guidance for direct `file://` opening, offline state, unavailable Firebase SDK, and Firebase initialization/configuration failures.
- Added an explicit retry button and online/offline message updates.
- Preserved the existing auth-state success guard so a healthy session is not replaced by the fallback.
- Advanced root and legacy release manifests and Service Worker cache/precache to v175.
- Kept all prior project folders, chat/auth code, Firebase configuration, rules, and v173 shared-events work.

## Scope note
This release focuses on startup reliability and diagnostics. It does not change or deploy Firebase rules and does not claim that cloud features are live-tested.
