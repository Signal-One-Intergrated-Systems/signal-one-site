# Signal Connect V3 — Execution 01

A clean, isolated Next.js application. Run commands from this directory with Node 24.

```sh
npm ci
npm test
npm run lint
npm run build
npm run typecheck
npx playwright install --with-deps chromium
npx playwright test
```

Playwright starts the production server on localhost:4173 outside the managed Sites environment. Set BASE_URL to test a separately running server. Do not use a development server for offline tests. `npm run dev` supports the managed Sites launcher; `node scripts/dev.mjs --production` serves an existing build. The managed supervisor's browser URL is internal QA, not a deploy URL.

In environments using a system-trusted TLS proxy, the build may require `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build`. Certificate verification stays enabled. The font is genuine Next-managed Inter, never a substituted fallback for tests.

Routes:
- `/present/andisiwe`: Founder presentation, clearly labelled unfinished QR slot.
- `/connect/andisiwe`: visitor introduction skeleton, no form.
- `/contact/andisiwe`: server-generated public vCard.
- `/manifest.webmanifest`: standalone PWA manifest, starts at presenter.

Canonical logo modules are byte-identical to the website. Tokens match its stylesheet. Root website TypeScript and ESLint exclude this separately built application; marketing routes are unchanged. See `docs/ADR-001.md` and `docs/EXECUTION_01_EVIDENCE.md`.

No public deployment or production promotion. QR, five photographic chapters and durable lead intake remain separate sequential missions. A protected Vercel preview must be built from the pushed Git commit with rootDirectory `signal-connect` in a new project.
