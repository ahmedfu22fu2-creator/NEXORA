# THE SQUAD v208 — 3D City & Vehicle Driving Suite

## Implemented
- Added a dedicated in-city driving HUD with live speed in km/h and automatic Neutral / Drive / Reverse indicator.
- Added mobile touch controls for accelerator, reverse, left/right steering, and brake.
- Touch controls use pointer capture and explicit release handling to prevent stuck throttle or steering when the user lifts a finger or the pointer is cancelled.
- Entering a vehicle activates the driving HUD and touch deck; exiting clears all driving input states.
- Preserved the existing Three.js city, procedural vehicle meshes, ownership checks, vehicle physics, keyboard controls, and multiplayer vehicle state synchronization.
- Updated release metadata and service-worker cache namespace to v208.

## Controls
- Desktop: W/S accelerate/reverse, A/D steer, Space brake, E exit vehicle.
- Touch: on-screen pedals and steering arrows; E remains available via the contextual action control / keyboard where supported.

## Verification
- `node scripts/v208-driving-suite-check.mjs` validates UI wiring, safety release handlers, live HUD, and preservation of the multiplayer vehicle payload.
- Full browser/WebGL driving, mobile-device ergonomics, live multiplayer collision behavior, and Firebase production sync require a deployed browser test with the owner's Firebase configuration and real devices. They are not claimed as completed by static checks.
