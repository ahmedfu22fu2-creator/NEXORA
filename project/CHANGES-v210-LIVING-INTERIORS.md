# THE SQUAD v210 — Living Interiors & Room Designer

## Implemented
- Added a room-design studio to the existing building/floor experience.
- Added six lightweight 3D furniture pieces: sofa, bed, desk, plant, floor lamp, and TV console/screen.
- Added rotate-last-piece, undo-last-piece, and clear-extra-decor actions.
- Saved room layouts locally per building, branch, and floor; restored them when revisiting that floor.
- Limited additional furniture to 24 pieces per floor and validated stored item types before rendering.
- Kept the existing procedural furniture, authored building geometry, elevators, stairs, player movement, and vehicle systems intact.
- Updated release metadata, service-worker cache namespace, and maintained source mirror.

## Scope and limitations
- The new furniture is a visual layer; it does not yet update the collision grid, so players can walk through these added pieces.
- Layouts are stored in the current browser's local storage only. They are not synchronized to other players or Firebase and are not yet tied to property ownership.
- Furniture placement currently uses preset room positions with rotation/undo/clear, not free mouse dragging or grid snapping.
- This release does not add new room-by-room architectural shells, a dedicated multi-storey parking garage, or ambient traffic simulation.
- Real WebGL/browser and multiplayer validation still requires running the app in a configured browser/Firebase environment.
