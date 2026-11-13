# Architect verification of the Phase 1 audit (2026-11-13)

Coding-agent evidence: `DEFECT_REGISTER.md`, `data/`, `logs/`, `screenshots/`, `screenshots-dark/`.
Live evidence (signalone.co.za, real Chrome, 1440 px wide, read-only): `live/`.

## What was checked independently

| Check | Result |
|---|---|
| Deployed SHA equals audited SHA | Railway `signal-one-site` / `web`, deployment `a294bcef`, commit `e0d28c8`, status SUCCESS |
| Agent's commit touches only audit tooling | `81d3179`: 14 files, all under `tests/audit/` and `scripts/audit/`; working tree clean; not pushed |
| Screenshot counts | 432 page captures (72 per viewport per colour scheme), 62 form, 35 interaction, 5 probe, 9 contact sheets |
| Cited source lines | Header.tsx:178/:193, solutions/security/page.tsx:56, join/sales/page.tsx:38,104,156,160,164, home-conversion.css:718-720, globals.css:1476-1481 all read and match the register |

## Register entries confirmed on the live site

| ID | Live confirmation |
|---|---|
| D-001, D-002 | /security-trust, /privacy, /popia, /terms: computed body colour `rgb(51,71,91)` on body `rgb(11,28,48)`. `live/security-trust-desktop-dark-scheme-unreadable.jpg`, `live/terms-desktop-dark-scheme.jpg` |
| D-004 | Literal `\n` visible on /solutions/security. `live/solutions-security-literal-newline.png` |
| D-008 | /join/sales serves `og:url` = homepage and the homepage `og:title` |
| D-010 | Green band behind the nav on the homepage. `live/home-desktop-green-top-band.png` |
| D-011 | Homepage document height 10,543 px at 1440 wide |
| D-012 | "Sales OS" appears 4 times in the main content of /join/sales |
| D-017 | /get-started title "Request Your 14-Day Trial \| Signal One \| Signal One" |
| D-018 | Disclosure line flush at x=0. `live/home-desktop-disclaimer-outside-container.jpg` |
| Pricing | 10 x 30 = 300 guard days = R750 excl. VAT on the live calculator; 10 guard-day minimum applied |
| All 20 live routes | 200 (404 for the unknown path), one h1 each, no site-origin console errors (the only console exceptions came from a browser extension) |

## Not confirmed live

- D-003 (dead Menu at 1024 to 1279 px): the live Chrome window would not go narrower than 1440 px and the site correctly refuses to be framed. Live markup carries the same `xl:hidden` toggle class as the audited source, and the SHA is identical, but the behaviour itself was observed only on the local build (`screenshots/interaction/nav-home-1024-menu-open.png`).
- Live tablet and mobile widths, for the same reason. Tablet and mobile evidence is from the local build of the same SHA.

## Architect additions to the register

| ID | Route | Severity | Observed | Evidence |
|---|---|---|---|---|
| A-001 | /get-started | minor | Stepper numerals 2 to 5 are `rgb(231,238,240)` on `rgb(217,235,248)`: invisible; only step 1 shows its number | `live/get-started-stepper-invisible-numerals.png` |
| A-002 | /get-started | minor | Empty "Continue" relies on the native validation bubble only: no `aria-invalid`, no inline message | live DOM read |
| A-003 | /pricing | minor | Calculator accepts decimals and silently floors them (2.5 guards x 3 days reported as 6 guard days) | live calculator |

## Items that are founder rulings, not defects to fix unasked

1. Product name: "1GUARD" vs "Signal One Guard" vs "Signal One Security" (D-033), and "Central Device" vs the ruled "Central device".
2. "Sales OS" on the noindex careers page /join/sales (D-012).
3. /pricing lists Accounting (Beta) and Payroll (Coming soon).
4. /radios-equipment headline "Rented, not sold online" against a catalogue that includes radio sales.
5. "Pilot" wording on /solutions/security, /pricing and the homepage.
