# THE SQUAD — v189 Full Repair Audit

## Scope
Prepared from the supplied `THE_SQUAD_الموقع_والتعديلات.zip` snapshot. This is a local source audit only; it has not been published to GitHub Pages and no live Firebase data was changed.

## Confirmed findings
- The main entry page is `site/index.html` (about 54.9 KB).
- The page loads 39 stylesheets and 61 external classic-script files.
- The page contains 75 button elements, 13 inline `onclick` attributes, and 92 element IDs.
- All statically declared local `src`/`href` assets in the page were found in the supplied `site` tree; dynamic template references were excluded from that check.
- A selector scan found 208 CSS selectors repeated across multiple stylesheets. Examples include `body`, `html`, `button`, `input`, `textarea`, `#nav`, `#side`, and `#tabs button.on`.

## Main risk
The stylesheet stack has grown through many successive visual revisions. Several foundational selectors are redefined by multiple files, so the final appearance depends heavily on stylesheet order and selector specificity. This is a credible source of inconsistent spacing, overlapping panels, and controls that look different between screens. It is not proof that every overlap has this single cause.

## Repair plan
1. Map the DOM regions and identify the owning stylesheet for each major screen.
2. Consolidate shared layout tokens and remove conflicting duplicate rules in a controlled way.
3. Establish one responsive layout system for navigation, side panels, chat, dialogs, and mobile views.
4. Inventory all 75 buttons and trace each to its event handler or delegated action; mark nonfunctional controls rather than pretending they work.
5. Test authentication, chat, calls, stories, channels, settings, and other feature flows independently.
6. Run the production build and regression suite, then inspect desktop and mobile rendering before release.

## Validation status
- Local asset reference scan: PASS for statically referenced local files.
- CSS conflict scan: FOUND 208 selectors repeated across multiple stylesheets; requires controlled consolidation.
- Production build: NOT VERIFIED. Dependency installation did not complete within the available execution window.
- Browser visual test: NOT RUN.
- Live deployment: NOT PERFORMED.

## Important constraints
This snapshot does not provide permission to modify the user's GitHub repository or publish changes. The Firebase project and production secrets must remain private; do not commit `.env` files or expose credentials. A GitHub connection is required before changes can be published directly.
