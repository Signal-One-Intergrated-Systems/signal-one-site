# Sales OS production release plan (consolidation, 2026-11-27)

Owner of every production step: **the founder**. Nothing in this plan has been executed. No merge,
deploy, Railway change or production write was made while it was prepared. The Sales OS work is
**AUDIT-CLASS** (it changes client-side auth entry, role-to-shell routing and what is offered to
which role) and stops for the pre-merge audit.

Status of the inputs is recorded at the time of writing (2026-11-27, ~17:00Z). Re-observe before
acting: the authority order is production runtime > repository > this document.

## 0. What is being released

| Piece | Branch @ head | Base | What it is | PR |
|---|---|---|---|---|
| **S1 — Sales OS shell (main-based)** | `claude/sales-os-consolidation` @ `<A_HEAD>` | `main` @ `151936f4` | #750 (approved presentation layer: Sales sign-in, glass shutter, floating horizontal navigation, My Day, G1 glass) + the server-decided Sales OS registry (`GET /api/v1/sales-os/shell`) + manager audience + Team Day + KPI links. **No migration.** No dependency on the r2 chain. | `<PR_A>` (draft) |
| **S2 — queue integrations** | `claude/sales-os-consolidation-queues` @ `<B_HEAD>` | S1 + `claude/partner-applications-queue` @ `3fc95e4e` (#759, which carries #758 → #756 r2 → #749/#751/#752/#754/#755/#757) | The manager's Enquiries and Partner applications destinations and Team Day sections, each capability-gated. **No migration of its own** (it carries r2's 0190–0204 through #759). | `<PR_B>` (draft) |

Not released by this plan and still blocked: **#720** (sales manager role separation, migration
`0189` draft) — see §6.

## 1. Earliest safe release points

| What | Earliest safe point | Why |
|---|---|---|
| **S1 shell, on its own** | As soon as S1 passes its pre-merge audit and the founder approves. It does not wait for r2. | S1 is main + #750 + shell work; no migration; the new API route is read-only and grants nothing. The enquiry and partner entries do not exist in S1's registry, so S1 can never link to a queue that is not deployed. |
| **Rep experience in production** | Same deploy as S1. | Reps already get the Sales shell on main's web when it is redeployed; S1 replaces the navigation source with the server's answer (same entries, same order, locked by test). |
| **Manager experience (commercial_director)** | Same deploy as S1. | `commercial_director` is a reachable role today. Team Day shows quotes awaiting approval, pipeline by stage, drafts/approved/expired. |
| **Manager experience for a stored `sales_manager`** | Only after #720 (or its successor) is audited, renumbered and released. | Today a stored `sales_manager` reads back as `sales_representative` (`user_role_storage.ts`) and gets the REP shell. S1 does not remap anyone. |
| **Enquiry queue on Team Day** | After r2 (#756) is released **and** S2 is merged. | The capability `website_queue` is registered only where the API mounts `/crm/website-queue`, which arrives with #756. |
| **Partner applications on Team Day** | After #758 + #759 are released **and** S2 is merged. | Capability `partner_programme` arrives with #759 (migration 0204). |

## 2. Release sequence

The r2 chain's own sequence (A–K in `LAUNCH_R1_INTEGRATION.md` §3) is unchanged. Sales OS slots in
as follows.

1. **Audit S1** (pre-merge, audit-class). Scope: `GET /sales-os/shell` (read-only, signed role
   only, tenant required), the registry (`packages/rbac/src/sales_os_workspace.ts`), the Sales entry
   change in `useAuth.ts` (manager audience admitted at `/sales/login`, every other role refused and
   its session revoked), layout chrome per audience/route, and the removal of the preview seed.
2. **Founder approves S1** (written).
3. **Merge S1 to main** (merge commit, not squash, so the ancestry of #750 stays readable).
   Main auto-deploys BOTH services.
4. **Validate** (§4). If anything fails: rollback (§5).
5. **Independently**, the r2 chain proceeds on its own audits: #756 (r2, AUD-R2 PASS WITH
   CONDITIONS: Architect to rule 0190–0194 and 0197–0203; AUD-01/02, AUD-15, AUD-21 and
   AUDL2-03..06 open; R2-01/R2-02 control gaps tracked) → #758 (contract v1.3 partner intents) →
   #759 (partner applications queue, migration 0204, class A).
6. **After #759 is on main**: rebase-free update of S2 — merge `main` into
   `claude/sales-os-consolidation-queues` (its only delta is then the integration commit), run the
   gate, re-audit the integration commit only, founder approves, merge.
7. **Validate** again (§4, including the queue checks).

If the founder prefers one release, S2 can go instead of S1 after step 5 — S2 contains S1.

## 3. Configuration

| Setting | Service | Value | Note |
|---|---|---|---|
| `NEXT_PUBLIC_SALES_OS_ENTRY` | web (build-time) | **unset** (keep) | Unset = `/` and `/login` keep the shared LEOS card; `/sales/login` exists as the Sales entry for reps and managers. Setting it to `true` sends EVERY sign-in through the Sales entry, which refuses non-sales roles — only for a dedicated Sales domain. Founder decision. |
| `SALES_OS_FEATURES` | api | **unset** | Comma list of feature gates (`feature:<name>`) for future Sales OS modules. Nothing uses it yet; unset = no feature module offered. |
| `SALES_OS_SPATIAL_WORKSPACE_ENABLED` | api | unchanged | Existing kill switch (SOS-A2-0), not touched. |
| `NEXT_PUBLIC_ENQUIRY_ATTENTION_MINUTES` | web | unchanged (default 120) | From #754. |
| Preview-only variables (`SALES_PREVIEW_GATEWAY_ENABLED`, `SALES_PREVIEW_UPSTREAM_API_URL`, `SALES_PREVIEW_ALLOWED_ORIGIN`, `PREVIEW_SEED`, `PREVIEW_*_PASSWORD`, `SALES_PREVIEW_SKIP_TYPES`) | — | **must not exist on production services** | None is read by S1/S2 code (the gateway route and the preview seed are not carried). Check the production services' variable lists before the release and remove any that exist. |

No new secret is needed. No migration runs for S1. S2 runs none of its own.

## 4. Validation procedure (after each merge)

Per CLAUDE.md, the cycle is not complete until **both** services report the merge SHA.

1. Note the merge SHA `M` (`git rev-parse origin/main`).
2. Poll, cache-busted, until both match (or use `scripts/deploy-governance-poll.mjs`):
   - web: `curl -s "https://app.lancesatsuppliers.co.za/api/build-info?cb=$(date +%s)"` → top-level `gitSha` = `M`;
   - api: `curl -s "https://api.lancesatsuppliers.co.za/api/system/version?cb=$(date +%s)"` → `data.gitSha` = `M`.
   - **Measured 2026-11-27 16:14Z: web `d5f78f64` (built 16 Nov), api `151936f4`.** The web
     service has not taken a deploy since 16 Nov; confirm the web service actually builds on the
     merge, or the Sales OS web changes are not live even when the api is.
3. Api deploy log shows `[MIGRATE_COMPLETE]` (S1: no new migration; S2 after r2: 0190–0204 per r2's plan).
4. Browser (founder, real accounts, no test data written to production):
   - a rep signs in at `/sales/login` → My Day; the floating navigation shows My Day, Communication,
     Prospects, Clients, Quotes, Pipeline, Performance (+ More: Revenue Intelligence, Sales Packs,
     Training); Prospects to contact / Open deals / Pipeline value / Overdue / Due today each open
     their records; sign-out plays the shutter and `/my-day` is then unreachable;
   - the commercial director signs in at `/sales/login` → Team Day (no vertical navigation); the
     approval / draft / approved / expired cards open the quotes list on that tab; "LEOS console"
     in More returns to `/dashboard` with the operator sidebar; at `/login` the same account lands
     on `/dashboard` and the sidebar's Sales section has "Sales OS";
   - a platform admin at `/sales/login` is refused ("This account does not have Sales OS access.");
     at `/login` keeps the operator console; `/sales/quotes` shows the operator shell;
   - `GET /api/v1/sales-os/shell` (from the browser's network tab) answers `audience`/`modules`
     per role; a 4xx/5xx there means the shell offers only its home (fail-closed) — investigate.
   - After S2: Team Day shows "Enquiries to allocate", "Past response target", "Partner
     applications"; an enquiry row opens that enquiry on the queue page; workload lists the reps.
5. Record the result in the launch register with the SHA and the screenshots.

## 5. Rollback

- **S1**: redeploy the previous web and api SHAs (or revert the merge commit on main and let it
  deploy). No migration, no data written by S1 code, so a code rollback restores the previous
  state completely. Expected effect of rollback: the rep shell reverts to #750-less main (no Sales
  entry, operator-style rep navigation); managers lose Team Day.
- **S2**: revert the integration merge; the queues remain reachable from the operator sidebar
  exactly as #756/#759 shipped them. Migrations 0190–0204 belong to r2 and follow r2's rollback
  rules (class A empty-only reversals 0194→0190; 0203 is effectively forward-only once a
  notification row exists — AUD-R2 R2-03).
- A partial deploy (one service on `M`, the other not) is a failed release: roll forward the lagging
  service or roll both back; do not leave them split.

## 6. #720 (sales manager role separation) — not in this release

Blocked, and `sales_manager` behaviour is unchanged:
- its architect design audit has not happened (no review on the PR);
- its migration number **0189 collides** with Mubaraq's reserved 0188/0189 (#728) and must be
  renumbered by the Architect (`NUMBER_RESERVATIONS.md` row is the Architect's to write);
- it is based on `integration/sales-canonical-20261112`, not main, and #729 (R6) is stacked on it;
- real role assignments wait for the founder's list of managers.
When it lands, no Sales OS code change is needed: `sales_manager` is already in the manager
audience, so a correctly signed manager gets Team Day; until then a stored `sales_manager` gets the
rep shell (measured locally, see the PR).

## 7. Registry: how a future module is added (no rewrite)

Hardware catalogue, dealer inventory, wholesale purchasing, communications licences, subscriptions
and independent sales partners are NOT implemented. Each registers in the change that ships it:
1. permissions in `packages/rbac` (`permissions.ts`, `matrix.ts`) — audit-class;
2. its API router mounted and its capability registered at the mount
   (`salesOsCapabilities.register("<capability>")` in `apps/api/src/routes/index.ts`), or a feature
   gate (`SALES_OS_FEATURES=<name>` registers `feature:<name>`);
3. one row in `SALES_OS_MODULES` (`packages/rbac/src/sales_os_workspace.ts`): key, label, href (a
   page in the same change), audiences, permissions, capability, placement, order;
4. if it serves a new audience (e.g. `dealer`, `sales_partner`), add the audience and its roles to
   `SALES_OS_AUDIENCE_ROLES` and its home to `SALES_OS_AUDIENCE_HOME` — one role, one audience, no
   remapping of an existing role;
5. if it belongs on Team Day, one `TeamDaySection` keyed to its module in
   `apps/web/src/components/sales-team/teamDaySections.ts`.
The API answers `GET /sales-os/shell` with the rows that pass audience ∧ permission ∧ capability
for the signed role; the web renders only that answer (fail-closed). A row whose capability is not
registered is never offered, so no build ships a dead link or placeholder.

## 8. Preview retirement checklist (execute ONLY after production acceptance of S1)

Do not touch Railway before the founder has accepted S1 in production (§4 step 4 signed off).

Inventory (from `SALES_OS_RECONCILIATION.md` §0/§1 and the preview branch; confirm in Railway):
- [ ] **preview web** — `sales-os-preview-web-preview.up.railway.app` (serves `5c55e3ff`, env `preview`);
- [ ] **test API** — the preview's API service (env `preview`, reached through
      `/api/preview-gateway/v1/*`);
- [ ] **seed service / job** — whatever ran `apps/api/scripts/seed-preview-test.ts` (Owner decision 16);
- [ ] **Postgres** — the preview/test database (synthetic tenant `preview-test-synthetic`,
      `@preview.example.test` users);
- [ ] **Redis** — the preview/test Redis.

Before deleting anything:
- [ ] Confirm production web and api both serve the accepted SHA (§4).
- [ ] Confirm no production variable points at a preview host (`*preview*.up.railway.app`, the
      preview DB/Redis URLs): list variables of the production `lancesat-enterprise-platform` (api)
      and web services.
- [ ] Confirm no GitHub workflow, Railway cron, webhook or service reference targets the preview
      services or the `preview/sales-ux-15nov` branch (GitHub Actions is not in use, per CLAUDE.md;
      check Railway service source branches and webhooks).
- [ ] Confirm the preview database holds no exclusive data: it should contain only the synthetic
      tenant(s). **History risk (reconciliation §1):** between 9 and 12 Nov the gateway reached
      the PRODUCTION API, so any authenticated preview use then wrote to production data, not to
      the preview DB — check production for records created through the preview in that window
      before closing the matter; nothing in the preview DB needs keeping.
- [ ] Export the preview DB schema + row counts per table to the launch evidence folder (a record,
      not a backup).
- [ ] Rotate any credential that was ever shared between preview and production (JWT/refresh/cookie
      secrets, SMTP, API keys) if the preview services used copies of production values.

Retire, in this order:
1. [ ] preview web (removes the public entry point first);
2. [ ] test API;
3. [ ] seed service/job;
4. [ ] Redis;
5. [ ] Postgres (after the export above);
6. [ ] archive branch `preview/sales-ux-15nov` @ `5c55e3ff` as a tag (`archive/preview-sales-ux-15nov`)
       rather than deleting it; it is the approved visual reference.
- [ ] Record what was removed, when, by whom, in the launch register.
