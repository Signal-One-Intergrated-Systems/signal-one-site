# Signal One site: integration notes

The public website is an acquisition surface, not a system of record. It holds no customer, guard or applicant data.

## `POST /api/intake`

The body is `{ kind: "client" | "guard" | "sales", data: { …fields, intent } }`, capped at 20,000 characters of `data`.

The site forwards it to `SIGNAL_ONE_INTAKE_URL` as `{ kind, data, source: "signal-one-site" }`, with `Authorization: Bearer $SIGNAL_ONE_INTAKE_TOKEN` when the token is set.

- **Unset URL:** returns 503 with a message telling the visitor to email sales@signalone.co.za.
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
- **Sales OS sign-in URL:** set `SALES_OS_URL`. Until then, `/join/sales` shows a placeholder.
- **Guard Marketplace data:** not built. The public site **must never** publish guard profiles. `/api/marketplace` was removed on purpose.

## Analytics

`NEXT_PUBLIC_GA_ID` enables gtag. Events are listed in `app/lib/analytics.ts`.
