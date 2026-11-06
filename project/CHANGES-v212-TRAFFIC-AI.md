# THE SQUAD v212 — Adaptive Traffic AI

## Implemented
- Added deterministic ambient-traffic car-following logic in the city physics core.
- NPC traffic eases down when another same-direction vehicle is too close, then accelerates smoothly when the lane clears.
- Ambient traffic yields to a stopped or slowly moving player-driven vehicle occupying the same road lane and direction.
- Brake-light emissive feedback reflects AI braking.
- Preserved the existing six route vehicles, player vehicle physics, ownership, multiplayer protocol, city geometry and garage floors.
- Updated release metadata, Service Worker cache namespace and source mirrors.

## Validation boundaries
- Traffic remains client-side ambient NPC behavior; it is not server-authoritative or synchronized between players.
- This release does not implement vehicle ramps between garage floors; floors remain accessible by the existing elevators/stairs.
- Real browser/WebGL, multiplayer and Firebase deployment checks require the configured project and browser environment.
