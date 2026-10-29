# 14-Day Trial and Guard Hiring Marketplace — Release Gate (2026-10-29)

## Public website completed in this branch
- Company registration at `/get-started` collects company identity, representative details, operations and multiple product needs.
- Needs include 1GUARD, 1Workforce, equipment, hiring marketplace eligibility and a 14-day trial request.
- Public website header and 1GUARD marketing CTA link to `/get-started`.
- Guard Marketplace's public CTA takes organisations to company registration, while the page retains its in-development disclosure.
- The request wording distinguishes a submitted lead from an activated trial.

## Trial backend requirements (NOT implemented)
1. Server-side verified identity, company tenancy and duplication-safe organisation provisioning.
2. Authoritative product entitlements for 1GUARD and 1Workforce and a paid-subscription state, not a query parameter or localStorage flag.
3. A durable 14-day trial record with server timestamps, start/end, allowed products, usage quotas and explicit expiration/cancellation behaviour; one trial per eligible company, idempotent activation.
4. Trial conversion, invoicing and payment state coordinated with the existing subscription system. A trial must not produce automatic charges without customer approval.
5. Secure receiving endpoint for the website's `POST /api/intake` contract, backed by sales/CRM records and acknowledged delivery. Currently `SITE_INTEGRATION.md` documents no configured receiver.
6. On successful registration/activation, the user receives a verifiable invitation to their own company workspace (not a shared URL).

## Guard hiring marketplace: LIVE acceptance (NOT implemented)
1. Guard consent and legal basis for profile visibility; PSiRA data must be verified under an approved process and never treated as verified solely because it was entered.
2. Guard-owned availability, grade, preferred regions, experience, searchable profile and data minimisation.
3. Authenticated company users only; server verifies active paid eligibility AND guard-hiring marketplace entitlement on every list, detail and request endpoint.
4. Browse/filter and pagination, shortlist, hire request, guard accept/decline, cancellation, audit trail, timeouts and anti-spam controls.
5. Only consenting guard profiles in authorised response fields; no public guard data or synthetic profiles presented as real.
6. Guard-side hiring requests and acceptance linked into 1GUARD for company staffing, with safe cross-tenant boundaries.
7. Smoke tests for paid vs unpaid vs expired trial vs wrong tenant, duplicate requests, PSiRA expiry, and opt-out.
8. Full legal/privacy/POPIA review, notifications, incident reporting, moderation and operational support.
9. Website paid-member entry must link to a verified authenticated marketplace route once that route actually exists.

## Current decision
**NO-GO for declaring the guard hiring marketplace live or granting 14-day trials automatically.**
Only the public trial *request* and company needs collection are ready for review. Production release cannot satisfy full commercial acceptance until the receiving system and entitlement contract are implemented, deployed and verified.
