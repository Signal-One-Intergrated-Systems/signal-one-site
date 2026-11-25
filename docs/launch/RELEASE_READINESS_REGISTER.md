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
| W | Website: site branch `claude/peaceful-johnson-azma60` (W1 visual system, W2 performance, L2-01/L2-08 fixes, contract v1.2.0 checks, About/Support, attribution) | `71e53e6` | Y | **Y**: `npm run build` RC=0 (branding, design, truth checks); e2e 420 passed / 0 failed / 84 opt-in skipped (the skipped tests pass 84/84 when enabled); form manifest covers 8/8 observed forms | **Y**: branch is site `main` + 22 commits | **No**: self-reviewed and screenshot-checked only. The W1 placeholder regression was found by my own review, not an independent one. | **Partial**: it can ship before LEOS. With `SIGNAL_ONE_INTAKE_URL` unset, every form keeps its honest email route. INP is FAIL (DR-026, founder ruling needed). Trim `docs/launch/evidence/w1` (21 MB) first. | **No**: no independent review, no founder approval | No (site `main` `8e89d24`) |
| R | Receiver integration candidate: LEOS #749 `claude/launch-integration-r1` (= main + #704 + #748; intake migrations renumbered to 0190–0194) | `3ef1c67f` | Y | **Y**: gate GREEN; real-browser forms 22/22 (all kinds) and 11/11 (client only) | **Y**: built on main `5efcb303` | **Partial**: #704 and #748 had the L2 fourth audit (PASS WITH CONDITIONS, `LEOS_R1_AUDIT_L2.md`). Nobody has audited the renumbered #749 itself. | **No**: the Architect has not ruled 0190–0194 (REQUESTED only); credential procedure designed but not built | No | No |
| N1 | Notification outbox, lead-match indexes, credential expiry: #751 (on #749) | `7a8a1037` | Y | **Y**: gate RC=0 ×2; 14 mutation controls (13 red then green, 1 disclosed as vacuous); EXPLAIN 48–99 ms → 0.05 ms | **Partial**: on #749, not on main directly | **No** | No: audit-class; migrations 0197–0199 REQUESTED | No | No |
| N2 | Privacy (erasure, retention, consent) and application readers: #752 (on #749) | `65c6767c` | Y | **Y**: gate RC=0 ×2; 12 mutations red then green, 1 survivor explained (two tenant checks); migration round-trip fingerprint restored | **Partial**: on #749 | **No** | No: audit-class; founder/legal D1–D9 open; migrations 0200–0201 REQUESTED | No | No |
| S1 | Real Sales OS phase 1: preview presentation + 1GUARD shell, #750 (against main) | `248cbffc` | Y | **Y**: gate GREEN; browser walk 208 passed / 2 failed (the manager has no quotes) at 1440 and 390; cross-tenant 404 | **Y**: against main | **No** | No: audit-class (sign-in); needs `NEXT_PUBLIC_SALES_OS_ENTRY` and a Sales domain | No | No |
| S2 | Website enquiry queue in Sales OS: #754 (on #749) | `514c2545` | Y | **Y**: gate GREEN; API SQ1–SQ5; 12 web tests; 9 mutations; browser walk as director and rep | **Partial**: on #749 | **No** | No: needs #749, a named queue owner, and a merge with #752 | No | No |
| CV | Radio commercial slice qualification, plus fixes CV-1 (token logging) and CV-2: #753 (against main) | `3761943d` | Y | **Partial**: rental PASS end to end (with #748); outright PASS through delivery; **hardware + subscription FAIL**; PayFast BLOCKED; live slice 30/30 | **Y**: against main | **No** | No | **No**, but CV-1 should ship first and alone (below) | No |
| C | Contract drift control (website v1.2.0 ↔ LEOS) | site `71e53e6` / #749 | Y | **Y**: `contract:check`, `form-manifest --check`, `contract:release-check` → SAME | Y | No | Y (it is a check, not a runtime change) | Follows W and R | No |

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
| 0200–0201 | N2 (#752) | requested |
| 0202 | N2 | requested, **unused**; can be released |

No migration on these branches renumbers one that was applied to a deployed database. The only programme migration in production is #719's 0187, which was left as it is.

## Release sequence A–K (founder §12), status now

| Step | What | Status | Blocking |
|---|---|---|---|
| A | Architectural reconciliation, migration reservations | **Partial**: map and requests done | Architect rulings on 0188/0189 and on 0190–0201 |
| B | Commercial backend + receiver integration | **Partial**: #749 on main; N1, N2 and S2 stacked on #749 | One integration branch #749+#751+#752+#754 with the #752/#754 conflict resolved and the gate run (not yet done) |
| C | Independent security, database and compatibility audits | **Partial**: #704 and #748 audited (L2) | Independent audit of #749, #750, #751, #752, #753, #754 and the website branch |
| D | Real Sales OS queue + approved shell | **Qualified locally** (#750, #754) | Audit; #720 for managers; queue owner |
| E | Website visual and functional qualification | **Qualified locally** | Independent review; DR-026 ruling; evidence trim |
| F | Isolated end-to-end acquisition → transaction test | **Partial**: rental and outright pass; hybrid FAIL; 6 audit-class gaps | GAP-TEN-1, ALLOC-1/2, PAY-1/2, HYB-1, TERM-1, EXP-1 |
| G | Deployment candidate and rollback plan | **No** | Needs B and C. Reversal scripts exist per migration (tested on scratch). |
| H | Explicit release approval | **No** | Founder |
| I | Coordinated deploy, credential issuance, website configuration | **No** | Credential issuance mechanism designed, not built (L2-04) |
| J | Labelled production smoke enquiry | **No** | I |
| K | Commercial and advertising readiness | **No** | All of the above; GA4/Ads IDs and a consent decision |

## Ship first, outside the sequence

**CV-1:** every 5xx alert in production writes the caller's bearer access token and refresh cookie into the Railway logs. It is live now on `5efcb303`. The fix is in #753, mutation-proven. Recommended handling:
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
