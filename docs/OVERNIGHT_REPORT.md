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
