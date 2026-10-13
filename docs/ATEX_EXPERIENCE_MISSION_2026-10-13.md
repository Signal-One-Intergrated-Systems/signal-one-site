# Signal One living operations website — single-mission record

**Mission date:** 2026-10-13  
**Primary site:** https://www.signalone.co.za  
**Benchmark:** https://atexsolutions.io/  
**Execution branch:** feat/atex-beyond-experience-20261013  
**Review:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/pull/25  
**Isolated Railway preview:** https://atex-experience-preview-production.up.railway.app/

## Creative direction

Do not clone ATEX. Surpass it by turning real, implemented Signal One Guard behaviour into one coherent, explorable operation: **field action → digital record → control-room response → service proof**. Movement explains a consequence. No decorative particles, fake telemetry, fabricated GUARD UI, rotating or modified brand marks, or unapproved new palettes.

This is an enhancement to the existing WIN → HIRE → RUN → EQUIP → PROVE narrative, not a new identity. Approved design tokens, typography, brand SVGs, spatial grid, navigation and user journeys remain the source of truth.

## Changes included in this PR

1. Animated but manually controllable, desktop-only glass workflow teaser in the hero. Uses actual software capability descriptions, not pretend active operations.
2. Flagship operational journey with four stages, active-state movement, connector animation, scroll visibility-aware play, pause control, keyboard navigation, reduced-motion alternative and 320px-safe mobile layout.
3. Hero CTA links to the interactive experience.
4. Scoped CSS motion layer built from existing Signal One tokens, plus written design-system authorisation for only this explanatory pattern.
5. Focused Playwright tests for step selection, arrow-key control, reduced-motion and 320/360/390/768/1440 overflow.
6. GitHub Actions QA workflow that runs lint, production build, full Playwright QA, generated-type checking, public-image OCR safety gate and four-viewport screenshot evidence.

## Product truth

- The digital journey is editorial explanation, explicitly not a live account or actual dashboard.
- Checkpoint QR/NFC records include time/GPS evidence and may be queued on the phone when offline.
- SOS still requires network coverage.
- Client records remain restricted to authorised sites, and live-map/client clock-in features are not represented as already available.
- No Guard Marketplace launch claims or externally PSiRA-verified badges.
- Never surface LEOS in public copy or pixels. No real customers or employees in screenshot/test records.

## Release gates

- [ ] Automated lint, build, type, OCR and browser QA all green on the final head.
- [ ] Inspect side-by-side viewport screenshots at 390, 768, 1440 and 1920, plus test 320, 360 and 2560.
- [ ] Review a real-browser animation recording on desktop, reduced-motion fallback and physical/low-end mobile.
- [ ] Confirm page performance after motion at mobile Lighthouse 90+, CLS <0.05 and p75 CWV targets where real data exists.
- [ ] Review all brand, copy and product claims against source systems.
- [ ] Obtain founder's visual approval on the preview. Only then consider merging/deploying production.

## Blockers to the full ATEX-exceeding experience

- Existing public Guard captures were withdrawn after failing public-image privacy/quality checks. Curated synthetic staging screenshots must be produced before any UI-led film/demo is implemented.
- Existing photo library remains illustrative AI-produced scenes. Approved documentary-quality South African photography is not yet supplied.
- Some exact manufacturer media assets (P30 Lite / SC780 / E600) are not cleared/available; never substitute the wrong model.
- The intake destination, mobile store URLs and any commercial price changes require independent validation.
- ATEX motion was benchmarked from page structure and public interactions, not frame-accurate browser recordings.

**Deployment policy:** Mission PR is draft. The preview uses a separate Railway service. Do not change production website, DNS or GUARD/admin repos as part of this branch without separate verification.
