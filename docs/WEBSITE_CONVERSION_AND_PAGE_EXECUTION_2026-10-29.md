# Signal One — research-led website conversion and refactor mission
**Date:** 29 October 2026 · **Scope:** public Signal One website only, source-controlled and release gated.

## Business and product truth
- **Signal One Integrated Systems** is the parent technology partner. Its canonical logo, brand ring, Inter type and motion follow `docs/BRAND.md` and `docs/DESIGN_SYSTEM.md`.
- **1GUARD:** security-operations vertical. Guard repo demonstrates workflows for clocking, patrol QR/NFC, offline evidence, incident/SOS, occurrence book, control-room oversight and client proof. Production/contracting claims and pilot availability must be gated, not inferred from repository unit tests.
- **1Service:** successor to 1Workforce. The proposition is an end-to-end service-business OS, **restaurant-first**: staffing and hiring, rosters, dining/service transactions and kitchen handoffs, stock/purchasing/recipe costs, finance interfaces, reporting and recommendations. The current workforce repository README is foundational and does NOT demonstrate live POS, KDS, inventory, payments, marketplace or intelligence. All those capabilities remain planned until their acceptance gates pass.
- **Equipment:** Signal One handles professional PoC/PTT radios, cameras, tracking, networks and connectivity. Enterprise purchasing starts with specification and written quotation, not an unverified real-time inventory/checkout.
- **1Community:** future only. Do not create a live CTA.

## Buyer decision psychology / Jobs to be done
| Person | High-intensity problem | Evidence they require | Risk to remove | Website decision |
|---|---|---|---|---|
| Guard company director | Loss of contracts, missed coverage, margin erosion | Verified shifts/patrols, incident trail, reporting, transparent cost | Fear of system change and undocumented data | `1GUARD` demonstration → eligible 14-day trial request |
| Guard operations manager | Missed patrols and scattered calls | Exceptions and responsible action in one view | Too much training, poor signal | workflow walkthrough + offline caveat |
| Client facilities/security manager | Cannot prove value of the guarding contract | Approved proof-of-service samples and transparent reporting | privacy, trust, access | proof-of-service page + talk to sales |
| Restaurant owner/operator | Unseen labour, waste and service delays | Order-to-kitchen and stock-to-margin workflow, integrations and human approvals | POS replacement risk | 1Service roadmap and early access, not fabricated live trial |
| Multi-outlet hospitality group | Sites drift, inconsistent operating procedures | outlet isolation, standardised day close, reporting, roles | migration, procurement and operational continuity | discovery session, qualification |
| Enterprise procurement/technical buyer | Wrong radio band, coverage or device compatibility | Manufacturer-accurate photography, specs, warranty, pricing and lead time | supply chain risk and procurement accountability | category → configuration/quantity → written quote |
| Guard/staff applicant | Fair access to paid work, transparent placement | role/eligibility/consent, vacancy state | scam concerns | honest marketplace status, no automatic placement claim |

**Primary psychology:** customer buys risk reduction and confidence before features. Answer in order: what problem, what changes, how it works, can I trust it, what does it cost, what do I do now. Avoid made-up logos, company counts and conversion promises.

## Competitive research (Oct 2026)
- Trackforce TrackTik: guard tours, time/attendance, command centre and incident reporting. https://www.trackforce.com/products/tracktik/guard-management/
- Novagems: active-user model, 14-day trial, client reporting, proof and clear feature packaging. https://novagems.com/pricing/
- MyProtektor (South Africa): 7-day free-trial security software; competing offer is clear and local. https://myprotektor.co.za/
- Yoco (South Africa): strong restaurant proof in real table→kitchen→payment workflow and published plans. 1Service should **integrate first**, not claim to displace the authoritative payment system. https://www.yoco.com/za/food-and-beverages/restaurants/
- Market research: Wits 2025 MSME digital-adoption study identifies cost, infrastructure, literacy and fit barriers. https://wiredspace.wits.ac.za/items/fbace3cd-b645-49a8-a0d8-c7f4dd7c5999
- NN/g: business buyers compare options over complex cycles; show high-level benefits first then sufficient detailed specs. https://www.nngroup.com/articles/b2b-specs/
- Baymard: hardware discovery and product photo/spec fidelity are crucial to evaluation and eventual ordering. https://baymard.com/industries/b2b-ecommerce-ux

## Website acquisition architecture
1. **Awareness:** Guard vertical search campaigns, local referrals, radio procurement and service-industry education pages; each campaign links to a persona-specific page, not only homepage.
2. **First 5 seconds:** clear value + 1GUARD / 1Service / Equipment choices, original globe and genuine brand, no invented proof.
3. **Qualification:** demonstrate supported workflows; show 1Service and hiring marketplace as in development; show actual manufacturer imagery for equipment.
4. **Trust:** real product screenshots only after demo-tenant OCR/privacy gate, real customer testimonials only with permission, clear privacy, company registration and pricing source.
5. **Conversion:** 1GUARD CTA exactly **Get 14 Day Free Trial** linking to /get-started (request, not auto-activation); 1Service interest to /contact; equipment quote to /radios-equipment#quote.
6. **Lead capture:** business type + company/contact + context + product selected → server/CRM intake → sales assignment and consent log. **BLOCKER:** Railway production currently has no `SIGNAL_ONE_INTAKE_URL` or `NEXT_PUBLIC_GA_ID`. The form falls back to a user-sent email. Never count an email compose click as a received lead.
7. **Sales handoff:** human confirms fit, package, trial eligibility/expiry, hardware quotation or beta waitlist and next follow-up; no fabricated activation or auto-enrolment.
8. **Activation and proof:** authorised tenant onboarding, training, actual deployment and time to first guard shift/patrol or approved pilot; measure independently from sign-up.
9. **Paid conversion and retention:** commercial quote/order/contract, approved pricing, subscription entitlement, adoption signals, account health, renewals and hardware upsell. Do not imply LEOS subscription integration unless verified.

## Planned page-by-page release map
| Order | Route(s) | Buyer task / page objective | Gate |
|---|---|---|---|
| P0 (this branch) | `/` | High-impact premium hero, globe preserved, clear three decisions, real/illustrative imagery, trial CTA and quotation path | brand source and production build, mobile 320/390, tablet 768, desktop 1440, anchor routing |
| P0 (this branch) | `/service` + `/workforce` redirect | Correct 1Service brand and truth; legacy redirects retain traffic | no false live product claims |
| P0 (this branch) | header/footer/metadata | same product naming and CTA everywhere | no 1Workforce text in live public UI |
| P0 (this branch) | `/get-started` | Segment company type, avoid Guard-only questionnaire for restaurants/equipment, disclose email fallback upfront | trial terms truthful, mailto ready |
| P1 | `/solutions/security`, `/pricing` | One coherent 1GUARD sales story; prove capabilities, cost and eligible onboarding | current Guard evidence, price master reconciled with platform price book |
| P2 | `/service` | Fully researched restaurant-specific workflow visuals and discovery funnel, integration status by vendor | no claim of unshipped POS / marketplace |
| P3 | `/equipment-marketplace`, `/radios-equipment` | Professional catalogue by use case, specs, manufacturer photos, purchase vs rental quotation | manufacturer asset provenance, real lead time, SKU fidelity |
| P4 | `/guard-marketplace`, `/guards`, guard join | two-sided recruiting, PSiRA/eligibility and transparent launch stage | screening + consent + marketplace readiness |
| P5 | `/contact`, `/security-trust`, legal | Enterprise trust / response / procurement evidence | POPIA and source of claims |
| P6 | SEO pages, careers, QA | Search intent, verified case studies, analytics & funnel iteration | responsive and analytics acceptance |

## Design-system, image and performance gates
- Use original Signal One SVG logo; Inter Variable; approved dark navy, Signal blue, glass materials and 48px+ buttons (56px for hero CTAs), 3px focus rings and responsive spacing.
- Preserve `HeroGlobeLayer` (do not redraw or reimplement). Preserve 1GUARD shutter.
- Original fictional documentary scenes are illustrative, not customers, devices or screenshots; manufacturer device images are unmodified and separately sourced.
- Test no mobile horizontal overflow at 320/390/768; no overlapped labels or clipped CTAs; no stretched device images; good 1440/1920 readability; reduced-motion and no-backdrop-filter states.
- Set image quality reasonably, avoid adding full-size competing images above fold; ensure LCP and layout stability. Explicit `sizes` for every responsive image.
- No fabricated statistics. Instrument `hero_product_proof`, `client_onboarding_start/complete`, `equipment_quote_start/complete`, `consultation_start/complete` only when measurement is configured. Event taxonomy and real pipeline must be reconciled before running ads.

## Formal release acceptance and blockers
1. `npm run build` including public-truth, design-system and rendered branding gates passes.
2. All affected end-to-end routes and new mobile/desktop home tests run in Chromium; no blockers.
3. Production intake webhook configured, authenticated and tested; trial submissions go to actual, traceable sales queue. If absent, show explicit email-only mode.
4. Confirmation email/CRM task, lead-source capture and response SLA are implemented and measured, not assumed.
5. Pricing discrepancy: public website `app/lib/pricing.ts` currently states R2.00 per guard day, while newer founder direction references R2.50. Do not silently change public contractual terms before synchronising Sales OS/LEOS and contracts.
6. 1Service availability claim is revalidated after the implementation and product gate, not inferred from the roadmap.
7. Founder visual acceptance at mobile and desktop with the **actual running site**.

No historical conversion benchmarks are represented as Signal One performance. Record baseline: homepage view → primary CTA → form-start → delivered lead → accepted trial → activated tenant → paid subscription and equipment quote → order. Optimise each stage based on observed data.
