# THE SQUAD v211 — Living City & Multi-storey Garage

## Implemented in this source release
- Added a dedicated three-level city parking garage to the district building map. It uses the existing building-floor, elevator, stair, entry and exit systems.
- Added open-deck parking bays, structural columns, floor labels and decorative charging points.
- Added six lightweight ambient traffic vehicles moving along existing boulevard lanes. They are visual NPC traffic and do not enter player ownership/economy or multiplayer vehicle state.
- Added player collision checks against locally placed room furniture so the avatar cannot walk through the supported added furniture pieces.
- Migrated v210 local room layouts forward to the v211 key without deleting the old data.
- Added account-private Firestore room layout load/save with a 24-piece cap and owner-only rules. Local saving remains the fallback when Firebase is unavailable or rules have not been deployed.
- Updated release metadata, service-worker cache namespace, npm version, and source mirrors.

## Known limitations / external steps
- Garage floors are accessible on foot through the existing building elevator/stairs. Vehicle ramp driving between garage levels is not implemented.
- Ambient traffic is client-side decorative traffic; it is not authoritative, collision-enabled, or synchronized to other players.
- Furniture collision is a client-side movement guard, not server-authoritative physics. Cloud sync requires deploying `site/chanse1/firestore.rules` to the Firebase project.
- Real Firebase, WebGL and multi-device validation requires the owner's configured project and browser environment.
