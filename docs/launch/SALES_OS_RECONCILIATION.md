# Sales OS reconciliation — Workstream C (2026-11-25)

Read-only investigation, plus screenshots. Nothing was merged, pushed, deployed or changed on
Railway. No credential was used against any environment. No branch was created: the sign-in port
is already carried by open PRs (section 7).

## 0. Facts measured today (cache-busted public endpoints, no auth)

| Surface | Endpoint | Result |
|---|---|---|
| Sales preview web | `sales-os-preview-web-preview.up.railway.app/api/build-info` | `lancesat-web`, env `preview`, **gitSha `5c55e3ff`** (= head of `preview/sales-ux-15nov`), built 2026-11-17 13:42Z |
| Sales preview API (through the preview's own gateway) | `…/api/preview-gateway/v1/system/version` | `lancesat-api`, env **`preview`**, gitSha `5c55e3ff`. **Not production.** |
| Production web | `app.lancesatsuppliers.co.za/api/build-info` | env `production`, gitSha `d5f78f64` (built 2026-11-16) |
| Production API | `api.lancesatsuppliers.co.za/api/system/version` | env `production`, gitSha `5efcb303` (= current `origin/main`) |
| Production `/sales/login` | — | **404**. Production has no Sales OS sign-in. `/` goes to the shared LEOS `/login` card. |
| 1GUARD staging | `web-staging-f99d.up.railway.app/login` | Photographic sign-in, glass card, Signal One + 1GUARD lockup |

## 1. Where the approved preview source lives

- **Repo:** `Signal-One-Intergrated-Systems/lancesat-enterprise-platform`, app `apps/web` (plus `apps/api` for the preview's API).
- **Branch:** `preview/sales-ux-15nov` @ `5c55e3ff` (2026-11-17). This is the exact SHA both preview services report.
- **What the branch is:** an integration line. It is 116 commits ahead of its merge-base with main, `80c6d417` (2026-10-16). Main is 20 commits ahead of that merge-base (EMAIL-AUTH-1, D10, D16, C1 v1, SEC-06, T5). None of those 20 touch the Sales shell, but SEC-06 changes auth. The branch contains, by ancestry or by merge:
  - #692, #694, #696, #697, #698, #699, #700, #702, #703, #714, #716, #718, #720, #724, #725, #726, #729, #731;
  - #733 (G1), merged in rebased form through `g1/on-preview-base` and then mapped onto the preview's own glass at `d0b4cae`.
  - It does **not** contain #701, #695 (closed), #676, #690, #691, #704, #727, #728 or #732.
- **Sign-in source on that branch:**
  - `apps/web/src/app/(auth)/sales/login/page.tsx` and `layout.tsx`;
  - `apps/web/src/styles/sales-os-login.css` (778 lines);
  - `apps/web/src/components/motion/SalesEntryTransition.tsx` (sliding glass doors on entry, reverse shutter on exit);
  - `apps/web/src/lib/auth/login-entry.ts` (the `NEXT_PUBLIC_SALES_OS_ENTRY` flag);
  - `apps/web/src/hooks/useAuth.ts` (entry and exit events, `login(…, {entry:"sales"})`);
  - the photo assets `apps/web/public/workspace/sales-os-*.jpg`.
- **Shell source on that branch:** `apps/web/src/components/sales-shell/*`, in particular:
  - `SalesGuardNavigation.tsx`, `salesNav.ts`, `SalesShellTopBar.tsx`;
  - `GuardViewMotion.tsx`, `guardMotion.ts`;
  - `SalesPillSearch.tsx`;
  - `SalesWorkCardRail.tsx`, `SalesDetailCardStack.tsx`, `SalesContactWorkbench.tsx`;
  - `SalesFunnelSilhouette.tsx`, `SalesFollowupsDetail.tsx`, `SalesNotificationPopover.tsx`.
  The styling is in `styles/sales-os-reference-theme.css` (+3,130 lines) and in the G1 block of `app/globals.css`.

### How the preview authenticates (from source)

- **The flow is the real LEOS one.** `/sales/login` calls the existing `useAuth().login({email,password},{entry:"sales"})`, which runs `POST /auth/login` → `mfaRequired` → `/mfa/challenge` → refresh cookie → `/auth/me`. There is no mock and no demo bypass.
- **Only reps get in through the Sales entry.** A non-`sales_representative` role is logged out at the entry with "This account does not have Sales OS access." This is a UX check only; the server still enforces.
- **The browser goes through a gateway.** It calls `/api/preview-gateway/v1/*` (`apps/web/src/app/api/preview-gateway/v1/[...path]/route.ts`), which forwards to `SALES_PREVIEW_UPSTREAM_API_URL`. The gateway:
  - returns 404 in a production deployment;
  - returns 404 unless `SALES_PREVIEW_GATEWAY_ENABLED=true`;
  - **refuses production hosts** with a 503 (owner directive 2026-11-12);
  - pins the Origin (`SALES_PREVIEW_ALLOWED_ORIGIN`);
  - caps non-auth traffic at 75 requests per minute;
  - rewrites the refresh cookie to SameSite=Lax on the preview host.
  It was measured today: the upstream reports `environment:"preview"` at the same SHA.
- **History risk.** The #692 body (9 Nov) says that the gateway was then "connected to production API. Authenticated writes alter live records". The hardening came on 12 Nov. Any authenticated use of the preview between 9 and 12 Nov reached production data.
- **Data.** The preview API's database is meant to be seeded by `apps/api/scripts/seed-preview-test.ts` ("Owner decision 16", synthetic tenant `preview-test-synthetic`, `@preview.example.test` users). I could not see from outside which database the preview API actually uses. Railway was not touched.

### 1GUARD reference

- The local `/home/user/signal-one-guard` checkout is `main` @ `f43e995`. **It does not contain the staging sign-in**: its `app/login/page.tsx` uses `Canvas`, with no photograph.
- Per `docs/architecture/sales-os/GUARD_EXPERIENCE_PARITY.md` on the preview branch, the Guard reference is branch `release/staging-2026-10-03-platform-management` @ `117879bf` (9 Nov ruling).
- Newer staging RCs exist: `release/staging-20261113-1guard-rc4` @ `ccceb460`.
- The photographic login asset (`apps/web/public/login/1guard-login-background.webp`) is also on `design/guard-photographic-depth-20261027`.
- Shell primitives in 1GUARD:
  - `apps/web/components/shell.tsx` (`AppShell`, `navFor`, `isWorkspaceRoute`);
  - `components/substrate.tsx` (`Canvas`, `WorkspacePlane`, `GlassPanel/Float/Modal`, `RoutePulse`, `Stagger`, skeletons);
  - `components/scene.tsx`;
  - `app/tokens.css` (`--sg-glass-*`, three tiers 10/16/22px);
  - `app/substrate.css`.
- 1GUARD was not modified.

## 2. Approved vs rejected / superseded (with evidence)

| Item | Classification | Evidence |
|---|---|---|
| Preview line `preview/sales-ux-15nov` @ `5c55e3ff` | **APPROVED visual starting point** (the founder named this URL). Its contents are still **unmerged drafts**; several are audit-class. | Build-info SHA match. #714 body: "Nothing here reaches the preview until the founder approves a promotion (architect ruling 15 Nov)". |
| #692 photographic full-height shell + sliding entry | **Approved direction, carried on the preview.** Not certified: its own body lists unverified items. | `GUARD_EXPERIENCE_LONG_MISSION.md`; #692 body |
| Module **receding foreground-card stacking** (earlier GXP) | **REJECTED / superseded, 9 Nov ruling:** "never raise prior modules as receding foreground cards"; horizontal directional views instead | `GUARD_EXPERIENCE_PARITY.md` "Latest ruling" |
| Record/action foreground cards (`SalesDetailCardStack`, `SceneHost`) | **Approved, kept** (origin-anchored record and action cards) | same ruling |
| #701 translate3d neighbour-card motion | **Superseded by #702** (grid-template-columns reflow, backing cards stay mounted). Not on the preview. | #702 body; ancestry |
| #695 | **Closed**, replaced by #696 | PR state |
| #676, #690, #691 (Oct / early Nov mobile workspace and layout experiments) | **Not on the preview line.** Treat as superseded experiments unless the founder says otherwise. | ancestry |
| Guard's cookie proxy (`/api/session`) | **Rejected for Sales.** Sales keeps LEOS token + refresh cookie. | `GUARD_EXPERIENCE_PARITY.md` |
| Copying Guard Tailwind 4 `@theme`/`@utility` | **Forbidden.** Port values, not syntax. | `GUARD_EXPERIENCE_LONG_MISSION.md` §II |
| Parallel/intercepting routes for record scenes | **Forbidden since S147** (a test fails if they return) | Charter §4 |
| "Not connected" muted line | **Rejected** (D1) | `A2-SPATIAL-WORKSPACE-PLAN.md:630` |
| Money on Quotes list / Pipeline rows | **Interim ruling 15 Nov:** print no amount until money cycle (c). #731/#732 (R9/R10) are audit-class drafts. | FOUNDER-2026-11-15 README |

**Needs the founder:** "independent card movement" is ambiguous. #701 moved cards independently with transforms. #702 replaced that with Guard's grid reflow, and that is the version on the approved preview. I classified #702 as the approved behaviour.

## 3. In-flight PR map (all OPEN drafts; none merged; author account `lancesatsuppliers-ux`, Claude sessions)

| PR | Branch | Scope | Base | Audit-class | On preview |
|---|---|---|---|---|---|
| #692 | design/sales-guard-experience-parity-20261109 | Photographic shell, sliding entry, floating nav, preview gateway | main@80c6d417 (116 commits) | gateway = auth-adjacent | yes |
| #694 | fix/sales-experience-foundation-20261109 | Directional modules, contextual cards, glass-shutter exit | | | yes |
| #696 | fix/sales-native-guard-workspaces-current-20261109 | Modules as independent glass workspaces | | | yes |
| #697 | fix/sales-login-daylight-premium-20261109 | Sales login daylight hero | | | yes |
| #698/#699 | | My Day: typography, equal cards, 3D funnel, foreground follow-ups | | | yes |
| #700 | | Approved glass, inline category search, contact workbench | | | yes |
| #702 | fix/sales-guard-grid-motion-20261111 | Grid reflow, preserved backing-card state | stacked | | yes |
| #703 | integration/sales-canonical-20261112 | Session 2, shell repair, SP-1..4 phone, `/clients/mine/:id` | main; **mergeable_state = dirty** | **yes** | yes |
| #714 | feat/sales-ux-15nov | SALES-UX-15NOV items 1–15, 17–30 (one nav, search, layers, phone) | #703 | no | yes |
| #716, #718, #720, #724 | | R2 deals/queue, R5 commission hidden, R1 manager role (mig. 0189 draft), item 30 429 | | **yes** | yes |
| #725 | feat/sales-training-gate | R4/R7/R8 training gate | | **yes** | yes |
| #726 | feat/client-activity-read | Item 18 client activity read | | **yes** | yes |
| #727 | docs/sales-manager-view-design | Manager view inside Sales OS, R11 rulings 16 Nov (docs only) | | — | no |
| #729 | feat/sales-role-correction | R6/R6b role change, privilege ceiling | | **yes** | yes |
| #731, #732 | | R9/R10 quote VAT and payable-now (money) | | **yes** | #731 yes |
| #733 | feat/sales-glass-material | G1: one glass material, three tiers, fallbacks | main@5efcb303, clean | no | yes (rebased + mapped) |

**Stream ownership.** All of these come from the same active Sales OS stream: Claude Code sessions `session_01B62tc57BvfeTtXYoa95B4G` and `…tc5viB68sKKVF3DNBxr`, under the founder and architect. The founder's 15–17 Nov rulings are recorded in the PR bodies and in issue #708. #733's body carries a merge-order note: whichever of G1 and the preview line reaches main second must map its glass onto the tiers.

## 4. Real Sales OS (main / production) — module inventory and APIs

Main and production share one rep shell, described below.

- **Sign-in.** The shared LEOS `/login` card (LEOS mark with a red "O", white). It serves every role. The MFA, forgot-password and reset pages use the same AuthShell card.
- **My Day.** `/my-day` is wrapped in `SalesCommandShell`, which has:
  - a full-width top bar;
  - a **vertical `FloatingModuleDock`** with five modules: communication, leads, pipeline, performance, more.
- **Other rep routes** still render the operator `Sidebar`/`TopBar` (the NAV-1 residual).
- **Phones** get a fixed bottom `RepMobileDock`.

| Route | Nav grant (nav-registry) | API calls (apps/web/src/lib/api) |
|---|---|---|
| `/my-day` | any of `crm.read`, `growth.generate` | GET `/my-day/today`, `/my-day/revenue-intel`; PUT `/my-day/target`; GET `/sales/stats/mine`, `/sales/targets/mine`, `/sales/next-actions/mine`, `/sales/revenue-intel/mine`; GET `/sales-os/workspace`; prospects queue; `/crm/leads/mine`; quotes |
| `/growth/prospects` (+ prospect detail) | any of `growth.read`, `growth.prospects.read` | GET `/growth/places/prospects/queue`, `/queue/reps`; outcome writes via prospect actions |
| `/crm/leads`, `/crm/leads/:id` | any of `crm.read`, `crm.own.read` | GET `/crm/leads`, `/crm/leads/mine`, `/crm/leads/:id`; POST `/crm/activities`, `/crm/call` |
| `/inbox` (Communication Centre) | `growth.generate` | GET `/crm/activities/inbox` (+ thread views) |
| `/sales/quotes`, `/sales/quotes/new`, `/sales/quotes/:id` | `quotes.list` / `quotes.create` | `/quotes` CRUD, `/line-items`, `/versions`, `/submit`, `/send`, `/approve`, `/reject`, `/revise`, `/delivery`, `/document`; `/products` |
| `/sales/clients`, `/sales/clients/:id` | `clients.own.read` | GET/POST `/clients/mine`, PATCH `/clients/mine/:id`; `/clients/:id/contacts`, `/notes`, `/statement` |
| `/sales/dashboard` (Revenue Intelligence) | `quotes.list` | `/sales/*/mine` |
| `/sales-packs` | `sales_packs.list` | POST `/documents`, `/documents/upload-url`, `/sales-packs` (+ reads) |
| `/sales/training` | `training.courses.list` | `/training/courses`, `/enrollments`, `/assessments`, `/results` |
| `/sales/attendance` | `attendance.read` | `/attendance`, `/attendance/clock-in`, `/clock-out` |
| `/sales/leave` | `leave.read` | `/leave/requests`, `/leave/balances`, approve/reject |
| `/sales/commissions` | `commission.list` (rep holds `commission.own.read`) | `/commission/records/:id` |
| Manager / ops sales routes: `/deal-flow`, `/sales/intake`, `/sales/operations`, `/sales/new-business`, `/growth/work-queue`, `/growth/assignment` | `crm.read` / `growth.read` | — |

**The `sales_representative` role on main has 42 permissions:**
- leads: `leads.read`, `leads.create`, `leads.update`, `leads.convert`, `leads.list`;
- `commerce.contact_requests.read`, `mine`;
- growth and CRM: `growth.prospects.read`, `growth.generate`, `crm.own.read`, `crm.call`;
- clients: `clients.own.read`, `clients.own.write`;
- My Day: `myday.read`, `myday.write`;
- AI: `ai.ask`, `ai.actions.request`;
- quotes: `quotes.list`, `quotes.read`, `quotes.create`, `quotes.update`, `quotes.submit`, `quotes.cancel`;
- `products.catalog.read`, `commission.own.read`, `sales.rep.read`;
- training: `training.courses.list`, `training.courses.read`, `training.enroll`, `training.assess`, `training.results.read`;
- attendance: `attendance.read`, `attendance.clock_in`, `attendance.clock_out`;
- leave: `leave.read`, `leave.request`;
- sales packs: `sales_packs.list`, `sales_packs.read`, `sales_packs.acknowledge`;
- `performance.own.read`, `notifications.read`, `notifications.preferences.update`.

`sales_manager` has 72 permissions.

**Defect on main** (`MANAGER_ROLE_RESOLUTION_DESIGN.md`): a stored `sales_manager` signs in as `sales_representative`. The fix is R1, #720, with migration 0189 still a draft.

The preview's seven primary destinations, in `salesNav.ts`, are: My Day, Communication, Prospects, Clients, Quotes, Pipeline, Performance. The secondary destinations are Revenue Intelligence, Sales Packs and Training. Attendance, leave and commissions are not in the Sales nav.

## 5. Parity matrix

| Feature | Approved source (preview line) | In real Sales OS (main/prod)? | In-flight PR | Remaining work |
|---|---|---|---|---|
| Sliding-door sign-in | `(auth)/sales/login/page.tsx`, `motion/SalesEntryTransition.tsx`, `sales-os-login.css`, `useAuth.ts` | **No** (prod `/sales/login` returns 404) | #692, #694 (exit shutter), #697, #714 | Land the preview line, or extract it. Decide the public Sales entry (domain or `/sales/login` with the `NEXT_PUBLIC_SALES_OS_ENTRY` flag). Restyle MFA, forgot and reset for Sales (**not in any PR**). Decide manager entry (preview refuses non-reps; #727). |
| Photographic full-height shell | `public/workspace/sales-os-office.jpg`, `sales-os-reference-theme.css`, `(dashboard)/layout.tsx` | No (dark gradient reference theme, no photo) | #692 | Merge; authenticated visual verification |
| Glass material (one material, three tiers, fallbacks) | `globals.css` `@g1-glass-material` + `d0b4cae` mapping | Partial (ad-hoc glass, literal blurs) | **#733 (G1)**, preview mapping | Architect review of #733; merge-order mapping |
| Horizontal module navigation (directional views) | `SalesGuardNavigation.tsx`, `salesNav.ts`, `GuardViewMotion.tsx`, `guardMotion.ts` | **No**: vertical `FloatingModuleDock`, 5 modules | #692, #694, #696, #714 (items 1/6/10/22) | Merge; retire the vertical dock only after pill parity (GXP M4) |
| Floating navigation (brand row + glass pill, all rep routes) | `SalesShellTopBar.tsx` + `SalesGuardNavigation.tsx` | **No**: full-width top bar on My Day; operator Sidebar elsewhere (NAV-1) | #692, #714 | Merge; check that non-rep roles stay byte-identical |
| Search pill | `SalesPillSearch.tsx` | No | #700, #714 (19/29) | Merge |
| Card geometry (3.2/5.4/3.6 rail, 16px radius, 40px action controls) | `SalesWorkCardRail.tsx`, reference theme | Partial (rail exists; old geometry) | #699, #702 | Merge |
| Independent card movement / responsive reflow | `guardMotion.ts` grid-template-columns reflow | No | #702 (supersedes #701); #714 items 7/10/13 | Founder to confirm #702 is what they meant |
| Foreground record cards | `SalesDetailCardStack.tsx`, `SceneHost` | Partial (SceneHost / layer-stack exist) | #692, #699, #714 item 8 | Merge |
| Contextual actions | `SalesContactWorkbench.tsx`, quote sticky bar | Partial | #700, #714 (items 17/24/25) | Merge |
| Focus management | Dialogs portal to shell root; `inert` on hidden faces; `mfa/challenge` focus | Partial | #714 item 11, #703 | Real-shell focus tests (the CLAUDE.md "real shell" rule) |
| State preservation | Mounted inactive module cache; backing cards stay mounted | Partial | #702; #690 (not on preview) | Decide #690 |
| Functional transitions | `SignalPulse` single pulse, `GuardViewMotion`, reduced-motion crossfades | Partial | #692, #694 | Merge |
| My Day: Next Client / Next prospect card | `SalesWorkCardRail.tsx` ("Next prospect", item 3 wording) | Partial (older cockpit) | #698, #699, #714 | Merge |
| My Day: Sales Funnel | `SalesFunnelSilhouette.tsx`, `SalesFunnelStageDetail.tsx`, `lib/opportunity-stages.ts` | Partial (`PipelineFunnelCard`, row funnel) | #698, #699, #714 item 4/27 | Merge |
| My Day: Commitment | `SalesWorkCardRail.tsx` (Commitment details), `SalesFollowupsDetail.tsx` | No | #699 | Merge |
| My Day: attention queue | `my-day/page.tsx` "Needs attention"; KPI strip (Prospects to contact, Open deals, Pipeline value, Overdue, Due today) | Partial | #703 SP-3, #716 (R2 rep-scoped lists, audit-class) | R2 audit; 3 cards were STOPPED pending rep-scoped lists |
| Rep-scoped data (deals, queue, client activity, commission hidden, training gate, 429 never signs out, role ceilings) | api + web | No | #716, #718, #720, #724, #725, #726, #729 (all **audit-class**) | Pre-merge audits, then the release plan (D19) |
| Public mark | Signal One / Sales OS (never LEOS on a tenant surface) | **No**: prod sign-in shows the LEOS mark with a red "O" | #692/#697 for Sales entry | Shared `/login` stays LEOS for operators |

### Top gaps (production vs approved)

1. There is no Sales OS sign-in in production at all, and reps see a white LEOS card.
2. No photographic shell or glass material.
3. Vertical dock instead of the horizontal floating pill. Operator sidebar on rep routes other than My Day.
4. The My Day composition (Next prospect, Funnel, Commitment, attention strip) is the older cockpit.
5. All of the rep-scoped data rulings of 15–17 Nov (R1–R11) are unmerged and audit-class.
6. Not covered by any PR:
   - Sales-styled MFA, forgot and reset pages;
   - the manager's entry into Sales OS (#727 is design only);
   - a decision on the public Sales domain.

## 6. Test-access requirements (to walk every authenticated module)

**Environment.** Use the existing Sales preview: web `sales-os-preview-web-preview.up.railway.app` and its API, environment `preview`, Railway project `scintillating-passion`. Do **not** use production (D20 builds into production for 1GUARD links only; it does not authorise Sales QA there). Before any session the founder (or an agent he authorises) confirms on Railway that:
- the preview API's `DATABASE_URL` is the TEST database, not production;
- `seed-preview-test.ts` has been run there.

I did not touch Railway, so neither point is verified.

**Accounts.** These are synthetic, from `seed-preview-test.ts` (tenant `preview-test-synthetic`, domain `preview.example.test`):

| Account | Stored role | RBAC role | Needed for |
|---|---|---|---|
| `rep@` | sales_representative | sales_representative (42 perms) | Every rep module: My Day, Communication, Prospects, Clients, Quotes, Pipeline, Performance, Packs, Training, Attendance, Leave |
| `rep2@` | sales_representative | sales_representative | Cross-rep isolation (rep must 404 on rep2's prospects, clients and quotes) |
| `manager@` | sales_team_manager (0189 draft, R1) | sales_manager (72 perms) | Manager entry and refusal at `/sales/login`, R2/R6 flows, approvals |
| `admin@` | admin | platform_admin | Role and user management (R6/R6b), training course publish (R4 gate), Sales Packs publish (item 20) |
| *(add)* one non-sales operator, e.g. `ops@` | operations_manager | operations_manager | Proves the Sales entry refuses non-reps and the LEOS shell stays byte-identical |
| *(add)* a second tenant with one rep | sales_representative | — | Tenant-isolation walk (cross-tenant gives 404) |

**Seed gaps.** The current seed has 4 clients, 5 prospects, activities, 1 product and 3 quotes. It needs, in addition:
- one published and one draft Sales Pack;
- one mandatory training course with an assessment (this drives the R4 gate);
- inbox and email activity rows for Communication;
- attendance and leave balances;
- an opportunity in each funnel stage.

All of it must keep `is_test_record` and the nothing-is-sent guarantee.

**Secure variables (names only):**
- seed: `PREVIEW_REP_PASSWORD`, `PREVIEW_MANAGER_PASSWORD`, `PREVIEW_ADMIN_PASSWORD` (each ≥16 characters, no default), plus `LANCESAT_ENV=staging`, `PREVIEW_SEED=1` and the TEST `DATABASE_URL`;
- preview web: `SALES_PREVIEW_GATEWAY_ENABLED`, `SALES_PREVIEW_UPSTREAM_API_URL`, `SALES_PREVIEW_ALLOWED_ORIGIN`, `NEXT_PUBLIC_SALES_OS_ENTRY`.

**How to provision without exposing secrets.** The session's network-credential mechanism injects headers. LEOS takes passwords in a JSON body (`POST /auth/login`), so header injection cannot sign in. Workable options:
- **(a) Preferred.** The founder runs a provided Playwright walkthrough on his own machine (or via Remote Control) with the passwords in his local environment. They never enter chat, git or this container.
- **(b)** The founder creates a session-scoped secret file outside the repo, read only by the walkthrough script, and rotates the three passwords after the session by re-running the seed with new values.

In either case, never reuse a real user's credential, and never paste one into chat.

## 7. Implementation status (task 4)

**I implemented nothing, and that was deliberate.** The sign-in shell port (photographic shell, glass card, Signal One / SALES OS lockup on the existing LEOS auth flow) is already carried by these open PRs: #692 (origin), #694 (exit shutter), #697 (daylight hero) and #714 (branch A). All of them are integrated on `preview/sales-ux-15nov`, which is the approved preview.

A new `claude/sales-os-approved-shell` branch would add the same files: `(auth)/sales/login/*`, `sales-os-login.css`, `SalesEntryTransition.tsx`, `login-entry.ts` and `useAuth.ts`. That would create add/add and `useAuth.ts` conflicts with an active stream that is still taking founder rulings. Changing `useAuth.ts` is also auth-adjacent (audit-class).

**Recommended instead (for the architect and that stream, not done here).** An "S-1 sign-in landing slice" PR off current main:
- carry the sign-in files byte-identical to `5c55e3ff`, so the preview line later merges as a no-op for them;
- keep `NEXT_PUBLIC_SALES_OS_ENTRY` off in production;
- rebase onto SEC-06;
- add Sales-styled MFA, forgot and reset pages;
- run the gate on four databases.

It ships under D19 (approved release plan).

Clone used: `/home/user/leos-salesos` (main @ 5efcb303, with fetched refs `origin/preview/sales-ux-15nov`, `origin/design/…`, `pr/*`). No local branch, no commits, no push.

## 8. Risks

1. **Merge debt.** The preview line is 116 commits on an Oct-16 base, and #703 is already `dirty` against main. About 12 audit-class PRs need ordered audits, plus a migration (0189) that is still a draft. Promoting "the preview" is a release programme, not a merge.
2. **G1 merge order** (#733 vs the preview line): the glass guard will refuse whichever lands second until its glass is mapped onto the tiers.
3. **Manager experience undefined.** The preview refuses managers at `/sales/login`, and main signs managers in as reps. #727 is design only.
4. **Preview data provenance.** The 9–12 Nov preview forwarded to the production API. Confirm that no QA writes reached production records in that window.
5. **Unverifiable without credentials:** every authenticated screen, the sliding-door entry and exit, module motion, focus, state preservation and My Day. The only things verified here are the unauthenticated sign-in pages at 1440 and 390, with no horizontal overflow at 390.
6. **Authority conflict.** The founder ruling D20 says there is no staging environment. The Sales preview is nevertheless a de facto non-production environment, in a separate Railway project. Its status, cost and data rules should be recorded in the decision register.
7. **1GUARD reference drift.** The local Guard checkout differs from staging. Pin a Guard SHA (`117879bf`, or the current rc4 `ccceb460`) for any pixel comparison.

## 9. Screenshots (`ws-c/`, Playwright Chromium, fresh contexts, DPR 1)

- `preview-sales-login-{1440,390}.png` — approved Sales OS sign-in
- `preview-root-{1440,390}.png` — the preview's `/` redirects to `/sales/login`
- `guard-staging-root-{1440,390}.png` — 1GUARD staging `/login` (master reference)
- `prod-root-{1440,390}.png` — production `/login` (LEOS card)
- `prod-sales-login-{1440,390}.png` — production `/sales/login` returns 404
