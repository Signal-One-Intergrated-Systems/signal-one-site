# Signal One site: integration notes

The public website is an acquisition surface, not a system of record. It holds no customer, guard or applicant data.

## `POST /api/intake` (website intake contract v1)

### Browser to site

`{ kind, data: { …string fields, intent }, consent: { processing: true, marketing: boolean, noticeVersion, capturedAt }, idempotencyKey: <uuid> }`

### Site to receiver (`SIGNAL_ONE_INTAKE_URL`, server-side only)

`POST` with `Authorization: Bearer $SIGNAL_ONE_INTAKE_TOKEN` and `Idempotency-Key: <uuid>`:

`{ contract: "website-intake/v1", kind, data, consent: { processing, marketing, noticeVersion, recordedAt, clientCapturedAt }, idempotencyKey, source: "signal-one-site" }`

`recordedAt` is site server time. Both the URL and the token must be set; a receiver without service authentication is treated as not connected.

### Receipt: the only thing that counts as "received"

An HTTP 2xx is **not** proof of a save. The site reports success only when the receiver answers 2xx **and** returns:

```json
{ "status": "persisted",
  "receipt": { "recordId": "SO-7K3M9QX2T8VB", "recordType": "website_enquiry",
               "idempotencyKey": "<the key sent>", "persistedAt": "<ISO time>", "duplicate": false } }
```

Revised 2026-11-13 (founder ruling), before any receiver was connected:

- `recordId` is a **submission-specific opaque reference**: random, unique, and never the identifier of any stored row (6–80 characters, letters, digits, `. _ : -`). Staff can look it up; it reveals nothing.
- `recordType` is fixed per kind and never depends on what the receiver did with the submission: `client` → `website_enquiry`, `guard` → `guard_application`, `sales` → `recruitment_application`. The site rejects any other value, including `crm_lead`.
- Every valid submission is recorded and acknowledged the same way, whether or not the company or email address is already known to the receiver. The reply must not differ in status, shape or wording.
- `idempotencyKey` must equal the key the site sent, so a receipt for another submission is rejected.
- A repeat of the same key must return the **same** `recordId` with `duplicate: true` and create nothing.
- `persistedAt` must be a full ISO-8601 timestamp.
- Missing, malformed or mismatched receipt: the visitor is told the save could not be confirmed (502) and offered email. A timeout gives the same message (504).
- The visitor sees the opaque `recordId` as their reference. Receiver text is never shown on success.
- Receiver errors: only its validation answers (400, 422) reach the visitor, truncated. Any other receiver status (401, 403, 404, 429, 5xx) is our fault, not the visitor's: generic 502, email route offered, no receiver text.

### Idempotency key

The key belongs to a payload, not to a form. An identical retry reuses it; any change to what is sent (a corrected field, another category, the marketing choice) gets a new key, so a correction can never be swallowed as a duplicate of an earlier attempt. The receiver must still reject a reused key carrying a different payload (409).

### The email route

The visitor is offered the pre-filled email for every failure except one they can fix in the form (400, 413, 422): not connected (503), unconfirmed save (502/504), throttled (429) and refused (403) all carry it.

### Request validation (site side)

| Check | Result |
|---|---|
| `Origin` header present and naming this site: the request's own host (first `X-Forwarded-Host` entry, or `Host`), or the canonical site from `NEXT_PUBLIC_SITE_URL` and its www/apex twin | else 403 |
| `Content-Type: application/json`, body ≤ 64 KB | else 415 / 413 |
| `kind` in client, guard, sales; `intent` allowed for that kind | else 400 |
| 1–80 fields, names `[A-Za-z][A-Za-z0-9_-]*`, string values ≤ 6,000 chars, `data` ≤ 20,000 chars | else 400 / 413 |
| `consent.processing === true`, `marketing` boolean, notice version equal to the one published now | else 400 |
| `idempotencyKey` is a UUID | else 400 |

### Trusted-proxy assumptions

- The throttle never uses the left-most `X-Forwarded-For` entry; the visitor controls it.
- If `INTAKE_CLIENT_IP_HEADER` is set (production behind Cloudflare: `cf-connecting-ip`), that header names the caller.
- Otherwise the site uses `x-real-ip`, then the right-most `X-Forwarded-For` entry, i.e. the address the platform proxy saw. Behind Cloudflare that is a Cloudflare address, so all visitors would share one bucket: set the header variable in production.
- `cf-connecting-ip` is only trustworthy for traffic that came through Cloudflare. The Railway origin host (`signal-one-site.up.railway.app`) is publicly reachable and `CANONICAL_REDIRECT` is not set in production, so the origin can be called directly with a forged header.

### Provisional until the LEOS receiver is operational

| Protection | Today | Final home |
|---|---|---|
| Rate limiting | In-memory, per process, resets on deploy, not shared across replicas | Cloudflare rate-limit rule on `/api/intake` and the receiver's own limit per service token |
| De-duplication | Key generated and forwarded; nothing stores it | Receiver, unique on `idempotencyKey` |
| Consent record | Captured and forwarded; nothing stores it | Receiver, stored with the record |
| Bot protection | Origin check and field validation only | Cloudflare Turnstile, verified server-side, or receiver-side scoring |
| Origin lock-down | Origin reachable directly | `CANONICAL_REDIRECT=1` plus a Cloudflare-only ingress rule or shared edge secret |
| Service authentication | Static bearer token | Scoped, rotatable service credential issued by LEOS |
| Tenant attribution | None on the site | Receiver derives the Signal One tenant from the credential, never from the payload |
| Record routing | `kind` is forwarded | Receiver stores `guard` and `sales` kinds as restricted record types, not sales leads |

Order of checks: validation, then "not connected" (503), then the throttle, then the receiver. While nothing is connected the throttle is never reached, so no visitor can lose the honest 503 and the email route because of someone else's traffic.

Consent choices are never stored on the device or restored: every submission needs a fresh tick.

Until both receiver variables are set in Railway, every form answers 503 "nothing was sent" and offers email. That is the current production state.

- **Unset URL:** returns 503 with a message telling the visitor to email sales@signalone.co.za.
- **Client fallback (all five forms):** on a 5xx response or a network failure, `app/lib/intake.ts` shows the server message plus a `mailto:sales@signalone.co.za` link. Subject is `Signal One website: <form type>` and the body is one `field label: value` line per answer (capped at 1,500 characters). Applies to contact, equipment quote, marketplace interest, client onboarding, guard join and sales application. 4xx errors show the message only.
- **Upstream errors:** passed through.
- **Network failure:** returns 502.

| Form | kind | intent |
|---|---|---|
| `/contact` | client | `consultation` |
| `/get-started` | client | `company-onboarding` |
| `/radios-equipment` quote | client | `equipment-rental-quote`, `tracking-quote` or `bodycam-rental-quote` |
| `/guard-marketplace` interest | client | `marketplace-interest` |
| `/guards/join` | guard | `guard-profile` |
| `/join/sales` | sales | `sales-representative-application` |

**Missing contract:** no endpoint in the platform repos accepts this payload yet. Until one exists, every form returns the 503 message.

## Contracts the website needs but that do not exist yet

- **Intake receiver:** see above.
- **CV upload for sales applicants:** the form says "we'll request your CV by email".
- **Interview-slot booking:** the form collects day, time and format preferences, and the copy says slots are offered by email.
- **Vacancy admin:** recruitment status and role count come from env (`SALES_RECRUITMENT_STATUS`, `SALES_OPEN_ROLES`).
- **Sales OS sign-in URL:** set `SALES_OS_URL` (https). Until then, `/join/sales` shows "use the link from your onboarding email" as plain text; it never renders a placeholder link. Sales OS is Signal One's internal tool for its own representatives; it is never offered to customers.
- **Signal One Guard store listings:** set `GUARD_APP_ANDROID_URL` (https://play.google.com/...) and/or `GUARD_APP_IOS_URL` (https://apps.apple.com/...), then rebuild. Until then "Download Signal One Guard" does not render and guards see "Create your profile" only.
- **Buying guard days online:** no checkout exists (see "Guard Day pricing"). CTAs say "Talk to us to buy guard days" and go to /contact.
- **Guard Marketplace data:** not built. The public site **must never** publish guard profiles. `/api/marketplace` was removed on purpose.

## Guard Day pricing

- The website's single source is `app/lib/pricing.ts`: price per guard day, currency, VAT rate, minimum guard days, carry-over and effective date. Every price on the site reads from it, and `tests/e2e/pricing.spec.ts` fails if any rendered page shows a guard-day price it did not produce.
- **Current value: R2.50 per guard per day, excluding VAT. Final** (founder ruling, confirmed 2026-11-12). Minimum 10 guard days, unused days carry over, no tiers, no rep discounts. Gate: 300 guard days = R750 ex VAT (`tests/e2e/r0-release-gate.spec.ts`).
- **Cross-repo audit, 2026-11-12.**
  - `lancesat-enterprise-platform` @ `80c6d417`: no Guard SKU, guard-day unit, balance or price exists in code. Only `products.min_quantity` (migration 0185) has landed. Its own readiness doc records "no R2.00 or R2.50 Guard price anywhere in this repository"; the planned SKU (`LB-CAT-5`) is specified at 250 cents, minimum 10.
  - `signal-one-guard` @ `f43e9954`: holds no commercial state by design (`docs/LEOS_BOUNDARY.md`): no price, billing, entitlement, trial or subscription code.
  - Result: nothing in a back-end price book contradicts R2.50, because no back-end Guard price book exists yet. The stale R2.00 lived only in this repository.
- **Rule going forward:** when the platform Guard SKU is created it must be 250 cents with minimum quantity 10, and this file must be pinned to it by a contract test before online purchase is offered.
- **Online purchase of guard days:** no payment backend or checkout contract exists. The site says "Talk to us to buy guard days" and links to /contact. A checkout needs: a payment provider, an order API that creates the company's guard-day balance, VAT invoicing and a confirmation contract.

## Upstream contract we need (proposal)

`POST $SIGNAL_ONE_INTAKE_URL` with `Authorization: Bearer <token>` and JSON `{ kind: "client"|"guard"|"sales", data: { <field>: string, intent: string }, source: "signal-one-site" }`. Reply `2xx` with optional `{ message }` shown to the visitor, or `4xx/5xx` with `{ message }`. It should be idempotent per submission and must not return personal data. Until it exists, the mailto fallback is the only route and mail volume depends on the visitor's own mail client.

## Security headers

`next.config.ts` sets HSTS (this host only: `includeSubDomains` waits until app., api., guard., sales. and demo. have certificates), nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy and a Content-Security-Policy on every route. The policy allows Google Analytics 4 hosts and the Cloudflare Web Analytics beacon. Rocket Loader and Zaraz are not allowed and must not be enabled without a policy change. Script and style still allow `'unsafe-inline'` (Next.js bootstrap and inline JSON-LD); moving to nonces is open work. Signal Connect paths keep their stricter rules.

## Analytics

`NEXT_PUBLIC_GA_ID` enables gtag. Events are listed in `app/lib/analytics.ts`.
