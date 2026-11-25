# Customer journeys — Phase 1 independent baseline

**Captured:** 2026-11-25, live https://signalone.co.za (production, `main` @ `8e89d24`)
**Method:** fresh Chromium contexts (no cookies, no auth, no stored state) driven by Playwright in a Claude Code cloud session. Pages were experienced by natural navigation from the homepage before any source code was read. Full-page and per-viewport scroll-walk captures at 1440×900 and 390×844 (evidence under `docs/launch/evidence/`).

**What this is and is not.** These are *simulated persona walkthroughs and heuristic evaluation by an agent*. They are not observations of real customers and record no real emotions. Hypotheses about what a buyer needs are marked as hypotheses until moderated testing (`USABILITY_TEST_PROTOCOL.md`) validates them.

**Safety limit:** no live form was submitted. Submitting the production quote form (even with obvious test data) was refused by the session's permission policy; the submit behaviour was established from the page's own notice, `GET /api/intake/status` (`{"onlineSubmissionAvailable":false}`) and source (`app/api/intake/route.ts`, `SITE_INTEGRATION.md`).

---

## J1 — Security operations director: rent radios for a new contract (homepage entry)

| Step | What happened | Friction / missing |
|---|---|---|
| Land on `/` (1440×900) | Hero: guard + chef in a restaurant, "Run your business. As one." Nav: 1GUARD, 1Service, Hire Guards, Equipment, For guards, Careers, *Get 14 Day Free Trial*. | Nothing in the first viewport says Signal One sells or rents radios. Two of four primary nav items are products that are not available (1Service *in development*, Hire Guards *MVP in development*). |
| Scroll for radios | Equipment section ("The right technology. For the real job.") appears at viewport 8 of 12 (~5 900 px down). | Commercially available product is buried below 1Service ("in development") and a "vision" journey section. |
| Click **Equipment** in nav → `/equipment-marketplace` | Eyebrow "1GUARD · Equipment marketplace"; 4 category cards with no images, no specs. | Equipment is a separate Signal One pathway (brand architecture, 30 Oct) — the 1GUARD eyebrow is wrong. "Buying or renting?" section does not answer the question. |
| → "Request equipment pricing" → `/radios-equipment#quote` | Catalogue cards: Hytera PNC360S, P30 Lite PoC, E600 PoC LTE (no image), PTT platform + SIM & data. One-line descriptions. | No specifications (battery, IP rating, network/bands, GPS, SOS, weight). No indication of price range, minimum quantity, deposit, delivery time, coverage, damage/loss terms. |
| Quote form | Native validation works; rental term (12/24/36) appears when "Rent" is selected; consent is explicit and unticked. **Notice: "Requests are currently handled by email… Your request is only sent when you send that email."** | The quote is not captured by Signal One. A visitor on a work PC without a configured mail client, or on a phone that opens the wrong app, loses the request with no record. No lead reaches Sales OS. No conversion can be attributed. |
| Outcome | **Task can only complete outside the website (own email app).** | — |

## J2 — Google Ads click straight to `/ptt-radio-rental`

| Viewport | Observation |
|---|---|
| 390×844 | Strong: H1 "Push-to-talk radios for your security contracts.", Midrand→Pretoria example, 12/24/36-month terms, primary CTA above the fold. |
| 1440×900 | Weak: H1 begins ~600 px down beside a tall product column; **primary CTA is below the first viewport**; top-left third is empty. |
| Body | Product list appears twice (hero card list and "What we rent"). "What it does not do yet" is an H2-level negative. No FAQ for deposit/damage/delivery/coverage/early termination. Footer band pushes the unrelated 1GUARD free trial. |
| Names | "Signal One Guard", "Signal One Security", "The Signal One Security platform" — none is the approved product name `1GUARD`. |

## J3 — Procurement / financial director comparing buy vs rent

- No price, price band or total-cost-of-ownership framing anywhere (deliberately "quoted, not listed"). Hypothesis: procurement needs at least what drives the price (term, quantity, SIM/data, platform) and what is included, to budget before requesting a quote.
- No company credentials visible: no physical address, phone, registration number, VAT number, B-BBEE level, years trading or customer references. Only `sales@signalone.co.za`. *(Facts must come from the founder — not invented.)*
- "Compare buying and renting" exists only as a form option, not as content.

## J4 — Security company owner evaluating 1GUARD

- `/solutions/security` and `/pricing` are clear and specific (R2,50 per guard per day excl. VAT, calculator, worked examples, explicit pilot status).
- Trial request at `/get-started` is also an email hand-off ("Trial requests are currently handled by email").
- Product naming drifts between 1GUARD / Signal One Guard / Signal One Security.

## J5 — Credibility seeker ("who are these people?")

- No About page. The careers header's "About Signal One" link goes to `/`.
- No phone, address, team, history, partners or certifications.
- Imagery is labelled "Illustrative scene" throughout (honest, but every person on the site is illustrative).

## J6 — Existing customer needing support

- No support route, support email, phone or status page. Only sales email. **Dead end.**

## J7 — Security officer (guard)

- `/guards` is well targeted (PSiRA explanation, POPIA, profile creation) with its own header. Footer still shows the business "Get 14 Day Free Trial" band — irrelevant to this audience.

## J8 — Job applicant

- `/join/sales` (Careers) is clear; 7-step application is also an email hand-off. Not in the sitemap.

## J9 — Mobile visitor (390×844)

- Menu opens as a full-screen sheet, Escape closes it and returns focus to the Menu button. Radios/rental are not in the menu's primary list (only under the footer-style list).
- Homepage is 12 578 px tall (~15 screens).
- Lab LCP (Moto G4 profile, 1.6 Mbps, 150 ms RTT, 4× CPU): homepage **4.4 s** (hero photo) vs target 2.5 s; `/ptt-radio-rental` 1.0 s; `/radios-equipment` 1.1 s. CLS ≤ 0.025. *Lab data, not field data.*

## J10 — Keyboard and assistive technology (spot checks)

- Skip link present; focus rings visible on every tab stop sampled; Escape closes the mobile menu.
- 200 % root text size at 1280 px: no horizontal overflow on `/radios-equipment`.
- Full axe-core results per route and width: `ROUTE_INVENTORY.md`.

## Internal entry points (unauthenticated)

| App | URL | Observed |
|---|---|---|
| Real Sales OS (LEOS web) | app.lancesatsuppliers.co.za | Plain white "LEOS" login card. Not the approved shell. Branding call to `api.lancesatsuppliers.co.za` blocked from this session. |
| Approved Sales OS preview | sales-os-preview-web-preview.up.railway.app | Photographic full-bleed shell, Signal One + SALES OS lockup, glass sign-in card. |
| 1GUARD staging | web-staging-f99d.up.railway.app | Same shell family, 1GUARD lockup. |

Behind-login review is **blocked**: no authorised test credentials are available to this session.
