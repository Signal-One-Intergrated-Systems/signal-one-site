# Independent commercial review: reconciliation against the candidate

Inputs:
- the external review "Signal One website review and implementation brief" (point-in-time, public site only);
- founder directives of 2026-11-26: the commercial review mandate, the bright website assets v2, and the commercial offer architecture.

Verified against live production (`signalone.co.za`, site `main` `8e89d24`) and against the candidate branch `claude/peaceful-johnson-azma60` (draft PR #102). The staging copy is https://web-staging-review-production.up.railway.app.

**Nothing here is merged or deployed.**

Status key:
- **Resolved**: already fixed before this round.
- **Implemented**: done in this round, on the candidate.
- **Partial**: some of it is done; the table says which part.
- **Outstanding**: confirmed and not yet done.
- **Evidence needed**: cannot be confirmed from here.
- **Founder/compliance**: needs a founder or compliance decision.
- **n/a**: no longer applies.

## Review findings

| # | Review finding | Verified state (live → candidate) | Status | Action / evidence |
|---|---|---|---|---|
| P1.1 | Trial and quote journeys depend on an email handoff; lead delivery untested | Live: email route. Candidate: the same truthful email route while no receiver is configured; direct submission is built (website client + LEOS receiver #749 in r2 #756) | **Partial** (commercial integration) | Receiver goes live only after the LEOS release (#757 → #755 → #756) and credential issuance. Each form says "handled by email" up front and never shows success without a persisted receipt (`IntakeAvailability.tsx`, `intake.ts`). Final r2 integration and qualification: INT2, running |
| P1.2 | Server validation, spam protection, confirmation, failure handling | Receiver: server-side allow-list per intent, rate limit, idempotency, receipt-only success, mailto fallback on failure (audited L2/AUD1/AUD2) | **Resolved** (built, not deployed) | `contracts/website-intake.contract.v1.json` v1.2.0; LEOS audits in `docs/launch/` |
| P1.3 | Keep an alternative contact route only if monitored | Founder confirmed: WhatsApp +27 77 484 4280, sales@, support@ | **Implemented** | `app/lib/site.ts`; About, Support, Contact and footer; old number removed from the public site |
| P1.4 | Proportionate fields | Quote: product, quantity, location, contact (~2 min). Onboarding: 5 steps. No identity, registration documents or payment details on any form | **Resolved** | Onboarding documents belong to secure customer onboarding, which LEOS does not have yet (capability report §8) |
| P1.5 | Response-time promise only once confirmed | None published | **Founder/compliance** | Decide an SLA, or keep none |
| P1.6 | Test entry → receipt with authorised data | Local, synthetic only (mock receiver; LEOS r2 browser qualification) | **Partial** | No production submissions. A labelled production smoke enquiry needs approval (release step J) |
| P2.1 | Supporting line under "Run your business. As one." | Live: generic SME line | **Implemented** | "Security operations software, managed business communications and connected technology for South African businesses." The locked hero's size is unchanged at 1440/1280/1024/390 (FOUNDERS LOCK tests) |
| P2.2 | Two principal paths prominent | Live: trial + "Explore the solutions" | **Implemented** | Hero: "Request a 14-day trial" and "Radios & connectivity". The homepage communications section lists the four journeys. 1Service stays labelled in development |
| P2.3 | "Get 14 Day Free Trial" implies instant access | Live: present in hero, header and footer | **Implemented** | "Request a 14-day trial" everywhere. `/get-started` explains request → eligibility → activation (start, end and data confirmed in writing) → paid continuation only on agreed terms |
| P2.4 | Pricing easy to find | Live: no Pricing in the header | **Implemented** | Header primary nav: 1GUARD · Communications · Pricing · 1Service · Hire Guards |
| P2.5 | Don't imply future modules are live | Pilot/development/coming-soon labels intact (`guardStatus.ts`); 1GUARD "onboarding its first pilot security companies" | **Resolved** | Unchanged |
| P3.1 | Company name, registration, location | Trading entity shown (Lancesat Suppliers (Pty) Ltd, from the internal record); no registration number, VAT number or address | **Founder/compliance** | Approve the trading-entity line and supply the statutory disclosures (responsible party, registration) |
| P3.2 | Product walkthrough, real screenshots, case studies | None published; no fabricated ones | **Evidence needed** | Needs an authorised demo tenant capture and permissioned pilot results |
| P3.3 | Legal pages "under legal review" | Still marked; privacy page now separates today's email route, future online submission, campaign attribution, GA/Ads (dormant) and optional marketing consent | **Partial** | Legal review, retention periods, data location and responsible party remain founder/compliance items |
| P3.4 | Security page: no data location, retention, backup, RPO/RTO or support commitments | None invented | **Founder/compliance** | Supply approved answers |
| P4.1 | Comparison information per product | Live: model and one line | **Partial** | PNC360S and P30 Lite now show specifications copied from Hytera South Africa's official pages, with the source linked. The unverified "SOS" claim on the P30 Lite was removed. SC780 (no spec table on the SA page) and FMC920/FMB920 (Teltonika datasheets) are not yet listed. E600: no image or specs until the manufacturer is confirmed |
| P4.2 | Rental inclusions inconsistent | Live: "with PTT service and data" vs "ask about PTT, SIM and data" | **Implemented** | One model across the site: the radio (bought or rented) + optional monthly push-to-talk/SIM/data + everything else confirmed in the written quote; "nothing is included unless your quote says so" |
| P4.3 | Indicative pricing only if approved | Quote-only | **Resolved** | No prices published |
| P4.4 | Keep "renting does not connect to 1GUARD" | Present on radios, rental and FAQ | **Resolved** | — |
| P5.1 | Search Console / indexing | Not accessible from here | **Evidence needed** | Needs a Search Console user on `sc-domain:signalone.co.za` (owner adds it), then URL Inspection and sitemap submission. No deindexing is claimed |
| P5.2 | All pages share the homepage OG URL and title | Confirmed live (e.g. `/pricing` og:url = homepage) | **Implemented** | `app/lib/seo.ts` gives every page its own og:title, og:description and og:url (= canonical); a social image on every page; test in `commercial-review.spec.ts` |
| P5.3 | www and non-www both serve | Confirmed live (www → 200) | **Implemented** (takes effect on release) | `next.config.ts`: 308 from www to https://signalone.co.za with the same path and query. No loop; staging unaffected. No Cloudflare or DNS change |
| P5.4 | Duplicated "Signal One" in titles | Live: equipment marketplace title doubled | **Implemented** | Titles checked for a doubled brand in tests; the contact title was fixed |
| P5.5 | Footer email with JavaScript off | Cloudflare email obfuscation turns addresses into a script-decoded placeholder | **Implemented** | `EmailLink` emits `<!--email_off-->` so Cloudflare leaves the footer and contact addresses readable without JavaScript |
| P5.6 | Preserve robots, sitemap, canonicals, 404 | Live 404 page carried canonical "/" | **Implemented** | No site-wide canonical; the 404 has none and is noindex; staging is noindex with robots disallow-all (`SITE_NOINDEX=1`) |
| Pricing | R2.50/guard-day, 10-day minimum, carryover | Matches the pricing config (`app/lib/pricing.ts`), live since PR #92 | **Resolved** | Guard day defined on `/pricing`. No-shows, cancellations, partial and multiple shifts, carryover expiry and trial conversion remain **founder** decisions; not invented |
| Analytics | Separate trial and equipment funnels; outcomes, not clicks | `generate_lead` fires only on a receipt, de-duplicated by reference | **Implemented** | Adds `lead_journey`: radio_purchase / radio_rental / radio_own_connect / radio_help_choose / guard_trial / … Still dormant until GA4/Ads IDs and a consent decision exist. Quotes, contracts and revenue are tracked against the same enquiry in LEOS |

## Founder directive items beyond the review

| Directive | State | Note |
|---|---|---|
| Light-first visual direction + bright asset package | **In progress** (THEME, branch `wip/light-theme`) | Merged into the candidate after its full test run |
| Four journeys: Buy & Connect, Managed Fleet Rental, Already Own Radios, Help Me Choose | **Implemented** | Homepage, the "Communications" nav entry (`/radios-equipment#journeys`), rental page link, and quote-form preselection. "Already own" asks for make and model; compatibility is never assumed |
| Components: hardware, PTT, SIM, data, dispatcher, accessories, configuration, activation, support, maintenance | **Implemented** (presentation) | `app/lib/offers.ts`; "each part can be quoted on its own or together; nothing is included unless your quote says so". No internal cost, supplier or funding information |
| "One purchase. Twelve months connected." | **Prepared, not published** | `proposedPackages` (publish: false). LEOS cannot yet invoice the hardware in a hybrid deal (GAP-HYB-1); interim: an outright sale with a once-off connectivity line |
| Configurable rental terms 12/24/36 | **Partial** | The site keeps 12/24/36 "confirmed in your quote". LEOS hard-codes these three in a constant, a database check and a route, so a new term needs a migration |
| Flexible suspend/resume connectivity | **Not promised** | LEOS can suspend, but billing is one combined line, so suspending a contract would also stop rental billing. Not safe to offer yet |
| Third-party financing | **Not advertised** | Not implemented in LEOS; needs an approved partner |
| P30 Lite Pro / P30G Pro | **Prepared, not published** | `pendingVariants`: Hytera South Africa has no page for either name; needs exact names, datasheets, photos and supply confirmation |
| Availability states | **Prepared** | `availability` field and labels; everything shows "By quote" until LEOS offers a public read (none exists) |
| Industries | **Implemented** | Eight industries with use cases; no coverage or performance guarantees; no short-term event rental |
| Cross-sell | **Implemented** | 1GUARD, tracking, body cameras, dispatcher and more radios in the same quote, with the "not integrated yet" disclosure kept |
| LEOS qualification of each model | **Done** | `LEOS_COMMERCIAL_CAPABILITY.md` |
