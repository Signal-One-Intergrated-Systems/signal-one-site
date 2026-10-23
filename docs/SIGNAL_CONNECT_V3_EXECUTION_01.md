# Signal Connect V3 — Execution 01 (Clean Foundation)

**Status:** READY FOR CODE IMPLEMENTATION, NOT AN APPROVAL TO DEPLOY
**Base:** branch `rebuild/signal-connect-v3-clean-20261023` created from main `c68d96604441bace329f0494bcddf2385b5745d5`.
**Governing contract:** `docs/SIGNAL_CONNECT_V3_REBUILD_SPEC.md`.
**Keep existing production unchanged.**

## Objective
Construct a fresh, typed, source-controlled foundation for a dedicated standalone Next.js Signal Connect PWA under `signal-connect/`. This mission stops before adding lead-data collection. Build a canonical founder presenter screen and brand primitives, not a visually incomplete multi-step demo.

## Mandatory reads before writing any code
- `docs/BRAND.md`
- `docs/DESIGN_SYSTEM.md`
- `app/globals.css`
- `app/components/brand/SignalOneLogo.tsx`, `SignalOneMark.tsx`
- `app/layout.tsx`
- `docs/ASSET_PROVENANCE.md`
- `docs/SIGNAL_CONNECT_V3_REBUILD_SPEC.md`

## Prohibited
- NO copy, cherry-pick or adaptation of `public/connect/andisiwe.html` from legacy PR #27.
- NO old `signal_connect_glass*.html` or anonymous inline style patching.
- NO `!important`, imported frontend mega-framework, fake UI, inline SVG recreation if the canonical mark is importable, externally served Inter, or browser-side QR external API.
- NO touching production DNS, Railway, live Vercel project configuration, existing site marketing routes or customer data.
- NO unapproved developer secrets, numbers or personally identifiable test fixtures.

## Proposed first commit
1. Create independent Next.js 16 / React 19 / TypeScript app root in `signal-connect/` with version-pinned reproducible build, `next/font` Inter and a properly isolated root layout. Keep dependency diff minimal and documented.
2. Introduce a canonical brand adapter (prefer shared-source extraction with limited blast radius; otherwise copy a VERSIONED module with an invariant test comparing geometry/typography to the source). Do not restyle existing site components.
3. Build a dark, one-layer app shell with approved typography, subtle canvas and correct iPhone safe area.
4. Implement typed `FounderProfile` for Andisiwe: `fullName='Andisiwe Satshwa'`, `title='Founder'`, `organization='Signal One Integrated Systems'`, public approved contact email only.
5. Build `/present/andisiwe` with canonical mark, simple greeting, QR placeholder slot that can never show a fake scan pattern (use explanatory noninteractive placeholder until real locally generated code is installed), and a working vCard download using approved public details.
6. Add app icons, PWA manifest and initial `/connect/andisiwe` visitor landing skeleton **without a submission form**.
7. Add tests: title accuracy; exact brand mark ring geometry; typography; mobile overflow; vCard contents; visitor/presenter path distinction; reduced-motion; no stray `!important`; no unexpected remote media URLs.
8. Add CI or documented run commands: `npm ci`, `npm run build`, `npm run lint`, `npx playwright test` in the app root. Avoid changing the website's baseline tests.

## Founder presentation acceptance
- Real Inter font loads and computed font-family is verified.
- Logo mark/wordmark and descriptor ratios match `docs/BRAND.md`.
- Primary and secondary controls use the website's canonical palette and radii, not new gradients.
- No faux iPhone bezel on a phone; no double-card surfaces.
- No network access required to view contact/profile content after first successful caching.
- Accessible nonfake QR area (unfinished QR is labeled under development, NOT publicly deployed).

## Required report
For every command, give exit code and relevant evidence. Report changed paths, build results, visual screenshots at 360/390/430, any canonical-source divergence, absent prerequisites, and STOP status if a release gate fails.

## Next missions (separate, sequential)
- **02:** local QR generation, iOS install, vCard validation.
- **03:** five-chapter photographic story with real asset provenance and intentional motion.
- **04:** accessible interest form, durable backend or explicit email-only handoff.
- **05:** Sales OS verified lead bridge, real-device QA, staging then promotion.

**This phase MUST NOT deploy publicly.**
