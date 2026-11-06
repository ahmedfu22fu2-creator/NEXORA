# Build Status — v201

Baseline: v200 Stories & Channels Evolution.

Scope: 3D Calls Evolution.

Implemented in source: upgraded existing screen sharing with video-track replacement and restoration, live participant roster, network diagnostics label, responsive call controls, release metadata, and cache versioning.

No Firestore collections, rules, or existing call document fields were changed.

Validation: complete `npm test` regression suite passes. The Vite production build remains unverified because Vite is absent from the environment and dependency installation timed out. Live Firebase and browser media behavior requires a deployed HTTPS environment and at least two test accounts/devices.
