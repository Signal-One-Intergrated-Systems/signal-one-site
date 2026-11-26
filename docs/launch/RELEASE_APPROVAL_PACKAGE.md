# Release approval package — commercial launch

Status as of 2026-11-26 11:15 UTC. **Nothing in this package is merged or deployed. No production merge, migration or deployment is authorised.** This file is the single place for release approval. Evidence detail lives in `RELEASE_READINESS_REGISTER.md`, `RELEASE_GATE.md` and the audit reports named below.

Release scope is **frozen** (founder directive, 2026-11-26). Only work that closes a launch blocker continues.

## 1. Release candidates

| # | Candidate | Repo / branch | Head | What it ships | Gate | Independent review | State |
|---|---|---|---|---|---|---|---|
| 1 | **C1 test fix**, draft #757 | LEOS `claude/fix-c1-in4-second-boundary` | `fdb9d816` | Test only: a test that fails at random when the clock ticks over a second | RC=0 GREEN; pre-push GREEN | Not needed (no runtime change) | **Ready**: merge first |
| 2 | **Security hotfix: secrets out of logs**, draft #755 | LEOS `claude/sec-log-redaction` | `415ef593` | Stops bearer tokens, refresh cookies, magic-link tokens, query values and personal data reaching production logs. No migration. | RC=0 GREEN (api 505/5,144, worker 26/239); pre-push GREEN | AUDL1 FAIL → fixed; AUDL2 PASS WITH CONDITIONS → conditions closed at `415ef593`; **AUDL2 re-check of `415ef593` running** | **Urgent; separate release**: exposure is live in production |
| 3 | **Launch integration r2**, draft #756 | LEOS `claude/launch-integration-r2` | `3b1df485` (gate 2 running; final head pending) | Website enquiry receiver (#749), notification outbox (#751), privacy (#752), Sales OS enquiry queue (#754), plus integration fixes AUD-03/04/05/22/23; migrations 0190–0194 and 0197–0203 | Gate 1 GREEN on `656e2099`; gate 2 on `3b1df485` running | AUD1 (parts), AUD2 (#752); **integration commits, migration 0203 and #749-as-renumbered not yet independently reviewed** | **Not ready**: final #752 fix, final merge with #755 and #757, one gate, one review |
| 4 | **Sales OS shell**, draft #750 | LEOS `claude/sales-os-integration-r1` | `248cbffc` | Approved preview presentation + 1GUARD shell | RC=0 GREEN | AUD1 PASS | Ready after #720 (manager role) and founder flag/domain decisions |
| 5 | **Website**, branch `claude/peaceful-johnson-azma60` | site | see `git log` (app code = `9164c92` + FIX-W `6be8cbd`) | Brand, radios-first homepage, About/Support, attribution with consent, validation, receiver client | `npm run build` RC=0; e2e 440 passed / 0 failed / 84 skipped | AUDW1 ready with conditions → fixed (FIX-W) | Ready for staging; production needs the decisions in §4 and trimming `docs/launch/evidence/w1` (21 MB) |
| — | Commercial slice, draft #753 | LEOS `claude/commercial-slice-qualification` | `3761943d` | Qualification evidence + CV-1/CV-2 | GREEN | — | **Not in this release.** Its CV-1 fix ships via #755. Rental and outright PASS; hardware+subscription FAIL |

## 2. Outstanding defects

### Block production release

| Defect | Where | Why it blocks | Status |
|---|---|---|---|
| CV-1: tokens and personal data in production logs | production now | Live credential exposure | Fixed in #755; final re-check running |
| R2-01: a direct database writer can fake the lifting of a legal hold, then erase | #752 / 0202 | Privacy record integrity | FIX-P fixing (stamp lifts, actor must be a member) |
| Retention cutoff not tied to the stated period (understated residual) | #752 / 0202 | Privacy record integrity | FIX-P fixing |
| Unreviewed audit-class code in r2 | #756 | Migration 0203 (class B) and the AUD-03/04/05/22/23 integration commits have had no independent review; #749 as renumbered has had none | One focused review of the final r2 diff, after the final merge |
| r2 not yet tested with #755 merged | #756 | #755 reaches main first, so r2 must be proven on top of it | Final merge + one gate |
| GAP-HYB-1: hardware in a hardware+subscription deal is never invoiced or delivered | #753 evidence | Financial | **Do not sell that offer** until fixed. Rental and outright are unaffected |
| GAP-TEN-1: tenant-law breach in the commercial slice | #753 evidence | Tenant isolation | Production is single-tenant today; must be fixed before a second tenant exists |
| AUD-13 / D10: the app's database login owns the tables | all LEOS | Every database guard can be bypassed by that login | **Founder/Architect decision** (separate migration role; app role NOSUPERUSER, not a member of the owner) |

### Follow-ups, not blocking this release

- #755: AUDL2-03 to -06. These are fragments of an email, phone number or token left where long text is cut off, no overall limit on redaction work per log line, numeric and double-encoded JSON secrets, and Meta error codes caught by the one-time-code rule. Also 13-digit ID numbers and "MFA code" written in prose.
- #752: AUD2-07 (a cross-tenant dry-run id gets 409; it reveals nothing).
- #751: AUD-15 (marketing-consent ordering under a simultaneous convert and objection).
- GAP-TERM-1: the 12-month rental minimum is not system-enforced; enforce it on paper at launch. GAP-STOCK-1, GAP-ALLOC-1/2 (stock and serials), GAP-PAY-1/2 (payments), GAP-EXP-1 (quote expiry): manual controls at launch.
- Website: the DR-026 globe animation (INP).

## 3. Test results (latest per candidate)

- **#757:** with a forced second boundary, the old test is red (a request 301 s too late is accepted) and the new test green; removing the freeze turns it red. Gate GREEN, api 500 files / 5,105 tests.
- **#755 at `415ef593`:** gate GREEN. A 14 KB User-Agent costs 2 ms (main 1 ms; first version 213 ms). A 1,734-input probe runs every pattern without the length cap; worst case ~10 ms at 64 KB. Three real leaks through Express's own error handler are closed, with client responses byte-identical. Mutation series M, MA and MB are each red when the fix is removed.
- **#752 at `137a7088`:** gate GREEN, api 512/5,342. AUD2 re-check PASS WITH CONDITIONS. The erasure × conversion race was consistent in four forced orderings; dry-run replay is refused; the earlier forgeries are refused; tenant isolation holds.
- **r2:**
  - At `ee35f194`: gate GREEN (api 516/5,360). Fresh migration chain = incremental chain; reversals round-trip.
  - At `3b1df485`: browser checks, client 26/26, all form types 16/16, credentials 3/3, queue page 14/14 at 1440 and 390 px, assignment notification with a relay kill mid-dispatch 7/7. Restricting after erasure returns 409.
- **Website:** e2e 440/0/84 with build RC=0. AUDW1 findings fixed. The contract checks (`contract:check`, manifest, `contract:release-check`) report SAME.

## 4. Founder decisions required

Decision 1 is needed before the hotfix is merged; the rest are needed before the launch release.

1. **Approve the merge of #757 and #755 to LEOS main**, and decide on the existing logs:
   - retention, deletion and access for the existing Railway logs;
   - forced sign-out (refresh tokens last 7 days);
   - rotating outstanding quote and invitation magic links;
   - rotating `META_WHATSAPP_VERIFY_TOKEN`;
   - copies already stored in database tables and the Redis DLQ (AUDL-02);
   - whether every 5xx keeps writing an audit row (AUDL-07).
2. **D10**: a separate migration role, with the app role NOSUPERUSER and not a member of the owner role. Railway's default user may be a superuser; this is unverified.
3. **Privacy:**
   - D1: retention periods (none chosen; no minimum);
   - D5: second-person approval for erasure;
   - D11: whether retention policy should be role-only;
   - D2–D4 and D6–D9: unchanged.
4. **Architect:** rule on 0188/0189, and confirm 0190–0194 and 0197–0203; release 0195–0196.
5. **Name the website queue owner**: a stored `commercial_director` or `super_admin`.
6. **Notifications:** arm the relay and the email transport; set the credential rotation cadence and owner.
7. **Sales OS:** merge #720 (managers); set the Sales entry flag and domain.
8. **Website:**
   - approve the privacy "Campaign information" text;
   - confirm "By quote" for radios on About;
   - set `INTAKE_CLIENT_IP_HEADER=cf-connecting-ip`;
   - DR-007 (WhatsApp/contact facts);
   - the DR-026 globe.
9. **Facts:** rental terms, HyTalk/POCSTARS, model datasheets, photographs. **Tracking:** GA4/Ads IDs and the consent banner. No paid advertising.

## 5. Deployment sequence (each step needs explicit approval; LEOS `main` auto-deploys on push)

1. **#757** (test only). After merge, run the gate on main and report RC.
2. **#755** hotfix. Merge; confirm both services report the new SHA:
   - api: `api.lancesatsuppliers.co.za/api/system/version`, `data.gitSha`;
   - web: `app.lancesatsuppliers.co.za/api/build-info`, `gitSha`.

   Then act on decision 1 (logs, sign-out, link and token rotation).
3. **r2 (#756)**, final candidate including #755 and #757. Merge; the api `preDeployCommand` runs migrations 0190–0194 and 0197–0203 in order. Confirm both SHAs. The website receiver stays OFF (no `SIGNAL_ONE_INTAKE_URL`/`TOKEN`), so the site keeps using the email route.
4. **Issue the receiver credential** through the approved, audited mechanism (L2-04; designed, not built). Never in GitHub, logs or chat.
5. **Website**: merge the site branch to site `main` (Railway deploy), then set `SIGNAL_ONE_INTAKE_URL`, `SIGNAL_ONE_INTAKE_TOKEN` and `SIGNAL_ONE_INTAKE_KINDS=client`.
6. **One labelled production smoke enquiry** (step J), only with explicit approval. Verify the receipt, the queue entry, the assignment and the notification.
7. **#750 Sales OS shell** after #720 and the flag/domain decisions.

## 6. Rollback procedures

- **#757:** revert the merge commit on main and push.
- **#755:** revert the merge commit on main and push (auto-deploys). No migration and no data change. Rolling back restores the logging leak, so do it only for an outage.
- **r2, code:** revert the merge commit on main and push.
- **r2, schema:** each migration has a reversal script in `apps/api/migrations/reversals/` (0190–0194, 0197–0203), round-tripped on scratch databases. Run them only in reverse order (0203 → 0190), only on a founder decision, and only after the code rollback.
  - Class A migrations (0190–0194, 0197, 0199, 0201, 0202) create new objects only; they can stay in place after a code rollback.
  - Class B migrations (0198 indexes on `crm_leads`, 0200 trigger functions, 0203 outbox columns) need their row-level pre-image and reversal (CLAUDE.md §G). Reversal scripts refuse to run once data depends on the newer objects.
  - **Never** restore a full dump: it destroys every row created since it was taken.
- **Website receiver:** unset `SIGNAL_ONE_INTAKE_URL`/`TOKEN`; the site returns to the email route with no deploy. **Website code:** revert the merge on site `main`. The homepage hero is untouched by this release.

## 7. Work in flight and how to resume

All three tasks were inspected at 11:09 UTC: each was progressing, none had stalled. Shared test lock: `/tmp/claude-0/leos-gate.lock`.
- **Holder status:** run `coord/tools/gate-status.sh` (session scratchpad) to see the holder, the waiters and any stale warnings.
- **Bounded holds:** every new hold goes through `coord/tools/gate-hold.sh <AGENT> <purpose> <minutes> <script>`. It records the owner in `/tmp/claude-0/leos-gate.owner` and kills a run at its limit (45 min for a gate or push, 20 min for targeted suites). A killed run is inconclusive, never a pass. No gate check was removed.
- **The "four-hour" integration task:**
  - It was never stuck. It queued for the lock at 09:34 and waited 76 minutes behind a 76-minute security-fix hold (mutation series, gate and a pre-push retry caused by the C1 test defect).
  - It ran gate 1 (09:02–09:33) and browser re-qualification in between.
  - It acquired the lock for gate 2 at 10:50; at 11:09 it was mid-suite and writing its log.
  - Root cause: long serial lock holds plus the C1 defect forcing pre-push retries. Remedy: bounded holds, targeted tests during correction cycles, and #757 merged first.

| Task | Current operation | Head | Remaining work | Done when |
|---|---|---|---|---|
| INT (r2 / #756) | Full gate 2 on `3b1df485` (lock acquired 10:50) | `3b1df485` local, last pushed `ee35f194` | Push `3b1df485`. Then the final merge: last #752 head + #755 `415ef593` (its #749 merge recipe) + #757 `fdb9d816`; one gate, push, browser sets once | Final r2 head pushed, gate GREEN, browser 26/16/3/14/7 pass |
| FIX-P (#752) | Writing the R2-01 / cutoff fixes in `/home/user/leos-fixp` | `137a7088` pushed | Targeted suites, one gate, push | Pushed; residual stated exactly |
| AUDL2 (#755 re-check) | Queued for the lock (since 11:00) behind INT | reviewing `415ef593` | Targeted tests, 4 mutations, real-HTTP probes | Verdict with a blocking / follow-up split |
| Review of final r2 | Not started (needs the final r2 head) | — | Focused review of what no auditor has seen: 0203, the integration commits, the #755 merge resolution, #749 as renumbered | Verdict |

**To resume in a new session if the allowance runs out:**
1. Read this file, `RELEASE_READINESS_REGISTER.md` and the tail of `COORDINATION.md` (session scratchpad `coord/`; it is not in git, so this file records its state).
2. LEOS branches are all on GitHub, and their pushed heads are authoritative:
   - `claude/launch-integration-r2`
   - `claude/launch-intake-privacy-r1`
   - `claude/sec-log-redaction`
   - `claude/fix-c1-in4-second-boundary`

   Local clones may be lost with the container.
3. Recreate the local test databases from the branch's migration chain before any gate. Any database built with the earlier 0202 must be recreated: the runner tracks migrations by file name.
4. Run the gate only as `pnpm run governance:push > log 2>&1; RC=$?` under the lock, with `pg_isready` first. Never use `--no-verify`, never force-push.
5. Continue from the "Remaining work" column above, in the order #752 fix → #755 re-check → final r2 merge and gate → final r2 review.
