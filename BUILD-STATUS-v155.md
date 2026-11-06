# Build Status — v155

- Release: `v155-investor-readiness` (build 155)
- Root version manifest: present and synchronized with the legacy nested manifest.
- Service Worker: v155 cache namespace; precache entries are generated from actual local assets and validated by test.
- Entry points: main `site/index.html`, legacy `site/chanse3/index.html`, Services Hub, and app preview references checked.
- All four `chanse` folders preserved in `site/` and `source/`.
- Original source baseline: 373 files unchanged vs v154 archive.
- Automated test suite: passed.
- Full Vite build: not run successfully because dependencies could not be installed (offline cache miss; online npm install timed out).
- Live browser/Firebase/multiplayer/WebRTC tests: not performed.
- Firebase project target remains unconfirmed (`chatapp-67eb6` in package vs previously identified `the-squad-e36e7`); do not deploy to either target until confirmed.
