# Signal Connect V3 — Execution 02C handover and test evidence

**Stage:** 02C Founder presenter / native sharing / copy fallback
**Date:** 2026-10-23
**Status:** **GitHub CI GREEN; Vercel QA deployment READY; physical-device and independent external-page fetch not yet verified. Production release STOP.**
**Code commit:** `887fafeae3016c1cad7ffd7db8391eaff55f6b12`
**CI:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/actions/runs/39968717930
**Vercel QA deployment:** `dpl_AEwjH9NEszjd5RqGHmMh3WPBdy8S`
**Preview domain:** https://signal-connect-v3-source-preview.vercel.app/present/andisiwe
**Visitor route:** https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe
**Actual production website/V2:** unchanged

## Delivered
1. `FounderPresenter` resolves the operator-approved visitor URL once on the server and provides the same result to `QRDisplay` and `ShareLink`, avoiding diverging QR/share/copy destinations.
2. `ShareLink` is a lightweight client-only React component. **Share link** calls `navigator.share` synchronously from the actual click gesture; unsupported browsers fall back to `navigator.clipboard.writeText`. Explicit **Copy link** invokes clipboard directly from the click. Clipboard denial exposes a labelled, read-only, selectable visitor URL. Native share cancellation is silent and does not falsely signal an error/success.
3. The preview URL is explicitly marked **preview-only, not for printing/NFC**. Missing trusted `CONNECT_PUBLIC_ORIGIN` displays truthful unavailable copy; no false code or enabled dead share controls.
4. `ContactExchange` supports a presenter's quieter secondary treatment while preserving the recipient's separate primary Save Contact action. No change to public VCF payload, details, or storage.
5. CSS was amended in place with canonical tokens, existing 10px control and 14px card geometry. No `!important`, new neon, gradient, foreign brand fonts, or nested phone mockup. Dedicated compact-phone breakpoint and short-viewport rules ensure the actual QR remains visible.
6. Service worker has a version bump and opportunistically caches the first-party public QR; invalid/unconfigured QR never blocks PWA installation. No contact data or forms are cached.
7. `tests/presenter-share.spec.ts` adds eight browser tests: native share, unsupported-share fallback, Copy action, denied clipboard selectable field, AbortError cancellation, rejected native share fallback, 390x667 a11y/mobile, offline QR after caching.

## Test results at the exact code commit
- Node/npm install and source contracts: PASS
- ESLint: PASS
- Next.js production build and TypeScript: PASS
- Playwright Chromium: **21 passed (14.4s)** including eight new 02C tests
- Independent ZBar decoding of the screenshot QR: **PASS**
- QR decoded URL: `https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe`
- GitHub Actions artifact upload: PASS
- Known first run failures: nested callback null narrowing at TypeScript build, then stale QR-preview microcopy expectation. Both corrected at source; no tests disabled or weakened to skip functionality.
- No code changed after green commit.

## Vercel preview
- Separate QA project `signal-connect-v3-source-preview`, project `prj_oUkv8L0YPm7yTTAiuhqlFRxW8ePz`.
- Set approved public `CONNECT_PUBLIC_ORIGIN` in **this QA project only**.
- Uploaded the tested app code and dependencies to a standalone source build; deployed to separate QA project, READY at `dpl_AEwjH9NEszjd5RqGHmMh3WPBdy8S`; stable QA alias `signal-connect-v3-source-preview.vercel.app`.
- Vercel reports SSO/password protection disabled; project domain assigned.
- Attempted independent fetch through Vercel connector: **403 connection scope**, not HTTP application 403 evidence. Network-less container and external web fetch likewise could not load the page. Therefore **manual iPhone/browser loading is NOT independently confirmed**.
- Source-upload is a temporary QA distribution method; permanent source-controlled Vercel Git integration for V3 remains blocked by GitHub installation/authorization. This temporary deployment does not satisfy the final release pipeline gate.

## Remaining acceptance
- Open the QA URL on an actual iPhone in Safari. Verify visible correct QR/Founder title, Share Sheet and clipboard, scan with another phone, and Save Contact import.
- Confirm responsive appearance and safe areas on real iPhone and Android Chrome.
- Build Execution 02D identity-first visitor card; current visitor remains a contact/website skeleton, with no story/lead form.
- Integrate GitHub repo into the correct Vercel team for automatic reproducible deployment before final public launch.
- Keep V2 live and unchanged; do not print or permanently NFC-encode the preview QR.
