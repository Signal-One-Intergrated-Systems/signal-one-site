# LEOS commercial capability vs Signal One offer models

**Date:** 2026-11-26 · **Repo:** `Signal-One-Intergrated-Systems/lancesat-enterprise-platform`
**Trees read:** `origin/main` @ `5efcb303` (confirmed with `git ls-remote`, 0 commits since the #753 qualification base) and
`claude/commercial-slice-qualification` (draft PR #753 @ `3761943d`). #753 changes only `product_service.ts` (lifecycle 500→422),
`observability.ts` (credential header redaction) and tests. **Every file:line below is the same on main and #753 unless noted.**
This was a read-only investigation. Nothing was run against a database, and the GAP IDs come from
`docs/release/COMMERCIAL_SLICE_QUALIFICATION.md` (#753 §5). I checked them against the code and did not re-run them.

## Summary

| # | Model | Classification | One-line gap |
|---|---|---|---|
| 1 | Buy & Connect (hardware + 12 months connected) | **Partially implemented** (+ depends on commercial approval and a PTT/SIM provider) | The hybrid quote never invoices or delivers the hardware (GAP-HYB-1). Entitlement records with start/end/renewal exist but are only created by hand. Conversion never creates them, nothing expires them, and nothing raises a renewal invoice. |
| 2 | Managed fleet rental | **Core path supported and qualified locally (#753, not merged). Full managed-fleet scope partially implemented.** | Audit-class gaps block launch: TEN-1, ALLOC-1/2, PAY-1/2, TERM-1, EXP-1. Terms are hard-coded to 12/24/36 in three places. The deposit is shown on the quote but never invoiced. Adding units does not change billing. No minimum term is enforced. Contract end dates are ignored by billing. |
| 3 | Already own radios | **Partially implemented** | A connectivity-only contract can be expressed. No column separates customer-owned from Signal One-owned equipment (only a free-text note). There is no compatibility assessment. A recurring quote also creates a *rental agreement* on conversion. |
| 4 | Flexible managed connectivity | **Partially implemented** | Suspend and reactivate exist at SIM, entitlement and contract level. Billing is one blended schedule per contract, so suspending connectivity billing also suspends the rental obligation, and suspending a SIM or entitlement does not stop billing. There is no minimum-commitment rule. |
| 5 | Third-party equipment financing | **Not implemented** (+ depends on a third party and commercial approval) | The only "funder" model is Signal One's own facility register (read-only). Nothing represents a customer's external financier. |
| 6 | Component catalogue | **Partially implemented** | Each component can be its own catalogue product and quote line. There is no package or bundle composition ("bundled" is only a label). Recurring invoices collapse to one line. |
| 7 | Availability states | **Not implemented** (no public read) | No public or read-only availability endpoint. Stock records are not linked to catalogue products. Nothing calls the reservation API. No "available to order" or lead-time data exists. |
| 8 | Customer onboarding documents (KYC) | **Not implemented** | Customer onboarding only activates a login account. Customers cannot upload documents. There is no KYC checklist or verification state, and no debit-order mandate. |

---

## 1. Buy & Connect: Partially implemented

**What exists**
- Quote types `rental | outright_sale | hybrid | recurring | bundled` (`packages/database/src/schema/revenue/quotes.ts:37-43`). One quote can carry once-off and recurring lines (`quote_line_items.ts:35-44`).
- **Outright-sale path works end to end** (#753 PASS). On conversion it creates a sale delivery (`apps/api/src/services/quote_conversion_service.ts:741-756`) and auto-raises a sale invoice over **all** chargeable lines (`invoice_generation_service.ts:311-345`, `quote_chargeable.ts:52-58`). So "radio + once-off '12 months connectivity' line" can be quoted, invoiced and delivered today as an `outright_sale`. Discounted lines refuse the invoice (`invoice_generation_service.ts:330-335`).
- **Entitlement concept exists.** `platform_entitlements` has `platform` (pocstar|hytalk|zello|other), `status` active|suspended|expired, `quantity`, `start_date`, `end_date` and `renewal_date` (`packages/database/src/schema/platform/platform_entitlements.ts:1-12, 33-49`). It has create, suspend and renew routes and a `/renewals` due-list (`apps/api/src/routes/platform_entitlements.routes.ts:141, 213, 229`). Renew sets the status back to `active` (`apps/api/src/repositories/platform_entitlement_repository.ts:247`).
- **SIM service period exists.** `telecom_billing_records` has `billing_start_date`, `billing_end_date`, `renewal_status` (active→expiring→renewal_pending→renewed/renewal_failed/expired) and `renewal_due_date` (`packages/database/src/schema/telecom/telecom.ts:315-357`), plus service methods `identifyExpiringServices` and `createRenewalCandidates` (`telecom_service.ts:743, 769`).
- **Activation date exists.** `service_activations.activated_at` / `suspended_at` (`service_activations.ts:33-63`).

**Gaps**
- **GAP-HYB-1 (confirmed in code).** Only `outright_sale` gets a sale invoice (`quote_conversion_service.ts:930-934`; the guard is `invoice_generation_service.ts:311-316`) and a sale delivery (`:741`). A hybrid with recurring revenue instead gets a schedule, a *rental agreement* and a deployment (`:618-634, :774-813`). A fully prepaid hybrid (recurring = 0) gets **no invoice, schedule or delivery at all**.
- **Conversion never creates an entitlement or service period.** `platformEntitlementService.create` is called only from the manual route and the data-migration importer (`apps/api/src/routes/migration.routes.ts:520`).
- **Nothing expires entitlements.** `expire()` exists (`platform_entitlement_service.ts:112`) but has no route and no scheduler. `identifyExpiringServices` / `createRenewalCandidates` have no caller outside the service.
- **No renewal billing.** Entitlement and SIM renewal states are tracking only. `telecom_billing_records` is never read by invoicing (only `drizzle_telecom_repository.ts` references it).
- `subscription_plan_service.ts` and `renewal_automation_service.ts` are **LEOS SaaS tenant** plans and renewals. They are not customer service entitlements, so do not reuse them for this.

## 2. Managed fleet rental: core supported and qualified locally, full scope partial

| Capability | State | Evidence |
|---|---|---|
| Contract periods | **Hard-coded, not configuration.** 12/24/36 appears in 3 places: TS constant `TERM_PRICE_FIXED_KEYS` (`packages/types/src/domain/product.types.ts:64`), DB CHECK `term_months IN (12, 24, 36)` (`apps/api/migrations/0154_quote_line_item_term.sql:96`; drizzle `quote_line_items.ts:128-133`), and route Zod `z.enum(["12","24","36"])` (`apps/api/src/routes/quote.routes.ts:129`). Adding a term needs a migration (V4 says this is deliberate: `product_term_prices.ts:26`). Rolling is refused for rental products (V3, `product_term_prices.ts:23-25`). | |
| Term prices via API | **GAP-CAT-1**: `ProductPricingSchema` has no `termPrices`, so Zod strips it on create/update | `apps/api/src/schemas/product.schemas.ts:38-59` |
| Quantities / quotation | Supported (min quantity, price lock to term price) | #753 §2 step 5; `products.ts` `min_quantity` |
| Customer qualification | **Not implemented** beyond lead status. `clients.credit_limit_cents` and `onboarding_status` exist (`crm/clients.ts:85-89`) but nothing enforces them (no `creditLimit` read in services) | grep |
| Deposits | **Displayed on the quote PDF only.** The 1-month-per-rental-unit refundable deposit is computed in quote totals (`packages/types/src/domain/quote_totals.ts:252-294`) and printed (`quote_document_renderer.ts:202-209`). It is **withheld from the e-mail** pending the accountant's s9(2)(f) ruling (`quote_route_service.ts:1149-1151`). It is **never invoiced or held**. `product.pricing.depositCents` is read by nothing (`product.types.ts:29`). | |
| Payment security | Manual EFT recorded by finance; PayFast is once-off and switched off; `DEBIT_ORDER` is only a label (`billing/payments.ts:45-49`); no mandate. GAP-PAY-1/2 (money) | #753 §5 |
| Commencement | Contract draft→pending_signature→active; billing skipped until active (`billing_schedule_service.ts:371-407`) | |
| Recurring invoicing | Supported: one schedule per contract with a single blended amount (`quote_conversion_service.ts:619-634`), invoiced as **one line** "Recurring charge — recurring rental" (`invoice_generation_service.ts:173-184`) | |
| Contract term carried | **GAP-TERM-1**: conversion takes no term from the lines. Contract end date is only an optional operator input (`quote.routes.ts:235`, `quote_conversion_service.ts:599`); the rental minimum term defaults to 1 (`rental.ts:60`, `rentalService.create` at `:783` passes none). **Billing ignores `end_date` even when set**: the due query filters only on `status`/`next_run_at` (`drizzle_billing_schedule_repository.ts:105-115`), conversion sets no `maxRuns`, and the code comment admits it (`quote_conversion_service.ts:612-617`). | |
| Equipment reservation / serial allocation | Works via `asset_assignments` reserved→allocated→installed→active (`asset_assignments.ts:35-43`). **GAP-TEN-1** (tenant law), **GAP-ALLOC-1/2** (no uniqueness), **GAP-STOCK-1** (no stock check) | #753 §5 |
| Activation | Manual FSM with `activated_at` (`service_activations.ts:33-63`). SIM/PTT ids are free text only (GAP-ACT-1) | |
| Fleet expansion | **Not billable.** `POST /rentals/:id/assets` adds a unit (`rental_service.ts:294`) but neither the agreement `monthly_amount_cents` nor the schedule amount changes. Schedules have no amend route, only pause/resume/cancel/execute (`billing_schedule.routes.ts`). Contract line items (`POST /contracts/:id/line-items`) **do not drive billing**: no billing or conversion code reads them. Workaround: a second manual schedule. | |
| Renewals | **Not implemented for contracts.** There is no end-of-term expiry or renewal job (see TERM-1). | |
| Returns | Supported (`rental_assets.returned_at`, `drizzle_rental_repository.ts:305-313`; assignment `returned`) | #753 failure cases |
| Damage / loss | Asset incidents, claims and replacements tables exist (`asset_governance.ts:50-66, 147-228`), but **GAP-INC-1**: incident create returns 500. No customer damage charge path. | |
| Termination | Rental FSM `active→terminated` with **no minimum-term or notice check** (`rental_service.ts:25-32, 210-249`; `notice_period_days` stored, `rental.ts:61`, never read). Contract termination checks only active deployments and a reason (`contract_route_service.ts:342-369`). There is no early-termination fee. | |

## 3. Already own radios: Partially implemented

- A connectivity-only offer can be expressed as a `recurring` quote with SIM_DATA or PLATFORM_LICENCE lines. The operational side exists in `communication_services` and `communication_service_members` (kinds radio|sim|data_package|platform_licence|support; `communication/communication_service_members.ts:1-13`), and in platform entitlements and telecom SIMs.
- **There is no ownership in the data model.** `governing_assets` has no ownership column (`asset_governance/asset_governance.ts:76-115`), and no `apps/api/migrations` file alters that table. The importer writes ownership as free text `notes: "Owner: Customer"` (`apps/api/src/migrations/operational/asset_migration.ts:138-145`; type `:35`). `production_migration_seed.ts:19-31` claims the platform has an "`ownership` flag" that the asset register, books and insurance already filter on. **That claim is false against the schema.** The seed also leaves client-owned radios unloaded, pending a decision ([F1]).
- **No device compatibility assessment** (grep for compatib/BYOD/customer-owned finds nothing domain-relevant).
- **Mislabelling:** converting any non-sale quote with recurring revenue creates a `rental_agreement` and a deployment (`quote_conversion_service.ts:774-813`). A connectivity-only customer would therefore get a "rental" for equipment they own.

## 4. Flexible managed connectivity: Partially implemented

- **Suspend and reactivate exist** at four levels:
  - SIM: `/telecom/sims/:id/suspend`, `/reactivate` (`telecom_service.ts:374, 447`). This is a DB status only; it does not call YCTEL.
  - Entitlement: suspend, plus renew to reactivate (`platform_entitlement_service.ts:105, 142`).
  - Communication service: `status` active|suspended|cancelled (`communication_services.ts:10, 34`).
  - Contract: `active⇄suspended` (`contract_route_service.ts:338, 357`). Contract line item status active|suspended|removed (`contract_line_items.ts:52-53`).
- **Not decoupled from rental.** Billing authority is a single `billing_schedules` row per contract with one `recurring_amount_cents` (`billing/billing_schedules.ts:64-80`). Billing stops only when the **contract** is non-billable (`billing_schedule_service.ts:371-407`) or the whole schedule is paused.
  - Suspending the contract to suspend connectivity **also stops the rental billing**.
  - Suspending a SIM, entitlement, communication service or line item **does not stop any billing**, because none of them feed the schedule. By design, `communication_services.ts:5-9` says "Billing is NOT derived from it".
- **Minimum commitment:** none for rolling. Rolling is allowed only on non-rental products (V3). Nothing enforces a minimum number of months before suspend or cancel.

## 5. Third-party equipment financing: Not implemented

- `funders` / `facility_instruments` / `facility_lines` (`packages/database/src/schema/facility/facility.ts:1-9, 32-98`; migration 0134) and `FacilityPositionService` ("Read-only: no actions, no posting", `apps/api/src/facility/facility_position_service.ts:1-8`) record **Signal One's own** funding (the SEDFA facility). Nothing links a customer, contract or invoice to an external financier.
- Rental has a `buyout` state (`rental.ts:25-32`), which is the only hook resembling a financed end-of-term.

## 6. Component catalogue: Partially implemented

- **Separate items: supported.** A product has `productType` rental|sale|subscription|service|hybrid, a free-text `category`/`subcategory`, and pricing with base/recurring/setup/deposit/term prices (`product.types.ts:5-62`; `products.ts:26-40`). Hardware, PTT platform, SIM, data, dispatcher, accessories, configuration, activation, support and maintenance can each be a product and a quote line. The contract-side domain has typed lines RADIO_RENTAL | SIM_DATA | PLATFORM_LICENCE | INSTALLATION | MAINTENANCE | SUPPORT | MONITORING | OTHER (`apps/api/src/domain/communication_service_contract.ts:26-34`).
- **Bundles and packages: not implemented.**
  - There is no product composition or package entity.
  - `bundled` is only a quote type and line type (`quotes.ts:42`, `quote_line_items.ts:43`, web label `apps/web/src/app/(dashboard)/sales/quotes/new/page.tsx:42`), with neutral outcome semantics (`quote_outcome.ts:10-12`).
  - No `dispatcher` or accessory type: those would be `category` text.
  - Recurring invoices print one blended line, so components are not visible on the invoice (`invoice_generation_service.ts:173-184`).

## 7. Availability states: Not implemented (for public read)

- **Public routes** are only auth, health/system, supplier/client onboarding, `/public/quotes` (`apps/api/src/routes/index.ts:775-814`). **No availability endpoint.** The catalogue (`/products/catalog`, `/for-quote`) is authenticated (`products.routes.ts:124-227`).
- **Data that exists:**
  - Product lifecycle `website_visible | featured | rental_enabled | discontinued…` (`product.types.ts:12-19`). This is the only "available for rental / publish" signal.
  - `governing_assets.status` inventory|assigned|… (`asset_governance.ts:32-41`), with **no product_id**; the model is free text.
  - `inventory_items` (available|reserved|deployed…, `inventory/inventory_items.ts:27-45`), linked by free-text `product_model`, with **globally unique serial** and no radio type. `reserveStock` has **no caller** (`drizzle_inventory_repository.ts:530`).
  - Assignment `reserved`.
- **Missing:** "available to order" / lead time, and any per-product stock count. "Confirmed by quote" exists only as quote status.
- On #704/#748 (unmerged) the website intake carries the product as **free text** (GAP-WEB-1), so there is no catalogue key a website could read availability against.

## 8. Customer onboarding documents: Not implemented

- `ClientOnboardingService` is account activation from an invitation token only, with "No new storage beyond client_invitations" (`client_onboarding_service.ts:1-14`). The public routes are `/client-portal/onboarding/invitation|activate`.
- `client_user` has `client.documents.download` but **no upload permission** (`packages/rbac/src/matrix.ts:887-905`). The client portal has documents list/download only.
- Staff-side generic `documents` exists (entity_type/entity_id/category/storage_key, `documents/documents.ts:22-37`; `POST /documents`, `/documents/upload-url` gated by `documents.upload`). It could hold KYC files, but there is no KYC checklist, document type, verification state or retention rule. `clients` stores `registration_number`, `tax_number`, `vat_number`, `psira_number` and an unenforced `onboarding_status` pending|active|complete (`crm/clients.ts:54-58, 67-89`).
- No ID verification, proof of address or debit-order mandate anywhere (grep for kyc/fica/mandate/proof of address returns nothing). **The marketing form must not collect these, and LEOS has no secure place to receive them from the customer yet.**

---

## Smallest changes needed to sell and fulfil radio purchase and rental first (ordered)

Purchase can launch on the **`outright_sale`** path. Hybrid / Buy & Connect (GAP-HYB-1) is not on the critical path for "purchase and rental first".

1. **GAP-TEN-1:** resolve `assetId`/contract/client tenant-scoped in `createAssignment`, fail-closed 404, add an isolation test, and audit existing rows. **Audit-class (tenant law).**
2. **GAP-PAY-1/2:** refuse payment on an unissued invoice or above the outstanding amount, add a payment idempotency unique index, and type the reversal error. **Audit-class (money, migration class B).**
3. **GAP-ALLOC-1/2:** partial unique index on live assignment per asset, a unique serial (and IMEI) per tenant, and enforce `version` on asset assign. **Audit-class (migration class B).**
4. **GAP-TERM-1 + end-date honouring:** carry the line term into contract `end_date`, committed value and rental `minimum_term_months`, and make the due query or `maxRuns` stop at term end. **Audit-class (money/contract).**
5. **GAP-EXP-1:** refuse accept and convert when `expires_at < now()`. **Audit-class** (as registered: the customer commits at a stale price).
6. **CV-1** (on #753): redact credential headers in 5xx logs. Merge it. **Audit-class (credentials).** The decision on purging logs already written is the founder's.
7. **GAP-CAT-1:** add `termPrices` to `ProductPricingSchema` (the validator already exists). Not audit-class (a code-only rollback undoes it).
8. **Rental deposit:** once the founder or accountant rules on s9(2)(f), raise the deposit at conversion and record it as a liability, not revenue. **Audit-class (money).**
9. **GAP-STOCK-1:** decide on one stock model, then add an availability warn/refuse at conversion or reservation. Not audit-class.
10. **Minimum-term / notice guard on rental and contract termination.** Not audit-class (a refusal is reversible).
11. **GAP-INC-1:** incident create 500 → 400/201, so damage and loss are recordable. Not audit-class.
12. **GAP-OPS-1:** grant operational roles their steps (products, contracts, invoices, schedules). **Audit-class (auth).**
13. **Website intake #704/#748:** renumber migrations 0187/0188 before merge, and add a catalogue product key to the intake. **Audit-class (migrations).**
14. *(Later, for rental fleet growth)* An amend-schedule-amount operation, or per-line schedules, so added units bill. **Audit-class (money).** Interim workaround: a second manual schedule.

## Needs founder or commercial approval
- **Buy & Connect contents:** what the included period covers (PTT seats, SIM, data allowance, configuration, talk-groups), its length, and the renewal price and mechanism.
- **Contract terms:** whether terms beyond 12/24/36 are offered (today a code and migration change), and the rolling-connectivity minimum commitment.
- **Deposits:** policy and VAT treatment (accountant, s9(2)(f)), and whether the deposit must clear before delivery.
- **Stock:** the single stock model for radios (`inventory_items` vs `governing_assets`), and what a public "available" means.
- **Customer-owned radios:** the ownership policy ([F1] Option A), and whether connectivity-only customers sign a non-rental agreement.
- **Credit:** qualification and vetting criteria, and use of `credit_limit_cents`.
- **Exit terms:** early-termination fees, and damage, loss and replacement charges to customers.
- **Financing:** whether to offer third-party financing, and with whom.
- **Roles:** which roles may create products, contracts and invoices (GAP-OPS-1).
- **Logs:** retention or purge of the production logs that already contain tokens (CV-1).

## Needs a third party
- **PTT platform** (POCSTAR / HyTalk / Zello; choice undecided, GAP-ACT-1): talk-group setup, activation, seat provisioning, and the device compatibility list for "already own radios".
- **SIM carrier (YCTEL):** carrier-side activation, suspension and renewal. The only spending path, `sim_plan_switch_service.ts`, is deliberately inert and operator-gated with `confirmSpend` (`:1-20`). LEOS's SIM suspend does not touch the carrier.
- **PayFast:** sandbox merchant credentials, a public notify URL, and egress. Integration is once-off only, with no tokenised recurring.
- **Debit-order provider:** nothing is integrated; it is a payment-method label only.
- **ID and KYC verification provider:** none.
- **Equipment financier:** none.
- **E-mail provider:** quote delivery stays `queued` locally; reliability is #728's scope.
