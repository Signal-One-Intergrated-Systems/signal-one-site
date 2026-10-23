# Signal Connect V3 — Execution 03B evidence and design-review boundary

**Date:** 2026-10-23
**Scope:** five-chapter interaction and neutral-image review, not the final public story
**Feature commit tested:** `a2d7dcb7bd2ab819fc7d93733ef271ab11ef822f`
**GitHub CI:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/actions/runs/39975172367
**Result:** **GREEN** — source tests, lint, production build, typecheck, **48 Chromium Playwright tests (28.2s)**, independent ZBar QR decoding, screenshot artifact upload
**CI screenshot artifact:** `signal-connect-foundation-evidence`, artifact ID `12511977013`
**CI QR decoded URL:** `https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe`
**Vercel staging review:** `dpl_5RGWvxrWyzpt112fpG3PKouWCdvX`, Vercel reports READY
**Staging URL:** https://signal-connect-v3-source-preview-8nvw2z71w.vercel.app/review/story/andisiwe
**Public V3 visitor:** https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe — unchanged; story still coming soon
**Production release status:** **STOP**, final photo/provenance gate from 03A remains RED

## 1. Delivered scope

1. Added **server-gated** review-only route `/review/story/[profile]`. It returns 404 unless `CONNECT_STORY_QA=enabled` and `VERCEL_ENV !== production`. The environment flag is NOT set on the V3 production deployment; Vercel's production environment is *always blocked* even if that flag is accidentally set.
2. No public navigation path to the review route. `VisitorIdentity.tsx` and `/connect/andisiwe` are unchanged; they continue to say **Coming soon** and retain immediate Save Contact and email handoff.
3. Added `SignalStory.tsx`, `StoryPanel.tsx` and one owner `SignalStory.module.css`. They render five frozen `storyChapters` from 03A: WIN, HIRE, RUN, EQUIP, PROVE. Each has the approved text and development-stage disclosure.
4. Media is a **neutral graphite placeholder** with an editorial sequence number and visible "Photography pending approval", rather than using staged illustrative pictures or conditional manufacturer images. No public chapter image, fake dashboard, cut-out product, embedded brand or third-party image dependency.
5. One 14px radius story card with a single flush-edge media section, integrated chapter copy and disclosure. Canonical Inter, surfaces, Signal Blue, 10px button radii, 48px controls and 14px minimum meaningful type.
6. Five-step progress, explicit **Previous / Next chapter / Exit to Andisiwe's contact card** controls; last/first buttons disable at boundaries. Left/right arrow keys are supplementary, not the only navigation.
7. On chapter changes, focus moves to the active chapter heading for keyboard and assistive users. No focus stealing on first load. Per-chapter text/media fade and 6px rise at **300ms** only when reduced motion is not requested; colour response on controls uses 140ms. No parallax, zoom, perpetual shimmer, gradients, metal textures, stacked glass or `!important`.
8. At short heights, layout scrolls naturally rather than clipping buttons or content. Distinct CSS module per story, no global style modifications.

## 2. Automated tests and independent checks

`signal-connect/tests/story-review.test.mjs` verifies:
- Default closed state and failure for any unexpected flag, including when `VERCEL_ENV = production`
- Review route calls the server gate and `notFound()`
- Public visitor route has no preview link, is still marked coming soon
- No photo/media asset used; no forbidden CSS effects

`signal-connect/tests/story-review.spec.ts` verifies:
- All five chapters in frozen order, exact headlines, progress / current step / boundary disabled states
- Next and Previous, keyboard arrows, focus movement, exit back to public contact
- Nonexistent founder 404
- No public visitor link to review
- Reduced-motion transitions disabled
- Responsive screenshots, no horizontal overflow, real Inter, 14px card radius, 10px controls and at least 48px control height at widths **320, 360, 390, 430, 768, 1024, 1440**
- WCAG AA axe checks, no browser page errors, no story images
- Short 390×667 viewport scrolls and controls remain accessible

CI switched Playwright *only* to `CONNECT_STORY_QA=enabled npx playwright test` so runtime story QA is available **inside the CI server** without enabling the V3 production site. All prior foundation/presenter/visitor QR tests continue to run.

**GitHub Actions 39975172367:** install PASS; Node tests PASS; lint PASS; Next production build PASS; typecheck PASS; Playwright **48 passed (28.2s)**; ZBar screenshot QR decode PASS; evidence upload PASS.

## 3. Staging deployment — review only, no visitor release

A source-exact QA build was uploaded to the existing isolated V3 Vercel project, with `target=staging`, deployment `dpl_5RGWvxrWyzpt112fpG3PKouWCdvX`, status **READY**. The `CONNECT_STORY_QA=enabled` environment variable was added **only for Vercel preview** (not production). The build uses the feature commit `a2d7dcb7...`.

**IMPORTANT ACCESS LIMITATION:** Attempts to fetch the review route using the connected Vercel web-fetch tool returned a 403 **on the Vercel protection-bypass API**, which does not establish that the app itself returned HTTP 403. The separate web fetch tool also could not access the staging URL. Vercel READY is confirmed, but external end-user reachability and visual render of this specific preview are **not independently verified**. Ask the reviewer to open the direct staging review URL on their phone and report what actually renders; do not claim iPhone Safari validation.

The existing stable production V3 preview domain and V2 were **not** redeployed or overwritten by this staging deployment.

## 4. Unresolved gates / next action

- 03A media approval **RED**: acquire purpose-matched real photography for WIN/HIRE/RUN/PROVE, confirm EQUIP manufacturer usage rights, secure clean Guard proof-of-service capture from synthetic tenant.
- Review the CI screenshots (GitHub artifact) and actual mobile staging URL before visual sign-off; Chromium tests are not physical iPhone/Android tests.
- Source-upload Vercel path remains temporary; Git-connected deployment of this branch is still blocked by missing authorized Vercel/GitHub integration.
- No end-user story link until the actual 03A media gates are cleared and app is approved. Still no 04A reverse exchange form or 04B durable Sales OS intake.

**Verdict:** 03B interaction/engineering gates **GREEN**; final story/media and external/mobile release gates **STOP**. This deliberately separates testable UI behavior from claims of finished photographic brand work.
