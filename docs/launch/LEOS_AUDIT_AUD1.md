# LEOS independent audit AUD1: PRs #750, #751, #752, #753, #754

Auditor: AUD1 (independent; wrote no production code, pushed nothing). Date: 2026-11-25.
Clone: `/home/user/leos-aud` (fresh from the `leos-l1` remote). Scratch DBs: `aud_priv`, `aud_comb`, `aud_lock`, `aud_lar` (local PG 16). Production was not touched.

Subjects (SHAs confirmed on origin at audit start):

| PR | branch | head | base |
|---|---|---|---|
| #751 | `claude/launch-intake-outbox-r1` | 7a8a1037 | #749 @ 3ef1c67f |
| #752 | `claude/launch-intake-privacy-r1` | 65c6767c | #749 @ 3ef1c67f |
| #754 | `claude/sales-os-enquiry-queue-r1` | 514c2545 | #749 @ 3ef1c67f |
| #750 | `claude/sales-os-integration-r1` | 248cbffc | main @ 5efcb303 |
| #753 | `claude/commercial-slice-qualification` | 3761943d | main @ 5efcb303 |

## Verdicts

| PR | verdict | why, in one line |
|---|---|---|
| #751 outbox / indexes / expiry | **PASS WITH CONDITIONS** | Its central claims held under test. Only S3s remain, plus a production-size check before 0198 runs. |
| #752 privacy / redaction / readers | **FAIL (fixable)** | An erasure can run while a restriction is active (reproduced). The redaction marker can be forged (reproduced). One grantable admin can irreversibly mass-redact the tenant (reproduced). The "app role is not the owner" precondition is false by the repo's own deploy config. |
| #754 Sales OS queue | **PASS WITH CONDITIONS** | Tenant and permission gating hold. Merging needs one import-line conflict resolved against #752, and the S3s are minor. |
| #750 Sales OS shell | **PASS** | The claim held: the only `apps/api/src` change is a note-text edit in `click_to_call_service.ts`. No packages, no migrations, and `/clients/mine/:id` is untouched. |
| #753 CV-1 / CV-2 | **PASS WITH CONDITIONS** | CV-1 fixes the 5xx alert headers but is incomplete. Bearer tokens in URL paths are logged on every request (reproduced). DB-error stacks log all bound query params (reproduced). It also conflicts with #749's own header redactor. |

## Findings

Severity: S1 = data loss, a money error or a breach reachable from outside. S2 = a real defect in a security, privacy or integrity control, or a destructive path. S3 = hardening, consistency or robustness.
"REPRODUCED" means I ran it here and give the command. "READING" means it rests on the code or config only.

### S2

**AUD-10: #752, S2. Erasure and retention do not serialize with restriction of processing. A submission can be erased while a restriction is active.** REPRODUCED.
- Where: `apps/api/src/services/website_intake/website_privacy_service.ts`. `executeErasure` reads `website_intake_restrictions` with a plain SELECT and no lock (the "restricted" check, ~line 375). `runExpiry` filters restricted submissions inside a CTE snapshot. `restrict()` serializes only on `pg_advisory_xact_lock('website-restrict:'||sid)`, a lock that neither the erasure nor retention takes.
- How it fails: T1 (erasure) passes the restriction check. T2 (`restrict`) inserts a restriction and commits. T1 then redacts and commits. The result is a submission with an active restriction (a legal hold) whose data has been destroyed irreversibly. Retention has the same window.
- Repro: a throwaway vitest in the privacy branch (results in `scratchpad/aud1/aud_adversarial_results.txt`). A third connection holds `guard_applications` FOR UPDATE, so the erasure blocks after its check. `POST …/restrict` returns 200 meanwhile, the erasure then returns 200, and the final state is `{"f":"{\"erased\": true}","active_restrictions":1}`.
- Why their test missed it: M11 tests sequential restrict-then-erase, the way the code expects. It never tests the concurrent order.
- Fix: take the same `website-restrict:<sid>` advisory lock (or `SELECT … FOR UPDATE` on the submission row) in `executeErasure` and per-sid in the retention batch, before the restriction check.

**AUD-11: #752, S2. The 0200 redaction marker is unauthenticated and unvalidated, so the trail can be forged and the trigger relaxation can be used outside `website_intake_redact`.** REPRODUCED.
- Where: `0200_website_intake_redaction.sql`. `website_intake_redaction_admits()` checks only `submission_id`, the class and `xact_id = pg_current_xact_id()`. Nothing validates a marker row on INSERT:
  - its `tenant_id` is not checked against the submission's tenant;
  - its `erasure_request_id` needs only to exist (FK). It can belong to another submission or already be `executed`;
  - `actor_id` is free;
  - `retention_run_id` is a deferred FK to any run, from any tenant.
- How it fails: any session holding INSERT on `website_intake_redactions` can tombstone any submission, and the "audit trail" then names the wrong tenant, request and actor. In this deployment that session is the app role (see AUD-13).
- Repro (`aud_priv`, rolled back afterwards): `INSERT INTO website_intake_redactions` with tenant A's id for tenant B's submission, an already-executed request for a different submission, and actor `00000000-…-0001`. Then `UPDATE guard_applications SET fields='{"erased": true}'` → `UPDATE 1`, and `UPDATE consent_records SET subject_email=NULL` → `UPDATE 1`. Both were admitted.
- No HTTP path reaches this today. The only code writer is `website_intake_redact()` (grep), so this is a control-integrity defect, not a remote exploit.
- Fix: add a BEFORE INSERT trigger on `website_intake_redactions` that checks:
  - the marker's tenant equals the submission's tenant;
  - the request is pending and is for the same submission and tenant;
  - the run belongs to the same tenant and class;
  - `actor_id` is not checkable in SQL, so record `current_user` alongside it.

  Alternatively, revoke INSERT from the app role and make `website_intake_redact` SECURITY DEFINER under a separate owner.

**AUD-12: #752, S2. One `privacy.manage` holder, including an admin with only a per-user `website_privacy` grant, can irreversibly mass-redact a tenant in two calls. There is no second person and no typed confirmation.** REPRODUCED.
- Where: `website_privacy.routes.ts`. The whole router is gated by `requireWebsiteIntakeAccess(access, "website_privacy", "privacy.manage")`, which admits granted admins. `PolicyBody` allows `periodDays` down to 1. `POST /retention-runs` and `POST /retention-runs/all` with `dryRun:false` redact up to 500 submissions per class per call and can be repeated.
- Repro: as `adminG` (stored `admin` with a `website_privacy` grant, not super_admin), `PUT /retention-policies/guard_application {periodDays:1}` returned 200. A non-dry run then returned 200: `{"status":"executed","erased":1}`, and the row became `{"erased": true}`.
- The PR's own D5 discloses "one person" for erasure execution. It does not say that a grant (not just super_admin) arms tenant-wide retention destruction, or that a typed reference is required for a single erasure but not for a mass run.
- Condition: until D5 is decided, make non-dry retention and `setPolicy` super_admin-only (no grant path), or keep them behind an env arming flag that is off in production.

**AUD-13: #752 (and the #749 base), S2. Plausible, from config. D9 / "audit condition 8" (the app's DB role is not the table owner) is false by construction.** READING.
- Evidence:
  - `apps/api/railway.toml:32` and `railway.toml:38` set `preDeployCommand = "node scripts/migrate.js"` on the api service.
  - `apps/api/scripts/migrate.js:25` connects with the service's own `DATABASE_URL`, and no separate migration URL exists.
  - So the role that runs the app created, and owns, every intake table and trigger function. It can `ALTER TABLE … DISABLE TRIGGER`, drop the guards, or `CREATE OR REPLACE` them.
- Consequence: the append-only and redaction-only guarantees of 0190–0192 and 0200 are integrity hints against application bugs. They are not controls against the application's own credential. LAUNCH_R1_PRIVACY.md §2 names this as "the production control", and it does not exist.
- I did not verify this against production. The founder should treat D9 as "no" unless Railway shows a separate migration role.

**AUD-30: #753, S2. CV-1 is incomplete: bearer credentials carried in the URL path are logged on every request.** REPRODUCED (unit).
- Where: `apps/api/src/observability.ts`. `logData.url = req.originalUrl` is logged at info on every request ("API Request trace"). It is also in the 5xx CRITICAL alert and the slow-request alert, and that `details` object goes to `triggerAutoRemediation`, which "persists what it is given".
- Credential-bearing paths:
  - `GET/POST /public/quotes/:token[/pdf|/accept|/reject]`: the magic-link token that views, accepts or rejects a quote (`public_quote.routes.ts:91,110,158,176`).
  - `/invitations/:token/accept` (`supplier_invitation.routes.ts:97`).
- Repro: a throwaway vitest on #753 drove `observabilityMiddleware` with `originalUrl=/api/v1/public/quotes/AUDMAGICLINKTOKEN123/pdf` at statuses 200 and 500. The token appeared in 4 log lines.
- Fix: redact path parameters of known token routes, or log `req.route.path` instead of `originalUrl`, and strip query strings.

**AUD-31: #753, S2. Database-error stacks log every bound query parameter.** REPRODUCED (unit).
- Where: `apps/api/src/middleware/error_middleware.ts`. `logError` sets `detail = err.internalDetail ?? originalErr.stack`. drizzle-orm 0.44.7's `DrizzleQueryError` message is `Failed query: <sql>\nparams: <all params>` (`node_modules/.pnpm/drizzle-orm@0.44.7…/errors.js:12`), so any 5xx from a failed query writes these into the logs:
  - email addresses, phone numbers and other PII;
  - password and token hashes;
  - anything else the query was bound with.
- Repro: errorMiddleware with a `DrizzleQueryError(… , ["u-1","AUD-SECRET-REFRESH-HASH"])` → `AUD errorMiddleware log contains param: true`.
- This is exactly the "error serializers" path the CV-1 review asked about.
- Fix: for a `DrizzleQueryError`, log the SQLSTATE and the query text without params (or the table name only), never `.params`.

### S3

**AUD-01: #751, S3. 0198 behaves as claimed under contention, but its size guard is vacuous on an un-analyzed table, and a lock wait fails the whole deploy.** REPRODUCED.
- Repro on `aud_lock`: one session held a crm_leads row update open for 12 s while the real `migrate.js` ran.
  - 0197 was applied and committed.
  - 0198 failed after 5.24 s with `canceling statement due to lock timeout` (MIG_RC=1).
  - A writer arriving behind the queued SHARE request waited 3.3 s.
  - `SET LOCAL lock_timeout` persisted across the runner's per-statement SAVEPOINT (it bounded the CREATE INDEX).
- Residual risks:
  1. On the scratch DB `reltuples` was `-1` (never analyzed), so the `> 250000` guard passes whatever the true size. Use `GREATEST(reltuples, 0)` or a real `count(*)` bound.
  2. `lock_timeout` bounds the wait, not the build. The build holds SHARE (writes blocked) for its whole duration. Production row count is unverified, so check it before deploy, or pre-build with the CONCURRENTLY runbook.
  3. A failed 0198 leaves 0197 committed and the release half-applied until the deploy is retried. That is safe, because the old code ignores the new tables, but it needs an operator.

**AUD-02: #751, S3. `reversals/0198_down.sql` runs a plain `DROP INDEX` with no `lock_timeout`.** It takes ACCESS EXCLUSIVE. Behind a long transaction it queues, and all crm_leads reads queue behind it. The file mentions the CONCURRENTLY alternative but defaults to the unsafe form. READING.

**AUD-03: #751 × #752, S3. Recruitment notifications and the applications reader disagree.** #751 sends application notifications to `privacy.manage` holders plus `website_privacy`-granted admins (`AUDIENCE_ACCESS.recruitment`). #752's reader is super_admin-only with no grant path. A granted admin is told "New guard application SO-…" and cannot open it. The message carries no PII, so this is consistency, not a leak. READING.

**AUD-04: #751, S3. The relay notifies about submissions that were restricted after intake.** The message carries only the reference. With the relay off by default, a backlog can include them. READING.

**AUD-05: #751, S3. `resolveRecipients` silently truncates at `LIMIT 200`.** READING.

**AUD-14: #752, S3. An erased, still-pending enquiry stays actionable in the queue, and converting it crashes.** REPRODUCED.
- After erasure the item stays `pending_review` with `fields: {"erased": true}` and still shows `consent.marketing: true`.
- `override-new-lead` and `convert` then return **500** with a CRITICAL operational alert (`TypeError: value.replace is not a function`).
- Latent risk: if the crash is later "fixed", `carryMarketingConsent` would carry a marketing GRANT for an erased subject onto a new empty lead. Its `NOT EXISTS` checks only withdrawals, and erasure records a withdrawal only when a lead exists.
- Fix: erasure should resolve (dismiss) a pending enquiry, or the queue should refuse actions on erased items with a 409.

**AUD-15: #752, S3. Marketing-consent ordering.** `carryMarketingConsent` does not take the per-lead advisory lock that `withdrawMarketingConsent` takes. `seq` is assigned at INSERT time, not commit time. A concurrent convert and objection on the same lead can therefore leave `granted` as the latest event. READING.

**AUD-20: #754 × #752, S3. Merge conflict.** Both edit the same import line in `website_queue_service.ts` (`addBusinessMinutes` vs `carryMarketingConsent`), and all three PRs conflict in `scripts/gate-counts.json` and `NUMBER_RESERVATIONS.md`. REPRODUCED (trial merge; the resolution is trivial, but gate counts must be recomputed).

**AUD-21: #754, S3. `summary()` loads every open queue row of the tenant into memory, with no bound.** READING.

**AUD-22: #754, S3. The `hooks.onAssigned` "hook point for N1" is post-commit and best-effort.** That is the pattern the founder's L2-06 ruling rejects for delivery. If N1 wires assignment notifications there, they are not durable; they should go through the 0197 outbox instead. READING.

**AUD-23: #754, S3. The nav entry is gated on `website_queue.read` by role.** Admins with only a per-user grant can use the queue but will not see it in the navigation. This is UX only; the server is authoritative. READING.

**AUD-32: #753 × #749, S3. Two parallel header redactors.** #749 already added `redactHeaders` / `SECRET_HEADERS` in `observability.ts`. #753 adds `redactCredentialHeaders` / `CREDENTIAL_HEADERS` against main. A trial merge conflicts in `observability.ts` (and `gate-counts.json`). Keep one implementation, and carry over any header present in only one list. REPRODUCED (trial merge).

**AUD-34: #753, S3. The live slice harness guards the API URL to loopback but not `CV_SLICE_DATABASE_URL`.** Its `seed()` upserts super_admin users with a chosen password and `ON CONFLICT … SET password_hash` on fixed ids. Pointed at a non-local DB, it would plant known credentials. It is test-only and outside the gate. READING.

**AUD-40: #750, S3. The `seed-preview-test.ts` guard G4 matches only public production hostnames and `-production` labels.** A Railway production `DATABASE_URL` uses an internal or proxy host (`*.railway.internal`, `*.proxy.rlwy.net`), which G4 does not recognise. A local run then relies only on operator-set `LANCESAT_ENV=staging` and the absence of `RAILWAY_ENVIRONMENT`. If misdirected, the seed would create an admin with a known password in the production DB. READING.

## Claims verified as holding

- **#751, transactional outbox.** The notification row is inserted inside the intake transaction (`website_intake_service.ts` → `store.insertNotification(tx, …)`). There is one row per (tenant, submission, event), enforced by a unique index. Routing is a CHECK, so an application is never sent to the sales audience.
- **#751, "user ids only".** The BullMQ payload carries `to = recipientUserId` and no `metadata.email`. The worker's `resolveRecipientEmail` falls through to a `users` primary-key lookup. Subject and body carry only the `SO-…` reference.
- **#751, at most once.** The delivery id is a deterministic v5 UUID, equal to the BullMQ jobId (`safeJobId`). The worker maps the jobId to a persistent `processed_events` claim (`event_id.ts`, `send_claim.ts`, index.ts:1091). Dedupe therefore survives BullMQ's `removeOnComplete: {count:100}` eviction.
- **#751, tenant binding.** Every relay and view query is bound to the row's or session's tenant. Recipients come through an active membership in that tenant. Grants are checked per tenant.
- **#751, 0199.** Expiry is evaluated in the database (`LIVE_CREDENTIAL`), in the same predicate for resolve, the hash-set refresh and touch. Uniform-401 timing was **not** measured.
- **#752, append-only outside a redaction.** Direct tombstones, cross-transaction, cross-submission and cross-class markers, deletes and a hand-set `executed` were all refused. The tests ran green on `aud_priv` (12/12). Their weakness is the unvalidated marker contents (AUD-11).
- **#752, tenant isolation.** Erasure, the reader, consent and the DB function are bound to the session's tenant and answer 404 across tenants (their M3/M4b).
- **#752, applications reader.** It is super_admin-only with no grant scope (`scope=null` in `decide`).
- **#752, SQL.** No injection: `sql.raw` is used only on constants or zod-enum-validated table maps.
- **#754.** `/summary` (read) and `/assignees` (act) are tenant-bound. Assignees use the same predicate as `assign`. Campaign keys are extracted in SQL from a constant list; click ids (gclid/gbraid/wbraid) never leave the database. No raw SQL takes input.
- **#750.** The non-web diff against main touches `apps/api/scripts/*` (seeds), tests, docs, `gate-counts.json`, and one `apps/api/src` file, where an activity note text changed. No packages or migrations are touched. The only web API path literals added were spot-checked against main's routes, and every one exists: `revenue-intel`, `activities/mine`, `unread-count`, `preferences` and `sales-packs`.
- **#753 CV-1, the part it claims.** The 5xx alert's headers are redacted before both the log and remediation. Node lowercases `req.headers` keys, so casing is moot in practice.
- **#753, harness API URL.** The live harness refuses a non-loopback API URL.

## Combined-tree interaction check

- I merged #749 + #751 + #752 + #754 locally (branch `aud-merge`, never pushed). Conflicts were only `gate-counts.json`, `NUMBER_RESERVATIONS.md`, and one import line in `website_queue_service.ts`.
- After rebuilding packages, `tsc --noEmit` passed.
- `aud_comb` was provisioned by the production runner with the full chain 0190–0194 and 0197–0201.
- `vitest run src/__tests__/website_intake/` passed: **16 files, 249/249**. The web suites `website-enquiries-queue` and `s185-route-registry` passed 42/42.
- #753 conflicts with #749 in `observability.ts` (AUD-32).

## Commands (reproduction)

- Privacy suite: in `apps/api`, with `TEST_DATABASE_URL=…/aud_priv`, run `pnpm exec vitest run src/__tests__/website_intake/website_intake_n2_privacy.integration.test.ts` → 12/12 pass.
- AUD-10, 12 and 14: a throwaway `aud_adversarial.integration.test.ts`, built from that suite's harness (lines 1–347) plus three tests (AUD-A/B/C). It was run against `aud_priv` and then deleted. Output: `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/aud1/aud_adversarial_results.txt`.
- AUD-11: the psql transaction described above, on `aud_priv`, ending in ROLLBACK.
- AUD-01: `aud_lock` (template of `aud_priv`), a 12 s holder plus `node apps/api/scripts/migrate.js`. Log: `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/aud1/mig-lock.log`.
- AUD-30 and 31: a throwaway unit test on #753 (`aud_cv1_gaps.test.ts`), 2/2 demonstrating the leak. Deleted afterwards.
- Combined tree: log at `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/aud1/t-comb.log`.

## Limits and my own errors

- I did not run the full `governance:push` gate on any branch. Only targeted suites and tsc were run.
- I did not verify production row counts for crm_leads, the production DB role's ownership (AUD-13 comes from config), or the timing of uniform 401s.
- #750's ~22k-line web diff was scanned for risky patterns and endpoint existence, not reviewed line by line.
- I did not read #751's 920-line notification integration test in full. I relied on it passing on the combined tree, plus my own reading of the relay.
- **Error:** I deleted the AUD-A/B/C test file before copying it out. The results survive in the scratchpad log, and the test bodies are described above, but the file itself must be re-created to re-run it.
- **Error:** my first two suite runs failed for environment reasons: workspace packages were not built, and PGPASSWORD was not exported. They were re-run after fixing the environment. Neither failure was counted as evidence.
- Left in place: local branch `aud-merge` in `/home/user/leos-aud` (unpushed), and the DBs `aud_priv`, `aud_comb`, `aud_lock`, `aud_lar`.
