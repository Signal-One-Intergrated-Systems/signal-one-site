# Dealer programme and database-enforced isolation: proposal

**Date:** 2026-11-27. **Status:** proposal for Architect and founder review. Not approved for build.
**Repo read:** `lancesat-enterprise-platform` `origin/main` @ `151936f4`, read-only via `git show` / `git grep` with `GIT_OPTIONAL_LOCKS=0`. Nothing was run against a database, nothing was gated, nothing was branched or committed. Every file:line is on main unless marked **[r2]** (#756) or **[#753]**, which are carried from the gap assessment and were not re-read.
**Builds on:** `DEALER_WORKSPACE_GAP_ASSESSMENT.md` (the "assessment"), `COMMERCIAL_ECOSYSTEM_RECONCILIATION_2026-11-27.md`, `LEOS_COMMERCIAL_CAPABILITY.md`, and the founder decisions of 2026-11-27 (isolated dealer organisation, dealer invoicing under its own identity, prepaid wholesale, licences indivisible and non-transferable, no external access before independent review).

## Verdict

- **RLS as written in the assessment would do nothing today.** Production connects as `postgres` (`docs/architecture/reports/S393.md:108`), which owns the tables and holds every privilege, including over `audit_logs` (`docs/C25_16_PILLAR_INVENTORY.md:81-85`, where `postgres` is called "the application role"). A superuser bypasses every policy. The **first** isolation deliverable is a role split, not a policy.
- **The data-access layer has no request scope.** About 110 repositories are singletons built once at boot on the pooled client (`apps/api/src/index.ts:965-1010`). Most queries run outside any transaction. `withTransaction` has one production caller (`apps/api/src/routes/index.ts:984-992`), and the governed `executeTransaction`, which already sets `SET LOCAL app.*`, has **zero** callers. A per-transaction tenant variable therefore needs a new request-scoped executor (AsyncLocalStorage is used nowhere today).
- **Recommendation:** a non-owner, non-bypass application role, plus a transaction-local `app.tenant_id` set by one executor, plus fail-closed RLS policies. These are enabled **in waves**, starting with the tables a dealer role can reach, with a coverage gate that names every tenant table as covered or exempt. Cross-organisation writes go through single-purpose channel services that switch tenant context **inside one transaction**, against append-only ledgers. There is no superuser and no `BYPASSRLS` on any runtime path.
- **Four latent defects found in this read, beyond the assessment:**
  1. User management lists **every user on the platform** with no tenant predicate (`drizzle_user_management_repository.ts:25-49`; `users` has no tenant column, `schema/auth/users.ts:80`).
  2. Every tax invoice prints **Lancesat Suppliers' legal identity, VAT number and bank account** hard-coded (`apps/api/src/services/pdf_document_layout.ts:131-134, 299, 309`).
  3. `data_access_log` has **no tenant column and no writer** in `apps/api/src` (`schema/audit/data_access_log.ts:34-55`; grep returns 0). The assessment's "reuse it for oversight reads" needs a migration and a first writer.
  4. Worker jobs **fall back to the zero-UUID tenant** when a payload has none (`apps/worker/src/index.ts:683, 759`).

---

## 1. Programme charter

| Item | Statement |
|---|---|
| Name | **DLR: Dealer Workspace and Isolation programme.** It is a separate, phased commercial engineering programme in LEOS. |
| Goal | Approved dealers run the existing Sales OS as **isolated organisations** (their own employees, customers, leads, quotes, stock, licence allocations, subscriptions, renewals, invoices and reports). Signal One sees only its own relationship with each dealer. |
| Out of scope | The website launch. Changes to the founder-locked homepage. LEOS SaaS resale (`reseller_billing_service.ts`). Dealer credit. Online payment. Any external dealer access before qualification (§5, Q-gate). |
| Authority | Founder for commercial and legal decisions (§6). Architect for the ADR, migration numbers (`docs/architecture/NUMBER_RESERVATIONS.md:1-5`: streams never self-assign) and the DB isolation design. |
| Cadence | One mission per cycle. Every audit-class cycle stops for the pre-merge audit (CLAUDE.md §0-R.15). Migrations carry their `BACKUP CLASS` header before the gate runs (`docs/architecture/constitution/ENGINEERING_CONSTITUTION.md:318-323`). |

### Relationship to in-flight work

| In-flight | Relationship | Rule |
|---|---|---|
| **#753** commercial-slice qualification (TEN-1, ALLOC-1/2, PAY-1/2, TERM-1, EXP-1, CAT-1, CV-1) | DLR **depends on** it. TEN-1 becomes "dealer B reserves dealer A's radio" (assessment A4). | DLR does not fix these gaps itself and does not fork them. They land through #753 / the launch build, and DLR phase 1 starts only after they merge. ENV-1 (CoA per tenant) and the scheduler sweep, which #753 does not cover, are DLR phase 1 work. |
| **#756** r2 launch candidate (website intake receiver, queue, access grants, consent; migrations up to 0203 **[r2]**) | DLR **reuses** its queue, its access-grant pattern **[r2]** `0193:83-112` and its consent model **[r2]** `0201:1-22`. | No DLR migration is numbered until #756's numbers have landed. There is no second queue. The referral phase starts only after #756 merges. |
| **#750** Sales OS sign-in; **LA-1b #563** (0174 `sales_manager` flip) | Dealer roles sit beside these. | Dealer roles get their own stored values. `sales_manager` is never remapped (assessment A1). |
| `claude/rc4-audit-action-enum-convergence` | Every dealer action adds `audit_logs.action` enum values. | Coordinate the enum migrations so they do not collide. |
| AUDIT-1 / ADR-0020, SEC-1 / ADR-0019 (reserved, `NUMBER_RESERVATIONS.md:67-69`) | The role split (§2) can also close RA-0029 (audit rows mutable by the app role). | Propose it to the Architect as a joint scope, without widening a DLR cycle. |
| **Website launch** | **No dependency in either direction.** | DLR changes nothing in `signal-one-site`. The reseller page stays email-routed and describes the dealer workspace only as "for approved dealers, once qualified" (reconciliation addendum). Intake v1.3 intents ship on their own track. No DLR deploy is tied to a website release. |

---

## 2. Database-enforced isolation proposal

### 2.1 What exists today (measured from the tree)

| Concern | Evidence | Consequence for RLS |
|---|---|---|
| Pool | One postgres.js pool per process, `max` from `DATABASE_POOL_MAX` (default 10), `application_name = lancesat-api` (`packages/database/src/connection.ts:39, 60-70`). The prod example uses 50 (`.env.production.example:25`). There is no PgBouncer (grep returns 0). | Session state set on a checked-out connection survives into the next request unless it is transaction-local. |
| Second pool | Audit-capture client, `max: 2`, same `DATABASE_URL` (`packages/database/src/client.ts:65-85`). | It needs its own context or a narrow insert-only role. |
| Repositories | About 110 `new Drizzle…Repository(db)` singletons built at boot (`apps/api/src/index.ts:965-1010`). | No per-request handle exists to carry a tenant. |
| Transactions | Ad-hoc `.transaction(` calls in services. `withTransaction` sets no session variable (`packages/database/src/transaction.ts:53-76`) and has one caller (`routes/index.ts:984-992`). `executeTransaction` sets `SET LOCAL app.correlation_id / current_user_id / role / email` (`transactions/correlation_context.ts:102-129`, `transaction_manager.ts:85-117`) and has **0 callers**. | The precedent exists but is unused. It **interpolates values into SQL text** (`correlation_context.ts:104-125`), which is an injection hazard (for example through an email). It must be replaced by parameterised `set_config()`, not copied. |
| DB role | `current_user = postgres` on production (`S393.md:108`). `postgres` holds SELECT/INSERT/UPDATE/DELETE/TRUNCATE on `audit_logs`, and RLS is off (`C25_16_PILLAR_INVENTORY.md:81-85`). | A superuser and owner **bypasses RLS**. INFERRED: the API's `DATABASE_URL` is the same Railway-managed `postgres` login. Verify in phase 2a with `select rolsuper, rolbypassrls from pg_roles where rolname = current_user`. |
| Migrations | `preDeployCommand = node scripts/migrate.js` on the API service (`apps/api/railway.toml:28-32`). It reads the **same** `DATABASE_URL` (`apps/api/scripts/migrate.js:25-35`). | Migrations and request traffic share one credential, so they cannot be split without a second variable. |
| Migration runner quirk | `42710 duplicate_object` and three other codes are **skipped silently** (`migrate.js:122-136`). | Re-creating a policy under the same name with a new body would be skipped and the old policy would stay. Policies must be versioned by name (`…_v2`) or dropped with `DROP POLICY IF EXISTS` first. |
| Tenant columns | 256 `pgTable` definitions. `tenantIdCol()` (NOT NULL, `schema/_shared.ts:60-62`) is used 158 times, plus about 34 other `tenant_id` declarations. Nullable or text examples: `applications.ts:48`, `escalations.ts:55`, `inbound_email.ts:85`, `whatsapp.ts:52`, `sales_packs.ts:45` (null means invisible by rule, `:34-44`), `audit_write_failures.ts:55` (text), `finance/sars.ts:20` (text). `domain_events` has none (`schema/events/domain_events.ts:21-37`). | Policies need a typed comparison. Text-typed tenant columns need a cast or a fix. NULL-tenant rows are invisible under the template, which is correct for `sales_packs`. |
| Global tables | `users` has no tenant (`schema/auth/users.ts:80`, unique email). `user_tenant_memberships` is (user, tenant) (`schema/auth/user_tenant_memberships.ts:19-36`). `tenants` (`schema/tenants/tenants.ts:44-75`). | Login resolves the tenant **after** reading `users`, so these must stay platform-scoped and must not gain naïve RLS. |
| App-layer guard | 493 `requireTenantId(` sites. 404 on cross-tenant reads (`apps/api/src/lib/tenant_guard.ts:70-101`). | This stays the primary control. RLS is the second, independent control. |
| Tests | CI and the local gate connect as the container superuser `lancesat` (`.github/workflows/test.yml:59-61, 73-86`). CLAUDE.md tells local runs to use the superuser. 37 suites build their own `postgres()` client (`scripts/raw-row-key-gate.mjs:63`). | **Every existing DB test bypasses RLS**, so an RLS test written the same way is vacuous. |
| LAR | A separate database and pool (`apps/lar/src/db/client.ts:1-5, 21-28`). | Out of scope. It holds no dealer data. |

### 2.2 What RLS will and will not defend (stated so nobody over-claims)

| Defends against | Does **not** defend against |
|---|---|
| A repository query missing its `tenant_id` predicate. | A compromised API process or SQL injection. The app role can call `set_config` itself. |
| Foreign ids resolved without tenant scope (the TEN-1 class): the insert fails `WITH CHECK`, or the select returns nothing. | A wrong tenant set by the executor, for example a resolution bug in `auth_service`. That is covered by tests (§2.7), not by RLS. |
| New dealer-reachable code written without the guard. | Same-tenant over-reach (a rep seeing another rep's leads). That stays RBAC and owner predicates, with optional restrictive policies (§2.3d). |
| Reporting and AI reads that build broad SELECTs. | Operator misuse through the break-glass role. That is covered by procedure plus audit. |

A guarantee against a compromised application needs separate credentials per organisation: alternative (d) in §2.4.

### 2.3 Proposed design

**a. Roles.** No runtime path is superuser, table owner or `BYPASSRLS`. Passwords are set out-of-band by an ops script, never in a migration or committed file (CLAUDE.md §8).

| Role | Login | Owns | Subject to RLS | Used by |
|---|---|---|---|---|
| `leos_owner` | NOLOGIN | all schema objects (`ALTER … OWNER TO`) | n/a (owner; no FORCE, see 2.8) | assumed via `SET ROLE` by the migrator only |
| `leos_migrator` | LOGIN | — | runs DDL as `leos_owner` | `migrate.js` via a **new `MIGRATION_DATABASE_URL`**, plus the backfill scripts in `apps/api/scripts/*.mjs` |
| `leos_app` | LOGIN, NOBYPASSRLS | nothing | **yes** | API request traffic (`DATABASE_URL`) |
| `leos_worker` | LOGIN, NOBYPASSRLS | nothing | **yes** | `apps/worker`, API in-process schedulers |
| `leos_audit_capture` | LOGIN | nothing | yes, INSERT-only on `audit_logs` and `audit_write_failures` | `getAuditCaptureDatabase()` (`client.ts:67-85`). This can also close RA-0029: no UPDATE/DELETE for any runtime role. |
| `leos_platform_reader` | NOLOGIN | `SECURITY DEFINER` aggregate functions only | policies grant it aggregates through functions, never through tables | platform-operator console (`platform_overview.routes.ts:1-12`) |
| `postgres` | Railway | — | bypass | **break-glass only**: founder-approved, logged, never a service variable |

**b. Tenant context.**
- **GUCs.** Two transaction-local settings:
  - `app.tenant_id` (uuid, the data tenant);
  - `app.principal` (`user:<id>` / `job:<type>` / `channel:<name>`).

  Both are set by **parameterised** `select set_config('app.tenant_id', $1, true)`. That is never `SET` (session scope), and never string interpolation.
- **Executor.** A new `packages/database` tenant executor:
  - it holds `{tenantId, principal}` in `AsyncLocalStorage`, entered by middleware right after `requireAuth` and `requireTenant`;
  - it hands repositories a `DrizzleClient` proxy instead of the raw pool;
  - when no transaction is open, each repository call runs as a **short unit-of-work transaction**: `BEGIN; set_config…; <query>; COMMIT`. An explicit `db.transaction` sets the context once at its start, and nested calls reuse that tx (drizzle savepoints; to be proven on scratch);
  - the repository constructors do not change (they already take `db`), so the change is in one place.
- **Do not wrap the whole HTTP request in one transaction.** Requests do external I/O (S3, email, PayFast), and holding a pooled connection through that would exhaust a pool of 10 to 50. The root `railway.toml:40-42` declares up to 3 API replicas, but its own note (`:36-37`) says Railway does not read that file, so verify the live replica count.
- **Fail-closed policy template** (sketch):
  ```sql
  ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation_v1 ON crm_leads
    USING      (tenant_id = (SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid))
    WITH CHECK (tenant_id = (SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid));
  ```
  - If the setting is unset, it is `''`, so `NULLIF` makes the comparison `NULL` and **no rows** match (fail-closed, never fail-open).
  - The `(SELECT …)` wrapper makes Postgres evaluate it once per statement (an InitPlan). The existing `(tenant_id, …)` indexes, for example `platform_entitlements.ts:56-63`, still apply.
- **Boot assertion.** With `DB_RLS_REQUIRED=true`, the API and the worker **refuse to start** unless all of the following hold:
  - `current_user` is not a superuser;
  - it does not have `BYPASSRLS`;
  - it owns no tenant table.

  This closes the "someone pointed the app at the owner" hole without needing FORCE.

**c. Pooling hazards and mitigations**

| Hazard | Mitigation |
|---|---|
| A session-level `SET app.tenant_id` leaks to the next borrower of the connection. | Only `set_config(…, true)` inside a transaction. A grep gate refuses `SET app.` without `LOCAL` and `set_config(…, false)`. |
| A query outside the executor runs. Examples are raw `getDatabase()` calls at `apps/api/src/index.ts:1264-1292, 3067, 3132`, `apps/api/src/bootstrap/production_seed.ts:84`, and seven worker modules such as `apps/worker/src/backup/restore_simulation.ts:36`. Such a query with no context and returns **empty, not an error**. | The proxy logs a refusal and, in RLS-required mode, throws when there is no ALS context. The coverage telemetry in phase 2b counts context-less queries **before** any policy is enabled. |
| Long transactions hold connections. | Unit-of-work transactions, and no external I/O inside a tenant transaction (a lint rule in the review checklist). Measure pool wait p95 before and after. |
| A future transaction-mode PgBouncer. | `set_config(…, true)` is transaction-scoped, so it is compatible. Session `SET` would not be. |
| The audit-capture pool writes after the main tx fails (`client.ts:50-64`). | The `leos_audit_capture` role with `WITH CHECK (tenant_id IS NOT NULL)` on the insert policy. No read policy. |
| Retry loops (`transaction_manager.ts:104-116`). | The context is re-set at the start of every attempt, because it is part of the tx. |

**d. Privileged paths**

| Path | Today | Under RLS |
|---|---|---|
| Migrations | Same credential as the API (`railway.toml:32`, `migrate.js:25`). | `leos_migrator` through `MIGRATION_DATABASE_URL`, with `SET ROLE leos_owner`. The owner is not subject to non-FORCE RLS, so backfills keep working. Every migration still runs once through `preDeployCommand`. |
| Worker sweeps across tenants: dunning (`apps/worker/src/lifecycle/dunning_sweeper.ts:123-140`), billing "processed across all eligible tenants" (`apps/worker/src/index.ts:1431-1440`), lifecycle outbox poller (`apps/api/src/lifecycle/lifecycle_outbox_poller.ts`, flag-off per `apps/api/railway.toml:4-10`). | One query over all tenants, as the owner-equivalent. | **Iterate tenants.** Read the active `tenants` (platform-scoped), then open one tenant-context transaction per tenant. No bypass. Per-tenant failure isolation comes as a bonus. |
| Jobs with the zero-UUID fallback (`worker/src/index.ts:683, 759`; notification audit with tenant = system actor, `:333`). | Writes rows under a tenant that does not exist. | Refuse a job with no tenant (dead-letter it). Notification audits carry the subject's tenant. **Fix in phase 1.** |
| Single-tenant schedulers (`SYSTEM_TENANT_ID`, `apps/api/src/index.ts:2223-2224, 2410-2411`) | They run for Signal One only. | They iterate tenants (assessment A1). CoA is created in tenant bootstrap (ENV-1). |
| Admin roles (`super_admin`, `platform_admin`) | Tenant-wide inside the system tenant. User management is **platform-wide** (`drizzle_user_management_repository.ts:25-49`, routes `admin.routes.ts:76, 258`). | Stay scoped to the tenant in their token. User listing is filtered by `user_tenant_memberships.tenant_id = ctx` (phase 1). There is no cross-tenant admin through tables. |
| Platform operator (`requirePlatformOperator`, claim-gated, aggregates only; `platform_operator_guard.ts:1-36`) | Cross-tenant SELECTs. | `SECURITY DEFINER` functions owned by `leos_platform_reader`, which **return aggregates only** (counts, sums, status), with a fixed `search_path`. Each call writes `data_access_log` (after it gains `subject_tenant_id`). |
| Reporting, dashboards, Ask LEO / AI context | Tenant-wide reads in the app. | Unchanged: they run inside the tenant context, so RLS bounds them. Exports and AI never get a cross-tenant function. LAR is a separate DB. |
| Public and unauthenticated routes (`/public/quotes`, PayFast ITN, inbound email with a nullable tenant `inbound_email.ts:85`, the [r2] intake receiver) | They resolve the record, then the tenant. | A narrow `SECURITY DEFINER` lookup (token → tenant_id) sets the context. Then the normal path runs. |
| Login, refresh, invitations | Read `users`, `sessions` and memberships before any tenant is known (`packages/auth/src/auth_service.ts:244-278`). | These tables stay platform-scoped (no RLS). Their access is limited to the auth repositories, and the lists in them gain the membership filter. |
| Client and supplier portals | The principal's `tenantId` is the **user id** (`auth_service.ts:221-228`). Quote lists filter by `clientId` only (`drizzle_client_portal_repository.ts:203`). `findQuote` filters by `tenantId = auth.tenantId` (`:225`; called at `client_portal_service.ts:611, 692`). | **Fix the semantics before RLS.** The context is the **owning organisation's** tenant, derived server-side from the client binding, plus a restrictive `client_id = app.client_id` policy on portal tables. As written today, the RLS template would blank the portal. INFERRED: `findQuote` with tenant = user id may already miss. Confirm in a test, not on production. |
| Backfill and ops scripts (`apps/api/scripts/*.mjs`) | `DATABASE_URL`. | `MIGRATION_DATABASE_URL` (owner) or an explicit tenant loop. |
| Break-glass | — | `postgres`, used only through a founder-approved procedure. The session is recorded and the reason logged afterwards. |

**e. Cross-organisation transactions (no superuser bypass)**

Common pattern for every channel:
- **One** service per channel. It is the only code permitted to switch `app.tenant_id` inside one transaction.
- `set_config('app.principal','channel:<name>',true)`.
- The channel writes an append-only, platform-scoped ledger row. The table has `UPDATE`/`DELETE` revoked from runtime roles and a trigger refusing both.
- An idempotency key is UNIQUE.
- The channel refuses unless `dealer_relationships.status = 'active'`.
- `audit_logs` is written in **both** tenants with the same correlation id.
- The dealer-side rows carry a NOT NULL FK to the ledger row, so a dealer-side receipt cannot exist without its ledger entry (same-tenant and same-relationship checks by trigger, following the [r2] `0191:119-142` precedent).

| Channel | Signal One half (ctx = S1) | Dealer half (ctx = dealer) | Ledger (platform-scoped, RLS: visible to `origin_tenant` or `counterparty_tenant`) |
|---|---|---|---|
| Wholesale delivery → dealer stock | `sale_deliveries` marked delivered, with delivery lines (asset ids; new). The `clients` row is the dealer. | A stock receipt per unit at the **wholesale price as cost**. Signal One's `purchase_price_cents` is never copied (assessment A4). | `device_registry` (identifier → custodian tenant, no prices) + `device_transfers`. A partial UNIQUE on the live custodian per identifier means one unit cannot sit in two dealers. |
| Lead referral | The original lead is kept. A referral record (dealer, by whom, consent id, purpose). | A **copy** of the minimum lead fields, created as a new lead owned by the dealer. | `lead_referrals` plus `lead_referral_outcomes` (status-only fields the dealer reports back, if the agreement requires it). Refused unless an [r2] consent record exists for "referral to a dealer". |
| Licence allotment | Units move from Signal One's pool. | The units become dealer-held. | `licence_movements` (§3). Row locks with `FOR UPDATE SKIP LOCKED`. All or nothing. |
| Catalogue and sales-pack publication | The publication record. | A catalogue copy **without cost fields** (`products.ts:46-60` pricing jsonb is filtered) and pack copies. | `catalogue_publications` (version, recipients). |
| Dealer's wholesale statement | Invoices and payments stay in Signal One's tenant. | Read-only projection. | A `SECURITY DEFINER` function: it resolves `dealer_relationships.dealer_client_id` for the caller's tenant and returns only that client's invoices and payments. A dealer can never pass a client id. |

### 2.4 Alternatives

| Option | Isolation strength | Blast radius / effort | Cross-org channels | Ops and cost | Verdict |
|---|---|---|---|---|---|
| (a) RLS on every tenant table | Second control everywhere. | Highest: about 190 tables, every job and every script at once. | Atomic, single DB. | One DB. | **The end state**, reached in waves. |
| (b) RLS on dealer-reachable tables only | Covers what dealers touch. A table left out is protected only by the app layer. | Moderate. The first wave is about 40 tables (CRM, quotes, products, inventory, entitlements, activities, documents, notifications, audit). | Atomic. | One DB. | **Start here**, with the coverage gate making every exemption explicit. |
| (c) Schema per dealer | Strong against missing predicates. `search_path` has the same pooling hazard. | Very high. Drizzle schema objects are static. Migrations run × N. Cross-tenant reporting needs unions. | Cross-schema, but atomic. | Migration time grows with dealers. | Rejected. It breaks the single-schema model of 256 tables. |
| (d) Database per dealer | Strongest. Separate credentials survive a compromised app. | Very high. Per-tenant connection routing in every service and worker. N migration runs. | **Not atomic.** Needs an outbox or saga for every channel. | A Railway instance per dealer. | Keep as the **escalation path** if a dealer agreement or regulator demands provable separation. The precedent is `system/architecture/adr/ZADR-0008-physical-separation-from-tradeco.md:12-18, 58`, which already chose physical separation where a related party competes with platform participants. Signal One both wholesales to dealers and retails. |
| (e) App-layer only (today) | One control. 493 guards. TEN-1 shows it leaks. | None. | — | — | Insufficient for the founder's requirement. |

**Recommendation: (b) → (a) with the role split.** Re-evaluate (d) at the Q-gate, with the dealer agreement in hand.

### 2.5 Compatibility assessment: what breaks

| Breaks | Why | Fix (phase) |
|---|---|---|
| Any query issued without the executor. | No context means zero rows, silently. | Proxy and telemetry first (2b). Policies only after zero context-less queries are measured on staging (2c). |
| Cross-tenant sweeps (dunning, billing, lifecycle). | Policies hide other tenants. | Tenant iteration (1). |
| Worker zero-UUID fallback. | `WITH CHECK` refuses the write. | Refuse at enqueue or dequeue (1). |
| Portal reads (client, supplier). | Context = user id ≠ data tenant. | Portal context semantics (1). |
| Platform overview. | Cross-tenant SELECT. | Definer aggregates (2). |
| Public routes and webhooks. | No auth, so no context. | Token → tenant lookup (2). |
| Migrations and backfills. | Would run as `leos_app`. | `MIGRATION_DATABASE_URL` (2a). `migrate.js` reads only `DATABASE_URL` today. |
| Policy edits through `migrate.js`. | Duplicate-object errors are skipped (`migrate.js:122-136`). | Version policy names (2). |
| Text-typed `tenant_id` (`audit_write_failures`, `sars`). | Type mismatch in the policy. | Cast in the policy or migrate the type (class B/C review). |
| Existing DB suites. | They run as superuser, so they still pass but **prove nothing** about RLS. | A dedicated RLS suite (2.7). The app suites move to the `leos_app` URL in a later wave. |
| The gate. | `schema-drift-gate.mjs` compares names only (`:1-30`) and does not see policies. | A new **RLS coverage gate**, a live catalog check: every table with `tenant_id` has `relrowsecurity` on, or appears in `RLS_EXEMPTIONS` with a reason. |
| Performance. | Policy evaluation on every row. | The InitPlan form, the existing `(tenant_id, …)` indexes, and `EXPLAIN` on the 20 heaviest queries before and after. |

### 2.6 Test strategy

1. **Precondition assertion in every RLS test.** `select rolsuper, rolbypassrls from pg_roles where rolname = current_user` must return `false, false`. The tests `SET ROLE leos_app_test` (created in test setup) because the harness connects as superuser (`test.yml:59-61`). A test that skips this is vacuous (CLAUDE.md, "Controls").
2. **SQL level, two tenants.** Seed tenant A and tenant B through the owner. Then, as `leos_app`, for every covered table:
   - with ctx = A, B's rows are invisible;
   - INSERT or UPDATE with `tenant_id = B` is refused by `WITH CHECK`;
   - with no context, 0 rows come back and writes are refused;
   - a session `SET` does not survive a pool checkout (two sequential borrows of a `max: 1` pool).
3. **API level, adversarial.** Extend the existing two-tenant suites: `apps/api/src/__tests__/s331_second_tenant.integration.test.ts`, `tenant_isolation_security.integration.test.ts` and `s220_deployment_cross_tenant_live_path.integration.test.ts`. The suite covers dealer A ↔ dealer B, and dealer ↔ Signal One, over every dealer endpoint and every channel:
   - ids are guessed across tenants and must return 404;
   - foreign ids in request bodies (TEN-1 class) must be refused;
   - lists contain no foreign rows;
   - procurement cost fields are absent;
   - unassigned Signal One leads are invisible.

   This runs on a real stack (the local build), as the founder rule requires.
4. **Dealer roles never resolve to Signal One's tenant.**
   - A unit test on `resolveTenantId` / `resolveActiveTenant` for every dealer role: membership-only, and with no membership, **no token** (`auth_service.ts:244-260`).
   - A table-driven test asserting that the dealer roles are absent from `OPERATOR_TENANT_ROLES` (`:193-212`).
   - An API test: a dealer login with no membership gets no token.
   - A SQL test: a dealer session's `app.tenant_id` never equals `SYSTEM_TENANT_ID`, checked by a CHECK in the executor plus a trigger on channel ledgers.
5. **Mutation-proven.** Each control is shown red when:
   - its policy is dropped;
   - the role is given `BYPASSRLS`;
   - the executor stops setting context;
   - a dealer role is added to `OPERATOR_TENANT_ROLES`;
   - the channel's relationship check is removed.

   After restoring, the test is **re-run**, never judged from the restore's exit code. A control that passes on first write is reported as vacuous (CLAUDE.md, "Controls").
6. **Channels.** Idempotency (same key, one effect). Concurrency: N parallel allotments against M free units leave exactly min(N, M) allotted. Conservation queries after every test.
7. **Gate integration.** The RLS suite and the coverage gate join `governance:push` only once they are green on a pristine tree. Their exit code is read without a pipe.

### 2.7 Incremental enablement and rollback

| Step | Change | Backup class (declared in header) | AC | Rollback |
|---|---|---|---|---|
| 2a Roles | Ops script creates the roles (passwords out-of-band). Migration: `ALTER … OWNER TO leos_owner`, GRANTs, `REVOKE UPDATE, DELETE ON audit_logs` from runtime roles. A new `MIGRATION_DATABASE_URL`. | **B**. It alters pre-existing objects. Catalog pre-image (owners, `pg_class.relacl`). Reversal tested on scratch. No rows change. | Yes (auth) | Restore the owner and ACLs from the pre-image script. Swap `DATABASE_URL` back (a variable change plus redeploy). |
| 2b Context | The executor sets `app.tenant_id` and logs context-less queries. **No policies.** Flag `DB_TENANT_CONTEXT=on`. | n/a (code) | Yes (tenant law, auth context) | Flag off. Code-only rollback. |
| 2c Wave 1 | `ENABLE ROW LEVEL SECURITY` + `tenant_isolation_v1` on the dealer-reachable tables, **one migration per domain**. Staging first. | **B**. By §11's mechanical rule an `ALTER` on an existing table is not class A (`ENGINEERING_CONSTITUTION.md:312-316`). Row pre-image: none (zero rows altered). Catalog pre-image of `relrowsecurity` and `pg_policies`. | Yes (tenant law: a permissive policy discloses) | Per table: `ALTER TABLE … DISABLE ROW LEVEL SECURITY` (instant, policies kept). Scripts go in `apps/api/migrations/reversals/NNNN_down.sql` (the existing pattern). |
| 2d `DB_RLS_REQUIRED` | The boot assertion becomes mandatory. The proxy throws without context. | n/a | Yes | Flag off. |
| Later waves | The remaining tenant tables, until the coverage gate has only the reasoned exemptions. | B each | Yes | As 2c |

**FORCE ROW LEVEL SECURITY.**
- Not used by default. The owner is reserved for migrations, and the boot assertion guarantees that no runtime connects as the owner.
- FORCE would subject backfills to policies, and would need an explicit `TO leos_owner USING (true)` policy, which is a bypass in all but name.
- Exception to consider: the channel ledgers and `device_registry`, where even owner-run backfills should go through an explicit policy.

**What a migration must never do:** a `DELETE` of foreign-tenant rows "found" by RLS. A destructive cleanup is **class C**, and it stops for founder and Architect approval before it is written.

---

## 3. Licence and entitlement architecture

**Principle:** `platform_entitlements` stays the **commercial entitlement**, that is, what a customer is billed for (`schema/platform/platform_entitlements.ts:1-12, 27-65`). A new ledger underneath it records **which seats exist, who holds them and in what state**. One table is extended. Nothing is duplicated.

**a. Supplier policy record.** `licence_supplier_policies` is platform-scoped, versioned and effective-dated, and approved by a named person against a cited supplier document.

| Field | Values | Default until supplier terms are confirmed |
|---|---|---|
| `supplier_key`, `product_key` | pocstar / hytalk / zello / other, plus the SKU | — |
| `divisible` | bool, plus `allotment_multiple` (for example packs of 10) | **false**, multiple 1 |
| `transferable_between_customers` / `between_dealers` | bool, plus `max_reassignments`, `cooldown_days` | **false** / **false** |
| `resale_chain_permitted` | bool (may Signal One sub-allot to dealers?) | **false**. The allotment channel refuses until this is approved. |
| `activation_unit` | device / sim / user / account | **unset**, so activation is refused |
| `term_model`, `term_months` | fixed from purchase / fixed from activation / calendar / perpetual | unset |
| `renewal_mode` | manual / auto-with-invoice / none, plus `renewal_requires_prepayment` | manual, prepay **true** (prepaid policy) |
| `expiry_behaviour`, `grace_days` | hard_stop / grace_then_stop / read_only | hard_stop, 0 |
| `reactivation_allowed` | bool | false |
| `source_document_ref`, `approved_by`, `approved_at`, `status` | evidence; draft / approved / retired | draft |

A row **pins** the policy version that was in force when it was purchased. A later policy version never rewrites existing seats.

**b. Ledger tables** (all new, so class A on creation)

| Table | Scope | Purpose |
|---|---|---|
| `licence_lots` | Signal One's tenant | A purchase from the supplier: policy version, quantity, supplier order ref, valid_from / valid_to. |
| `licence_units` | platform-scoped. RLS: `origin_tenant_id = ctx OR holder_tenant_id = ctx` | One row per seat (indivisible): `state` (available / reserved / allotted / allocated / active / expired / revoked), `holder_tenant_id`, `first_allocated_at`. **No customer column.** |
| `licence_allocations` | holder tenant (dealer or Signal One) | Seat → that tenant's customer (and `platform_entitlements` row). Private to the holder. |
| `licence_activations` | holder tenant | Seat → activation identifier (device / SIM / user per policy), `active_period tstzrange`. |
| `licence_movements` | platform-scoped, append-only | Every state or holder change: from/to state, from/to tenant, policy version, actor, correlation id, `idempotency_key UNIQUE`, reason. |

**c. Constraints (DB-enforced, not service-only)**

- **No over-allocation.**
  - A partial UNIQUE `licence_allocations(unit_id) WHERE status IN ('reserved','allocated','active')` allows one live allocation per seat, and a seat is the unit, so over-allocation cannot happen.
  - `platform_entitlements.quantity` ≥ the count of live allocations, enforced by a trigger on allocation insert that takes `SELECT … FOR UPDATE` on the entitlement row.
- **No duplicate activation.**
  - `EXCLUDE USING gist (unit_id WITH =, active_period WITH &&)`. This needs `btree_gist`; check its availability on Railway in phase 0.
  - A partial UNIQUE `(supplier_key, activation_unit, activation_identifier) WHERE live`. A device, SIM or user is active once per supplier, unless the policy says otherwise.
- **Non-transferable.** A trigger on `licence_units` refuses a holder change when `first_allocated_at IS NOT NULL` and the pinned policy has `transferable_* = false`.
- **Indivisible.** The allotment quantity must be a multiple of `allotment_multiple` (checked by the channel, plus a CHECK on `licence_movements.batch_qty`).
- **Status guard.**
  - No allocation from a unit or entitlement that is suspended or expired.
  - This also fixes the existing gap where `assignUser` counts, then inserts, with no lock, no status check and no unique (`apps/api/src/services/platform_entitlement_service.ts:168-189`).
  - Add a partial UNIQUE `platform_entitlement_users(entitlement_id, user_ref) WHERE status='allocated'`.
  - Tenant- and id-checked `releaseUser` (assessment A5).
- **Conservation.**
  - Units are never deleted: `DELETE` is revoked, and a trigger refuses it.
  - An invariant query: count(units per lot) = `licence_lots.quantity`. It runs in the RLS suite and as a scheduled check.
- **Concurrency.** The allotment selects `… WHERE lot_id=$1 AND holder_tenant_id=$S1 AND state='available' LIMIT $n FOR UPDATE SKIP LOCKED`. If fewer than n are found, the whole allotment rolls back.
- **Expiry and renewal.**
  - A per-tenant job (tenant iteration, §2.3d) moves units by policy: active → expiring → expired (or grace).
  - Renewal raises a **prepaid** wholesale invoice in Signal One's tenant. The seat only renews when that invoice is paid. This is money and audit-class, and it depends on PAY-1/2 and TERM-1.

---

## 4. Data-boundary matrix

S1 = Signal One's tenant. D = the dealer's tenant. "Grant" = a dealer-owner-approved, reasoned, time-boxed grant (the [r2] `0193:83-112` pattern), with every read logged to `data_access_log` after it gains `subject_tenant_id` and a writer.

| Data class | Owner tenant | Signal One reads | Dealer reads | Mechanism | Audit |
|---|---|---|---|---|---|
| Wholesale order (quote, contract, invoice S1→D) | S1 | Yes (RBAC) | Its own, read-only | S1 rows. Dealer = `clients` row. Statement projection function (§2.3e) | `audit_logs` S1 |
| Payment to Signal One | S1 | Yes | Its own, read-only | Same projection | `audit_logs` S1. PAY-1/2 idempotency |
| Supplied equipment serials | Platform registry. Receipt rows in D | Units it supplied, and their current custodian. **Not** the dealer's end customer | Units in its custody | `device_registry` RLS (origin or custodian). The allocation to an end customer lives in D only | `device_transfers` (append-only) |
| Licence allotments | Platform units. Allocations in D | Seat states for seats it allotted. **Not** to whom | Its seats and allocations | `licence_units` RLS. `licence_allocations` in D | `licence_movements` |
| Managed subscriptions (SIM, platform service Signal One operates) | S1 | Yes, with the **minimum** end-customer reference needed to operate (decision 6.2) | Status projection for its customers | S1 rows. Projection by dealer customer ref | `audit_logs` S1. Carrier spend stays inert (`sim_plan_switch_service.ts:1-20`) |
| Referred leads | S1 original. D copy | Its original, the referral record and the agreed outcome fields only | Its copy (full ownership) | Referral channel with a consent gate | `lead_referrals` both sides. Consent record [r2] `0201` |
| Dealer's own customers | D | **No.** Aggregates only, or a grant | Yes (RBAC within D) | RLS. No S1 role has membership in D | Grant ledger and `data_access_log` |
| Dealer retail invoices | D | **No** (aggregates or a grant) | Yes | RLS. **The issuer is D's legal profile**: the hard-coded Lancesat identity (`pdf_document_layout.ts:131-134, 291-309`) must become a per-tenant issuer profile first | `audit_logs` D |
| Dealer employees | D (membership) | **No.** User lists are filtered by membership (fix `drizzle_user_management_repository.ts:25-49`) | Its own | Membership-scoped user queries. Global `users` stays auth-only | `audit_logs` D |
| Retail prices and margins | D | **No** | Yes | The dealer catalogue copy holds retail prices. Cost = wholesale. Signal One cost is never published | `audit_logs` D |
| Dealer financials (GL, CoA, VAT, bank) | D | **No** | `dealer_finance` / `dealer_owner` | RLS. CoA through bootstrap (ENV-1). Commission and GL off at first | `audit_logs` D |
| Independent sales partner data | S1 | Yes (RBAC) | n/a | Partner roles in S1 with **restrictive** RLS `assigned_partner_id = app.user_id` on CRM tables, owner-forced routes, `price_lock.ts:35-38` (no override), quotes need approval | `audit_logs`, `commission_ledger` (own only) |

---

## 5. Phased plan

AC = audit-class (CLAUDE.md §0-R.15: a defect not undone by a code rollback). Every phase exits only with a recorded merge SHA, a gate RC read without a pipe, and both deployed services reporting the SHA.

| # | Phase | Entry | Exit | AC | Depends on |
|---|---|---|---|---|---|
| 0 | **ADR and decisions** (docs only) | This proposal. | ADR accepted (number requested from the Architect). Founder decisions 6.1–6.5 recorded. Migration numbers reserved above #756's. `btree_gist` and `CREATE ROLE` confirmed available on Railway (read-only check, approved). | No | Founder, Architect |
| 1 | **Multi-tenant hardening (app layer)** | #753 gaps merged (TEN-1, ALLOC-1/2, PAY-1/2, TERM-1, EXP-1). | ENV-1 CoA in bootstrap. Schedulers and sweeps iterate tenants. The zero-UUID job fallback is refused. User listing is membership-scoped. Portal context semantics fixed. `domain_events` gains a tenant (or dealer events are banned there). `data_access_log.subject_tenant_id` plus a first writer. Per-tenant issuer profile. Per-tenant serial / IMEI / ICCID unique. Two-tenant API suite green and mutation-proven. | **Yes** | #753, #756 numbers |
| 2 | **DB isolation foundation** | Phase 1 done. Staging DB available. | 2a roles and the migrator URL. 2b executor and telemetry (zero context-less queries on staging for 7 days). 2c wave-1 RLS on staging, then production. RLS SQL suite and coverage gate in `governance:push`. Boot assertion on. | **Yes** | 1, ADR |
| 3 | **Dealer identity and RBAC** | 2c live. | Five dealer roles (enum, storage map, matrix). Membership-only resolution with a "no membership, no token" test. Dealer tenant bootstrap. `dealer_relationships`. Invitations. Tenant switcher. Web shell gating. | **Yes** | 2, #750, LA-1b |
| 4 | **Dealer workspace (Sales OS reuse)** and publication channel | 3 | Sales OS surfaces work in a synthetic dealer tenant. Catalogue copy without cost fields. Retail price policy enforced. Real-browser walk at 1440 / 390 per role. | Channel: yes. UI: no | 3 |
| 5 | **Lead referral** | #756 merged. Decision 6.3 (POPIA). | Referral channel with a consent gate. Outcome reporting. Territory rules (6.4). | **Yes** | 3, 4, #756 |
| 6 | **Wholesale → dealer stock** | GAP-STOCK-1 decided. PAY / EXP / CAT closed. | Delivery lines with asset ids. Device registry and transfer ledger. Prepaid enforcement: delivery refused until paid (founder policy). | **Yes** | 1–3 |
| 7 | **Dealer stock and retail invoicing** | Decision 6.5 (VAT invoice content). Issuer profile live. | Dealer stock movements. Retail tax invoices under the dealer's identity and numbering series (`invoice_number_sequences` is already keyed by tenant, `schema/billing/invoice_number_sequences.ts:27`). Accountant sign-off on a sample. | **Yes** (money) | 6 |
| 8 | **Licence ledger** | Decision 6.1 (supplier terms) for at least one supplier. | §3 tables and constraints. Allotment channel. Expiry job. Prepaid renewal. Concurrency and conservation tests. | **Yes** | 1, 2, TERM-1 |
| 9 | **SIM and managed subscriptions for dealer customers** | 8 | Status projection to the dealer. Carrier spend stays inert and human-armed. | **Yes** (money) | 8 |
| 10 | **Oversight and reporting** | 3–9 | Definer aggregate functions. Grant workflow (dealer-owner approval, maximum length per 6.2). `data_access_log` on every oversight read. | Grants: yes. Reports: no | 3–9 |
| P | **Independent sales partners** (parallel track, S1 tenant) | 2c. Partner agreement. | Partner roles (membership-only, never in `OPERATOR_TENANT_ROLES`). Restrictive RLS on CRM. Lead submission, assigned opportunities, quotes under `price_lock`, own commission view. | **Yes** (auth, money) | 2, commission terms |

### Q-gate: qualification before any external dealer gets production access

1. **Independent security review** by a party outside both agents (CLAUDE.md §0: a reviewer subagent is not an authority). Its scope:
   - roles and grants;
   - the policies and coverage-gate output;
   - the executor;
   - the definer functions (search_path, return shape);
   - the channels;
   - token resolution;
   - break-glass procedure;
   - the public TCP proxy status of the production datastore (SEC-1 / ADR-0019, reserved; S393 used `DATABASE_PUBLIC_URL`, `S393.md:105-107`).

   All findings are closed or accepted in writing by the founder.
2. The RLS SQL suite and the two-dealer API suite are green, **mutation-proven**, and run as the non-superuser role (precondition asserted).
3. The coverage gate shows every tenant table as covered or as a reasoned exemption. None of the exemptions is dealer-reachable.
4. Boot assertion on in production: the runtime role is not superuser, not BYPASSRLS, and not owner, read from the live `pg_roles`.
5. The "dealer role never resolves to Signal One's tenant" tests are green (§2.6.4).
6. A dealer **cannot** see any of the following, asserted on API responses **and** in SQL:
   - unassigned Signal One leads;
   - another dealer's anything;
   - procurement cost fields;
   - Signal One's financials;
   - Signal One's staff list.
7. A real-browser walk per dealer role at 1440 and 390.
8. Signed: the dealer agreement with the data-access clause (6.2), the POPIA operator agreement, and the Hytera distribution authority (reconciliation §7).
9. Pilot: **one** dealer, on synthetic data first, then real data with the founder's written go. Qualification is re-run at every later phase that adds a channel.

---

## 6. Decisions still needed

| # | Decision | Owner | Blocks | Default until decided |
|---|---|---|---|---|
| 6.1 | **Supplier licence terms** per PoC supplier (POCSTAR / HyTalk / Zello): bulk purchase and sub-allotment (reseller chain), divisibility and pack size, transferability, activation unit, term start, renewal, expiry and grace, reactivation. Written evidence goes into `source_document_ref`. | Founder, with each supplier | 8, 9 | Indivisible, non-transferable, **no sub-allotment** (the channel refuses), activation refused |
| 6.2 | **Dealer agreement data-access clause**: what Signal One may see (aggregates vs grants), who approves a grant, the maximum grant length, the minimum end-customer data for managed subscriptions, outcome reporting on referred leads, audit rights, exit and data return. | Founder, legal | Q-gate, 10 | Aggregates only. No grants. |
| 6.3 | **POPIA for referred leads**: Signal One's role (responsible party for its own leads; operator or separate responsible party for the dealer copy), consent wording and purpose for "referral to an approved dealer", retention of the S1 original after referral, and the data subject's objection route. | Founder, information officer | 5 | Referral refused |
| 6.4 | **Territory and exclusivity rules**: non-exclusive by default (founder). Territory definitions, referral routing (round-robin vs territory), SLA and reclaim, conflict when two dealers already know a customer. | Founder | 5 | Manual referral only |
| 6.5 | **Dealer invoicing legal requirements**: VAT tax-invoice content (the dealer's name, address and VAT number; the recipient's details above the statutory threshold; sequential number; date; description; VAT amount or inclusive statement), non-VAT-vendor dealers (no "tax invoice"), credit and debit notes, and record retention. Whether LEOS is the dealer's system of record. | Founder, accountant | 7 | Dealers record sales; no LEOS-issued retail invoices |
| 6.6 | **Stock model** (GAP-STOCK-1): `inventory_items` or `governing_assets`. | Founder, Architect | 6 | — |
| 6.7 | **Dealer spend paths**: Places sourcing and Ask LEO for dealer reps. | Founder | 4 | Removed from dealer roles |
| 6.8 | **Sales partner terms**: contractor status, quote rights (prepare vs bind), commission eligibility and payout for non-employees. | Founder, legal | P | Refer-only |
| 6.9 | **Escalation to database per dealer (§2.4 d)**, if a dealer or regulator requires provable separation. | Founder, Architect | Q-gate | No (RLS model) |

### Not verified in this read (left open on purpose)

- Whether the API's `DATABASE_URL` is literally the `postgres` login. S393 measured a session opened through `DATABASE_PUBLIC_URL`. INFERRED from Railway defaults and `C25_16:85`.
- Whether drizzle 0.44 nested `transaction()` on a proxy-held tx behaves as savepoints with this pool. Prove it on scratch in phase 2b.
- Whether the portal's `findQuote(id, tenantId = user id)` currently misses. Prove it with a test, not against production.
- Exact counts of dealer-reachable tables, and of tables without a tenant column. The figures here come from schema greps, not from a catalog query.
- That `btree_gist` and `CREATE ROLE` are available on the Railway instance.
