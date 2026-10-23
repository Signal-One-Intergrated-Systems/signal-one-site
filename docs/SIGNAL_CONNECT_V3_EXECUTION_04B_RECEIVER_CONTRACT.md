# Signal Connect V3 — Execution 04B receiver contract and integration gate

**Date:** 2026-10-23
**Status:** CONTRACT + UNIT TESTS LANDING / SALES OS RECEIVER **NOT VERIFIED** / PUBLIC AUTO-SUBMISSION **DISABLED**
**Signal Connect branch:** `rebuild/signal-connect-v3-clean-20261023`
**Existing public visitor:** `/connect/andisiwe` retains manual, user-controlled email exchange.
**Code contract:** `signal-connect/lib/intake-contract.ts`
**Contract tests:** `signal-connect/tests/intake-contract.test.mjs`

## What the actual Sales OS exposes today

Audited repository `Signal-One-Intergrated-Systems/lancesat-enterprise-platform`, `main` commit `80c6d417800047c46daff32c8cbabae5c794970e`:

1. **CRM `POST /api/v1/crm/leads`** (`apps/api/src/routes/crm.routes.ts`): `router.use(requireAuth())`, `router.use(requireTenant())`, `requirePermission("crm.write")`; `CreateLeadSchema` requires `companyName`, `contactName`, and `email`, with optional phone. Not a public intake endpoint.
2. **Commerce `POST /api/v1/commerce/contact-requests`** (`apps/api/src/routes/commerce.routes.ts`): also behind authenticated tenant-scoped router. `CreateContactRequestSchema` in `apps/api/src/schemas/commerce.schemas.ts` requires `name`, a valid **email** and `message`, with optional phone and other metadata. It is a better conceptual destination than forcing every introduction into a qualified CRM lead, but is not ready for phone-only exchange or unauthenticated visitors.
3. `contact_requests` is already a first-class *shared* inbox read by `commerce.contact_requests.read`, per `s396_contact_requests_capability.integration.test.ts`. Do not give guests this capability; do not broaden `leads.list` or sales rep tenant visibility.
4. Existing inbound-email webhook uses signed provider body, non-enumerating responses and storage retries. That is precedent for rigorous ingress, **not** authorization to reuse its provider token for this application.
5. This code review does not attest which services/environments are deployed, or that a new scoped authentication secret, consent table, unique submission key, POPIA retention policy or receiver is currently provisioned.

### Incompatibilities that must not be hidden

| Signal Connect visitor input | CRM lead | Commerce contact request | Decision |
|---|---|---|---|
| Full name required | Contact name required | Name required | Compatible |
| Email **or** phone required | Email required | Email required | **BLOCK** phone-only → cannot manufacture an email |
| Company optional | Company name required | Company not required | Prefer contact-request inbox |
| Consent to a one-time introduction | Not expressed in lead-create schema | `metadata` exists, but no verified consent/audit workflow | **BLOCK** until durable audit defined |
| Interest and message optional | Notes optional | Message required | Receiver should add a truthful template only when message absent |
| Presenter/source/attribution | Generic lead source | Metadata may carry source | Authenticate/validate on server; don't accept client-supplied tenant |
| Stable duplicate submissionId | No verified exposed idempotency key | No verified exposed idempotency key | **BLOCK** until unique constraint + receipt |

**No PII write has been executed. No external Sales OS URL is hard-coded or guessed.**

## Approved versioned intake payload

`prepareContactIntake(details, stableUuid)` produces **v1**, not a posted request:
- `version: 1`, `source: "signal_connect"`, `presenterId: "andisiwe"`
- `submissionId`: a cryptographically random caller-created UUID persisted only for the *same in-memory retry*, **not** derived from email/phone and not placed in the public URL.
- `contact`: name; email **or** phone; nullable company. Never invent missing information.
- `interest`, `message`: nullable, bounded by existing `validateExchange` constraints.
- `consent`: affirmative true, purpose `respond_to_introduction`, fixed notice version `signal-connect-contact-2026-10-23`. A separate, default-off marketing option requires its own approval and copy.
- Tenant binding, destination owner, durable `receivedAt` and consent IP/user-agent data (only as necessary under a defined privacy policy) are **server responsibilities**, not trusted from a form.

The receipt predicate accepts only `{status:"created"|"existing", source:"signal_connect", persisted:true, recordId:<UUID>, submissionId:<matching UUID>}`. This is a *necessary* payload gate, not evidence that a random responder is trusted: it must arrive over the authenticated server-to-server channel from the verified Sales OS receiver. HTTP 200/202, mail composer opening or a copied message cannot show “Lead saved”.

## Receiver work order: build before enabling UI auto-submit

### R1 — isolated Sales OS receiver
Create an explicit, versioned dedicated integration route, e.g. `POST /api/v1/integrations/signal-connect/intake`, **not** the existing publicly session-authenticated `/crm/leads` route. First approve its real location. This route must authenticate the Signal Connect server (short-lived scoped service credential or HMAC on canonical request bytes + clock/nonce replay bound; no browser-visible long-lived secret). Restrict credential purpose to receiving a single intro record; never grant broad `crm.write`/list capability to an unauthenticated caller.

The trusted receiver binds a pre-registered integration to the **correct tenant** and attribution presenter/owner; ignores any tenant/user asserted by the external request. Validate strict schema/version/body bytes (≤8 KiB) and reject unknown/unsafe fields, expired/replayed signatures and bad scopes with non-enumerating responses. No secrets, PII or raw payloads in logs or analytics.

### R2 — atomic persistence and duplicate safety
Use a single transaction for validated contact-request write, explicit consent record and unique per-tenant idempotency key; store a durable receiver timestamp, original channel/source, exact notice/purpose, sales owner/assignment policy and response record ID. Enforce a unique constraint, so retrying the same submissionId returns the same ID without creating a second contact. A race/partial failure must roll back; do not send success before commit. 5xx/timeout must be treated as **unknown**, not success. Do not silently insert a placeholder email or company name.

Verify contact request appears in the authenticated Sales OS contact inbox with allowed roles only, and decide whether/when CRM lead promotion should happen (not necessarily upon casual introduction).

### R3 — privacy, abuse and lifecycle
Document public privacy notice and POPIA purpose, recipient/controller identity, retention, deletion and data-subject request process; short-term dedup storage must follow the same retention rules. Put IP and request-rate limits, a bot friction policy, same-origin/CSRF checks, strict HTTPS domain and service-token rotation in place. Avoid storing contact PII in URLs, Next PWA service worker, browser localStorage, error reports, query parameters or browser console. Do not repurpose one-time introduction consent for mailing campaigns.

### R4 — Signal Connect server bridge (AFTER real receiver exists)
Build a Next.js server route (not client→CRM) accepting only the approved v1 fields; exact origin verification and body-size enforcement; derive presenter ID from the allowed profile; rate limit before external requests. Read destination and credentials *server-only*. Require configured, allowlisted HTTPS origin and explicitly enabled environment; failure/unknown/missing secret returns unavailable without any claim of collection. Generate a stable idempotency key per explicit visitor submission. The UI may show “Received” only for verified persisted receipt. On failure keep the form and the existing **user-controlled email option**, without automatic fallback that could duplicate messages.

### R5 — final test-and-release gate
- Pure v1 contract tests, invalid consent/missing contact, email-only and phone-only: PASS.
- Integration tests against disposable DB: authenticated/unauthenticated, replay/idempotency race, tampering, cross-tenant isolation, raw payload/body caps, conflicting interest and duplicate detection, removal/deletion.
- End-to-end: synthetic visitor record present **once** in authenticated Sales OS contact inbox with correct assigned owner, timestamp, source and affirmative consent; verified failure does **not** produce false green UI.
- Review on Safari iPhone and Android Chrome. Verify route disabled on wrong Vercel target. Rotate credentials and inspect logs for PII leaks. Only then approve production alias migration.

## Decision

**04B-contract ready; durable submission blocked.** The existing QR, presenter, premium black-and-white business card, vCard and explicitly user-sent email are preserved. No live API, secret, tenant, receiver or fake success was added. This avoids creating a misleading sales funnel and is compatible with a future real Sales OS bridge.
