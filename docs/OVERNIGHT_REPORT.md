# Overnight hardening report

_Verdict is written at the end of the run; see the top of this file once the PR is open._

## W1: Permanent QA suite

**Status: done.** `npm run qa` (build, then Playwright, which starts the site on :3100, the site with a mock intake on :3101 and the mock on :4010). 103 tests, all passing, about 50s.

| Area | Tests |
|---|---|
| Routes | 14 routes: 200, exactly one h1, a title, a canonical that matches the route; sitemap and robots; unknown route 404; `/api/intake` validation and 503 |
| Redirects | 16 legacy redirects return 308 to the right target; `/api/marketplace` returns 404 |
| Forms | contact, Marketplace interest, equipment quote (radios, tracking, body cameras), client onboarding, guard join, sales application: the 503 path shows the mailto fallback with the right subject and no `intent` line; the mocked-upstream path shows the confirmation and the mock receives `kind`, `intent`, `source` and the bearer token |
| Analytics | all 14 events fire with the right name, through a `window.gtag` stub |
| Layout | no horizontal scroll at 390px on every route; the branding check on rendered HTML; no forbidden wording in rendered text |
| Accessibility | axe-core (WCAG 2 A and AA, best-practice) on every route at 390 and 1440: zero serious or critical violations |

Also added: `Dockerfile.qa` (Playwright 1.56.1 image; `npm run qa:docker`), a rewritten `README.md` (the create-next-app boilerplate is gone), `playwright.config.ts`, `tests/e2e/mock-intake.mjs`.

**Found and fixed by the suite**
- `/join/sales` had the homepage canonical (`/`). It now canonicalises to itself (it stays noindex and out of the sitemap).
- axe flagged colour contrast on the "ONE" in the lockup on the light headers of `/guards*` and `/join/sales` (`#0EA5E9` on a light surface, 2.6:1). The lockup's colours are fixed by `docs/BRAND.md`, so the header is now dark on every page (the lockup's dark tone), which is also what the standard intends. The guard and careers pages keep their light bodies.

**Skipped:** nothing. The Docker image was written but not built in this session (no Docker daemon available here); the suite itself was run locally against the production build.

## W2: Remaining pages to the new standard

**Status: done.** Screenshots at 390, 1440 and 1920 for every page are in `docs/qa/overnight/<route>-<width>.png` (plus `404-390.png` and `404-1440.png`).

- **Shared scale and hero.** New `PageHero` (text on solid dark, panel on the right) for pages without a photograph; `SplitHero` (photo full height on one side) where a photo earns its place. New `.t-hero` heading class. At 1600px and wider the display, hero, h1, h2, h3 and lead sizes step up and the hero text column widens (`--hero-col` 38rem to 46rem), so the split hero does not look small on large screens.
- **/solutions/security**: split hero with the large team photograph; the control-room SOS frame moved to the coverage section; the patrol photograph stays at 58% of the container.
- **/guard-marketplace**: `PageHero`; the "Where Marketplace is today" panel and the "MVP in development" label stay, and the illustrative synthetic flow keeps its "Illustrative demo · synthetic data" label.
- **/radios-equipment**: hardware-led. Hero lists the three categories; the catalogue is now large typographic product cards (type, model at 32 to 40px, what it is, "By quote"). No stock photos and no rendered devices.
- **/pricing**: same split layout and scale; the R2 figure and guard-day arithmetic are unchanged.
- **Legal pages** (`/privacy`, `/popia`, `/terms`; `/security-trust` shares the layout): two-column editorial layout with a sticky contents list, larger type, a top note "Under legal review." on privacy, POPIA and terms. **Wording is untouched.**
- **/contact, /get-started**: already on tokens, Inter and the new scale; no photograph earns its place on a form page.
- **404, error and global-error pages**: on brand (dark, `t-hero`, links to home, platform and contact; the error page offers retry and the sales email).
- No thumbnail-size photos remain anywhere (the smallest photo is 58% of the container).

**Skipped:** no real product photography exists yet for radios (waiting on Simon).

## W3: Speed

**Status: done, with two pages at the edge of the LCP target.** Lighthouse 13, local Chromium, mobile profile (default simulated throttling), production build. Scores are the median of three runs; the first run of each page before and after is saved in `docs/qa/lighthouse/` (trimmed to the headline metrics).

| Page | Perf before | Perf after | LCP before | LCP after (median) | CLS | TBT after |
|---|---|---|---|---|---|---|
| `/` | 96 | 98 | 2.74 s | 2.38 s | 0 | 32 ms |
| `/pricing` | 97 | 99 | 2.51 s | 1.96 s | 0 | 33 ms |
| `/guards` | 99 | 97 | 2.03 s | 2.58 s (runs 2.48 to 2.67) | 0 | 32 ms |
| `/radios-equipment` | 99 | 97 | 1.96 s | 2.50 s (runs 2.44 to 2.52) | 0 | 30 ms |

Targets: performance at least 90 (met on all four), CLS under 0.05 (met, 0), LCP under 2.5 s (met on `/` and `/pricing`; `/guards` and `/radios-equipment` sit at 2.5 to 2.6 s on simulated throttling, within run-to-run noise of the target but not clearly under it).

**What changed**
- `next/font` Inter now uses `display: "optional"`: the page never waits for or reflows to the web font (the metric-matched fallback shows if the font is not ready in 100 ms). This is what moved `/pricing` (LCP is the "R2" text) from 2.51 s to 1.96 s.
- Hero photograph: `fetchPriority="high"`, quality 70; photo bands and `Photo` at quality 75. `images.qualities` is now `[70, 75, 90]` (it was `[75, 90, 92, 94]`, which also silently rounded the requested 85 up to 90). Product screenshots stay at 90.

**Where it stopped.** Measured (non-simulated) LCP sub-parts are tiny (first byte 14 ms, resource load 12 to 27 ms, render delay 80 ms), and the remaining 1.8 s between FCP and LCP in the simulation comes from simulated 4G transfer of the render-blocking CSS, the 70 KB React runtime chunk, the 48 KB font and the hero image together. Further gains need a smaller framework payload (not available without dropping Next features) or a smaller hero image, which would cost visible quality. Left as is.

## W4: Search and sharing

**Status: done.**

- **Metadata review.** Every route has a unique title (at most 70 characters including the suffix) and a unique description of 115 to 215 characters, written for the security-software intent (guard management, patrols, attendance, PTT radio rental, R2 per guard per day, Marketplace "in development"). The title template is now `%s | Signal One` (the old suffix used 33 characters). Enforced by `tests/e2e/seo.spec.ts`.
- **Open Graph images.** `app/lib/og.tsx` renders a 1200×630 PNG with the dark lockup (the canonical mark and wordmark from `docs/BRAND.md`) and the page title, generated at build with `next/og` (an `opengraph-image.tsx` per route; the home page and all 15 indexable routes). Inter Bold and SemiBold TTFs (OFL) are bundled in `app/lib/fonts/` because `next/og` cannot read woff2. Previews: `docs/qa/og/`. The root layout no longer pins the old static `/og-image.jpg` (still in `public/` as a fallback).
- **JSON-LD** (root layout): `Organization` ("Signal One: Integrated Systems", `sales@signalone.co.za`, logo, contact point) and `SoftwareApplication` "Signal One Guard" with an `Offer` carrying a `UnitPriceSpecification` of 2.00 ZAR per guard per day, VAT not included, minimum 10 guard days. No ratings and no reviews (tested).
- **Three landing pages**, built only from capabilities that exist, linked from the footer and in the sitemap, each with an OG image: `/guard-patrol-software`, `/guard-attendance-software`, `/ptt-radio-rental`. Product evidence is the real proof-of-service record screenshot (synthetic data). Each page states what it does not do yet (client live patrol progress is coming soon; Payroll is coming soon; PSiRA details are recorded, not verified; renting a radio does not yet connect it to Signal One Guard). The PTT page uses the rental catalogue (now shared in `app/lib/catalogue.ts`) and no pictures of devices.
- **Canonical host.** Still driven by `NEXT_PUBLIC_SITE_URL`. New `proxy.ts` (the Next 16 name for middleware): when `CANONICAL_REDIRECT=1` it sends any `*.railway.app` host to the canonical origin with a 308 (path and query kept); off by default. Both states are tested (a third server on :3102).

**Suite:** 135 tests, stable over four consecutive full runs. Two form helpers were hardened (wait for React hydration; retry a click on a controlled radio that can lag a frame under load).

**Skipped:** nothing. Note for Simon: the first deploy that sets `CANONICAL_REDIRECT=1` should wait until DNS for the canonical domain is live, otherwise the Railway host will redirect to a domain that does not resolve yet.

## W5: Copy and truth sweep

**Status: done.** Every rendered page (17 routes, about 6,400 words) was read in full from the production build. Legal wording on `/privacy`, `/popia`, `/terms` and `/security-trust` was not changed.

**Changes**
1. **Present-tense Marketplace promises removed** (Marketplace is in development):
   - Home, "Hire": "Find guards near the site…" and "The guard accepts or declines… accepted guards join your workforce" now read "When it launches, you will be able to find… the guard will accept or decline… will join"; "Five filters, nothing else" is now "Planned: five filters, nothing else"; "Profiles stay inside… Nothing is published publicly" is now "will stay… will be published".
   - `/guard-marketplace`: hero lead now "When it launches, you will be able to…"; "The hiring workflow" is now "The planned hiring workflow"; the "Private by design" list uses "will" for profile visibility, guard choice, PSiRA display and "no ratings, readiness scores or badges"; "Marketplace extends" is now "will extend".
2. **Inconsistent status label:** `/guards` labelled the planned Marketplace "Coming soon"; it is now "MVP in development" like every other page. Status vocabulary across the site is now exactly: Live, Beta (Accounting), MVP in development (Marketplace), Coming soon (Payroll, equipment-to-platform controls, client live map and patrol progress), By quote.
3. **Pricing:** "10,000" is now "10 000" (en-ZA thousands separator, matching the worked-examples table); "36 month terms" is now "36-month terms".
4. **PTT radio page:** removed a duplicated sentence in the hero lead.
5. **en-ZA spelling:** searched all rendered text for US spellings (organize, color, center, program, license, analyze, prioritize, behavior, favor, catalog, honor): none found; "authorised", "organisation" style is used throughout.
6. **Duplicated claims:** the client-portal, clock-in and PSiRA statements repeat across home, platform, patrol and attendance pages with identical wording on purpose (one source of truth per claim); no conflicting versions were found.

**Numbers on the site that are not derived from R2 or the 10 guard-day minimum** (all left in place; listed so Simon can confirm them):
- 15% VAT in the calculator line "(R1 380 incl. 15% VAT)": South African standard rate; the price itself stays excl. VAT.
- Radio rental terms 12, 24 and 36 months: from the equipment catalogue.
- Journey time estimates: "about 5 minutes" (guard profile), "about three minutes" (company onboarding), "about eight minutes" (sales application), "about two minutes" (equipment quote). These are estimates, not measurements.
- Step and filter counts: ten Marketplace steps, five filters, seven application steps, nine guard-profile steps.
- Inside the clearly labelled synthetic Marketplace preview only: "Within 25 km of Midrand", "2+ years", and the sample guards' years of experience.
- Worked examples (10, 50 and 200 guards) are plain arithmetic: guards × days × R2, checked.

**Not changed, flagged:** the home hero caption and every photograph still say "Illustrative scene · fictional security company" (all photography is AI-generated).
