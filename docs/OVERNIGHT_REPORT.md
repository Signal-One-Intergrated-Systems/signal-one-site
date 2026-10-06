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
