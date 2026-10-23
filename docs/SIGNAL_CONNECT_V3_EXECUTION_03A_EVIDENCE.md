# Signal Connect V3 — Execution 03A Evidence and Handover

**Date:** 2026-10-23
**Execution:** 03A — audited reference media, factual editorial freeze, automated integrity gate
**Source commit tested:** `51382a2ae60c1ede7bfe25621becb6b2f5165a21`
**CI:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/actions/runs/39973299406
**CI result:** **SUCCESS** (unit tests, lint, build, TypeScript, **34 Playwright Chromium tests**, independent ZBar QR decode, screenshot artifact upload).
**CI screenshots:** GitHub Actions artifact `signal-connect-foundation-evidence`, ID `12508799868`.
**Narrative and media matrix:** `docs/SIGNAL_CONNECT_V3_STORY_ASSETS.md`
**Exact typed story script:** `signal-connect/lib/story.ts`
**MEDIA RELEASE GATE:** **RED** — public premium story NOT approved.

## Implemented

1. Audited existing canonical photo, story and hardware directories against documentary and provenance briefs. All four scene photographs selected for internal references are AI-generated fictional scenes, not real South African documentary material, as explicitly documented in the canonical `docs/PHOTOGRAPHY_BRIEF.md`.
2. Pinned six source-identical WebP image binaries as Git blobs in the V3 subtree: four **non-public** illustrative references under `assets/story/reference/` plus Hytera PNC360S and Teltonika FMC920 original manufacturer visuals under `public/media/hardware/`. The binaries were copied by Git SHA, without re-encoding or upscaling.
3. Audited original WebP native resolutions, file sizes and intended chapter fit. Key source limitations: RUN checkpoint only 960×540; WIN image depicts radio briefing, not sales; HIRE depicts a logistics gate, not recruitment; PROVE depicts a fictional control room with imagined screens, not a real Guard report.
4. Independently confirmed source-of-truth `app/lib/productProof.ts` has **no approved proof screenshots** (`shots: []` after the old demo-capture gate failed). Never resurrect retired crops or substitute a made-up dashboard.
5. Froze five concise chapter headlines, body text, limitations and final-alt-text intentions in `lib/story.ts`. Media states are explicit: WIN/HIRE/RUN/PROVE `blocked`; EQUIP `manufacturer-conditional`; all `approvedMediaPath: null`, so `publicStoryMediaApproved = false`. Guard/Sales OS staged/in-development status and Marketplace/connected hardware integration caveats are preserved.
6. Wrote `docs/SIGNAL_CONNECT_V3_STORY_ASSETS.md` with all image dimensions, upstream source paths, media-status decisions, four specific replacement shoot briefs, use restrictions, product truth verification and responsive framing requirements.
7. Added `tests/story-assets.test.mjs` that verifies **all six original byte arrays**, exact native dimensions, sizes, source fidelity and non-public location of AI reference media. Tests block premature approval and check the visitor screen continues to say Coming soon.

## Verified passing checks

GitHub Actions run `39973299406` completed successfully at commit `51382a2`:
- `npm ci` — success
- `npm test` including six new image-provenance/source-integrity tests, plus editorial gate assertions — success
- `npm run lint` — success
- `npm run build` — success
- `npm run typecheck` — success
- `npx playwright test` — **34 passed (22.0s)**
- Independent ZBar QR-image scanner — correct visitor link `https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe`
- Test report/screenshot artifact upload — success

## Scope boundaries

- **No story route, public story imagery, interactive transitions, CSS changes, vCard alterations, QR changes, PWA changes or contact/lead collection.**
- Existing V3 preview remains the previously approved **02D visitor/presenter implementation**; no Vercel deployment was performed for 03A because it has no approved public visual change.
- Existing V2 and production website untouched.
- No final model/property releases or documented manufacturer media-kit licence terms exist in available repo. Founder-reported reseller rights were documented previously but must not be misrepresented as a separate media reproduction licence.

## Remaining prerequisites — do not bypass

1. **WIN:** commissioned real sales representative/security-company decision-maker conversation, with releases, authentic South African setting and no fake Sales OS screen.
2. **HIRE:** real supervisor/team onboarding/briefing; do not imply Guard Marketplace is already live.
3. **RUN:** commissioned real guard phone-to-checkpoint photo (2560px master, mobile 4:5 crop), and if displayed alongside software, an actual safe synthetic Guard screenshot.
4. **EQUIP:** written confirmation or approved vendor terms for use of PNC360S/FMC920 images; verify model and presentation constraints. Real device-in-use shoot is preferred if the chapter is a photo-led story.
5. **PROVE:** commission site/client-review photo and recapture a genuine, unaltered Guard proof-of-service screen from a clean, curated synthetic staging tenant. Prior screenshots were rejected.
6. Verify rights/release documents, image subject authenticity, dimensions, device model identities and native rescaling on real iPhone and Android. Only then set **approved** media paths in a separate reviewed commit and advance to 03B story implementation.

**Decision:** editorial preparation and reference-media integrity are complete, but the phase's final image suitability/rights acceptance **cannot pass** with available materials. This is a **transparent dependency**, not a failure to run CI. Do not deploy a polished but misleading story to satisfy a schedule.
