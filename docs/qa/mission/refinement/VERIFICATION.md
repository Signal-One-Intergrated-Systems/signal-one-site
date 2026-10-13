# Verification of the final visual refinement

**215/215 Playwright checks pass (4.5 minutes).** This preserves the original 213-check baseline and adds two meaningful tests for the visible workflow's method/record/scope progression, anchored photograph, keyboard focus and mobile accessibility across every inline state. Production build, TypeScript and lint pass. The suite also passes source/rendered branding, public-truth and image OCR gates, acquisition variants, intake fallback/success, model-specific quotation, SEO/canonical and image-resolution checks. Logs are in `logs/`.

The final implementation was frozen before these checks. Two earlier interrupted runs are preserved separately: the first exposed an incorrect new exact-text selector and genuine 320/360px equipment-grid overflow; the second was paused to move mobile model controls onto the image. They are not acceptance runs. The final run has zero failures.

## Visual geometry and browser evidence

- 108 route/width combinations: all 200, no horizontal overflow. Principal routes and widths match the original mission matrix; refreshed full-page captures are in `../after/`, with `../after/viewport-checks.json`.
- 27 inline workflow state/width combinations: no overflow; identical panel heights across all three states at each width. Evidence: `after/state-layout-checks.json`.
- Actual desktop/tablet/mobile screenshots and raw desktop/mobile videos are linked and critiqued in [the refinement review](REVIEW.md). Mobile tracker selection was inspected in the actual recording, with the image and model heading visible together.
- Reduced motion disables the connector, row/stage arrivals and animated equipment return; all manual controls remain. Existing modal keyboard containment, cold-loading protection, Escape and focus restoration pass. Inline manual progression focuses the new heading; roving tabs retain keyboard navigation.
- Asset/source resolution checks pass at 1440/1920/2560, DPR 1. High-DPR commissioned photography and genuine approved product captures remain dependencies. Automated axe checks are evidence, not a WCAG certification.

## Performance methods

Fresh Lighthouse 13.5 measurements ran serially against the final local production build, after browser regression/capture workloads finished. Direct `devtools` and default `simulate` reports are kept separately in `lighthouse/`, for home, pricing and equipment. Direct throttling retains Lighthouse defaults: 4× CPU, 562.5ms request latency, 1474.56Kbps download and 675Kbps upload. No easing of the profile, best-run selection or field-vitals claim is used. Browser sessions are cold; the local server's image cache has been warmed by verification.

| Route | Direct performance | Direct LCP | Simulated performance | Simulated LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 97 | 1.951s | 95 | 2.966s | 0 |
| Equipment | 98 | 1.833s | 99 | 2.074s | 0 |
| Pricing | 98 | 1.812s | 99 | 1.883s | 0 |

All six reports score 100 for accessibility, best-practices and SEO. Direct home/equipment LCP remains below 2.5s. The home simulation increased from the baseline's 2.810s to 2.966s; it still misses that target. Equipment is below 2.5s in both fresh methods. Individual synthetic results vary and are not field Core Web Vitals; deployed-preview and eventual field validation remain outstanding. The added visible product narrative is not presented as a uniform performance improvement.

The numerical reports in `../lighthouse/` belong to the earlier `09ba68f` baseline and remain preserved for comparison. This refinement preserves native eager/high-priority responsive hero loading, local Inter, intent-loaded expanded demo assets and progressive server-rendered equipment presentation. It adds the small visible workflow client component and reuses approved photos/manufacturer images without changing their source masters.

## Unresolved acceptance

Current browser attempts still fail for ATEX/public Signal One/preview under enforced revision 24 with no custom allowed hosts. [Exact recovery configuration](NETWORK_RECOVERY.md). No live benchmark comparison or final live-preview browser review is claimed. The GitHub review was recovered after the transient file-transfer 503; local/remote branch identity was verified before continuing. Real intake delivery, authentic software capture, commissioned photos, missing exact hardware assets and founder preview approval remain outstanding. Technical success does not establish complete visual acceptance.
