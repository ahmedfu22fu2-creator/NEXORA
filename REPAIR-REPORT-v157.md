# The Squad v157 — Zero-Cost Messaging Foundations Report

## Implemented

1. **Spark-safe new chat image uploads:** browser-side WebP/JPEG compression with progressive dimension/quality reduction; final data URL limit 180,000 characters; no Firebase Storage upload for new chat images.
2. **Spark-safe new voice notes:** browser Opus recording where available at 16 kbps, 30-second maximum, 125 KiB blob cap, 180,000-character data URL cap; no Firebase Storage upload for new voice notes.
3. **Unread fallback without a server trigger:** the chat list derives a one-message unread indicator from `last.u`, `lt`, and the current user's own `seen` timestamp, while still honoring any existing server-maintained unread count.
4. **Existing performance protections preserved:** Firestore persistence, one active chat listener, last-100-message query, typing throttling, send lock, and lazy loading of legacy media.
5. **Release/test updates:** release manifests, Service Worker cache namespace, existing release checks, and a new v157-specific regression check were updated.

## Exact preservation results

- v156 files present before changes: 679.
- v157 files after changes: 682.
- Missing original files: 0.
- New files: 3 (`ZERO-COST-ARCHITECTURE-v157.md`, `site/chanse4/MESSAGING-ARCHITECTURE-v157.md`, `scripts/v157-zero-cost-messaging-check.mjs`).
- Modified existing files: 10.
- Preserved directory trees: `site/chanse1`–`site/chanse4` and `source/The-Squad-v137/chanse1`–`chanse4`.
- SHA-256 comparisons against v156 passed for Firestore rules, Storage rules, Firebase config, Firebase Auth, the account module, and Cloud Functions source.

## Verification

- `npm test`: passed.
- JavaScript syntax check: 180 files passed.
- Service Worker preload validation: 72 local assets resolved.
- Archive CRC check is performed after packaging.

## Zero-cost limitations that remain

- Firebase Spark Firestore has fixed free quotas; it is not an unlimited concurrency service.
- Firebase Storage requires Blaze access since 3 February 2026. New chat uploads were changed to inline Firestore data URLs, but Social Feed and Cinema still use Firebase Storage, and old chat attachments using `imPath` / `auPath` still need an accessible bucket.
- Firebase Cloud Functions cannot be deployed on Spark. The current app still uses callable functions for several account, username, economy, and admin actions. These were left intact rather than weakening their security. A tested replacement backend (for example, a Firebase-ID-token-verified Cloudflare Worker using Firestore REST under Security Rules) is required before those flows can be Spark-only.
- The Firestore message body and previews remain plaintext to authorized backend/database access. No Signal Protocol or Double Ratchet implementation was introduced. E2EE requires a vetted implementation and multi-device key lifecycle work before it can be truthfully enabled.
- No millions-of-connections claim is made. No live Firebase or browser test was performed.
