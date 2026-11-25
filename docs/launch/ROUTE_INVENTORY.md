# Public route inventory — live baseline

**Captured:** 2026-11-25 against https://signalone.co.za (`main` @ `8e89d24`).
**Discovery:** natural navigation from `/` → header, footer and in-page links → `sitemap.xml` (18 URLs) → `app/(marketing)` route folders → probes for common routes visitors try.
**Sweep:** every route below at 1920×1080, 1440×900, 1280×720, 1024×768, 768×1024, 430×932, 390×844, 360×740 (192 page loads, fresh context each), scrolled top to bottom to trigger lazy content. axe-core 4.10 (tags wcag2a, wcag2aa, wcag21aa, wcag22aa) at 1440 and 390 (48 scans).

## Result summary

| Check | Result |
|---|---|
| HTTP status, listed routes | 200 for all 19 |
| Unintended horizontal overflow | **0** at all 8 widths |
| Broken images | **0** |
| Console / network errors (excl. Cloudflare beacon blocked by this sandbox) | **0** on live routes |
| axe-core automated violations (WCAG 2.2 A/AA tags) | **0** in 48/48 scans. *Automated checks do not prove WCAG conformance; manual review remains required.* |
| Targets under 24 px (mobile) | Skip link (hidden until focused), inline text links (WCAG 2.5.8 inline exception), native checkboxes/radios inside larger labelled rows, `1GUARD`/`1Service` wordmark links on the homepage (81×20 px, spaced). Low severity — see DR-024. |
| Lab performance (Moto G4, 1.6 Mbps/150 ms, 4× CPU) | `/` LCP **4.4 s** (fails 2.5 s); `/ptt-radio-rental` 1.0 s; `/radios-equipment` 1.1 s; CLS ≤ 0.025. Lab, not field data. |

## Routes

| Route | In sitemap | Reached from | H1 | Page height 1440 / 390 (px) | Notes |
|---|---|---|---|---|---|
| `/` | ✓ | — | Run your business. As one. | 9 636 / 12 578 | Founder-locked hero. 6 trial CTAs. |
| `/solutions/security` | ✓ | Nav 1GUARD | Run your security business. As one. | 6 256 / 9 593 | |
| `/pricing` | ✓ | Footer | R2,50 per guard per day | 3 987 / 5 492 | |
| `/radios-equipment` | ✓ | Nav (after fix), homepage equipment section | Buy or rent radios. Keep your team connected. | 6 761 / 10 374 | Catalogue + quote form (email hand-off). |
| `/ptt-radio-rental` | ✓ | Footer | Push-to-talk radios for your security contracts. | 4 316 / 5 932 | Google Ads landing candidate. |
| `/equipment-marketplace` | ✓ | Nav Equipment (before fix), footer | The right equipment. Ready for the field. | 2 731 / 4 202 | Title duplicated "Signal One" (fixed). |
| `/guard-patrol-software` | ✓ | Footer | Prove the patrol was walked. | 4 857 / 7 647 | |
| `/guard-attendance-software` | ✓ | Footer | Know who is on post, and prove it. | 4 132 / 5 801 | |
| `/guard-marketplace` | ✓ | Nav Hire Guards | Win the contract. Then staff it from the same system. | 5 218 / 8 380 | MVP in development. |
| `/service` | ✓ | Nav 1Service | 1Service | 3 402 / 4 897 | In development. |
| `/contact` | ✓ | Footer, CTAs | Tell us what you need… | 2 094 / 3 861 | Email hand-off. |
| `/get-started` | ✓ | Header CTA | Start with what your business needs. | 2 238 / 3 381 | Email hand-off. Title duplicated "Signal One" (fixed). |
| `/guards` | ✓ | Nav For guards | Your work, on record… | 4 041 / 6 449 | Own header ("guard world"). |
| `/guards/join` | ✓ | /guards | Create your guard profile | 2 006 / 2 807 | |
| `/security-trust` | ✓ | Footer | Access, accountability and data protection. | 2 956 / 4 614 | |
| `/popia` | ✓ | Footer | POPIA and data handling | 2 520 / 3 965 | |
| `/privacy` | ✓ | Footer | Privacy policy | 2 317 / 3 716 | |
| `/terms` | ✓ | Footer | Website terms | 2 224 / 3 479 | |
| `/join/sales` | ✗ | Nav Careers | Sell the operating systems SMEs run on. | 4 076 / 6 166 | Deliberately noindex and excluded from the sitemap (`app/sitemap.ts`). Own header ("careers world"). |
| `/workforce` | ✗ | — | — | — | 308 redirect. |

## Routes visitors try that do not exist

| Route | Status | Impact |
|---|---|---|
| `/about` | 404 | No company page; careers header "About Signal One" links to `/`. |
| `/support` | 404 | Existing customers have no support path. |
| `/login` | 404 | No customer sign-in entry (1GUARD web app lives elsewhere). |
| `/faq` | 404 | — |

404 page renders the branded "We could not find that page." with a working footer; it inherits `canonical: "/"` from the layout (low).

## Not covered (stated, not hidden)

- `/connect/*`, `/present/*`, `/qr/*`, `/contact/andisiwe` are disallowed in robots and are Signal Connect (separate product surface); not swept.
- Authenticated surfaces (1GUARD web, Sales OS) — no credentials.
- Real assistive-technology runs (NVDA/VoiceOver), real devices, real network field data.
