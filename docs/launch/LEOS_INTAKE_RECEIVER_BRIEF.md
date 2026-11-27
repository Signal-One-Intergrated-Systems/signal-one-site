> **Superseded (2026-11-25, later the same day).** This brief assumed no receiver existed because only `main` was checked. The receiver already exists as LEOS draft **PR #704** (`feat/r1-intake-1`, four audit rounds, founder rulings). Workstream B qualified #704 against the real website in a browser (7/11 forms saved on the deployed site; all four radio-quote types lost to a 422) and stacked **PR #748** on it (11/11 saved; attribution; post-commit hook; migration 0192, backup class A; LEOS gate GREEN). The go-live steps are in `RELEASE_GATE.md` and `SITE_INTEGRATION.md`. The text below is kept as history.

# Brief: LEOS website-intake receiver (unblocks DR-001)

**For:** LEOS engineering (coordinate with Mubaraq's open work: #728 email reliability; #731/#732 quote money).
**Status:** proposal. No code has been pushed to `lancesat-enterprise-platform` for this.
**Why it matters:** today no enquiry from signalone.co.za is captured. Every form falls back to "send this email yourself". Google Ads cannot be measured or optimised, and no lead reaches Sales OS.

## What already exists

| Side | Exists | Where |
|---|---|---|
| Website | Complete sender: validation, consent capture, per-payload idempotency key, receipt verification, honest fallbacks, throttle | `signal-one-site/app/api/intake/route.ts`, `SITE_INTEGRATION.md` (contract v1) |
| Website | Mock receiver used by the e2e suite (shows the exact expected behaviour) | `tests/e2e/mock-intake.mjs` |
| LEOS | `crm_leads` with `lead_source = 'website'` | `packages/database/src/schema/crm/leads.ts` |
| LEOS | Lead creation + assignment service | `apps/api/src/services/lead_service.ts` (`createLead`, `assignLead`) |
| LEOS | Hardened public webhook pattern (verify → refuse uniformly → log shape only) | `apps/api/src/routes/inbound_email.routes.ts` |
| LEOS | Receiver endpoint for the website | **None** (checked @ `5efcb30`) |

## Endpoint

`POST /api/v1/website-intake` — public route mounted beside `/public/quotes`, no user session.

1. **Auth:** `Authorization: Bearer <token>` compared in constant time with a hashed, rotatable service credential scoped to *website intake for the Signal One tenant*. The tenant is derived from the credential, never from the payload. Any failure → `401 {"error":"unauthorized"}`, nothing logged but presence/shape.
2. **Validate** `contract === "website-intake/v1"`, `kind ∈ {client, guard, sales}`, the intent per kind (the site's `INTENTS` map), `consent.processing === true`, and `Idempotency-Key` header === body `idempotencyKey` (UUID). Validation failures → `422` with a short visitor-safe message.
3. **Idempotency (one transaction):** insert into `website_intake_submissions` with a unique `(tenant_id, idempotency_key)` and a `payload_sha256`.
   - Same key + same hash → return the stored receipt with `duplicate: true`. Create nothing.
   - Same key + different hash → `409`.
4. **Route by kind:**
   - `client` → `LeadService.createLead` with `leadSource: 'website'`, company/contact/email/phone from `data`, intent and quote fields (product, quantity, rental term, connectivity need, deployment) in structured notes; `recordType: "crm_lead"`.
   - `guard` → restricted `guard_application` record (PSiRA data is personal information: restricted role access, no sales visibility).
   - `sales` → restricted `recruitment_application` record.
5. **Store consent** (processing, marketing, notice version, both timestamps) with the record.
6. **Respond** `201 {"status":"persisted","receipt":{"recordId","recordType","idempotencyKey","persistedAt","duplicate":false}}`, only after commit.
7. **Notify** sales asynchronously after commit (reuse the retry-safe email path from #728; failure of the notification must not fail the intake).

## New table (one migration — sequence it with in-flight migrations)

`website_intake_submissions(id uuid pk, tenant_id, idempotency_key uuid, payload_sha256 char(64), kind, intent, record_type, record_id, consent jsonb, attribution jsonb null, received_at, created_at)`, with a unique index on `(tenant_id, idempotency_key)`.

## Attribution (contract v1.1, site + receiver)

The site should capture first-touch `utm_source/medium/campaign/term/content`, `gclid`, landing path and referrer host at landing (session storage, no cookies before consent where required), and send them as `attribution` beside `data`. The receiver stores them on the submission row and copies `utm_source/campaign` into the lead. This is what lets a Google Ads click be traced to a quote, contract and revenue. Coordinate with site draft #96 (R1 contract), which is already changing the contract.

## Acceptance tests (receiver side)

- 401 on missing, wrong or other-tenant token; nothing written.
- 422 on each validation rule; nothing written.
- First submit → 201 receipt, exactly one `crm_leads` row (`lead_source='website'`), and one submission row.
- Same key and payload → same `recordId`, `duplicate: true`, still one row each.
- Same key, different payload → 409.
- `guard`/`sales` never produce `crm_lead`.
- Concurrent identical submits (two parallel requests) → one lead.
- DB failure mid-transaction → no orphan submission row; site shows "save could not be confirmed".

## Go-live (founder)

1. Merge and deploy the receiver; issue the service token.
2. On the Railway **website** service, set `SIGNAL_ONE_INTAKE_URL=https://api.lancesatsuppliers.co.za/api/v1/website-intake` and `SIGNAL_ONE_INTAKE_TOKEN`.
3. Smoke test with one clearly labelled internal enquiry, confirm it in Sales OS, then archive it.
