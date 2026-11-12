# Website UX workstream: required corrections (founder-confirmed 2026-11-12)

These were observed on the live site (commit `fdbdfa2`) at 1440, 768 and 390 px and confirmed by the founder from the captures.
They are **required corrections for the parallel UX workstream**. They are **not** part of R0, which must not become a redesign.

| # | Where | Defect | Evidence (capture) |
|---|---|---|---|
| 1 | Homepage, all widths | Pale green band behind the navigation; off the deep-navy brand | `live-*-home-top` |
| 2 | Homepage, desktop | Globe barely visible; "Johannesburg" label clipped at the left edge | `live-desktop-home-top` |
| 3 | Homepage, tablet | Hero photograph has side gutters instead of running edge to edge | `live-tablet-home-top` |
| 4 | Homepage, ecosystem section | Warm brown/gold cast on imagery, contrary to the photography direction | `live-desktop-home-50` |
| 5 | Homepage | Excessive length: 11.7 screens at 1440x900, 16.7 at 390x844 | page-height measurement |
| 6 | /get-started, mobile | Intro card, photograph and email notice sit before the first question | `live-mobile-get-started-top` |

Constraints: keep the approved hero composition, logo geometry, Inter, Signal Blue, the blue numeral, the floating glass pill and reduced-motion support.
Each correction ships with before/after captures at three widths for founder approval.
