# The Squad v157 — Zero-Cost Architecture Decision

## Goal

Keep The Squad's social platform and chat usable without adding a paid backend or a third-party messaging subscription. This release applies safe browser/Firestore improvements only. It does **not** claim WhatsApp-scale concurrency or Signal-protocol encryption.

## What is already in the project and retained

- Firestore real-time listeners for chat metadata and the active conversation.
- A bounded active-chat query (`orderBy('t').limitToLast(100)`).
- Firestore browser persistence where supported, including multi-tab handling.
- On-demand retrieval of older Firebase Storage chat attachments from legacy messages (for projects where Storage is still accessible).
- Image resize before storage, short voice-note recording, typing throttling, send locking, and lazy media loading from prior releases.

## v157 changes

1. **Spark-safe new chat media:** new image and voice messages are compressed in the browser and stored as bounded data URLs directly in the existing Firestore message document. Image data URLs are capped at 180,000 characters; voice data URLs are capped at the same limit and raw audio blobs at 125 KiB. This stays below the existing Firestore Security Rules maximum of 200,000 characters for `im` and `au` fields. New chat attachments no longer call Firebase Storage.
2. **Media size control:** images are resized and encoded as WebP/JPEG at progressively smaller dimensions/qualities until they meet the cap. Voice is recorded as Opus where supported at a low bit rate and remains limited to 30 seconds.
3. **No-Functions unread fallback:** when the server-maintained unread counter is unavailable, the chat list derives a one-message unread indicator from `last`, `lt`, and the user's own `seen` timestamp. Existing server-maintained counts remain respected.
4. **No backend migration:** Firebase configuration, Authentication, Firestore rules, Storage rules, callable functions, economy endpoints, and legacy data are intentionally unchanged.

## Free-tier reality and boundaries

- Cloud Firestore Spark currently includes 1 GiB stored data, 50,000 document reads/day, 20,000 writes/day, 20,000 deletes/day, and 10 GiB/month outbound transfer. These are quotas, not unlimited capacity. Exceeding a Spark quota shuts off that product for the remainder of the month/day as described by Firebase; it is not an unlimited no-cost scale tier.
- Cloud Storage for Firebase requires Blaze for access from 3 February 2026. New chat media avoids it in this release, but **social-feed post images and Cinema uploads still reference Firebase Storage**. Those two features need a separate, authenticated media migration before the whole site can be considered Spark-compatible.
- Firebase Cloud Functions cannot be deployed on Spark. The existing project still invokes callables for account-ID lookup/login, username login/claim, and economy/admin flows. This release does not remove or weaken those server-side security checks. Those features still require the configured Functions backend and therefore are not certified as working on Spark.
- The checked-in `firebase-config.js` currently identifies `chatapp-67eb6`, while earlier project handoff notes identify `the-squad-e36e7`. No project ID or bucket was changed. Confirm the intended Firebase project before any deployment.
- Cloudflare Workers Free advertises up to 100,000 requests/day and 10 ms CPU per invocation. Cloudflare R2's published free tier includes 10 GB-month storage, 1 million Class A operations/month, 10 million Class B operations/month, and free egress. These are possible building blocks for a later migration, but they are not wired into the running site and over-quota use must be blocked/monitored to preserve a strict zero-cost target.

## Security: what this release does NOT claim

- Chat text, reply previews, chat last-message previews, pinned-message previews, and message metadata are still readable by authorized Firestore chat members and are **not end-to-end encrypted** by v157.
- Firestore transport uses TLS and Firebase access control, but this is not equivalent to E2EE: a backend administrator with database access can access stored plaintext.
- v157 does not implement Signal Protocol, Double Ratchet, key verification, forward secrecy, recovery, group-key distribution, or multi-device key synchronization.
- Do not create a home-grown cipher or mark the chat as “Signal encrypted”. A proper E2EE phase must use a vetted protocol/library, cover every text/preview/reply/pinned/attachment path, add key-change verification, and pass two-account + multi-device + restore/loss tests before enabling it.

## Data-retention decision

Messages remain in Firestore for conversation history and cross-device sync. They are not deleted immediately on delivery: doing so would break history and new-device synchronization. Firestore managed TTL deletes require billing; this zero-cost build does not enable TTL. Any future retention/expiry feature must be explicit and must not silently delete users' history.

## Validation scope

- Static regression tests and JavaScript syntax checks cover the v157 edits.
- No Firebase emulator, live login, live media upload, Cloud Functions deployment, R2 binding, browser/device benchmark, or real-user two-device E2EE test was performed.
- This package must not be described as a production deployment or a WhatsApp-scale/E2EE release.

## Official reference pages checked on 2 November 2026

- Firebase Firestore quotas and billing: https://firebase.google.com/docs/firestore/pricing
- Firebase Spark/Blaze capabilities and Cloud Functions deployment limits: https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- Firebase Cloud Storage Spark restriction effective 3 February 2026: https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
- Cloudflare Workers Free limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare R2 free tier and pricing: https://developers.cloudflare.com/r2/pricing/
- Firestore REST authentication using Firebase ID tokens and Security Rules: https://firebase.google.com/docs/firestore/use-rest-api
