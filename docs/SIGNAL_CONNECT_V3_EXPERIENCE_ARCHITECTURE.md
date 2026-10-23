# Signal Connect V3 — Experience Architecture and Premium Quality Standard

**Decision record:** SC-UX-001 · 23 October 2026 · **Proposed implementation baseline**
**Applies to:** `signal-connect/` on `rebuild/signal-connect-v3-clean-20261023`
**Historical references only:** Superseded V1/V2 HTML and PR #27. **Never copy their CSS, HTML or animation code.**

## Executive decision

**Connection first → discovery by choice → conversion with consent.**

Digital-card benchmark:
- Blinq: lowest friction recipient save.
- HiHello: clear identity and multiple share paths.
- Popl: attributable exchange into a contact workflow.
- Mobilo: situational presenter/recipient modes.
- V1CE: tangible sense of craftsmanship, not a licence to simulate metallic UI.
- Wave: recipients should not install anything.
These are product patterns, not pixel, motion, branding or code licences.

**Success moment:** Someone meets Andisiwe, scans an actual QR, recognises Andisiwe's name/title, and saves the contact without signup, form, story or app installation. The optional reverse exchange has its own separate explicit consent.

The story remains strategically important: WIN → HIRE → RUN → EQUIP → PROVE. It must be accessible in **one tap** from the recipient card, not placed before basic contact-saving.

## 1. Two different users and three different jobs

### Presenter, on Andisiwe's own iPhone
- Launch `/present/andisiwe` from the Home Screen; show **Andisiwe Satshwa · Founder** and large scannable QR immediately; no blocking animation or staged reveal.
- Visible secondary controls: **Share link** and **Copy link**. Optional preview of the recipient view. No enquiry form on presenter.
- QR encodes **visitor** `/connect/andisiwe`, never `/present/andisiwe`, never an installation URL, and never a third-party QR endpoint.
- If URL config isn't verified: do not render plausible but unscannable modules. Display **“Sharing link not configured”** as an explicit noninteractive state while retaining vCard/website access.
- Portrait: only if an approved real portrait is supplied, sourced, and cropped. No fictional founder portrait.

### Visitor after scanning (NO installation or authentication)
1. **Identity and action:** Signal One lockup, Andisiwe Satshwa, Founder, company, brief introduction, **Save Andisiwe's contact** as the primary action, all visible in first viewport where possible.
2. **Two secondary choices:** **Share my details** (optional, contact-exchange flow) and **Discover Signal One** (optional story). A lower-emphasis **Visit website** can remain.
3. **Saving contact** uses existing server-generated VCF route. Never gate behind any exchange; no permission prompts for access to the recipient's contacts.
4. **Exchange:** if chosen, disclose what will be requested and how used; no automatic background contact read; require explicit contact consent. If no durable receiver, show **“Send details by email”** workflow with user-controlled mail app, never claim a stored lead.
5. **Discovery:** run editorial chapter flow, not a wall of cards or a carousel containing mini cards.
6. **Return:** from any chapter go back to the same visitor card with Save Contact remaining visible. Do not lose user context, focus or scroll unexpectedly.

### Signal One follow-up
- When an authenticated server-side durable destination exists, create or deduplicate a Sales OS relationship with presenter ID, source, consent timestamp, interests and optional context; report success only after a confirmed write.
- Until then, the experience remains a **contact-exchange PWA** with explicitly manual, user-sent email fallback.
- No free-floating public client-side Sales OS credentials, artificial “connected” state, background form submission or inferred consent.

## 2. Exact information hierarchy and composition

### Presenter `/present/andisiwe`
1. **Brand header**: canonical lockup only, one 2.8s logo pulse; no decorative background pulse.
2. **Identity**: Andisiwe Satshwa (h1); Founder; Signal One Integrated Systems. Inter 700 heading, body 17px.
3. **QR**: white/near-white square background, dark modules, mandatory **four-module quiet zone**. Crisp integer pixel rendering and sufficient size for a second phone (~220–280 CSS px on common iPhones; adjust to viewport without clipping). No overlay logo/photograph or animated QR.
4. **Affordance**: “Scan to connect”, visually adjacent to the code; **Share link**, **Copy link** beneath it.
5. **Public actions**: Save contact, visit website if needed; never hide or duplicate the primary function under a second decorative panel.

### Visitor `/connect/andisiwe`
1. Existing canonical Signal One logo, no separate design system.
2. Founder identity and context, one short trusted sentence.
3. **Primary CTA first**: Save Andisiwe's contact.
4. **Two obvious secondary CTAs**: Share my details; Discover Signal One.
5. Website link and honest “No details are collected by simply viewing this page” copy, if true.
6. Optional portrait/art belongs to identity band, never as a blurred background that makes typography illegible.

### Optional `/connect/andisiwe/story` or client-side route state
- Five ordered chapters WIN/HIRE/RUN/EQUIP/PROVE.
- On each: progress label, **one actual photograph/product shot** integrated flush with **one** card surface, headline, ~1-2 clear sentences, Back/Next and Exit to contact.
- If there is no correctly licensed/local asset, use a deliberate neutral media treatment and document as blocked. Never broken `<img>` or invented UI/device.
- Progress must remain usable via explicit buttons; swipe may assist, never replace them. Focus moves to new chapter heading for keyboard/screen-reader users.
- Product truths: Guard status, radios/bodycams/tracking availability and “coming soon” distinctions must follow canonical source.
- Image rules: local, provenance-reviewed, responsive and optimized; avoid upscaling original resolution, no remote hotlinks, no faces of invented employees or customers.

## 3. The only permitted visual language

**Source of truth (immutable for this execution):** `docs/DESIGN_SYSTEM.md`, `docs/BRAND.md`, `app/globals.css`, and byte-identical logo primitives.

| Role | Constraint |
|---|---|
| Font | Actual Inter loaded via `next/font`, as in current foundation; 700 display, 17px body, 15px labels, 14px caption minimum |
| Primary | Solid `#0EA5E9` on `#0B1118` text; 48px minimum height (56px large) |
| Background | `#0F131A`, `#0A0D12`, `#151A21`; `#1C222B` raised |
| Text | `#F1F5F9`, `#CBD5E1`, `#94A3B8` (no opacity-generated greys) |
| Control / card | 10px / 14px radius, 1px border; **no doubled rounded containers** |
| Photography | Full-bleed *within the one surface*; no inset shadow frame; literal hardware images, not fake raster compositions |
| Glass | Optical glass only over real photographic/application content; mobile glass becomes near-opaque solid |
| Shadow | None on conventional cards; no neon/cyan glow, pseudo-metal, gradient buttons or digital noise |
| Logo | Canonical three concentric circles, descriptor 0.42em, 12px lockup gap, pulse header only |

**CSS architecture:** `styles/tokens.css` remains the read-only canonical token adapter. A single purposeful Connect styling layer; use component-scoped CSS modules for new screens. Each property is owned by one component selector, with responsive variants next to its base declaration. **Zero `!important` and no append-only override blocks.** Do not duplicate logo CSS or global resets.

**Responsive layout:** a genuine mobile full-screen app (no device silhouette on a device). Fit 320/360/390/430px widths. Respect iPhone safe areas and dynamic island. At common iPhone heights, the visitor name and Save Contact must be visible without scrolling; small heights may scroll naturally, never clip. Desktop grows whitespace/type/column balance, not card embellishment.

## 4. Motion, haptics and interaction tokens

**Motion is an affordance, never a presentation tax.**

| Event | Duration | Implementation |
|---|---:|---|
| Presenter first paint | **0ms wait** | QR and identity appear without blocking; optional content entrance 320ms fade + translateY(6px) |
| Brand pulse | **2.8s infinite** | Canonical header mark only |
| Button press | **120–160ms** | Colour/background response, no lift, no bounce |
| Share / clipboard | OS-controlled / immediate | Share launched directly in click activation; fallback copy on unsupported browsers |
| Visitor→story | **280–320ms** | Fade + max 6px translation; avoid heavy slide parallax |
| Story→story | **260–320ms** | Image crossfade + text entry; no zoom on humans/hardware |
| Interest select | **140–180ms** | Border/background only |
| Form invalid | **immediate**, reveal ≤160ms | Field-specific inline copy, summary only if useful |
| Confirmed server save | **240–300ms** | Quiet confirmation, not confetti |

- Prefer CSS transforms/opacity. No perpetual motion except canonical pulse. No hover-only critical interaction.
- Touch: 44×44px minimum target; primary 48px+. Respect accidental double taps, disabled states, keyboard and VoiceOver.
- Under `prefers-reduced-motion: reduce`: disable all nonessential motion including logo pulse and smooth scroll.
- `navigator.share` requires a secure context and a **real user gesture**; fallback to `navigator.clipboard.writeText`, then selectable text if clipboard fails. A cancelled native share is **not** “sharing failed”.
- No continuous haptic tricks; browser vibration is not an iOS quality strategy.

## 5. QR identity and deployment trust

A QR is a permanent promise. **Do not encode an unverified host or a temporary deployment URL in an irreversible printed/NFC card.**

- Explicit `CONNECT_PUBLIC_ORIGIN` (server env) validated against `https://` and an allowlist of approved public hosts. Preview and production origins are separate builds.
- The host/header of the incoming request must **never** silently become QR origin; prevents host-header QR phishing and inconsistent share links.
- Pure locally generated QR using a small audited MIT/Apache-compatible encoder. Architecture choice: *Nayuki TypeScript QR Code Generator* (MIT; vendor with attribution or pin as audited package). Need no third-party QR HTTP request. Error correction M or Q, quiet zone >=4 modules, 100% module grid, black on white, user can scan from a second phone.
- One `visitorUrl(profile)` resolver feeds QR, Share, Copy and SEO canonical. Unknown profile yields 404 rather than plausible QR.
- Preview uses a clearly labelled non-printable test address. Production origin selected only after DNS verified and release approval.
- Security: route length constraints, cache content hashed by confirmed origin, no opaque redirects through tracking domains.

## 6. Contact exchange, privacy, and systems contract

**Baseline:** existing `GET /contact/andisiwe` vCard remains the simplest guaranteed path. MIME `text/vcard`, `Content-Disposition`, filename, CRLF lines, proper escaping, no unsupplied private phone.

- Save is a download/open-in-contacts action controlled by visitor. Do not claim an OS contact was saved unless recipient confirms.
- Reverse exchange starts only with an explicit click; if durable backend not operational, do not display a fake form with “submit” success. Use explicit email composer.
- Future form: full name mandatory, email or phone mandatory, company/notes optional, selected interests optional, explicit enquiry consent required; marketing opt-in separate and default **false**.
- Durability: server schema and size limits, throttling, idempotency key, write acknowledgement, input sanitization, provenance/presenter attribution, privacy statement and deletion rules.
- For Sales OS, use server-to-server integration only; test duplicate contact and failure recovery. No PII in service-worker cache, client analytics events, QR payload or logs.
- Do not turn scanning a QR into passive tracking without notice/consent.

## 7. Wallet and NFC are deferred deliberately

Apple Wallet requires a Pass Type ID, signing certificate and cryptographically signed `.pkpass`; it is not the PWA manifest. Do not show an “Add to Wallet” button until supported, signed, tested, and operational.

Likewise, native iOS App Clips cannot be assumed from a Next.js PWA. Future NFC tags should encode the **same stable visitor link** and be validated across supported physical phones.

## 8. Nonnegotiable acceptance matrix

**Function**
- Presenter / recipient routes distinct; QR decode byte-for-byte matches `visitorUrl(andisiwe)`; no username or presenter route contamination.
- Real iPhone camera + Android camera scan, on-screen code under bright and dim conditions.
- Contact download/import succeeds on Safari/Android, Founder title correct, no personal phone invented.
- Native share on supporting device; copy URL on unsupported browsers, including permission-failure branch.
- Visitor can Save Contact without watching story or sharing details.
- Story is skippable, 5 ordered chapters; exit always returns to identity.
- Every photo is first-party served, licensed, HTTP 200 + correct MIME, optimized, correctly cropped; no upscaling.
- No fake lead success and no direct browser-to-Sales-OS writes.

**Visual and a11y**
- Widths 320/360/390/430/768/1024/1440 and 390×667 short viewport; no clipped title, CTA or horizontally scrolling page.
- All purposeful text >=14px, Inter loaded; controls >=44px (primary >=48px), contrast WCAG AA.
- No nested rounded story image panel; no `!important`, neon glow or noncanonical palette additions.
- Reduced motion mode, keyboard-only, visible focus and VoiceOver reading order.
- LCP goal <2.5s on representative mobile emulation, CLS <0.1, INP target <200ms; real field performance to validate later.

**Ops**
- `npm ci`, `npm test`, lint, typecheck, build and Playwright must pass in GitHub CI.
- Tests must cover permission-denied share/clipboard, preview-origin rejection, invalid founder, missing image, network offline, stale PWA asset caches and consent/failed write states.
- Preview must come from reviewed GitHub branch/commit before production promotion; no replacing V2 until founder visual + device approval.
- Any blocker must be labelled STOP, not silently skipped.

## 9. Exit outcomes and evidence ownership

Success is **not** an attractive preview alone. It is the actual exchange, independently verified and recoverable.

Store: decision record, changed paths, CI run ID, screenshot artifact links, validated QR decoded text, mobile screenshots, vCard test, exact preview URL and release STOP/GO.
No stage may claim acceptance based only on CSS source inspection or a Vercel READY build.

## Decision precedence

This document refines (and, for ordering, supersedes) the **visitor-flow sequence** within `docs/SIGNAL_CONNECT_V3_REBUILD_SPEC.md`. Canonical brand rules in that specification remain unchanged. Subsequent execution specs MUST refer to this file to avoid resurrecting the story-first dependency.
