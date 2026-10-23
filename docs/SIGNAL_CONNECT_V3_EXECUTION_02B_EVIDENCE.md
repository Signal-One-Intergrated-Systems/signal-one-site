# Execution 02B evidence — first-party preview QR

**Date:** 2026-10-23
**Status:** **CI GREEN / READY FOR EXECUTION 02C**, not production signed off.
**GitHub PR:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/pull/28
**Passing code commit:** `76952223fbd1933a951f01b8bb88e42bc7b2f75c`
**CI run:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/actions/runs/39965406984
**CI job ID:** `120453848876`

## Scope delivered
- Vendored official Nayuki QR Code Generator TypeScript implementation, pinned at `3c6d0b3cefb4e049dc337e82237c9644399716a8`; MIT license header preserved, tiny ESM export added. Code is locally bundled, no QR service at runtime.
- `signal-connect/lib/qr.ts` renders SVG with medium error correction, four-module white quiet zone and crisp black modules.
- `signal-connect/app/qr/[profile]/route.ts`: same-origin SVG response for approved profile+host, 404 unknown profile, 503 missing/invalid origin, no-cache failure.
- `signal-connect/components/QRDisplay.tsx`: render legitimate QR only when `CONNECT_PUBLIC_ORIGIN` is operator-configured and allowlisted, explicitly **Preview link only — Not for printing**. Otherwise show truthful unavailable state.
- `signal-connect/components/FounderPresenter.tsx`: replaces nonfunctional placeholder with QRDisplay. Existing vCard actions maintained.
- Single QR image CSS rule, no appended !important styling.
- `signal-connect/docs/ADR-002.md` records encoder provenance, trust contract and limitations.
- CI now sets explicit test-only approved preview origin; uses `zbarimg` independent decoder for captured QR output after browser tests. No live production environment changed.

## Results — original run at committed code SHA
- `npm ci`: PASS
- `npm test`: PASS
- `npm run lint`: PASS (vendored third-party code exempted by narrowly scoped config, still compiled)
- `npm run build`: PASS
- `npm run typecheck`: PASS
- `npx playwright install --with-deps chromium`: PASS
- `npx playwright test`: **13 passed (11.0s)**
- ZBar image read of `test-results/qr-andisiwe.png`: PASS
- **Exact independent output:** `https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe`
- Artifact upload: PASS

## Review status and release restrictions
- CI decodes the visual QR image end-to-end; it does not establish physical iPhone/Android camera performance. Real device scanning is still mandatory.
- V3 running source-upload Vercel preview is an **older commit** and may still show the original placeholder. This change was not deployed to Vercel. Do not claim the current preview reflects Execution 02B.
- Production Signal One origin, printed/NFC code and Vercel Git-integrated deployment require separate approved configuration. Preview QR may not be printed.
- No reverse lead intake, user-data collection, story, native share/copy or founder identity redesign was added in 02B.
- Next execution **02C — Presenter interactions** can proceed from passing commit once workstream scope, user gesture/copy fallback and iPhone safe area tests are respected.

## Root causes encountered and corrected
- Initial lint gate failed on upstream source style rules (TS namespaces and `prefer-const`), not on application errors. Corrected by excluding *only* the vendored upstream file from ESLint; retained pinned upstream implementation and complete compilation/decoder coverage.
- Final green CI run at `76952223` confirms the complete end-to-end code path.

**Do not advance to a live public release or report that current V3 preview has updated without a verified source-controlled preview and on-device QA.**
