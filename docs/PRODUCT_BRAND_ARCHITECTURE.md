# Signal One product brand architecture

## Parent identity
**SIGNAL ONE — INTEGRATED SYSTEMS** is the parent brand. Its exact ring mark, pulsing header treatment, dark graphite and Signal blue are defined by `docs/BRAND.md` and `docs/DESIGN_SYSTEM.md`. These definitions are binding. Do not recreate the mark or recolour the numeral 1.

## Two launch verticals
**1GUARD** — security-operations platform for guarding companies, officers, supervisors, control rooms and site clients. Its product ecosystem has two **distinct** marketplaces:
- **Guard hiring marketplace**: discover, shortlist and request guard hires, with guard acceptance and PSiRA-related eligibility controls.
- **Equipment marketplace**: browse, purchase or rent security radios, body cameras, tracking and related approved equipment, subject to stock, rental terms, pricing and checkout acceptance.

**1Workforce** — separate workforce-operations product for non-security field teams: attendance, shifts, timesheets, job cards, supervisory oversight and related operational workflows. The products share a parent brand, not an undifferentiated interface or permission domain.

## Design language derived from the 1GUARD staging login reference
- Signal One parent lockup on the left, then a restrained divider and product signature on the right; product name is prominent.
- Dark blue-black / graphite surfaces, white type and the established Signal blue `#0EA5E9` for the numeral **1**, focus accents and primary actions.
- Inter, large restrained typography, very realistic daytime workplace photography and readable dark image scrims.
- Distinct product label in the login experience: **1GUARD · Security Operations Platform** or **1Workforce · Workforce Operations Platform**.
- The parent's mark and wordmark must never be altered, stretched or recreated from generated assets.
- Product identity is conveyed by name, descriptor, photography and information architecture, not by unrelated palettes.
- Never combine the two different Guard marketplaces under a single ambiguous Buy/Hire CTA.

## Truth and release statuses
The public Guard hiring marketplace currently says MVP in development. Do not market it as available until its production flows pass acceptance. The equipment website offers quote/rental enquiries and is not a verified integrated commerce marketplace. 1Workforce is a launching vertical, but availability, sign-in URLs, features and public onboarding must be validated against its deployed product before activation.

## Required commercial IA
Home > Products > 1GUARD (Operations, Hire Guards, Buy Equipment, Rent Equipment, Pricing, Demo)
Home > Products > 1Workforce (Overview, Time & Attendance, Operations, Demo)
Home > Solutions > Radios, PTT, CCTV and Tracking
Home > Company, Contact, Support.

A public product page must clearly mark features as live, pilot, or planned. Payment and onboarding buttons must be connected and tested rather than purely presentational.


## 2026-10-30 decision: one consistent product-family numeral

The founder chose **the existing plain typographic 1**, not an alternate 3D/glass numeral or new OS symbol. The Signal One corporate ring mark and the separate LEOS operator mark are unchanged.

**Canonical implementation on the marketing website:** `app/components/brand/ProductSignature.tsx`, using the `s1-product-signature` CSS contract in `app/globals.css`. Product lockups are `1GUARD`, `1Service` and `1Community`. Future verticals must reuse the same component or reproduce this geometry in their native font stack.

**Hard constraints, all products and breakpoints:**

1. The existing numeral and the following uppercase initial share the **same Inter font size, font weight, line-height and baseline**. Never scale the numeral separately.
2. Exactly **0.06em horizontal gap**, measured from the numeral's layout box to the following first-letter box. The gap scales with the wordmark size. Never add a second wrapper gap, a negative margin or manual letter spacing.
3. Numeral uses the established Signal One blues: `#38BDF8` on dark photographic/glass backgrounds; `#0EA5E9` on light backgrounds. Letters inherit the correct surface foreground (white on dark, navy on light).
4. The exact same typographic treatment applies to header, responsive navigation, hero labels, product pages, footers and future product app headers. Do not reinvent the numeral as an SVG, change its geometry, add a gradient, transparency or glow. Glass may frame the entire lockup but not distort individual glyphs.
5. The product name's casing is fixed: GUARD / Service / Community. Accessibility: keep the text real and selectable; links must remain keyboard accessible.

**Boundary:** The 1GUARD application currently uses the approved "Signal One Guard" sign-in identity. Do not replace it with a product wordmark solely to enforce this rule. When a numbered product lockup is introduced in that application (or in 1Service/1Community), use this same contract; the product boundary, permissions and tenant branding remain unchanged.

**Regression:** `tests/e2e/visual-mission.spec.ts` compares the rendered numeral and first-letter height, font size, baseline and 0.06em gap at mobile, tablet and desktop widths.
