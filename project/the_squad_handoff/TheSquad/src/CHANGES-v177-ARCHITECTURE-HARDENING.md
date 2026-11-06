# Changes — v177 Architecture Hardening

- Established a single canonical Firebase deployment target while keeping compatibility configs aligned.
- Kept the canonical backend Functions entry with all owner-admin callable exports intact.
- Kept the previous backend Functions entry as a named legacy snapshot.
- Preserved all four `chanse` folders, CSS layers, GLB models, historical rules snapshots, and existing tests.
- Added a static architecture/deployment regression check.
- Bumped release manifests and Service Worker cache to v177.
- Did not deploy to Firebase or claim live security verification.
