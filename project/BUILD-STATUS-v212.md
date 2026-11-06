# THE SQUAD v212 — Build Status

- `npm test`: PASS — full regression chain, including v212 traffic AI behavior tests.
- `node --check site/chanse1/district-core.js`: PASS.
- `node --check site/chanse2/district.js`: PASS.
- Source mirrors for both city runtime files: byte-for-byte synchronized.
- `npm run build`: NOT COMPLETED — Vite is not installed in this environment (`vite: not found`).
- Firebase deployment: NOT PERFORMED.
- Browser/WebGL and multi-device multiplayer QA: NOT PERFORMED.

## Functional scope
Ambient NPC traffic now uses deterministic adaptive following distance, smooth deceleration/acceleration, and yielding to a stopped player-driven vehicle aligned with the same lane and direction. It remains client-side decorative traffic and is not server-authoritative or synchronized between players.

Garage floors remain accessible using existing stairs/elevators. Vehicle ramps between garage levels are not implemented in v212.
