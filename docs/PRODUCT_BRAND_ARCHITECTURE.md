# Signal One — product positioning and product-family identity
**Approved:** 30 October 2026  
**Scope:** Public website, 1GUARD web/mobile, 1Service web/demo and future 1Community.

## Product and audience architecture
**Signal One Integrated Systems** is the parent technology brand serving small and medium enterprises (SMEs), with professional equipment, connected services, and industry-specific **business operating systems**.

- **1GUARD — Security Business Operating System.** Designed to connect the security SME lifecycle: customer acquisition, contracts, staffing and hiring, scheduling, guarding service delivery, control-room and incident oversight, equipment, billing and financial insight. The present Guard repo's documented working scope is narrower (e.g. shifts, attendance, patrol verification, incidents, SOS and client proof), and the full business lifecycle is **not** claimed as live.
- **1Service — Service Business Operating System.** Restaurant-first, eventually adaptable to other service SMEs: customers, bookings, service delivery, team hiring, kitchen operations, inventory, purchasing, financial visibility and business intelligence. The deployed demo is currently a workforce/time-and-attendance foundation, **not** a certified end-to-end restaurant OS or public commercial release.
- **1Community — planned business/community OS vertical.** Future positioning only: no availability, checkout or signup claim.
- **Equipment and connectivity.** Signal One's separate commerce and fulfilment pathway: professional radios, tracking, body cameras, CCTV, networks and connectivity, currently quote-led.
- **LEOS** is the shared underlying enterprise/intelligence infrastructure, not a substitute public-facing product for these verticals. Distinct tenant and operational-domain permissions remain mandatory.
- **Sales OS** is for Signal One's internal representatives, not bundled into customer subscriptions.

## Mandatory words, labels and release truth
Always lead with the **Business Operating System** category and the practical benefit of helping SMEs run their businesses. Operational functions such as guard shifts, patrols, kitchen flow and attendance are supporting capabilities and evidence, **not** definitions of the product boundary. Preserve truthful feature labels and separate **available**, **pilot**, **in development** and **planned** capabilities.

The public 14-day 1GUARD trial is a **request**, not confirmed automatic provisioning. Customer intake, activation and entitlements require demonstrated end-to-end integration before stronger claims. 1Service is in development and should direct prospects to interest/early-access conversations, not unverified paid signup. The guard hiring marketplace and 1Community must not be marketed as currently live.

## Canonical product-family 1 — one visual rule everywhere
The founder selected the **existing plain typographic numeral 1**, not a substitute glass/3D logo. This is a product wordmark, distinct from the unchanged **Signal One corporate ring and corporate wordmark**.

**Names and casing:** `1GUARD`, `1Service`, `1Community`.

**Exactly one optical geometry across all surfaces, devices and products:**
1. The numeral **1** and the following capital **G**, **S** or **C** use the same Inter typeface where available, **the same font-size, weight, line-height and baseline**. No independent transforms, scaling, gradients, shadows or special glyph drawing.
2. Their box-to-box horizontal separation is **0.06em**, measured at the common wordmark font size. No extra space character, standalone margin or wrapper letter-spacing. All named products use the identical rule at every breakpoint.
3. The product numeral is **always Signal blue `#0EA5E9`**, including dark glass and photographic surfaces and light surfaces. The remaining letters inherit a legible surface foreground. This intentionally differs from the corporate `SIGNAL ONE` logo's documented dark-surface `#38BDF8` allowance. Do **not** recolour or remake the corporate logo to enforce the product rule.
4. Glass belongs around the lockup, not on a distorted numeral. Wordmarks remain selectable, accessible text; logos and CTAs stay keyboard accessible.
5. A route transition, navigation bar, login, footer, desktop control room, mobile screen and in-app header must not implement a one-off variant of the numeral.

### Implementations
- Website: `app/components/brand/ProductSignature.tsx` and `app/globals.css` `.s1-product-signature`; also used for navigation/marketing labels and animated scene transitions.
- 1GUARD web: `apps/web/components/product-signature.tsx` and `apps/web/app/globals.css`; reused for login, shell and entry shutter. Mobile's native text uses the same colour and **0.06em** spacing logic.
- 1Service demo: `web/index.html`, `web/app.js`, `web/app.css`, with the same signature spans.
- Planned 1Community: reuse the identical component/contract if and when that app is implemented.
- Website regression checks: `tests/e2e/product-signature.spec.ts` covers colour, scale, baseline and gap. A compiled deployment alone is not a full cross-device visual acceptance test.

## Design system and trust
Preserve Signal One's actual ring logo, typography, approved imagery, globe, glass visual language and responsive motion. Maintain domain distinctions and honest limitations. Do not claim a roadmap capability exists because a prototype or code stub exists.

## Buyer pathways
- 1GUARD: discover business OS -> evaluate specific capabilities and public pricing -> eligible 14-day **trial request** -> verified provisioning and operations.
- 1Service: restaurant/service SME -> business OS vision -> in-development and early-access interest.
- Equipment: category -> requirements -> quotation -> approved sale/rental and fulfilment.
- Guard hiring marketplace: candidate/company interest only until matching, consent and eligibility workflows pass launch gates.
- Careers: application -> interview review -> decision -> compulsory Training OS -> authorised internal Sales OS (future automation contracts are not represented as live).

## Interactive public OS cube — 2026-10-30

The homepage section immediately below the unchanged, founder-locked hero uses an interactive 3D glass cube instead of the duplicated editorial thumbnail. It explains the customer-facing operating-system vision, not a live dashboard. Confidential architecture is not mentioned.

- Source: app/components/OperatingSystemCube.tsx and app/os-cube.css.
- Drag, swipe or arrow keys rotate the cube. Click, Enter or Space opens the immersive experience.
- The expanded, focus-trapped overlay shows Lead → People → Schedule → Work → Proof → Billing → Growth.
- Visitors may choose stages or pause the slow automatic flow. Escape returns focus to the cube.
- Mobile layouts have horizontal stages; reduced motion disables animations and automatic cycling.
- The walkthrough explicitly labels future integrations as a concept, not currently available features.
- Each homepage image source is unique; imagery is not duplicated in the page.
- The approved founder-locked hero remains identical to tests/fixtures/locked-home-hero.txt.
