# Release readiness register — commercial launch (2026-11-25)

Answers founder rulings §12–§13. Every cell is backed by a commit, a PR or a measured result named in this file or in `RELEASE_GATE.md`. Where no evidence exists, the cell says **No**.

## Production as measured (2026-11-25 23:44 UTC, cache-busted)

| Surface | Deployed SHA | Source |
|---|---|---|
| Website `signalone.co.za` | `8e89d24` (site `main`) | `git ls-remote origin main`; HTTP 200 |
| LEOS api | `5efcb303` (LEOS `main`) | `api.lancesatsuppliers.co.za/api/system/version` → `data.gitSha` |
| LEOS web | `d5f78f64` | `app.lancesatsuppliers.co.za/api/build-info` → `gitSha`. It is 6 commits behind `main`, and none of the 6 touches `apps/web`, so no web deploy was triggered. |

**Nothing from this programme is deployed.** No LEOS PR from this programme is merged; LEOS `main` is still `5efcb303`. The website branch is 22 commits ahead of site `main` and unmerged.

## The register

Key: **Y** = evidenced · **No** = not done · **n/a** = does not apply · **Partial** = see the note.

| # | Candidate | Head | Completed | Qualified locally | Integrated against current main | Independently reviewed | Ready for staging | Ready for production | Actually deployed |
|---|---|---|---|---|---|---|---|---|---|
| W | Website: site branch `claude/peaceful-johnson-azma60` (W1 visual system, W2 performance, L2-01/L2-08 fixes, contract v1.2.0 checks, About/Support, attribution) | `71e53e6` | Y | **Y**: `npm run build` RC=0 (branding, design, truth checks); e2e 420 passed / 0 failed / 84 opt-in skipped (the skipped tests pass 84/84 when enabled); form manifest covers 8/8 observed forms | **Y**: branch is site `main` + 22 commits | **Y (AUDW1): ready with conditions.** No success is shown without a receipt, and nothing is invented. AUDW-01: the privacy notice omits attribution. AUDW-02: status ignores the kinds gate. AUDW-03: regression, progress bar gone. AUDW-04: multi-step errors are not persistent. 8 × S3. **Fixed** (merged at `6be8cbd`, verified on `1d6846b`, which differs only in this register): build RC=0; e2e **440 passed / 0 failed / 84 skipped**; 17 of the 20 new tests fail with the fixes reverted. The new privacy-notice section (version 2026-11-26) still needs founder or legal approval. | **Partial**: it can ship before LEOS. With `SIGNAL_ONE_INTAKE_URL` unset, every form keeps its honest email route. INP is FAIL (DR-026, founder ruling needed). Trim `docs/launch/evidence/w1` (21 MB) first. | **No**: no independent review, no founder approval | No (site `main` `8e89d24`) |
| R | Receiver integration candidate: LEOS #749 `claude/launch-integration-r1` (= main + #704 + #748; intake migrations renumbered to 0190–0194) | `3ef1c67f` | Y | **Y**: gate GREEN; real-browser forms 22/22 (all kinds) and 11/11 (client only) | **Y**: built on main `5efcb303` | **Partial**: #704 and #748 had the L2 fourth audit (PASS WITH CONDITIONS, `LEOS_R1_AUDIT_L2.md`). Nobody has audited the renumbered #749 itself. | **No**: the Architect has not ruled 0190–0194 (REQUESTED only); credential procedure designed but not built | No | No |
| N1 | Notification outbox, lead-match indexes, credential expiry: #751 (on #749) | `7a8a1037` | Y | **Y**: gate RC=0 ×2; 14 mutation controls (13 red then green, 1 disclosed as vacuous); EXPLAIN 48–99 ms → 0.05 ms | **Partial**: on #749, not on main directly | **Y (AUD1): PASS WITH CONDITIONS.** 0198 under a concurrent writer waits at most 5 s, then fails the deploy. Its row-count guard does nothing on a table without statistics. AUD-03: application notifications go to admins who cannot open them. | No: audit-class; migrations 0197–0199 REQUESTED | No | No |
| N2 | Privacy (erasure, retention, consent) and application readers: #752 (on #749) | `ecab5d34` | Y | **Y**: gate RC=0 GREEN on the fix tree (`0e3fb4dc`), pre-push gate GREEN on re-run (the first pre-push went red only on main's C1 IN-4 second-boundary test defect, recorded in the PR; a separate test fix is in progress); AUD-10/11/12/14 fixed, each with a test that fails without the fix; migration 0202 added (class A, new checks only) | **Partial**: on #749 | **Pending**: AUD1 FAILED `65c6767c`; the fixes at `ecab5d34` are being re-audited (AUD2). AUD-13 (app role owns the tables) is documented as decisions D10/D11, not fixed. | No: audit-class; founder/legal D1–D11 open; migrations 0200–0202 REQUESTED | No | No |
| S1 | Real Sales OS phase 1: preview presentation + 1GUARD shell, #750 (against main) | `248cbffc` | Y | **Y**: gate GREEN; browser walk 208 passed / 2 failed (the manager has no quotes) at 1440 and 390; cross-tenant 404 | **Y**: against main | **Y (AUD1): PASS.** The only api change is note text. No migrations; `/clients/mine/:id` is identical to main. The 22k-line web diff was pattern-scanned, not read line by line. | No: audit-class (sign-in); needs `NEXT_PUBLIC_SALES_OS_ENTRY` and a Sales domain | No | No |
| S2 | Website enquiry queue in Sales OS: #754 (on #749) | `514c2545` | Y | **Y**: gate GREEN; API SQ1–SQ5; 12 web tests; 9 mutations; browser walk as director and rep | **Partial**: on #749 | **Y (AUD1): PASS WITH CONDITIONS.** One import conflicts with #752. AUD-22: the assignment hook is best-effort. | No: needs #749, a named queue owner, and a merge with #752 | No | No |
| CV | Radio commercial slice qualification, plus fixes CV-1 (token logging) and CV-2: #753 (against main) | `3761943d` | Y | **Partial**: rental PASS end to end (with #748); outright PASS through delivery; **hardware + subscription FAIL**; PayFast BLOCKED; live slice 30/30 | **Y**: against main | **Y (AUD1): PASS WITH CONDITIONS.** CV-1 is incomplete. AUD-30: magic-link tokens are logged from URL paths. AUD-31: DB error stacks log bound parameters (PII, hashes). FIX-L is building a standalone hotfix. | No | **No**, but CV-1 should ship first and alone (below) | No |
| R2 | **Launch integration candidate r2**, draft [#756](https://github.com/Signal-One-Intergrated-Systems/lancesat-enterprise-platform/pull/756) `claude/launch-integration-r2` = #749 + #751 + #752@`ecab5d34` + #754, merge commits | `ee35f194` | Y | **Y**: gate RC=0 GREEN, counts exact (api 516 files / 5,360 tests), pre-push GREEN first attempt. Migrations 0190–0194 and 0197–0202, no number twice: fresh chain = incremental from previous r2 (byte-identical schema); reversals 0202→0197 each match the chain below. Real browser against site `a2644ad` (app code = `9164c92`): client-only 26/26 incl. erased enquiry (tombstoned, gone from queue list, summary and detail, convert 404 not 500), all kinds 16/16, credentials 3/3, Sales OS queue page 14/14 at 1440 and 390. 26 submissions → 26 outbox rows, all dispatched | **Y**: built on main `5efcb303` | **Partial**: its parts were audited (AUD1); #752's fixes under re-audit (AUD2) | No: needs AUD2, AUD-03 and AUD-22 closed, and the Architect migration ruling | No | No |
| L | **Security hotfix: secrets and PII out of logs**, draft [#755](https://github.com/Signal-One-Intergrated-Systems/lancesat-enterprise-platform/pull/755) `claude/sec-log-redaction` (against main; CV-1 cherry-picked from #753, plus AUD-30/31/32, a full sweep and the AUDL1 fixes; no migration) | `5af0f95a` | Y | **Y**: gate RC=0 GREEN (api 503 files / 5,132 tests, worker 26/239, counts exact) and pre-push GREEN. Every redaction pattern is now linear-time with input caps: the auditor's 15 KB User-Agent probe takes 3 ms (was 276 ms; main 3 ms), 64 KB inputs 1–4 ms. Mutation matrix (MA1–MA10) all red, then green; the first version of the new performance control was found vacuous by mutation and fixed | **Y**: built on main `5efcb303` | **Y (AUDL2): PASS WITH CONDITIONS** (`LEOS_AUDIT_AUDL2.md`). The S1 slowdown is gone (14 KB User-Agent 2 ms; first version 213 ms) and no planted secret reached the log. Conditions: AUDL2-01 (S2) the login-token pattern is still quadratic, capped at ~40 ms per scan and reachable only when signed in; AUDL2-02 (S2) errors outside the API router reach Express's own handler, which logs raw stacks (payment-notification payer details, a magic-link token, part of a password); main has the same leaks. Two controls were vacuous. FIX-L is closing both conditions and the two controls. AUDL-02 (copies already stored in DB tables and Redis) and AUDL-07 (every 5xx writes an audit row) are disclosed for founder decision, not fixed | No: audit-class | **No**: needs the re-audit and founder approval, plus decisions on the existing logs, sessions, magic links and stored copies | No |
| C | Contract drift control (website v1.2.0 ↔ LEOS) | site `71e53e6` / #749 | Y | **Y**: `contract:check`, `form-manifest --check`, `contract:release-check` → SAME | Y | No | Y (it is a check, not a runtime change) | Follows W and R | No |
| T | **Test reliability fix (C1 IN-4)**, draft [#757](https://github.com/Signal-One-Intergrated-Systems/lancesat-enterprise-platform/pull/757) `claude/fix-c1-in4-second-boundary` (test-only, against main) | `fdb9d816` | Y | **Y**: forced second boundary: old test RED (stale +301 s request answered 202), new test GREEN; freeze removed → RED; restored → GREEN. Gate RC=0 GREEN (api 500 files / 5,105 tests), pre-push GREEN | **Y**: built on main `5efcb303` | No (test-only; no production code) | Y: test-only, no runtime change | **Yes, recommended first**: until it merges, main's IN-4 test can turn any LEOS pre-push gate red at random | No |

## Dependency map

```
LEOS main 5efcb303 (deployed)
├── #749 receiver candidate = #704 + #748 (0190–0194)  ── supersedes merging #704 or #748 alone (ruling: never #704 alone)
│     ├── #751 N1 outbox/indexes/expiry (0197–0199)     ── needed for anyone to be told about an enquiry (L2-02, L2-06)
│     ├── #752 N2 privacy/readers (0200–0201)           ── needed before launch (L2-03, L2-11); L2-01 reader
│     └── #754 S2 enquiry queue (no migration)          ── CONFLICTS with #752 in website_queue_service.ts (resolveEnquiry)
├── #750 S1 Sales OS shell (presentation of #692–#702, #714, #733; #703 presentation only; #703's GET /clients/mine/:id reverted)
│     └── managers sign in as managers only after #720 (0189 manager role)
├── #753 CV slice + CV-1/CV-2                            ── independent of all others
├── #728 email reliability (0188, 0189)  ── 0188 collides with #746; 0189 collides with #720 → Architect ruling
├── #746 USD currency (0188 "provisional")
├── #720 manager role (0189, assigned 2026-11-13 per #703's design)
└── #731 / #732 quote money (Mubaraq)                    ── GAP-TERM-1, GAP-EXP-1 belong here
Website branch W ── can deploy first (no receiver configured = email route);
                    receiver goes live only by setting SIGNAL_ONE_INTAKE_URL/TOKEN after R + N1 + N2 (+ S2) are deployed.
```

Migration allocation (`NUMBER_RESERVATIONS.md` on the LEOS branches; all **REQUESTED**, none ruled by the Architect):

| Range | Owner | Status |
|---|---|---|
| 0187 | #719 C1 | on main, applied in production |
| 0188 | #728 and #746 | **collision, Architect ruling** |
| 0189 | #720 (assigned 13 Nov) and #728 | **collision, Architect ruling** |
| 0190–0194 | intake (#749) | requested |
| 0195–0196 | S | requested, **unused**; can be released |
| 0197–0199 | N1 (#751) | requested |
| 0200–0202 | N2 (#752) | requested; 0202 used by the AUD1 fixes (class A) |

No migration on these branches renumbers one that was applied to a deployed database. The only programme migration in production is #719's 0187, which was left as it is.

## Release sequence A–K (founder §12), status now

| Step | What | Status | Blocking |
|---|---|---|---|
| A | Architectural reconciliation, migration reservations | **Partial**: map and requests done | Architect rulings on 0188/0189 and on 0190–0201 |
| B | Commercial backend + receiver integration | **Done as candidate r2** (#756 `8b623cb7`, gate GREEN, browser matrix all pass) | Merge FIX-P into r2 and re-gate |
| C | Independent security, database and compatibility audits | **Partial**: #704 and #748 audited (L2). #750–#754 audited (AUD1, `LEOS_AUDIT_AUD1.md`): #752 FAIL, the others pass or pass with conditions. | Audit of #749 as renumbered; website audited (AUDW1, `WEBSITE_AUDIT_AUDW1.md`); re-audits running: AUD2 (#752 @ `ecab5d34`) and AUDL2 (#755 @ `5af0f95a`) |
| D | Real Sales OS queue + approved shell | **Qualified locally** (#750, #754) | Audit; #720 for managers; queue owner |
| E | Website visual and functional qualification | **Qualified locally** | Independent review; DR-026 ruling; evidence trim |
| F | Isolated end-to-end acquisition → transaction test | **Partial**: rental and outright pass; hybrid FAIL; 6 audit-class gaps | GAP-TEN-1, ALLOC-1/2, PAY-1/2, HYB-1, TERM-1, EXP-1 |
| G | Deployment candidate and rollback plan | **No** | Needs B and C. Reversal scripts exist per migration (tested on scratch). |
| H | Explicit release approval | **No** | Founder |
| I | Coordinated deploy, credential issuance, website configuration | **No** | Credential issuance mechanism designed, not built (L2-04) |
| J | Labelled production smoke enquiry | **No** | I |
| K | Commercial and advertising readiness | **No** | All of the above; GA4/Ads IDs and a consent decision |

## Ship first, outside the sequence

**CV-1 + AUD-30/31: hotfix #755 (`5af0f95a`, gate GREEN; AUDL1 failed the first version on a slowdown it introduced, the fix is now being re-audited by AUDL2).** Original finding: every 5xx alert in production writes the caller's bearer access token and refresh cookie into the Railway logs. It is live now on `5efcb303`. The fix is in #753, mutation-proven. Recommended handling:
1. Take the fix alone, through the normal audit-class route.
2. Founder or Architect decide on retention of the existing Railway logs and whether to force a sign-out (refresh cookies outlive the 15-minute access token).

## Commercial verdict today

- **Rental by quotation:** operable on the synthetic slice once R, N1, N2 and S2 are live.
  - GAP-TERM-1 means the 12-month minimum is not enforced by the system. It must be enforced on paper or fixed first.
  - GAP-TEN-1 is a tenant-law breach. Prod is single-tenant today, but the breach must still be fixed before a second tenant exists.
- **Outright sale:** operable through delivery, with the same stock and serial caveats (GAP-STOCK-1, GAP-ALLOC-1/2) and payment caveats (GAP-PAY-1/2).
- **Hardware + subscription:** **not sellable**. The hardware is never invoiced or delivered (GAP-HYB-1).
- **Advertising:** not ready. Do not run paid traffic until J passes and the attribution consent decision is made.

## Founder / Architect / legal decisions outstanding

1. Name the website queue owner: a stored `commercial_director` or `super_admin` in the website's tenant.
2. Architect: rule on 0188/0189 and on the REQUESTED ranges 0190–0201; release 0195–0196 and 0202.
3. CV-1: Railway log retention and forced sign-out.
4. Privacy D1–D9 (#752), including retention periods and whether applications go to LEOS at launch.
5. N1: arm the relay and email transport; set credential rotation cadence and owner.
6. #720 merge (managers), Sales entry flag and domain, production QA accounts.
7. DR-026 globe animation (INP).
8. Contact facts (DR-007), rental terms and HyTalk/POCSTARS (DR-016), model datasheets, photography.
9. GA4/Ads IDs and the consent banner.
10. Merge approvals per step H.
