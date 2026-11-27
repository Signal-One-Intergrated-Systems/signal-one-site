# Founder decisions of 2026-11-27: execution record

Each entry records what was done, the evidence, and what remains. No credential value was read, printed or stored at any point: Railway was queried for variable **names** only.

## 1. PostgreSQL compatibility (#756, commit 258f11e2)

**What the condition is.** #756 sets `transaction_timeout` (6 s) on the website-intake transaction, guarded to PostgreSQL 17 and later. On 17+, exceeding it **ends the database session**, not only the transaction. Every test so far ran on PostgreSQL 16, where the guard skips the setting, so the 17+ path has never been exercised.

| Check | Result | Evidence |
|---|---|---|
| Production major version | **18** | Railway `Postgres` service image `ghcr.io/railwayapp-templates/postgres-ssl:18` (service config, read 2026-11-27) |
| Exact `server_version` | **Not read** | See below |
| Server default `transaction_timeout` | **Not read** | See below |
| Database driver | `postgres` (postgres.js) through drizzle | `packages/database/src/client.ts:12-13`, `connection.ts:13` |

**Why the two `SHOW` statements were not run.**
- This session has no Railway CLI and no database credential.
- Railway's agent declined to run SQL without handling the credential itself.
- Reading `DATABASE_URL` through the Railway tools would place the production password in this conversation, which you ruled out.
- A Railway environment fork would give a real PostgreSQL 18, but it copies production customer data and starts a copy of the worker with production email settings. That could send real emails, so I did not use it.
- A local PostgreSQL 18 (npm test binaries) was refused twice by this session's permission system, and the PostgreSQL package host is blocked by the network policy. I did not work around either refusal.

**What remains open.** Is the session-ending behaviour on PostgreSQL 18 handled safely, so that the visitor sees "not received" and the connection pool recovers? Analysis says yes: postgres.js rejects a query on a closed connection, and the receiver reports no receipt. Analysis is not proof, so the condition stays **open**. Either of these closes it:
- **You run, in the Railway dashboard (Postgres → Data → query):** `SHOW server_version; SHOW transaction_timeout;`. This confirms the exact version and that no server-wide timeout is set. It does not exercise the session-ending path.
- **You allow PostgreSQL 18 test binaries in this session.** Add a Bash permission rule for `npm pack @embedded-postgres/linux-x64`, or allow `apt.postgresql.org` in the environment's network settings. I then exercise the timeout path against a real PostgreSQL 18 and mutation-prove the control.

**Option if neither is wanted.** Release #756 with the transaction timeout set to 0 (off). The 2 s lock and 3 s statement bounds still apply. Then enable it once proven. This is a one-line change and needs a re-audit of that line.

## 2. Migration numbering (#756 and the stack above it)

Checked against main `151936f4` and every open pull request numbered 690 or above (62 heads), on 2026-11-27.

| Range | Holder | Conflicts |
|---|---|---|
| ≤ 0187 | main | none |
| 0188 | **#728 (Mubaraq)** `circuit_breaker_epoch_bigint`; also #746 `usd1_currency_foundation` | #728 and #746 collide with each other, not with #756 |
| 0189 | **#728 (Mubaraq)** `email_delivery_executions`; also #720 and #729 `user_role_sales_team_manager` | #728 and #720/#729 collide with each other, not with #756 |
| 0190–0194, 0197–0203 | #749 → #756 chain | **none** |
| 0204 | #759 partner applications | none |
| 0195, 0196 | unclaimed | gap; harmless |

**Result: #756 needs no renumbering.**
- No open pull request uses 0190–0204 except the #749 → #759 chain itself.
- The objects touched are disjoint. #756 touches `website_intake_*`, `website_enquir*`, `website_queue_*` and reads `crm_leads`; it adds indexes to `crm_leads` (0198) and a consent table (0201). #728 touches `circuit_breaker_state` and creates `email_delivery_executions`.
- `apps/api/scripts/migrate.js` applies by filename, against a set of filenames already applied. A later-merged 0188 or 0189 therefore still applies on its next deploy, even after 0203.
- The governance guard (`scripts/migration-governance-guard.sh`, check 3) refuses duplicate numbers within one tree, so any future collision fails at the gate rather than in production.
- Mubaraq's 0188/0189 stay his. Renumbering #756 now would only invalidate audited files.

**For the Architect.** The 0188 and 0189 collisions among #728, #720/#729 and #746 must be settled before the second of each pair merges. Mubaraq's #728 has the prior claim on both numbers, which is the founder's protection rule.

## 3. Website receiver credential

**Not yet possible.** The credential is issued by #756's mechanism, whose tables do not exist in production until #756 is merged and deployed. It is the step after the #756 release.

Confirmed now: no `WEBSITE_INTAKE_*` variable exists on any LEOS service, so nothing is half-configured.

Plan:
1. Generate the credential server-side.
2. Set it in Railway by a method whose output is not echoed.
3. Set the website's receiver variables.
4. Run the end-to-end check on staging against a mock first.
5. Send one labelled production smoke enquiry, approved under decision 2.

## 4. PayFast

**There is no PayFast configuration in LEOS production to recover.**
- Of the code's variables (`PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`, `PAYFAST_MODE`, `PAYFAST_NOTIFY_URL`, `PAYFAST_RETURN_URL`, `PAYFAST_CANCEL_URL`), none is set on the API, worker or web service.
- The merchant ID, merchant key and passphrase exist only in your PayFast merchant dashboard.

**What I need: you enter them in Railway** (API service → Variables), never in chat. Set `PAYFAST_MODE=sandbox` first.

**What can proceed without your credentials.** Sandbox qualification of the signature and payment-notification (ITN) handling, using PayFast's own published sandbox merchant and documented signature examples. This waits for the money-path pull request (duplicate-payment protection, refusal above the amount due), which is building now.

Live processing stays off until the money-path audit and the live-payment qualification pass.

## 5. Other observations from the configuration read

- **Possible test or seed sign-ins in production.** The API service holds `SIGNALONE_ADMIN_PASSWORD`, `SIGNALONE_CLIENT_PASSWORD` and `SIGNALONE_REP_PASSWORD` (names only seen). If these are seed or test accounts, they conflict with your rule against test credentials in production. **Not changed;** for your review.
- **Email.** The worker has `SENDGRID_API_KEY` and `EMAIL_SEND_ENABLED`. Operational notifications can use the existing sender once `operations@signalone.co.za` is verified.
- **Partner approval roles exist.** `sales_manager` and `commercial_director` are stored roles on main (`packages/database/src/schema/auth/users.ts:42-74`).
  - Proposed mapping:
    - independent sales partners: `sales_manager`;
    - dealers, resellers and technology partners: `commercial_director` ("Director");
    - `admin` and `super_admin`: review and qualify only.
  - This change goes into #759 after the money-path builder reports, keeping one builder at a time.
