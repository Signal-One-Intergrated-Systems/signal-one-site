# LEOS audit AUDL-1: PR #755 `claude/sec-log-redaction`

- **Subject:** `Signal-One-Intergrated-Systems/lancesat-enterprise-platform` PR #755, head `25f12120`, base main `5efcb303`. The PR is a draft and audit-class.
- **Auditor:** an independent subagent. It worked read-only on the PR and pushed and committed nothing.
- **Clone:** `/home/user/leos-audl`, a fresh clone at `25f12120` with its own databases, `audl_lancesat_test` and `audl_lar_test`.
- **Date:** 2026-11-26

## Verdict: FAIL

The redaction itself mostly holds. Every leak the PR names is closed on the paths it names, and I could not get a bearer token, refresh cookie, magic-link token or bound DB parameter out through the request lines, the 5xx/SLO alerts or the error middleware.

**The PR introduces a new unauthenticated denial of service.** Every string bound for a log line now goes through regexes that are quadratic in the string's length. Every request logs its `User-Agent` through that redactor. One request with a 15 KB User-Agent blocks the API event loop for about 260 ms on the PR head. On main `5efcb303` the same request blocks it for about 2 ms. About four such requests a second, from anyone and against any route including `/health`, pin the API. The inbound email and PayFast ITN live paths starve with everything else.

This must be fixed before merge. Everything else here is S2/S3.

## Findings

### AUDL-01 — S1 — Redactor regexes are quadratic, and an unauthenticated header reaches them on every request

**Where:**
- `packages/monitoring/src/log_redaction.ts:169` (`DRIZZLE_PARAMS`), `:171` (`SECRET_QUERY_PARAM`), `:175-176` (`EMAIL`), `:174` (`PHONE_E164`), all applied in `redactText` at `:179-190`.
- They are reached from:
  - `apps/api/src/observability.ts:106`: `userAgent: req.headers["user-agent"]`, logged on every request at `:136`, `:134`, `:110` and `:122`, then redacted again in `sendOperationalAlert` at `:159`.
  - `apps/api/src/logger.ts:38-43`.

**Mechanism:**
- Each pattern is an unanchored greedy run followed by a required character. Examples: `[A-Za-z0-9._%+-]+@`; `[?&;][A-Za-z0-9_.-]*(?:token|…)[A-Za-z0-9_.-]*=`; `params: [\s\S]*?(?=\n\s+at\s|$)` over runs of newlines.
- On a long run with no terminator, V8 re-scans the run from every start position, so the cost is O(n²).
- Before this PR the logger only called `JSON.stringify`, so the cost is new.

**Scenario:**
- An attacker sends `GET /api/v1/health` with `User-Agent: aaaa…` (15 000 chars, under Node's default 16 KB header cap).
- No authentication is needed.
- Each request costs about 250–300 ms of event-loop CPU. A 5xx or slow request pays it several times: the log line, the alert's `redactLogValue`, then the logger again.
- The raw request path is a second vector. `auth_middleware.ts:86,99` log `req.path` twice on a 401, so a long unmatched path costs about 2 × 300 ms.
- Larger strings scale quadratically. Authenticated free-text fields up to the 10 MB JSON limit (`index.ts:806`) reach the error log through a DrizzleQueryError's `params:` tail. A 1 MB value made of newlines would take minutes.

**Reproduced:**
- Primitive cost, `node …/scratchpad/audl/redos.mjs` and `redos2.mjs`:
  - letters: 10 k → 101 ms, 20 k → 571 ms, 40 k → 1458 ms.
  - `params:` plus newlines: 40 k → 992 ms.
  - Every shape I tried costs 200–380 ms at 15 k.
- Through the real `observabilityMiddleware`, `diagnosticRequestLogger` and api logger over real HTTP: `pnpm --filter @lancesat/api exec vitest run src/__tests__/audl/audl_ua_dos.test.ts` (throwaway, untracked, in `/home/user/leos-audl`).

| Tree | Normal UA | 15 KB UA (200) | Same, again | 15 KB UA (404) |
|---|---|---|---|---|
| PR head `25f12120` | 1 ms | **276 ms** | **255 ms** | **278 ms** |
| main `5efcb303`: `observability.ts` + `logger.ts` swapped in, then restored with `git checkout --` | 1 ms | 3 ms | 1 ms | 2 ms |

**Fix direction (not applied):**
- Cap every string before scanning, for example truncate anything over 2–4 KB to a bounded prefix plus `…[truncated N]`.
- Cap or hash the logged `userAgent`.
- Replace `DRIZZLE_PARAMS` with an `indexOf("\nparams: ")` cut.
- Make `EMAIL` linear: start only at a word boundary, or use the atomic-group emulation `(?=([A-Za-z0-9._%+-]+))\1@`.
- Add a performance control. It should feed a 16 KB header and a 1 MB param through the real logger and assert a time bound. Mutation proof: remove the cap and the control goes red.

### AUDL-02 — S2 — The follow-ups omit the copies already persisted in the database, and the fix keeps writing new ones

**Where:** `remediation_governance_service.ts:44-50` (audit row `metadata: { type, details }`), `drizzle_audit_repository.ts:80-90` (`audit_write_failures.payload` + `errorMessage`), `dead_letter_service.ts:39` (audit `metadata.error`), worker `index.ts:2410-2420` (`notification.failed` audit `error: err.message`, `workflow_failures.last_error`), the DLQ Redis jobs (`bullmq_adapter.ts:332`, worker `:2354-2360`, `error: err.message` + `payload`, shown by `GET /admin/dlq`).

**Mechanism.** On main, every CRITICAL alert's `details` went raw into an immutable `audit_logs` row (`system.remediation.triggered`). `JSON.stringify` of a DrizzleQueryError serialises its own enumerable `params`, `query` and the postgres `cause.detail`. So UNHANDLED_REJECTION, JOB_DEAD_LETTERED and AUDIT_WRITE_FAILURE rows carry customer e-mails, phones and password or token hashes.

The headers from CV-1's request-5xx path were probably *not* persisted. On main `correlationId` was read at entry (always unset), and `_assertCorrelationId` (`audit_persistence_service.ts:171`) threw before any insert. That is reading-only and is my inference.

The PR's "Operational follow-ups" name only the Railway log history. Item 5 notes a few `errorMessage` tables as out of scope. They do not name `audit_logs`, `audit_write_failures`, `workflow_failures` or the DLQ Redis store. After this PR those sinks still receive unredacted `error.message` text with DB params; only the remediation path is redacted.

**Scenario:** the founder purges or locks Railway logs for POPIA. Copies of the same personal information remain in an append-only audit table and in Redis, and an operator reads them through `/admin/dlq`.

**Status:** reading-only (I did not query production).

**Ask:** add these stores to the follow-up list, and decide whether the PR, or a named next PR, routes `error.message` through `redactText` before persisting it.

### AUDL-03 — S2 — The `params:` cut stops at an attacker-controlled fake stack frame

**Where:** `log_redaction.ts:169` (`(?=\n\s+at\s|$)`).

**Mechanism:** the cut ends at the first `\n<ws>at<ws>`. Drizzle joins the params with commas, so a user-controlled value that contains `\n    at x` ends the cut early. Every bound value after it is printed in the clear.

E-mails are still caught by the `EMAIL` pass. Domestic-format phones, ID numbers, password hashes and token hashes are not.

**Scenario:** `UPDATE users SET display_name=$1, phone=$2 WHERE password_reset_token_hash=$3` fails. The display name is `x\n    at y`, so the log shows `0825550199` and the token hash.

**Reproduced:** `node -e` with `redactText` and `serializeErrorForLog` on that message. The output keeps `,0825550199,9f86d0…` after `params: [REDACTED]\n    at y`.

**Fix direction:** cut from `params:` to the end of the message. The message never carries stack frames; `stack` is serialised separately.

### AUDL-04 — S3 — The backstop's patterns miss common South African and credential shapes

These were reproduced with `node …/scratchpad/audl/probe1.mjs`.

- **Phones:** only `+`-prefixed numbers are caught. Missed: `082 555 0199`, `27825550199` (Meta/WhatsApp `from` format), `+27 (0)82…`. The PR admits the first.
- **Contact keys:** `CONTACT_KEY` is an exact-match list, so these keys pass through unredacted: `to`, `from`, `cellNumber`, `whatsappNumber`, `customerPhone`, `idNumber` (13-digit SA ID), `accountNumber`.
- **Secret keys:** `SECRET_KEY` misses `secretKey`, `signingKey`, `hmacKey`, `key`, `mfaCode`, `code`, `pin`, `recoveryCodes` and `backupCodes`. Under a key other than `headers` it also misses `x-hub-signature-256`, which normalises to `…signature256`.
- **Free text:** scrubbing misses:
  - the first parameter of a form body (`token=…&x=1`, because there is no leading `?&;`);
  - JSON-embedded secrets (`{"password":"…"}`);
  - URL-encoded paths and e-mails (`%2Fpublic%2Fquotes%2F`, `thabo%40example.com`);
  - credential paths other than `/public/quotes/` and `/invitations/`;
  - `redis://:pw@host` (userinfo with an empty user).
- **`toJSON`:** an object with an own `toJSON` method passes through `redactValue`. `JSON.stringify` then calls it, which bypasses redaction. Probe: `{"o":{"password":"hunter2"}}`.
- **Reachability:** for most of these I did not find a production call site in the sweep, so they are backstop gaps rather than live leaks. The structural one is the next point.
- **New exposure:** errors passed as logger metadata used to serialise as `{}` (plain `Error` objects have no enumerable fields). They now log `message` and `stack`. Any error text not matched by a deny-pattern is newly written, for example vendor HTTP errors and domestic phones in `ConflictError` messages.

### AUDL-05 — S3 — Fatal-path writes bypass the redactor

**Where:**
- `apps/api/src/index.ts:670`: `writeSync(2, "[FATAL] Uncaught Exception: ${err.stack}")`.
- `apps/api/src/index.ts:3777`: the bootstrap failure, `err.stack`.
- The worker installs no `unhandledRejection` or `uncaughtException` handler. Node's default prints the error with `util.inspect`, which includes a DrizzleQueryError's enumerable `params` and `cause.detail`.

**Scenario:** a DB error escapes synchronously, or any worker promise rejects unhandled. The raw parameters go to stderr. The PR fixed only the worker's explicit `bootstrap().catch`.

**Status:** reading-only, and low probability.

**Fix:** wrap both strings in `redactText`, and give the worker handlers that log through its logger.

### AUDL-06 — S3 — Operator diagnostics are degraded

All of these were reproduced by the probe.

- **Scheme-word mangling:** `AUTH_SCHEME` is case-insensitive, so it turns ordinary prose into redactions.
  - `auth_middleware.ts:202` "Unexpected error during token verification" is logged as "…during token [REDACTED]".
  - "basic plan selected" becomes "basic [REDACTED] selected".
  - Fix: require `Bearer`/`Basic` followed by a credential-shaped token of 16 or more characters, or restrict the pattern to `Authorization:` contexts.
- **Plus-numbers:** `PHONE_E164` turns any `+`-number of 8–15 digits into `[PHONE]`, for example "delta +15000000 cents".
- **Lost headers:** the header allow-list now hides `x-forwarded-for` (client IP), `x-idempotency-key` and `x-supplier-id` in 5xx alerts. The API reads all three for diagnosis and scoping. Consider adding the non-secret ones to `LOGGABLE_HEADERS`.
- **Non-Error causes:** a `cause` that is not an `Error` becomes `"[object Object]"`.

### AUDL-07 — S3 — An undisclosed side effect: every request 5xx now writes an audit row

**Where:** `observability.ts:88` (`correlationId` is now read at finish), which feeds `remediation_governance_service.ts:44`.

**Mechanism:** on main, the CRITICAL_API_ERROR remediation write always failed at `_assertCorrelationId` because `correlationId` was unset. With this fix it is set for every routed request.

Every routed 5xx now inserts a `system.remediation.triggered` row into the append-only `audit_logs`. The row's `tenant_id` is the fallback (`actorId`/random id, `drizzle_audit_repository.ts:107-110`), and its contents are redacted. A 5xx storm becomes an audit-write storm.

**Status:** reading-only. This is not a leak, but the PR does not say it. Decide whether it is wanted.

### AUDL-08 — S3 — Control limits

- **Silent skip:** the real-stack control is wrapped in `describe.skipIf(!TEST_DB)`. `gate-counts.json` counts skipped tests, so the control can go vacuous in an environment without a DB and nothing turns red. In the gate `TEST_DATABASE_URL` is set, so it ran.
- **Easy fixtures:** the hostile fixtures use only shapes the scrubbers already know.
  - Phone: E.164 `+2782555…`.
  - Tokens: hex in the two named prefixes.
  - Leak check: exact substring only.

  No fixture puts a value after a fake frame (AUDL-03), uses a domestic phone outside `params`, or uses a long header (AUDL-01). The controls are real: the inputs are built the way the outside world builds them, and the controls capture `process.std*.write` plus spied `console.*`. But they only prove the patterns the author anticipated.
- **No performance control:** nothing checks the redactor's cost.

## What I verified holds

- **Header allow-list.** Mixed-case names, array values, `set-cookie`, and unknown vendor headers all come out `[REDACTED]`, and keys are kept. Probe, CV-1 test 2/2, real-stack test.
- **Request and alert lines.** These carry the route pattern or the allow-listed path. Query and fragment are dropped.
  - `routePattern` never emits a raw request segment: the prefix is sanitised, the rest is the code's own `req.route.path`, and regex-like routes fall back to `sanitizePath` (reading `log_redaction.ts:140-150`).
  - The `[REQ]` line uses `sanitizePath`.
- **Magic-link tokens.** All `:token` routes are under `/public/quotes/` and `/invitations/` (route sweep). The 401/403 `req.path` logs are therefore backstopped for current routes.
  - Caveat: `ROUTE_WORD` keeps an all-lowercase-letter segment. For 64-hex tokens the chance of that is negligible.
- **DB errors.**
  - A real DrizzleQueryError's `params:` tail is cut from `detail`, `message` and `stack`.
  - postgres `detail`, `where` and `hint` are never copied.
  - SQLSTATE, constraint and SQL text survive. Real-stack test, real Postgres 16.
- **Remediation path.** `sendOperationalAlert` redacts once, before both the log and remediation, and does not mutate `alert.details`.
- **Auth and worker logging.**
  - `auth_middleware` no longer logs any credential characters.
  - The worker SMS line no longer logs `to`.
  - The worker logger and the startup catch are redacted.
- **Responses and live paths.**
  - Response bodies are untouched: `buildError` is unchanged and never includes `internalDetail`, and every redaction makes copies.
  - The PayFast ITN logger keeps its signature, and the inbound-email route is unchanged.
- **Observability.** `correlationId` survives in the lines, and metrics are keyed by the full route pattern (more distinct, and no raw tokens).
- **Sinks not involved.**
  - No Sentry, OpenTelemetry exporter, drizzle query logger or morgan in api or worker; postgres notices are suppressed.
  - apps/web server code logs only a closed-set reason (`leos-runtime/observe.ts:136`).
  - `packages/workflows` event-bus `console.error` sites and `notification_worker.ts` are not wired into api or worker (no runtime importers).
  - The C1 middleware is not mounted.
- **Request bodies.** Login, reset, MFA and webhook bodies are not logged anywhere I could find.
- **Controls.** All green in my clone at `25f12120`:
  - real-stack 2/2 and layers 15/15: `pnpm --filter @lancesat/api exec vitest run src/__tests__/security/…`;
  - CV-1 2/2: `src/__tests__/commercial_slice/cv1_alert_header_redaction.test.ts`;
  - worker 1/1: `pnpm --filter @lancesat/worker exec vitest run src/lib/__tests__/logger_redaction.test.ts`.

## Limits and my own mistakes

- I did not run the full gate, did not repeat the PR's mutation matrix, and did not read production logs, the database or Railway. Everything marked reading-only is inferred from code.
- The S1 timing comes from a local container. Production CPU and Railway's edge header limit could change the constant, but not the quadratic shape. I did not check whether Railway's edge rejects 15 KB headers before Node sees them.
- `apps/lar` (paused) was not swept.
- I first ran the CV-1 test under the wrong directory, so only 2 of the 3 files ran. I re-ran it at its real path.
- My first draft of AUDL-02 assumed CV-1's bearer headers had been persisted in `audit_logs`. Reading `_assertCorrelationId` showed those writes probably always failed on main, so I rewrote the finding around the DB-parameter payloads.
- A throwaway test remains untracked in the clone: `/home/user/leos-audl/apps/api/src/__tests__/audl/audl_ua_dos.test.ts`. Probe scripts are in `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/audl/`. Nothing was committed or pushed.
