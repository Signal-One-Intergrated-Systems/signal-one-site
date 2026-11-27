# Dealer workspace in Sales OS: gap assessment

**Date:** 2026-11-27. **Repo:** `Signal-One-Intergrated-Systems/lancesat-enterprise-platform`, read-only.

**Trees read:**
- `origin/main` @ `151936f4`, the baseline. Every file:line below is on main unless it is labelled **[r2]** or **[#753]**.
- **[r2]**: `claude/launch-integration-r2` @ `f64489a9` (draft #756).
- **[#753]**: `claude/commercial-slice-qualification` @ `3761943d`.

The two branch heads were fetched into an isolated scratch repository, so the LEOS checkout was not touched. Nothing was run against a database, nothing was gated, and nothing was committed.

**Builds on:**
- `LEOS_COMMERCIAL_CAPABILITY.md`, the offer models. The GAP IDs below are from there and from #753 `docs/release/COMMERCIAL_SLICE_QUALIFICATION.md:108-123`.
- `COMMERCIAL_ECOSYSTEM_RECONCILIATION_2026-11-27.md` §1 and §5.

## Verdict

LEOS has **no dealer concept**:
- no dealer organisation;
- no wholesale price;
- no dealer stock;
- no licence ledger.

Its strongest asset is the **tenant boundary**. There are 489 `requireTenantId(` call sites in the repositories, cross-tenant lookups return 404, and the client and supplier portals are bound by signed claims.

**Recommendation: a dealer is its own LEOS tenant (a "dealer workspace") inside the same Sales OS app.**
- It is linked to Signal One's tenant by a platform-scoped dealer relationship.
- On Signal One's side, the dealer is an ordinary wholesale `clients` row.
- Narrow, ledgered **inter-tenant channels** carry what has to cross between them: delivered stock, referred leads, licence allotments, and the catalogue and sales packs.

Before any dealer gets access, the multi-tenant defects that are latent today have to be closed, because a single-tenant production never exercises them (§C, phase 1). Isolation at the database layer **does not exist at all today**, and the founder has asked for it (§B).

---

## A. Reuse / extend / build

Classification: **E** = exists · **P** = partial · **M** = missing · **B** = branch-only.

### A1. Organisation, identity and RBAC

| Capability | Class | Evidence | Action |
|---|---|---|---|
| Tenant registry and lifecycle | E | `packages/database/src/schema/tenants/tenants.ts:44-75`. Bootstrap creates the tenant, admin, RBAC, billing account and checklist (`apps/api/src/services/tenant_bootstrap_service.ts:1-12`). | **Reuse.** Add a dealer bootstrap template. |
| Tenant claim binding | E | The tenant comes only from the signed claim; a token without it is refused with 401 (`apps/api/src/middleware/auth_middleware.ts:35-50, 124-134`). `requireTenant` (`permission_middleware.ts:131-157`). `requireTenantId` fails closed (`apps/api/src/lib/tenant_guard.ts:70-78`). `assertTenantMatch` returns 404 (`:92`). | **Reuse** as the dealer boundary. |
| One user in several tenants | P | `user_tenant_memberships` has a unique (user, tenant) and `role_in_tenant` (`schema/auth/user_tenant_memberships.ts:19-36`). The session is locked to one tenant at issue, and the tenant switcher is "future" (`packages/auth/src/auth_service.ts:230-278`). | **Extend.** Dealer roles must be **membership-only** (see the hazard below). |
| **Hazard: fallback to Signal One's tenant** | — | Any role in `OPERATOR_TENANT_ROLES` falls back to `systemTenantId` when memberships are not wired (`auth_service.ts:193-228, 255-257`). The same file explains why portal users get their own id as tenant: on the org tenant, tenantId-only reads would leak across clients (`:185-192`). | Dealer roles must **never** be added to that set. Use a separate set where a missing membership means no token. **Audit-class (auth).** |
| Portal binding pattern | E | `users.client_id` becomes the token claim `clientId` (`schema/auth/users.ts:96-101`, `auth_middleware.ts:161-162`), enforced by `requireClientId` (`middleware/require_client_id.ts:29-57`). The supplier portal binds through a membership join with a role per organisation (`schema/procurement/supplier_users.ts:26-52`, `routes/supplier_portal.routes.ts:41-84`). | **Pattern to reuse** for dealer membership and invitations (supplier and client invitations already exist). |
| Entities | E, but **wrong fit** | `entities` + `entity_memberships` (owner/director/manager/member/observer) + `parent_entity_id` (`schema/governance/entities.ts:25-37`; `packages/database/drizzle/0010_entities.sql:20-48`). They exist for **Signal One's own legal companies and books**: "Signal One entities ARE seeded (Lancesat Suppliers + Lancesat Radio Rental)", and revenue posts to the GL by entity (`docs/context/PLATFORM_CHARTER.md:162-166`). There is no `auth.entityId` and no entity-scoped read anywhere (grep returns 0). | **Do not use for dealers.** A dealer's books are not Signal One's. |
| SaaS reseller | E, **not dealers** | `reseller_billing_service.ts:1-10, 39-48` links **LEOS tenants** to a reseller for revenue share (SaaS). The portfolio graph covers *owned* companies and aggregates "as a system actor (no change to tenant isolation)" (`schema/portfolio/portfolio.ts:5-16`). | **Do not reuse** for hardware dealers. Portfolio is a *pattern* for platform-scoped link tables. |
| Platform operator view | E | Gated by a claim, cross-tenant, **aggregates only** (`middleware/platform_operator_guard.ts:1-36`). | **Reuse** for Signal One's network-level dealer reporting (aggregates, no private rows). |
| Roles | E (21) | `packages/rbac/src/roles.ts:10-32` lists 21 roles; its header says "22" (`:2`, stale). Each user has one `users.primary_role` (`users.ts:87`). Stored ↔ RBAC vocabulary lives in **one** bridge file (`apps/api/src/repositories/user_role_storage.ts:1-56`). | **Build** 5 dealer roles (A2). |
| `sales_manager` ambiguity | Open | A stored `sales_manager` still **reads as `sales_representative`** until 0174 (`user_role_storage.ts:33-39, 77-79`). 0174 is not on main (the last migration is `0187`); it is LA-1b #563 (`docs/architecture/NUMBER_RESERVATIONS.md:50`). | Dealer roles get **their own stored values**. Never remap `sales_manager` and never reuse it. |
| Permission model | E | A static matrix per role (`packages/rbac/src/matrix.ts`): the rep is at `:389-493`, the manager at `:495-580`, portal roles at `:887-930`. `price_lock.ts:35-38` locks price for any role that lacks `quotes.price_override` (fail-closed). | **Extend** with a dealer permission family. |
| Scope: owner / see-all | E (2 tiers only) | Rep reads are owner-forced:<br>• `/clients/mine` (`routes/clients.routes.ts:141-170`)<br>• `/crm/leads/mine` (`routes/crm.routes.ts:500-518`)<br>• quotes via `quoteVisibilityFor` (`apps/api/src/lib/quote_visibility.ts:45-50`, used at `routes/quote.routes.ts:336-340`)<br>• `assertClientOwnership` (`lib/client_ownership.ts:24-34`)<br><br>The only alternative is `canActOnAnyClient`, which means see-all **in the tenant**. There is **no team or org tier**. | Inside a dealer tenant, "see-all" is exactly the dealer owner's or admin's scope. That is a big reason to choose the tenant model. |
| Database-layer isolation | **M** | "zero `CREATE POLICY`, zero RLS, zero `REVOKE` … Scoping is application-level `WHERE` clauses" (`docs/architecture/runtime/RUNTIME_ARCHITECTURE.md:789-799`). Re-checked: no RLS in `apps/api/migrations`. The precedent closest to DB enforcement is the [r2] triggers that check same-tenant on resolution (`0191_website_enquiry_queue.sql:119-142`). | **Build** (§B). Architect decision. |
| Event bus tenancy | M | `domain_events` has no tenant column (`schema/events/domain_events.ts:21`; RUNTIME_ARCHITECTURE §17.2 A-1). | It must not carry dealer payloads until it is fixed. |
| Single-tenant schedulers | P | Billing, CoA, yctel and pocstar jobs run for `SYSTEM_TENANT_ID` only (`services/claim_workflow_scheduler.ts:7-9`; `apps/api/src/index.ts:2220-2252, 2405-2410`). GAP-ENV-1: a tenant without a CoA cannot issue invoices. | Fix before dealer tenants invoice or bill anything. |

### A2. The five dealer roles (none exist)

| Dealer role | Basis | Permissions (indicative) |
|---|---|---|
| `dealer_owner` | New. Analogous to `supplier_admin` plus a tenant-scoped "see-all". | Everything in the dealer workspace; invites and removes dealer users; approves Signal One oversight grants (§B); reads dealer finance. |
| `dealer_admin` | New (**not** `sales_manager`). | Dealer users and teams, lead assignment within the dealer, dealer catalogue and retail pricing within policy, quote approval. No finance. |
| `dealer_sales_rep` | New. Starts from the rep set (`matrix.ts:389-493`). | Own-scope leads, customers, quotes, activities, My Day, sales packs, training. **Remove** spend paths until the founder rules: `growth.generate` (Places sourcing; `places_api_calls` exists), `ai.ask` / `ai.actions.request` (model spend). |
| `dealer_inventory_ops` | New. Analogous to `inventory_manager`, scoped to the dealer. | Receive transfers, dealer stock, allocate to customers, record activations, returns. |
| `dealer_finance` | New. | Dealer retail invoices and payments, the dealer's **own** wholesale statement (a projection from Signal One's side), licence balances. |

**Change cost:**
- a `user_role` enum migration;
- the `user_role_storage.ts` maps;
- matrix entries;
- a membership-only resolution set;
- web shell gating.

All of it is **audit-class (auth)**.

### A3. Sales OS and CRM: leads, ownership, assignment

| Capability | Class | Evidence | Action |
|---|---|---|---|
| Lead ownership | E (one user) | `crm_leads.assigned_sales_user_id` (`schema/crm/leads.ts:61`). Clients use `account_manager_id` (`schema/crm/clients.ts:88`), opportunities `owner_id` (`crm/opportunities.ts:63`), activities `assigned_user_id` (`crm/activities.ts:91`), quotes `prepared_by` (`revenue/quotes.ts:106`). | Reused as-is inside the dealer tenant. |
| Lead source / referral attribution | P | `crm_lead_source` includes `referral` and `partner` (`leads.ts:34-43`), with no referrer id. `clients.lead_source` is free text (`clients.ts:107`). [r2] website `attribution` jsonb, UTM fields (`0194_website_intake_attribution.sql:39-42`). | **Build** a referral record: which dealer, referred from which Signal One lead, when, by whom, under which consent. |
| Assignment history | P / B | Main: `PATCH /crm/leads/:id/assign` is gated by `crm.write` and leaves an audit log only, with no history table (`crm.routes.ts:600-622`). `growth_assignments` keeps one row per opportunity (`schema/growth/index.ts:313-342`). [r2] `website_queue_events` is append-only, with assignee, first response and overrides (`0192_website_queue_and_privacy.sql:31-32, 91-121`). | **Extend** the r2 queue-event pattern to a dealer referral ledger. Do not build a second queue. |
| Rules-based assignment | P | `growth_assignment_rules` (territory / industry / product_line → `rep_id`, priority, round-robin) (`schema/growth/index.ts:286-309`). Places prospects are assigned by claim, with "no territory logic yet" (`schema/places/index.ts:105-111`). Product-line scope per rep is `sales_rep_product_scopes` (`schema/sales/sales_rep_product_scopes.ts:1-11, 29-50`). | **Extend** the rules engine to a target type of "dealer". Stock and capability inputs come later. |
| Visible set filtered server-side | E | Owner predicates are forced from `req.auth.userId`, and the query schemas carry no owner field (`crm.routes.ts:495-518`; `clients.routes.ts:141-161`). Not-yours reads as 404 (`quote_visibility.ts:38-41`). | Reuse. |
| Signal One queue (#756) | B | [r2] `website_enquiries` holds pending manager review and is frozen after resolution (`0191:60-93`). `website_intake_access_grants` is a per-user, reasoned, append-only access grant (`0193:83-112`). [r2] `crm_lead_marketing_consent` (`0201:1-22`). | **Depend on #756.** The dealer referral starts from this queue. The **consent model is the gate** for passing a lead to a third party (POPIA). |
| Dealer must not see unassigned Signal One leads | E, if a dealer is a tenant | That holds by construction under the tenant model. Under an in-tenant model it would need an org predicate on every lead read: `leads.list` and `commerce.contact_requests.read` are tenant-wide (`matrix.ts:407-417, 501-510`). | — |

### A4. Inventory, serials and custody

| Capability | Class | Evidence | Action |
|---|---|---|---|
| Two stock models | P | `inventory_items` (FSM available→reserved→deployed→…; `schema/inventory/inventory_items.ts:27-57`) and `governing_assets` (serial, IMEI, status, `assigned_customer_id`; `schema/asset_governance/asset_governance.ts:76-113`). GAP-STOCK-1 says to choose one. | **Founder / Architect decision first.** Dealer stock uses the chosen model inside the dealer tenant. |
| Serial / IMEI uniqueness | M / defect | `inventory_items.serial_number` is **globally** unique across tenants (`inventory_items.ts:40`), which is a cross-tenant existence oracle and blocks the same serial existing in two tenants. `governing_assets` serial and IMEI indexes are non-unique (`asset_governance.ts:105-110`; GAP-ALLOC-2). SIM ICCID is non-unique (`telecom/telecom.ts:114`; `asset_governance.ts:140`). | **Build** per-tenant unique serial, IMEI and ICCID (class B), plus a **platform-scoped device registry** (identifier → current custodian tenant + transfer ledger, no prices) so one unit cannot sit in two dealers. |
| Allocation integrity | Defect | `asset_assignments` FSM (`schema/asset_assignments/asset_assignments.ts:35-78`) has no live-assignment uniqueness (GAP-ALLOC-1). `createAssignment` inserts the ids without tenant-scoped resolution (`services/asset_assignment_service.ts:147-158`): that is **GAP-TEN-1, a live tenant-law breach**. | **Fix TEN-1 and ALLOC-1/2 first.** With dealers as tenants, TEN-1 becomes dealer B reserving dealer A's radio. |
| Custody / transfer | P | `custody_transfer_logs` is append-only, from/to custodian (a plain uuid, with no custodian type), same tenant (`schema/inventory/custody_transfer_logs.ts:22-41`). There is no location, warehouse or stock-movement table (grep returns 0). `reserveStock` has no caller (GAP-STOCK-1). | **Build** dealer stock movements (receipt, allocation, return, write-off) in the dealer tenant, and the inter-tenant transfer in the device registry. |
| Procurement cost exposure | Risk | Rows carry Signal One's cost: `inventory_items.purchase_price_cents` (`:50`), `governing_assets.purchase_cost_cents` (`:88`), `telecom_sim_cards.monthly_cost_cents` (`telecom.ts:90`). | The dealer must get **its own** rows, with the wholesale price as its cost. Never share Signal One's rows. This is a strong argument against in-tenant sharing. |
| Fulfilment carrying serials | M | `sale_deliveries` has one row per contract, with no lines or serials (`schema/sales/sale_deliveries.ts:38-60`). | **Build** delivery lines (asset ids). On `delivered`, the channel moves the units. |

### A5. Licences, entitlements, SIM and activation

| Capability | Class | Evidence | Action |
|---|---|---|---|
| Entitlement record | P | `platform_entitlements`: platform pocstar / hytalk / zello / other; `customer_id` **NOT NULL**; `quantity` = billable count; status active / suspended / expired; start, end and renewal (`schema/platform/platform_entitlements.ts:27-65`). There is no "pool held by a dealer, not yet given to a customer". | **Build** a licence ledger: purchased → available → reserved → allocated → active → expiring → renewed / expired, with a quantity-conservation invariant across the channel. |
| Over-allocation guard | P / defect | `assignUser` counts, then inserts (`services/platform_entitlement_service.ts:168-189`; repo `:259-304`):<br>• there is no lock and no DB constraint, so it is a **race**;<br>• there is no unique (entitlement, user_ref), so **duplicate activation is possible**;<br>• there is **no status check**, so a suspended or expired entitlement still allocates;<br>• `releaseUser` does not check the entitlement id (`repo:272-287`). | **Fix**: row lock or conditional insert, a partial unique on active (entitlement, user_ref), a status guard, a DB CHECK or trigger. **Audit-class (migration).** |
| Expiry / renewal | P | `expire()` has no route and no scheduler. Renewal is tracking only (capability doc §1). | Build the expiry job and renewal billing (money). |
| Activation | P | The `service_activations` FSM has no device, SIM or entitlement reference and no uniqueness (`schema/service_activations/service_activations.ts:43-69`). GAP-ACT-1: provider ids are free text. | **Build** `service_activation_identifiers` (the #753 proposal) with a uniqueness rule per identifier while live. |
| SIMs | P | `telecom_sim_cards`, `telecom_sim_assignments` with `customer_id` and history (`telecom.ts:75-115, 165-195`). The carrier spend path is inert and operator-gated (`sim_plan_switch_service.ts:1-20`). | SIMs stay **Signal One-managed** (Signal One's tenant). The dealer sees a status projection for its customers. |
| PoC platform integration | M | There is no POCSTAR / HyTalk / Zello API. Talk-group provider fields are "reserved for future Pocstar sync" (`services/communications/talk_group_service.ts:1-10`). | Entitlements are LEOS-side only, so they are not proof of what is provisioned on the platform. |

### A6. Wholesale vs retail, pricing and commission

| Capability | Class | Evidence | Action |
|---|---|---|---|
| Wholesale sale Signal One → dealer | P | The `outright_sale` path works end to end: quote → contract → sale invoice → sale delivery (capability doc §1; RELEASE_GATE). The dealer would be a `clients` row in Signal One's tenant. | **Reuse.** Add a `dealer` marker on the client and the dealer relationship. |
| Price lists / dealer tiers | M | There is no wholesale price, price list or tier (grep for wholesale / price_list / tier / dealer returns only unrelated hits). `clients.customer_tier` (standard / premium / enterprise) is read by no pricing code (`clients.ts:48-52, 84`; used only in `client_route_service.ts`). Catalogue pricing is jsonb on a **tenant-scoped** product (`schema/products/products.ts:46-60`). Overrides need `quotes.price_override` (`price_lock.ts:35-38`). | **Build** a wholesale price list per tier, applied at quote time (money). |
| Dealer retail pricing under policy | M | — | Under the tenant model, the dealer owns its catalogue copy and its prices. Policy (floor price, MAP, discount cap) is a founder rule enforced when the catalogue is published and when the dealer quotes. |
| Retail invoices in LEOS | P | Invoicing needs a CoA and an open period in that tenant (GAP-ENV-1). The schedulers are single-tenant (A1). | **Decision:** do dealers invoice their customers through LEOS (LEOS becomes their books), or only record retail sales? |
| Commission engine | E (internal) | The ledger is per `agent_id` with idempotency (`schema/finance/commission_ledger.ts:35-61`). Accrual is driven by billing runs, with retention and clawback (`services/commission_accrual_service.ts:1-10`). Agents are workforce members, and the lifecycle runs candidate → hired → rep (`schema/growth_workforce/index.ts:52-63`). | **For dealers: not their margin mechanism.** A dealer earns its margin between wholesale and retail. Relevant uses: (1) the Signal One rep who manages a dealer account, on wholesale invoices (founder rule); (2) **sales partners** (independent referrers), which belong in Signal One's tenant (reconciliation §5). Commission and GL stay switched off for dealer tenants at first. |

### A7. Audit

| Capability | Class | Evidence | Action |
|---|---|---|---|
| Mutation audit | E | `audit_logs` with actor, impersonator, before and after; the `action` is a **pg enum** (`schema/audit/audit_logs.ts:890-915`). | Every new dealer action is an enum migration. Coordinate with `claude/rc4-audit-action-enum-convergence`. |
| Read audit | E (unused for this) | `data_access_log` is append-only and records the purpose of reads (`schema/audit/data_access_log.ts:1-30`). | Reuse it for every Signal One read into dealer data (oversight). |
| Access-grant trail | B | [r2] `website_intake_access_grants`: reasoned, never deleted, not self-granted (`0193:83-112`). | Reuse the pattern for dealer oversight grants. |
| Audit-log immutability | M | No trigger on `audit_logs` in `apps/api/migrations`. S16 measured it as mutable (`REFERENCE_ARCHITECTURE.md:363`). | Known gap, out of scope. Do not claim that dealer trails are tamper-proof. |

---

## B. Recommended organisational model

### Options

| Criterion | (a) Dealer = its own tenant | (b) Dealer = entity in Signal One's tenant | (c) A new organisation dimension inside Signal One's tenant |
|---|---|---|---|
| Isolation against the law in §8 | **Reuses the proven boundary**: 489 repository guards, cross-tenant 404 tests. | Entities scope nothing (no `auth.entityId`). Every query would need retrofitting. | Builds a **second, unproven** isolation key across every commercial table. |
| Existing tenant-wide reads (manager and director see-all, dashboards, Ask LEO, exports, GL, `commerce.contact_requests.read`) | Dealer rows are invisible to them by construction. | They leak dealer rows, and dealer users see the org (`auth_service.ts:185-192`). | Every tenant-only read has to gain an org predicate, which is a large blast radius. |
| "Signal One sees wholesale but not dealer-private" | **Natural fit.** What Signal One sold stays Signal One's record; what the dealer did with it is the dealer's. | Fails (Signal One's super_admin sees everything). | Possible, but every Signal One role needs a default exclusion. |
| Procurement cost exposure | Dealer rows hold the wholesale price only. | Shared rows hold Signal One's cost. | Shared rows hold Signal One's cost. |
| Shared catalogue, sales packs, training, lead handoff | **Needs channels** (publication, referral copy). | Shared already. | Shared already. |
| Wholesale → dealer stock | Channel and device registry (new). | Custody change (same tenant). | Custody change plus an org change. |
| Multi-tenant readiness | **Exposes the latent defects**: TEN-1, the global serial unique, ENV-1 CoA, single-tenant schedulers, `domain_events`. | — | — |
| Fit with entities and GL | Clean (the dealer's books are separate). | **Wrong:** entities are Signal One's legal companies and post to its GL. | Neutral. |

### Recommendation: (a) with two linked records

- **Signal One's tenant (wholesale authority):**
  - the dealer as a `clients` row (marked as a dealer);
  - wholesale quotes, invoices and deliveries (existing path);
  - SIMs and managed subscriptions;
  - licence pools purchased from PoC suppliers;
  - the referral ledger;
  - the wholesale price list.
- **The dealer's tenant (private):**
  - dealer users and the five roles;
  - their customers, leads, pipeline, quotes and activities (unchanged Sales OS code);
  - dealer stock and movements;
  - their retail catalogue copy and prices;
  - licence allocations to their customers;
  - dealer reporting.
- **Platform-scoped (no tenant_id, following the portfolio and `supplier_users` precedent):**
  - `dealer_relationships` (Signal One tenant ↔ dealer tenant ↔ the dealer's `clients` id, status, tier);
  - a `device_registry` and transfer ledger (identifiers, custodian tenant, no prices);
  - licence-allotment and lead-referral channel ledgers.

  Each channel writes both tenants' rows in **one transaction as a system actor**. Each side reads only its own half.

### Where isolation is enforced

1. **Token:**
   - The dealer tenant is resolved from an active membership only. There is no system-tenant fallback for dealer roles (`auth_service.ts:226` is the hazard).
   - Impersonation into dealer tenants is refused, or audited with the impersonator (`auth_middleware.ts:136-166`).
2. **Middleware:** `requireTenant()` on every dealer route, plus a dealer-role guard on dealer-only routers.
3. **Repository:** `requireTenantId` and tenant-scoped resolution of **every** foreign id (the TEN-1 class). Owner predicates for `dealer_sales_rep` (the existing forced-self routes).
4. **Channels:** a single service per channel, with an idempotency key and quantity conservation, refusing unless `dealer_relationships` is active. No generic cross-tenant read API.
5. **Database (new; the founder's requirement):**
   - Postgres RLS on `tenant_id` for every table a dealer role can reach, set by `SET LOCAL app.tenant_id` inside a per-request transaction, and/or a non-owner application DB role.
   - Unique and check constraints for the identifier and quantity invariants.
   - Same-tenant triggers on the cross-references, following the [r2] 0191 precedent.
   - **Architect decision:** pooling and transaction wrapping are a platform change.
6. **Oversight:**
   - Signal One sees dealer-private data only through (i) platform-operator **aggregates**, or (ii) a dealer-owner-approved, reasoned, time-boxed grant (the [r2] access-grant pattern).
   - Every such read is logged to `data_access_log`.
7. **Proof:** an adversarial two-dealer suite (dealer A ↔ dealer B, dealer ↔ Signal One) over every dealer endpoint and every channel, mutation-proven, run on a real stack (CLAUDE.md "Controls").

---

## C. Phased plan

AC = audit-class: it stops for the pre-merge audit (migrations, money/GL, auth, tenant law).

| # | Phase | Scope | Depends on | AC |
|---|---|---|---|---|
| 0 | **Decisions and ADR** | Choose the model (B). DB-isolation approach (RLS vs. role vs. triggers). The single stock model (GAP-STOCK-1). Supplier answers on licences (D). Reserve migration numbers above r2's `0203` in `NUMBER_RESERVATIONS.md`. | Founder, Architect | No (docs only) |
| 1 | **Multi-tenant hardening** (needed whatever the dealer model) | **GAP-TEN-1**: resolve all foreign ids tenant-scoped and audit existing rows. **GAP-ALLOC-1/2**: live-assignment uniqueness, per-tenant serial / IMEI / ICCID, and `inventory_items.serial_number` global → per-tenant. **GAP-ENV-1**: CoA in tenant bootstrap. Scheduler sweep across all tenants (billing, renewals). Sweep of tenantId-only reads. A tenant column on `domain_events`, or a ban on dealer events there. DB-layer isolation for the commercial tables. A two-tenant adversarial suite. | 0. **These are the #753 gaps: do them once, here.** | **Yes** (tenant law, migrations B, money) |
| 2 | **Dealer identity and RBAC** | The five roles: `user_role` enum, storage map, matrix. A membership-only resolution set. A dealer tenant bootstrap template. `dealer_relationships`. Dealer invitations (supplier-invitation pattern). A tenant switcher for multi-membership users. Web shell gating. **No `sales_manager` remap.** | 1; #750 (Sales OS sign-in) merged; aligned with LA-1b #563 | **Yes** (auth, migration) |
| 3 | **Dealer workspace (Sales OS reuse)** | Dealers get the existing leads, customers, pipeline, quotes, activities, My Day, performance and sales packs in their tenant. Catalogue and sales-pack/training **publication channel** from Signal One. Retail price editing within policy. | 2 | Partly. The publication channel is a cross-tenant write, so it is AC. Reuse of the UI is not. |
| 4 | **Lead distribution** | A referral channel from the #756 queue or a Signal One lead to a dealer: copy into the dealer tenant, record the referral, attribution and assignment history in Signal One's tenant. Consent gate: the [r2] 0201 consent and a privacy-notice purpose. Rules: extend `growth_assignment_rules` to a dealer target (territory first). Dealers create their own leads natively. | 2, 3; **#756 merged** | **Yes** (a cross-tenant personal-data transfer) |
| 5 | **Wholesale → dealer stock** | Wholesale price list and tier (money). Dealer client marker. **Delivery lines with asset ids.** On `delivered`: a device-registry transfer and a dealer stock receipt in one transaction. Refuse duplicates and unauthorised transfers. | 1, 2; GAP-STOCK-1 decision; **PAY-1/2, EXP-1, CAT-1** closed (dealers will pay invoices); HYB-1 if dealers buy bundles | **Yes** (money, migration, tenant) |
| 6 | **Dealer stock and retail** | Dealer stock movements, allocation to dealer customers, returns. Retail sale record (or invoice, per D). Reporting. | 5; D3 (retail invoicing) | Migrations: yes. Retail invoices: **yes (money)**. |
| 7 | **Licence ledger** | Pool, allotment channel, allocation and activation states. DB-enforced conservation and over-allocation refusal. Unique active allocation. Status guard. Expiry job. Renewal billing. `service_activation_identifiers` (GAP-ACT-1). | 1; supplier answers (D1); TERM-1 for renewal terms | **Yes** (money, migration) |
| 8 | **SIM, connectivity and activation for dealer customers** | Signal One-managed SIMs and subscriptions sold through dealers. Status projection to the dealer. Carrier spend stays inert and human-armed. | 7 | **Yes** (money) |
| 9 | **Oversight and reporting** | Signal One wholesale and network dashboards (own tenant plus platform aggregates). Dealer-approved grants and read logging. Dealer reporting. | 3–8 | Grant mechanism: yes (auth). Reports: no. |

### Qualify before any dealer gets access (after phases 1–3, then again per phase)

1. The two-dealer adversarial suite is green and mutation-proven, **including the DB layer**.
2. Dealer roles cannot reach Signal One's tenant, by an explicit test of `auth_service.ts:226`.
3. A dealer cannot see:
   - unassigned Signal One leads;
   - another dealer's customers, stock or balances;
   - procurement cost fields;
   - Signal One's internal financials.

   Each is asserted on API responses and directly in SQL.
4. Real-browser walk at 1440 and 390 for each role.
5. A single pilot dealer, on synthetic data first.
6. The founder signs off the data-access policy (D2).

**No duplicate systems:**
- One queue: #756's, extended.
- One stock model: the GAP-STOCK-1 decision.
- One commission engine: Signal One-side only.
- One entitlement table: extended with a ledger, not replaced.
- The existing outright-sale path for wholesale.
- The existing Sales OS code inside dealer tenants.

---

## D. Founder and supplier decisions required

1. **Licences (from the PoC platform suppliers: POCSTAR / HyTalk / Zello; the platform choice is still open):**
   - Can seats be bought in bulk by Signal One and sub-allotted?
   - Can they be transferred between customers or dealers, and can they be split?
   - Term, renewal and expiry semantics.
   - Whether activation is per device, SIM or user.
   - Whether the supplier allows a reseller chain at all.

   Until these are answered, model a seat as **non-divisible and non-transferable**.
2. **Dealer data-access policy:**
   - What Signal One may see in a dealer workspace: aggregates only, or grants.
   - Who approves.
   - Maximum grant length.
   - POPIA roles (Signal One as operator or responsible party for dealer customer data).
3. **Retail through LEOS:** do dealers issue invoices and take payments in LEOS (their books in LEOS), or only record sales?
4. **Wholesale pricing:** tiers, who sets them, credit terms for dealers (`credit_limit_cents` is not enforced today), and payment before or on delivery.
5. **Retail pricing policy:** free, floor, MAP or discount cap, and whether Signal One may see dealer retail prices.
6. **Lead distribution rules:**
   - territory definitions;
   - exclusivity;
   - SLA and reclaim (places prospects already have `reclaimed_count`);
   - referral fee or commission, if any;
   - customer consent wording for referral to a dealer.
7. **Spend paths for dealer reps:** Places prospect sourcing and Ask LEO (both cost money).
8. **Oversight of the Signal One account manager:** whether wholesale invoices accrue rep commission.
9. **Stock model:** `inventory_items` or `governing_assets` (GAP-STOCK-1).
10. **Legal:** dealer agreement and Hytera distribution authority (reconciliation §7), before onboarding any dealer.

## E. Open questions (not resolvable from the code)

- Is production truly single-tenant? I read the code only (`resolveActiveTenant` comment: "today: Signal One", `auth_service.ts:238-239`). I counted no rows.
- Which routes read by tenantId only and would leak to a dealer user mis-placed in Signal One's tenant? A full sweep was not done; the auth comment names documents and incidents (`auth_service.ts:189-190`).
- RLS feasibility with the current Drizzle pool, whether per-request transactions are already used, and its performance cost.
- Whether `growth.generate` and `ai.ask` actually spend money on every call. Only the presence of `places_api_calls` was confirmed.
- How a dealer-finance user should read the dealer's wholesale invoices, which live in Signal One's tenant: a channel projection, or a `client_user` binding to the dealer's `clients` row (a second identity).
- Whether the 0189 "Sales manager role" migration the Architect reserved ([r2] `0191:10-11`) changes the role model that dealer roles must sit beside.
- #750 and #754 heads were not read directly; I relied on r2 (which includes #754) and on the website repo's release notes.
