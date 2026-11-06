# The Squad v179 — Living Universe

## Additive features
- Squad Creator: local drafts for small game concepts.
- Squad Companies: virtual company drafts by sector.
- Squad Cinema Studio: film project drafts.
- Living NPC quest board: local quests with local reputation rewards.
- Reputation foundation: earned local points; no public player ratings.
- Dynamic weather and season selection preferences.
- Smart-home preference panel.
- Social map concept with non-personal place markers (no player tracking).
- Weekly challenge drafts and local completion.
- Virtual auction listing prototype using non-purchasable demo points only.
- Civilization Chronicle local activity log.
- Rule-based City Guide (not a connected AI model).

## Boundaries
All v179 additions are local-first prototypes. No real-time multiplayer, cloud synchronization, real-money payments, player-location tracking, live NPC simulation, actual film rendering, or external AI calls are claimed. Existing Firebase rules/configuration and legacy application systems are not intentionally modified.

## Build status
The Vite production build is still blocked in this environment because npm registry DNS resolution returned `EAI_AGAIN` while resolving `registry.npmjs.org`. Node is v22.16.0, which satisfies the package engine requirement. Vite and esbuild are not installed or cached here. Do not treat the source-level checks as a successful production build. Re-run `npm install --no-audit --no-fund`, `npm run build`, and `npm test` once registry access is available.
