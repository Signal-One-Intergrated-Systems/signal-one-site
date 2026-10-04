# Signal One Site — integration notes

The public website is an acquisition surface, not a second system of record.

- Company onboarding hands off to LEOS, then Guard is provisioned after approval.
- Sales applications hand off to LEOS for review, workforce setup, training and Sales OS access.
- Guard Marketplace applications and profiles are backed by Guard.
- The public marketplace receives a sanitised projection only.

## Runtime adapters

`POST /api/intake` forwards `client`, `sales` and `guard` applications to `SIGNAL_ONE_INTAKE_URL`.

`GET /api/marketplace` reads from `GUARD_MARKETPLACE_URL` and only exposes:
`id`, `displayName`, `grade`, `experienceYears`, `areas`, `skills`, and `availability`.

Credentials stay in server-side environment variables and never go to the browser.
