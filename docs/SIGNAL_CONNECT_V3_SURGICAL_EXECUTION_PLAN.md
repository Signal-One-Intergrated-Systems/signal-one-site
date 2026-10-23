# Signal Connect V3 — Surgical Execution Plan

Plan ID: SC-PLAN-003 · 23 October 2026 · Status: PLANNED, NO FEATURE CODE EXECUTED
Authority: docs/SIGNAL_CONNECT_V3_EXPERIENCE_ARCHITECTURE.md
Baseline: Execution 01 green at commit 405dd7814fc3fcb745210e98c43a8273aedb14ff; draft PR #28.
Boundary: changes allowed only inside signal-connect/ and controlled docs/workflow. V2 and existing production routes remain untouched.

## Pre-flight and stop rule

Read the exact current branch versions of DESIGN_SYSTEM.md, BRAND.md, existing V3 experience architecture, profile/vCard modules, layout, styles, tests and CI workflow. Capture current Git SHA, CI state, baseline screenshots (320/360/390/430/768/1024/1440 plus 390×667), compiled font and mobile overflow status. No customer data, no new credentials. If a precondition fails, stop that workstream and record evidence. Never cover up a defect with a CSS override.

The clean implementation must remain separate from PR #27. No cherry-pick, no import of old HTML or old CSS. Do not alter canonical Signal One logo or token values.

## Execution 02A — Single URL contract, without changing UI

Deliver one server-authoritative visitor URL builder in signal-connect/lib/links.ts. Derive all future QR, share, clipboard and canonical URLs from the same function. Profile ID must come from the typed known-founder directory. Source is CONNECT_PUBLIC_ORIGIN; reject insecure schemes, login credentials in origin, query, hash, arbitrary path and unapproved origin. Never derive a QR payload from an untrusted request Host header. Preview origin is distinct from final public origin; until final URL is approved, QR remains labelled preview-only and must not be printed on physical cards.

Files allowed: links module and dedicated tests, small documentation update. No component redesign.

Gate: unit tests verify valid and invalid origin, unknown profile, URL canonicalization and consistency across all intended actions. Missing or invalid config disables sharing rather than silently constructing a plausible wrong URL.

## Execution 02B — Working first-party QR encoder

Use the open-source Nayuki TypeScript QR Code Generator (MIT licence, pinned source or pinned dependency with attribution). Do not use any external QR HTTP service. Encode the actual valid visitor URL (never presenter URL), error correction M/Q, four-module white quiet zone, black/dark ink on white and high-contrast static image. No logo obscuring the matrix; no pulse on QR.

Files allowed: lib/qr.ts, components/QRDisplay.tsx, controlled QR endpoint if warranted, ADR-002 with provenance. No new form, storytelling or lead capture.

Gate: independently decode generated SVG/PNG in test using another decoder and compare byte-for-byte to URL resolver; verify quiet-zone width, correct Content-Type, unknown profile 404, no arbitrary string-to-QR endpoint, actual camera scan on two phones. Fail closed rather than show fake code.

## Execution 02C — Founder presenter actions

Identity and large QR must be visible immediately when Andisiwe launches the PWA. Add native Share Link via navigator.share triggered synchronously by user click; use clipboard fallback for unsupported browsers, and selectable text if clipboard fails. Handle user cancellation silently (not an error). Add optional recipient preview link without accidental routing away from QR. Keep full name, Founder title and canonical logo.

Files: FounderPresenter.tsx, ShareLink.tsx, optional Presenter module CSS. No new global style overrides.

Gate: real user gesture, clipboard-denied test, native share cancellation, QR URL equality, PWA standalone behavior, iPhone safe area and 320px width; all tests green. Do not claim App Clip support.

## Execution 02D — Identity-first visitor

Build VisitorIdentity component, visitor.module.css and update connect/[profile]/page.tsx. Screen priority: company lockup → Andisiwe Satshwa → Founder → one-sentence introduction → primary Save Andisiwe's Contact → clear secondary Share My Details / Discover Signal One → lower-priority company website. Save action retains the existing verified /contact/andisiwe vCard route. No login, questionnaire, storytelling or reverse exchange required just to save a card.

Until later stages, unfinished secondary paths must be visibly disclosed as under development or provide a truthful manual email flow. Never render a working-looking dead button. No invented portrait.

Gate: vCard/filename/Founder title/CRLF/zero unknown personal numbers, keyboard focus, axe accessibility, 390×667 short viewport, 320px no overflow; Save Contact always possible immediately. This is the first useful digital-card milestone.

## Execution 03A — Media, copy and product truth freeze

Choose five genuine people and hardware images from local repo, with rights/provenance, native dimensions, file size, intended focal crop, alt text and verified capability labels in one inventory document. No hotlinks. WIN/HIRE/RUN/EQUIP/PROVE chapter script must be finalized before CSS. Never present illustrative actors as actual Signal One clients or personnel, nor fake product screens as real Guard data.

Gate: five source files verified by content/MIME/dimensions, optimization prepared, truthful product state agreed. If missing a valid asset, chapter stays blocked; do not use a broken placeholder as content.

## Execution 03B — Optional story

Components SignalStory and StoryPanel, with one story.module.css owner. One continuous surface at canonical 14px radius, image flush to its edge, no nested rounded image frames or extra borders. Visible previous/next/exit actions; optional swipe never the sole navigation method; five chapter states, readable progress and focus on chapter heading. Return to visitor card without losing ability to Save Contact.

Motion: one 320ms fade + 6px entrance; story changes 260–320ms; no parallax/zoom on faces. Reduced-motion fully disables decorative motion. Only perpetual animation remains the canonical 2.8s brand pulse.

Gate: all chapters and exits tested, images HTTP 200/local, no layout shifts, iPhone/Android screenshots, keyboard/VoiceOver, axe and reduced-motion.

## Execution 04A — Explicit manual reverse exchange

Only if visitor asks to share details, open clear consented handoff. Without a durable backend, a composed email is labelled as a mail-app handoff; opening the composer is NOT a confirmed lead. No PII stored in service worker, analytics or URL. Preserve contact-saving independence.

Gate: email app cancellation is not success; fields validate; no background network write or hidden tracking.

## Execution 04B — Durable server handoff and Sales OS

Separate server-only API with validated input, size limits, idempotency, anti-abuse controls, provenance/presenter attribution, timestamped explicit consent, auditable storage and a real server-to-server Sales OS adapter. Never expose credentials in browser code. Return success only after acknowledged durable write.

Gate: verify created relationship in Sales OS, deduplication, upstream failure semantics, deletion/privacy controls and no PII in logs/cache. If receiver unavailable, remain in email-only mode.

## Post-MVP (not blocking)

Signed Apple Wallet pass, Google Wallet, NFC encoded to stable visitor URL, team provisioning and advanced CRM enrichment. Never describe a PWA manifest as Apple Wallet.

## Exact component ownership

- ConnectHeader: canonical mark/wordmark only; no local brand recreation.
- FounderPresenter: identity and presenter layout only.
- QRDisplay: matrix/quiet zone/accessible caption, not URL derivation.
- ShareLink: OS share and clipboard fallback, not contact storage.
- VisitorIdentity: recipient information hierarchy and CTAs.
- ContactExchange: vCard download and company website link, not reverse-exchange consent.
- SignalStory: chapter state/progress/navigation; StoryPanel: one image + one text surface.
- ExchangeDetails: input/consent and honest status, not browser-side Sales OS token.
- App root: Inter/safe areas/semantic shell only.

CSS: canonical tokens.css; single global reset; scoped component modules only. Base and responsive variants co-located. Zero !important declarations. No duplicated color/spacing/radius recipes, inner rounded photo frames, neon glows, fake metallic textures or procedural grain.

## Performance and mobile visual gates

Use genuine Inter (17px body, 15px labels, 14px captions minimum). Solid Signal Blue #0EA5E9 primary with dark text; control radius 10px, card 14px, 1px neutral border. Primary at least 48px high, all targets at least 44px. Precision glass only over actual content and near-solid on mobile, no stacked backdrop blurs.

At 390×844, presenter name/title and QR are immediately visible; visitor name/title and Save Contact above fold. At 390×667 and 320px, allow natural vertical scroll, no clipped CTA. Measure LCP target under 2.5s on representative mobile emulation, CLS under 0.1 and INP under 200ms. Record simulated vs field data separately.

Each commit must run npm ci, npm test, lint, typecheck, build, Playwright screenshots at 320/360/390/430/768/1024/1440, axe, keyboard and reduced motion; reviewer checks no unexpected font or token changes. Physical Safari iPhone and Android Chrome checks before release.

## Preview and rollback

V3 source-upload Vercel preview is a temporary QA convenience, NOT a repeatable production CI/CD. Correct the GitHub integration and configure a source-controlled Vercel project with rootDirectory signal-connect before release. Print/no-NFC until approved stable production origin. Preserve V2 on its existing address. Each approval records exact branch commit, CI run, screenshot evidence, preview URL and rollback SHA.

## Commit discipline

02A, 02B, 02C, 02D, 03A, 03B, 04A, 04B are distinct feature commits/PR checkpoints. One logical change and its tests at a time. On a failing gate: stop, file evidence and correct root cause; never append override CSS. Do not merge any phase or swap production aliases without approval.

**Next execution after this planning stage: 02A URL contract only.** QR rendering, UI redesign and story remain out of scope until 02A tests pass.
