# The Squad v196 — Dedicated AI Hub & Store Entry Points

## Changes
- Added a dedicated AI Hub page with official ChatGPT, Claude, and Gemini launch links.
- Added a local prompt builder with copy and clear controls; prompts are not sent automatically to any provider.
- Added a dedicated Store landing page with The Squad virtual-item categories.
- Clearly disclosed that in-app inventory, pricing, ownership, and purchases are not yet connected; no fake purchase controls or balance deductions are shown.
- Updated v195 navigation bridges so AI Hub and Store open their own pages instead of the generic Services Hub.
- Updated release metadata and Service Worker cache namespace; retained the legacy v195 navigation script and Services Hub.

## Verification
- Automated project test suite passed on the v195 source before v196 changes.
- v196 static entry checks are added and must pass after the changes.
- No live Firebase, production build, external-provider API, or real-device browser test is claimed.
