# Signal Connect V3 — Clean Rebuild Specification
**Status:** APPROVED CONCEPT; NEW IMPLEMENTATION NOT YET WRITTEN
**Created:** 2026-10-23
**Owner:** Signal One Integrated Systems
**First founder profile:** Andisiwe Satshwa — **Founder** (not Co-Founder)
**Base:** `main` at `c68d96604441bace329f0494bcddf2385b5745d5`
**Scope:** fresh application architecture. NO CSS/HTML/JS copy from previous Signal Connect prototype or from branch `feat/signal-connect-andisiwe-20261023`.
**Experience update (SC-UX-001):** connection-first identity card and immediate contact saving, with optional story and voluntary reverse exchange; documented in `docs/SIGNAL_CONNECT_V3_EXPERIENCE_ARCHITECTURE.md`.

## 0. The reset contract
1. This is a source rebuild, **not** a CSS patch or visual reskin.
2. Do not modify `main` or the existing production website in an unreviewed change.
3. Freeze old Signal Connect implementation as history. Treat old PR #27 as superseded (not a source file).
4. Preserve the brand narrative, journey, privacy requirements, founder identity and genuine product imagery.
5. Do not copy single-file HTML, prototype-generated CSS, dynamically injected HTML, old Vercel file manifests or previous hand-written SVG QR markup.
6. One definition per component and property. No new layer of arbitrary `!important` overrides. No inline marketing style hacks.
7. Full source-controlled deployment: builds from a reproducible tagged Git commit; no manual assembled deployments in the final release.
8. New PWA must render as an application, not as a simulated phone UI inside a webpage.
9. The existing independent live Vercel deployment stays unchanged until replacement passes launch gates. Do not remove its stable URL prematurely.
10. No false lead-capture success and no automatic copying of visitors' personal data to third-party endpoints.

## 1. Authority / sources
These existing documents and components are canonical; they are read from **main** and reconciled during development:
- `docs/DESIGN_SYSTEM.md` — Signal One website tokens, Inter, glass discipline, minimum type sizes, motion.
- `docs/BRAND.md` — exact rings, logo spacing, descriptor, pulse.
- `app/globals.css` and `app/components/ui.tsx` — real implemented primitives.
- `app/components/brand/SignalOneLogo.tsx` and `SignalOneMark.tsx`.
- `docs/FOUNDER_BRIEF_2026-10-07.md` — product truth and visual quality.
- `docs/ASSET_PROVENANCE.md` and `docs/PHOTOGRAPHY_BRIEF.md`.
- Enterprise: `lancesat-enterprise-platform/docs/architecture/LEOS_EXPERIENCE_STANDARD.md`, and `docs/SALES_OS_DESIGN_CHARTER.md` for cross-product experience and connection to Sales OS.

**Do not copy these instructions into a new competing design system.** Connect's application can import shared code where practical, or enforce a verified, versioned brand adapter pending a shared-package extraction. Marketing site styling always wins over a local variation when they conflict.

## 2. Delivery topology (preferred)
- Build a **dedicated, source-controlled Next.js/React/TypeScript PWA** under `signal-connect/` in this repository, deployed as a separate Vercel project with `rootDirectory=signal-connect`. This isolates immersive UX from the website's global Header/Footer without risky global route-group migrations.
- Keep a clean, audited brand adapter that follows canonical logo/font/tokens. In a later non-breaking migration, factor shared brand primitives into `packages/brand-ui/` and import from both site and Connect.
- Reuse Vercel only for hosting until an approved backend data store and notification path are available. No Railway dependency.
- No service or runtime package additions without a short ADR documenting why; use native platform APIs wherever possible.

Suggested package tree (to be refined in implementation):
```text
signal-connect/
  app/
    layout.tsx
    connect/[profile]/page.tsx
    present/[profile]/page.tsx
    api/introductions/route.ts
    manifest.ts
  components/
    ConnectHeader.tsx
    FounderPresenter.tsx
    SignalStory.tsx
    ProductInterestSelector.tsx
    IntroductionForm.tsx
    ContactExchange.tsx
  lib/
    profiles.ts
    interests.ts
    schemas.ts
    qr.ts
    vcard.ts
  styles/
    tokens.css
    connect.module.css
  public/
    media/story/
    media/hardware/
    icon.png
    apple-icon.png
  tests/
    interaction.spec.ts
    visual.spec.ts
    a11y.spec.ts
```

## 3. Non-negotiable design system contract
- **Font:** Inter only; load through Next's `next/font` with the same deployment behavior as the website. Browser fallback must be deliberate, not accidental.
- **Colours:** Use `#0EA5E9` primary, `#38BDF8` dark-surface accents, `#0A0D12` abyss, `#0F131A` deep, `#151A21` base, `#1C222B` raised, `#F1F5F9` primary inverse text, `#CBD5E1` secondary inverse, `#94A3B8` tertiary inverse; take other values directly from canonical source.
- **Logo:** Import/reproduce exactly: three rings with prescribed stroke widths and radius. Mark:wordmark ratio **1.6:1**, gap **12px**, descriptor tracking **0.42em**, 10px minimum in header and 11px in footer, correct full name **Signal One Integrated Systems**. Pulse only on header mark; 2.8s and off on reduced motion.
- **Typography:** meaningful text **>=14px**; body around 17px, input font 17px; labels 15px, headings 700. No all-caps section labels or monospace UI text apart from canonical brand lockup. Do not use generic AI/futuristic typography.
- **Radii:** buttons/controls `--radius-ui:10px`, cards `--radius-card:14px`, frames `--radius-frame:12px`; exceptions must be clearly justified and tested. **Never nested visible rounded frames** inside the story card.
- **Buttons:** primary signal blue solid fill with dark text; minimum 48px, strong focus ring, no neon, no floating hover lift/glow. Secondary is the site's ghost-on-dark style. Do not make unrelated elements look like buttons.
- **Glass:** precision glass only when it sits above actual photo/product content or controls. On mobile use high-opacity surfaces, no stacked blurs; low-end Android performance budget matters. **Zero translucent cards over flat colour just for decoration.**
- **Motion:** pulse 2.8s on header, standard entrance with canonical ease; transitions on transform/opacity only. Respect reduced motion. No hover-only interactions needed on a phone.
- **Accessibility:** WCAG AA contrast, minimum touch targets 44x44 (primary 48+), visible keyboard focus, form validation attached to fields, correctly tagged success/errors, no motion-only explanation.
- **No duplicated theme tokens:** no isolated custom palettes, no CSS overrides cascade pile, no `!important` except a documented global accessibility/reset case with review approval.

## 4. Approved user journey (two distinct experiences)
### Founder presenter
1. Andisiwe launches installed app from iPhone Home Screen.
2. A finite brand reveal, not a blocking splash sequence.
3. Immediately visible **large local/generated QR** and "Andisiwe Satshwa · Founder · Signal One Integrated Systems".
4. Optional one-tap copy link, share sheet and contact/website details (only approved public details).
5. Presentation mode is read-only; accidental touch must not navigate into the visitor form.
6. Source profile routes are distinct: `/present/andisiwe` for the installed app; `/connect/andisiwe` for QR visitor. Older QR paths should redirect when migration is complete.

### Visitor — updated identity-first flow (SC-UX-001)
1. Scans with any phone camera and opens `/connect/andisiwe` — **never** the presenter's `/present/andisiwe` view; no installation or registration required.
2. Sees Andisiwe Satshwa, **Founder**, Signal One Integrated Systems, brand lockup and immediate **Save Andisiwe's contact** CTA.
3. Saving the public vCard is independent of every form, story chapter or reverse-contact exchange. Visitor controls whether the phone imports it.
4. Sees distinct optional choices: **Share my details** (explicit consent, honest manual email alternative until durable intake exists) and **Discover Signal One** (five-chapter story). Site visit is tertiary.
5. Story is always skippable or exit-able: **WIN → HIRE → RUN → EQUIP → PROVE**. One continuous story panel, locally bundled imagery and verified hardware. Exit always returns to the contact-first view.
6. A later exchange form requests name and email OR phone, with optional company, interests and notes, explicit reply consent and a separate default-off marketing checkbox.
7. On server-confirmed durable write only, say the introduction was received; if receiver unavailable, no false success, with explicitly user-sent email fallback. No passive contact capture.
8. QR, share/copy and visitor link all derive from one validated, allowlisted HTTPS origin; never from incoming Host header or third-party QR services.

**Implementation authority:** `docs/SIGNAL_CONNECT_V3_EXPERIENCE_ARCHITECTURE.md` and `docs/SIGNAL_CONNECT_V3_SURGICAL_EXECUTION_PLAN.md`. These supersede earlier story-first ordering without altering the five original story chapters.

### Approved interest options
Guard operations platform; PTT radios & communications; Body-worn cameras; Vehicle & asset tracking; SOS & response workflows; SIMs & connectivity; Guard Marketplace (in development); Complete integrated solution.
Do not claim in-development offerings are live or integrated.

## 5. Narrative and photography
- Preserve chapters and the core short-story structure; editorial copy can be adjusted only for readability, accuracy and verified product status.
- Use bundled, image-optimized original/provenance-listed photographic assets from `public/images/photo` and `public/images/story`, no broken external URLs. Prefer high-resolution real-world documentary aesthetics, with believable South African security contexts.
- Illustrative people are **not** represented as Signal One staff/customers.
- EQUIP uses real first-party manufacturer images, with original manufacturer logos left intact. Existing verified sources: Hytera PNC360S, Teltonika FMC920. Do not show unsupported model substitutions or invent product renders.
- RUN/PROVE can include **real platform screenshots** only if sourced from approved, non-sensitive demo/staging with safe synthetic data and an accurate product-status label. No fake dashboard images.
- One focal point per chapter; avoid an artificial collage or overcrowded mini-device strip.
- No image may be rendered above its native resolution.

## 6. Contact and lead-capture architecture
- Founder profile schema is typed, server-authoritative and extensible to other representatives. No hard-coded private contact information.
- Generate QR **inside the app build/runtime**, not via an external QR service. Use immutable HTTPS visitor URL from a single route resolver; use a stable public URL and verify scan success on iOS/Android.
- Server-generated vCard should contain **Andisiwe Satshwa**, **Founder**, **Signal One Integrated Systems**, public approved email/website. Include direct phone only after explicit approval; contact import remains user-controlled.
- Create an isolated `POST /api/introductions` endpoint with schema validation, size limits, abuse/rate controls, request ID, consent timestamp, source attribution, presenter ID and idempotency/deduplication.
- Durable storage or a verified notification receiver **must** acknowledge before returning HTTP 2xx. No "success" after a simulated response, client-local storage, or unacknowledged email.
- Do not expose any Sales OS admin token/browser credentials. Sales OS integration is server-to-server only and gated by end-to-end evidence that lead is created/updated correctly.
- Privacy notice must be live and accurate. Separate marketing consent, default off. Do not cache PII in service worker or analytics; retention policy and ownership must be documented.
- Phase 1 may launch as **contact exchange + mailto fallback** if durable intake is still unavailable, but the form must not masquerade as operational lead capture.

## 7. PWA and offline requirements
- Manifest `display=standalone`, branded static full-bleed icon, start URL `/present/andisiwe`, correct scope, secure HTTPS origin.
- Service worker precaches only app shell, brand assets and presenter QR. It must use versioned caches and purge old caches.
- No stale success states or offline form queue unless a robust outbox is explicitly implemented; offline form requests receive truthful recovery copy.
- Existing install should update without requiring routine uninstall/reinstall.
- Real mobile layout; **do not render an artificial device frame** on the actual device.
- Respect iPhone dynamic island/safe area, Safari and Android Chrome viewport differences.

## 8. QA and release gates (not optional)
Build on a **new preview** from GitHub, never by uploading assembled HTML directly to production. Require:
- Typecheck, ESLint, `npm run build`, e2e Playwright, accessibility check, no console/runtime errors.
- Visual screenshots at 320, 360, 390, 430, 768, 1024, 1440; iPhone Safari + Android Chrome real-device smoke.
- Real font loaded and verified as Inter; 14px minimum meaningful text; no unexpected horizontal overflow, clipped CTAs or unsafe-area overlaps.
- Every photograph and hardware image HTTP 200, correct MIME, native-resolution constraint, no external asset dependency.
- QR camera test on two devices; presenter URL cannot leak into visitor QR; test one contact import on iOS and Android.
- Contrast >=4.5:1 for body text; visible focus ring; 44px targets; reduced motion; no excessive GPU backdrops.
- Submission: both accepted persistent write and failed write tested. Absolutely no false success. Verified source attribution, consent and dedupe where backend exists.
- Visual sign-off compares to actual canonical Signal One website/product system, not an assistant-created artistic reference.
- Review preview before production promotion. Preserve prior deployment as rollback until sign-off.

## 9. Sequence / milestones — surgical execution gates

**Execution 01 (complete):** isolated Next.js/TypeScript foundation, canonical Inter and logo, typed founder profile, vCard and baseline CI. Do not regress this foundation.

**Execution 02 (ordered 02A → 02B → 02C → 02D):** validate immutable URL/origin; generate locally scannable QR; build real presenter share/copy; deliver recipient identity-first Save Contact view. Each sub-step requires independent unit/browser QA before the next.

**Execution 03 (03A → 03B):** lock licensed/provenance-verified five-scene photography and factual chapter copy; then build the optional story, one-image/one-surface, with accessible navigation and reduced motion.

**Execution 04 (04A → 04B):** honest optional reverse exchange/email first; only later add durable lead storage with verified Sales OS server-to-server integration. No simulated success.

**Execution 05 (later):** Wallet signing, NFC physical distribution, team provisioning. Wallet is not a PWA capability.

**Release:** GitHub CI, real iPhone/Android scan/contact/standalone testing, screenshot acceptance, verified stable origin and source-controlled Vercel deployment. V2 remains rollback/reference.

**Strict file boundaries and acceptance tests:** see `docs/SIGNAL_CONNECT_V3_SURGICAL_EXECUTION_PLAN.md`.

## 10. Implementation boundaries
- No user data collection or production deploy until endpoint verification.
- No merge of previous PR #27.
- No release if noncanonical font or brand lockup is discovered.
- No hiding technical debt with more CSS.
- Keep founder title **Founder**, not Co-Founder.
- Live V2 is a rollback/reference only, NOT the implementation baseline.
