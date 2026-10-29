# Signal One Public Website — 10/10 Release Mission
Date: 29 October 2026. Scope: public website only. No edits to LEOS, Guard or Workforce application repositories.

## Non-negotiable design acceptance
1. The existing approved cinematic homepage photo/glass globe and exact Signal One logo remain.
2. One compact, floating, unobstructed navigation pill on every public route, including 390px mobile. No separate white backing strip.
3. One canonical navy/slate/sky-blue atmospheric palette. Light material is cool-blue translucent glass, not plain white sheets.
4. Use material variants deliberately: dark glass over imagery/hero; high-contrast light glass for forms, feature cards and dense diagrams.
5. Preserve semantic HTML, form labels, links, metadata, pricing, status disclosures and routes. Never describe unreleased features as live.
6. Motion is optional, not a reading prerequisite; no content hides when JavaScript is disabled or reduced motion is requested.
7. No horizontal overflow, navigation collisions, missing focus rings, uncontrolled image crops or text-through-blur failures.

## Execution workstreams
- **A. Shell and tokens.** Consolidate active cross-page overrides under a single material ownership layer; resolve duplicate header padding/negative margins and ensure main-level surface classes inherit the correct palette.
- **B. Page-specific composition.** Inspect and approve each route: home, 1GUARD, 1Workforce, equipment, guard marketplace, pricing, contacts, trust/privacy, guard/join/sales. Replace generic imagery with approved real-world product/attendance photography. Rebuild diagrams explicitly rather than relying on a universal box shadow.
- **C. Conversion.** Verify links, mobile menus, sales CTAs, selection options, consent, errors, email fallback and actual lead receipt. Do not mark forms working until a controlled submission is confirmed at the receiving system.
- **D. Performance and accessibility.** Verify image sizes, globe pause/reduced-motion, 390/768/1440px screenshots, zoom and keyboard accessibility, visible focus, and contrast of all glass variants.
- **E. Release.** Production build, brand check, complete Playwright suite, production deployment, real-browser live checks, and a rollback reference. Do not mark complete on compilation alone.

## Current verified status
- Core marketing glass layer and missing main-level colour treatment refactored in this branch.
- Broad implicit scroll observer reduced to explicit .reveal-group regions.
- Responsive and contact regressions added to the Playwright suite.
- The remaining page-by-page visual review, lead integration and realistic attendance photography require separate acceptance. This branch does **not** represent all workstreams completed.

## Release criteria
**VISUAL GO** only after real desktop/tablet/mobile screenshot comparisons across all public routes.
**COMMERCIAL GO** only after valid contact intake is acknowledged by the receiving system and marketplace statuses are accurate.
**PRODUCTION GO** after all automated tests and live smoke tests pass.
