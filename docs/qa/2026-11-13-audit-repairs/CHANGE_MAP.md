# Phase 2 change map

Phase 1 captures (commit `81d3179`, `/home/claude/audit-out/screenshots`) against Phase 2 captures (commit `3b2362b`, `/home/claude/audit-out/phase2/screenshots`).

Method: `scripts/audit/diff-phases.mjs`. Light scheme, DPR 1, viewports 1440x900 / 820x1180 / 390x844. "Fold" compares the above-the-fold PNGs pixel by pixel; "full" compares the scroll-stitched strips (height, and pixels when the height is unchanged). A pixel counts as changed when any channel differs by more than 24. A route x viewport is CHANGED at 0.02% of pixels or any height difference.

| Route | Viewport | Changed? | Fold diff | Full page | Explained by |
|---|---|---|---|---|---|
| /connect/unknown | desktop | no | 0% | 0.009% | no visible change |
| /this-page-does-not-exist | desktop | yes | 1.751% | 1.137% | D-033 `e91f089` (product named 1GUARD) |
| /connect/andisiwe | desktop | no | 0% | 0% | no visible change |
| /contact | desktop | yes | 0.059% | 0.096% | D-006 `4fc96b2` (accent links/kickers on dark) |
| /equipment-marketplace | desktop | yes | 0% | 0.237% | D-006 `4fc96b2` (accent links/kickers on dark); D-005 `4fc96b2` (outline button labels); D-006 `4fc96b2` (link over photograph now `text-text-inv`) |
| /get-started | desktop | no | 0.008% | 0.01% | no visible change |
| /guard-attendance-software | desktop | yes | 0.251% | 0.119% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD) |
| /guard-marketplace | desktop | yes | 0% | height 4901 -> 4879 px (-22) | D-006 `4fc96b2` (accent links/kickers on dark); D-005 `4fc96b2` (outline button labels); D-006 `4fc96b2` (link over photograph now `text-text-inv`); D-033 `e91f089` (product named 1GUARD) |
| /guard-patrol-software | desktop | yes | 0.578% | 0.194% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD) |
| /guards | desktop | yes | 1.446% | 0.372% | D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /guards/join | desktop | yes | 0.099% | 0.054% | D-006 `4fc96b2` (accent links/kickers on dark) |
| / | desktop | yes | 9.766% | height 10543 -> 9304 px (-1239) | D-010 `b1cd237` (navy hero fill); D-011 `e3cd729` (section spacing, page height); D-018 `992bd5e` (disclosure line indent); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /join/sales | desktop | yes | 0.607% | 0.179% | D-009 `41a9254` (sharper image variant, same box) |
| /popia | desktop | yes | 2.297% | 1.622% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark) |
| /present-andisiwe | desktop | no | 0% | 0.005% | no visible change |
| /pricing | desktop | yes | 0.22% | height 3965 -> 4063 px (+98) | D-006 `4fc96b2` (accent links/kickers on dark); ruling 4 `6e6b142` (Accounting/Payroll future-capabilities group); D-033 `e91f089` (product named 1GUARD) |
| /privacy | desktop | yes | 2.977% | 1.781% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark) |
| /ptt-radio-rental | desktop | yes | 0.157% | 0.275% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /radios-equipment | desktop | yes | 0.102% | 0.208% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /security-trust | desktop | yes | 2.58% | 1.812% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD) |
| /service | desktop | no | 0% | 0% | no visible change |
| /solutions/security | desktop | yes | 18.561% | height 6540 -> 6513 px (-27) | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-004 `dd92d1c` (stray \n removed); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /terms | desktop | yes | 2.785% | 1.534% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD) |
| /workforce (redirects to /service) | desktop | no | 0% | 0% | no visible change |
| /connect/unknown | tablet | no | 0% | 0.015% | no visible change |
| /this-page-does-not-exist | tablet | yes | 2.064% | 1.492% | D-033 `e91f089` (product named 1GUARD) |
| /connect/andisiwe | tablet | no | 0% | 0.001% | no visible change |
| /contact | tablet | yes | 0.304% | 0.13% | D-006 `4fc96b2` (accent links/kickers on dark) |
| /equipment-marketplace | tablet | yes | 0.298% | 0.379% | D-006 `4fc96b2` (accent links/kickers on dark); D-005 `4fc96b2` (outline button labels); D-006 `4fc96b2` (link over photograph now `text-text-inv`) |
| /get-started | tablet | yes | 0.311% | 0.135% | D-006 `4fc96b2` (accent links/kickers on dark); A-001 `0e8a97c` (stepper numerals); D-009 `41a9254` (sharper image variant, same box) |
| /guard-attendance-software | tablet | yes | 0.338% | 0.174% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD) |
| /guard-marketplace | tablet | yes | 0% | 0.626% | D-006 `4fc96b2` (accent links/kickers on dark); D-005 `4fc96b2` (outline button labels); D-006 `4fc96b2` (link over photograph now `text-text-inv`); D-033 `e91f089` (product named 1GUARD) |
| /guard-patrol-software | tablet | yes | 1.714% | 0.464% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD) |
| /guards | tablet | yes | 1.507% | 0.414% | D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /guards/join | tablet | yes | 0.133% | 0.091% | D-006 `4fc96b2` (accent links/kickers on dark) |
| / | tablet | yes | 13.777% | height 11465 -> 10921 px (-544) | D-010 `b1cd237` (navy hero fill); D-011 `e3cd729` (section spacing, page height); D-018 `992bd5e` (disclosure line indent); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /join/sales | tablet | yes | 0.092% | 0.07% | D-009 `41a9254` (sharper image variant, same box) |
| /popia | tablet | yes | 3.874% | 2.221% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark) |
| /present-andisiwe | tablet | no | 0% | 0% | no visible change |
| /pricing | tablet | yes | 0.295% | height 4503 -> 4601 px (+98) | D-006 `4fc96b2` (accent links/kickers on dark); ruling 4 `6e6b142` (Accounting/Payroll future-capabilities group); D-033 `e91f089` (product named 1GUARD) |
| /privacy | tablet | yes | 4.338% | 2.532% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark) |
| /ptt-radio-rental | tablet | yes | 0.215% | 0.412% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /radios-equipment | tablet | yes | 0.137% | 0.242% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /security-trust | tablet | yes | 3.548% | 2.488% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD) |
| /service | tablet | no | 0% | 0% | no visible change |
| /solutions/security | tablet | yes | 4.664% | height 8464 -> 8437 px (-27) | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-004 `dd92d1c` (stray \n removed); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /terms | tablet | yes | 3.764% | 2.066% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD) |
| /workforce (redirects to /service) | tablet | no | 0% | 0% | no visible change |
| /connect/unknown | mobile | no | 0% | 0.002% | no visible change |
| /this-page-does-not-exist | mobile | yes | 16.381% | height 2058 -> 2031 px (-27) | D-033 `e91f089` (product named 1GUARD) |
| /connect/andisiwe | mobile | no | 0% | 0.033% | no source change; fold identical, 124 px differ in rows 28-66 of the stitched strip (header mark animation phase) |
| /contact | mobile | yes | 0.233% | 0.211% | D-006 `4fc96b2` (accent links/kickers on dark) |
| /equipment-marketplace | mobile | yes | 0% | 0.625% | D-006 `4fc96b2` (accent links/kickers on dark); D-005 `4fc96b2` (outline button labels); D-006 `4fc96b2` (link over photograph now `text-text-inv`) |
| /get-started | mobile | no | 0% | 0% | no visible change |
| /guard-attendance-software | mobile | yes | 0% | 0.311% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD) |
| /guard-marketplace | mobile | yes | 0% | height 8021 -> 7957 px (-64) | D-006 `4fc96b2` (accent links/kickers on dark); D-005 `4fc96b2` (outline button labels); D-006 `4fc96b2` (link over photograph now `text-text-inv`); D-033 `e91f089` (product named 1GUARD) |
| /guard-patrol-software | mobile | yes | 4.189% | 0.759% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD) |
| /guards | mobile | yes | 4.721% | 0.731% | D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /guards/join | mobile | yes | 0.036% | 0.14% | D-006 `4fc96b2` (accent links/kickers on dark) |
| / | mobile | yes | 5.059% | height 14130 -> 13802 px (-328) | D-010 `b1cd237` (navy hero fill); D-011 `e3cd729` (section spacing, page height); D-018 `992bd5e` (disclosure line indent); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /join/sales | mobile | yes | 0.073% | 0.093% | D-009 `41a9254` (sharper image variant, same box) |
| /popia | mobile | yes | 4.502% | 3.624% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark) |
| /present-andisiwe | mobile | no | 0% | 0.04% | no source change; fold identical, 158 px differ in rows 28-66 of the stitched strip (header mark animation phase) |
| /pricing | mobile | yes | 0.575% | height 5470 -> 5590 px (+120) | D-006 `4fc96b2` (accent links/kickers on dark); ruling 4 `6e6b142` (Accounting/Payroll future-capabilities group); D-033 `e91f089` (product named 1GUARD) |
| /privacy | mobile | yes | 5.428% | 3.988% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark) |
| /ptt-radio-rental | mobile | yes | 0% | 0.71% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /radios-equipment | mobile | yes | 0% | 0.39% | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /security-trust | mobile | yes | 5.253% | 3.768% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD) |
| /service | mobile | no | 0% | 0% | no visible change |
| /solutions/security | mobile | yes | 6.918% | height 9903 -> 9847 px (-56) | D-006 `4fc96b2` (accent links/kickers on dark); D-007 `4fc96b2` (photo caption); D-004 `dd92d1c` (stray \n removed); D-033 `e91f089` (product named 1GUARD); D-009 `41a9254` (sharper image variant, same box) |
| /terms | mobile | yes | 4.875% | 3.31% | D-001/D-002 `e46f349` (readable body copy); D-006 `4fc96b2` (accent links/kickers on dark); D-033 `e91f089` (product named 1GUARD) |
| /workforce (redirects to /service) | mobile | no | 0% | 0% | no visible change |

Compared 72 route x viewport pairs; 55 changed; 0 changed without a mapped fix.

## Notes

- **Unchanged (17 pairs):** /service and /workforce (all viewports), the Connect routes `/connect/andisiwe`, `/present/andisiwe` and the Connect 404 (all viewports), /get-started at desktop and mobile. On /get-started desktop the only visible change is the four stepper numerals (A-001), 0.008% of the fold, below the 0.02% threshold; see `before-after/get-started-stepper-1440.jpg`.
- **Connect routes:** no Connect source file changed between the two commits (`git diff --stat 81d3179 3b2362b -- "app/(connect)" app/_connect` is empty). Their above-the-fold PNGs are pixel-identical. The stitched strips differ by 6 to 158 pixels in rows 28 to 66 (the mark in the Connect header, caught at a different animation phase); on the two mobile strips that is 0.033% and 0.04% of the image, above the threshold only because the image is small. Counted as capture noise, not as a change.
- **Height changes:** / (D-011: 10,543 -> 9,304 px desktop, 11,465 -> 10,921 tablet, 14,130 -> 13,802 mobile); /pricing +98 / +98 / +120 px (the future-capabilities heading and sentence, ruling 4); /solutions/security -27 / -27 / -56 px (the stray `\n` line removed, D-004); /guard-marketplace -22 px desktop and -64 px mobile and the marketing 404 -27 px mobile (shorter product name re-wraps a line, D-033).
- **Largest fold differences:** /solutions/security desktop 18.6% and / 5 to 14% are the hero photograph decoded from a larger variant (D-009) and, on /, the navy fill (D-010). The legal and trust pages change by 2.3 to 5.4% (body copy colour, D-001/D-002).
- The "Explained by" column lists the repairs that touch that route's source or its rendered classes. The visual effect of each was checked on the composites in `before-after/`.
- Extra captures at 1024 and 1280 px for / and /privacy are in `screenshots/w1024/` and `screenshots/w1280/`; there is no Phase 1 capture at those widths to diff against (before/after composites at 1024 px: `before-after/home-top-1024.jpg`, `before-after/nav-1024-menu-open-*.jpg`).

## Final release check (2026-11-14), compared against 9b0aa95

72 route x viewport pairs compared, 36 changed.

| Routes changed (all three viewports) | Cause |
|---|---|
| / | caption pills on three notes (a4a2018); panel photo `sizes` (947dd1b) |
| /pricing | future-capabilities section (cf94306); kicker ink (a4a2018) |
| /solutions/security, /guards, /join/sales | kicker and Pilot label ink (a4a2018); photo column 1024-1185 px (b50ae23) |
| /guard-patrol-software, /guard-attendance-software, /ptt-radio-rental, /radios-equipment, /guard-marketplace, /equipment-marketplace | kicker, caption and related-link ink over photographs (a4a2018) |

Unchanged: /contact, /get-started, /guards/join, /service, /workforce, /privacy, /popia, /terms, /security-trust, marketing 404, and the three Connect routes at desktop and mobile.
The three Connect routes differ at tablet by 0.02 to 0.04% of the full-page strip with identical folds; no Connect, API, config, dependency or public file changed in this round (animated header mark, capture noise).

## After the delta review (compared against 8291d1b)

| Change | Cause |
|---|---|
| / : Pilot label background back to the tint it has on main | RD-01 |
| / at 670 px and narrower: hero note pill 1 px narrower on the right; text position identical to main | RD-02 |
| Header: focus parked on the header's first link when the sheet closes on widening past 1280 px (no visual change) | RD-03 |

Document heights unchanged (1440: 9,304 px; 390: 13,802 px).
