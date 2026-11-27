# Commercial ecosystem reconciliation — founder directive 2026-11-27

This is the reconciliation the directive asks for (§17) before any major architectural change.

- **Trees read:**
  - website `claude/peaceful-johnson-azma60` @ `3ad3bf6`;
  - LEOS `origin/main` @ `151936f4` (read-only).
- **Earlier work this builds on:**
  - `LEOS_COMMERCIAL_CAPABILITY.md` (offer models vs LEOS, file:line);
  - `SITE_INTEGRATION.md` (intake contract);
  - `COMMERCIAL_REVIEW_RECONCILIATION.md`;
  - `HERO_RECOMPOSITION_2026-11-27.md`.
- **No production change is made by any of this.**

## 1. What already exists

| Area | Website | LEOS |
|---|---|---|
| Hardware catalogue | `app/lib/catalogue.ts`: Hytera PNC360S, P30 Lite PoC, P30G Pro (name only), EasyTalk E600, the PTT + SIM service, Teltonika FMC920 and FMB920, and the Hytera SC780. Every item is "By quote"; the site holds no stock or prices. | Products, quote lines, and the quote types `rental`, `outright_sale`, `hybrid`, `recurring` and `bundled`. Outright sale works end to end; hybrid does not invoice hardware (GAP-HYB-1). |
| Purchasing journeys | Four journeys: Buy & Connect, Managed Fleet Rental, Already Own Radios, Help Me Choose. There is one quote form (`EquipmentQuoteForm`, intent `equipment-rental-quote`) and an offers page with components, industries and FAQ. | Quotes, contracts, invoices and manual EFT. PayFast is switched off, and there are no debit orders. Rental terms are fixed at 12/24/36 months in three places. |
| Subscriptions and managed connectivity | Explained as a separate monthly line: platform, SIM and data. | `platform_entitlements` (pocstar, hytalk, zello) and SIM billing records exist, but nothing creates, expires or renews them from a sale (see the capability doc §1). |
| Lead capture | Five forms on intake contract v1.2.0, with kinds `client`, `guard` and `sales`. Intents: consultation, company-onboarding, equipment-rental-quote, tracking-quote, bodycam-rental-quote, marketplace-interest, guard-profile and sales-representative-application. Success is shown only on a persisted receipt; until then forms offer a truthful email route. | The receiver is in #756 (r2), which is **not merged**. Production has no receiver, so every form uses email today. |
| Sales recruitment | `/join/sales`, linked from the header as "Careers": "Sales representative", framed as hiring. | Sales OS (rep surfaces, queue) and a full commission engine (`commission_*` services: plans, accrual, ledger, payouts, fraud detection) for **internal reps** who are LEOS users. |
| Resellers | None. "Reseller & business partnerships" exists only as an interest label in the Connect business-card flow. | `reseller_billing_service.ts` covers **resellers of the LEOS SaaS** (tenant hierarchy, revenue share). It does **not** model hardware dealers. There are no wholesale price lists, dealer accounts or dealer pricing tiers. |
| Technology partnerships | None (generic contact form only). | `partner.routes.ts` covers API keys, partner analytics and a marketplace for LEOS integrations, not commercial partnerships. |
| Customer account | **No sign-in link anywhere on the site.** | A customer portal at `/portal` with quotes, invoices (with a pay flow; payments switched off), documents, assets, support, users and policies. Onboarding activates a login only; there is no KYC (capability doc §8). |
| Software | 1GUARD: landing pages, pricing and trial request. "1Service" is "in development" across 14 files. | 1GUARD is a separate repository (`signal-one-guard`). |
| Navigation | A single-row floating glass header: 1GUARD, Communications, Pricing, 1Service, Hire Guards, plus For guards and Careers. There are no dropdowns. | — |
| Hero | Recomposed and on staging: the interactive radio is the **P30 Lite**. | — |

## 2. What can be retained

- **Retained as built:**
  - the immersive visual system (depth, materials, the hero composition, the glass header);
  - the four communications journeys and the components / industries / FAQ content;
  - the quote form and its truthful fallback;
  - the intake contract mechanism;
  - the availability model, where `by_quote` stays the default and anything stronger needs LEOS;
  - the 1GUARD pages and trial journey.
- **Retained, with a change for partners:** the commission engine and Sales OS in LEOS are the right foundation for sales partners and should not be duplicated (§5).
- **Retained, linked rather than rebuilt:** the LEOS customer portal should be linked, not rebuilt (§3).

## 3. What requires refinement

| Item | Refinement |
|---|---|
| **EasyTalk E600** | **Done in this cycle:** it is "Coming soon". Its card reads "Register interest"; the form option is "EasyTalk E600 (coming soon, register interest)", with the note "no order, deposit or payment is taken" and no rental term. It has been removed from the rental page's description. Tests cover it. |
| Purchasing options | Today the site says "buy, rent, connect, help me choose". The site must also show these routes: corporate/fleet, wholesale (via reseller application only) and annual package. It must not promise financing, credit or unapproved terms. The quote form gets a "Purchase type" choice; the price stays in LEOS. |
| Equipment vs service | A clearer side-by-side panel: **the radio you own** versus **the service you subscribe to** (platform, SIM, data, dispatcher, support). It will name no third-party platform as ours and say nothing about unlimited data. |
| Header | Today it has 7 flat links. It needs grouped menus (§4) inside the same single-row glass header. |
| "Careers" → sales | Split this in two: employment, if any, stays under Careers; the **independent Sales Partner** programme gets its own page. |
| Customer access | Add "Sign in" for customers. **Blocker:** the portal lives at `app.lancesatsuppliers.co.za`, which exposes the registered entity name you asked to keep away from the public. See §6. |
| 1Service / 1Serve | Naming only. Nothing is renamed until you confirm. |
| Hero radio | It shows the P30 Lite. It switches to the flagship only once that model's manufacturer image is verified (§6). |

## 4. New customer and partner journeys required

The P0 items are in priority order.

1. **P0 — Hytera flagship product page and catalogue entry.**
   - It has a dedicated landing page and a homepage feature, with purchase, corporate/fleet and managed-communications routes, all by quote.
   - It makes no stock claim until stock is received and LEOS confirms availability. Procurement quantities and costs are never shown.
   - **Blocked on the model designation (§6).**
2. **P0 — Become a Reseller** (`/partners/reseller`):
   - who it is for (dealers, security suppliers, IT, telecoms, distributors, security companies, retailers);
   - the benefits, worded as "approved resellers can …", with no prices, discounts or credit terms;
   - a qualification application: company, registration status (yes/no only, no document uploads), regions, customer segments, current brands, expected volume band, and how they sell;
   - an outcome stated as "we review every application; approval is not automatic".
3. **P0 — Become a Sales Partner** (`/partners/sales`): an independent, non-employment programme. It shows what partners can do now (introduce customers) and what comes later (materials, lead submission, tracking and commissions in Sales OS). It publishes no commission rates, earnings or payment terms.
4. **P0 — Homepage section "Grow your business with Signal One."** Two actions, Reseller and Sales Partner, placed above the footer band, not inside it.
5. **P1 — Technology Partnerships** (`/partners/technology`): integrations, regional distribution, enterprise implementation and strategic collaboration, kept separate from customer enquiries.
6. **P1 — Customer sign-in and support hub:** a link to the existing LEOS portal plus support, documentation and FAQ.
7. **P1 — Navigation:** grouped menus, as follows.
   - **Communications:** two-way radios, push-to-talk, managed connectivity, dispatcher, corporate.
   - **Software:** 1GUARD and 1Serve*.
   - **Industries.**
   - **Partners.**
   - **Resources.**
   - **Company.**
   - **Sign in.**

   Industries pages exist only as content sections today; each would need real content before it is linked.

## 5. What depends on LEOS

| Capability | LEOS state | Website until then |
|---|---|---|
| Reseller and Sales Partner applications stored as records | **Gap.** The intake contract has no `reseller-application`, `sales-partner-application`, `technology-partnership` or `product-interest` intents. Adding them is a **minor contract version** (v1.3): LEOS deploys first, then the site. The receiver itself is not yet merged (#756). | The forms work through the existing truthful email route (sales@), exactly as all forms do in production today. |
| Dealer accounts, wholesale pricing, dealer tiers | **Not implemented.** `reseller_billing` is for SaaS tenants, not hardware dealers. | No wholesale prices anywhere on the site. "Wholesale pricing is available to approved reseller accounts." |
| Sales partner records, attribution, commissions | The commission engine and Sales OS exist for **internal rep users**. Partner onboarding, the external partner role, referral attribution from the website, and payout terms for non-employees are **gaps**, and need design, not duplication. | The application only. A later "Partner sign-in" goes to Sales OS once the partner role exists. |
| Product availability and stock | **Not implemented** (no public availability read, stock not linked to catalogue). | "By quote" only. No "in stock" until LEOS can say so. |
| Subscriptions and renewals for customers | Partial: entitlements exist, but are not created from sales and have no expiry or renewal (capability doc §1). | Explained as a monthly line set out in the written quote. |
| Hybrid (hardware + service) invoicing | GAP-HYB-1. | Quote as an outright sale plus a separate service line. |
| Payments online, financing | PayFast is off, there are no debit orders, and there is no external-financier model. | No online payment, financing or credit is offered. |
| Customer portal features (orders, renewals, device requests) | The portal has quotes, invoices, documents, assets and support. Orders, renewals and device requests are partial or missing. | Link only to what exists. |

## 6. What requires founder approval

1. **The flagship model designation.**
   - Hytera's own pages list the **P30** and **P30 Lite**. No manufacturer page for a "P30 Pro" was found ([P30](https://www.hytera.com/en/product-new/lte-broadband/poc-radio/p30.html), [P30 Lite](https://www.hytera.com/eu/products/poc-radio/p30-lite)).
   - Your supplier's earlier line read "P30G PRO PORTABLE POC BT,GPS".
   - Please send the supplier quote or invoice line and a photo of the box label or the model plate on the radio for the 142 units. Until then the flagship page cannot name, picture or specify the model, and the hero keeps the P30 Lite.
2. **Navigation restructure** into grouped menus (§4.7).
3. **1Service → 1Serve:** confirm the public name.
4. **Customer sign-in domain:** the portal is on `app.lancesatsuppliers.co.za`. Linking it publicly exposes the registered entity name. Options:
   - a Signal One subdomain for the portal (for example `portal.signalone.co.za`, an infrastructure change in LEOS);
   - linking as it is;
   - no public link yet.
5. **Reseller and partner benefit wording**, before publication: what an approved reseller actually receives (training, materials, support, account manager, software access).
6. **The independent Sales Partner programme terms:** contractor status, and whether partners may quote or only refer. Commission rates are never published.
7. **Intake contract v1.3** with the four new intents, and its LEOS release. This builds on #756 being merged first.
8. Carried over:
   - the site-wide shutter duration;
   - the choice of hero photograph (ChatGPT supplies the candidates; no competing concepts here);
   - a curated 1GUARD demo tenant for screenshots.

## 7. What requires regulatory, commercial or legal documentation

- **EasyTalk E600:** regulatory type approval (ICASA) and procurement agreement. Until then it is interest only.
- **P30-family flagship:** type-approval status for the exact supplied variant (ICASA), the manufacturer datasheet for that variant, and the authorisation to use the manufacturer's imagery.
- **Distribution:**
  - a Hytera distribution or reseller authorisation, before claiming dealer status or appointing sub-resellers;
  - a reseller agreement template;
  - a sales partner agreement (independent contractor, POPIA for referred leads, commission terms kept off the website).
- **Data limits:** the managed connectivity fair-use and data-limit terms, before any data-allowance wording.
- **Financing:** an approved finance partner agreement, before any financing mention.
- **Legal:** ECT Act s43 disclosures and the privacy notice update for partner applications. This links to the existing legal review item.

## 8. What remains unavailable until operationally qualified

- Online purchase, checkout or payment of any kind.
- "In stock" or delivery-time claims.
- Financing, credit and instalment offers.
- Wholesale pricing and dealer accounts.
- Partner dashboards, lead tracking, commission views and payouts.
- Self-service subscriptions, renewals and device requests.
- E600 orders.
- Rental terms other than those LEOS can contract (12/24/36, with the TERM-1 and TEN-1 qualifications open).
- Online form submission into LEOS (#756 and the receiver credential).

## Proposed execution, once approved

| Step | Work | Needs |
|---|---|---|
| A (P0, now) | **Done 2026-11-27:**<br>• The E600 is "Coming soon", with an interest-only journey: no rental term, and "no order, deposit or payment is taken".<br>• New `/radios-equipment#ways-to-buy` section, "Buy the radio. Subscribe to the service.": six routes to buy, no prices, no financing.<br>Tests and screenshots cover both. | Nothing |
| B (P0) | Reseller page and application; Sales Partner page and application; homepage "Grow your business" section. All submit through the email route, with intents ready for v1.3. | Items 5 and 6 of §6 |
| C (P0) | Flagship product page and hero radio swap. | Item 1 of §6 |
| D (P1) | Grouped navigation, Technology Partnerships, sign-in, and the support / resources hub. | Items 2 and 4 of §6 |
| E (P1, LEOS) | Contract v1.3 intents, dealer account model, partner role and attribution in Sales OS. | Item 7 of §6, and #756 |

## Addendum: dealer workspace in Sales OS (founder, 2026-11-27)

The full assessment, with file:line evidence, is in `DEALER_WORKSPACE_GAP_ASSESSMENT.md`. In short:

- **What exists:** LEOS has **no hardware-dealer concept**. There is no dealer organisation, wholesale price list, dealer stock or licence ledger. `reseller_billing_service.ts` covers resellers of the LEOS software itself.
- **Recommended model:**
  - Each approved dealer is **its own LEOS tenant**, inside the same Sales OS app.
  - On Signal One's side the dealer is an ordinary wholesale customer record.
  - The two are linked by a platform-level dealer relationship. Only narrow, logged channels cross between them: delivered stock, referred leads, licence allotments, and catalogue and sales packs.
  - This reuses the one isolation boundary LEOS already enforces: 489 `requireTenantId(` call sites in the repositories, and cross-tenant lookups that return 404.
- **Must exist before any dealer gets access:**
  - **Database-layer isolation does not exist today.** There is no row-level security. Building it is an Architect decision and a platform-wide change.
  - **Dealer roles must fail closed.** Staff roles fall back to Signal One's tenant (`packages/auth/src/auth_service.ts`), so dealer roles must be membership-only and never land there.
- **Phases:**
  - 0: decisions and ADR
  - 1: multi-tenant hardening (TEN-1, ALLOC, ENV-1, a two-tenant adversarial suite)
  - 2: identity and roles
  - 3: dealer workspace
  - 4: lead distribution, building on the #756 queue
  - 5: wholesale into dealer stock
  - 6: dealer stock and retail
  - 7: licence ledger
  - 8: SIMs and activation
  - 9: oversight and reporting

  Phases 1, 2, 4, 5, 7 and 8 stop for pre-merge audit. None of this interrupts the website launch or #753/#756.
- **Decisions needed:**
  - **From the PoC platform suppliers:** whether licences are divisible or transferable, and their term and renewal rules. Until answered, a seat is treated as non-divisible and non-transferable.
  - **From you:**
    - the dealer data-access policy;
    - whether dealers invoice their customers through LEOS;
    - wholesale tiers and dealer credit;
    - retail pricing policy;
    - territory and exclusivity rules, and the POPIA consent wording for referring a lead to a dealer.
- **Website:** the Become a Reseller page (step B) will describe the dealer workspace in Sales OS only as "for approved dealers, once qualified". It will not present it as available now.

