# Signal One acquisition homepage — implementation and release plan (2026-10-29)

## Business architecture
- Parent Signal One = integrated software + mission-critical field technology.
- 1GUARD = security company operating system: staffing/coverage, patrols, incidents, dispatch, evidence, client oversight and connected radios.
- 1Service = service business operating system, replacing the 1Workforce market-facing identity. Launch wedge: restaurants and hospitality; expand to cleaning, facilities and field service only as capabilities are proven. Staffing, scheduling and attendance are foundational modules, not the entire product.
- Enterprise equipment = consultation, procurement, installation/fulfilment and lifecycle support.
- 1Community is coming soon. Preserve exact original Signal One brand logo.
- Keep existing /workforce URL and internal identifiers as compatibility aliases until product routing, provisioning, metadata and analytics migrations are tested. Never globally replace database identifiers.

## Conversion design
1. On the homepage communicate business outcomes within five seconds.
2. Primary CTA exact copy: Get 14 Day Free Trial. Route to /get-started; ensure form is labelled as request only until automatic provisioning is genuinely deployed.
3. Secondary CTA: Explore Enterprise Equipment. Preserve high-intent enterprise quotation route.
4. Distinguish owner, operations manager, procurement, and frontline personnel.
5. Show actual product UI near top: a real, privacy-safe guard control room and restaurant daily overview (only where verified). Mark demo data as synthetic. Never create fake testimonials, clients, metrics or partner badges.
6. Replace unverified AI-stock hardware imagery with accurate approved manufacturer images or actual photographs. Maintain immutable device shape and original logos.
7. Measure trial CTA impressions, clicks, request starts, completed requests, verified invitations, trial activation, engaged first session, paid conversion, equipment quote submissions, qualified quotes and purchases. Distinguish lead from activation.

## 1Service positioning
- Core promise: manage the daily work and economics of service businesses from one operating system.
- Restaurant modules to audit by real code: reservations/guest, front-of-house POS integrations, orders, kitchen display, inventory/recipe costing/waste, purchasing, labour scheduling/clocking, tips/payroll, staffing marketplace, tasks, analytics/forecasting and multi-site. Do NOT advertise modules before checking shipped feature state.
- Competitive research anchors: Toast (POS, team, invoice, costing, inventory, restaurant management) and comparable restaurant POS software.
- 1GUARD research anchor: Trackforce/TrackTik operational checkpoints, scheduling, incident and client-proof patterns. Do not imply feature parity without code verification.

## Page-by-page sequence
P0 homepage: promise, lead capture, brand-preserving imagery, product proof and dual conversion.
P1 1GUARD: separate owner/operator and guard-facing journeys; proof screens; trial onboarding.
P2 1Service: new /service canonical route, 301/308 migration of /workforce, hospitality-first workflow and segment pages.
P3 enterprise equipment: categories, real SKUs/spec sheets, buying/renting, quote qualification, procurement trust.
P4 pricing, comparison, trial and onboarding; legal copy and eligibility.
P5 1Community clearly coming soon; no premature commitment.
P6 SEO, FAQ, case studies with consent and verifiable claims; integrations, cross-sell.
P7 instrumentation, accessibility, responsive layouts, performance and commercial experiments.

## Production blockers
- Trial receiver and idempotent tenant provisioning, secure identity/entitlements, server-authoritative start/end timestamps and cancellation/expiry, outbound invitation and paid-conversion workflow.
- Verified source repository build, branding/design checks, TypeScript, lint, Playwright mobile/desktop and real-host smoke tests.
- Image audit: provenance, licensing, resolution, subject and logo fidelity, alt text and LCP performance.
- No production deployment until tests pass and trial promise accurately describes activation.

## Branch scope
This feature branch contains only homepage and /get-started copy/CTA changes plus this plan. Full imaging refresh, new route, redirect, actual platform integrations and subscription activation are pending implementation.
