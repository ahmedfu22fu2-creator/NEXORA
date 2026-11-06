# The Squad v201 — 3D Calls Evolution

- Preserves the existing WebRTC peer connections, Firestore signaling, Firebase TURN credential flow, and 3D avatar room.
- Upgrades the existing browser-native screen-sharing control instead of creating a duplicate. It switches the outgoing video track to the shared screen, restores the camera track when available, and cleans up on stop, browser cancellation, or call exit.
- Adds a live participant roster and a call/network status label without introducing new Firestore collections or changing call document schemas.
- Adds responsive call controls and reduced-motion-aware styling.
- Adds a release-specific service-worker cache and synchronized version manifests.

Validation: the complete `npm test` regression suite and v201 static checks pass against the packaged source. A production Vite build could not be run in this environment because Vite is not installed and dependency installation timed out. Real microphone, camera, screen-share, Firebase signaling, and multi-device behavior still require HTTPS deployment testing with at least two signed-in test accounts/devices.
