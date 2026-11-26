# LEOS audit AUDL-2: re-audit of PR #755 `claude/sec-log-redaction`

- **Subject:** `Signal-One-Intergrated-Systems/lancesat-enterprise-platform` PR #755 (draft, open), head `5af0f95a8bd56ec3c0b98d8ca1dd666c2306d714`, base main `5efcb303`. Reviewed: `25f12120..5af0f95a` (the AUDL-1 fixes) and the whole PR diff `5efcb303..5af0f95a`.
- **Auditor:** AUDL2, an independent subagent. I did not write this code. I took nothing from the PR body or commit messages as evidence; every claim below was checked against the code or by running it.
- **Clone:** `/home/user/leos-audl` checked out at `5af0f95a` (detached). Own databases `audl2_api` (full canonical migration chain, 170 migrations) and a private `redis-server` on port 6391. Nothing was committed or pushed, and no PR comment was made.
- **Date:** 2026-11-26

## Verdict: PASS WITH CONDITIONS

Ship #755 as the hotfix. It closes the live credential leak (CV-1), and the S1 denial of service from AUDL-1 is gone. Two conditions:

1. **Before merge, if you can (one line plus one test shape):** bound the JWT pattern. It is still quadratic (new finding AUDL2-01, S2). It is capped at about 40 ms per scan, and I could only reach it with an authenticated request, so it does not block the hotfix. But the PR's code comment and body say every pattern is linear, and the new performance control cannot see this pattern.
2. **Named follow-up, not blocking:** errors raised outside the API router reach Express's built-in error handler. That handler prints `err.stack` raw and never touches the redactor (AUDL2-02, S2). I proved three live leaks through it: PayFast ITN failed-query parameters (payer e-mail, name, amount), a magic-link token in the path, and a password fragment from a malformed JSON body. Main has the same leaks, so this is not a regression. But it means "every log line is redacted" is not yet true.

Verdict basis: real HTTP against a locally started API at main `5efcb303`, `25f12120` and `5af0f95a`; real-process crash tests of the api and worker; single-point mutations of the fixer's controls under `leos-gate.lock`.

## AUDL-1 findings: status at `5af0f95a`

| ID | Status | Evidence |
|---|---|---|
| AUDL-01 (S1) quadratic redactor, unauthenticated | **PARTIAL.** The S1 is fixed and one S2 remains. | Strings are cut to 8 192 characters before any pattern runs (`log_redaction.ts:192-199`, `:297`). The User-Agent is capped at 256 (`observability.ts:72-74`, `:114`), and allow-listed header values at 512 (`log_redaction.ts:116`). The params cut uses `indexOf` (`:207-211`), and `EMAIL` uses a look-behind (`:253-254`). AUDL-1's shapes are now linear (bench below). A 14 KB User-Agent costs **1–2 ms** of server CPU (`25f12120`: 213 ms). **But** `JWT` (`:231`) is still quadratic on `-eyJ` runs: 1 KB 0.9 ms, 2 KB 2.4 ms, 4 KB 9.3 ms, 8 KB 38.8 ms. See AUDL2-01. |
| AUDL-02 (S2) persisted copies in DB/Redis | **PASS (disclosed, founder decision).** The code is unchanged. | PR body "Operational follow-ups" item 7 names `audit_logs`, `audit_write_failures`, `workflow_failures.last_error`, the audit `metadata.error` and the Redis DLQ, and asks for a decision. |
| AUDL-03 (S2) params cut ended by a fake frame | **PASS.** | `cutQueryParams` cuts from `params:` to the **end** (`log_redaction.ts:207-211`). `safeErrorStack` finds the frames by the message's length, never by searching for `at` (`:338-350`). The error middleware (`error_middleware.ts:112-117`) and both fatal paths use it. My own hostile cases come out clean (fake frame before a phone and a token hash; message rewritten after capture; message prefixed by a wrapper; custom stack). The SQL text and real frames survive. |
| AUDL-04 (S3) SA and credential shapes | **PARTIAL.** | Every shape AUDL-1 named is now caught (verified one by one): `082 555 0199`, `27825550199`, `+27 (0)82…`, form-body first param, JSON pairs, `%2F`/`%40`, other token paths, `redis://:pw@`, keys `to`/`cellNumber`/`whatsappNumber`/`customerPhone`/`idNumber`/`accountNumber`/`secretKey`/`signingKey`/`hmacKey`/`mfaCode`/`pin`/`recoveryCodes`/`backupCodes`/`x-hub-signature-256`, and `toJSON`. Residual gaps remain (AUDL2-05) and so do cut-boundary partials (AUDL2-03). The PR discloses free-text SA ID numbers and "MFA code 123456". |
| AUDL-05 (S3) fatal paths bypass the redactor | **PASS.** | Checked with real processes and a real drizzle failed-query error bound with an e-mail, a phone and a hash (my preload, after the app installed its own handlers): **api** `uncaughtException`: redacted, exit 1. **worker** `unhandledRejection`: redacted, exit 1. **worker** `uncaughtException`: redacted, exit 1. 0 PII hits in all three. **main** worker: 5 PII hits (`params: <email>,0825550123,<hash>` via util.inspect), exit 1. Note: the **api** `unhandledRejection` handler logs (redacted) and does **not** exit. That is pre-existing behaviour, the same on main (`index.ts:660-669`). |
| AUDL-06 (S3) diagnostics degraded | **PASS** (minor residuals in AUDL2-06). | "…during token verification" and "basic plan selected" survive, and `AUTH_SCHEME` needs 16+ credential characters (`:229-230`). `+15000000` survives. `x-forwarded-for`, `x-real-ip`, `x-idempotency-key`, `x-supplier-id` and `x-request-id` are on the allow-list (`:76-86`). A non-Error `cause` is walked (`:357-363`). A real 500 line keeps SQLSTATE `22P02`, `INTERNAL_ERROR`, the SQL text, the route pattern `/api/v1/finance/periods/:id`, the status and the correlation id. |
| AUDL-07 (S3) every routed 5xx writes an audit row | **PASS (disclosed, founder decision).** | PR body item 8 and the "AUDL-07" section. I confirmed it in my own DB: `system.remediation.triggered` rows were written during the `5af0f95a` and `25f12120` runs, and **none** during the main run (same probes). |
| AUDL-08 (S3) control limits | **PARTIAL.** | The real-stack control now fails rather than skips without a DB under turbo/CI (`sec_log_redaction_real_stack.integration.test.ts`, the `IN_GATE` guard). I read this in the code and did not re-run it under turbo. The hostile fixtures now include the fake frame and SA phones. **But** the new performance controls cannot see the JWT shape (AUDL2-01). The worker crash control runs in-process against a fake `EventEmitter`, not a real process (I filled that gap myself; see AUDL-05). Single-point mutation results are below. |

## New findings

### AUDL2-01 — S2 — The `JWT` pattern is still quadratic, and the new controls cannot see it

**Where:** `packages/monitoring/src/log_redaction.ts:231`:

```ts
const JWT = /\beyJ[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]*/g;
```

**Mechanism:**
- `-` is inside the character class but is a non-word character, so `\b` lets a match start at every `eyJ` inside a run like `-eyJ-eyJ-eyJ…`.
- Each start consumes the run to its end, finds no `.`, and backtracks. That is O(n²) over the run.
- The 8 192-character cap bounds it. It does not make it linear.
- The file header (`:36-43`) and the PR body say every pattern is linear. That is not true of this one.

**Measured.** Primitive `redactText`, best of 3:

| Input | 1 KB | 2 KB | 4 KB | 8 KB | 16 KB / 1 MB (capped) |
|---|---|---|---|---|---|
| `-eyJ` repeated | 0.9 ms | 2.4 ms | 9.3 ms | 38.8 ms | 32–48 ms |
| any other shape I tried (33 targeted + 26 000 fuzzed repeat units) | — | — | — | ≤ 0.9 ms | — |

**Reachability:**
- **Unauthenticated:** none found. The User-Agent is capped at 256 and allow-listed header values at 512. Paths are allow-listed (`[a-z_-]` words cannot contain `eyJ`). Errors raised before the API router never reach the redactor (AUDL2-02). Body-parse and validation messages are short or fixed.
- **Authenticated:** any route that hands a malformed path parameter to Postgres. Postgres echoes the whole value (`invalid input syntax for type uuid: "…"`). `serializeErrorForLog` scans the cause message, and `JWT` runs before `PG_ECHO` replaces the value.
  - My sweep of 213 authenticated GET routes found 10 that return 500 this way, for example `GET /api/v1/finance/periods/:id`, which needs `finance.read`.
  - Over real HTTP, server CPU per request with a 14 KB `-eyJ` id is **96 ms at `5af0f95a`**, against 10 ms on main and 7.5 ms with a short id. That is about 10× amplification.
  - The per-IP limit (100/min per replica) and per-actor limit (300/min) apply. About ten source addresses holding one staff credential would saturate a replica.

**Control blind spot:**
- The layers control's shapes include `"eyJ" + "a".repeat(N)`, which is a single start and therefore linear. They do not include `-eyJ` runs.
- Its budget is 50 ms per 64 KB shape. With the cap, this shape measures 34–48 ms, so it would pass or flake rather than go red.
- The real-stack performance control uses `"a".repeat` only.

**Fix (one line):** anchor it the way `EMAIL` is anchored, for example `/(?<![A-Za-z0-9_-])eyJ[A-Za-z0-9_-]{4,2048}\.[A-Za-z0-9_-]{4,4096}\.[A-Za-z0-9_-]{0,1024}/g`. Add `"-eyJ".repeat(N/4)` and `"eyJ--".repeat(N/5)` to the layers shapes, and lower that control's per-shape budget to about 10 ms so a capped quadratic cannot hide under it.

### AUDL2-02 — S2 (pre-existing, not a regression) — Express's built-in error handler is a raw, unredacted log sink

**Where:**
- The only error middleware is mounted inside the API router (`apps/api/src/routes/index.ts:2174-2175`).
- Nothing with four arguments is mounted on the app (`apps/api/src/index.ts`).
- So an error raised by app-level middleware or an app-level router skips every router and reaches Express's `finalhandler`. Its `logerror` runs `console.error(err.stack)` whenever `env !== "test"`, which includes production.

**Proven leaks.** All values are synthetic, generated for the run.
1. **PayFast ITN failed-query parameters (AUD-31 on a live money path).**
   - `apps/api/src/routes/payfast.routes.ts:86-89` sends any settlement failure to `next(err)`. `payfast_payment_service.ts:551` rethrows after logging, and the router is mounted at app level (`index.ts:3686-3690`).
   - Harness: the real `createPayfastItnRouter`, mounted the same way, with `app.set("env","production")`. The stub service's settlement runs a real drizzle insert that fails. The edge provenance is **simulated**, because loopback can never be an edge peer.
   - Output: `Error: Failed query: INSERT INTO … VALUES ($1, $2, $3)\nparams: <payer e-mail>,Thabo,1499.00` written raw to stderr. HTTP status 500.
2. **Magic-link token in the path.**
   - `app.options("/api/*", …)` (`index.ts:764`) has a wildcard parameter. Express decodes it while matching **every** `/api/*` request, whatever the method.
   - A path with a malformed escape throws `URIError: Failed to decode param 'v1/public/quotes/<64-hex token>/pdf%A0'`, and the error is printed raw.
   - This happened against the real API on both main and `5af0f95a`; the token appeared in the log.
   - `%A0` is a Latin-1 non-breaking space, which a mail client can append to a pasted link.
3. **Credential fragment from a malformed JSON body.**
   - The app-level `express.json` (`index.ts:812`) throws V8's `SyntaxError`, which quotes about 10 characters of the body.
   - `POST /api/v1/auth/login` with `{"email":"…","password":Hunter2Audl2Secret}` printed `Unexpected token 'H', ..."password":Hunter2Aud"... is not valid JSON` raw, on both main and the PR.
   - A hand-built JSON client that does not escape a quote in a password produces exactly this.
4. CORS refusals print the raw `Origin`. That is not a secret, but it uses the same sink.

**Fix:** mount a redacting four-argument handler as the **last** app middleware, for example `app.use(errorMiddleware)` after `app.use("/api", apiRouter)`. Add a control that sends a malformed escape and a malformed JSON body to the real app and checks the bytes written.

### AUDL2-03 — S3 — Cap-then-scrub leaves a partial secret or contact detail at the cut

**Where:**
- `redactText` cuts the string before it scrubs (`log_redaction.ts:297`).
- `redactHeaders` cuts each value at 512 first (`:116`).
- `capUserAgent` cuts at 256 before the logger redacts (`observability.ts:73`).

**Mechanism:** a value straddling the cut point loses the tail its pattern needs, so it does not match, and the head is written in the clear.

**Reproduced** (8 KB of padding, then the value):
- `thabo.mok…[truncated 27 chars]`
- `08255…[truncated 10 chars]`
- the JWT header **and most of its payload**: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFiby…`, which base64-decodes to `{"sub":"thabo`. The signature is cut, so the token is not usable.
- `Bearer abcdefgh…`

**Fix:** scrub first and cut afterwards (the patterns are bounded, apart from AUDL2-01), or cut back to the last separator and drop the partial token.

### AUDL2-04 — S3 — No total work budget per log line

**Where:** `redactValue` (`log_redaction.ts:456-519`) caps entries per level (200) and depth (8). It does not cap the total, and `Object.entries()` materialises every key before the 200-entry cut.

**Measured:**

| Input | Time |
|---|---|
| object with 200 k keys | 148 ms |
| 200 × 8 KB `-eyJ` strings | 7.9 s |
| `AggregateError` 10×10×10 with 8 KB messages | **86 s** |
| 10 MB of 250-character benign strings | 474 ms (`JSON.stringify` alone: about 30 ms) |

Depth chains, cycles and 5 M-element arrays are fine (< 1 ms).

**Reachability:** I found no call site that logs a request body or another caller-sized structure, so today this is about robustness.

**Fix:** a per-line budget in bytes or nodes, and iterate keys with a counter instead of `Object.entries`.

### AUDL2-05 — S3 — Deny-pattern residuals (backstop gaps; no live call site found)

These are not redacted at `5af0f95a`. I probed each one directly.

**Free text:**
- `password: 'Hunter2Secret!'` in util.inspect or YAML form. Only the e-mail beside it is caught.
- JSON with numeric values: `{"pin":4321,"otp":123456}`.
- Double-encoded JSON: `"{\"password\":\"…\"}"`.
- Double percent-encoding: `thabo%2540example.com`.
- Phones: `(082) 555 0199`, `082.555.0199`, `0027825550199`, `27 82 555 0199`.
- Vendor keys in prose: `sk_live_…`, `ghp_…`.
- Postgres echoes `value "…" is out of range for type integer` and `date/time field value out of range: "…"`.
- `x-hub-signature-256: …` written as text.

**Object keys:** `pwd`, `pass`, `privateKeyPem`, `totpSeed`, `id_no`, `accountNo`, `bankAccountNo`, `cvv`, `securityAnswer`.

**Fix:**
- Add a colon-form key/value rule for secret names.
- Match secret names as a key *contained* in the normalised name, not only as a suffix, with a small exclusion list.
- Add the four phone shapes.

### AUDL2-06 — S4 — Diagnostics that the redactor still hides

- A bare `code` of 6–8 digits is redacted. Meta/WhatsApp Graph error codes such as `131026` are six digits, so a WhatsApp delivery failure logged as `{ code }` would lose its reason. I did not find such a call site today.
- `+` numbers of 9 or more digits become `[PHONE]` (`delta +150000000 cents`).
- A standalone 10-digit zero-led number becomes `[PHONE]`.
- SQL text longer than 8 KB is cut. The postgres cause, SQLSTATE and constraint are still logged, so the real error is not hidden.

## Measurements

These are server CPU per request (from `/proc/<pid>/stat`, 10 ms ticks divided by the sample count, so small values are ±2 ms), with median client latency. All runs were real HTTP against the real API booted from `apps/api/src/index.ts` with tsx, against my own database. `L` = 14 000 characters.

| Request | main `5efcb303` | `25f12120` | `5af0f95a` |
|---|---|---|---|
| `GET /` baseline | 3.0 ms | 3.3 ms | 2.0 ms |
| `GET /`, User-Agent L × `a` | 1.0 ms | **213 ms** | 2.0 ms |
| `GET /`, User-Agent L × `-eyJ` | 1.0 ms | **387 ms** | 1.0 ms |
| CORS refusal (500), `Origin` L × `a` | 1.0 ms | **643 ms** | 3.0 ms |
| CORS refusal (500), `Origin` L × `-eyJ` | 1.0 ms | **1 060 ms** | 4.0 ms |
| unmatched path L × `-eyJ` (404) | 2.0 ms | 1.7 ms | 3.0 ms |
| query string L × `-eyJ` | 1.0 ms | 3.3 ms | 2.0 ms |
| auth'd `GET /finance/periods/<short>` (500) | 6.3 ms | 8.3 ms | 7.5 ms |
| auth'd `GET /finance/periods/<L × a>` (500) | 8.8 ms | **813 ms** | 11.3 ms |
| auth'd `GET /finance/periods/<L × -eyJ>` (500) | 10.0 ms | **1 440 ms** | **96.3 ms** |

Primitive `redactText` at 16 KB, best of 3, `25f12120` → `5af0f95a`:

| Shape | `25f12120` | `5af0f95a` |
|---|---|---|
| letters | 218 ms | 0.17 ms |
| e-mail local run | 374 ms | 0.16 ms |
| e-mail domain labels | 365 ms | 0.17 ms |
| `params:` + newlines | 278 ms | 0.00 ms |
| digits | 249 ms | 0.18 ms |
| percent escapes | 226 ms | 0.82 ms |
| JSON open value | 265 ms | 0.21 ms |
| `cookie` run | 232 ms | 0.22 ms |
| **`-eyJ` run** | 417 ms | **48 ms** |

## Leakage checks over real HTTP at `5af0f95a`

The request was a 500 on `/api/v1/finance/periods/:id`. It carried:
- `AuThOrIzAtIoN: Bearer <real HS256 JWT>`;
- a real-shape JWT as the `refresh_token` cookie;
- `X-Api-Key`;
- `X-Website-Intake-Signature`;
- the bearer repeated **inside the User-Agent**, a hostile fixture for the allow-list;
- a JWT inside `X-Request-Id`;
- `?access_token=…&email=thabo%40example.com`.

None of the nine probe strings appeared in the log bytes. The alert's `headers` kept every key and showed `[REDACTED]` for every credential. The User-Agent and `x-request-id` were scrubbed inside the value. `x-forwarded-for` was kept. SQLSTATE `22P02`, `INTERNAL_ERROR`, the route pattern and the status were all present.

## Mutation results (single-point, under `leos-gate.lock`, own DB)

MUTATION_TABLE_PLACEHOLDER

## What I could not verify

- **The production edge.** I did not test whether Railway's edge passes 14–16 KB headers or paths through to Node. All timings are from a local container.
- **The PayFast leak.** I proved it with the real router and Express, but with a **stub** settlement service and simulated edge provenance. I did not drive the real `PayfastPaymentService` into a DB failure.
- **The gate.** I did not run the full gate, re-run the fixer's MA1–MA10 matrix, or re-verify the `TURBO_HASH` guard under turbo.
- **Production data.** I did not read production logs, Railway, or any production data.
- **Role coverage.** I did not establish which non-staff roles, if any, can reach a Postgres-echo route (I used a `super_admin` token, and the measured route needs `finance.read`).
- **Out of scope.** `apps/lar` (paused) and apps/web were not swept.

## My own mistakes

- My first authenticated header probe returned 401. My locally minted access token had passed its 15-minute expiry. I re-minted it and re-ran; only the second run is reported.
- My first fuzzer flagged single characters (`" "`, `"{"`, `"a"`) at 4–9 ms. These were GC noise, and targeted re-runs at 1–16 KB showed them flat. They are not reported as findings.

## Artefacts (all untracked, outside git history)

- Scratch: `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/audl2/` (`bench.mjs`, `fuzz.mjs`, `leak.mjs`, `probe.mjs`, `probe_auth.mjs`, `fatal_run.sh`, `mut/`, logs, `m_main.txt`, `m_25f.txt`).
- Harness files `apps/api/audl2_tmp/` in the clone. They are removed at the end of the run.
- AUDL-1's throwaway test, moved out of the clone, is at `…/scratchpad/audl2/audl1_tests/`.
