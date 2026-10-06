# Signal One public website

The public site for **Signal One: Integrated Systems**: Signal One Security (guard management software for South African security companies), radios and tracking by quote, Guard Marketplace (in development) and the guard and careers journeys. Next.js 16 (App Router), React 19, Tailwind v4, TypeScript. It holds no customer, guard or applicant data; see `SITE_INTEGRATION.md` for what it needs from the platform.

## Run it

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # runs the branding check before and after the build
npm run start
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical host (default `https://signalone.co.za`) |
| `NEXT_PUBLIC_GA_ID` | Enables gtag; events are listed in `app/lib/analytics.ts` |
| `SIGNAL_ONE_INTAKE_URL`, `SIGNAL_ONE_INTAKE_TOKEN` | Where `/api/intake` forwards form submissions. Unset: forms show an email fallback |
| `SALES_RECRUITMENT_STATUS`, `SALES_OPEN_ROLES`, `SALES_OS_URL` | Careers page state |
| `CANONICAL_REDIRECT=1` | Redirect the railway.app host to the canonical domain (off by default) |

## Checks

```bash
npm run check:branding   # public-truth gate on source (and, after a build, rendered HTML)
npx tsc --noEmit
npm run lint
npm run qa               # build, start the site and a mock intake, run the Playwright suite
```

The suite is in `tests/e2e/` and covers: every route (200, one h1, title, canonical), the legacy 308 redirects, the 503 mailto fallback and the mocked-success path for every form, the 14 analytics events (with a `window.gtag` stub), no horizontal scroll at 390px, the branding check on rendered HTML, and axe-core on every route at 390 and 1440 (no serious or critical violations).

`npm run qa` expects a Chromium. Locally, Playwright uses its own browser; to use a specific binary set `PW_CHROMIUM=/path/to/chrome`. To run everything in a clean container:

```bash
npm run qa:docker        # builds Dockerfile.qa and runs the suite
```

The suite starts three processes on its own: the site on :3100 (no intake upstream), the site on :3101 pointed at a mock intake, and the mock on :4010 (`tests/e2e/mock-intake.mjs`).

## Where things are

| Path | What |
|---|---|
| `app/` | Pages, components, `app/lib` (analytics, intake, photos, product proof, careers config) |
| `app/components/brand/` | The Signal One mark and lockup |
| `docs/DESIGN_SYSTEM.md`, `docs/BRAND.md` | Binding design and logo rules |
| `docs/CONTRAST.md` | Text and background contrast audit |
| `docs/PHOTOGRAPHY_BRIEF.md` | Photography and product-capture briefs |
| `docs/OVERNIGHT_REPORT.md` | Report from the unattended hardening run |
| `scripts/capture-product.mjs` | Captures product screens from a staging tenant (credentials from env) |

## Product truth

Marketplace is "in development"; PSiRA details are recorded, not externally verified; the shared device is called "Central Device"; R2 per guard per day excluding VAT, 10 guard-day minimum; radios by quote; Payroll coming soon; Accounting beta. `npm run check:branding` enforces the wording rules.
