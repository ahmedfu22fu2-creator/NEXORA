# The Squad Universe — Feature Reality Matrix (v166)

This matrix distinguishes existing integrations from local prototypes and unimplemented real-time services. A visible card or concept is not proof of a production backend.

| # | Feature | v166 status |
|---:|---|---|
| 1 | Global text translation | External Google Translate handoff; manual copy/paste |
| 2 | Live translated voice calls / multilingual voice rooms | Not implemented; requires secure translation + realtime audio service |
| 3 | 3D/avatar calls | Existing 3D call/café assets retained; new cross-platform avatar sync not verified |
| 4 | Shared watch / activity rooms | Existing cinema retained; synchronized playback and rights-aware media integration not verified |
| 5 | Embedded Squad AI assistant | Official AI site shortcuts only; no embedded AI API |
| 6 | Creator Studio | Local caption-draft templates; no AI image/video generation |
| 7 | Conversation summaries | v167 local Arabic/English extractive digest; user-pasted text only, no AI or private-chat auto-access |
| 8 | Squad City | Existing 3D district/world retained; v165 virtual map is a design layer, not new server routing |
| 9 | Homes / properties | Local home preferences only; no multiplayer ownership or persistent building system |
| 10 | Businesses / marketplace | v164 marketplace listings exist; no payment, escrow, or real-money wallet |
| 11 | Avatar Studio | Local appearance preset only; not yet connected to the 3D avatar rig |
| 12 | Missions / rewards | Not implemented as a server-validated progression system |
| 13 | Events | v164 event and attendance flows exist; realtime event broadcasting not verified |
| 14 | Smart Feed | Existing social feed retained; personalized ranking not implemented |
| 15 | Friend discovery | Existing friends/following retained; recommendation engine not implemented |
| 16 | Live broadcasting | Not implemented |
| 17 | Workspace | Local tasks and notes; not cross-device synced |
| 18 | Memories | Local memory cards; not cross-device synced |
| 19 | Clubs / communities | Existing community flows retained and reused |
| 20 | Creator marketplace | Marketplace listing foundation exists; creator payouts and escrow not implemented |
| 21 | Smart Search | v164 bounded search over supported public entities; not semantic AI search |
| 22 | Squad Identity | Existing profiles and achievements retained; new public identity system not fully integrated |

## Next implementation dependencies
- Secure server-side translation provider and rate limits; never place secret API keys in browser files.
- Realtime audio transport and moderation controls for translated calls/rooms.
- Server-authoritative Firestore models and rules for property ownership, missions, and rewards.
- Rights-aware synchronized media playback and realtime broadcast infrastructure.
- Explicit privacy controls, abuse reporting, and mobile/browser QA for new social discovery features.
