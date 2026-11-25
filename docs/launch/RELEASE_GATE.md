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
| Website compatibility | PASS (branch) | `attribution` only sent for campaign visits; every form's fields asserted against the receiver allow-list (vendored LEOS contract `contracts/website-intake.contract.v1.json`; replaced `tests/e2e/receiver-allowlist.json`); 57/57 intake tests. **Release condition: #748 must go live together with #704** (#704 alone refuses campaign-visit enquiries). |
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

## Checkpoint W2 — performance and hydration (2026-11-25, local branch `wip/w2-perf`)

| # | Criterion | Status now | Evidence |
|---|---|---|---|
| 10 | Lighthouse mobile performance ≥ 90 | NOT MEASURED | Lighthouse is not installed in the container; lab traces below instead. |
| 11 | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | **LCP: PASS in the lab median, marginal** (homepage 3.18 → 2.48 s on the final build, 7 interleaved runs 2.46–2.50 s; margin ~20 ms). **INP: FAIL in the lab** (DR-026: ~530–650 ms worst tap on the homepage with the animated globe, ~110 ms without; founder-locked animation, ruling needed). **CLS: PASS** (0.0005). Production must be measured after deploy (Cloudflare HTTP/2; no field data yet). | `DEFECT_REGISTER.md` W2 section. |
| 6 | Zero broken critical interactions | PASS (unchanged) + KI-1 root-caused | React #418 is a framework bug triggered by `SceneTransition`; worked around on the branch; see `docs/KNOWN_ISSUES.md`. |

E2E on W2's final tree (one consolidated set; supersedes earlier figures for this branch): **418 passed, 0 failed, 84 skipped**; the 84 skipped are the opt-in evidence suites `visual-audit` (72) and `visual-states` (12), which pass **84/84** when run with `VISUAL_AUDIT_DIR`. They are capture suites whose assertions overlap the always-on suites; skipping them does not drop a launch gate. Details: `DEFECT_REGISTER.md`, W2 section.

**Merged tree `35fa09c` (W2 merged over the L2 fixes):** `npm run build` RC=0 (branding, design and truth checks pass); full e2e suite under the shared lock **420 passed, 0 failed, 84 skipped** (418 from W2 + the two L2 tests; the 84 are the opt-in evidence suites).

**Merged tree `435a5b2` (W1 visual consolidation + catalogue placeholder fix, over W2 and the L2 fixes):** `npm run build` RC=0; full e2e suite under the shared lock **420 passed, 0 failed, 84 skipped**. Catalogue checked by screenshot at 1440 and 390 after the fix.

**Contract checks (L1 patch applied over the W1/W2 merge):** full e2e suite **420 passed, 0 failed, 84 skipped**; `contract:check` → contract 1.2.0 accepts all 10 manifest forms; `form-manifest --check` → covers all 8 observed forms after a real-browser run on the W1/W2 tree; `contract:release-check --leos … --ref claude/launch-integration-r1` → both vendored copies SAME.

## Checkpoint N1 — notification outbox, lead-match indexes, credential expiry (LEOS, 2026-11-25)

**Unmerged.** Draft PR [#751](https://github.com/Signal-One-Intergrated-Systems/lancesat-enterprise-platform/pull/751), branch `claude/launch-intake-outbox-r1` @ `7a8a1037`, one commit on `claude/launch-integration-r1` @ `3ef1c67` (#749). Audit-class: must not merge before the pre-merge audit and founder approval.

| Finding | Result | Evidence |
|---|---|---|
| L2-06 in-memory hook, no outbox | **Closed on the branch.** Transactional outbox (0197, class A): the notification row is written in the intake transaction; one delivery per recipient with a name-based idempotency key; backoff 30 s → 1 h, dead-letter after 10 attempts; poison rows bounded; `awaiting_recipient` kept and alerted, never dropped. Off until `WEBSITE_INTAKE_NOTIFICATIONS_ENABLED=true`. Reuses BullMQ `notifications-email` as transport; #728 composes on the same key later. | Mutation controls M1–M8, M12 each went red, restored, re-run green. |
| L2-02 (notification half) | Recipients by stored role/grant only: enquiries → `website_queue.read` (today `commercial_director`, `super_admin`); applications → `privacy.manage`; sales roles refused for applications in code and by DB CHECK. Read endpoints `/notifications/sales-queue` and `/recruitment` for workstream S. | M9–M11 (tenant isolation, forged grant) red then green. |
| L2-07 no lead-match index | **Closed on the branch.** 0198 (class B, indexes only): 48–99 ms → 0.04–0.05 ms at 50k leads; refuses above ~250k rows (non-concurrent build under `migrate.js`); adopts indexes pre-built with the CONCURRENTLY runbook. | EXPLAIN on scratch; M14. Measured on PG 16 only; production is PG 18. |
| L2-09 credentials never expire | **Closed on the branch** (0199, class A): nullable `expires_at`, one predicate in resolution, cache and touch; `--expires-at` on the operator command. Rotation cadence and owner: founder. | M13 (200 instead of 401 when removed). |

Gate: full `governance:push` RC=0 GREEN (178 migrations, `lancesat_test` recreated); pre-push gate RC=0 on tree `e26a313a`. `@lancesat/api` 5,331 passed / 7 skipped; intake suites 241/241. One vacuous control disclosed (`NEVER_RECRUITMENT_ROLES` cannot go red with today's role matrix).

Still open: worker leg after hand-off (3 BullMQ attempts then DLQ; #728 makes it durable); no Redis in the gate (hand-off unit-tested only); no dead-letter redrive route; email recipient allowlist (0155) not enforced on the send path (observation for #728). Founder: arm the relay and the email transport; name the queue owner (until then enquiry notifications wait in `awaiting_recipient`); rotation cadence.

## Checkpoint N2 — intake privacy and application readers (LEOS, 2026-11-25)

**Unmerged.** Draft PR [#752](https://github.com/Signal-One-Intergrated-Systems/lancesat-enterprise-platform/pull/752), branch `claude/launch-intake-privacy-r1` @ `65c6767c`, one commit on `claude/launch-integration-r1` @ `3ef1c67` (#749). Audit-class: must not merge before the pre-merge audit and founder/legal approval. Full record: LEOS `docs/release/LAUNCH_R1_PRIVACY.md` on that branch.

| Finding | Result | Evidence |
|---|---|---|
| L2-03 erasure impossible, no retention | **Mechanism built on the branch, no period chosen.** Erasure as redaction (0200, class B: no row rewritten): attribution (utm, gclid, gbraid, wbraid, landing, referrer) → NULL; consent subject email → NULL; application/enquiry fields → `{"erased":true}`; ids, hash and timestamps kept. Execution needs `privacy.manage` plus the reference typed back; refused while restricted; audited. Retention: no period → `not_configured`, nothing erased; with a period, redacts only that class, never restricted rows. | Mutations M1, M2, M3, M6, M7, M10–M12 red then green. |
| L2-11 marketing consent not carried to the lead | **Closed on the branch** (0201, class A): append-only `crm_lead_marketing_consent_events`; carried at lead creation and queue conversion; withdrawal endpoints; an objection before conversion blocks the carry; `isMarketingPermitted()` for any future marketing use. | M8, M9. |
| L2-01 applications stored but unread | **Reader API on the branch** (no migration): list / audited detail / audited status change; permissions `website_applications.read/review` held by `super_admin` only; grants, admins, service accounts and every sales role refused. No screen yet. Website keeps `SIGNAL_ONE_INTAKE_KINDS=client` until D6. | M5; M4 survived alone (two tenant checks), M4b (both removed) red. |
| Tenant isolation | Tenant B's `super_admin` gets 404 on every new route; the DB function refuses cross-tenant calls. | M3, M4b. |

Gate: full `governance:push` RC=0 GREEN (`lancesat_test`, `lar_test` recreated); pre-push RC=0. @lancesat/api 5,325 passed / 7 skipped; web 2,229; rbac 179; lar 1,269. Round-trip of 0200/0201 on scratch: schema fingerprint restored exactly; reversals refuse on populated data.

Founder/legal decisions (none made): **D1** retention periods per data class; **D2** scheduled vs manual retention and by whom; **D3** whether erasure also erases the CRM lead (notes copy every answer); **D4** redact staff free-text reasons; **D5** whether each erasure/non-dry retention run needs Class C sign-off and a second person; **D6** applications to LEOS or email at launch, and who else may read them; **D7** who may record a marketing withdrawal (today only `privacy.manage`); **D8** keep consent proof after erasure; **D9** confirm in production that the app's DB role neither owns the intake tables nor is superuser (precondition for 0200's guards).

Integration note: #752 and S's queue branch both touch `website_queue_service.ts` (`resolveEnquiry`); #751 and #752 both base on #749 with disjoint migration numbers (0197–0199, 0200–0201; 0202 released).

## Checkpoint CV — radio commercial slice qualification (LEOS, 2026-11-25)

**Unmerged.** Draft PR [#753](https://github.com/Signal-One-Intergrated-Systems/lancesat-enterprise-platform/pull/753) ("AUDIT-CLASS — DO NOT MERGE"), branch `claude/commercial-slice-qualification` @ `3761943d`. Run on a local LEOS at main `5efcb303` (own DB `cv_slice`, own Redis, real API process, real login and RBAC, synthetic inventory and customers only, no live payment processor). Full register: LEOS `docs/release/COMMERCIAL_SLICE_QUALIFICATION.md` §5 on that branch.

| Step | Rental | Outright purchase | Hardware + subscription |
|---|---|---|---|
| 1 Website enquiry | BLOCKED on main (no receiver); PASS on #748 (receipt; replay deduplicated) | same | same |
| 2–4 Queue, rep, customer | PASS | PASS | PASS |
| 5 Quote | PASS only after term prices set by SQL (GAP-CAT-1) | PASS | PASS |
| 6–7 Send, accept | PASS (single-use link) | PASS | PASS |
| 8 Contract | PASS (3 concurrent converts → 1 contract) | PASS | PASS |
| 9 Invoice | PASS | PASS | **FAIL** — hardware never invoiced (GAP-HYB-1) |
| 10 Test payment | PASS (manual EFT, reconciled). PayFast BLOCKED (sandbox credentials, public notify URL) | PASS | PASS (monthly only) |
| 11–12 Reserve, serial | PASS, but no stock or serial-uniqueness checks | PASS | PASS |
| 13 Activation | PASS (manual, audited; provider IDs only in free text) | PASS | PASS |
| 14 Fulfilment | PASS | PASS | **FAIL** — no delivery raised |
| 15 Recurring billing | PASS, but 12-month term lost (GAP-TERM-1) | n/a | PASS |

**Verdict:** rental qualified end to end on synthetic data (with #748 for step 1); outright purchase qualified through delivery; **hardware + subscription NOT qualified**.

Audit-class gaps (not fixed; Architect / Mubaraq): **GAP-TEN-1** tenant B can reserve tenant A's radio (tenant-law breach); **GAP-ALLOC-1/2** same serial allocated or registered twice; **GAP-PAY-1/2** payment accepted on a DRAFT invoice, overpayment and concurrent duplicate payments accepted; **GAP-HYB-1** hybrid hardware never invoiced or delivered; **GAP-TERM-1** rental contract open-ended, minimum term lost; **GAP-EXP-1** expired quote still accepted. Others: GAP-STOCK-1, GAP-CUST-1 (duplicate customer), GAP-CAT-1, GAP-ACT-1, GAP-INC-1 (damage-incident API 500), GAP-OPS-1 (most operator steps need super_admin), GAP-ENV-1, GAP-WEB-1. Duplicate contract number returns 500 (DB blocks it); e-mail failure leaves the send "queued" silently (#728 scope).

Held: duplicate open enquiry 409; repeat/concurrent acceptance; bad quantities; closed ledger period; no-email customer; activation failure retryable; cancelled contract stops billing; rental return; 401/403; cross-tenant 404 on quote, contract, invoice, client.

Fixes on the branch (mutation-proven): **CV-1 — every 5xx alert in production logs the bearer access token and refresh cookie; now redacted. This is live in production today**; founder/architect to decide on Railway log retention and token exposure. CV-2 — illegal product lifecycle move 500 → 422.

Gate: pre-push `governance:push` RC=0 GREEN, counts matched. Live slice suite 30/30 (on demand; not in the gate). An earlier gate went red on an untouched `@leos/lar` b5a-leases test that passed on later runs — intermittent, not proven environmental; recorded, not dismissed.
