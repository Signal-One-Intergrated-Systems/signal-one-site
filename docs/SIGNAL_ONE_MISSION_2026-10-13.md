# CODEX MASTER MISSION — SIGNAL ONE WORLD-CLASS WEBSITE TRANSFORMATION

## YOUR ROLE AND AUTHORITY

You are the Principal Creative Technologist, Executive UX/UI Designer, Motion Director, Frontend Architect and Senior Quality Engineer responsible for transforming the public Signal One Integrated Systems website.

This is **one continuous end-to-end implementation mission**.

You are not being asked to produce a redesign proposal, an isolated feature, a visual mockup, or a collection of planning documents.

You are being asked to **redesign, engineer, run, test, refine and deliver a substantially transformed working website** that aims to exceed the quality of the ATEX Solutions reference.

Work autonomously through the necessary implementation stages. Do not stop after an audit or prototype. Finish all work within your control, and distinguish completed work from anything blocked by missing assets, credentials or approval.

Use the strongest appropriate available coding and reasoning capabilities. Perform an independent design critique before declaring the result ready.

## 1 — PROJECT IDENTITY

**Company:** Signal One Integrated Systems

**Production website:** https://www.signalone.co.za

**Design benchmark:** https://atexsolutions.io/

**GitHub repository:**
`Signal-One-Intergrated-Systems/signal-one-site`

**Production platform:** Railway, not Vercel.

**Related repositories, read-only where necessary:**
- `Signal-One-Intergrated-Systems/signal-one-guard`
- `Signal-One-Intergrated-Systems/lancesat-enterprise-platform`

**Previous unsuccessful attempt:**
PR #25 — `feat/atex-beyond-experience-20261013`

Do not assume PR #25 represents the desired design standard. Inspect it for useful components, tests and lessons, but treat its visual direction as unsuccessful.

Start from the latest `main` branch on a clean mission branch, reconcile any concurrent work, and create one coherent draft pull request for this replacement implementation. Do not blindly cherry-pick PR #25 or overwrite unrelated work.

## 2 — THE NON-NEGOTIABLE OUTCOME

The target is a premium, sophisticated, technologically advanced B2B website.

A visitor should immediately understand:

**Signal One is the technology connecting security companies, frontline guards, control rooms, operational evidence and equipment.**

The experience must communicate the value of Signal One through real visual demonstrations.

It should feel like an exceptionally well-funded international technology company with meticulous design, custom interactions, polished engineering and sophisticated motion.

However, it must remain credible, understandable, performant and appropriate to South African security businesses.

**This is not a security guarding company's website. Signal One supplies the technology.**

Guard uniforms, vehicles, officers and customer equipment must not be rebranded with Signal One logos.

Preserve the exact existing Signal One logo, colours and approved design language. Do not redesign the logo or create a replacement brand identity.

Do not display LEOS publicly.

## 3 — STUDY THE BENCHMARK PROPERLY

Inspect ATEX visually using a real browser at desktop, tablet and mobile breakpoints.

Review at minimum:

- Homepage composition, art direction, visual hierarchy and navigation.
- Draggable access-card interaction and its supporting feedback.
- Shepherd Vantage's guided operational scenario and configurable controls.
- Hardware presentation, filters, product cards and transitions.
- Scroll behaviour, section transitions, hover states, typography, depth, loading and responsiveness.

Record actual observations rather than assuming the site behaves as its HTML suggests.

Identify what makes ATEX engaging and what can be improved.

**Do not clone ATEX's layout, illustrations, content, branding or interaction design.**

Use the benchmark to establish a quality threshold, then develop an original Signal One experience.

Your creative goal is a stronger combination of:

- Immersive product storytelling.
- Real operational evidence.
- Beautiful software presentation.
- Premium hardware merchandising.
- Cinematic but purposeful motion.
- Conversion-focused UX.
- Exceptional responsiveness and performance.

## 4 — UNDERSTAND THE CURRENT WEBSITE BEFORE CHANGING IT

Read these repository documents first:

- `docs/FOUNDER_BRIEF_2026-10-07.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/BRAND.md`
- `docs/DESIGN_AUDIT_2.md`
- `docs/PHOTOGRAPHY_BRIEF.md`
- `docs/ASSET_PROVENANCE.md`
- `docs/SITE_INTEGRATION.md`
- `README.md`

Then inspect:

- `app/page.tsx`
- `app/globals.css`
- `app/components/ui.tsx`
- `app/components/PatrolStory.tsx`
- `app/components/ProductProof.tsx`
- `app/lib/productProof.ts`
- `app/lib/photos.ts`
- `app/lib/catalogue.ts`
- `app/lib/pricing.ts`
- The shared navigation, forms and mobile components.
- Relevant Playwright tests and GitHub workflows.

The site currently uses Next.js 16, React 19, TypeScript and Tailwind CSS 4.

Retain the existing architecture unless there is a compelling, evidenced reason to replace part of it.

The previous design failed because it added another explanatory component without transforming the complete visual experience.

**Do not repeat that failure.**

## 5 — CREATIVE DIRECTION: SIGNAL ONE, OPERATIONS IN MOTION

Create a coherent website experience around the concept:

**FROM THE FIELD. THROUGH THE SYSTEM. TO VERIFIED SERVICE EVIDENCE.**

This is the creative spine of the website, not a requirement to change the approved logo or existing product names.

The site should combine three visual worlds:

**The physical world:** Real South African security operations, people, sites, checkpoints, radios, trackers and equipment.

**The digital world:** Authentic Signal One GUARD interfaces, operating records, control-room workflows and client proof.

**The connected world:** Motion demonstrating how field events become digital records, supervisory actions and useful client-facing information.

The interaction between these worlds must create the visual sophistication.

Design one integrated experience, rather than many unrelated landing-page components.

## 6 — REBUILD THE HOMEPAGE EXPERIENCE

Reconsider the entire information architecture. Retain useful commercial content but reduce duplicated explanations, excessive scrolling and large areas without visual or informational purpose.

### A. Premium cinematic hero

Create an exceptionally strong first screen.

Use the existing brand identity with excellent typography, precise composition, rich depth, controlled glass and professionally art-directed real imagery.

The hero needs a dynamic visual composition that makes Signal One's proposition understandable within approximately five seconds.

Where properly sourced assets exist, visually connect physical operations, equipment and genuine software.

Use layered motion, changing focus, spatial transitions and meaningful interaction where appropriate.

Do not place a small animated flowchart over the existing photograph and call the hero complete.

Avoid fake GUARD screens, random floating geometric objects, particles, neon lighting or generic futuristic dashboards.

The hero must include a clear primary action that opens a meaningful demonstration, not simply scrolls to another large block of explanatory text.

### B. Interactive Signal One experience

Build the website's principal showpiece.

Demonstrate the real operational sequence:

1. An officer performs a QR or NFC checkpoint scan.
2. The GUARD system records the checkpoint, patrol, time and applicable GPS evidence.
3. The operational record becomes available for supervision.
4. The control room can respond to SOS events or review relevant exceptions.
5. Proof-of-service information becomes available to authorised users.

This should feel like a polished product demonstration, with visual continuity from physical action to digital evidence.

Implement meaningful state transitions, active-stage progression, coordinated imagery, device context and a genuine sense of operational flow.

Use scroll-directed storytelling only where it improves comprehension. Provide accessible manual controls and a reduced-motion alternative.

**Crucial:** If clean, approved GUARD screenshots are unavailable, do not invent realistic GUARD dashboards. Build truthful editorial visualisations of the workflow using validated fields and existing assets, clearly distinguish them from actual product screens, and identify the missing capture requirement.

Do not duplicate this entire story elsewhere on the homepage.

### C. Make the software feel like the product

Audit the GUARD application and determine which implemented functions are suitable for accurate public demonstration.

Prioritise:

- Sites, posts and shift allocation.
- Attendance and guard activity.
- Patrol checkpoints.
- Incidents and occurrence records.
- SOS and control-room handling.
- Proof of service.
- Scoped access for supervisors and clients.

Obtain genuine screenshots only from an approved non-production environment populated with synthetic data.

Use `scripts/capture-product.mjs` and the existing branding/OCR safety gates.

Never expose actual customer or employee information.

If staging credentials or suitable demo data are unavailable, do not bypass this restriction. Build the surrounding experience and report the exact outstanding dependency.

### D. Premium equipment experience

Transform the radios and tracking presentation from ordinary product cards into a world-class equipment gallery.

Feature the actual approved products and exact models.

Use manufacturer-authorised product photography, high-quality cut-outs, thoughtful scale, controlled perspective, meaningful hover or drag interactions and premium transitions.

The devices should feel tangible and desirable.

Where supported by verified functionality, explain how hardware relates to Signal One's wider offering.

Do not imply hardware-control integrations are operational if they are still under development.

Do not use photos of different models under a product's name.

Maintain the existing quote-based commercial model unless a verified service permits another purchase flow.

### E. WIN / HIRE / RUN / EQUIP / PROVE

Preserve these commercially important concepts, but recompose them into a visually consistent customer journey.

Each should answer a distinct business question.

Avoid repeating the same narrative in multiple sections.

Guard Marketplace must be clearly presented as **MVP in development**.

Existing functionality and future capabilities must be visually distinguished.

### F. Clear conversion journeys

Preserve and improve:

- Explore GUARD.
- Request a demonstration or consultation.
- Guard-day pricing and calculator.
- Equipment rental enquiries and quotations.
- Security company onboarding.
- Guard profile creation.
- Careers and sales recruitment.

Do not create fake checkout flows, placeholder download links or forms that falsely claim successful submission.

Preserve the existing analytics event contracts and form integration behaviour.

## 7 — ALL MAJOR PAGES MUST FEEL COHESIVE

Do not deliver an upgraded homepage attached to unchanged, low-quality internal pages.

Review and improve the major customer-facing routes:

- `/`
- `/solutions/security`
- `/guard-patrol-software`
- `/guard-attendance-software`
- `/guard-marketplace`
- `/radios-equipment`
- `/pricing`
- `/get-started`
- `/contact`
- `/guards`
- `/guards/join`
- `/join/sales`

Prioritise commercial pages and the main product journey.

Shared components must establish a coherent design standard across every route.

Legal and informational pages do not require unnecessary visual effects, but must remain consistent.

All existing navigation, SEO, canonical URLs, redirects, forms and business logic must continue to work.

## 8 — MOTION ENGINEERING REQUIREMENTS

The motion system must be designed as part of the interface architecture, not added as decoration after development.

Consider:

- Carefully timed page and section reveals.
- Scroll-linked operational storytelling.
- Layered device and software transitions.
- Product-image transformations.
- Premium hardware rail interactions.
- Sophisticated but restrained navigation transitions.
- Active-state feedback.
- Responsive depth and optical glass.
- Gesture-driven exploration where useful.
- Seamless transitions between related content states.

Select appropriate tools based on measurable requirements.

Motion for React or GSAP with ScrollTrigger may be considered for complex sequences. Use Three.js or WebGL only when they deliver clear value and remain performant.

Do not import a heavy animation stack merely to claim sophistication.

Avoid:

- Long, unnecessary intro animations.
- Constant movement behind text.
- Fake live operational data.
- Excessive parallax.
- Heavy mobile blur.
- Scrolljacking.
- Inaccessible hover-only interactions.
- Animated filler masquerading as product functionality.

Respect `prefers-reduced-motion`.

Pause or stop motion when content is off-screen where practical.

Every meaningful interaction must be usable on touchscreens and with a keyboard.

## 9 — BRAND AND PRODUCT TRUTH

These rules override decorative ambition:

- Preserve the original Signal One logo exactly.
- Preserve the approved Signal One colour system and typography.
- Preserve the organisation's positioning as a technology platform.
- Never brand customer guards or security vehicles as Signal One.
- Never display LEOS publicly.
- Never fabricate GUARD screenshots or real customer activity.
- Never suggest Guard Marketplace is already launched.
- Never claim external PSiRA verification that does not exist.
- SOS requires a mobile signal.
- Offline checkpoint storage must not be confused with offline SOS.
- Use the approved term Central Device.
- Do not invent pricing, stock availability, customer counts or performance metrics.
- Guard-day pricing must come from the existing central pricing module.
- Sales OS is internal and must not be advertised as a customer GUARD module.
- Preserve all existing compliance, privacy and commercial safeguards.

Maintain asset provenance. The founder's approved design and product-reality documents are binding constraints.

## 10 — EXECUTION METHOD

This must remain one execution stream.

### Step 1: Independent audit

Inspect ATEX, the Signal One website and its source code.

Produce a compact initial assessment covering visual hierarchy, information architecture, photography, screenshots, hardware presentation, motion, conversion and technical constraints.

This assessment is a working input, not the mission deliverable.

### Step 2: Define the final visual direction

Establish an original creative system covering typography, spacing, transitions, section architecture, visual depth, photography, hardware treatment and interaction.

Preserve the existing brand tokens.

### Step 3: Build the flagship experience

Implement the hero and principal product interaction first.

Open the actual running website in the browser.

Capture desktop and mobile screenshots.

Review the result critically.

If it looks like an ordinary B2B landing-page template, redesign it before expanding the same pattern across other pages.

### Step 4: Transform the complete site

Apply the quality standard to the product, hardware, pricing and conversion pages.

Refactor duplicated sections and unnecessary vertical space.

Retain or improve working business functionality.

### Step 5: Real-browser refinement

Use a browser to inspect actual rendered pages—not only source code.

Compare before and after at relevant viewport sizes.

Run interaction sequences.

Identify defects in spacing, cropping, responsive typography, visual hierarchy, animation timing, mobile controls and visual consistency.

Fix the problems and repeat.

### Step 6: Technical verification

Run the repository's existing quality gates and expand tests where functionality changes.

Verify production builds, TypeScript, lint, Playwright, image OCR, accessibility, forms, pricing and navigation.

Do not suppress failing tests or delete requirements to get a green result.

### Step 7: Railway preview

Deploy the mission branch to an isolated Railway preview, reusing an appropriate existing preview resource where safe.

Do not point the public domains to the preview.

Do not change the production service's source branch.

Verify that the exact preview commit is deployed and inspect it through the real preview URL.

### Step 8: Independent design review

Perform a final critical comparison against ATEX's execution quality.

Judge the first impression, motion craftsmanship, product credibility, density, responsiveness and visual consistency.

Address identified weaknesses before presenting the result.

A passing test suite is not a substitute for visual quality.

## 11 — MANDATORY VISUAL AND TECHNICAL ACCEPTANCE

Test these widths:

320, 360, 390, 430, 768, 1024, 1440, 1920 and 2560 pixels.

Capture evidence for all principal routes at representative mobile, tablet and desktop widths.

Provide:

- Before/after desktop and mobile screenshots.
- A real-browser recording showing the principal interactions and motion.
- A reduced-motion example.
- Evidence of no horizontal overflow.
- Correct mobile navigation, touch behaviour and meaningful fallback interactions.
- Hardware and product image-resolution checks.
- Form and CTA verification.
- Accessibility and keyboard checks.
- Build, lint, TypeScript, brand and image-safety test results.
- Lighthouse results for the principal routes.

Target:

- Mobile Lighthouse Performance at least 90 for key landing pages.
- LCP under 2.5 seconds where realistically measurable.
- INP under 200 milliseconds where field measurements are available.
- CLS below 0.05.
- WCAG 2.2 AA accessibility.

Do not claim real-user Core Web Vitals from synthetic Lighthouse data.

Do not sacrifice substantial product credibility for a higher animation score.

## 12 — FAILURE CONDITIONS

The mission fails its design acceptance if:

- The result is essentially the previous website with one or two extra animations.
- Only the homepage receives meaningful attention.
- Most screens remain text-heavy while the product remains visually invisible.
- The interactive sections look like generic dashboards or administrative widgets.
- The website becomes longer without communicating more value.
- Motion is decorative rather than explanatory.
- Mobile becomes a stacked desktop layout with reduced font sizes.
- The original brand changes.
- GUARD functionality or customer evidence is fabricated.
- Builds pass but screenshots reveal a weak design.
- A preview is presented as though it were deployed to production.
- Outstanding blockers are hidden or falsely marked complete.

## 13 — SCOPE AND COST CONTROL

Execute the achievable website transformation as one mission today.

Do not artificially stop after a small percentage of the work.

Do not start additional repositories, redundant branches or unrelated engineering programmes.

Use existing free or installed dependencies where they meet the engineering requirements. Do not make unapproved purchases, API-credit expenditures or paid media acquisitions.

Use efficient verification checkpoints so development does not waste time rebuilding unchanged work.

If a mandatory dependency is missing, complete the unaffected work and record the precise blocker, evidence and recommended resolution.

Never circumvent quality, privacy or product-truth rules to meet the deadline.

## 14 — DELIVERY CONTRACT

Produce one coherent draft pull request against `main`.

Deliver:

1. A genuinely transformed website implementation.
2. An isolated working Railway preview URL.
3. Before-and-after desktop/mobile images.
4. An actual browser-recorded motion demonstration.
5. An interaction inventory identifying where motion is implemented and why.
6. Complete automated QA results and a performance report.
7. A concise list of any genuine missing assets, credentials or approvals.
8. A clear verdict: READY FOR FOUNDER REVIEW, BLOCKED, or NOT READY.

Keep the production website untouched until the founder explicitly approves release.

Do not merge, change production DNS, alter production Railway source configuration or deploy to the public domains without explicit authorisation.

## FINAL COMMAND

**BEGIN THE IMPLEMENTATION NOW.**

First verify repository access, read the binding project documents and inspect the benchmark through a real browser.

Then establish the creative direction and immediately proceed into implementation.

Use one continuous mission, with clear progress checkpoints and working code.

Do not ask for approval after every routine engineering decision.

Do not end the mission with a report describing what should be built.

Build it, run it, review it, improve it and provide visual evidence of the result.

The definition of success is not that the website has more movement.

**The definition of success is that Signal One becomes a compelling, premium, credible interactive technology experience that the founder can inspect and approve with confidence.**