# Signal Connect V3 — Execution 02D evidence and handover

**Date:** 2026-10-23
**Status:** **Code GREEN / dedicated QA Vercel deployment READY / public release STOP**
**Scope:** Identity-first visitor card, immediate vCard, transparent optional contact handoff, restrained design-system implementation.
**Code commit:** `0eb5c50f418b6b521bcf0478536ccf6d691891a6`
**GitHub run:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/actions/runs/39970956196
**CI artifact:** `signal-connect-foundation-evidence`, artifact ID `12508852300`, screenshot set and Playwright report.
**QA Vercel deployment:** `dpl_71xbMcLpY5bxMW7fNmgyXk3RdWYA`
**Visitor:** https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe
**Presenter:** https://signal-connect-v3-source-preview.vercel.app/present/andisiwe

## 1. Functional implementation

- New `components/VisitorIdentity.tsx`: one founder-specific, identity-first screen: Andisiwe Satshwa, title **Founder**, Signal One Integrated Systems, concise tagline. A public vCard is the primary visitor action, never behind registration, marketing, exchange, story, or lead consent.
- Existing `ContactExchange` now renders the single primary Save Contact CTA in visitor mode; presenter mode still provides the quieter secondary card action and website link. The preexisting `GET /contact/andisiwe` route remains unchanged.
- The visitor can choose **Share my details**, which opens a `mailto:` introduction to the established public company inbox, with prefilled but non-personal template fields. **Nothing is collected or sent by the app.** The user must choose Send in the mail app, and opening mailto is not proof of receipt.
- Visitor can choose **Visit Signal One**; it opens the real website, not a disguised or imaginary story.
- **Discover Signal One / WIN · HIRE · RUN · EQUIP · PROVE** is noninteractive and explicitly labelled **Coming soon**. No dead story button, fake submit, fictitious lead save, or unprovided founder portrait.
- Clear line: "Viewing this card does not submit your contact details or create a lead."
- The change adds no analytics, passive lead creation, forms, cookie state, new API, hardware availability claims or PII service-worker caching.

## 2. Visual discipline

- New component-scoped `components/VisitorIdentity.module.css` owns all visitor design rules; no global-style override layering.
- Canonical Inter, primary `#0EA5E9`, 10px radius CTA/controls, existing dark surface tokens and 14px floor; 56px Save Contact CTA.
- Focus-visible remains global and accessible. Secondary choices are visibly clickable links; the not-yet-operational story is prose, not an inert button.
- No simulated phone shell, nested glass frames, artificial founder photo, metallic effect, blur field, neon shadow or `!important`.
- Deleted obsolete `.visitor` / `.lead` global CSS from the old placeholder rather than obscuring it with another selector.

## 3. Source changes

- Added `signal-connect/components/VisitorIdentity.tsx`
- Added `signal-connect/components/VisitorIdentity.module.css`
- Updated `signal-connect/app/connect/[profile]/page.tsx`
- Updated `signal-connect/components/ContactExchange.tsx`
- Updated `signal-connect/styles/global.css`
- Updated `signal-connect/tests/foundation.spec.ts`
- Added `signal-connect/tests/visitor-identity.spec.ts`

## 4. Test evidence — exact code commit

CI run `39970956196` completed **SUCCESS**:
- npm ci: PASS
- npm test (source/unit contracts): PASS
- ESLint: PASS
- Next.js production build: PASS
- TypeScript: PASS
- Playwright Chromium: **34 passed (22.3s)**
- Independent ZBar decode of QR screenshot: PASS, decoded exactly
  `https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe`
- Screenshots: 320/360/390/430/768/1024/1440 visitor views plus 390px short-height view; presenter baseline images remain.
- Browser assertions: identity heading, founder title, 56px Save Contact, vCard download filename and content, no personal phone field, email handoff with prefilled template, coming-soon story state, no fake form/buttons, a11y axe, Inter, 10px radius, no horizontal overflow, above-fold Save CTA on 390×844, 390×667 scroll and unknown profile 404.

First in-flight commits briefly failed the old foundation test that still expected the outdated marketing headline as the h1. This was a true test-contract mismatch from the planned identity-first design. It was corrected, and the exact later code commit passed all tests.

## 5. QA deployment and remaining stop gates

- The dedicated V3 QA project `prj_oUkv8L0YPm7yTTAiuhqlFRxW8ePz` built the exact application file set, deployment `dpl_71xbMcLpY5bxMW7fNmgyXk3RdWYA`, status READY, assigned stable alias `signal-connect-v3-source-preview.vercel.app`. V2/website deployments untouched.
- Source-upload deployment is still a **temporary QA mechanism** because the team's permanent GitHub-to-Vercel project integration is not authorized. This does not satisfy the final source-controlled rollout gate.
- Live HTTP attempts by web and the Vercel connector could not independently open the public pages due tool access restrictions; a READY project and disabled SSO setting is not physical end-user proof.
- Real iPhone Safari and Android Chrome, physical scan, contact import, keyboard/VoiceOver and final founder visual signoff remain outstanding.
- **Release STOP:** Story Execution 03A/03B, optional reverse-exchange form + truthful manual handoff refinement (04A), and durable Sales OS receiver (04B) not complete. No claim of stored leads. No printed or permanently NFC-encoded preview URL.

**Next authorised task:** Execution 03A only — provenance-reviewed five-chapter photography and factual editorial copy freeze, without layering V2 CSS or implementing story interaction prematurely.
