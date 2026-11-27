# LEOS independent audit R2: launch integration candidate #756 (`claude/launch-integration-r2` @ `f64489a9`)

Auditor: AUDR2. I did not write this code. I pushed nothing, commented on nothing and did not touch production. Date: 2026-11-26.
Worktree: `/home/user/leos-audr2`, detached at `f64489a9`. It holds one untracked file of my own, never pushed: `apps/api/src/__tests__/website_intake/audr2_adversarial.integration.test.ts`. It also holds a gitignored `.env.test` that points at my own databases.
Databases (local PG 16.15): `audr2_pre`, `audr2_pre2`, `audr2_ref`, `audr2_big`, `audr2_test`, `audr2_lar`.
Scratch evidence: `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/audr2/` (`v-*.log`, `run.summary`, `run2.summary`, `build-*.log`).
Every vitest run went through `gate-hold.sh AUDR2` with a 20 and a 15 minute limit. Both runs released the lock with RC=0, and neither was killed.

## Verdict

**PASS WITH CONDITIONS for releasing r2 @ `f64489a9`.**
- In the scope I reviewed there is no S1 or S2, and nothing blocks release.
- The conditions are outside this audit's power to clear:
  - the Architect has to rule the requested migration numbers 0190–0194 and 0197–0203;
  - the items other audits left open stay open (AUD-01/02, AUD-15, AUD-21, and the AUDL2-03/04/05/06 follow-ups);
  - the two S3 control gaps below need to be tracked.

Counts: S1 0 · S2 0 · S3 2 · S4 4. Plus one item I could not verify, which is outside my scope.

## Findings

| ID | Sev | Class | Where | What | Reproduction |
|---|---|---|---|---|---|
| R2-01 | S3 | FOLLOW-UP | `apps/api/src/app_prelude.ts:90` (`app.use(diagnosticRequestLogger)`), and the `observabilityMiddleware` wiring in `installAppPrelude` | Step 3 of #755's recipe is correct on r2, but **no control covers it**. #755's real-stack test builds its own app "in index.ts's order" (`sec_log_redaction_real_stack.integration.test.ts:196-210`), so it tests a re-statement of the prelude, not the prelude that ships. Since #749, `index.ts` gets its prelude from `installAppPrelude`. If that line goes back to `console.warn("[REQ]", req.method, req.originalUrl)`, the every-request token leak (AUD-30) returns and the suite stays green. INT2's live qualification grepped 2006 log lines and found no raw query string, which shows the runtime is right today. | **MUT-B:** replaced line 90 with the raw `[REQ]` logger, then ran the 4 `sec_log_redaction_*` suites + `website_intake_mount_order` + `r1i3` + `r1i4`: **RC=0, 73/73 green**. Restored (sha256 identical). Fix: have the real-stack test call `installAppPrelude`/`installBodyParsers`/`installRouteMounts`, or add an assertion on the shipped prelude. |
| R2-02 | S3 | FOLLOW-UP | `apps/api/src/__tests__/security/sec_log_redaction_fatal_process.test.ts:81-121` | INT2's re-anchored wiring control is **real for ordering**: it goes red when the handler is moved before the mounts. It is **vacuous when the mount is disabled**, because it looks for the substring `app.use(redactingFinalErrorHandler)`, and that substring survives in a comment. This weakness predates INT2: #755's own anchor uses the same `indexOf`. INT2 did not weaken it. | **MUT-A:** handler moved before `installRouteMounts(app, {` → **red**: fatal_process and mount_order, 2 failed / 7 passed. Restored (sha256 identical), re-run green 3/3. **MUT-C:** line replaced by `// app.use(redactingFinalErrorHandler);` + `void redactingFinalErrorHandler;` → **green 9/9**. Restored (sha256 identical), re-run green. Fix: strip comments before matching, or assert from the running app's router stack that the last layer is the handler. |
| R2-03 | S4 | FOLLOW-UP | `apps/api/migrations/reversals/0203_down.sql:20-27` | The reversal is correct and fails closed. Once production has written even one assignment or `skipped` row, though, it **refuses for good**, so after go-live 0203 is effectively forward-only. That is not a defect: refusing is better than dropping who an assignment notification was for. But the class-B "reversal" obligation is met only for the day-0 state, and no operator procedure says what to do after that (export the pre-image, then delete). | Proven on `audr2_pre`: the refusal fires with 1 assignment row (`REFUSED: 1 notification row(s)…`). Race: the reversal started while an uncommitted assignment insert was pending. The check passed, `DROP INDEX` waited, and the re-added `kind_check` then failed (`violated by some row`, RC=3). Rolled back atomically: the row survived and 0203 stayed recorded. |
| R2-04 | S4 | FOLLOW-UP | `website_intake_notifications.ts` relay (`withdrawnReason`, ~:713) | AUD-04 is decided at relay dispatch, under the notification row lock. A restriction or erasure that commits **after** the BullMQ hand-off is still emailed: the worker does not re-check. The message carries only the reference (`SO-…`), with no personal data. | By reading. The INT `AUD-04` test and my T3 cover the before-hand-off case, which passed. |
| R2-05 | S4 | FOLLOW-UP | `apps/web/src/hooks/useServerNavGates.ts:20-56` | The AUD-23 answer is cached for the page's life, per user, tenant and role. A grant revoked mid-session leaves the nav entry visible until a reload. UX only: the server route gate stays authoritative, and `/access` is tenant-bound (T1). | By reading. |
| R2-06 | S4 | FOLLOW-UP | `website_intake_notifications.ts:1037-1047` (`alertOnce`) | AUD-05's HIGH alert is rate-limited to one per 10 minutes per **audience**, across all tenants. A second tenant overflowing within the window gets the log line (`recipient_cap_exceeded`, which carries the tenant) but no alert. Prod is effectively single-tenant. | By reading. |

## What was verified, and how

### 1. Migration 0203 and its reversal
- **Correctness.**
  - Every replaced CHECK admits a superset of 0197's.
  - The narrowed `event_uidx` (`WHERE queue_event_id IS NULL`) still covers every pre-0203 row.
  - The new `queue_event_uidx` is per (tenant, queue event).
  - Inserts on this table use no `ON CONFLICT`, so the partial index cannot break inference. I grepped every writer.
  - The drizzle schema (`packages/database/src/schema/intake/website_intake.ts`) matches the SQL.
- **On a populated table.** I built the chain below 0203 and loaded 32,000 rows: every 0197 event kind × every status. 0203 then applied through the production runner `migrate.js` with RC=0, and every row stayed valid.
- **Time on a larger table.** On 500,000 rows, 0203 took about 0.97 s wall time, including Node startup.
- **Table size in production.** In production the table will be **empty** when 0203 runs, because `origin/main` stops at 0187, so 0197 lands in the same release.
- **Lock behaviour.** A concurrent reader held `ACCESS SHARE` for 12 s. 0203 failed at `SET LOCAL lock_timeout = '5s'` with RC=1 after 5.4 s. Nothing was half-applied: no columns and no `schema_migrations` row. Re-run after the lock cleared: RC=0. The runner wraps each file in `BEGIN…COMMIT`, so `SET LOCAL` takes effect.
- **No rewrite.**
  - The two columns are nullable and have no default.
  - The CHECK validation and the two index builds scan, under `ACCESS EXCLUSIVE`, a table that will be empty.
  - The pre-flight DO block refuses before the runner's silent "already exists" skips (42701/42P07) could adopt a column or index.
- **Reversal round-trip.** I ran `0203_down` on the 32k-row database (no 0203-specific rows) and compared `pg_dump -s` plus the applied list against a fresh chain cut below 0203: **IDENTICAL**, and all 32,000 rows were kept. The refusal and the race are covered under R2-03.
- **Class.** B is accurate and conservative. 0203 alters an existing object and touches no row, and everything it drops is restored verbatim by the reversal, so it is not C. A does not fit, because it alters a pre-existing table.
- **`NUMBER_RESERVATIONS.md`.** 0203 is recorded as REQUESTED by INT, and the open-ended row is now 0204+. That is consistent with the files on the tree.

### 2. Integration fixes `656e2099` (AUD-03/04/05/22/23)
- **AUD-03.**
  - The applications reader's route gate, the recruitment audience and the recruitment notification listing all read the one `WEBSITE_APPLICATIONS_READ_ACCESS`: `website_applications.read`, scope null, no grant path.
  - Nothing else in `apps/api/src` defines it.
  - **T4:** a `website_privacy`-granted admin now gets 403 on `/website-intake/notifications/recruitment`; the super_admin gets 200; tenant B's super_admin sees nothing of tenant A.
- **AUD-04.**
  - `withdrawnReason` is tenant-bound, and runs under the row lock before recipient resolution.
  - **T3, erase rounds:** an assignment that committed before the erasure was closed as `skipped` / `submission_erased`, and **0 messages** went to the rep.
  - See R2-04 for the window after hand-off.
- **AUD-05.** `LIMIT cap+1`, then trim with a callback. No silent truncation. See R2-06 for the alert window.
- **AUD-22: the same transaction.**
  - `website_queue_service.ts:871-889` inserts the `website_enquiry.assigned` row inside `inTx`, after the `crm_leads FOR UPDATE` and the queue-event insert.
  - `hooks.onAssigned`, `fireAssigned` and `WebsiteQueueHooks` are gone from the tree (grep).
  - This is the only path that sets `assigned_sales_user_id` in the website-intake code, and no DB trigger on `crm_leads` notifies.
- **AUD-22: lock order.** The assignment row has no FK. The queue-event FK takes `KEY SHARE` on the submission. Erasure's `website_intake_redact` updates only `attribution` on submissions, which is `NO KEY UPDATE` and compatible. The consent withdrawal inserts into an event table that has no FK to `crm_leads`. So I found no cycle with erasure's order (request row → `website-restrict` → rows).
- **AUD-22: T3 (8 concurrent rounds).** Assign raced erasure or restriction on the same submission:
  - no 500 and no deadlock;
  - outcomes: `[[200,200],[404,200]]` alternating (restriction always won its rounds).
- **AUD-22: tenant isolation.**
  - **T1:** assigning A's item to tenant B's rep → 422, no row. Tenant B's admin with a forged A-grant → refused. `/access` → `{read:false}`.
  - **T2:** forged tenant-A outbox rows, one naming tenant B's rep and one naming tenant B's assignment event, were both closed `skipped`, with **0** messages to B's rep. The genuine assignments in A and B were each delivered once.
- **AUD-23.** `/access` returns `access.decide` on the verified token for the session's tenant, and the nav follows it. See R2-05 for caching.
- **INT's own suite.** `website_intake_int_r2` (6 tests) passed on my worktree and database.

### 3. #749 receiver as renumbered (0190–0194)
- **The merge `d89cc022` (main + #748 `aa83b16d`).** I re-created the automatic merge (`git merge-tree`). It differs only in the two conflicted files, both resolved correctly:
  - main's C1 `reversals/0187_down.sql` was kept byte-for-byte;
  - #748's intake reversal moved verbatim to `0187_down_website_intake_receiver.sql`;
  - `gate-counts.json`.
- **The renumbering.** I mapped 0187→0190, 0188→0191, 0190→0192, 0191→0193 and 0192→0194, then stripped comments. The executable SQL of all five migrations at `aa83b16d` is **identical** to `38846053` and to `f64489a9`: 0 differing lines. Their five reversals are identical too.
- **Outside the SQL.** The renumber commit's non-comment changes outside SQL are test names and filename strings only.
- **Not covered by "numbers only".** `258f11e2`, the receiver fixes from L2 (L2-08/10/07/12), and `5a1e91d6`/`3ef1c67f`, the contract document, are **content changes inside #749 that no auditor had examined as a diff**. I read `258f11e2`'s service and store hunks: attribution fail-soft logs key names only, and the whitespace pattern is a file constant inlined as an E'' literal. I did not audit `5a1e91d6` beyond its file list.

### 4. Merge of #755 into r2, and the INT2 control
- **Against #755's recipe.**
  - `observability.ts` = #755 + `OPERATIONAL_ALERT_HANDLED` (the only diff vs `415ef593`), and the alert-handled branch logs the already-redacted `logData`.
  - `auth_middleware.ts` = #755, byte-identical.
  - The `app_prelude.ts` `[REQ]` logger is `diagnosticRequestLogger`.
- **Wiring in `index.ts`.**
  - The PayFast logger uses `redactText`/`redactLogMeta`.
  - `process.on("uncaughtException", onApiUncaughtException)` and `writeFatal("[FATAL API BOOTSTRAP ERROR]", err)` are present.
  - `app.use(redactingFinalErrorHandler)` is at `index.ts:3702`. That is after `installRouteMounts(app, …)` at :3692, before `app.listen` at :3708, and nothing is mounted after it.
  - `installRouteMounts`'s last `app.use` is `/api`.
- **Nothing lost.** No redaction line from `415ef593` was dropped: `git diff 415ef593 f64489a9 -- index.ts` shows no removed redact, fatal or sanitize line, because the prelude moved into `installAppPrelude`. Only `index.ts`, `observability.ts`, the test and `gate-counts.json` were touched by both #755 and r2.
- **New log sinks in r2-only code.** All of them log event names, ids, SQLSTATE/constraint/table, key names or the client IP. I found no raw `originalUrl`, header or error message. The access service's `err.message` goes through the api logger's backstop.
- **The control.** See R2-02: it is real for ordering and vacuous to disabling. The prelude's wiring has no control: R2-01.

## What I could not verify
- **`258f11e2`'s `transaction_timeout`.** It is set via `set_config(..., true)` only on PG ≥ 17, and production is 18. My cluster is PG 16, so it was never exercised. On PG 17+ that GUC terminates the **session** (FATAL), not only the statement. The site's honest fallback and idempotent retry should absorb that, but it is unproven. This is outside my listed scope and is recorded so that someone runs it on PG 18.
- **T3 did not force the narrowest window.** It never caught a restriction committing between assign's post-lock check and its commit, because restriction won every restrict round. That window is covered by reading: the relay skips it (AUD-04).
- **No full gate.** As instructed: INT2's gate was GREEN at `f64489a9`. I did not run the browser qualification.
- **`5a1e91d6` (the contract document)** was not reviewed.

## My own mistakes
- My first T1 expected 400. The API answers 422 (`VALIDATION_FAILED`) for a non-member assignee, so the behaviour was right and my expectation was wrong.
- My first T2 inserted two forged rows with the same (tenant, queue event). 0203's new unique index refused the second (23505). That is incidental evidence that the index holds, but it was a fixture error. I corrected both and re-ran: 4/4 green.
- My first test run therefore read "2 failed". Neither failure was a product defect.
- I reused INT's local password file (`~/.pgpass.int`) to reach the local cluster. I used only my own database names.
