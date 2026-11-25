# Execution ledger — Signal One commercial launch mandate

Machine-readable state: `execution-state.json`. Newest entry first.

## Founder decisions (2026-11-25, response to the first checkpoint)

| Decision | Applied |
|---|---|
| `1GUARD` is the authoritative product brand. Technical identifiers (package `com.signalone.guard`, slug, scheme) are not renamed for marketing consistency. | All public copy, metadata, schema.org and alt/aria text on the website now say 1GUARD; tests updated; a regression check forbids "Signal One Guard/Security" on rendered pages. The mobile app's display name (`apps/guard-mobile/app.json` → "Signal One Guard") is a 1GUARD-repo decision to take before store publication; no store listing exists yet. |
| Radio equipment and rental move above 1Service on the homepage. | Done; hero untouched. |
| Quotation-based radio commerce until supplier, stock, prices and terms are confirmed; terms must be configurable in LEOS, not hard-coded. | No prices/terms invented. |
| HyTalk vs POCSTARS stays open and must not block other work. | Not blocking. |
| Use only verified company facts; build About and Support from existing channels. | `/about`, `/support` built from the internal platform record: trading entity Lancesat Suppliers (Pty) Ltd and the founder's WhatsApp Business client channel. |
| No direct production merges; prepare draft PRs as release candidates. | Branches + draft PRs only. |
| LEOS website-intake receiver is P0. | Workstream B (isolated LEOS branch). |

## 2026-11-25 — Session 1, checkpoint 2 (after founder response)

Workstreams (cloud, parallel, isolated working copies):
- **A — website (this branch).** 1GUARD naming; radios above 1Service; `/about`, `/support`; WhatsApp + trading entity; UTM/gclid attribution end-to-end to the intake contract; GA4/Ads conversion only on receipt; LCP trace and fixes (4.29 → 3.16 s lab); visible form validation (VA-06); footer band de-duplicated (VA-04). Evidence: `evidence/after-*`, `evidence/hero-q90-vs-q75.jpg`, `evidence/brand-audit/`.
- **A2 — visual brand audit + image inventory** (independent agent, live site): `BRAND_AUDIT.md` (27 findings, token consolidation plan), `IMAGE_INVENTORY.md` (41 placements).
- **B — LEOS website-intake receiver** (isolated LEOS branch `claude/website-intake-receiver`): see its PR when published; status recorded in `RELEASE_GATE.md`.
- **C — Sales OS recovery**: `SALES_OS_RECONCILIATION.md`. Approved preview = LEOS branch `preview/sales-ux-15nov` @ `5c55e3ff` (116 commits on main, mostly audit-class drafts of the active Sales OS stream). Nothing implemented: a parallel port would conflict with that stream. Exact test-access request recorded.
- **D — research from primary sources**: `RESEARCH.md` (68 findings → requirements, R-IDs mapped to DR/Q IDs; source register).

Environment: research hosts, benchmark sites, `api.lancesatsuppliers.co.za` and `raw.githubusercontent.com` added to the network allowlist (founder-approved prompt). Motorola Solutions (403) and www.pocstars.com (wrong TLS certificate) remain unreachable.

Mistakes made and caught this checkpoint (disclosed): (1) stale `next-server` processes survived `pkill -f "next start"` and served old HTML after a rebuild, producing false page crashes and a false 540 ms LCP — measurements discarded and repeated; (2) the About page first hard-coded "Pilot" instead of `lib/guardStatus.ts`; (3) the equipment rewrite removed a link a journey test relied on; (4) a q75 hero encode tripped the FOUNDERS LOCK test and was reverted to a founder decision; (5) the VA-11 card span upscaled a product photo and was reverted. Each was found by the test suite or by looking at the screenshots, before commit.

## 2026-11-25 — Session 1 (Claude Code cloud, branch `claude/peaceful-johnson-azma60`)

### Phase 0 — capability
- Chromium + Playwright work in the cloud container. The environment's network allowlist was extended (founder-approved prompt) with `signalone.co.za`, `www.signalone.co.za`, `app.lancesatsuppliers.co.za`, `sales-os-preview-web-preview.up.railway.app`. `api.lancesatsuppliers.co.za` is still blocked (the real Sales OS login can't load branding); not requested because no credentials exist for behind-login review.
- `lancesat-enterprise-platform` attached read-only (shallow clone @ `5efcb30`).
- Live-form submission is refused by the session's permission policy. Submit behaviour was established from source and `/api/intake/status`.

### Phase 1 — independent walkthrough (before reading source)
- 10 persona journeys on the live site → `CUSTOMER_JOURNEYS.md`. Headline: **no journey can complete on the website** — every form hands off to the visitor's email app (DR-001).
- Internal logins seen unauthenticated: real Sales OS still shows the old white LEOS card (DR-021).

### Phase 3 — inventory and sweep
- 19 live routes + 5 probes × 8 widths, axe at 1440/390 → `ROUTE_INVENTORY.md`. 0 overflow, 0 broken images, 0 axe violations (automated). Homepage lab LCP 4.4 s.

### Phase 4 — reconciliation (partial)
- Site intake route is complete and safe; production lacks `SIGNAL_ONE_INTAKE_URL`; **LEOS has no receiver** → DR-001 BLOCKED on LEOS engineering + Railway variables.
- Approved decisions read: brand architecture (30 Oct), founder UX corrections (12 Nov: items 1 and 5 still live), commercial release gates. Open draft PRs noted to avoid conflicts: site #96, #97, #98; LEOS #728 (Mubaraq), #731/#732 (quote money), #733 (Sales OS glass).
- Conflicting approvals found: product name `1GUARD` (architecture) vs "Signal One Guard" (tests, schema.org, app downloads) → DR-008 escalated.

### Phase 7/8 — first remediation (branch only, not deployed)
| Change | Defect | Files |
|---|---|---|
| Nav names "Radios & equipment" (2nd slot) → `/radios-equipment`; current on all equipment routes | DR-002 | `app/components/Header.tsx` |
| Journey-aware closing CTA (radios → quote, guards → profile, careers → apply, none on contact/get-started) | DR-004 | `app/components/FooterCta.tsx`, `Footer.tsx` |
| `PageHero` top-aligned, sticky copy: headline + CTA in first viewport on 5 pages | DR-005 | `app/components/ui.tsx` |
| Equipment kicker no longer "1GUARD" | DR-009 | `equipment-marketplace/page.tsx` |
| Duplicate "Signal One" in titles | DR-010 | `equipment-marketplace`, `get-started` |
| Sage band behind nav → hero navy; photo untouched | DR-013 | `app/home-conversion.css` |
| Disclosure caption inside container | DR-014 | `app/(marketing)/page.tsx` |
| Rental page no longer lists the radios twice | DR-015 | `ptt-radio-rental/page.tsx` |

Verification: `npm run build` (branding + design checks pass); before/after captures in `evidence/cmp-*.jpg`; nav fits at 1280/1440 with no overflow.

**E2E suite (467 tests, `PW_CHROMIUM=/opt/pw-browsers/chromium`) on the fix branch: 385 passed, 78 skipped, 4 failed.**

| Failing test | Cause | Caused by this branch? |
|---|---|---|
| `layout.spec.ts` image OCR gate | `tesseract` missing in the container. After `apt-get install tesseract-ocr` the gate passes. | No (environment) |
| `visual-corrections.spec.ts` product quote links scroll (375, 1440) | First run: my footer CTA shared the accessible name "Request a quote" with the hero button (a real ambiguity), fixed by giving it a distinct label. Re-run: both widths time out in the test's `hydrated()` wait (line 88). **The same timeout reproduces on unmodified `main` @ `8e89d24` in this container.** | No (pre-existing in this environment; needs investigation) |
| `visual-mission.spec.ts` `/security-trust` @ 768 | React #418 hydration error: KI-1 (intermittent, documented in `docs/KNOWN_ISSUES.md`). Passed on re-run. | No |

### Not done this session (and why)
- Phases 2 (external research write-up), 5 (design constitution), 6 and 10–16 — not started; Phase 6/11 are blocked on DR-001's LEOS receiver and on commercial decisions.
- No production deployment (requires founder approval; merging `main` deploys).

## Owners of open blockers

| Blocker | Owner | Action |
|---|---|---|
| DR-001 website intake receiver in LEOS | LEOS engineering (Mubaraq) | Implement contract v1 from `SITE_INTEGRATION.md`; issue a scoped service token. |
| DR-001 production variables | Founder | Set `SIGNAL_ONE_INTAKE_URL` and `SIGNAL_ONE_INTAKE_TOKEN` on the Railway website service once the receiver passes. |
| DR-007, DR-011, DR-012 company facts | Founder | Phone/WhatsApp, address, registration and VAT numbers, support channel, About content. |
| DR-008 product naming | Founder | Decide: "1GUARD" everywhere, or "Signal One Guard" as app name only. |
| DR-016, criterion 19 connectivity terms | Founder + supplier | HyTalk annual vs hardware + POCSTARS monthly; P30 ↔ POCSTARS compatibility confirmed in writing. |
| DR-006 specifications | Founder / procurement | Supply manufacturer datasheets for PNC360S, P30 Lite, E600 (and E600's manufacturer). |
| Release criterion 2 | Founder | Non-production test logins for Sales OS preview and real Sales OS. |
| Criterion 22 analytics | Founder | Real GA4 measurement ID and Google Ads conversion IDs. |
