# Signal One site: integration notes

The public website is an acquisition surface, not a system of record. It holds no customer, guard or applicant data.

## `POST /api/intake`

The body is `{ kind: "client" | "guard" | "sales", data: { …fields, intent } }`, capped at 20,000 characters of `data`.

The site forwards it to `SIGNAL_ONE_INTAKE_URL` as `{ kind, data, source: "signal-one-site" }`, with `Authorization: Bearer $SIGNAL_ONE_INTAKE_TOKEN` when the token is set.

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
- **Current value:** R2.00 per guard per day, excluding VAT. **R2.50 is pending founder confirmation**; the change is one line (`pricePerGuardDay`) plus `effectiveDate`.
- **Sales OS and Admin hold their own price books** in other repositories (lancesat-enterprise-platform). They are not coupled to this file and must be aligned separately whenever the price changes.
- **Online purchase of guard days:** no payment backend or checkout contract exists. The site says "Talk to us to buy guard days" and links to /contact. A checkout needs: a payment provider, an order API that creates the company's guard-day balance, VAT invoicing and a confirmation contract.

## Upstream contract we need (proposal)

`POST $SIGNAL_ONE_INTAKE_URL` with `Authorization: Bearer <token>` and JSON `{ kind: "client"|"guard"|"sales", data: { <field>: string, intent: string }, source: "signal-one-site" }`. Reply `2xx` with optional `{ message }` shown to the visitor, or `4xx/5xx` with `{ message }`. It should be idempotent per submission and must not return personal data. Until it exists, the mailto fallback is the only route and mail volume depends on the visitor's own mail client.

## Analytics

`NEXT_PUBLIC_GA_ID` enables gtag. Events are listed in `app/lib/analytics.ts`.
