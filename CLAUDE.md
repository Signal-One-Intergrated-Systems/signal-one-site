# Signal One public website — agent instructions

Next.js 16 marketing site for Signal One Integrated Systems (https://signalone.co.za). Railway production deploys from `main`: **merging to `main` is a production release** and needs explicit founder approval.

## Start here
- Launch programme state and evidence: `docs/launch/EXECUTION.md`, `docs/launch/execution-state.json`, `docs/launch/DEFECT_REGISTER.md`, `docs/launch/RELEASE_GATE.md`.
- Approved brand and product decisions: `docs/PRODUCT_BRAND_ARCHITECTURE.md`, `docs/BRAND.md`, `docs/DESIGN_SYSTEM.md`, `docs/UX_REQUIRED_CORRECTIONS_2026-11-12.md`.
- Intake contract with LEOS: `SITE_INTEGRATION.md`.

## Non-negotiable
- The homepage hero (photo, composition, copy, interactive radio) is founder-locked. The founder recomposed it on 2026-11-27: no glass card, "Buy or rent radios" first, "Explore 1GUARD" second, the trial only in the 1GUARD section. Fix around it (e.g. background fills, delivery performance), never recompose it without a founder decision.
- Never submit live production forms, even with test data. Use the local build with `tests/e2e/mock-intake.mjs`.
- Never invent prices, stock, specifications, testimonials, certifications, contact details or customer logos. Missing facts are logged as BLOCKED with the founder as owner.
- Truth labels (available / pilot / in development / planned / coming soon) stay accurate.
- A form may report success only on a persisted-record receipt from the receiver.

## Checks
- `npm run build` runs the branding and design-system checks before and after the build.
- `PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test --trace off` in Claude Code cloud sessions (the pinned Playwright's own browser is not installed there).
- Never run `npm run build` while any `next start` (yours or the test suite's) is serving this directory: it serves stale HTML for replaced chunks and produces hydration/ChunkLoadError failures that look like flakes. `pkill -f "next start"` first.
- Judge visual changes from real screenshots at 1440, 1280, 1024 and 390 px, before and after.
