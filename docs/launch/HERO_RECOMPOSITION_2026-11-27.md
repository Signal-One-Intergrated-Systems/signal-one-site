# Homepage hero recomposition — 2026-11-27

Founder directive of 2026-11-27, "Hero, hardware and navigation". This change is on staging only: branch `claude/peaceful-johnson-azma60`, draft PR #102, staging https://web-staging-review-production.up.railway.app. **It is not in production.**

## What changed

| Directive | Implemented |
|---|---|
| The actual radio is the interactive hero element | The official Hytera P30 Lite cut-out (1200 px, from Hytera's own product image set; see `docs/ASSET_PROVENANCE.md`) stands on the photograph's foreground paving. **Hover:** perspective tilt, highlight on the push-to-talk key, and a "Press to connect" label. **Click, tap or Enter:** a short press, a vibration where supported, three restrained signal rings, then navigation to `/radios-equipment`. It is a real link, so keyboard and no-JavaScript use work. With reduced motion it navigates at once. It navigates only and never transmits. |
| Radios first | "Buy or rent radios" is the primary action and "Explore 1GUARD" the secondary. The 14-day trial is not in the hero or the header; it stays in the homepage 1GUARD section and on the 1GUARD pages. |
| Prefer unobstructed imagery and a subtle gradient over the glass panel | No glass panel. Dark ink sits on the photograph's own sky over a light left-hand gradient. The copy never covers anyone in the photograph. |
| Keep the current photograph until the founder chooses | The approved photograph is unchanged and shown whole, never cropped or upscaled (see below). Swapping it is one `src` change plus a re-measure. |
| Globe | Kept as atmosphere at low opacity in the sky behind the copy. On phones and tablets it sits faint behind the copy. |
| Floating glass header, no trial button | As built in the depth work (`fcefe79`), unchanged here. |

### Layout by width

- **From 1024 px:**
  - The whole photograph by width, in a box with the photograph's own proportions, so there are no bands.
  - Above the photograph's native 1,672 px it becomes a centred, framed stage at native size and is never upscaled (brief §5, A6).
  - The copy sits on the sky beside the people, and the radio stands on the paving.
  - The business-areas rail sits below the photograph, never over the people, and is either shown whole or kept wholly below the fold.
  - Between 1024 and 1279 px the quoting note under the buttons is hidden, so the radio stands clear.
- **Below 1024 px:** the whole photograph is a full-width band under the header. The copy sits on light material beneath it, and the radio stands at the band's lower left, clear of the people.

## Contrast over the photograph (WCAG, measured)

Method: the text was hidden, the pixels behind each text box were sampled, and the worst 3% was used.

| Element | Worst contrast | Requirement |
|---|---|---|
| Headline | ≥ 10.0:1 | |
| "As one." | ≥ 3.9:1 | Large text, 3:1 |
| Eyebrow | ≥ 5.8:1 | |
| Lead paragraph | ≥ 5.2:1 | |
| Quoting note | ≥ 6.3:1 | |

These figures cover 1200, 1280, 1440 and 1920 px. Below 1024 px the copy sits on light material, at 5.3:1 or better. The independent review measured the lead at ≥ 4.68:1 on the earlier staging build.

## Independent review and what was done

An independent reviewer inspected staging at 9 viewports plus an emulated iPhone 13. Its verdict on build `b9ec826` was **FAIL**, with 2 S1 and 5 S2 findings. The findings and what was done:

| Finding | Action |
|---|---|
| **S1-1:** every internal navigation runs a 3.3–4.4 s glass shutter and splash | **Founder decision.** The shutter is the founder-approved 1GUARD entry transition (`docs/DESIGN_SYSTEM.md`), and the design contract enforces it. The hero radio now skips it, because its press is its own transition; this is proven by a mutation test. Recommendation: shorten the site-wide shutter so a navigation completes in under about 1 s, or keep it only for 1GUARD routes. This needs your decision. |
| **S1-2:** dark slab and seams beside the photograph at 1920 px and wider | Fixed: a box with the photograph's own proportions, and a framed stage above 1,672 px |
| **S2-3:** the radio was about 4× too large and looked as if it floated | Fixed: scaled to a foreground object near the camera (143 px tall at 1440) with a firmer contact shadow |
| **S2-4:** the rail and the caption pill covered people; the touch label covered the woman | Fixed: the rail moved below the photograph, the pill moved to the top right, and on touch the label opens above the antenna |
| **S2-5:** a sliver of the rail at the fold; the radio cut off at 1366×768 | Fixed: the rail is whole or wholly below the fold, and the radio stays inside the first screen. A test covers 360 to 2560 px. |
| **S2-6:** placeholder wells reading "Manufacturer image to follow" | Fixed: the wells say why there is no picture, and the service card no longer claims a manufacturer image |
| **S2-7:** the homepage 1GUARD card looked unbalanced | The photograph and the screenshot slot are now one column. Balance improves further once genuine screenshots exist (below). |
| **S3** | Fixed: one button colour, and the signal-blue "1" in the rail. Still open: the mobile menu pill padding, globe labels on phones, the eyebrow repeating the logo, the link underline breaking at the blue "1", the footer "×", the length of `/radios-equipment` on mobile, empty space in the pricing calculator, and a truncated placeholder on `/get-started`. |

## 1GUARD screenshots: captured, not published

- **What was captured:** genuine screens of the 1GUARD web app (commit `f43e995`) running locally on its own demo seed with synthetic activity: the control-room queue, the live watch view, the occurrence book, proof of service with evidence, and the client portal. Nothing was edited.
- **Why they are not published:** they fail the site's capture standard (`docs/PHOTOGRAPHY_BRIEF.md`, "Product capture") and the image OCR gate:
  - "Signal One Demo Security", "Demo Guard" and "Demo Checkpoint" labels;
  - raw codes such as `SUSPICIOUS_ACTIVITY` in the queue;
  - US-format dates (`11/27/2026, 10:08 AM`).
- **What is needed:**
  1. The curated demo tenant the brief describes.
  2. Two changes in the 1GUARD app: en-ZA dates, and reasons phrased in words rather than codes.
- **App defect found while capturing:** `packages/domain/src/operational-state.ts` (about lines 572–575) counts verified checkpoints across every patrol in a shift, not only the current round. A second round showed "5 of 5" after only 3 scans.
- **Status:** the slots stay empty, and a test enforces that.

## Verification

- `npm run build` RC=0; the design contract passed 36/36, and the public-truth checks passed on source and rendered output.
- The full e2e suite on the final tree, with the e6c7611 changes in the working tree before commit: **478 passed, 0 failed, 84 skipped**. The skipped tests are opt-in evidence capture.
- The founder-lock tests were updated for this authorised change:
  - `tests/fixtures/locked-home-hero.txt` was refreshed;
  - the crop measurements were re-measured (1440 → 1440×810, 1280 → 1280×720, 1024 → 1024×576, all `contain`; 390 → 390×219, the whole photograph);
  - the "never object-fit: cover on desktop" rule is kept.
- The new hero tests (`tests/e2e/depth.spec.ts`) cover:
  - the composition at 2560, 1920, 1680, 1440, 1366, 1280, 1024, 768, 390 and 360 px;
  - keyboard and Enter;
  - reduced motion;
  - no JavaScript;
  - skipping the shutter.
- Controls were proven by mutation:
  - Rendering "covered" instead of "sealed" turned the glass-navigation test red. Before that it polled for a short-lived state and failed intermittently on the unchanged tree as well (2/8 on `9aed64a`, 1/8 on `b9ec826`), so it now records every phase.
  - Restoring the shutter for the radio turned its test red.
  - After each restore and rebuild, the test passed again.
- A defect of my own, found by the full suite and fixed: my rail colour rule turned the blue "1" of the product wordmarks to ink.

## Decisions for the founder

1. Visual acceptance of the recomposed hero on staging.
2. The site-wide glass shutter duration (S1-1 above).
3. The hero photograph: choose one of the three candidates, or keep the current one.
4. The curated 1GUARD demo tenant and the two app changes, before screenshots can be published.

## Evidence files

Before and after captures are in `docs/launch/evidence/hero-v3/`:

- `before-{1440,1280,1024,390}.jpg`: staging at `9aed64a`.
- `after-{1920,1440,1280,1024,390}.jpg`: staging at `e6c7611`, captured after its deploy.
