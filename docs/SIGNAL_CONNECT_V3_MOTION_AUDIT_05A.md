# Signal Connect V3 — Motion/Opening Audit 05A

**Date:** 2026-10-23
**Status:** Implementation on V3 feature branch; not an approved production release.
**Source of truth:** `docs/BRAND.md` + `docs/DESIGN_SYSTEM.md` + `docs/SIGNAL_CONNECT_V3_EXPERIENCE_ARCHITECTURE.md`
**Prior public V3:** compact business card with Andisiwe's small monochrome portrait, email, WhatsApp, landline, Save Contact and manual opt-in exchange.
**Stable public alias must not move without review and release approval.**

## Finding: why the original opening did not feel like the Signal One pulse

1. `ConnectHeader.tsx` **already enabled the canonical logo pulse**: `<SignalOneLogo size={22} tone="dark" pulse />`. Its pseudo-element used the required 2.8-second infinite radiating ring, with motion disabled under reduced-motion.
2. But `styles/global.css` applied an unrelated blanket `main { animation: enter 320ms ... }` to every route. Neither the card, Save Contact action nor contact exchange had an intentional, coherent page arrival hierarchy.
3. Story media/copy separately used `story-enter 300ms`; the contact-exchange form appeared abruptly. Together, those effects created inconsistent timing around an otherwise authentic logo.
4. The V3 visitor card first screen should **not** be replaced by a 2.8s splash or make Save Contact wait for animation: the canonical product outcome is an immediately usable business card following a QR scan.

## Surgical implementation

- Preserve byte-identical `SignalOneMark` and `SignalOneLogo`, their tone, circle geometry and the exact canonical `signal-pulse 2.8s ease-out infinite`. Never animate the QR, portrait or other logo instances. The **header mark is the only repeating brand motion**.
- Replace generic `main` entrance with a single shared CSS `@keyframes signal-arrival` (320ms, 5px vertical easing, 94% opacity start). Restrict to the presenter and explicit visitor/component-owned staged arrival; no blocking overlay.
- Visitor sequence on initial load: business card starts without delay; contact CTA section follows at 70ms; the *optional* discovery footer follows at 140ms. All components remain in the normal DOM and reading order. No rearrangement, no forced scroll, no click-interception, no layout shift.
- Reuse same shared arrival for story media/copy (replace 300ms duplicate animation) and explicit contact-exchange panel/confirmation surfaces. The component-level animations are **single iteration**, not independent blue radiating rings.
- `prefers-reduced-motion: reduce`: all new animation disabled and smooth scrolling disabled. No JS timers, animation libraries, browser storage or analytics.
- Keep static QR immediately scan-ready, preserve all mobile breakpoints and the PWA service-worker identity/URL contract.
- Do not edit canonical token values or introduce `!important`, gradients, glow, stacked cards or CSS patch layers.

## Quality gates

- `tests/brand-motion.test.mjs`: source contract validates header-only canonical pulse, source-owned arrival and reduced-motion.
- `tests/brand-motion.spec.ts`: Chromium runtime computed-style contract for pulse 2.8s, stages 0/70/140ms, story/form single 320ms, presenter QR static, reduced motion, Save Contact visible and no horizontal overflow.
- Existing responsive/accessibility (320 through 1440, short iPhone), 04A manual exchange, source byte-check, QR image decode, photo-review gate and typed contact-intake tests must stay green.
- A real iOS Safari and Android Chrome device review still needs founder approval; CI Chromium is not a substitute.

## Remaining product gaps, prioritized

1. **Physical visual QA** on an iPhone including portrait, pulse visibility, transitions, native Save Contact, WhatsApp and email.
2. **Gated story release**: current WIN/HIRE/RUN/EQUIP/PROVE review is illustrative, not real production photography and not linked from public card. Confirm authentic photography, manufacturer rights and genuine Guard proof capture.
3. **Sales OS receiver**: `lancesat-enterprise-platform` [issue #689](https://github.com/Signal-One-Intergrated-Systems/lancesat-enterprise-platform/issues/689) — tenant-scoped, idempotent, consent-audited, phone-only-compatible durable intake, with real disposable DB and authenticated inbox verification before enabling automatic exchange.
4. **Final public URL and physical/printed QR provenance**: do not print a preview-domain QR or change the public source origin before controlled destination verification.
5. **Brand/experience polish**: review card hierarchy, quick action clarity, unblocked story CTA post-rights, share feedback, consistent button focus/press affordances and optional introduction funnel without user tracking/PII leakage.
6. **Privacy and release assurance**: public POPIA notice, retention/deletion process for any future stored contacts; Safari + Android device and clean-install PWA tests.

**Decision:** bring the existing motion into the canonical Signal One language **without creating a second pulse or launch delay**, test in isolated preview, and require a real device check before any stable URL promotion.
