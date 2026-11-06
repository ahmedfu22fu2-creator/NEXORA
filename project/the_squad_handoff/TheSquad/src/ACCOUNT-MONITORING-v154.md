# The Squad v154 — Account Monitoring & Report Review

## Owner dashboard
- Adds an English/LTR **Account Monitoring** section to the private Owner Control Center.
- Exact lookup by 10-digit account ID or username; no directory listing or broad user enumeration.
- Shows public profile fields, account enabled/disabled state, email-verification state, account creation, last sign-in, and last app-presence timestamp.
- Shows aggregate counts for published posts, conversations, reports filed, and reports about the account where the schema supports that relationship.
- Adds a report queue that supports the existing legacy report fields (`u`, `tg`, `cid`, `why`, `t`) and social report fields (`postId`, `postOwnerUid`, `reason`, `details`, `createdAt`, `status`).
- Report review is read-only in this release. No account suspension, deletion, report closure, or other moderation mutation is exposed.

## Security boundaries
- Every new callable re-checks the authenticated owner UID against the private `ids/1000000000` mapping via `requireSquadAdmin`.
- Exact account lookups and activity lookups are rate-limited.
- The functions return no email address, phone number, password, private profile fields, or private message body.
- Account activity is aggregate-only. No message collection or message body is read.
- Firestore rules, Storage rules, Firebase config, economy code, and the original `source/The-Squad-v137/` baseline were not edited.
- The new deployable functions source is included separately at `backend/firebase-functions/` with its own minimal `backend/firebase.json`; it is not placed inside the public static site.

## Deployment requirement
The static site can be uploaded separately, but account search/activity and the report queue require the new Cloud Functions to be deployed first. The package does **not** deploy Firebase functions automatically.

From the `backend` directory, after installing/using Firebase CLI and confirming the intended Firebase project, deploy only Functions:

```bash
firebase deploy --only functions --project the-squad-e36e7
```

The `backend/firebase.json` points to `backend/firebase-functions/`. Review the function source before deployment. Do not upload the `backend` directory as static Cloudflare Pages assets. If the Firebase project ID differs, use the correct project explicitly.

## Validation
- Production audit: passed (62 local HTML references; four source/site folders present).
- Smoke tests: passed (36 local script references; 45 JavaScript files parsed; basic Firestore guards).
- English/LTR localization integration: passed.
- Owner dashboard regression checks: 12/12 passed.
- Account monitoring regression checks: 13/13 passed.
- `node --check` passed for the updated dashboard and new Cloud Functions source.
- ZIP integrity checked after packaging.

## Not tested / not claimed
- No live Firebase deployment, browser session, second-account test, or real report/account data test was performed.
- Vite production build was not run in this environment.
- Aggregate counters may return unavailable when an optional query cannot be served; the dashboard shows a dash rather than inventing a value.
- Existing report records are displayed but not modified. Moderation actions require a separately reviewed policy and audited backend workflow.
