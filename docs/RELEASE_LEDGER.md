# Release ledger

Each line separates what was implemented, tested, deployed and verified in production. "Verified" means checked on the live domains after the deployment, not inferred from a green build.

## R0 — corrective release — CLOSED

| | |
|---|---|
| Merged | PR #93, merge commit `2892cc6`, 2026-11-12 |
| Tested | Release gate 374/374 on the reviewed commit; independent review: approve with non-blocking findings |
| Deployed | Railway deployment `6a6ce69f-e889-435f-bef7-6d6ed8a97870` |
| Verified live | Both domains: R2,50 pricing and 300 guard days = R750, structured data 2.50 ZAR, security headers, navigation, phone layout, honest 503 form fallback with the email route |
| Found in verification | The new Content-Security-Policy blocked Cloudflare Web Analytics. Fixed in R0.1 |

## R0.1 — Cloudflare analytics in the policy; anchor clearance — CLOSED

| | |
|---|---|
| Merged | PR #94 (head `735169f`), merge commit `e0d28c8`, 2026-11-12, founder-approved |
| Tested | Release gate green on `735169f` |
| Deployed | Railway deployment `a294bcef-1ec1-4a19-a80b-adbd54e8eb70`, SUCCESS. Rollback target: `6a6ce69f` (R0) |
| Verified live, both domains, real browser | Policy allows `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (reporting); beacon script 200 and its report accepted (204); zero policy violations; `#solutions` lands at 96px under the 88px header; pricing unchanged and correct; `/pricing`, `/get-started`, `/privacy`, `/guard-marketplace` 200; form fallback unchanged (503, "nothing was sent", email route) |
| Accepted | Founder, 2026-11-12 |

## What these releases are not

Online forms are **not connected**: `SIGNAL_ONE_INTAKE_URL` and `SIGNAL_ONE_INTAKE_TOKEN` are unset in production, so every submission is answered honestly with the email fallback. No lead reaches Sales OS from the website yet. Trials are not operational. `INTAKE_CLIENT_IP_HEADER` is deliberately unset until the Cloudflare-to-origin boundary is established.

## Open, tracked separately

- KI-1 intermittent hydration error — `docs/KNOWN_ISSUES.md`
- KI-2 Signal Connect live-verification workflow failing — `docs/KNOWN_ISSUES.md`
- KI-3 `#community` anchor 12px low on a phone — `docs/KNOWN_ISSUES.md`
- Six founder-confirmed UX corrections — `docs/UX_REQUIRED_CORRECTIONS_2026-11-12.md`
- Repository still public; `main` unprotected; origin reachable without Cloudflare

## Next: R1 — the intake receiver

Owned by the platform builder (PROGRAM-15 S5 Commercial Activation), audit-class, contract `website-intake/v1` as in `SITE_INTEGRATION.md`. The website changes nothing for R1 except two production variables, set only after the independent security audit, staging integration tests and a production-activation approval.
