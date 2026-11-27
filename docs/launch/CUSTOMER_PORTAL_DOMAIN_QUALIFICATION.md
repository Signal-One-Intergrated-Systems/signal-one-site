# Customer portal entry point: `portal.signalone.co.za` qualification

**Date:** 2026-11-27. **Founder decision:** proceed with `portal.signalone.co.za`, subject to verifying authentication, DNS, SSL, sessions and portal functionality; no duplicate account system.

**Scope of this review:**
- **Read:** LEOS `origin/main` @ `151936f4`, read-only.
- **Not checked:** DNS. It could not be resolved from this environment, because the network proxy blocks the domain and DNS-over-HTTPS.
- **Not changed:** no DNS, Railway or LEOS configuration.

## Verdict

**Qualified with conditions.** The portal exists and needs no new account system. But **pointing only the web app at `portal.signalone.co.za` would break sign-in persistence** in Safari and Firefox, and increasingly in Chrome. The API must move to the same site at the same time, so the change touches both LEOS services together.

## What exists

| Item | Evidence | Status |
|---|---|---|
| Customer portal | `apps/web/src/app/(portal)/portal/`: quotes, invoices (pay flow present, payments switched off), documents, assets, support, users, policies; `(portal)/layout.tsx`, `PortalNav.tsx` | Exists. One web app with role-scoped shells; customers and staff share `/login` and MFA (`(auth)/login`, `(auth)/mfa`). |
| Authentication | Access JWT held in memory (15 min). Refresh token in an httpOnly cookie `refresh_token`, `Secure`, `SameSite=None`, `path=/`, 7 days, **host-only on the API host** (`apps/api/src/routes/auth.routes.ts:44-60`). Portal users get their own tenant, fail-closed (`packages/auth/src/auth_service.ts`, tenant resolution). | Exists |
| API base URL | `NEXT_PUBLIC_API_URL`, **fixed at build time**: one web build talks to one API host (`apps/web/src/lib/api-client.ts:62-92`) | Constraint |
| CORS | Allow-list from `env.CORS_ORIGINS` only (`apps/api/src/index.ts:720-751`; required by `startup_validation.ts:54`) | Needs the new origin |
| Links in emails | `PUBLIC_WEB_BASE_URL`, default `https://app.lancesatsuppliers.co.za` (`packages/config/src/env.ts:179`), and `PUBLIC_API_BASE_URL` for tokenized PDF links | Needs updating |
| Customer documents | The quote PDF prints `www.lancesatsuppliers.co.za` (`apps/api/src/services/pdf_document_layout.ts:136`) | Separate decision: VAT invoices must name the registered entity anyway (legal review) |

## Why the API must move too

- **Today:** `app.lancesatsuppliers.co.za` (web) and `api.lancesatsuppliers.co.za` (API) are **the same site** (`lancesatsuppliers.co.za`). The refresh cookie is therefore a first-party cookie, and the browser sends it with the `/auth/refresh` call when the page reloads.
- **With only the web app moved:** the web would be on `signalone.co.za` while the API stays on `lancesatsuppliers.co.za`. The cookie becomes a **third-party cookie**:
  - Safari blocks it by default (ITP).
  - Firefox partitions it (Total Cookie Protection).
  - Chrome restricts it for users who block third-party cookies.
- **Result:** customers would be signed out on every reload. This fails the qualification.

## Recommended change (one coordinated LEOS infrastructure release, founder-approved)

1. **API on the same site.**
   - Add `api.signalone.co.za` as a second custom domain on the LEOS API service; the old domain keeps working.
   - Set `PUBLIC_API_BASE_URL` to it.
2. **Web on the portal domain.**
   - Add `portal.signalone.co.za` to the LEOS web service.
   - Rebuild with `NEXT_PUBLIC_API_URL=https://api.signalone.co.za`.
   - **Everyone, staff included, then uses `portal.signalone.co.za`**, because one build talks to one API host. A separate portal-only web deployment would avoid moving staff, but it duplicates a service.
   - Redirect `app.lancesatsuppliers.co.za` to the new host.
3. **CORS and links.**
   - Add `https://portal.signalone.co.za` to `CORS_ORIGINS`. During the switch, keep the old origin.
   - Set `PUBLIC_WEB_BASE_URL=https://portal.signalone.co.za`, so new emails link there.
   - Links already sent keep working through the redirect.
4. **DNS and SSL.**
   - Create both records in Cloudflare (`signalone.co.za`) as CNAMEs to the Railway targets. Railway issues the certificates.
   - Choose the proxy mode deliberately: DNS-only, or proxied with Full (strict).
   - Verify both hosts serve valid certificates before switching the build.
5. **Sessions.** The cookie is host-only on the new API host, so everyone signs in again once. This is acceptable: everyone was already made to sign in again on 2026-11-26.
6. **Website.** Add "Sign in" (customers) to the header's secondary links and the footer, linking to `https://portal.signalone.co.za/login`, **only after** step 7 passes.
7. **Qualification run, on staging first, then production with your approval.** Check in Safari, Firefox and Chrome, at 1440 and 390:
   - sign-in;
   - MFA;
   - reload persistence;
   - sign-out;
   - a client invitation and a quote-acceptance magic link;
   - the portal pages;
   - a CORS preflight check;
   - the build-info SHA on both services.

## Not authorised here

DNS records, Railway domains, environment variables, LEOS rebuilds and production changes. Each step above is a production infrastructure change that needs your approval and the LEOS release controls. The deploy is complete only when both services report the pushed SHA.
