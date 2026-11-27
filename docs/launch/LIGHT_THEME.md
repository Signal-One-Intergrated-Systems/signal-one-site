# Light-first public website (THEME, 2026-11-26)

Founder direction (2026-11-26): the public website is too dark for the Signal One brand. It must read as a premium, welcoming enterprise technology and communications company: predominantly white, off-white and light-neutral surfaces, dark readable type, Signal blue accents and **selectively** positioned graphite, with the supplied photography integrated where it fits. Not an inversion. Preserve the locked homepage hero, the globe, the control-room photograph and the identity; do not touch Sales OS or the 1GUARD operational shell.

Branch `wip/light-theme` (worktree `/home/user/site-theme`), merged with the content stream `claude/peaceful-johnson-azma60` up to `935886a`. The constitution is `docs/DESIGN_SYSTEM.md` (rewritten); this file is the evidence and the per-route record.

## 1. The system

**One token layer, two palettes, roles.** Components use role tokens only (`canvas`, `surface`, `surface-2`, `ink`, `ink-2`, `ink-3`, `accent`, `hairline`, `line-strong`, `focus`, `live`, `beta`, `soon`, `danger`). `@theme` declares each role once, pointing at the light palette; a graphite scope and a product-well scope re-point the same roles. So a card, badge, form, link or numbered list is correct on light, in a graphite chapter and inside a product well with no second recipe and no dark-specific class. The palette values exist once each (`--light-*`, `--graphite-*` in `:root`, `app/globals.css`).

| Role | Light | Graphite | Notes |
|---|---|---|---|
| canvas | `#F7F9FB` | `#1E272D` | founder's proposed page tone |
| surface | `#FFFFFF` | `#263138` | cards, panels, inputs |
| surface-2 | `#EDF3F7` | `#2E3A42` | founder's "alternate"; closing bands, hovers |
| ink / ink-2 / ink-3 | `#18242D` / `#435566` / `#56677A` | `#F1F5F9` / `#CBD5E1` / `#A3B1C0` | ink and ink-2 are the founder's proposed text tones; ink-3 added for captions (5.2:1 on surface-2) |
| accent (text) | `#0270A8` | `#7DD3FC` | `#0EA5E9` is never text on light (2.8:1) |
| hairline | `#DCE4EA` | white 16% | founder's proposed border |
| focus | `#0284C7` | `#38BDF8` | 3px ring |

Signal blue `#0EA5E9` stays the primary button fill (with `#0B1118` text, 6.8:1), the product numeral and the mark's dot. The build computes WCAG contrast for every text role on every background in both palettes and fails below 4.5:1 (3:1 for borders and focus) — `scripts/check-design-system.mjs`.

**Page light.** `<main>` carries one gradient: white at the top with a faint Signal-blue daylight from the top right, settling to the canvas. Sections are transparent with a hairline between chapters; a section that continues the one before (`pt-0`) draws no rule. A page's last section sits on `surface-2`, so every page closes on a calm band before the graphite footer.

**Surfaces and depth.** White cards on the off-white canvas, separated by a hairline and a soft cool shadow (no heavy borders). Header: a light-glass pill (white 86% + blur) with the light-surface lockup; solid white over the locked hero's dark band until the page scrolls. Glass on light only over photography (white 80% + blur; solid below 768px and under reduced transparency). Caption chips over photographs are light glass.

**Measured result.** Share of page pixels that are light (luminance ≥ 200/255) in the 1440px full-page captures, photographs and footer included: mean **1.0% before → 74.8% after** (per route 59–89%; the homepage is 59% because the locked hero and the graphite 1GUARD chapter are dark). That is inside the founder's 65–80% target for non-photographic area.

## 2. Where graphite remains, and why

| Place | Why |
|---|---|
| Homepage hero | Founder-locked; untouched (navy glass over the approved photograph). |
| Footer shell | Anchors every page with one strong, quiet close; the dark-tone lockup and the contact block read best there; it frames the light page rather than competing with it. |
| Homepage 1GUARD chapter (`.so-guard-section`) | The operations product, paired with the approved SME control-room photograph (dark monitors). One graphite chapter makes 1GUARD distinct without the whole site reading as an operations centre. |
| `/solutions/security` coverage chapter ("Know which posts are short…", `tone-graphite`) | The control-room story on the 1GUARD page; now carries the `security-operations-review` photograph that filled an empty column. |
| Product screenshot and phone frames, the 1GUARD entry shutter | Product chrome and the 1GUARD product's own motion (the founder: do not change the 1GUARD operational design direction). |

The scope list is enforced: any other graphite selector, or a fifth `tone-graphite` in markup, fails the build.

## 3. Photography

- **Scene backdrops** lost the luminosity toning and the dark wash. They keep their daylight colour under a light veil that holds full strength under the copy column (computed from the hero geometry) and clears beyond it; on `/guards`, where the copy is on the right, the veil is mirrored; below 1024px the veil is even because the copy spans the width.
- **Bright package placed by relevance** (hashes and alt text in `docs/ASSET_PROVENANCE.md`):
  - `/service` hero → `01-restaurant-service` ("Run the day" keeps the existing approved `restaurant-staff-briefing`, so 01 and 08 are never on one page; 08 is not used).
  - `/service` "Manage the team" → `02-team-planning`; "Understand the margins" → `03-stock-and-margins`; "Know what to improve" → `04-performance-review` (these replace three near-identical staff huddles flagged in BRAND_AUDIT VA-16).
  - `/ptt-radio-rental` → `05-radio-rental-workflow`, under the "How the quote works" heading (the column was empty), captioned "Illustrative scene · not actual rental stock".
  - Homepage business introduction backdrop → `06-bright-architecture` (people-free; replaces `business-park` there, so the homepage no longer opens on a security gatehouse).
  - Homepage "1Service staffing · Planned" card → `07-hospitality-welcome` (contextual service panel, not the restaurant-first hero).
- **Existing approved editorial** brought into use: `security-operations-review` on the `/solutions/security` coverage chapter. The other unused editorial images (`hotel-reception-welcome`, `warehouse-security-check`, `security-interview-training`, `facility-reception-service`) were left unused: the founder's supplement asked for selective use, and each would duplicate a subject already shown on its candidate page.
- Unchanged: the locked hero, the approved SME control-room photograph, every manufacturer product image (equipment keeps genuine manufacturer imagery only; E600 has no image).
- **Not acquired:** the Pexels candidates in the package guide (office park, restaurant, warehouse) were not fetched — licence and dimensions unverified, not reachable here. Recommendation: fetch them in an authorised environment as ≥ 2560px people-free masters to replace the 1400px `business-park` / `restaurant-dining` / `warehouse-yard` backdrops (they still upscale on wide screens, VA-18).

## 4. Per-route notes (1440 / 1280 / 1024 / 390 inspected)

- **`/`** — Hero untouched. Light business introduction over the bright architecture; graphite 1GUARD chapter; light equipment section with the content stream's four journey links as compact two-up links; 1Service section over the restaurant backdrop under the light veil; marketplace and steps as white cards; closing band on `surface-2`. The locked block sets light text on `.so-home`; the sections below now take the role ink explicitly (found by screenshot: every heading below the hero was white-on-white after the token switch).
- **`/solutions/security`** — light hero over the business-park veil; graphite coverage chapter with the new photograph; light field, PSiRA, proof and people sections.
- **`/service`** — bright hero photograph; four distinct capability photographs.
- **`/radios-equipment`, `/equipment-marketplace`, `/ptt-radio-rental`** — product wells on white cards; the content stream's journeys (compact cards, no shadow), components and industries (ruled lists), FAQ (44px summary, `+`/`×`), spec blocks (ruled) styled; the rules that sat on the content edge of the `pt-0` continuation sections removed.
- **`/pricing`** — the R2,50 figure in accent on light; calculator and worked-examples table on white.
- **`/contact`, `/get-started`, `/guards/join`, `/join/sales`, `/guard-marketplace`** — white form cards, white inputs with `line-strong` borders, light-blue checked tiles, light error summary on a 6% danger tint, 3px focus ring in signal-600. Trial steps on `/get-started` as a ruled list.
- **`/guards`** — mirrored veil (copy on the right).
- **`/about`, `/support`, `/security-trust`, legal pages** — reading-first, white panels; legal note on `surface-2`.
- **Header** — the content stream's five primary links + two secondary + "Request a 14-day trial" did not fit: labels wrapped to two lines at 1280 and 1440 and the lockup's descriptor ran into "1GUARD". Fixed: one-line labels, the lockup never shrinks, the medium lockup and tighter spacing at 1280–1599px; measured no wrap and no overflow at 1024/1280/1366/1440/1536/1920 on `/`, `/guards`, `/join/sales`. (The header's link sizing had been in Tailwind utilities that silently beat the component rule; moved to the rule.)
- **404 / error** — light, inherit the system.
- **Older layout defects found and fixed on the way:** at 1024px a split hero gave the photograph 272px (copy column fixed at 38rem) and `/guards` put its copy in that narrow column (columns not mirrored for photo-left heroes); the copy column now narrows `clamp(28rem, 46vw, 38rem)` and mirrors. Closing-band buttons squeezed into three-line circles at 1024px; a button no longer shrinks below its label.

## 5. Evidence

`docs/launch/evidence/light/` (≈20 MB): `before/` and `after/` full-page captures of all 21 routes at 1440, 1280, 1024 and 390px (reduced motion, deviceScaleFactor 1; archived at 50% scale for the desktop widths and 75% for 390, JPEG q55), and `sheets/<route>.jpg` pairing before/after at 1440 and 390. Full-resolution captures were judged during the work. Note: the *before* set was captured at `8fee456`, before the content stream's copy changes merged, so copy differs between the pairs.

## 6. Remaining issues (not resolved here)

1. Scene backdrops are 1400px masters and upscale on wide screens (VA-18); the light veil hides most of the softness. Needs the ≥ 2560px masters (Pexels candidates above, or commissioned).
2. Several editorial photographs carry fictional security-company branding on uniforms (`security-site-planning`, `security-operations-review`, …): the open founder ruling IMAGE_INVENTORY #9 applies; captions say "fictional security company".
3. The locked hero keeps its own dark navy band above and below the photograph; the light header pill now sits on it as solid white. Any change to the hero itself is a founder decision.
4. Role-token names replaced the dark-stage names in markup (`text-ink-2` for `text-text-inv-2`, etc.) by a deterministic rename; any branch still using the old utilities fails the design check until renamed (intended).
5. `docs/CONTRAST.md` is the 2026-11 measured audit of the dark site; the build's computed role-pair check supersedes it for the light system, and a fresh measured audit (rendered pages, text over photographs) should be rerun before release.

## 7. Tests

All runs under `flock /tmp/claude-0/site-e2e.lock`, `timeout 1800`, `PW_CHROMIUM=/opt/pw-browsers/chromium`, suite ports cleaned before and after.

- `npm run build` (prebuild branding + design checks, postbuild rendered-truth check): RC 0; design contract **29/29**.
- Full suite on the theme branch before the content-stream merges: **440 passed, 0 failed, 84 skipped** (opt-in evidence suites).
- Full suite on the merged tree (`ea1837d`, content stream `935886a`): **452 passed, 1 failed, 84 skipped**. The failure is `audw-fixes.spec.ts` "AUDW-05/06 an empty quote lists natural sentences": it expects the summary link "Choose whether to buy or rent.", and the content stream's `EquipmentQuoteForm.tsx` now asks "What do you need?" with the error "Choose what you need." Copy and test are both the content stream's (this branch's diff to that file is the utility rename only); left for the coordinator.
- After the last CSS change (ultra-wide cap for the architecture backdrop): visual-mission, homepage-growth, image-scale, design-contract, visual-corrections and a11y specs: **224 passed, 0 failed**.
- Tests changed, each because the founder's light-first decision changed the expected value (no contrast, accessibility or truth assertion loosened): `sitewide-glass-contrast.spec.ts` (labels `#18242D` on white inputs, was light-on-graphite), `visual-mission.spec.ts` (the `/service` hero, the homepage 1Service staffing card and the business-introduction backdrop now use the bright package).
