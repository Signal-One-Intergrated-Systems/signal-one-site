# Execution 01 evidence — 2026-10-23

Implementation status: foundation complete. GitHub Actions run #39953982218 at commit e2f7dc60 PASS (install, 6 contracts, lint, build, typecheck, 10 Playwright tests and artifact upload). Release status: STOP — Vercel preview, actual iPhone/Android QA and real QR remain pending.

## Source and boundaries

Base: 83cab59c6fcf6d3a49b834b322269897bd575bcc on rebuild/signal-connect-v3-clean-20261023. Four required documents and mandatory canonical components, stylesheet, layout and provenance read before implementation. Brand modules copied exactly from canonical main c68d966. No legacy Signal Connect source read, copied or modified. No production or main changes, no merge, no lead endpoint or data collection.

Changed paths: new signal-connect/{app,components,lib,styles,public,scripts,tests,docs}, its package/lock/config/README; new .github/workflows/signal-connect-foundation.yml; root tsconfig.json and eslint.config.mjs only exclude the standalone application. No marketing route changes.

## Commands and results

| Command | Exit | Evidence |
|---|---:|---|
| git clone --single-branch --branch rebuild/signal-connect-v3-clean-20261023 … | 0 | HEAD 83cab59 |
| npm install --ignore-scripts --no-audit --no-fund | 0 | 349 packages; exact runtime pins |
| npm run build, initial | 1 | Google Fonts TLS fetch failed |
| NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build | 0 | Compiled, TypeScript passed, 7 static pages; presenter/visitor/vCard dynamic routes |
| npm test | 0 | 6 contracts passed: logo equality, token parity, font config, CSS constraints, title, vCard/routes |
| npm run typecheck, initial | 2 | axe peer resolved a different playwright-core Page type; fixed by exact matching dev pin |
| npm run lint, initial | 0 | No source lint findings |
| npm run lint after browser artifacts | 1 | Generated report JS included; fixed by ignoring test artifacts |
| npx playwright install chromium | 0 | Chromium and headless shell installed; initial CDN invalid archive recovered on official mirror |
| sites-preview start, initial | 1 | Unsupported --host from launcher; fixed by Next launch adapter |
| sites-preview start, repaired | 0 | Managed browser displayed presenter from production build |
| npx playwright test | 1 | 10 tests blocked before assertions: localhost server unavailable from runner |
| BASE_URL=http://terminal.local:4173 npx playwright test | 1 | 10 tests blocked before assertions: ERR_EMPTY_RESPONSE from runner |
| git diff --check | 0 | No whitespace errors |

Managed cloud browser visually displayed the desktop founder presentation: canonical logo, Founder title, clear unfinished QR slot and contact controls. This is NOT mobile screenshot or accessibility evidence. Local browser runner cannot reach the supervised server; no alternative unmanaged server was started.

## Remaining validation

CI workflow runs install/contracts/lint/build/typecheck and Chromium tests at 320, 360, 390, 430, 768, 1024 and 1440; collects screenshots, axe results, reduced-motion/keyboard, routes/vCard, runtime errors and offline shell. GitHub CI COMPLETED SUCCESSFULLY (2026-10-23 12:32:47 UTC). Seven screenshots (320/360/390/430/768/1024/1440) and Playwright HTML report were uploaded as artifact 12502160396. Three phone-sized screenshots were independently retrieved and reviewed; there was no visible clipping. CI Chromium tests PASSED checks for computed Inter, axe accessibility, mobile overflow, reduced motion, offline shell, vCard and routes. Physical iPhone/Android import and standalone installation remain unverified. Real QR is intentionally deferred to Execution 02. Photography/hardware narrative is deferred to Execution 03; canonical provenance is retained.

Vercel project creation for signal-connect-v3-clean was denied (403) for team_VdJwlldmyXbQBkyuCRECZEYn. The connection can list projects but cannot create in that scope. The API requested authorize_team_access; that tool is not exposed. No project, preview URL or production deployment was created. Sites publication is not used as a substitute because it is a production deployment.
