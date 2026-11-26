# LEOS audit AUD2: re-audit of PR #752 `claude/launch-intake-privacy-r1`

- **Subject:** LEOS PR #752 (draft) at `ecab5d34`. Previous head `65c6767c`; merge base main `5efcb303`.
- **Auditor:** AUD2, an independent subagent that did not write the code. Nothing was taken from the PR body or commit messages as evidence.
- **How this file was written:** the auditor's environment refused the file write, so the lead saved the report from its returned text. The content is the auditor's; the lead only formatted it.
- **Date:** 2026-11-26

## Verdict: FAIL (fixable, small)

There is one new reproduced S2: an erasure can race a queue conversion. The fixes for AUD-11, AUD-12 and AUD-14 are partial.

## Per finding

| AUD1 | Verdict | Evidence |
|---|---|---|
| AUD-10 erasure vs restriction | **PASS** | Both sides take `website-restrict:<sid>`. In the service: `website_privacy_service.ts:186` (restrict), `:527` (erasure, before its check), and `:359-372` (retention, sorted locks, then a re-check). In the database: `0202:96` (restriction INSERT trigger) and `0202:116` (marker trigger, before its restriction check). Seven two-session psql experiments ended in one consistent serial state each time. With the pre-fix service sequence (check without the lock), the database alone still refuses the erasure. No deadlock cycle was found. |
| AUD-11 forgeable marker | **PARTIAL** | Refused now: wrong tenant; another submission's request; an already-executed request; a fictitious actor; an actor from another tenant; a planted xact_id, created_at or db_role (each is overwritten); a marker whose request is not executed; a second marker for one request; UPDATE, DELETE and TRUNCATE. **Still accepted: a self-consistent forgery** (F8, F9). That is a sales rep as actor, with requested_at and executed_at back-dated to 2020, or a retention run with an arbitrary period and a future cutoff. See AUD2-03. |
| AUD-12 mass erasure | **PARTIAL** | Holds: a non-dry run needs `privacy.manage` by stored role (`routes:190`; only super_admin holds it), so a grantee gets 403. It needs a typed count from the caller's own fresh dry run, and it is tenant-scoped. `/retention-runs/all` with dryRun:false returns 422 (`routes:237`; the service only does dry runs). **But a dry run can be replayed** (reproduced): see AUD2-02. setPolicy is still open to a grantee (measured 200; disclosed as D11). A grantee can still script single erasures; that is a one-person action (D5, disclosed). |
| AUD-13 app role owns the tables | **Not fixed (D10). The disclosure is accurate, but D10 has a gap.** | Reproduced with a NOSUPERUSER owner role, the production shape. `DISABLE TRIGGER USER` followed by a tombstone with no marker succeeded. So did DELETE of a marker and `CREATE OR REPLACE` of the 0202 check (all rolled back). A non-owner DML role was refused all three. The gap: D10(a) must also require that the app role is NOSUPERUSER and not a member of the owner role. Railway's default Postgres user may be a superuser; this is not verified. |
| AUD-14 erased enquiry in the queue | **PARTIAL** | The sequential path is fixed. `derived()` (`website_queue_service.ts:361`) is shared by list, counts, detail, every action and `summary()`. `carryMarketingConsent` refuses an erased submission (`marketing_consent.ts:88`). **Under concurrency, a convert or override still creates a lead from the erased person's data** (reproduced): see AUD2-01. |

## New findings

Counts: S1 0, S2 1, S3 2, S4 4.

### AUD2-01, S2: a convert or override can race an erasure (low likelihood, REPRODUCED)

- **Mechanism:** `enquiryFields` (`website_queue_service.ts:1145-1162`) reads the fields with a plain SELECT and no row lock. The queue lock (`website-queue:`) and the erasure lock (`website-restrict:`) are different locks. So a conversion that read the fields before the erasure committed can create its lead after it. `executeErasure`'s `leadOf` (`website_privacy_service.ts:546`) runs before that lead is committed.
- **Test AUD2-A1:** a third connection held `LOCK TABLE crm_leads IN SHARE MODE` to pause the override at its INSERT.
  - The erasure returned 200, with `crmLeadNotErased: null` and `marketingWithdrawn: false`.
  - The override returned 200 and created a lead holding the person's email and contact name.
  - The enquiry ended `converted`, with fields `{"erased": true}`.
- **Sequential contrast (A0):** the erasure names the lead and withdraws marketing.
- **Consequence:** the person's data survives an "executed" erasure, and nothing points to it. This breaks D3's hand-off, which relies on the lead being named in `crmLeadNotErased`.
- **Fix:** `SELECT … FOR UPDATE` on the enquiry row in `enquiryFields`, or take the queue lock in `executeErasure`. Either is deadlock-free against the current lock order.
- **Not reproduced:** the opposite ordering (A2), because of an auditor harness error (see Auditor errors).

### AUD2-02, S3: one retention dry run arms more than one real run (REPRODUCED)

- **Mechanism:** `requireConfirmedDryRun` (`website_privacy_service.ts:428-482`) neither consumes the dry run nor binds it to the set it counted.
- **Test AUD2-D:**
  1. A dry run counted 2, and the real run erased 2.
  2. Two new submissions then aged past the cutoff.
  3. The same dryRunId and confirmation text were accepted again (200), erasing 2 submissions the dry run never showed.
- **Fix:** consume the dry run when it arms a run (for example a unique "armed_by" on the run), or bind it to a hash of the counted ids.

### AUD2-03, S3: 0202 accepts a forged but self-consistent trail (REPRODUCED with a non-owner DML role)

- **Erasure path:** the 0200 request guard (`0200:216-223`) accepts any `executed_at`, and nothing fixes `requested_at` on INSERT. Forgery F8 committed a forger-created request with requested_at 2020-01-01, executed_at 2020-01-02 and a sales rep as actor.
- **Retention path:** the commit check (`0202:186-191`) requires only that `cutoff` is not null and the submission is older than it. Forgery F9 committed a "365-day" run with a cutoff of now() + 1 day. It erased a submission created that minute, with a rep as actor.
- **Undisclosed:** the migration header presents "the submission is older than the run's cutoff" as a control.
- **Fix:** force `executed_at = now()` and `requested_at = now()` on INSERT, and require `cutoff <= now()`. The actor's role cannot be checked in SQL; this is disclosed.

### S4 findings

- **AUD2-04: trigger count.** The `0202:6` header and `0202_down.sql:4` say "four NEW triggers", but there are three.
- **AUD2-05: trail ordering and a silent restrict.**
  - `restricted_at` defaults to the transaction start. In experiment o2b, a restriction serialised after an erasure shows 05:39:12.74, while the erasure marker shows 05:39:13.74.
  - `restrict()` on an already-erased submission returns 200 with no warning.
- **AUD2-06: lock timeout reported as a crash.** The privacy service turns a `lock_timeout` (3 s, `:748`) into a 500 with a CRITICAL alert, not a retryable 503. Seen in A2.
- **AUD2-07: cross-tenant dry-run id (by reading).** A cross-tenant `dryRunId` gets 409 rather than 404. "Not yours" gets the same response, so it reveals nothing.

## Concurrency experiments

Two real psql sessions ran as aud2_app (the table owner); the second started 1 s after the first.

| Run | Order | Result |
|---|---|---|
| o1 | Restriction INSERT (held 3 s), then `website_intake_redact` | The erasure waits, then is refused: "under a restriction of processing (0202)". Final state: restricted, not erased. |
| o2 | Redact (held 3 s), then restriction | The restriction waits. It was inserted at 51.636, after the erasure committed at 51.635. Final state: erased, with the restriction recorded after it. |
| o3 | New service sequence (request FOR UPDATE, lock, check, pause, redact) vs the restrict() sequence | The restriction waits, sees 0, then inserts after. |
| o4 | Pre-fix sequence (check without the lock) vs an autocommit restriction inside the window | The database refuses the redaction. |
| r1, r2 | Retention-cause marker, both orders | Same as o1 and o2. |

The lock order has no cycle:
- erasure takes the request row, then the restrict lock, then the rows;
- retention takes the class lock, then the restrict locks in sorted order, then the rows;
- restrict takes only the restrict lock;
- queue writers take the queue lock, then single rows; bulkDismiss writes only `website_queue_state`.

## Migration 0202 is class A

- **How it was applied:** by the real `migrate.js` (one BEGIN…COMMIT per file, a savepoint per statement), as a non-superuser owner, on aud2_cls.
- **Effect on existing rows:** the database already held genuine and forged markers from before 0202. 0202 applied with RC=0 and rewrote none of them (3 markers, db_role NULL).
- **Adoption precheck:** 0202 refuses to adopt objects that already exist. This matters because the runner skips 42710, 42P07 and 42701 errors.
- **Reversal:** `0202_down` removed its objects and its ledger row. 0202 then re-applied cleanly. The reversal refuses once a marker stamped with a db_role exists.
- **Verdict:** class A is accurate. Note that 0202 adds a trigger, and therefore a lock, to the existing 0192 table.

## Mutations

The fixer's suite was run on the auditor's own aud2_t database, under `leos-gate.lock`. The baseline was 17/17.

| Mutation | Result |
|---|---|
| M1 queue erased filter | RED |
| M2 route by-role check | RED |
| M3 erasure service lock | RED (500 instead of 409) |
| M4 retention re-check | RED (500 instead of 200) |
| M5 consent-carry redaction clause | RED |
| M6 typed-count check | RED |

- **Restore:** every file was restored with an identical sha256, and the final re-run was 17/17.
- **Vacuous controls:** none.
- **Caveat:** M3 and M4 go red only through the status code, because the 0202 trigger is the real backstop.

**Tenant isolation (AUD2-C): PASS.**
- As tenant B's super_admin acting on tenant A, GET item, convert, execute erasure and restrict all returned 404.
- Arming a run with A's dry run returned 409, and nothing of A was erased.

## Not verified

- Production role ownership and superuser status.
- The full governance gate.
- The A2 ordering.
- The combined tree with #754.
- Lock-table headroom for 500 advisory locks per run times concurrent classes.

## Auditor errors

- **First adversarial run:** the client fixtures created leads, not enquiries. A SHARE lock held by the harness was not released on failure, which cascaded into 503s. Neither run was counted as evidence.
- **A2:** the auditor's blocker detection could not see a tuple-lock waiter. The erasure hit lock_timeout, so A2 proves nothing about the defect.

## What the founder must know

1. **An erasure can miss a lead created at the same moment.** It can report that no CRM lead holds this person's data while a lead is being created from that data. This was reproduced. The fix is one row lock.
2. **The database guards don't stop the app's own credential.** While that credential owns the tables, as it does today (and possibly as a superuser on Railway), the guards stop application bugs only. That is decision D10. Even for other roles, a well-formed forged trail is still accepted: back-dated, or naming any member as the actor.

## Evidence

- Files are in the session scratchpad under `aud2/`:
  - the adversarial tests, `aud2_adversarial.integration.test.ts.saved`;
  - the forgery SQL and its outputs: `forge.sql`, `forge-dml.out`, `forge2-dml.out`, `forge-owner.out`;
  - the race outputs, `o*.out` and `r*.out`;
  - the run logs.
- Left in place: worktree `/home/user/leos-aud-wt-aud2` (clean, at `ecab5d34`); databases `aud2_priv`, `aud2_cls`, `aud2_t` and `aud2_t_template`; and cluster roles `aud2_app` and `aud2_dml`.

## Re-check at 137a7088

Saved by the lead from the auditor's returned text (the auditor's file write is refused in its environment).

**Verdict: PASS WITH CONDITIONS.** AUD2-01, AUD2-02, AUD2-05 and AUD2-06 hold, each tested at the auditor's own pause points. AUD2-03 holds for every earlier forgery. One new forgery is accepted (R2-01, S3), and FIX-P's disclosed residual is accurate but understated. New findings: S1 0, S2 0, S3 1, S4 0.

| Item | Result | Evidence |
|---|---|---|
| AUD2-01 conversion × erasure | **PASS** | Four runs (R-A1, R-A1-orig, R-A2, R-A2b) at different pause points: each ended consistent; either the erasure names the new lead and withdraws marketing, or the conversion gets 409 and no lead exists. Removing `FOR UPDATE` turned all 4 red; restored (sha256 identical), green. FIX-P's suite 22/22. |
| AUD2-02 replay / changed set | **PASS** | Same count, different set → 409. Replay after new submissions aged in → 409 "already armed a run". A second run citing the same dry run is refused by the unique index `website_intake_retention_runs_armed_by_uidx`. |
| AUD2-03 forged trail | **PASS for the earlier forgeries, PARTIAL overall** | As the non-owner DML role: F1–F7b, F8, F9, F11–F14 and F16 refused, plus a back-dated `executed_at` alone, a request inserted already executed, a future run `created_at` and an unarmed non-dry run. As the NOSUPERUSER owner: still able to disable triggers, delete markers, replace functions and drop the single-use index (unchanged AUD-13, decision D10). |
| AUD2-05 | **PASS** | Restricting an erased submission → 409. `restricted_at` now falls after the erasure marker in the two-session run. |
| AUD2-06 | **PASS** | Lock held > 3 s → 503 `PRIVACY_BUSY`, request still pending, 0 markers, one HIGH alert, no CRITICAL. |
| AUD-10 | Still holds | o1 and r1 re-run: refused while a restriction is uncommitted. |

**Disclosed residual — accurate but understated (N1, reproduced).** A forged dry run, back-dated 3 years with `candidates_sha256` "not-a-hash", plus a matching armed run with "period 365" and cutoff = now() and a sales rep as actor, erased a submission 33 seconds old. Suggested wording: "the cutoff need only be ≤ now() and is not tied to the period, so any submission up to the present can be erased under any stated period; the dry run's age and hash are not checked by the database." Also accepted (F8c): a rep creating and executing a request in the same transaction at now().

**R2-01, S3: a forged lift of a legal hold is accepted (N2, non-owner DML role).** In one transaction: set the restriction's `lifted_at` to 2020-01-01 (earlier than its own `restricted_at`) with a fictitious `lifted_by`; insert a request with a fictitious `requested_by`; call `website_intake_redact`. It committed: the hold reads as lifted in 2020 by nobody, and the data is erased. Cause: the 0192 guard checks only that a lift happens once, and 0202 does not stamp lifts. Fix: in 0202, require `lifted_at` = the current time and `lifted_by` to be an active member, and check `requested_by` membership; otherwise disclose.

**0202 amended in place.** Still class A: applied incrementally from 0201 by `migrate.js` over rows that break the new rules, RC=0, retention rows byte-identical (row md5). Schema fingerprint round-trip 0201 → 0202 → down → 0202 matches a fresh chain; the reversal refuses once a run carries a 0202 column. A database that applied the earlier 0202 (`ecab5d34`) is not upgraded by the runner and must be recreated.

**Conditions:** (1) fix or disclose R2-01; (2) correct the residual's wording; (3) D10 remains the founder/Architect decision, and its NOSUPERUSER / not-a-member text is accurate; (4) recreate any database built with the earlier 0202.

Evidence: session scratchpad `aud2/r2/`. Auditor error: an `\echo` with an apostrophe garbled two section labels in `forge4.sql`'s output; the statements and their refusals are recorded.
