# BUILD STATUS — v216

Release status: expanded garage interaction layer; not a fully completed garage phase.

## Implemented in this release
- 12 Three.js perspective camera viewpoints (4 per floor), with a monitor selector that renders the chosen viewpoint in the main WebGL canvas.
- Physical 3D entrance barrier arm; opens temporarily only after the server-side vehicle ownership check returns authorization.
- Client-side Valet and summon vehicle motion routine, using existing vehicle models and city collision checks.
- In-world admin garage panel calling secured admin overview and action endpoints.
- Admin operations: release a parking reservation, open/close a bay, view reservations, service requests and gate events.
- Server-side `garageAdminAction` authorization and audit events; client Firestore access to controls/audit denied.
- Updated source mirrors, manifests, Service Worker namespace, release regression checks and Arabic handoff report.

## Explicit limitations
- Valet/summon movement is currently local to the requesting browser. It is not authoritative or synchronized to other players.
- Movement uses direct steering toward a destination with collision stop; no road graph/pathfinding, obstacle rerouting, queue dispatcher or vehicle handoff protocol.
- CCTV is a live local 3D camera viewpoint only. No central stream, remote viewing, recording, retention or alerting.
- Gate animation is triggered by the garage UI after callable authorization; not yet automatically triggered by vehicle approach sensors or server-side proximity.
- Admin bay state is stored server-side, but player reservation UI has not yet subscribed to closed-bay controls; enforcement of closed bays in the reservation transaction still needs implementation.
- Firebase deployment, emulator tests, two-account live tests and browser/WebGL device tests were not run.

## Verification
- `npm test`: PASS (full existing regression suite plus v216 garage checks).
- JavaScript syntax checks for city and backend: PASS.
- `npm run build`: NOT RUN successfully; Vite executable is unavailable. Dependency installation attempt timed out.
- Firebase deploy: NOT performed.
