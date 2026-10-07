# Design audit 2 — founder correction (2026-10-07)

Brief: `docs/FOUNDER_BRIEF_2026-10-07.md` (§1–§15, A0–A8). Baseline: `main` at f7f7e1e, measured with Playwright at 390, 768, 1440, 1920 and 2560 (`docs/qa/founder/before/`). Heights are CSS px of each top-level section.

## A. Desktop density failures

| Page @1920 | Total height | Worst sections |
| --- | --- | --- |
| Home | 10,455 | Problem + product proof 1,610; Equip 1,358 for three text rows; Prove 1,293 with a 101px-tall screenshot strip; next step 804 for three cards |
| Platform | 6,676 | Control room 1,266 |
| Radios & equipment | 5,019 | Catalogue 2,012 of typographic cards; quote 1,616 |
| Guards | 3,842 | Hero 760, on-shift 981 |
| Pricing | 4,040 | Calculator 932 |

Causes in code (`app/globals.css`):
- `.section` is 80 / 128 / **160px** padding, so every chapter boundary costs 320px of padding at ≥1280.
- At ≥1600, `.t-hero` jumps to `clamp(4.4rem, 3.4vw, 5.6rem)`, `.t-h2` to 4.25rem, `.t-h1` to 5.4rem, `.t-display` to 6.75rem and `.t-lead` to 1.5rem. Headlines wrap to 3–4 lines in a 5/12 column.
- `.split-hero --hero-col` goes from 38rem to 46rem at ≥1600, so the hero text column outgrows its content.
- `.wrap` stops at 1320px, so at 1920–2560 the content sits in a narrow band with 300–600px empty gutters while sections grow taller instead of wider.
- Home: the problem → product block stacks a 4-line H2, a question grid, a second H2 and a small product crop vertically.
- Home: Equip shows six product names in three thin rows across 1,358px.
- Home: Prove puts a 1150×101 proof-record strip inside a full browser frame.

## B. Image-quality failures (§5, A6)

Intrinsic widths: the hero is 1916, team briefing 1672, three photos are 1448, the control-room team is 1170, the checkpoint story image is 960, and the product crops are 426–1150.
- **PhotoBand (Hire, Run) upscales.** The 1448px photos are stretched full-bleed to 1920/2560 (1.33× / 1.77×). They are visibly soft at 2560.
- **The product proof crops are upscaled.** `control-room-desktop` is 570px wide and renders at 711px (1.25×). `ProductWindow` allows up to 1.25×.
- **The 2560 hero cover box is 1280×885.** The 1916px source covers it at about 1.0×, which is at the limit with nothing to spare. No ≥2560 source exists.
- **No rendered-vs-intrinsic check exists in QA.**

## C. Empty-space decisions (§1 A–F)

| Area | Decision |
| --- | --- |
| Section padding everywhere | (A) reduce: 80 / 104 / 120 |
| Problem → product block | (A) tighter, plus (B) product evidence once a clean capture exists |
| Hire band + text | (F) keep the photo but cap it at native width; (A) reduce the text block |
| Run | (D) keep the documentary photo; add the patrol story (§7) |
| Equip (home) | (C) a hardware rail with real manufacturer images |
| Prove | (A) remove the empty browser frame around the 101px strip |
| Next step | (A) reduce |
| Radios catalogue | (C) image-led hardware cards; quote form unchanged |
| 2560 gutters | (A) a wider wrap at ≥1600 (1440px) so content uses the width instead of the height |

## D. Real product screenshots available

`public/images/product-proof/crops/*` holds six crops from the test tenant. **All six fail the A1 OCR rules:**
- Control room: US-format dates "9/25/2026, 11:23:20 PM".
- People & access: `admin.demo@signalone.local` and `supervisor.demo@signalone.local`.
- Proof record: "Smoke prover guard" and a US-format date.

A1 is non-negotiable, so these crops cannot stay public. They are withdrawn from the site, and the OCR gate keeps them out.
- **Recapture is blocked.** Guard staging has no curated demo tenant: `apps/api/src/db/seed.mjs` and `smoke-companies.mjs` only. No `GUARD_CAPTURE_*` credentials are set in this environment.
- **Sales OS capture is blocked.** No non-production synthetic Sales OS environment is known and no `SALES_CAPTURE_*` is set.
- `scripts/capture-product.mjs` is ready for both once they exist.

## E. Hardware assets (§6, A5)

| Product | First-party source reachable | Status |
| --- | --- | --- |
| Hytera PNC360S | hytera.com/en product page (img-cdn.hytera.com) | Available |
| Hytera P30 Lite | hytera.com lists **P30**, not P30 Lite | Typographic card. P30 ≠ P30 Lite, and a different device must not appear under our label |
| Hytera SC780 | not on hytera.com/en or /eu (SC580/SC700/SC880 only) | Typographic card |
| Teltonika FMB920, FMC920 | wiki.teltonika-gps.com (official wiki). www.teltonika-gps.com is blocked by the egress proxy | Available from the wiki |
| E600 PoC LTE | no supplier documentation in any repo or doc | Typographic card: manufacturer unconfirmed |

Domains needed for the rest: hytera.co.za, hytera.ae, hytera-europe.com, store.hytera.com and www.teltonika-gps.com. All are unreachable from this environment.

## F. Glass-system proposal (§3)

Restrained, optical glass in a few places, never as whole-page cards. Tokens:
- **`.glass` (dark):** `rgb(21 26 33 / 0.62)`, `backdrop-filter: blur(16px) saturate(140%)`, 1px `white/10` border, a 1px inner top highlight and a soft shadow.
- **`.glass-light`:** white at 0.72 with a `line` border.

Placement:
- the sticky navigation;
- the hero information panel over the photograph;
- the product-window chrome;
- hardware cards on the rail;
- small status overlays on photo bands.

Mobile (<768px):
- Only the navigation keeps a small 8px blur.
- Every other glass surface becomes a solid 0.94–0.96 opacity surface with no backdrop filter, so layers never stack.
- `@supports not (backdrop-filter)` uses the same solid surfaces.
- `prefers-reduced-transparency` makes them opaque.

`docs/DESIGN_SYSTEM.md` departure (a) changes from "No glassmorphism" to this rule.

## G. Motion opportunities (§8)

- Patrol story steps reveal in sequence as they enter view (CSS only, IntersectionObserver class toggle).
- Hardware rail: scroll-snap with arrow controls; swipe on touch.
- A small live pulse on Pilot status pills.
- The existing tab transition on product proof.
- All of it is off under `prefers-reduced-motion`, and nothing moves behind body copy.

## H. Mobile constraints (§12, §13)

- Mobile is the stronger layout today; desktop token changes are scoped to ≥768/≥1280/≥1600 only.
- Check 390, 360 and 320 for overflow.
- At most one backdrop-filter in view (the nav).
- The hardware rail swipes natively with no JS scroll hijack.
- Images are lazy below the fold, and only the hero is `priority`.
- Lighthouse mobile on `/`, `/pricing` and `/radios-equipment` must stay ≥90 with CLS <0.05.

## I. Acquisition and download gaps (§10, A4)

- No store listing URL exists for Signal One Guard, so "Download Signal One Guard" renders only when `GUARD_APP_ANDROID_URL` / `GUARD_APP_IOS_URL` is set. Until then it is "Create your profile".
- Sales OS: a plain sign-in link on `/join/sales` only when `SALES_OS_URL` is set.
- Buying guard days online: no payment backend. "Talk to us to buy guard days" goes to /contact. The checkout contract is recorded as missing in `SITE_INTEGRATION.md`.
- Guard pricing is hard-coded as "R2" in about 15 places: copy, calculator, JSON-LD, metadata and OG text.

## J. Exact files, components and tokens to change

- `app/lib/pricing.ts` (new): price, currency, VAT, minimum, carry-over, effective date. Formatting helpers are used by `app/page.tsx`, `app/pricing/page.tsx`, `GuardDayCalculator.tsx`, `app/layout.tsx` JSON-LD and metadata, `app/lib/og.tsx` callers, landing pages and the solutions page. New QA price test.
- `app/globals.css`: `.section`, `.wrap` (≥1600), `.split-hero --hero-col`, the ≥1600 type block, and new `.glass`, `.glass-light` and `.reveal` utilities.
- `app/components/ui.tsx`: `Photo` and `PhotoBand` cap at intrinsic width; `SplitHero` gets an optional glass panel.
- `app/components/Header.tsx`: the glass navigation.
- `app/components/ProductProof.tsx` and `app/lib/productProof.ts`: views carry an `approved` flag; unapproved crops do not render.
- `app/components/Hardware.tsx` (new), `app/lib/catalogue.ts`: images and provenance; `app/radios-equipment/page.tsx`; home Equip.
- `app/components/PatrolStory.tsx` (new): home Run and the patrol landing page.
- `app/lib/acquisition.ts` (new): env-driven CTAs, used by `/guards`, `/guards/join` and `/join/sales`.
- `scripts/check-branding.mjs`: an OCR scan of `public/images/**`.
- Tests: pricing, image-scale and acquisition specs.
- Docs: `docs/DESIGN_SYSTEM.md`, `docs/ASSET_PROVENANCE.md` (new) and `SITE_INTEGRATION.md`.

---

## Outcome (branch `feat/founder-design-correction`)

| Step | Result |
| --- | --- |
| Pricing | `app/lib/pricing.ts` is the only source. `tests/e2e/pricing.spec.ts` fails on any stray guard-day price. **R2.50 pending founder confirmation**; R2.00 kept |
| Density / scale | Section 80/96/112. Calmer ≥1600 type. 1440px wrap at ≥1600. Hero photo capped at source size. Desktop pages are 8–14% shorter (home 10,455 → 9,637 at 1920; platform 6,676 → 5,790; pricing 4,040 → 3,521) |
| Image quality | `tests/e2e/image-scale.spec.ts`: no image renders above its source resolution at 1440/1920/2560 (all 17 routes) |
| Glass | Nav, hero information panel and photo-band overlays. Solid on mobile (nav only, lightly blurred), without support and under reduced transparency. `DESIGN_SYSTEM.md` rule changed |
| Hardware | Real Hytera PNC360S and Teltonika FMB920/FMC920 cut-outs; image-led catalogue; home hardware rail. Provenance in `docs/ASSET_PROVENANCE.md` |
| Patrol story | Physical action → digital event → control room → proof, on home and `/guard-patrol-software` |
| Product captures | OCR gate (`npm run check:images`, in QA). All six old crops failed it and were withdrawn |
| Motion | Sequenced rise (transform only) for the patrol story; rail controls. Off under reduced motion and below 640px |
| Acquisition | Store links only via `GUARD_APP_*_URL`; Sales OS only via `SALES_OS_URL`; "Talk to us to buy guard days" |

Evidence:
- **Screenshots:** `docs/qa/founder/after/` (320, 360, 390, 768, 1440, 1920 and 2560 for home, platform, pricing, radios & equipment, guards and sales careers). No horizontal overflow at any width.
- **Before/after pairs:** `docs/qa/founder/pairs/`.
- **Glass:** `glass-*` (normal, blur forced off, no backdrop-filter support), mobile and desktop.
- **Lighthouse mobile:** `docs/qa/founder/lighthouse/`. `/` 98, `/pricing` 98, `/radios-equipment` 99; CLS 0 on all three; accessibility 100.

## Blocked

- **Product capture (Guard):** Guard staging has no curated synthetic demo tenant (seed and smoke companies only), and no `GUARD_CAPTURE_*` credentials are in this environment. The site currently shows no product screenshots.
- **Product capture (Sales OS):** no non-production Sales OS environment with synthetic data is known, and no `SALES_CAPTURE_*` is set. Not captured, as A1 requires.
- **Manufacturer domains:** hytera.co.za, hytera.ae, hytera-europe.com, store.hytera.com, img-cdn.hytera.com and www.teltonika-gps.com are refused by the egress policy. P30 Lite and SC780 media were not found on the reachable Hytera pages.
- **E600:** the manufacturer is unconfirmed; no supplier documentation was found.
- **Store URLs:** no Signal One Guard listing exists yet, so `GUARD_APP_ANDROID_URL` / `GUARD_APP_IOS_URL` are unset.
- **Price:** R2.50 awaits founder confirmation.
- **Photography:** no source is ≥2560px. Every photo is display-capped at its native width (1170–1916px). A commissioned shoot is still needed (`docs/PHOTOGRAPHY_BRIEF.md`).
- **Checkout:** no payment backend or order contract exists.
