# Verification evidence — 13 October 2026

## Scope and reproducibility

Final result: **213 passed, 0 failed (4.6 minutes)**. Build, lint and TypeScript exit successfully; source/rendered branding and image OCR pass. Logs are under `logs/final-*` and the image-safety evidence is in `logs/image-safety.log`.

Local production build of PR #26, Chromium `/usr/bin/chromium`. This evidence establishes locally observed behaviour; Railway control-plane deployment success does not establish successful live-browser review. No merge, production deployment, real customer submission or production GUARD access was performed.

Commands: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `PW_CHROMIUM=/usr/bin/chromium npx playwright test`. Build runs source and rendered brand/public-truth gates. The browser suite includes image OCR, forms against absent and mocked intake services, navigation, analytics, pricing, redirects, canonical/SEO and both pilot/live acquisition configurations. Tests and screenshots use production builds; no rebuild runs concurrently with a browser suite.

The earlier failed and interrupted runs remain under `logs/`: they exposed caption overflow, invalid definition-list structure, the loading-focus edge and test setup/locator issues. The interrupted stale-server run is not acceptance evidence. Final regression results are recorded in `logs/final-regression.log`.

## Visual and interaction review

108 route/width combinations return 200 with no horizontal overflow: home, platform, patrol, attendance, marketplace, equipment, pricing, get-started, contact, guards, guard profile and sales. Widths: 320, 360, 390, 430, 768, 1024, 1440, 1920, 2560. Screenshots cover every principal route at 390, 768, 1440 and all nine widths on home. See `after/viewport-checks.json` and `after/`.

Automated axe checks cover 17 routes at 390 and 1440, plus every modal stage at both widths, including WCAG 2.2 AA rules. Manual keyboard checks cover dialog entry, loading, wrapped Tab/Shift+Tab, Escape, restored trigger focus, roving stage tabs, mobile menu and equipment selection. These checks are not a WCAG certification.

`video/motion.webm` records actual scrolling, checkpoint method/record transitions, supervision, signal-dependent response, proof scope, business chapters and equipment selection. Motion is opt-in or short and purposeful. Reduced-motion mode retains all manual controls without autoplay/animation. `after/reduced-motion.png` and `after/glass-disabled-mobile.png` document static and non-glass fallbacks. Hardware image-scale regression covers 1440/1920/2560 at DPR 1; high-DPR photography remains a quality dependency.

Visual critique: the checkpoint and handset are legible in the desktop hero, while mobile separates the field scene from the exact radio. The same field scene connects the hero to the demo. Product models occupy useful physical scale rather than tiny generic cards. Desktop rhythm is shorter and more varied; onboarding and contact now share the same hierarchy. Authentic software and real operation photography are still absent. This is an original Signal One direction; it has not been benchmarked against live ATEX.

## Mobile performance

Lighthouse 13.5, local production server, default mobile profile, isolated from browser-suite load. Full JSON/HTML reports are in `lighthouse/`. These are synthetic lab results, not field Core Web Vitals or measured field INP. Reports were captured on the final visual/performance implementation, before the final focus-only correction; that correction does not change initial rendering or loading.

| Route | Direct DevTools performance | Direct LCP | Simulated performance | Simulated LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 97 | 1.975s | 96 | 2.810s | 0 |
| Equipment | 98 | 1.860s | 96 | 2.650s | 0 |
| Pricing | 98 | 1.761s | 97 | 2.481s | 0 |

Every report scores 100 for accessibility, best-practices and SEO. Direct measurements use `--throttling-method=devtools`, with the default 4× CPU slowdown, 562.5ms request latency, 1474.56Kbps download and 675Kbps upload. Default `simulate` reports use Lighthouse's predictive model; they remain above the requested 2.5s on home/equipment. Both methods are retained rather than treating them as equivalent or omitting the less favourable result.

Performance changes: deferred demo JS/CSS on intent, deferred gallery enhancement with real server content preserved, route prefetch on intent, local Inter, image sizes matched to displayed cut-outs, and an eager/high-priority native responsive hero image. Source image masters and approved manufacturer imagery are unchanged. Hero quality 80 was visually inspected; hardware remains quality 90. Inter preserves its full variable axis, all encoded glyphs, default shapes, metrics and numeric features; unused stylistic alternatives are removed reproducibly by `scripts/prepare-inter.py`.

## External and asset limitations

`benchmark/final-network-policy.json` records current enforced policy revision 21 with empty custom allowed hosts. `benchmark/final-browser-attempts.json` records real Chromium attempts on ATEX, public Signal One and Railway preview at 390/768/1440. Earlier attempts and proxy 403 evidence are retained. The unavailable benchmark interactions were not reconstructed from HTML or guessed.

GUARD source was reviewed read-only at the SHA recorded in the implementation report. Approved genuine product capture cannot run without `GUARD_CAPTURE_URL`, `GUARD_CAPTURE_USER`, `GUARD_CAPTURE_PASS` and a curated synthetic non-production tenant. No credentials or approved capture session are available. Future marketplace status, pilot configuration, SOS mobile-signal limitation, R2/day pricing and equipment-by-quote remain truthful. Missing exact hardware assets are represented by specifications/enquiry content. Real intake persistence and commerce remain integration dependencies; tested fallback does not establish live delivery.

The Railway preview is a separate service, `atex-experience-preview`, pinned to PR head. Final deployment SHA/status and unchanged public service are checked through Railway; the preview URL remains browser-blocked in this environment. It is not promoted to production.
