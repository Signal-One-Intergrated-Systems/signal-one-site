# Existing live website: nontransactional Connect review integration

Founder authorization: Execution06 LIVE INTEGRATION, 27October2026. Supersedes the
prior packet's no-deployment restriction for this bounded existing-site frontend
release. It does not approve public promotion/indexing, transactional intake,
payments, Marketplace/company activation, Guard evidence or customer onboarding.

Baseline and rollback: marketing mainc68d96604441bace329f0494bcddf2385b5745d5,
existing Railway web deploymentbc8f544b-9c77-4729-b775-ade41ade4907. Main and
control-plane rechecked before editing; no newer commits/staged config found.
Execution06 source ZIPabd77bcd2d2b6f5be6c70d40301294a4e8d0ca4e9f5d1ee998f4a2ce052bbc7b
and internalSHA256SUMS verified. Original dirty source stays in prior worktrees.

One Next16 application/build/process in the EXISTING Railway web service:
marketing pages/layout move mechanically into (marketing) with the same public
URLs/content; shared components/libs and canonical branding remain in place.
(connect) owns /connect/andisiwe, /present/andisiwe, /contact/andisiwe vCard and
/qr/andisiwe. Separate root layouts keep marketing CSS/navigation/analytics out
of manual contact drafts and reload documents across the layout boundary.
Marketing /contact remains its original page; no wildcard rewrite or root takeover.
No new project, service, subdomain, duplicate app deployment or preview is created.

Frontend copied from the verified E06 candidate: canonical logo/tokens/portrait,
full InterWOFF2 (original OFL), responsive business card, real local QR, vCard,
manual sales email draft, share/clipboard fallback. Marketing also uses the same
self-hosted full Inter to eliminate build-time Google requests. Source fonts are
not subsetted or substituted. All dependency manifests/lock versions retained.

Review URLs are source-allowlisted https://www.signalone.co.za, never request Host.
QR and share point to /connect/andisiwe on that existing origin, labelled review
access only, no printed/publicQR/NFC distribution. No marketing navigation/sitemap
addition; noindex/nofollow metadata and HTTP headers; crawler disallow for review
paths. No service-worker registration/root manifest or unqualified story route.
Manual phone OR email remains user-controlled: preparing/opening/copying is not
sending, saving or an acknowledged backend receipt. User must choose Send in mail.

No HMAC bridge implementation/secrets are shipped here. POST/api/contact-intake
always503, no request-body/config/service lookup. /api/connect-status is read-only
release/mode diagnostics; no customer or credential data. Existing marketing API
is preserved, no upstream/config activation or database operation. Payments and
Guard/Marketplace services are untouched. No production feature flags changed.

Security headers are scoped to review paths, with exact /contact/andisiwe so the
marketing contact OG-image route keeps its own contract. The SVG has its stricter
scriptless/sandbox policy. Review remains distinct from commercial StageA signoff.

Validation: full production build + source/rendered truth check, TypeScript/lint,
manual/scope tests, Connect desktop/tablet/mobile and original marketing suites.
Original truth matcher is retained with bounded standalone3:41 metric matching;
ISO sitemap timestamps no longer cause false failures. Negative metric controls
remain tested. Existing locked Axe/Playwright Page-type adapter convention is
reused; no dependency upgrade or accessibility assertion removed.

After main release, existing GitHub Actions workflow checks the EXACT live commit
via HTTPS (no insecure TLS), real page rendering/actions/axe and independent QR
decoding. No POST/mail/payment/customer writes. Loopback instrument tests are
explicitly separate from actual-host results. Physical Safari/Android native
mail/contact import, actual mailbox delivery, final POPIA/field performance and
commercial/public distribution remain outstanding unless separately evidenced.

Rollback: restore ONLY this existing web service to the preserved successful
bc8f544b-9c77-4729-b775-ade41ade4907 build, then verify root/contact/marketing and
remove review distribution. Revert the integration commit on main if source needs
to match that rollback; never force-reset or overwrite newer commits. No DB/DNS
rollback, secret change or other service mutation is part of this operation.
