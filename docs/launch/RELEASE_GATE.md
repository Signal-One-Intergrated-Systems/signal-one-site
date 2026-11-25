# Release gate — commercial launch readiness

As of 2026-11-25. Every criterion is PASS, FAIL or BLOCKED. No aggregate score. "Branch" means implemented and verified on a local production build of `claude/peaceful-johnson-azma60`, **not deployed**.

| # | Criterion (mandate §25) | Status | Evidence / blocker |
|---|---|---|---|
| 1 | Every discovered public route reviewed | PASS (automated + persona walkthrough of priority routes) | `ROUTE_INVENTORY.md`: 19 routes × 8 widths. Signal Connect routes excluded and stated. |
| 2 | Every authorised Sales OS module reviewed | BLOCKED | No authorised test credentials. Needs: founder to issue a non-production test login for Sales OS preview and real Sales OS. |
| 3 | Every relevant commercial journey tested | FAIL | Journeys walked; none can complete inside the website (DR-001). |
| 4 | Zero unresolved material brand inconsistencies | FAIL | DR-008 (product naming, founder decision), DR-017, DR-019. |
| 5 | Zero unexplained layout gaps | FAIL → partially fixed on branch | DR-005 and DR-014 fixed on branch; DR-022 open. |
| 6 | Zero broken critical interactions | PASS (live, automated) | No broken links/images/console errors on any route; forms validate. Form *delivery* is DR-001. |
| 7 | Zero unintended horizontal overflow | PASS | 0 at all 8 widths (live). |
| 8 | Zero broken product images | PASS | 0 broken images (live). |
| 9 | Zero unresolved critical accessibility defects | PASS (automated only) | axe 0 violations in 48/48 scans; keyboard, focus, Escape and 200 % text spot-checked. Manual AT (NVDA/VoiceOver) not done. |
| 10 | Lighthouse mobile performance ≥ 90 | NOT MEASURED | Lighthouse not run this session. Lab LCP: `/` 4.4 s (FAIL vs 2.5 s), landing pages 1.0–1.1 s (PASS). |
| 11 | Core Web Vitals LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | FAIL (homepage LCP, lab) | CLS PASS everywhere measured. INP not measured. No field data available. |
| 12 | Verified lead capture | **FAIL — S0** | DR-001. Needs LEOS receiver + Railway variables. |
| 13 | Verified website → Sales OS integration | BLOCKED | Depends on 12. |
| 14 | Verified radio rental lifecycle | BLOCKED | Depends on 12, LEOS quote→contract work (PRs #731/#732 draft), inventory fixtures, HyTalk vs POCSTARS decision. |
| 15 | Verified outright purchase lifecycle | BLOCKED | As 14. |
| 16 | Verified quotation → contract conversion | BLOCKED | LEOS engineering (Mubaraq; PR #728 successors). |
| 17 | Verified invoice and test-payment handling | BLOCKED | Needs approved payment-processor sandbox (PayFast validation report exists in LEOS; not re-run). |
| 18 | Verified inventory reservation and device allocation | BLOCKED | No SEDFA stock data (must not be assumed); isolated fixtures not yet built. |
| 19 | Verified subscription recording | BLOCKED | HyTalk vs POCSTARS commercial decision open; P30 ↔ POCSTARS compatibility unverified. |
| 20 | Verified fulfilment | BLOCKED | As 18. |
| 21 | Zero unresolved critical security / data-integrity defects | NOT ASSESSED | No LEOS security review this session. |
| 22 | Marketing attribution (GA4/GTM/Ads/UTM/gclid) | FAIL | GA4 is wired but dormant: `components/Analytics.tsx` loads gtag only when `NEXT_PUBLIC_GA_ID` is set, and production does not set it (no gtag on the live homepage). The funnel event vocabulary exists (`lib/analytics.ts`). No Google Ads conversion, gclid/UTM capture into the lead, or consent banner. Needs the founder's real GA4/Ads IDs (never fabricated); lead-level attribution is meaningless until 12 passes. |

## Distinctions (mandate §27)

| State | Website fixes on this branch | Lead capture | Sales OS | LEOS commercial lifecycle |
|---|---|---|---|---|
| Implemented | Yes (DR-002, 004, 005, 009, 010, 013, 014, 015) | No | No | Partly (by others; not verified here) |
| Visually verified | Yes (before/after at 1440/1280/1024/390) | — | — | — |
| Functionally verified | Build + branding/design checks pass; e2e suite: see `EXECUTION.md` | No | No | No |
| Commercially qualified | No | No | No | No |
| Independently reviewed | No | — | — | — |
| Production deployed | No | No | No | No |
| Ready for actual customers | **No** — DR-001 | No | No | No |

## Checkpoint 2 (2026-11-25, later the same day)

| # | Criterion | Status now | Change |
|---|---|---|---|
| 3 | Every relevant commercial journey tested | FAIL | Unchanged until 12. Every form's failure states and success path are tested against a mock receiver. |
| 4 | Zero unresolved material brand inconsistencies | FAIL | 1GUARD naming fixed; the visual audit found 27 findings (VA-01…27), 3 fixed, the rest need one token consolidation. |
| 5 | Zero unexplained layout gaps | FAIL | Explained (root causes recorded), not all fixed: DR-022, VA-12. |
| 9 | Zero unresolved critical accessibility defects | FAIL → fixed on branch | VA-06 (no visible form errors, 2.7:1 field borders) was an S1 gap the automated scans missed; fixed for the quote/contact/marketplace forms. |
| 11 | LCP ≤ 2.5 s | FAIL (lab) | Homepage 4.29 → 3.16 s on branch; 2.82 s with the q75 hero (founder decision); production HTTP/2 not yet measured. Landing pages ~1.0 s PASS. |
| 12 | Verified lead capture | FAIL — S0 | Receiver being built on an isolated LEOS branch (workstream B); website side now also forwards attribution. |
| 2 | Sales OS modules reviewed | BLOCKED | Exact test-access request in `SALES_OS_RECONCILIATION.md`. |
| 22 | Marketing attribution | PARTLY READY (branch) | UTM/gclid/gbraid/wbraid captured and forwarded; GA4 `generate_lead` + Ads conversion on receipt only, de-duplicated by receipt reference; consent defaults denied; needs real GA4/Ads IDs, a consent banner decision, and the receiver storing attribution. |

E2E (branch): **412 passed, 0 failed, 84 skipped** before the VA-04/06/11 changes; the 84 skipped are the two opt-in evidence-capture suites (`visual-audit`, `visual-states`, run only with `VISUAL_AUDIT_DIR`), not launch gates.

## Checkpoint 2b — lead capture (workstream B, 2026-11-25)

| Item | Status | Evidence / next action (owner) |
|---|---|---|
| Receiver exists | YES — not merged | LEOS draft PR #704 (`feat/r1-intake-1`, the receiver: auth, validation, idempotency, consent, routing, website queue) + draft PR #748 stacked on it (`claude/website-intake-receiver` @ `aa83b16`: radio-quote fields, v1.1 attribution, post-commit hook, migration 0192 BACKUP CLASS A). |
| Every public form persists | PASS in local qualification (#704 + #748) | 11/11 forms submitted through Chromium against local builds saved in Postgres; #704 alone lost all 4 radio-quote types. |
| LEOS gate | GREEN on #704 + #748 | `governance:push` RC=0; 5,240 API tests, 0 failed. Not yet run on a merge with current `main` — #704 now conflicts with `main`'s new migration 0187. |
| Website compatibility | PASS (branch) | `attribution` only sent for campaign visits; every form's fields asserted against the receiver allow-list (`tests/e2e/receiver-allowlist.json`); 57/57 intake tests. **Release condition: #748 must go live together with #704** (#704 alone refuses campaign-visit enquiries). |
| Sales OS visibility | GAP | Website leads arrive unassigned; reps only see assigned leads; assignment via the website queue (`commercial_director`, `super_admin`). No user currently signs in as `sales_manager`. |
| Go live | BLOCKED | (1) Architect: renumber #704 around `main`'s 0187, rule on 0188/0189 overlaps (#728, #746, #720) and on 0192; rebase #704 + #748. (2) Audits: #704 fourth audit, #748 audit, open decisions (sales_manager mapping, erasure incl. the attribution column, lead-match indexes). (3) Founder: approve merge; issue the production credential through an approved step. (4) Founder: set `SIGNAL_ONE_INTAKE_URL=https://api.lancesatsuppliers.co.za/api/v1/integrations/website/v1/intake` and `SIGNAL_ONE_INTAKE_TOKEN` on the website's Railway service; one labelled smoke enquiry; assign it in the website queue. (5) Mubaraq: wire #728's email path into `onPersisted`. |

Final website e2e on this state: **413 passed, 1 failed, 84 skipped**; the failure is KI-1 (React #418, `/get-started` @1440, one of ~500 loads), open.

## Checkpoint 3 — independent audit (L2) of LEOS #704 and #748

Full report: `LEOS_R1_AUDIT_L2.md`. Verdicts: **#704 PASS WITH CONDITIONS, #748 PASS WITH CONDITIONS.** Security core (credential hashing, constant-time compare, uniform 401, revocation incl. mid-request, tenant from credential only, idempotency, rollback) held under adversarial tests; 187/187 existing intake tests pass on #704+#748.

| Finding | Sev | Blocks | Status |
|---|---|---|---|
| L2-01 guard/sales applications stored but unread | S1 | live intake of applications | **Mitigated on the website:** `SIGNAL_ONE_INTAKE_KINDS` defaults to `client`; applications keep the honest email route until a reader exists (test added). |
| L2-02 matched enquiries invisible (no queue screen, no notification) | S1 | launch | Workstream S (queue in Sales OS) + notification outbox (next workstream). |
| L2-03 erasure impossible (append-only triggers), no retention, no marketing-consent withdrawal | S1 | launch | Founder/legal decision + engineering design (privacy workstream). |
| L2-04 no approved production credential issuance | S1 | go-live | L1 design. |
| L2-05 migration numbers collide with main's 0187 | S2 | merge | L1 reconciliation. |
| L2-06 in-memory post-commit hook, no outbox | S2 | reliable notification | Next workstream (outbox, reuse #728). |
| L2-07 no index for lead matching (93–122 ms at 30k leads) | S2 | scale | L1 (receiver scope). |
| L2-08 an unusual referrer host makes the receiver refuse the whole enquiry (422, no email route) | S3 | lost enquiries | **Fixed on the website:** referrer host and landing path normalised to the receiver's own patterns or dropped (test added); L1 to make the receiver drop rather than refuse. |
| L2-09 credentials never expire; L2-10 NBSP company names miss matches; L2-11 marketing consent not carried to the lead; L2-12 receiver time budget vs the site's 10 s timeout | S2–S3 | — | L1 / privacy workstream. |

Launch-minimum roles (audit condition 7): no `sales_manager` mapping; a **named `commercial_director` (or `super_admin`) as the queue owner — founder to name the person**; grants only to named people; `privacy.manage` held by `super_admin` only.
