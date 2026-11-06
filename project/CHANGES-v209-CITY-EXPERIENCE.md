# THE SQUAD v209 — Advanced City Experience

## Implemented
- Added contextual entry prompts for authored buildings when the player approaches their front entrance.
- Added a responsive building experience panel with a floor selector based on each building's existing floor count and floor height.
- Added safe interior arrival coordinates derived from each building's existing `W()` transform and front-door orientation.
- Added an exit-to-original-arrival-point action, preserving the player's original position and heading.
- Added building-specific guidance for the hall, residences, bank, lab, palace/estates, showrooms, shops, arcade, gym, and kiosk.
- Kept existing dedicated cafe entry, bank interaction, job interactions, car purchase/ownership, vehicle entry/exit, elevators, stairs, geometry, collision data, and multiplayer vehicle sync.
- Mirrored `site/chanse2/district.js` to `source/The-Squad-v137/chanse2/district.js`.
- Updated release metadata and service-worker cache namespace to v209.

## Scope / honest limitations
- Floor selection is a local player teleport within the existing authored building shell; it is not a synchronized elevator ride. Existing elevator controls remain available for synchronized lobby/floor movement under their current behavior.
- Existing interiors and procedural furnishing are reused. This release does not add newly modeled room-by-room furniture sets, a home furnishing editor, or new licensed 3D assets.
- Real browser/WebGL collision and multiplayer smoke testing still requires deployment and the owner's Firebase environment.
