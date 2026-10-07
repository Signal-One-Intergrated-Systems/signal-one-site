SIGNAL ONE WEBSITE — FOUNDER DESIGN & PRODUCT REALITY CORRECTION (full brief + architect addendum, one message)

FIRST ACTION: save this entire message verbatim as docs/FOUNDER_BRIEF_2026-10-07.md and commit it on the new branch, so the brief is never lost again. Section numbers below (§1–§15, A1–A8) are the references.

==================================================
PART 1 — FOUNDER BRIEF
==================================================

ROLE
You are the dedicated architect and principal product/web designer for the Signal One public website. This is NOT a cosmetic redesign. Correct the website into a world-class, market-facing acquisition surface for Signal One Guard, Signal One hardware and the Signal One sales/recruitment ecosystem, while preserving the strong story already told. Work in signal-one-site. Read signal-one-guard and lancesat-enterprise-platform where needed (read-only).
Do not invent capabilities. Do not invent screenshots. No fake UI. Do not replace good existing storytelling just to look different.

SIGNAL ONE IS A TECHNOLOGY PLATFORM, NOT A GUARDING COMPANY
Officers, uniforms, vehicles and equipment belong to customers and stay generic/unbranded. Signal One branding belongs on software, dashboards, mobile apps, product UI, corporate sales material and the website. LEOS must never appear publicly (text OR pixels).

§1 AUDIT BEFORE CHANGING
Review every public route at 390, 768, 1024, 1440, 1920 and 2560. Mobile currently works much better than desktop.
Known desktop failures: excessive vertical gaps; sections too tall; oversized type at wide breakpoints; empty space with no information or visual purpose; some images stretched, soft or pixelated; photos asked to cover more area than their resolution allows; product evidence underused; hardware under-represented; the page feels like big blocks stacked vertically, not a refined, information-dense premium B2B experience.
Do not shrink every spacing token uniformly. Audit rhythm section by section. Every empty area must justify itself. For each, choose deliberately: (A) reduce the space, (B) add real product evidence, (C) add hardware, (D) add relevant documentary photography, (E) add subtle motion/interaction, (F) keep the breathing room because it improves hierarchy. No decorative filler.

§2 CORRECT THE DESKTOP SCALE SYSTEM
Contributors to the oversized feel (verify in code): .section reaches ~160px vertical padding at large desktop; .split-hero --hero-col reaches 46rem at 1600+; .t-hero jumps sharply at 1600+; .t-h2 ≈ 4.25rem; .t-lead ≈ 1.5rem; .wrap 1320px. None are sacred.
Target: premium, calm, sophisticated, substantial; not gigantic, not sparse, not landing-page-template scale. Adjacent content should visibly relate without scrolling through 150–300px of emptiness. Mobile must stay excellent; do not shrink mobile because desktop changes.

§3 RESTORE GLASS — CHANGE THE RULE, NOT JUST A COMPONENT
The design system currently forbids glass ("No glass, no glow, no grids"; "No glassmorphism" as an approved departure). That is no longer the founder's direction. Update docs/DESIGN_SYSTEM.md itself so future work does not strip it out again.
Use RESTRAINED GLASS: precision glass, premium software, slightly translucent optical surfaces, high-quality glass over real content. NOT 2023 glassmorphism, neon crypto UI, glowing sci-fi panels or blurry boxes everywhere.
Use it only where it improves hierarchy: selective screenshot framing, floating contextual controls, hero information panels, hardware cards, the sticky navigation, small status overlays, selective transition surfaces. Never turn whole pages into translucent cards.
Desktop: moderate backdrop blur and real translucent depth. Mobile: much less blur, higher-opacity surfaces, never several backdrop-filter layers at once, never hurt scrolling on low-end Android. Build a fallback that still looks premium with backdrop-filter reduced or disabled.

§4 REAL PRODUCT SCREENSHOTS AS A MAJOR VISUAL LANGUAGE
The site must visibly prove Signal One exists. Not notification-style snippets: actual screens. Use scripts/capture-product.mjs (2× captures of My operation, Control room, Proof of service, People & access, Guard mobile). Replace the temporary crops (ProductProof says they are temporary) once a curated demo tenant exists.
One believable synthetic South African security-company tenant: realistic company name, South African staff names, sites, posts, shifts, one or two genuine exceptions, normal patrol activity, one resolved SOS, plausible proof-of-service records. No "Smoke", "Test", raw enums, developer labels, fake phone numbers, obvious fixtures or dozens of identical incidents. Desktop and mobile captures.
GUARD screens wanted: operations/roster; control room; SOS handling; patrol/checkpoint activity; proof of service; people & access; site/post configuration; company admin; Guard mobile home; shift/clock state; patrol scan result; incident capture.
SALES OS screens wanted (subject to A1/A2): My Day; prospect queue; lead/account context; communications workspace; follow-up/work queue; quote builder; pipeline/commercial progression; rep mobile-responsive view.
Never fake these in Figma or HTML. They must come from the product.

§5 IMAGE QUALITY — ZERO UPSCALING
Audit every photo and screenshot. Current photo sources are only ~1170–1916px wide (older story images ~960px). Never upscale beyond native resolution. Never distort aspect ratio. Don't use CSS sizing to disguise weak sources. object-fit may crop, never distort. Desktop hero photography should ideally be ≥2560px on the long edge. Keep independent mobile crops and focal points. Use AVIF/WebP and Next Image srcsets. Keep source masters. Raise quality where needed so faces, uniforms and architecture don't smear. If a source is insufficient, replace it rather than enlarge it.

§6 HARDWARE MUST BE VISUAL
Signal One is an authorised/registered dealer/reseller of the products it presents (founder statement). The current equipment treatment is too text-heavy. Use genuine manufacturer/dealer-authorised imagery.
Products: Hytera P30 Lite, Hytera PNC360S, Hytera SC780 body camera; Teltonika FMB920, Teltonika FMC920; E600 (verify exact manufacturer/branding against supplier documentation before publishing any image).
Sources: official Hytera product/media pages (P30 Lite PoC Radio, PNC360S Mini PoC Radio, SC780 Smart 4G Body Camera); official Teltonika Telematics pages (FMB920, FMC920). No retailer thumbnails when first-party media exists. Never alter manufacturer logos, invent variants, or show a different device under our label.
Presentation: premium enterprise hardware merchandising. Clean cut-out, controlled whitespace, exact product name, what it does, relationship to Signal One, rental/quote status, clear CTA. Multi-angle where media allows. Where it fits, pair the real device with a real Signal One screen (e.g. P30 Lite beside the real patrol/control screen), with a restrained glass layer connecting device to workflow.

§7 NFC / PATROL VISUAL STORY
Show how physical operations become digital evidence: NFC checkpoint interaction, QR scanning, guard phone near a checkpoint tag, radio NFC use where applicable, GPS position, supervisor/control-room response, final proof of service. Hytera markets P30 Lite Smart Patrol (NFC check-in, GPS tracking, patrol reporting); use such manufacturer-supported visuals where authorised. For Guard smartphone patrols, use a real documentary environment with the screen facing the viewer, or composite an ACTUAL Signal One screen. Never invent a fake interface inside a lifestyle photo.
The story: PHYSICAL ACTION → DIGITAL EVENT → CONTROL ROOM → PROOF. (Officer scans NFC/QR → Guard records the checkpoint → control room sees the patrol → the client's proof-of-service record shows completion.)

§8 MOTION TO EXPLAIN, NOT DECORATE
Allowed: screenshot transitions; a horizontal hardware rail with controlled movement; subtle scroll-linked reveal of the patrol workflow; the checkpoint → event → proof sequence; a screenshot carousel that changes with the copy; gentle parallax of foreground hardware against a real environment; small live status/pulse indicators; restrained transitions between system surfaces.
Not allowed: floating shapes, particles, autoplay background video everywhere, heavy parallax, constant movement behind body copy. Respect prefers-reduced-motion; simplify or remove non-essential motion on small phones.

§9 MORE DENSITY, NOT MORE TEXT
Keep the narrative WIN → HIRE → RUN → EQUIP → PROVE and enrich each chapter visually.
- WIN: real Sales OS / growth context (see A2 for framing).
- HIRE: Guard Marketplace clearly "MVP in development"; never imply it is live.
- RUN: real Guard screens + operational photography.
- EQUIP: real radios, trackers, body cameras.
- PROVE: real proof-of-service screen + a credible customer/account-manager visual.
The visitor should repeatedly see REAL WORLD + REAL SIGNAL ONE PRODUCT together, not either alone.

§10 THE WEBSITE IS THE COMMERCIAL FRONT DOOR
Security company: discover Guard, see real software, understand Guard Days, calculate price, eventually buy Guard Days online, talk to Sales, see hardware, start onboarding, open the right product.
Security officer: understand Guard, create a profile, download Signal One Guard, continue in the app.
Sales representative: learn about the role, apply, and once hired open/install Sales OS. Existing reps get an obvious "Open Sales OS / Install Sales OS". Guards get "Download Signal One Guard". Never expose internal access before the correct onboarding state. (Constraints in A4.)

§11 FIX THE PRICING SOURCE BEFORE ANY CAMPAIGN
R2 per Guard Day is hard-coded in several places. The current commercial direction is R2.50, but do NOT search/replace. First centralise Guard Day pricing into one authoritative source feeding the homepage, pricing page, calculator, metadata, structured data, worked examples and any future checkout. Update the value only after the founder confirms. There must never again be several independent hard-coded prices. (Cross-repo note in A3.)

§12 DO NOT DESTROY MOBILE
Check every desktop change at 390, 360 and 320 where practical. Glass degrades gracefully, motion simplifies, hardware galleries swipe naturally, screenshots stay legible, no horizontal overflow, no desktop type rules leaking down.

§13 PERFORMANCE BUDGET
Responsive images; lazy-load below the fold; preload only the true LCP; never send a full-resolution 4K image to a 390px phone; no stacked high-blur glass on mobile; video only where it adds real value; compressed product assets without visible loss; zero CLS. Keep current accessibility quality.

§14 PRODUCT IMAGE RIGHTS / PROVENANCE
Use manufacturer-authorised assets. For every hardware image record: product, manufacturer, source, date retrieved, usage basis/dealer permission. Never use unrelated third-party imagery found through search.

§15 REQUIRED OUTPUT BEFORE IMPLEMENTING
First a short architecture/design audit (docs/DESIGN_AUDIT_2.md):
A desktop density failures · B image-quality failures · C empty-space opportunities · D real product screenshots available · E hardware assets available/missing · F glass-system proposal · G motion opportunities · H mobile constraints · I acquisition/download gaps · J exact files, components and tokens to change.
Then implement. Final evidence at 390, 768, 1440, 1920 and 2560 for home, platform, pricing, radios/equipment, guards and sales careers, plus before/after pairs for the major desktop sections.

SUCCESS STANDARD
It must feel like a billion-dollar B2B technology company serving real South African security businesses. Not AI-generated, oversized, sparse, template-driven, a guarding company, generic glassmorphism, or a pile of marketing cards. One integrated system where real operations, real software and real hardware visibly connect. Optimise for credibility, product proof, visual rhythm, conversion and trust, not novelty.

==================================================
PART 2 — ARCHITECT ADDENDUM (overrides Part 1 wherever they conflict)
==================================================

A0 BRANCH AND ORDER
- Branch feat/founder-design-correction from main (f7f7e1e). One PR; do not merge.
- Commit 1: docs/FOUNDER_BRIEF_2026-10-07.md (this message). Commit 2: docs/DESIGN_AUDIT_2.md (§15 A–J).
- Then implement in this order, one commit each with `npm run qa` green: pricing centralisation → density/scale → glass system (incl. DESIGN_SYSTEM.md rule change) → hardware → patrol story → product captures → motion → acquisition CTAs. Update tests where behaviour changes intentionally.
- Never touch Railway, DNS, deployed env vars, production databases, or other repos' code.

A1 PRODUCT CAPTURE SAFETY (non-negotiable)
- Capture ONLY from non-production environments seeded with synthetic data: Guard staging (curated demo tenant) and a non-production Sales OS environment.
- If no non-production Sales OS environment with synthetic data exists, do NOT capture Sales OS. Never use production; never use rep.test on production; never show any real client, person, phone, email or amount. Report it as blocked.
- Inspect every screenshot by eye AND run OCR (e.g. tesseract) before committing. Reject on: "LEOS" (any case), real company/client names, "Smoke", "Test", "QA", ".local", raw enum codes, real phone numbers, US-format dates.
- Add the OCR scan to the branding gate for public/images/** going forward.
- Credentials only from env (GUARD_CAPTURE_URL/USER/PASS, SALES_CAPTURE_URL/USER/PASS). Never commit or log them.
- If Guard staging does not yet have the curated "Smoke-free" demo tenant, do everything else first, keep the current clean crops, and report capture status.

A2 SALES OS POSITIONING
Sales OS is Signal One's INTERNAL operating system for its own reps. It may appear (a) on /join/sales (what you'll work in) and (b) in WIN only framed as "how Signal One's team works with you" (consultation, quotes, follow-up). Never imply customers receive Sales OS or that it is part of Guard-day pricing.

A3 PRICING
- One source: app/lib/pricing.ts with guard-day price, currency, VAT rate, minimum guard days, carry-over rule, effective date. Every price mention (copy, calculator, worked examples, metadata, JSON-LD, OG images, tests) reads from it.
- Add a QA test that fails if any rendered page shows a guard-day price string not produced by this module.
- Keep the value at R2.00 until the founder confirms. Make the change a one-line edit, and mark it in the PR as "R2.50 pending founder confirmation".
- Record in SITE_INTEGRATION.md that Sales OS and Admin hold their own price books in other repos and must be aligned separately. No cross-repo coupling.

A4 ACQUISITION CTAs
- "Download Signal One Guard" renders only when a real store URL is set (GUARD_APP_ANDROID_URL / GUARD_APP_IOS_URL). Otherwise "Create your profile" only. Never a placeholder link.
- "Open / Install Sales OS" only via env SALES_OS_URL, as a plain sign-in link on /join/sales.
- No checkout UI (no payment backend). At most "Talk to us to buy guard days"; record the missing contract.
- Guard status stays GUARD_STATUS-driven (pilot default). Nothing may say "Live" for Guard.

A5 HARDWARE ASSETS
- First-party manufacturer media only (Hytera, Teltonika official sites/media kits).
- E600: confirm the manufacturer from supplier documentation before using any image; otherwise keep a typographic card and say why.
- docs/ASSET_PROVENANCE.md: product, manufacturer, source URL, date retrieved, usage basis ("authorised dealer — founder-confirmed" plus any manufacturer terms found).
- If manufacturer domains are unreachable from this environment, stop that step, list the exact domains needed, and continue with the rest.

A6 PHOTOGRAPHY
- No raster may render above its native width × device-pixel-ratio budget. Current photos (max ~1916px) are display-capped, not stretched. Add a QA check comparing rendered vs intrinsic size for every <img> at 1440, 1920 and 2560.
- Generate no new AI imagery. Compositing a REAL Signal One screenshot into a supplied photo is allowed only with honest screen geometry, captioned "Illustrative scene · real Signal One screen".

A7 TRUTH CONSTRAINTS STILL BIND
Marketplace "MVP in development", no present tense. PSiRA recorded, never "verified". SOS needs a mobile signal; offline wording exactly as on main. "Central Device". No LEOS in text or pixels. Equipment by quote; no prices, stock or delivery dates.

A8 EVIDENCE AND REPORT
- Screenshots per §15, plus 360 and 320 mobile checks.
- Lighthouse mobile on /, /pricing and /radios-equipment stays ≥90 performance with CLS <0.05. Include a backdrop-filter-disabled mobile screenshot proving the glass fallback.
- Final report: verdict first, max 15 lines, then a blocked-items list (capture environments, manufacturer domains, store URLs, price confirmation, photography).
