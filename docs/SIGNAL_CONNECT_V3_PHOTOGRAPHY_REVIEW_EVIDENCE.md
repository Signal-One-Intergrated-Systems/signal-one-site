# Signal Connect V3 — Photography Integration Review

**Date:** 2026-10-23
**Authorization:** Owner approved proceeding with photography following Execution 03B. This is **approval to develop and visually review** a photography-led story, not evidence of a photographer's rights grant, model/property releases or verified client operations.
**Source branch:** `rebuild/signal-connect-v3-clean-20261023`
**Tested code commit:** `519990fed7604bcd085e4e41a7dc4401dd772345`
**GitHub CI:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/actions/runs/39979887712
**Vercel staging deployment:** `dpl_2mfntvExcbX4fQC5LTdFS97zMzhM` — READY
**Story review URL:** https://signal-connect-v3-source-preview-ksav09h34.vercel.app/review/story/andisiwe
**Public visitor:** https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe — remains on its previous deployment
**Release classification:** **ILLUSTRATIVE INTERNAL REVIEW — NOT PUBLIC PRODUCTION**

## What was built

- The prior neutral 03B media blocks now show five directly sourced WebP illustrations/device references. The copy, chapter ordering, navigation and public visitor route are unchanged.
- Images for WIN, HIRE, RUN, PROVE are the original pre-existing website **AI-generated illustrative scenes**. They do not show actual Signal One staff, customers, sites or live services. Their scene/activity mismatch and resolution limitations are retained in `docs/SIGNAL_CONNECT_V3_STORY_ASSETS.md`.
- EQUIP uses the exact staged manufacturer's Hytera PNC360S image. Its use here is **review-only pending media reproduction rights**; integration with Guard/Signal One has not been asserted.
- Each chapter displays its source/release limitation as a solid-label overlay. All chapters keep development-stage product disclosures. PROVE **does not** show a fictional Guard screenshot disguised as actual operational proof.
- Gated `GET /review/story-media/[chapter]` reads original files from the app's non-public reference path. It returns 404 when story QA is disabled or `VERCEL_ENV=production`, and no-cache / noindex WebP when enabled. It does not turn arbitrary user paths into file system reads.
- Added `outputFileTracingIncludes` for the gated route so Vercel includes the actual reference binaries inside its serverless route. No `public/media/story/` directory was created and no visitor route now links to the review.
- Media remains in **one 14px card surface** with flush picture and solid captions. Canonical Inter, dark surfaces, Signal Blue, 10px controls and the existing 300ms restrained entry animation are intact. No `!important`, neon glow, fabricated texture, rounded nested media card, or source-code import from V2.

## Quality gates

At exact code commit `519990f`, GitHub run `39979887712` returned **SUCCESS**:
- npm ci, node contracts, ESLint, Next.js production build and TypeScript: PASS.
- Playwright Chromium **49 passed (30.9s)**; image endpoints tested for all five chapters and WebP MIME/RIFF signatures; browser tests verify loaded image natural width, proper focus/navigation, accessible layout, seven screen widths, short iPhone viewport and reduced-motion behavior.
- Independent ZBar screenshot decode: `https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe`, PASS.
- Screenshots/evidence: GitHub Actions artifact `signal-connect-foundation-evidence`, ID `12512931921`.

Vercel staged the exact source files and five binary images under deployment `dpl_2mfntvExcbX4fQC5LTdFS97zMzhM`, READY. Source tree inspection confirms story assets and review-media route are part of that deployment. Independent attempts to load the external route using web and Vercel's protected fetch failed **at the tool/access layer**; do not claim the pages were rendered or images verified in actual deployed Safari/Chrome.

## Non-negotiable release restrictions

1. Owner's photography direction approval does **not** convert existing AI images into authentic commissioned South African operational photographs.
2. Keep the visual story **off the public visitor card** until purpose-matched images, licences/releases and an approved real synthetic Guard proof screen are obtained.
3. The staging review address is **unlisted and gated by environment**, but is not a user-login-protected private document: anyone with a working URL may be able to access it. Do not embed confidential material in reference assets.
4. No V2, existing Signal One website, production QR, contact save, reverse exchange or Sales OS code was changed.
5. Final photography and rights decisions must be documented **per image** before setting `publicStoryMediaApproved=true` or promoting any story to the production experience.
6. Browser/CI success is not iPhone/Android physical camera verification.

**Decision:** Engineering and illustrative-photography QA green; true documentary media/product proof rights gate remains RED. User can now inspect a photo-led review and commission replacements against a working layout rather than a placeholder.
