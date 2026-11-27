# Partner lifecycle architecture (definitive): for independent review

**Date:** 2026-11-27. **Status:** a proposal for Architect, security and founder review. It is not approved for build, and nothing here is implemented.

**Founder decisions this implements (2026-11-27):**
- Option 2 is definitive: dedicated partner lifecycle pipelines inside LEOS and the existing Sales OS.
- Four workflows share one intake, identity, notification, audit and commercial infrastructure.
- Partner records never count in customer metrics.
- Dealer accounts are provisioned automatically, behind the isolation qualification.
- Sales partners get Sales OS access automatically after qualification and agreement.
- Email notifies; it never processes.
- Licences are indivisible and non-transferable until supplier terms are confirmed.

**Trees read (read-only; `GIT_OPTIONAL_LOCKS=0`; heads fetched into a separate scratch clone; the LEOS checkout was not touched):**

| Tag | Ref | Head |
|---|---|---|
| (none) | `origin/main` | `151936f4` |
| **[r2]** | `claude/launch-integration-r2` (#756) | `f64489a9` |
| **[758]** | `claude/intake-partner-intents` (#758, stacked on r2) | `3fa96a81` |
| **[728]** | `fix/email-delivery-reliability` (#728, Mubaraq) | `0cdabbc7` |

- `claude/partner-applications-queue` **does not exist on the remote yet**: `git fetch` answered "couldn't find remote ref". The interim queue is therefore described from the brief, not from code. §2.6 maps it by role, not by table name.
- Nothing was run against a database, gated, branched, committed or pushed.
- Every file:line is on main unless it is tagged.

**Builds on:**
- `DEALER_WORKSPACE_GAP_ASSESSMENT.md` (the "assessment");
- `DEALER_PROGRAMME_AND_ISOLATION_PROPOSAL.md` (the "isolation proposal", whose phases are called DLR-n);
- `COMMERCIAL_ECOSYSTEM_RECONCILIATION_2026-11-27.md`;
- `SITE_INTEGRATION.md`.

## Verdict

1. **#758 as written inflates the customer pipeline.**
   - A `reseller-application` or `technology-partnership` is filed through the client path. It becomes a new unassigned `crm_leads` row (`lead_source = website`) or a `website_enquiries` row ([758] `website_intake_contract.ts:184-210`; `website_intake_service.ts:919-985`, `leadSource: "website"` at `:940`).
   - #758 records this itself as a "Known limit" ([758] `docs/integrations/WEBSITE_INTAKE_RECEIVER.md:470`).
   - Rep stats count every assigned `crm_leads` row as "worked" and every converted one as "won" (`drizzle_rep_sales_stats_repository.ts:53-65`). The platform overview counts every lead (`drizzle_platform_overview_repository.ts:98-99`).
   - **Rule: #758 must never reach production without the interim queue.** Ship them together, so that zero partner rows ever exist in `crm_leads`.
2. **Sales partners are filed as recruitment.**
   - #758 stores `sales-partner-application` in `recruitment_applications` ([758] `website_intake_contract.ts:255-271`). That table's lifecycle ends in `hired` ([r2] `0190_website_intake_receiver.sql:228-229`).
   - The existing rep activation creates a **workforce profile** (`rep_activation_service.ts:246-251`), and a workforce profile carries `employee_number` and `job_title` (`schema/workforce/workforce_profiles.ts:40-45`).
   - The commission engine only pays a **workforce profile** (`commission_accrual_service.ts:133-138`).
   - **None of these may be used as-is for an independent contractor** (§4.2).
3. **The design is one aggregate with typed variants, not separate pipelines.**
   - One `partner_applications` aggregate, evolved in place from the interim queue, with a `programme` discriminator: `dealer` / `sales_partner` / `technology`.
   - A stage machine per programme, enforced by a database CHECK on (programme, stage).
   - Typed detail tables per programme.
   - One event history, one outbox and one audit vocabulary.
   - **Separation from customer metrics is structural:** partner rows are never written to `crm_leads`, `opportunities` or `website_enquiries`, and a database CHECK on the intake ledger makes that a law (§6).
4. **Provisioning reuses what exists. Four corrections are needed first:**
   - **Not transactional.** `bootstrapTenant` is a check-then-create, keyed by slug, with no transaction (`tenant_bootstrap_service.ts:87-129`). It must run inside the provisioning transaction.
   - **No membership-only role set.** Today a role outside `OPERATOR_TENANT_ROLES` resolves to its **own user id** as tenant. A role inside it falls back to Signal One's tenant (`auth_service.ts:193-228, 255-257`). Partner and dealer roles need a third, membership-only set (no membership, no token).
   - **Invitation expiry.** The founder named "72h single-use". That matches the client and supplier invitations (`client_invitation_service.ts:25`, `supplier_invitation_service.ts:33`) and the quote magic link (`quote_accept_token_service.ts:6, 23`). The **staff** invitation table that partners must use (`user_invitations`, `schema/auth/user_invitations.ts:67-98`) is issued with **7 days** by its only route (`rep_invitation.routes.ts:67`). Partner invitations set 72h explicitly.
   - **Recipients.** The intake outbox addresses **users only**, never a mailbox ([r2] `website_intake_notifications.ts:34-49`). The worker already delivers to a literal address in `metadata.email` (`apps/worker/src/notifications/email_dispatch.ts:9-12`), so a central mailbox needs **no change** to Mubaraq's email pipeline.
5. **Dealer provisioning stays dark.**
   - The code may ship behind a two-key gate: a strict env flag plus a recorded qualification row.
   - It cannot run until DLR phases 1–3 and the isolation proposal's Q-gate have passed (§4.1).
   - **No dealer is created in production by this programme before then.**

---

## 0. Boundaries: what this design must not touch

### 0.1 Mubaraq's protected commercial lifecycle work

How it was identified:
- **CLAUDE.md and `docs/architecture/CURRENT_STATE.md` on main** name no person and no protected surface (`git grep -i mubaraq` returns 0 hits in both). Protection is established by **git authorship** and by this repository's launch records.
- **Git authorship:** #728 is the only PR authored by `Adigun-Mubaraq`. Its commits `0867ab7`…`0cdabbc` (2026-11-13 → 11-20) are the only commits by that author on any fetched ref.
- **Launch records:** this repo attributes quote → contract conversion and the quote-money work to him (`RELEASE_GATE.md:22, 66`; `EXECUTION.md:56, 89`; `RELEASE_READINESS_REGISTER.md:47`). PRs #731 and #732 are authored by `lancesatsuppliers-ux`, so they are **protected by attribution, not by authorship**.

| Protected surface | Evidence | How this design avoids it |
|---|---|---|
| Email delivery execution ledger and durable circuit breaker | [728] migrations `0188_circuit_breaker_epoch_bigint.sql`, `0189_email_delivery_executions.sql`; `apps/worker/src/notifications/email_job_processor.ts`, `email_delivery_execution_store.ts`, `email_dispatch.ts` | We only **enqueue** onto the existing `notifications-email` queue through the existing adapter, as [r2] does (`website_intake_notifications.ts:405-440`). Mailbox delivery uses the `metadata.email` path that already exists (`email_dispatch.ts:9-12`). There are no edits under `apps/worker/src/notifications/`, and no migration numbered 0188 or 0189. |
| LC01 quote → contract conversion and document numbering | [728] `02fa40b` "fix(lc01)": `document_number_allocator.ts`, `drizzle_quote_delivery_repository.ts`, `quote_delivery.ts`, plus the LC01 suites | Partner agreements are **not** contracts and are not numbered by `document_number_allocator`. They have their own version hash (§3.1). No edits to `quote_conversion_service.ts`. Partner commission attaches **downstream** of `onContractSigned` (§4.2). |
| Quote money (#731 VAT-inclusive totals, #732 PDF "payable now") | `packages/types/src/domain/quote_totals.ts` (#732) | Partners quote through the **unchanged** quote path. The only change is a role's permissions: no `quotes.price_override` (`packages/rbac/src/price_lock.ts:37`), and no `quotes.approve`. |
| Native signature engine | `signature_requests.contract_id` is NOT NULL and references `contracts` (`schema/signatures/signature_requests.ts:46-56`) | It is **not reused**, because that would make every partner agreement a customer contract. Only its evidence *pattern* is copied: a server-stamped IP / user agent and a content hash (`schema/signatures/signatures.ts:49-55`). |
| Sales OS shell UX (`feat/mubaraq-…` #691, `fix/mubaraq-…` #690) | `SalesCommandShell.tsx`, `SalesRepModulePanels.tsx` | Partner screens are new routes, registered through the [r2] nav-registry pattern (`apps/web/src/lib/nav-registry.ts`). There are no edits to those two components. |

### 0.2 Other in-flight work

| Work | Rule |
|---|---|
| #756 (receiver, queue, outbox, access grants, privacy) | Reused. There is no second receiver and no second relay engine (§5). |
| #758 (v1.3 intents) | The contract and its field allow-lists are kept unchanged. Only the **routing** changes, which is the interim's job. |
| Interim `claude/partner-applications-queue` | It is **evolved in place**, never replaced (§2.6). Nothing here re-implements its routing, owner, history or mailbox. |
| DLR (isolation proposal) | It owns the dealer roles, `dealer_relationships`, RLS, the channels and the Q-gate. This design **calls** them and does not define a competing version (§4.1). |
| `customer applications` (`schema/applications/applications.ts:31-70`: rental applications that draft a quote, `:58-60`) | Never reused for partners. That table belongs to the commercial lifecycle. |
| `/partners/*` API namespace | It is already the API-key marketplace (`routes/partner.routes.ts:1-25`). The new API lives under `/partner-programme/*`, and the web app under `/sales/partners/*`. |

---

## 1. Domain model

### 1.1 Shape: shared aggregate with typed variants (recommended)

| Option | For | Against | Verdict |
|---|---|---|---|
| (a) Four separate pipelines (tables, queue, notifications, audit each) | Each is simple on its own. | Triplicates the queue, outbox, privacy, retention and redaction. Contradicts "one intake / notification / audit". The four drift apart. | Rejected |
| **(b) One `partner_applications` aggregate + `programme` + per-programme stage machine + typed detail tables** | One queue, one SLA engine, one outbox, one redaction path. Typed constraints per programme. The interim queue maps onto it directly. | Needs a CHECK on (programme, stage) to stop one programme's stage being used by another. | **Recommended** |
| (c) One table with every detail in jsonb | Fastest to write. | No constraints, no typed reporting. Verification and agreement guards cannot be enforced in the database. | Rejected |

Customer enquiries and sales (workflow 1) **stay on the existing [r2] path**: `crm_leads`, `website_enquiries` and the website queue. They are **not** part of this aggregate. That is the structural separation of §6.

### 1.2 Shared vocabulary

- **Owner:** the user accountable for the next action. Exactly one per open application.
- **Next action:** an enumerated `next_action` plus a `next_action_due_at`, computed from SLA policy on every transition. Time is counted in business hours using the [r2] `business_hours.ts` (Mon–Fri 08:00–17:00 SAST, no holiday table).
- **Hold:** `information_requested` is a hold, not a stage. It records `hold_return_stage` and resumes there.
- **Terminal outcomes:** `rejected`, `withdrawn` (by the applicant) and `lapsed` (no response after the hold window). All are reasoned, audited and immutable.
- **Who may act** (new permissions; none of them is `applications.*`, which is the customer intake):

| Permission | Held by (default; founder to confirm, §8.4) | Grants |
|---|---|---|
| `partner_programme.read` | commercial_director, super_admin; per-user grant (the [r2] `website_intake_access_grants` pattern, `0193:83-112`, extended with a `partner_programme` scope) | List and detail |
| `partner_programme.act` | same | Assign, triage, request information, record verification, qualify, issue agreement, reject |
| `partner_programme.approve` | **founder decision**; default super_admin only | approve |
| `partner_programme.credit.decide` | finance_officer + super_admin | credit track only |
| `partner_programme.provision.retry` | super_admin | Re-run a failed or blocked provisioning run (never force a gate) |

- These permissions are **never** given to sales roles, and never to `platform_admin`. Stored `admin`, `api_service` and `impersonation` all read as platform_admin ([r2] `packages/rbac/src/matrix.ts`, comment on the R1-INTAKE-4 ruling).
- **Separation of duties:** the user who approves ≠ the user who recorded the last verification check ≠ the applicant's own user (enforced in the service, and by a trigger on the event row).

### 1.3 Dealer / reseller lifecycle

| # | Stage | Entry guard (server-side; refused otherwise) | Actor | Next action, SLA default (§8) | Exits |
|---|---|---|---|---|---|
| 1 | `submitted` | Created by the intake transaction, or by staff with the same field allow-list | system / act | `triage`, owner assigned within **1 business day** | 2, rejected |
| 2 | `screening` | Owner set | act | `screen`, **2 business days** | 3, hold, rejected |
| 3 | `verification` | Screening note recorded | act | `verify`, **5 business days** | 4, hold, rejected |
| 4 | `qualification` | Every **required** check for `dealer` has outcome `pass` or `waived`, with a reason (§3.2) | act | `qualify`: territory, segments, volume band, commercial fit | 5, rejected |
| 5 | `agreement_pending` | Qualification record complete. An **active** agreement version exists for `dealer` | act issues | `await_acceptance`: link valid 72h, re-issuable | 6, lapsed |
| 6 | `approval_pending` | An acceptance row exists for the **current** version, and its hash matches (§3.1). The credit track is decided or explicitly `prepaid` (§3.3) | system | `approve`, **2 business days** | 7, rejected |
| 7 | `approved` | Approver passes SoD (§1.2). This is irreversible: a reversal is a new `rejected` event with a reason, never an edit | approve | none for humans. A provisioning run is enqueued in the **same** transaction | 8 |
| 8 | `provisioning` | A run exists. The gates of §4.1 are checked **inside** the run | system | automatic. `blocked` / `failed` notify ops | 9, (stays here while blocked) |
| 9 | `active` | The dealer owner has redeemed the invitation, so a membership exists in the dealer tenant | system | none. The relationship lifecycle (suspend / terminate) lives on DLR's `dealer_relationships` | — |

`information_requested` can be entered from stages 2–4 and returns to the stage it left. The applicant gets a 72h single-use response link (§3.4), and the hold lapses after **14 calendar days**, with a reminder at day 7.

### 1.4 Independent sales partner lifecycle (its own onboarding; never recruitment)

| # | Stage | Entry guard | Actor | Next action, SLA default |
|---|---|---|---|---|
| 1 | `submitted` | Intake (`kind=sales`, `intent=sales-partner-application`), routed to `partner_applications`, **not** `recruitment_applications` | system | `triage`, 1 business day |
| 2 | `screening` | Owner set | act | 2 business days |
| 3 | `verification` | — | act | identity, and a tax reference for payouts (founder decides depth, §8.2) |
| 4 | `qualification` | Required checks pass or are waived | act | `qualify`: network, region, segments |
| 5 | `agreement_pending` | An active `sales_partner` agreement version exists | act | 72h link |
| 6 | `approval_pending` | Current-version acceptance with matching hash. A commission plan linked, or `commission_plan_id IS NULL` recorded with "no commission until terms" (§4.2) | system | 2 business days |
| 7 | `approved` | SoD | approve | auto-provision |
| 8 | `provisioning` | §4.2 gates | system | automatic |
| 9 | `active` | Partner redeemed the invitation | system | — |

- **Recruitment reuse, but no permanent recruitment classification:**
  - The intake, consent, restriction, retention and redaction machinery of [r2] is reused, together with the reader UI pattern of `website_applications`.
  - The record lives in `partner_applications`, so `recruitment_applications` stays employment-only.
  - A candidate who is really applying for employment is **re-routed** by staff: a `rerouted_to_recruitment` terminal event, plus a new recruitment record that carries the same submission reference. Records are never reclassified in place.

### 1.5 Technology and strategic partnership lifecycle (no system access)

| # | Stage | Guard | Actor | Next action |
|---|---|---|---|---|
| 1 | `submitted` | Intake `technology-partnership`, or staff | system | triage, 2 business days |
| 2 | `triage` | Owner set | act | fit and partnership type |
| 3 | `discovery` | Triage note | act | first call |
| 4 | `evaluation` | Discovery note | act | technical and commercial assessment |
| 5 | `terms` | Evaluation record | act | NDA / MoU version issued (§3.1, programme `technology`) |
| 6 | `agreed` | Acceptance with matching hash | approve | — |
| 7 | `active` / `parked` / `ended` | — | act | review date |

There is **no provisioning step**. Any integration access goes through the existing API-key flow (`partner.routes.ts`), as a separate, explicit act.

---

## 2. Data model and migrations

Numbering:
- CLAUDE.md's "0137+" rule is **stale**. [r2] already claims files up to `0203`, and new numbers are assigned by the Architect, never self-assigned ([r2] `docs/architecture/NUMBER_RESERVATIONS.md:3-5, 56-57`).
- 0188 and 0189 are contested, by #728 among others (`:41-42`).
- Placeholders below are **M-PL-n**. Real numbers come above the highest landed, at build.
- Every file carries `BACKUP CLASS` in its header before the gate runs (`ENGINEERING_CONSTITUTION.md:308-323`), plus `reversals/NNNN_down.sql`, which is the [r2] pattern.

### 2.1 Tables

All of these are in Signal One's tenant, with `tenant_id NOT NULL` and every repository behind `requireTenantId`, unless they are marked as platform tables.

| Table | Key columns | Constraints and indexes |
|---|---|---|
| `partner_applications` (**the interim's table, evolved**) | `id`, `tenant_id`, `reference` (the submission's `SO-…` when it came from intake, else a CSPRNG `PA-` + 12 Crockford characters), `programme`, `stage`, `hold` (bool), `hold_return_stage`, `owner_user_id`, `next_action`, `next_action_due_at`, `stage_entered_at`, `submission_id` (nullable), `contact_name`, `contact_email`, `contact_phone`, `organisation_name` (nullable for sales partners), `fields` jsonb (as submitted, immutable), `outcome`, `outcome_reason`, `decided_by`, `decided_at`, `redacted_at`, `version` | CHECK `programme IN (…)`. CHECK **(programme, stage) pair** against an explicit list. CHECK `hold = (hold_return_stage IS NOT NULL)`. UNIQUE `reference`. UNIQUE `(tenant_id, submission_id)` where not null. Index `(tenant_id, programme, stage, next_action_due_at)` for the queue, and `(tenant_id, owner_user_id) WHERE outcome IS NULL`. Guard trigger: `fields` is immutable, and only the redaction marker may blank it (the [r2] 0200/0202 pattern). |
| `partner_application_events` (the interim's history, evolved) | `application_id`, `tenant_id`, `event`, `from_stage`, `to_stage`, `actor_id`, `impersonator_id`, `reason`, `correlation_id`, `idempotency_key` | Append-only (no UPDATE / DELETE / TRUNCATE triggers, as in [r2] 0192). UNIQUE `(tenant_id, idempotency_key)`. Composite FK `(application_id, tenant_id)`. A SoD trigger on `approved` (§1.2). |
| `partner_dealer_details` / `partner_sales_partner_details` / `partner_technology_details` | 1:1 with the application. Typed qualification data **entered by staff**: regions, segments, volume band, brands, sales channels; registered name, registration no. and VAT no. for dealers; region and network for sales partners; partnership type for technology | PK = `application_id`. CHECK that the parent's programme matches (deferred trigger). |
| `partner_verification_checks` | `application_id`, `check_type` (`company_registration`, `vat_registration`, `director_identity`, `bank_account`, `tax_reference`, `trade_reference`), `method` (`registry_lookup`, `document_sighted`, `applicant_attested`), `outcome` (`pending`, `pass`, `fail`, `waived`), `registry_reference`, `evidence_asset_id` (nullable, an EDIP asset), `checked_by`, `checked_at`, `valid_until`, `reason` (required for `waived` and `fail`), `redacted_at` | A partial UNIQUE gives one live check per (application, type). Superseding a check inserts a new row and marks the old one `superseded_at`, with no edits. CHECK `outcome <> 'waived' OR length(reason) >= 10`. |
| `partner_agreement_versions` | `programme`, `version_label`, `content_sha256`, `document_asset_id`, `effective_from`, `retired_at`, `approved_by` | UNIQUE `(tenant_id, programme, version_label)`. A partial UNIQUE gives one **active** version per programme. Immutable once published (trigger). |
| `partner_agreement_acceptances` | `application_id`, `agreement_version_id`, `content_sha256` (copied), `accepter_name`, `accepter_email`, `accepter_capacity`, `authority_attested` (bool), `accepted_at` (**server time**), `ip_address`, `user_agent`, `method` (`click_accept`), `token_id`, `evidence_sha256` = SHA-256 of (version hash ‖ application id ‖ accepter email ‖ accepted_at ‖ token id) | Append-only. A trigger refuses the row if `content_sha256` ≠ the version's hash, or if the version is retired. UNIQUE `(application_id, agreement_version_id)`. |
| `partner_applicant_tokens` | `application_id`, `purpose` (`information_request`, `agreement_acceptance`), `token_hash` (SHA-256), `expires_at` (NOT NULL, 72h), `consumed_at`, `revoked_at` | UNIQUE `token_hash`. A partial UNIQUE gives one live token per (application, purpose). Consumption is a single conditional UPDATE (`WHERE consumed_at IS NULL AND expires_at > now()`). |
| `partner_credit_requests` (a separate track, §3.3) | `application_id`, `requested_limit_cents`, `decision` (`prepaid`, `approved`, `declined`), `approved_limit_cents`, `terms_ref`, `decided_by`, `decided_at` | Append-only. CHECK `decision <> 'approved' OR approved_limit_cents > 0`. |
| `partner_provisioning_runs` | `application_id`, `kind` (`dealer_workspace`, `sales_partner_access`), `idempotency_key` = `kind:application_id`, `status` (`pending`, `blocked`, `running`, `awaiting_invitation`, `succeeded`, `failed`), `gate_code`, `attempts`, `last_error_code`, the created ids (`dealer_tenant_id`, `dealer_client_id`, `relationship_id`, `profile_id`, `invitation_id`) | UNIQUE `idempotency_key`. CHECK that a terminal status means `completed_at` is set. Status moves only by a guarded trigger: never back from `succeeded`. |
| `platform_qualifications` (**platform**, no tenant) | `gate_key` (`dealer_isolation`, `sales_partner_role`), `status` (`qualified`, `revoked`), `evidence_ref` (review report), `reviewer` (independent, named), `approved_by` (founder), `recorded_at` | Append-only. The current state is the newest row per key. Only a founder-approved, out-of-band ops script inserts here. Runtime roles get INSERT revoked when DLR-2a lands. |
| `sales_partner_profiles` | `user_id` (nullable until redeemed), `application_id`, `engagement_type` (CHECK `= 'independent_contractor'`), `status` (`invited`, `active`, `suspended`, `terminated`), `agreement_acceptance_id` NOT NULL, `commission_plan_id` (nullable) | UNIQUE `(tenant_id, user_id)` where not null. UNIQUE `application_id`. **No** `employee_number` and **no** workforce link. |
| `crm_lead_partner_attributions` | `lead_id`, `partner_profile_id`, `submitted_at`, `consent_record_id` | UNIQUE `lead_id`. Composite tenant FKs. A new table, so `crm_leads` is not altered (0190 deliberately "installs nothing on crm_leads", [r2] `0190:157-162`). |
| `partner_notifications`, `partner_notification_deliveries`, `partner_notification_routes` | §5 | §5 |
| `dealer_relationships` (**DLR-owned**, platform) | isolation proposal §2.3e, assessment §B | Listed here only to prevent a second definition. This programme writes it through DLR's service. |

### 2.2 Intake routing law (if the interim has not already added it)

- `website_intake_submissions.record_type` gains `partner_application`.
- The routing CHECK becomes (extending [r2] `0190:138-144`):
  - `kind='client'` → `record_type IN ('crm_lead','website_enquiry','partner_application')`;
  - `kind='sales'` → `record_type IN ('recruitment_application','partner_application')`;
  - **plus**: `intent IN ('reseller-application','technology-partnership','sales-partner-application') ⇔ record_type = 'partner_application'`.
- `website_intake_submission_has_record()` ([r2] `0190:165-187`) gains the `partner_application` branch: same tenant, and `submission_id` points back.
- [r2] `website_intake_retention_policies.data_class` (`0192:160-162`) gains `partner_application`.

### 2.3 Migrations

All are audit-class (migrations).

| # | Content | BACKUP CLASS | Justification | Reversal |
|---|---|---|---|---|
| M-PL-1 | §2.2 routing law, has-record function, retention class | **B** | It replaces the CHECKs and a function on existing [r2] tables and writes no row. 0203 is the precedent ([r2] `NUMBER_RESERVATIONS.md:56`). Pre-image: `pg_get_constraintdef` / `pg_get_functiondef`. | Restore the definitions byte-identically. **Refuses** while any `partner_application` ledger row exists. |
| M-PL-2 | Evolve the interim `partner_applications` and events: `programme`, stage columns, the (programme, stage) CHECK, `next_action*`, `hold*`, indexes | **B** | ALTERs an existing table. Defaulted `ADD COLUMN` causes no rewrite, but §2.6 maps the stage with an UPDATE. Row pre-image: `(id, status)` of the affected rows only. | Restore status from the pre-image and drop the added columns. Refuses if any row has a stage the interim cannot represent. |
| M-PL-3 | Detail tables, verification checks | **A** | New, empty objects only. Their FKs target M-PL-2's table without altering it. | DROP. Refuses if there are rows (data would be lost; class C territory). |
| M-PL-4 | Agreement versions and acceptances, applicant tokens | **A** | New, empty. | DROP. Refuses if there are rows. |
| M-PL-5 | `partner_credit_requests` | **A** | New, empty. | as above |
| M-PL-6 | Notification outbox, deliveries, routes (§5) | **A** if new. **B** if the interim stored the mailbox in a table that is altered here. | — | DROP / restore |
| M-PL-7 | `crm_lead_partner_attributions` | **A** | New, empty. `crm_leads` is untouched. | DROP. Refuses if there are rows. |
| M-PL-8 | `user_role` enum `ADD VALUE 'sales_partner'`; `audit_action` values (§5.4) | **B** | Alters existing types. An enum value cannot be dropped. Coordinate with `claude/rc4-audit-action-enum-convergence`. | Code-level: **refuses while any user holds `sales_partner`**, following the 0173 pattern (`user_role_storage.ts:49-55`). The value stays, unused. |
| M-PL-9 | `sales_partner_profiles`, `partner_provisioning_runs`, `platform_qualifications` | **A** | New, empty. | DROP. Refuses if there are rows. |

Avoided on purpose:
- Any **class C** step. Nothing is deleted. Redaction is the [r2] 0200 mechanism, human-armed.
- Any `ALTER` on `crm_leads`, `opportunities`, `quotes`, `contracts` or `commission_*`.

### 2.4 Migration runner hazards (they apply to every file above)

- `migrate.js` **silently skips** `42710` / `42P07` (isolation proposal §2.1, `apps/api/scripts/migrate.js:122-136`).
- So each file opens with the [r2] "REFUSED: object(s) already exist" guard block (`0197:60-77`), and versions trigger and policy names (`…_v2`).

### 2.5 Isolation readiness

- Every new tenant-scoped table uses `tenantIdCol()` (NOT NULL uuid), so DLR's RLS template applies unchanged.
- `platform_qualifications` is platform-scoped and **must** be listed in DLR's `RLS_EXEMPTIONS` with a reason.

### 2.6 Data migration from the interim queue

The interim's table names are assumed. M-PL-2 is written **against the interim's landed schema**, mapped by role.

| Interim status | Definitive stage | Why |
|---|---|---|
| `submitted` | `submitted` | Identical. |
| `in_review` | `screening` | First human stage. |
| `information_requested` | the current stage plus `hold = true`, `hold_return_stage = 'screening'` | Holds are orthogonal. |
| `approved` | **`qualification`**, never `approved` | The interim captured no verification and no agreement evidence. Mapping to `approved` would **trigger provisioning** without the guards. Each such row gets a migration event recording "migrated from interim approved: verification and agreement required", and a notification to its owner. |
| `rejected` | outcome `rejected`, reason kept | Terminal. |

- **Programme:** derived from the submission's `intent` (exact map). A row without an intent is refused by the migration and listed for manual triage. It is never guessed.
- **Owner and history:** copied as they are. Interim history rows keep their original timestamps and actors.
- **Pre-interim strays** (only if #758 was ever deployed alone):
  - `crm_leads` rows whose submission intent is a partner intent are listed by a read-only script. They are **not** auto-deleted.
  - Cleanup is a separate class-B cycle (`deleted_at` set, with a row pre-image) on founder instruction.
  - The ledger rows stay immutable ([r2] `0190:272-282`).
  - **Recommended:** never deploy #758 alone, so that this list is empty.

---

## 3. Agreements, verification and credit

### 3.1 Agreement capture

- **Text and versions.**
  - Agreement texts are founder and legal artefacts (§8.1). Each published version is stored once as an EDIP document asset (CLAUDE.md §3: never bypass Enterprise Document Assets).
  - Its `content_sha256` is computed on the **exact bytes shown** (rendered HTML or PDF).
  - A version is immutable after publication. A change is a new version.
- **Acceptance flow.**
  1. Staff issue the agreement, which mints an `agreement_acceptance` token (§3.4).
  2. The applicant opens the link, the server renders that version, and the page shows its hash.
  3. The applicant types their name and capacity, ticks "I have authority to bind [organisation]", and accepts.
  4. The server stamps `accepted_at`, the IP (through the [r2] trusted-proxy rules) and the user agent. It writes the acceptance row and the stage event in one transaction, then consumes the token.
- **Evidence.** Who: name, email and capacity. When: server time. Where: IP and user agent. What: the version id and hash. How: token id. Plus `evidence_sha256`. Evidence is retained for the agreement term plus a period the founder sets (§8).
- **Re-acceptance.** A new version for an **active** partner creates a `re-acceptance required` task. Access continues under the old version until a cut-off the founder sets.

### 3.2 Verification (POPIA minimisation)

| Check | Collected | Stored | Not stored | Required for |
|---|---|---|---|---|
| Company registration | Registered name and registration no. (staff look it up in the CIPC public register) | outcome, method `registry_lookup`, registry reference, checked_by/at | Copies of CIPC documents, unless §8.2 requires them | dealer |
| VAT | VAT no. (SARS VAT vendor search) | outcome, reference | — | dealer (if VAT-registered; non-vendors recorded as `waived` with a reason) |
| Director / signatory identity | Name and capacity. ID is **sighted**, by video or in person | outcome `pass`, method `document_sighted`, who sighted it, date | **SA ID number and ID copy**, by default (§8.2) | dealer signatory; sales partner |
| Tax reference (payouts) | Income tax ref | outcome; the reference is held only in the payout record when payouts go live | — | sales partner, before the first payout only |
| Bank account | Confirmation letter | outcome, last 4 digits | full number (it lives in the payout system) | before the first payout or credit |

- **Where evidence lives:** if a document must be kept, it is an EDIP asset with a restricted category. **It never goes in `documents`**, whose reads are tenant-wide (`schema/documents/documents.ts:22-39`; `auth_service.ts:185-192` names documents as a tenant-wide read).
- **Retention:**
  - Rejected, withdrawn and lapsed applications are redacted after a period the founder sets (§8). The proposed default is **12 months**.
  - Active partners' evidence lasts the agreement term plus the statutory period.
  - Both are enforced by the [r2] retention runner with a new data class (M-PL-1).
- **Information officer items** go into the privacy notice update (reconciliation §7).

### 3.3 Credit: a separate track

- `partner_credit_requests` is independent of the lifecycle. A dealer reaches `approval_pending` only with a credit decision recorded, and the default is **`prepaid`** (founder policy: prepaid wholesale, isolation proposal header).
- An approved limit is written to the dealer's S1 `clients.credit_limit_cents` (`schema/crm/clients.ts:89`) **only by the finance role**. That field is not enforced today (assessment §D4), so this is **money / audit-class**, and it is out of scope until enforcement exists.

### 3.4 Applicant links (no new auth system)

- Applicant links reuse the **existing token pattern** (`quote_accept_token_service.ts:1-12`):
  - 32 random bytes;
  - SHA-256 at rest;
  - 72h;
  - single-use;
  - a generic 404 for an invalid, expired or consumed token.
- They live in their own table (`partner_applicant_tokens`), never in `quote_accept_tokens` (commercial lifecycle).
- This is a **public route, so it is audit-class (auth)**. It is rate-limited like the intake.

---

## 4. Automatic provisioning

### 4.1 Dealer workspace: idempotent, fail-closed, dark until qualified

**Hard gates.** All are checked inside the run's transaction, and any failure means `blocked` with a `gate_code`:

| Gate | Source |
|---|---|
| `PARTNER_DEALER_PROVISIONING_ENABLED === "true"` (strict string compare, the `EMAIL_SEND_ENABLED` pattern, `packages/config/src/env.ts:144-150`). Default unset. | env |
| The newest `platform_qualifications` row for `dealer_isolation` is `qualified`: the isolation proposal's Q-gate items 1–9 (independent review, RLS suite, coverage gate, boot assertion, "dealer role never resolves to S1", SQL plus API non-visibility, a browser walk, signed dealer agreement / POPIA / Hytera authority, pilot) | DB |
| DLR phase 3 landed: dealer roles in RBAC, the membership-only resolution set, `dealer_relationships` | code presence, checked at boot and in the run |
| Application `stage = 'approved'`. A current-version acceptance with matching hash. All required checks pass. Credit decided | DB |
| External link domain configured (`portal.signalone.co.za` or the founder's alternative; `CUSTOMER_PORTAL_DOMAIN_QUALIFICATION.md`). Invitations are never sent from `app.lancesatsuppliers.co.za` to external dealers | env |

**Steps** (one DB transaction, system principal `channel:dealer_provisioning`, the DLR channel pattern):
1. Lock the application `FOR UPDATE`. Insert the run `ON CONFLICT (idempotency_key) DO NOTHING`. If the run is already `succeeded` or `awaiting_invitation`, return its ids. Done.
2. Create the dealer tenant through a **transaction-aware** `bootstrapTenant`. Today the function is not transactional and keys idempotency on the slug (`tenant_bootstrap_service.ts:87-129`), so it is refactored to take `tx`.
   - Slug: deterministic from the application id (`dlr-<base32>`), never from the company name (no PII; no collisions, given `tenants.slug` UNIQUE at `schema/tenants/tenants.ts:47`).
   - Status `PENDING_SETUP` (`:29-34`).
   - The CoA comes from DLR phase 1 (ENV-1).
3. In S1's context, create the dealer's wholesale `clients` row with the dealer marker (DLR phase 5 defines the marker; here, insert only).
4. Through DLR's service, write `dealer_relationships(status='pending_owner_activation')`.
5. Write audit rows in **both** tenants with one correlation id. Set run status `awaiting_invitation` and application stage `provisioning`.

**After commit (outbox step, its own transaction):**
- The relay mints the owner invitation: `user_invitations` row in the **dealer** tenant, role `dealer_owner`, **`expires_at = now + 72h`**, token hash only (`schema/auth/user_invitations.ts:67-98`).
- It enqueues the email with dedup key `pv-<run id>` in the same transaction. The raw token exists **only** in that job payload. Logs already redact magic-link paths (`apps/api/src/logger.ts:13`).
- Resending revokes the live invitation and mints a new one, so single-use holds.

**Redemption:**
- A `DealerOwnerActivationService` is modelled on `RepActivationService`: all-or-nothing in one transaction, with the tenant, email and role taken **from the invitation row** (`rep_activation_service.ts:1-40`).
- It creates the user (stored role from DLR), a membership in the dealer tenant only, and **no workforce profile in S1**.
- It sets the relationship `active`, the run `succeeded` and the application `active`.
- Dealer staff are then invited **by the dealer owner** inside the dealer tenant. Signal One does no manual account creation and sends no individual onboarding emails.

**Failure handling:**
- Any step error rolls back, then the run is marked `failed` with `last_error_code` in a separate transaction.
- Retry is idempotent, by step 1.
- `blocked` and `failed` raise `provisioning.blocked` / `.failed` (§5).
- No partial tenant can exist: a tenant row without its relationship is impossible inside one transaction, and a nightly reconciliation query asserts it.

### 4.2 Sales partner access: a user in S1's tenant, new partner role, never employment

**Role `sales_partner`:**
- New RBAC role, new stored value (M-PL-8), mapped in `user_role_storage.ts` (the single bridge, `:1-20`).
- It goes in a **new membership-only set**: resolved from an active S1 membership; no membership or unwired memberships means **no token**.
- It is **never** in `OPERATOR_TENANT_ROLES` (`auth_service.ts:193-212`). Outside that set, the role would get its own id as tenant (`:221-228`), which is fail-closed but useless.

**Permission set:** derived from the rep set (`packages/rbac/src/matrix.ts:389-494`), **minus the tenant-wide and spend grants**.

| Keep (all already owner-forced) | Remove, and why |
|---|---|
| `crm.own.read`; a new `crm.partner.submit` (create a lead attributed to self, §6) | `commerce.contact_requests.read`: the tenant-wide shared inbox (`:407-417`) |
| `clients.own.read/write` | `leads.read/create/update/convert`: the commerce `leads` table, not owner-bound (`:403-406`) |
| `quotes.list/read/create/update/submit/cancel`, bounded by `quoteVisibilityFor` (`apps/api/src/lib/quote_visibility.ts:45-50`) | `growth.generate`, `growth.prospects.read` (Places spend) |
| `products.catalog.read` | `ai.ask`, `ai.actions.request` (model spend) |
| `commission.own.read` | `attendance.*`, `leave.*` (employment) |
| `sales_packs.*`, `training.*`, `notifications.*`, `myday.read` | `crm.call` (founder decision), and `myday.write` until targets apply to partners |

**Binding quotes and discounts:**
- The partner has **no** `quotes.price_override` (the price lock fails closed, `price_lock.ts:37`) and **no** `quotes.approve`.
- Every partner quote is `submit`ted for approval by holders of `quotes.approve` (`matrix.ts:517`).
- Whether a within-policy partner quote may be sent without approval is a founder decision (§8.5). The default is **always approve**. No quote-money code changes.

**Provisioning:**
- Same run table and gates: strict flag `PARTNER_SALES_PROVISIONING_ENABLED`, plus `platform_qualifications('sales_partner_role')`. This is an independent security review of the role, its resolution and its owner scope; full DLR RLS is **not** required (§8.6).
- The transaction writes the `sales_partner_profiles` row, plus the outbox step: `user_invitations` in **S1** with role `sales_partner` and **72h**.
- **Redemption:** a `SalesPartnerActivationService`, a sibling of `RepActivationService`, **not** a call to it. It creates the user, the membership, and links `profile.user_id`. **No `workforce_profiles` row and no `growth_workforce_members` row** (`schema/growth_workforce/index.ts:52-63` is the hiring funnel).

**Commission linkage (money, audit-class, flag-off until the terms are decided):**
- `CommissionAccrualService` resolves the agent through `workforceRepo.findActiveProfileIdByUserId` and skips `no_workforce_profile` (`commission_accrual_service.ts:133-138`). `commission_ledger.agent_id` has no FK (`packages/database/drizzle/0033_commission_engine_runtime.sql:125`).
- Introduce a `CommissionAgentResolver` port. It returns the workforce profile id, or the active `sales_partner_profiles.id`.
- Partner plans are `commission_plans` rows with `agent_id = profile id`, or a partner-global plan (`schema/finance/commission_plans.ts:38-57`).
- **Partner prepares the quote:** the existing `preparedBy → onContractSigned` call (`quote_conversion_service.ts:860-880`) already carries the partner's user id, so **no change to the conversion code** is needed.
- **Partner refers, a Signal One rep closes:** a separate, idempotent accrual consumer reads converted contracts whose lead has a `crm_lead_partner_attributions` row. It writes `referenceType = 'PARTNER_REFERRAL'` through the same ledger key (`commission_accrual_service.ts:97-109`), polled per tenant. `domain_events` has no tenant column (assessment A1), so it is not used.
- **Payouts to non-employees** need tax and contractor terms (§8.5). They stay off.

---

## 5. Notifications and links

### 5.1 Infrastructure (one relay, one transport)

- **Relay:**
  - The [r2] relay engine guarantees a transactional outbox, backoff, dead-lettering, `awaiting_recipient`, `FOR UPDATE SKIP LOCKED`, a per-delivery dedup key, and an eligibility re-check at hand-off ([r2] `website_intake_notifications.ts:1-66`).
  - It is **extracted into a table-parameterised engine** with no behaviour change. Proof: the [r2] suites pass unmodified.
  - `partner_notifications` uses it. The intake outbox's CHECKs stay intake-only (`0197:100-108`).
- **Recipient kinds:**
  - `user`: today's path; the worker resolves the user's own address.
  - `mailbox`: a `partner_notification_routes` row; the payload carries `metadata.email`, which the worker already resolves first (`email_dispatch.ts:9-12`).
  - `applicant`: the application's `contact_email`, for applicant-facing events only.
- **Routes:**
  - `partner_notification_routes(tenant_id, event_class, destination_email, status: unverified | verified | disabled, verified_at, verified_by)`.
  - **An unverified route is never sent to.** Its deliveries wait in `awaiting_recipient` and raise an alert.
  - Verification: the system sends a one-time code to the mailbox, and an admin enters it in LEOS. This is how the proposed `operations@signalone.co.za` becomes verified (§8.7).
  - The interim's configurable mailbox becomes the first route (M-PL-6).
- **Arming:** delivery also requires the existing transport arming (`env.ts:144-153`). If that is off, rows stay pending and visible.

### 5.2 Event catalogue

Every event is written in the transaction that causes it.

| Event | Ops mailbox | Owner | Approvers | Applicant |
|---|---|---|---|---|
| `application.received` (per programme) | ✓ | — | — | (the intake receipt already covers it) |
| `application.assigned` / `.reassigned` | ✓ | ✓ new owner | — | — |
| `application.information_requested` | ✓ | — | — | ✓ link (72h) |
| `application.applicant_responded` | ✓ | ✓ | — | — |
| `application.hold_lapsing` (day 7) / `.lapsed` | ✓ | ✓ | — | ✓ reminder / closure |
| `application.verification_completed` | ✓ | ✓ | — | — |
| `application.agreement_issued` | ✓ | — | — | ✓ link (72h) |
| `application.agreement_accepted` | ✓ | ✓ | ✓ | — |
| `application.approval_requested` | ✓ | — | ✓ | — |
| `application.approved` / `.rejected` / `.withdrawn` | ✓ | ✓ | — | ✓ outcome, no internal reasons |
| `application.sla_breached` | ✓ | ✓ | — | — |
| `provisioning.blocked` / `.failed` / `.succeeded` | ✓ | ✓ | — | — |
| `partner.invitation_issued` / `.invitation_expired` | ✓ | ✓ | — | ✓ invitation |
| `partner.activated` | ✓ | ✓ | — | — |

### 5.3 Content and links (no PII leakage)

- **Internal messages** carry the event, the programme, the stage, the opaque reference, the SLA due time, and a link. Like [r2] (`website_intake_notifications.ts:316-353`), they carry **no names, company names, email addresses or field values**.
- **Internal link:** `${PUBLIC_WEB_BASE_URL}/sales/partners/applications/${reference}`, with `PUBLIC_WEB_BASE_URL` from `env.ts:179-182`.
  - The reference is the CSPRNG one, never an id or sequence. The link **carries no token**.
  - Opening it requires sign-in plus `partner_programme.read`. Anything else gets **404**, never 403, following `quote_visibility.ts:38-41`.
  - A forwarded email therefore grants nothing.
- **Applicant messages** carry only the applicant's own reference, a link and a plain instruction. They never carry internal notes, verification outcomes or reasons.
- **Email never processes.** There are no reply-to-approve actions and no state-changing links for staff. The only state-changing links are the applicant's single-use tokens, each limited to its own purpose.

### 5.4 Audit

- **Existing actions to reuse:** `application.submitted / reviewed / approved / rejected / withdrawn` (`schema/audit/audit_logs.ts:53-57`).
- **New `audit_action` values (M-PL-8):** `partner.application.stage_changed`, `partner.verification.recorded`, `partner.agreement.published`, `partner.agreement.accepted`, `partner.provisioning.started / blocked / failed / succeeded`, `partner.invitation.issued`, `partner.notification_route.verified`.
- **Every detail read** of an application writes `data_access_log`. That table has no tenant column and no writer today (isolation proposal, verdict item 3). The definitive build depends on DLR phase 1 adding `subject_tenant_id`; until then, detail reads are audited through `audit_logs`, as [r2]'s reader does.

---

## 6. Reporting separation (structural, not by filter convention)

| Layer | Mechanism |
|---|---|
| **Storage** | Partner applications live only in `partner_applications`. They are never written to `crm_leads`, `opportunities`, `website_enquiries` or `recruitment_applications`. |
| **Database law** | The intake routing CHECK (§2.2): a partner intent can only be filed as `partner_application`. A has-record trigger proves that the row exists in the partner table. |
| **Code** | The intake's `fileClientSubmission` is never reached for partner intents. A typed router branches **before** it. |
| **Readers** | The 11 non-test files that read `crm_leads` (for example `drizzle_rep_sales_stats_repository.ts`, `drizzle_platform_overview_repository.ts`, `drizzle_revenue_intel_day_repository.ts`, `drizzle_quote_conversion_funnel_repository.ts`) and the 26 that read opportunities need **no change and no filter**. |
| **Partner-submitted customer leads** | These **are** customer pipeline. They are real `crm_leads`, attributed through `crm_lead_partner_attributions`. They stay in pipeline, forecast and conversion, and are reportable by partner. |
| **Partner reporting** | Its own read model: counts by programme and stage, SLA attainment, time-to-activate, verification pass rates. It is built with the `read-model-domain` pattern and never unioned into customer metrics. |

**Test strategy:**
1. **Metamorphic control.**
   - Seed a tenant with customer leads, quotes and contracts, and snapshot every metric endpoint: rep stats, funnel, forecast aggregation, revenue intelligence day, platform overview, My Day.
   - Then insert N partner applications across every programme and stage, including `active` partners, through the **real intake HTTP path** with literal site fixtures ([758] `website_intake_contract.test.ts` `PARTNER_FORMS` style).
   - Assert that every snapshot is **byte-identical**.
2. **Database law.** As a non-superuser role, a direct INSERT of a ledger row (partner intent with `crm_lead`) must fail with `check_violation`.
3. **Mutation proof.** Route a partner intent into `fileClientSubmission` and expect 1 red. Drop the routing CHECK and expect 2 red. Re-run after restoring each one. A control that is green on first write is reported as vacuous.
4. **Positive control.** A partner-submitted customer lead **does** move rep stats and pipeline. This proves the test is not blind.
5. **Source allow-list gate.** A grep gate fails if any file under the metric repositories imports a `partner_*` table.

---

## 7. Security review checklist and test strategy

**Audit-class** (CLAUDE.md §0-R.15: a defect not undone by a code rollback):
- all migrations;
- the role, its resolution set, invitation redemption and applicant tokens (auth);
- provisioning and `dealer_relationships` writes (tenant law);
- commission linkage and credit (money);
- the routing law, because a misroute discloses partner PII to sales roles.

**Not audit-class:**
- read-only partner reporting;
- Sales OS screens over the new APIs.

### Checklist

1. **Tenant.** Every new repository uses `requireTenantId`. A cross-tenant reference returns 404, proven by a two-tenant test that extends `tenant_isolation_security.integration.test.ts`.
2. **Role resolution.**
   - A `sales_partner` or dealer role with no membership gets **no token**.
   - Table-driven: these roles are absent from `OPERATOR_TENANT_ROLES`.
   - Mutation: add the role to the set and expect red.
3. **Scope.** The partner sees only its own leads, clients and quotes, and **no** shared inbox, commerce leads, Places, AI, attendance or price override. Each is asserted on the API and in SQL. A rep and a partner in the same tenant cannot see each other's books.
4. **Stored-role rollback floor.** An unmapped stored value reads as `read_only_auditor`, which holds reads (`user_role_storage.ts:45-55`). The rollback runbook therefore deactivates every `sales_partner` user **before** a code revert. That runbook is a test-backed refusal, as with 0173.
5. **Tokens.**
   - Single-use under concurrency: two parallel redemptions give one success.
   - Expired, consumed and unknown tokens are indistinguishable.
   - A token for one purpose cannot be used for another.
   - The raw token never appears in a DB row, a log or an audit row (grep the test DB and the log capture).
6. **Provisioning.**
   - **Idempotency:** the same run twice gives one tenant.
   - **Concurrency:** N parallel approvals of one application give one run.
   - **Fail-closed:** each gate is removed in turn, and each removal gives `blocked` with the right code.
   - **Atomicity:** a fault injected after the tenant is created leaves no tenant row.
   - **Never a dealer membership in S1.**
7. **Agreement integrity.** A hash mismatch is refused by the trigger. A retired version is refused. The server time and IP are used even if the client sends its own.
8. **Notifications.** No PII in subject or body (property test over every event with PII-bearing fixtures). An unverified route sends nothing. Opening a link without permission gives 404.
9. **SoD.** The approver equals the verifier → refused, both in the service and by the trigger.
10. **Controls run where the behaviour exists.**
    - The invitation and agreement pages are tested in a real browser at 1440 and 390, against a local build with the mock mailer.
    - The DB-law tests run as a **non-superuser** role, and assert the precondition `rolsuper = false, rolbypassrls = false` first (isolation proposal §2.6.1).
11. **Fixtures hostile to shared assumptions.**
    - Intake fixtures are the site's literal form payloads, not derived from the allow-list.
    - One fixture carries a partner intent under the wrong kind.
    - One carries a field that only another intent allows ([758] pattern).
12. **Independent review** before either `platform_qualifications` key is recorded. A reviewer subagent is not an authority (CLAUDE.md §0).

---

## 8. Phased delivery and open decisions

### 8.1 Phases

Customer capture and radio sales are never blocked. Customer intents keep the [r2] client path unchanged throughout, and every partner form keeps its truthful email route until its own phase is live (`SITE_INTEGRATION.md`, partner intents).

| # | Phase | Depends on | Exit | AC |
|---|---|---|---|---|
| 0 | **Now:** website partner forms on email; customer forms live once #756 is connected | — | — | — |
| 1 | #756 merged and deployed (receiver, queue, outbox) | founder approval | both services report the SHA | yes |
| 2 | **#758 + the interim queue, released together** | 1 | Partner intents file to the interim queue, the mailbox is notified, and **zero partner `crm_leads`** exist (SQL count) | yes |
| 3 | **L1: definitive lifecycle.** M-PL-1/2/3/6/7. Stage machines, SLAs, holds, verification records, generic relay, event catalogue, links, partner reporting, the §6 suite | 2 | Interim rows migrated per §2.6, with no row at `approved` | yes |
| 4 | **L2: agreements and applicant links.** M-PL-4, the public token routes | 3; §8.2 items 1–2 | browser-verified acceptance; token suite | yes (auth) |
| 5 | **L3: sales partner access.** M-PL-8/9, the role, the membership-only set, `SalesPartnerActivationService`, scope. Flag **off** | 4; the `sales_partner_role` qualification; #750 Sales OS sign-in | Independent role review recorded; flag on by the founder | yes (auth) |
| 6 | **L4: partner commission.** Resolver port, referral consumer, partner plans. Flag off | 5; commission terms (§8.5) | Accrual tests, conservation, idempotency | yes (money) |
| 7 | **L5: dealer provisioning code**, dark (flag unset, no qualification row) | 4; DLR phase 3 (roles, `dealer_relationships`) | Gate-blocked runs proven in staging | yes (tenant, auth) |
| 8 | **Dealer go-live** | DLR phases 1–3, Q-gate, portal domain, signed dealer agreement, Hytera authority | One pilot dealer on synthetic data, then real data on the founder's written go | yes |

### 8.2 Open decisions for the founder

| # | Decision | Default until decided | Blocks |
|---|---|---|---|
| 1 | **Agreement texts**: the dealer agreement (with its data-access clause, isolation proposal 6.2), the sales partner agreement (independent contractor, POPIA for referred leads), the technology NDA / MoU. Who signs for Signal One | No agreement can be issued, so nothing passes stage 5 | 4 |
| 2 | **Verification depth**: CIPC lookup only, or document copies kept; director ID sighted, or ID number stored; trade references; whether sales partners need tax refs before activation or only before the first payout | Lookup only; ID sighted and not stored; tax ref before payout | 3–4 |
| 3 | **Retention**: rejected, lapsed and withdrawn applications; evidence after termination | 12 months / term + statutory | 3 |
| 4 | **Approval authority and four-eyes**: who holds `partner_programme.approve` per programme; whether a second approver is needed for dealers | super_admin only, SoD on | 3 |
| 5 | **Commission terms**: rates, eligibility (prepared vs referred), retention and clawback, payout cadence, contractor tax and VAT treatment; whether a partner may bind within-policy quotes | No accrual (flag off); every partner quote needs approval | 5–6 |
| 6 | **Whether sales partner access waits for DLR RLS**, or only for the role-scoped review | The role-scoped review | 5 |
| 7 | **Mailbox**: does `operations@signalone.co.za` exist, who receives it, its SPF / DKIM on the sending domain; whether more routes are wanted (for example finance for the credit track) | Unverified route: nothing is sent; owners still get user notifications | 2–3 |
| 8 | **SLA values** in §1.3–1.5 | As proposed | 3 |
| 9 | **External link domain** for partner and dealer invitations and applicant links | No external links (stages 4+ wait) | 4 |
| 10 | Whether an applicant-facing information-request page is wanted, or staff gather information by phone and record it | Applicant link (§3.4) | 4 |

### 8.3 Not verified in this read

- The interim queue's schema (its branch is not on the remote). §2.6 must be re-checked against it before M-PL-2 is written.
- Whether `bootstrapTenant`'s repository can join a caller's transaction without a wider refactor.
- Whether `findActiveProfileIdByUserId` has other callers that would need the resolver port.
- Railway's live replica count (relay concurrency is safe by `SKIP LOCKED` either way).
- Whether `operations@signalone.co.za` exists.
