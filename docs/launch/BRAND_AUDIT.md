# Signal One public website: visual brand audit (Workstream A2)

**Subject:** live https://signalone.co.za, captured 2026-11-25 (production = `origin/main` @ `8e89d24`).
**Root-cause references** are to `origin/main` @ `8e89d24`, not to the working tree (another engineer has uncommitted changes on `claude/peaceful-johnson-azma60`).
**Not repeated here:** DR-001…DR-025 (referenced where they interact), the founder decisions to move radios above 1Service and to standardise the name to 1GUARD.
**Severity used here:** **S1** systemic, visible on every page or on a priority journey (home, 1GUARD, radios/rental, quote form); **S2** visible inconsistency in one component family or page family; **S3** polish.

## 1. Method and evidence

| Step | What was done | Evidence (all paths relative to `ws-a2/`) |
|---|---|---|
| Rendered capture | 20 routes (19 live + a 404 probe) × 1440×900 and 390×844, plus 1280×720 and 768×1024 for `/`, `/radios-equipment`, `/ptt-radio-rental`, `/solutions/security`. Fresh context per page, deviceScaleFactor 1, scrolled one viewport at a time with 1.9 s settle for the reveal choreography, then a full-page capture. 48 page loads, 312 viewport frames. | `shots/vp/<route>/<d1440|m390|l1280|t768>_NN.jpg`, `shots/full/<route>__<vp>.jpg` |
| Human inspection | Frames were viewed through chunked contact sheets (4 desktop or 8 mobile frames per sheet): every 1440 sheet of `/`, `/solutions/security`, `/radios-equipment`, `/guard-marketplace`, `/service`, `/contact`, `/get-started`, `/guards/join`, `/equipment-marketplace`; the first 1440 sheet of every other route; all 390 sheets of `/`; first 390 sheet of `/solutions/security`; first 768 sheet of `/`, `/radios-equipment`, `/solutions/security`; first 1280 sheet of `/`; and the cross-page comparison sheets (every hero at 1440 and 390, every closing CTA, 404 vs legal). Remaining sheets were generated but covered only by the measurements and comparison sheets. | `shots/sheets/<route>__<vp>_N.jpg` (85 sheets incl. comparisons) |
| Computed-style inventory | Every rendered element on every route at both widths (≈ 25 000 element records): colours, gradients, shadows, opacity, backdrop-filter, type, radii, containers, section padding; headings, buttons, fields, badges, icons. Colours clustered at ΔE76 < 3 with alpha ± 0.05; radii and sizes listed exactly. | `data/<route>__<vp>.json`, `data/analysis.md` (full tables, also Appendix A) |
| Interaction states | Every distinct link/button variant on every route: base, hover (450 ms settle) and keyboard focus-visible, with clip screenshots. | `data/states.json`, `shots/states/*.jpg` |
| Form states | 7 form routes × 2 widths: empty submit to trigger client validation. **No form was filled or submitted**; every non-GET request was aborted at the network layer as a second safeguard. | `shots/forms/*.jpg`, `shots/sheets/forms_validation.jpg` |
| Images | Every `<img>` and CSS photo background (130 placements, 23 assets), downloaded from live, measured (mean colour, CCT, saturation, luminance, product bounding box) and compared with manufacturer masters fetched from www.hytera.com and wiki.teltonika-gps.com (www.teltonika-gps.com redirect was refused by this sandbox). | `IMAGE_INVENTORY.md`, `data/imgstats.json`, `shots/sheets/images_*.jpg`, `shots/sheets/product_vs_manufacturer.jpg` |
| Cross-page comparison | Contact sheets of every hero at 1440 and 390, every closing CTA + footer at 1440, 404 vs legal pages. | `shots/sheets/compare_*.jpg` |

**Limits.** Chromium only; DPR 1 captures (retina effects are computed, not photographed); no real devices; hover captured after a fixed 450 ms; the "empty space below content" measure in `data/analysis.md` ignores `dl/dt/dd` rows and over-reports on `/solutions/security` (PSiRA) and `/pricing` (calculator) — those two were checked visually and are not findings. Success, loading and server-error states of the forms could not be produced without submitting (DR-001 makes the success state an email hand-off anyway).

## 2. Verdict

The site has an approved, coherent intent (graphite stage, restrained glass, Inter, Signal blue, framed illustrative people, genuine manufacturer products) but the rendered result is **not one system**. The CSS has been corrected by appending ever-more-specific overrides rather than by changing tokens: across `globals.css`, `marketing-system.css` and `home-conversion.css` there are 293 distinct hex literals, ~590 distinct `rgb/rgba` literals, **579 `!important`**, 34 distinct blur radii and 97 distinct shadow declarations. The consequences are measurable on the page:

- 49 background, **73 text** and 42 border colour values in use (35 / 35 / 25 clusters) for a design system that documents ~25 colour tokens; the dark stage is split between a warm graphite (`#282a28`, `#252b2e`, `#171d21`) and the older navy (`#06182b`, `#0c2b44`, `#0d2339`), ΔE ≈ 18 apart, often in the same component.
- 65 font sizes, 122 line-heights, 59 letter-spacings and 15 font weights (seven of them, 720–850, only on the homepage); **eight different H1 sizes** at 1440.
- 26 rendered glass recipes, 27 shadows, 19 radii.
- 4 primary-button heights, 3 secondary-button styles, up to 3 renderings of the same status label.

The homepage runs a parallel design system (`so-*` classes, own type scale, own spacing, own header material); every interior page shares a second one; `/get-started` uses raw Tailwind defaults. Nothing here needs new art direction: it needs one token layer and deletion of the override layers.

## 3. Token inventory (summary — full tables in Appendix A)

### 3.1 Colour clusters and classification

| Role | Rendered clusters (uses) | Classification |
|---|---|---|
| Accent fill | `#0ea5e9` (127 bg) | Token-consistent (`signal`). |
| Dark stage, graphite | `#282a28` (90), `#202323/.60` (64), `#1b2327` (30), `#171a1b/.86` (29), `#172126/.87` & `/.67` (header pill, 39), `#191d1e/.63`, `#1a1d1e/.73`, `#202a30`, `#26343c` | Approved direction (2026-11-15 "quiet graphite") but **no token exists**: 10 near-duplicates, nearest documented token `raised #1c222b` at ΔE 3.7–8.8. Inconsistency (needs tokenising). |
| Dark stage, navy | `#06182b/.80` inputs (48), `#0d2339/.78` cards (28), `#0c2b44/.70` choice chips (26), `#0c2741`, `#051729/.69`, `#081a2c` hero fill, 404 gradient `#132e47→#274960` | Leftover of the 2026-10-29 navy direction. **Inconsistency** — ΔE ≈ 18 against the graphite they sit on. |
| Product well | `#eef2f4`, `#f5f7fa` (79) | Functional variant (manufacturer products on neutral wells, approved 2026-11-15). |
| Light status tints on dark | `#e6f4fb`, `#fbf0dc`, `#e8e9ec`, `#d9ebf8` | Inconsistency: light-surface status variants now render on graphite because the sections they assume are light were recoloured (VA-08). |
| Body text on dark | `#c7d8e3`×702, `#c9ddeb`×221, `#cbd5e1`×150, `#c4d6df`×78, `#daeaf6`×188, `#e7eef0`×258 | Six values for one role (`text-inv-2`). Inconsistency (all pass contrast). |
| Headings on dark | `#f2f9ff`, `#f1f5f9`, `#f3f9ff`, `#f4f9ff`, `#f3faff`, `#eaf6ff`, `#f2f5f5` (≈1 080) | Seven values for one role (`text-inv`). Inconsistency. |
| Accent text/links | `#7dd3fc` (230), `#38bdf8` (176), `#8cdcff` (51), `#a5e0ff`/`#9edfff` (51), `#9bc7e3`, `#6fd1ff`, `#8bcaea` | Seven blues for "accent text on dark". Inconsistency (VA-26). |
| Muted/caption | `#94a3b8` (81), `#aabecb` (80) | Two values for `text-inv-3`. |
| Label on fill | `#0b1118` (72), `#061925`/`#071827`/`#031827` (99) | Four near-blacks for one role (`on-signal`). |
| Borders | `#d5dde6` (176, light wells/tables), `#f4fbff/.43` (120), `#daf4ff/.28` (78), `#46565f` legal (60), `#b7e1fa/.38` inputs (54), `#b4e0f8/.32` chips (52), `#e0f5ff/.18`, `#f7faf8/.26`, `#fff/.34`… | 25 clusters for ~3 roles (hairline, control, focus). Inconsistency. |
| Danger | `#b42318` defined; on dark overridden to `#ffd1d1`; never rendered in the audit (VA-06) | Gap. |

### 3.2 Gradients, shadows, glass, opacity

| Property | Distinct rendered | Notes |
|---|---|---|
| Non-photo gradients | 10 | Section stage `radial(85% 0%) + linear(145deg #252b2e→#171d21)` on 110 sections, restarted per section (VA-02). |
| Box-shadows | 27 | Card, panel, nav and button shadows each exist in 3–6 variants; the footer CTA carries a **blue glow** `0 14px 32px -20px rgba(30,179,249,.7)` (DESIGN_SYSTEM: "no glow"). |
| Backdrop-filter | 14 values, **26 recipes** with background alpha .28–.87 and radius 0–999 | Documented: 3 tiers (nav, dark glass, light glass). Glass is also applied over flat graphite where "it adds nothing" (DESIGN_SYSTEM §Glass). |
| Opacity < 1 | 7 | Mostly the logo rings (token) and the globe (locked); no text opacity — good. |

### 3.3 Typography

| Property | Distinct | Notes |
|---|---|---|
| Family | 4 stacks, all resolving to Inter | Token-consistent in rendering; stacks differ by fallback order only. |
| Weight | 15 | 400/600/650/700/800 are system; 480, 500, 550, 720, 740, 750, 760, 770, 780, 850 are one-offs (750–850 homepage/footer). |
| Size | 65 | System sizes (14/15/17/18/19–21/20/24/40/61) plus 40+ one-offs from `clamp()` page overrides (e.g. 61.92, 54.72, 53.28, 35.2, 22.4, 15.52, 12.48). |
| Line-height | 122 | Unitless ratios applied to one-off sizes. |
| Letter-spacing | 59 | Headings −0.03em (system) vs −0.045 … −0.062em (home/footer) vs `normal` (careers H2). |
| Text < 14 px | 251 elements | 80 are the exempt lockup descriptor (10/11 px). Others: footer kicker 12.16 px uppercase, footer legal line 12.8 px, home marketplace kicker 12.8 px, home captions 12.48 px, `IN DEVELOPMENT` 11.2 px uppercase, `/get-started` kicker 12 px uppercase `tracking-widest`, hero note 12 px (VA-10). |
| Uppercase | `SIGNAL ONE · INTEGRATED SYSTEMS` eyebrow typed in capitals (footer on every page, hero eyebrow), `IN DEVELOPMENT`, `SECURITY BUSINESS OS`, `/get-started` kicker | DESIGN_SYSTEM departure (b): no all-caps labels except the lockup itself. The eyebrow repeats the lockup text as a label — inconsistency. |

### 3.4 Radii, containers, spacing

| Property | Rendered values | Classification |
|---|---|---|
| Radii | 999 (296), 10 (109), 13 inputs (82), 20 (69), 18 (68), 24 (38), 14 (28), 22 (21), 28 (20), 11, 25, 15, 8, 26, 21, 17, 12 | Tokens: `ui 10`, `card 14`, `frame 12`, approved marketing 24. Rendered: panels use 18/20/22/24/25/26/28 → **7 radii for one role**. Inconsistency. |
| Containers @1440 | `.wrap` 1320 (pad 40 → content 1240, x=100); header pill 1290 (x=75); hero bar 1280 (x=80); footer shell and home final CTA = the 1320 `.wrap` box itself (x=60); `world-guard` 720 | Four left edges (VA-05). |
| Section padding @1440 | Interior `.section` 112; hero 129.6/138; guard & careers world 96/48; home 115.2/125/129.6/144; forms/legal wrap 138/80/64; 404 160 | Home deviates from `.section` (VA-12); worlds are an intentional variant. |

### 3.5 Components

| Component | Variants found | Classification |
|---|---|---|
| Primary button | Header 48 px/15 px/650; interior `btn-lg` **48.75 px** (should be 56); home hero 56 px/16 px/700 with 1 px border; footer 54 px/17 px/750 with glow. Labels `#0b1118`, `#031827`, `#071827`, `#061925`. All 999 px (token says 10). Hover: colour change + 2–3 px lift + shadow (DESIGN_SYSTEM: no lift, no glow); header buttons lift only on home. | Inconsistency (VA-07). |
| Secondary button | `btn-ghost-dark` (white .34 border, transparent), `so-home-outline` (.76 border, .28 fill), `btn-ghost-light` on dark (`#80949f` border, hover fill `#35434c`) | 3 styles for one role. |
| Text link | `link-arrow` in `#7dd3fc` (classes say `text-signal-ink`) and `#38bdf8`; `so-text-link` `#9edfff`; footer email `#a5e0ff`; underline offset 3/4/5 px; hover changes nothing measurable on `link-arrow` | Inconsistency (VA-26). |
| Arrow glyphs | `↗` on home CTAs and footer CTA (external-link semantics on internal links), `→` on equipment routes, none on interior primaries | Inconsistency (VA-07). |
| Focus ring | Header `#0284c7` 3 px offset 3; main `#38bdf8` offset 3 (4 on home/footer); `link-arrow` adds a 4 px radius only on focus | Functional (visible everywhere, ≥ 3:1) but not one recipe. |
| Status badge | "By quote" ×2 styles, "Pilot" ×3, "MVP in development" ×2, "Coming soon" ×2, "IN DEVELOPMENT" uppercase, "Applications open" looks like a button | Inconsistency (VA-08). |
| Cards/panels | Radii 13–28, 9 glass recipes, 6 shadows; product cards with light wells (functional) | Inconsistency except wells. |
| Form controls | Inputs 52 px, 16 px text (DESIGN_SYSTEM 17), radius 13 (token 10), navy `rgba(6,24,43,.8)` fill, border `rgba(183,225,250,.38)` = **2.8:1** against the card (WCAG 1.4.11 needs 3:1); onboarding forms use a second recipe (`rgba(5,23,41,.69)`, border .42, focus `#67cfff` 2 px). Labels 14 px/650 in two colours (`#daeaf6`, `#f2f9ff`). Native radios/checkboxes (white, `accent-color #0ea5e9`) in 13 px-radius chips. | Inconsistency + accessibility gap (VA-06). |
| Error / empty / success | Error: native tooltip only, no persistent message, invalid fields unstyled. Empty: placeholder text only. Success: not testable (DR-001). | Gap (VA-06). |
| Step/progress | 5 patterns: big blue numerals (quote steps), "01" kicker numbers in a connected rail (home), separate numbered cards (home onboarding), circular badges (get-started), segmented bar (guards/join), text tabs (join/sales) | Inconsistency (VA-25). |
| Navigation | Buyer, guard and careers worlds share one pill (intentional world variants in content). Home pill is a different material (`rgba(24,32,37,.64)` + blur 28) and resizes on scroll (VA-13); interior pill `rgba(23,33,38,.67)` blur 27, 1290 wide. | Mostly consistent; home variant is an inconsistency. |
| Footer | Identical on all 20 routes (good); CTA band out-ranks page headings (VA-04). | |
| Icons | Only 4 icon recipes: 20 px check (stroke 2.4, `#7dd3fc`), 16 px variant (stroke 2.2), logo marks 35/38 px. | Consistent. |

## 4. Cross-page consistency matrix (measured, 1440 unless stated)

Route codes: HOME `/`, SEC `/solutions/security`, PRI `/pricing`, RAD `/radios-equipment`, REN `/ptt-radio-rental`, EQM `/equipment-marketplace`, PAT `/guard-patrol-software`, ATT `/guard-attendance-software`, GMK `/guard-marketplace`, SVC `/service`, CON `/contact`, GST `/get-started`, GRD `/guards`, GJN `/guards/join`, TRU `/security-trust`, POP `/popia`, PRV `/privacy`, TRM `/terms`, JSL `/join/sales`, 404.

| Element | HOME | SEC | PRI | RAD | REN | EQM | PAT | ATT | GMK | SVC | CON | GST | GRD | GJN | TRU | POP | PRV | TRM | JSL | 404 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Header | home glass pill | buyer pill | buyer | buyer | buyer | buyer | buyer | buyer | buyer | buyer | buyer | buyer | guard world | guard world | buyer | buyer | buyer | buyer | careers world | buyer |
| Hero type | locked photo + glass | split, photo right, bg photo | split, numeral | split, product pair | split, product pair | split, product pair | split, photo right, bg photo | split, photo right | split, photo right, bg photo | split, photo right, bg photo | form split | stacked notices + form | split, photo **left**, bg photo | notice + wizard | doc | doc | doc | doc | split, photo right | text |
| Mobile hero order | photo first | **photo first** | copy | copy | copy | copy | copy | copy | copy | copy | copy | notice | photo first | notice | copy | copy | copy | copy | photo first | copy |
| H1 px/wt | 68/780 | 61/700 | 17* | 61 | 61 | **50** | 61 | 61 | 61 | **65** | **50** | **30** | 61 | **44** | 46 | 46 | 46 | 46 | **58** | 61 |
| H1 px @390 | 50 | 42 | 17* | 42 | 42 | 40 | 42 | 42 | 42 | 44 | 40 | **24** | 42 | 36 | 34 | 34 | 34 | 34 | 46 | 42 |
| H1 top y | 329 | 280 | 303 | 461 | **601** | 173 | 478 | 489 | 405 | 235 | 175 | 191 | 277 | **445** | 175 | 175 | 175 | 175 | 276 | 179 |
| Section H2 px | **65/62/55/53** | 40 | 40 | 40 | 40 | 40 | 40 | 40 | 40 | 40 | (20) | 40 | 40 | (20) | (20) | (20) | (20) | (20) | **51** (no tracking) | — |
| Footer CTA H2 px | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 | 49 |
| H3 recipe px/wt | 22/740, 26/700 | 18/650, 20/700 | 18/650, 20/700 | 18/650, 20/700 | 18/650 | 20/700 | 18/650 | 18/650 | 18/650 | 20/700 | 18/650 | — | **19/600** | — | — | — | — | — | 18/650, 20/700, **28/700** | — |
| Section pad-top | 115–144 | 112 | 112 | 112 | 112 | 112 | 112 | 112 | 112 | 112 | 138 wrap | 138 wrap | 96 | 40 | 138 | 138 | 138 | 138 | 96/48 | 138 |
| Panel radii | 24/14/26/18 | 20/25/15/28 | 20/28 | 20/24/13/28 | 24/20/28 | 20/24/28 | 20/28 | 20/28 | 20/24/14 | 20/14/28 | 20/13/28 | 20/28 | 25/15/28 | 20/28 | 20/12/28 | 20/28 | 20/28 | 20/28 | 20/25/15/28 | 28 |
| Glass in main | 3 recipes | 3 | 2 | 2 | 1 | 1 | 2 | 1 | 3 | 2 | 1 | 1 | 1 | 1 | — | — | — | — | 2 | — |
| Primary btn h | **56** | 48.75 | 48.75 | 48.75 | 48.75 | 48.75/48 | 48.75 | 48.75 | 48.75 | 48.75 | 48.75 | 48.75 | 48.75 | 48.75 | — | — | — | — | 48.75/48 | 48.75 |
| Stage colour | navy hero + graphite | graphite | graphite | graphite | graphite | graphite | graphite | graphite | graphite | graphite | graphite + navy notice | graphite + navy panels | graphite | graphite | graphite | graphite | graphite | graphite | graphite | **navy gradient** |
| CSS photo bg | business-park, restaurant-dining | business-park | — | — | — | — | warehouse-yard | — | business-park | restaurant-dining | — | — | business-park | — | — | — | — | — | — | — |
| Hero art reused elsewhere | — | site-planning ×3 | — | product pair ×4 | product pair ×4 | product pair ×4 | checkpoint ×3 | site-planning ×3 | hire-security ×3 | kitchen ×2 | — | — | hire-security ×3 | — | — | — | — | — | — | — |
| Closing CTA + footer CTA stacked | yes | yes | yes | no | yes | yes | yes | yes | no | yes | no | no | yes | no | no | no | no | no | no | no |
| Length 1440/390 (screens) | 10.7/14.9 | 7.0/11.4 | 4.4/6.5 | 7.5/12.3 | 4.8/7.0 | 3.0/5.0 | 5.4/9.1 | 4.6/6.9 | 5.8/9.9 | 3.8/5.8 | 2.3/4.6 | 2.5/4.0 | 4.5/7.6 | 2.2/3.3 | 3.3/5.5 | 2.8/4.7 | 2.6/4.4 | 2.5/4.1 | 4.5/7.3 | 1.6/2.4 |

\* `/pricing` H1 element is 17 px; the visual headline "R2,50" is a 128 px `t-num` span inside it (intentional). **Bold** = deviation from the family norm. Worlds (guard, careers) are allowed by DESIGN_SYSTEM to differ in layout/type scale; those deviations are noted but not raised unless they break the shared rules.

Side-by-side evidence: `shots/sheets/compare_heroes_d1440.jpg`, `compare_heroes_m390.jpg`, `compare_closing_cta_d1440.jpg`, `compare_404_legal.jpg`.

## 5. Findings

Each finding: route · component · viewport · evidence · measured · root cause · principle · severity · correction. Root causes cite `origin/main` @ `8e89d24`.

### VA-01 · S1 · Two dark material families and three token layers
- **Where:** all routes, all widths; worst on forms (`/contact`, `/radios-equipment#quote`, `/get-started`, `/guard-marketplace`) and the 404.
- **Evidence:** `shots/sheets/contact__d1440_0.jpg`, `get-started__d1440_0.jpg`, `forms_validation.jpg`, `compare_404_legal.jpg`; colour tables §3.1.
- **Measured:** sections `#282a28`/`#252b2e→#171d21` (graphite, slightly yellow-green: R≥B) vs inputs `rgba(6,24,43,.8)`, chips `rgba(12,43,68,.7)`, notices `#123652`, onboarding `#0c2741`, cards `rgba(13,35,57,.78)`, 404 `#132e47→#274960` (navy). ΔE76 graphite↔navy ≈ 18. 73 text colours for 4 text roles.
- **Root cause:** documented tokens in `app/globals.css:16-63` (`@theme`) are overridden by three later layers that hard-code values: `:root --s1-*` (`globals.css:1341-1346`, navy), `main:not(.s1-brand-home) --site-*/--marketing-*` (`marketing-system.css:3-13`, navy controls at `:37`, `:44`), and the 2026-11-15 graphite `--s1-quiet-surface` (`marketing-system.css:550-553`) plus `.so-home --so-quiet-surface` (`home-conversion.css:1171`). `.surface-light/-white` class names now render graphite through `!important` (`marketing-system.css:430-433`), so the documented `light`/`text` tokens are inverted.
- **Principle:** single source of truth; colour harmony (one temperature for one material).
- **Correction:** define the graphite stage as `@theme` tokens (§6) and re-point `--color-base/deep/raised/raised-2/line-dark` to them; delete the `--s1-*`, `--site-*`, `--marketing-*` and navy literals (or alias them to the tokens for one release); controls (inputs, chips, notices) use `raised-2` + `line-strong`, never navy. Navy survives only if the founder chooses navy over graphite as the single family.

### VA-02 · S2 · Hard colour seams between every interior section
- **Where:** every interior marketing route, 1440/1280/768/390 (e.g. `/solutions/security` y = 1548, 2217, 3246, 3825; `/pricing` y = 892, 1622).
- **Evidence:** `shots/sheets/solutions_security__d1440_0.jpg`, `pricing__d1440_0.jpg`, `service__d1440_0.jpg`.
- **Measured:** each section paints `linear-gradient(145deg,#252b2e,#171d21)`; the bottom of one (`#171d21`, L* 10.3) meets the top of the next (`#252b2e`, L* 17.1): **ΔE 6.8** — a visible horizontal band at every boundary, which reads as an accident rather than either deliberate alternation (departure c) or a continuous stage.
- **Root cause:** `marketing-system.css:430-433` applies the stage to every `section` instead of once to `main` (`:550-553`).
- **Principle:** Gestalt continuity; intentional contrast.
- **Correction:** paint `--s1-quiet-surface` once on `main` (or `background-attachment: fixed` on desktop) and make sections transparent; mark real chapter changes with a 1 px `line-dark` rule or a deliberate `base`↔`deep` alternation token.

### VA-03 · S1 · Heading hierarchy is fragmented across page families
- **Where:** all routes; worst `/get-started` (H1 30 px), home (H2 53–65 px at 750–780), `/join/sales` (H2 51 px, `letter-spacing: normal`).
- **Evidence:** matrix §4; `shots/sheets/get-started__d1440_0.jpg`, `home__d1440_0.jpg`, `join_sales__d1440_0.jpg`.
- **Measured:** eight H1 sizes (68/65/61/58/50/46/44/30). Interior H2 40.3 px; home H2 53–65 px; **footer H2 49 px on every page** = larger than every interior section H2 and 1.6× the `/get-started` H1. H3 recipes 18/650, 19/600, 20/700, 22/740, 26/700, 28/700.
- **Root cause:** four scales: `.t-*` (`globals.css:340-436`), the `main:not(.s1-brand-home)` re-scale (`globals.css:1408-1410`) and a second re-scale in `marketing-system.css:76-79`, homepage `so-*` (`home-conversion.css:33,56,80,109,113`), footer `.s1-premium-footer-intro h2 clamp(2rem,3.4vw,3.9rem)` (`marketing-system.css:162`), and raw Tailwind on `/get-started` (`app/(marketing)/get-started/page.tsx:15`: `text-2xl md:text-3xl`).
- **Principle:** typographic hierarchy; one modular scale (DESIGN_SYSTEM "do not reset type scale through page-level overrides").
- **Correction:** one scale (§6): marketing H1 = `.t-hero` (60.8 @1440), document/form H1 = `.t-h1-compact` 46 px, H2 40 px, H3 20/700, H4 18/650, weights 400/600/650/700/800 only. Footer CTA heading becomes H3-size (32 px max) or is demoted to a `p.t-lead`. Homepage sections outside the locked hero adopt the same H2.

### VA-04 · S2 · Stacked, competing closing CTAs; footer band out-ranks the page
- **Where:** `/`, `/solutions/security`, `/pricing`, `/ptt-radio-rental`, `/equipment-marketplace`, `/guard-patrol-software`, `/guard-attendance-software`, `/service`, `/guards`, 404 — 1440 and 390.
- **Evidence:** `shots/sheets/compare_closing_cta_d1440.jpg`; `home__d1440_2.jpg` (#09–#10), `home__m390_1.jpg` (#12–#13).
- **Measured:** page CTA panel immediately followed by the footer CTA panel ("Run your business. As one." + trial button); two primaries within ~300 px; footer H2 49 px vs page CTA H2 40 px; footer button 54 px with blue glow vs page button 48.75 px; footer shell 1320 px wide vs page panels 1240 px.
- **Root cause:** footer intro always renders (`app/components/Footer.tsx:29-30` on main); styles `marketing-system.css:159-165`.
- **Principle:** one primary action per view (Hick); visual hierarchy. Related: **DR-004** fixes the CTA *copy*; this is the *visual* duplication that remains after it.
- **Correction:** when a page has its own closing CTA, render the footer without the intro band (prop on `Footer`), otherwise render it at H3 scale; remove the glow (`box-shadow` → `--shadow-none`).

### VA-05 · S2 · Four left/right edges at desktop
- **Where:** all routes, ≥1024.
- **Evidence:** `shots/sheets/home__d1440_2.jpg`, `pricing__d1440_0.jpg`; data `containers` §3.4.
- **Measured @1440:** content x = 100 (w 1240); header pill x = 75 (w 1290); home hero bar x = 80 (w 1280); footer shell and home final CTA x = 60 (w 1320).
- **Root cause:** header `max-width:1290px` (`globals.css:1329`, `:1353`); footer and `.so-final-inner` put the border on the `.wrap` box itself (`marketing-system.css:159`), so the border sits in the gutter.
- **Principle:** alignment / common edges.
- **Correction:** one rule — bordered shells sit on the content edge: shell = `.wrap` inner (`max-width: calc(var(--wrap-max) - 2*var(--wrap-pad))`), header pill likewise.

### VA-06 · S1 · Forms have no visible error state and low-contrast field boundaries
- **Where:** `/radios-equipment#quote`, `/contact`, `/get-started`, `/guard-marketplace`, `/join/sales` (all widths). `/guards/join` step 1 has no required fields.
- **Evidence:** `shots/sheets/forms_validation.jpg`, `shots/forms/*_1submitted.jpg`, `data/states.json` (`form:*`).
- **Measured:** empty submit → browser tooltip on the first field only ("Please fill out this field."), which disappears; 2–8 other required fields show **no change** (border stays `rgba(183,225,250,.38)`); no inline message, no summary, no `role="alert"`, no required marker (only "(optional)" is marked). Field border composite ≈ `#506e83` on card `≈#1f2a2f` = **2.73:1** (WCAG 1.4.11 needs 3:1). The `danger` token `#b42318` is 2.18:1 on graphite and is overridden to `#ffd1d1` but never rendered.
- **Root cause:** forms rely on native constraint validation; `.field-input[aria-invalid="true"]` (`globals.css:564`) is never set because `submit` handlers never run on invalid forms; dark-field border at `marketing-system.css:38` (`--site-edge`).
- **Principle:** Nielsen #9 (recognise/recover from errors); WCAG 3.3.1, 3.3.3, 1.4.11; Baymard inline validation.
- **Correction:** `noValidate` + client validation that sets `aria-invalid`, renders `field-error` text under each field and an error summary focused on submit; error tokens for dark (`--color-danger-inv #ffb4ab` text/border, 3 px ring); field border `line-strong #7c8da0` (4.2:1 on `#252b2e`).

### VA-07 · S2 · Button system: four sizes, three secondaries, motion contrary to the documented rule
- **Where:** all routes.
- **Evidence:** `data/states.json` (`btn:*`), `shots/states/*_0base|1hover|2focus.jpg`.
- **Measured:** primary heights 48 (header), 48.75 (`btn-lg`, should be 56), 54 (footer), 56 (home hero); label weights 650/700/750; label colours `#0b1118`/`#031827`/`#071827`/`#061925`; radius 999 everywhere vs `--radius-ui 10px`. Hover adds `translateY(-2…-3px)` and a shadow on all main buttons, a glow on the footer CTA; header buttons lift only on the homepage. Secondary: `btn-ghost-dark`, `so-home-outline`, `btn-ghost-light`-on-dark. Arrows: `↗` (home, footer), `→` (equipment), none (interior). Order: hero = primary left; closing bands = secondary left, primary right.
- **Root cause:** `.btn-lg` (`globals.css:501`) overridden by later `main … .btn` rules in `marketing-system.css`; home `so-home-cta/-outline` (`home-conversion.css:13`); footer `.s1-footer-main-cta` (`marketing-system.css:164-165`); header `globals.css:1271`.
- **Principle:** consistency and standards; DESIGN_SYSTEM "no glow and no lift".
- **Correction:** two sizes (`btn` 48, `btn-lg` 56), one primary, one secondary (ghost on dark), one tertiary (text link), one label colour `on-signal`, one radius token `--radius-pill`; decide once whether lift is allowed (if yes, document it; if no, remove from all); `→` for internal, `↗` only for external; primary always last in a right-aligned group and first in a left-aligned hero group (document it).

### VA-08 · S2 · Status badges render the same state in up to three styles
- **Where:** `/pricing`, `/radios-equipment`, `/solutions/security`, `/guard-marketplace`, `/guards`, `/`, `/join/sales`.
- **Evidence:** `shots/sheets/pricing__d1440_0.jpg` (#02), `guard-marketplace__d1440_0.jpg`, `guards__d1440_0.jpg` (#01), `home__d1440_0.jpg`, `join_sales__d1440_0.jpg`.
- **Measured:** "Pilot": light tint `#e6f4fb/#0270a8`, dark `#38bdf8` on `signal-400/12`, home 12.4 px/750 `#9bc7e3`. "MVP in development": beige `#fbf0dc/#92400e` (/guards) vs amber text on `white/8` (/guard-marketplace). "Coming soon": light `#e8e9ec/#374151` (/pricing, /radios) vs dark (/solutions/security). "IN DEVELOPMENT" uppercase 11.2 px (home). "Applications open" (/join/sales) is a filled light pill beside the "Apply now" button and reads as a second button.
- **Root cause:** `Status` picks `light`/`dark` by the surface prop (`app/components/ui.tsx:26-31`), but `surface-light` sections now render graphite, so light variants land on dark; homepage uses its own `so-status`/`so-vertical-label` (`home-conversion.css:78`).
- **Principle:** consistency; truth labels must look the same everywhere they appear (CLAUDE.md "truth labels stay accurate").
- **Correction:** one badge component with a dark-stage default (outline + tinted text, 14 px/600, sentence case) and a light variant only inside product wells; status hues fixed per state (live green, pilot blue, beta/MVP amber, soon grey); never pill-shaped status next to a pill button without a non-button shape (e.g. dot + text).

### VA-09 · S2 · Glass and material sprawl
- **Where:** all routes.
- **Evidence:** §3.2; Appendix A "Glass tiers".
- **Measured:** 26 glass recipes (blur 13–28 px, saturate 0.89–1.4, alpha .28–.87); 27 shadows; panel radii 13/14/15/18/20/21/22/24/25/26/28. Glass is applied over flat graphite cards (blur over a flat colour changes nothing visually but costs GPU on scroll).
- **Root cause:** each override layer re-declares material (`globals.css:1339-1560` "canonical material layer", "depth pass", "contrast and material QA"; `marketing-system.css:20-30, 83-90, 184-190, 465-480`; `home-conversion.css` passim).
- **Principle:** DESIGN_SYSTEM §Glass (3 tiers; "never over flat colour where it adds nothing").
- **Correction:** three tiers as tokens (§6): `--glass-nav`, `--glass-panel` (only over photography), `--surface-card` (solid, no blur); two shadows; radii `pill/12/24`.

### VA-10 · S2 · Off-scale small and uppercase text
- **Where:** footer on every route; `/`; `/get-started`.
- **Evidence:** Appendix A "Text under 14px"; `shots/sheets/home__d1440_2.jpg`, `get-started__d1440_0.jpg`.
- **Measured:** footer kicker 12.16 px uppercase 0.12em; footer legal line 12.8 px; home marketplace kicker 12.8 px; image captions 12.48 px; `IN DEVELOPMENT` 11.2 px; `/get-started` kicker 12 px `uppercase tracking-widest text-sky-300`; hero note 12 px (171 elements below the 14 px floor excluding the exempt lockup descriptor).
- **Root cause:** `marketing-system.css:161` (`.76rem`, uppercase text typed in `Footer.tsx:29`); `home-conversion.css:31` (`so-eyebrow` uppercase), `:78`; `get-started/page.tsx:15`.
- **Principle:** DESIGN_SYSTEM "nothing important under 14 px"; departure (b) no all-caps labels.
- **Correction:** kicker token `.t-kicker` (15/650 sentence case) everywhere; captions `.t-caption` 14 px; the lockup is the only uppercase.

### VA-11 · S2 · Catalogue grid leaves an empty column and mixes card types
- **Where:** `/radios-equipment` Body cameras group (1440, 1280, 768); Radios group.
- **Evidence:** `shots/sheets/radios-equipment__d1440_0.jpg` (#03), `radios-equipment__t768_0.jpg` (#03).
- **Measured:** SC780 card 437×~520 in a two-column grid, right column empty (≈437×520 px of dead space). In Radios, two image cards are followed by two text-only tiles (E600, PTT platform) of different height.
- **Root cause:** fixed `sm:grid-cols-2` for every group (`app/(marketing)/radios-equipment/page.tsx:69`).
- **Principle:** grid integrity; uneven cards read as missing content.
- **Correction:** `grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr))` with single-item groups spanning or sitting beside the group copy; one card anatomy for image and text-only products (same well height with a typographic well for E600/PTT until images exist — DR-006).

### VA-12 · S2 · Homepage vertical rhythm is 20–60 % looser than the rest of the site
- **Where:** `/` at 1440 (and 1280).
- **Evidence:** `shots/sheets/home__d1440_1.jpg`, `home__l1280_0.jpg`; Appendix A "Section rhythm".
- **Measured:** empty space between consecutive section contents 271–367 px (interior pages 224 px). Section padding 115.2/125/129.6/144 px vs `.section` 112. Page = 10.7 screens at 1440, 14.9 at 390 (UX correction #5 still open).
- **Root cause:** home sections use their own padding in `home-conversion.css` (`so-chapter`, `so-vertical`, `so-final-cta`) plus extra top offsets inside them.
- **Principle:** consistent rhythm; DESIGN_SYSTEM ".section 80/96/112". Feeds UX correction #5 and DR-017.
- **Correction:** home sections use `.section` padding and the shared stack scale (§6); measured saving ≈ 600–900 px at 1440 without touching content or the hero.

### VA-13 · S2 · Mobile homepage header resizes on scroll and the logo touches the Menu button
- **Where:** `/` at 390 (not interior pages).
- **Evidence:** `shots/crop_mobile_header.jpg`; `home__m390_0.jpg` (#00 vs #01).
- **Measured:** pill 374 px wide at top → 358 px after scroll; Menu button moves 8 px left; the descriptor "INTEGRATED SYSTEMS" (letter-spacing 0.42em overflows its box) ends ≈ 0–1 px from the Menu button border. Layout jump on every first scroll.
- **Root cause:** `home-conversion.css:291` `body:has(.so-home) header.glass-nav[data-scrolled] > .wrap{width:min(calc(100% - 32px),1680px)!important}` out-specifies the mobile rule at `:316` (which has no `[data-scrolled]`).
- **Principle:** stability; clear space around the logo (BRAND.md ≈ 0.44 × mark).
- **Correction:** delete the home-specific header material; the shared header rule covers both states. (The header is not part of the locked hero.)

### VA-14 · S2 · Homepage intro card: a postage-stamp photo in a full-width glass panel
- **Where:** `/` "Every part of your business" at all widths.
- **Evidence:** `shots/sheets/home__d1440_0.jpg` (#01), `home__m390_0.jpg` (#01), `images_rendered_1.jpg`.
- **Measured:** image 288×161 in a 1240×~360 card at 1440 (5 % of the card); 148×82 at 390. The card's centre column is empty.
- **Root cause:** `.so-panel-photo` forced to `aspect-ratio:16/9` + `object-fit:contain` (`home-conversion.css:1190`) inside the narrow first column of `.so-section-heading` (`:55`).
- **Principle:** every image must earn its space; PRODUCT_BRAND_ARCHITECTURE keeps the photo in this card, so make it legible.
- **Correction:** give the photo a real column (≥ 520 px at 1440, full width at 390) or drop it; this is not the locked hero.

### VA-15 · S2 · Image reuse makes pages look templated
- **Where:** see IMAGE_INVENTORY.
- **Evidence:** `shots/sheets/compare_heroes_d1440.jpg`, `images_rendered_0..3.jpg`.
- **Measured:** `business-park` backdrop on 4 routes; `security-site-planning` on 3 (home, 1GUARD hero, attendance hero); `hire-security` on 3 (home, marketplace hero, **/guards hero**); `checkpoint` 3 placements (twice on `/guard-patrol-software`); PNC360S + P30 Lite pair is the hero of `/radios-equipment`, `/ptt-radio-rental`, `/equipment-marketplace` and the home equipment section.
- **Root cause:** page compositions copied from a shared `PageHero`/`Hardware` pattern with the same props.
- **Principle:** recognition (each page needs its own visual anchor); ASSET_PROVENANCE "keep photographic placements unique" (stated for the homepage, should hold site-wide).
- **Correction:** one placement per people photograph; equipment heroes differentiated (rental: radio in use/terms visual; marketplace: category grid; radios: catalogue lead); new assets listed in IMAGE_INVENTORY §4.

### VA-16 · S2 · Image-to-message mismatches
- **Where:** `/guards` hero, `/guard-attendance-software` hero, `/join/sales` hero caption, `/service` vision cards, home "Get the devices" card.
- **Evidence:** `shots/sheets/guards__d1440_0.jpg`, `guard-attendance-software__d1440_0.jpg`, `join_sales__d1440_0.jpg`, `service__d1440_0.jpg`, `ai_check_1.jpg`.
- **Measured/observed:** the officer-facing hero ("Your work, on record") shows four office workers at a meeting table with no security cue; the attendance hero shows site planning, not clocking in; the careers caption says "fictional security company" on a non-security scene; four `/service` cards are near-identical staff huddles for four different capabilities; the home "Get the devices" card shows a vehicle tracker while radios are the commercial lead.
- **Root cause:** asset selection; `hire-security`/`customer-enquiry` were approved for homepage cards and reused as heroes.
- **Principle:** relevance (image and headline must make the same claim); PHOTOGRAPHY_BRIEF slots 5–7.
- **Correction:** see IMAGE_INVENTORY verdicts; interim: pick from existing assets (e.g. `checkpoint` for officers, radio product for the devices card) until brief slots 5–7 are shot.

### VA-17 · S2 · Hospitality imagery and backdrops are far warmer than the rest of the site
- **Where:** `/` 1Service section, `/service` hero and cards, `/join/sales` hero.
- **Evidence:** `shots/sheets/images_source_assets.jpg`, `home__d1440_0.jpg` (#03), `service__d1440_0.jpg`; `data/imgstats.json`.
- **Measured:** `restaurant-dining` backdrop ≈ 3110 K, saturation .62, R−B +93; hospitality foregrounds 4200–5050 K, sat .29–.41; `customer-enquiry` 4250 K, R−B +52; security set 5700–7100 K, sat .20–.24; page stage neutral graphite.
- **Root cause:** source grading; `restaurant-dining.webp` assigned at `marketing-system.css:559`.
- **Principle:** PHOTOGRAPHY_BRIEF natural light, UX correction #4 (warm cast). Some warmth is a legitimate sector cue; the backdrop is the outlier.
- **Correction:** re-grade hospitality set to ~5000 K / sat ≤ .35 (one LUT for all), backdrop to graphite or ≤ .3 saturation; neutral-grade `customer-enquiry`.

### VA-18 · S2 · CSS background photographs render above source resolution
- **Where:** `/` intro and 1Service, `/solutions/security`, `/guards`, `/guard-marketplace`, `/guard-patrol-software`, `/service` heroes.
- **Evidence:** IMAGE_INVENTORY rows IMG-05, 08, 10, 21, 22, 38, 41.
- **Measured:** 1400×800 sources cover-scaled 1.03–1.42× at 1440 and 1.25–1.73× at 390 (2.5–3.5× on 2× phones); at 390 only 16–22 % of the source width is visible.
- **Root cause:** `background-size: cover` on tall hero boxes (`marketing-system.css:555-564`, `:640`); the image-scale test only covers `<img>`.
- **Principle:** DESIGN_SYSTEM "No raster image renders above its source resolution".
- **Correction:** 2560×1440 masters (or 4:5 mobile crops) for any backdrop kept; extend `tests/e2e/image-scale.spec.ts` to computed `background-image`.

### VA-19 · S3 · Hero "Illustrative scene" caption clipped at 390
- **Where:** `/` at 390.
- **Evidence:** `shots/sheets/home__m390_0.jpg` (#00), `images_rendered_1.jpg` ("home/m … 390x271").
- **Measured:** caption reads "Illustrative scen" — cut by the viewport edge and overlapped by the top of the glass card.
- **Root cause:** caption positioned relative to the photo box, not the visible area (`.so-hero-photo-note`, `home-conversion.css:38`, mobile `:149` `bottom:191px;right:18px`).
- **Principle:** disclosure must be legible (ASSET_PROVENANCE requires the caption).
- **Correction:** move the caption inside the safe area (e.g. bottom-left above the card, `right: 16px` inset). Caption placement only — photo, crop, card and copy unchanged.

### VA-20 · S2 · Product images: scale mismatch and one possible wrong variant
- **Where:** `/radios-equipment`, `/ptt-radio-rental`, `/equipment-marketplace`, `/` equipment.
- **Evidence:** `shots/sheets/product_vs_manufacturer.jpg`, `images_rendered_0.jpg`, `images_rendered_2.jpg`.
- **Measured:** P30 Lite device fills 0.33 × 0.86 of its square canvas vs PNC360S 0.79 × 0.89 → in identical hero wells the P30 Lite is 228 px tall vs 268 px. SC780 site image (hytera.ae) differs from www.hytera.com's SC780 master (global image shows an "SC780" face badge and red side key; site image a blank round button). PNC360S, FMB920 and FMC920 match the manufacturer masters. www.hytera.com lists P30 and P30 (C), not "P30 Lite" (DR-006).
- **Root cause:** regional source images not normalised to a device bounding box.
- **Principle:** product accuracy (CLAUDE.md "never invent specifications"); visual equivalence of peers.
- **Correction:** trim every product to its alpha bbox and size by device height in one well token; founder/supplier to confirm the supplied SC780 and P30 Lite variants, then use the www.hytera.com 2184×1228 masters if global.

### VA-21 · S3 · Product numeral colour rule broken in labels and buttons
- **Where:** `/` ("Explore 1GUARD", "Explore 1Service", "1Service staffing · Planned"), `/service` ("Register 1Service interest"), `/get-started` kicker, plus body copy on 6 routes (22 instances).
- **Evidence:** `scripts/sig.js` output in this audit; `.s1-product-signature` instances themselves are correct (`#0EA5E9`, 0.060em gap, 92 instances).
- **Root cause:** plain strings instead of `ProductSignature` in those components.
- **Principle:** PRODUCT_BRAND_ARCHITECTURE rules 3 and 5. (Naming itself is being standardised elsewhere; this is the colour rule only.)
- **Correction:** use `ProductSignature` in every label, button and kicker; founder to state whether running body copy is exempt.

### VA-22 · S3 · 404 page uses the retired navy stage
- **Where:** 404, both widths.
- **Evidence:** `shots/sheets/compare_404_legal.jpg`.
- **Measured:** `linear-gradient(145deg,#132e47,#274960 50%,#10273e)` — the only page on that colour; legal pages beside it are graphite.
- **Root cause:** not-found content is a bare `div.wrap`, so it shows the `main:not(.s1-brand-home)` background from `globals.css:1360`.
- **Correction:** give not-found the graphite stage (resolved by VA-01).

### VA-23 · S2 · `/get-started` is styled outside the system
- **Where:** `/get-started`, all widths.
- **Evidence:** `shots/sheets/get-started__d1440_0.jpg`, `compare_heroes_m390.jpg`.
- **Measured:** H1 30 px (24 px mobile) — smallest H1 on the site, smaller than the form's own "Your company" heading and the footer H2 (49); kicker 12 px uppercase `tracking-widest` Tailwind `sky-300`; panel `bg-[#0c2741]/85`, `text-slate-200`.
- **Root cause:** raw Tailwind palette and sizes in `app/(marketing)/get-started/page.tsx:15`.
- **Principle:** consistency; type scale. (Order of elements on mobile is UX correction #6 — separate.)
- **Correction:** rebuild the intro with `t-kicker`, `t-h1-compact`, `t-body`, `surface-card` tokens.

### VA-24 · S3 · Mobile hero media order differs within the buyer family
- **Where:** 390: `/solutions/security` puts the photo above the H1; its sibling feature pages (`/guard-patrol-software`, `/guard-attendance-software`, `/guard-marketplace`) put copy first.
- **Evidence:** `shots/sheets/compare_heroes_m390.jpg`.
- **Root cause:** `/solutions/security` uses its own hero markup (`split-hero relative`) instead of `PageHero`.
- **Principle:** consistent pattern within a world (worlds may differ; siblings should not).
- **Correction:** copy first, media second at < 1024 for every buyer page (H1 then lands ≈ 220 px instead of 449 px).

### VA-25 · S3 · Five step/progress patterns
- **Where:** `/` (connected rail "01–03" and separate "01–03" cards on the same page), quote/rental steps (large blue 1–4), `/get-started` (circular badges), `/guards/join` (segmented bar), `/join/sales` (text tabs).
- **Evidence:** `home__d1440_0.jpg` (#01) vs `home__d1440_2.jpg` (#08); `radios-equipment__d1440_1.jpg`; `get-started__d1440_0.jpg`; `guards_join__d1440_0.jpg`; `join_sales__d1440_0.jpg`.
- **Correction:** two patterns only — numbered list (explaining a process) and stepper (form progress), each one component.

### VA-26 · S3 · Seven link blues
- **Where:** all routes.
- **Measured:** `#7dd3fc`, `#38bdf8`, `#8cdcff`, `#a5e0ff`, `#9edfff`, `#9bc7e3`, `#6fd1ff`; underline offsets 3/4/5 px; `link-arrow` hover produces no measurable change.
- **Root cause:** `text-signal-ink` re-mapped on dark plus `so-text-link` (`home-conversion.css:18`) and footer (`marketing-system.css:169`).
- **Correction:** link on dark = `signal-300 #7dd3fc` (8.6:1 on `#252b2e`), offset 4 px, hover thickness 2 px.

### VA-27 · S3 · Four photo-frame treatments
- **Where:** `/guards`, `/guard-marketplace`, `/join/sales` (bezel frame, 25 px), `/solutions/security` (borderless 20 px), `/` and `/service` (caption-pill overlay, 26 px), patrol step card (14 px).
- **Evidence:** `compare_heroes_d1440.jpg`, `images_rendered_0.jpg`.
- **Correction:** one framed-media component (`--radius-card`, 1 px hairline, optional caption below), per ASSET_PROVENANCE "people inside a bordered glass media component".

## 6. Existing defects enriched by this audit (not re-reported)

| DR / UX | Additional evidence or root cause |
|---|---|
| DR-004 | Visual duplication persists after the copy fix → VA-04. |
| DR-005 | H1 top y still 445 on `/guards/join` (notice card before the H1) — outside the 5 PageHero routes the fix covers. |
| DR-006 | P30 Lite and SC780 images come from hytera.ae and differ from / are absent on www.hytera.com → VA-20. |
| DR-013 | At 1440 the locked hero image is drawn 1440×810 in an 878 px box (68 px band); at 1920 1672×941 with 124 px side bands; at 768 the sage gutters remain (UX#3). |
| DR-014 | Disclosure caption still at x = 0 on live (`home__d1440_2.jpg` #08, `home__m390_1.jpg` #12). |
| DR-022 | Root cause: `home-conversion.css:70` `.so-vertical-layout{align-items:center}` + `:1192` `.so-vertical-visual{aspect-ratio:16/9}` — the 16:9 image is centred against a ~900 px text column. |
| UX #2, #4, #5 | Globe still not visible at 1440; warm cast quantified (VA-17); length driven by home spacing (VA-12). |

## 7. Recommended consolidated token set (mapped to existing variables)

All tokens live in `@theme` in `app/globals.css`; the `--s1-*` (`globals.css:1341-1346`), `--site-*`/`--marketing-*` (`marketing-system.css:3-13`), `--s1-ink/--s1-copy/--s1-accent` (`marketing-system.css:66`), `--s1-quiet-surface` and `--so-quiet-surface` are deleted or become aliases of these for one release. The 11-15 graphite direction is assumed; if the founder chooses navy, only the five stage hexes change.

### Colour

| Token (existing name) | New value | Replaces (rendered clusters) |
|---|---|---|
| `--color-deep` (stage) | `#171d21` | `#171d21`, `#151b1f`, `#171a1b`, `#191d1e`, `#0f131a` |
| `--color-base` (stage-2 / alternation) | `#1f2529` | `#202323`, `#202629`, `#1b2327`, `#151a21` |
| `--color-raised` (solid card) | `#252b2e` | `#282a28`, `#252b2e`, `#1a1d1e`, navy cards `#0d2339`, `#123652`, `#0c2741` |
| `--color-raised-2` (control fill, hover) | `#2c3438` | inputs `#06182b`, `#051729`, chips `#0c2b44`, `#202a30`, `#26343c` |
| `--color-line-dark` (hairline) | `rgb(235 243 246 / .16)` | `#f4fbff/.43`, `#daf4ff/.28`, `#e0f5ff/.18`, `#f7faf8/.26`, `#46565f` … |
| `--color-line-strong` (control border, unchanged) | `#7c8da0` (4.2:1 on raised) | `#b7e1fa/.38`, `#b4e0f8/.32`, `#80949f`, `#657782` |
| `--color-text-inv` | `#f1f5f9` | 7 heading whites |
| `--color-text-inv-2` | `#cbd5e1` | `#c7d8e3`, `#c9ddeb`, `#c4d6df`, `#daeaf6`, `#e7eef0` |
| `--color-text-inv-3` | `#94a3b8` (5.6:1 on raised) | `#aabecb`, `#a7c9e0` |
| `--color-signal` / `-400` / `-300` | `#0ea5e9` fill · `#38bdf8` large accent, focus ring on dark · `#7dd3fc` links and kickers on dark | 7 link blues |
| `--color-on-signal` | `#0b1118` | `#031827`, `#071827`, `#061925` |
| `--color-well` (new; functional) | `#eef2f4` | `#eef2f4`, `#f5f7fa` product wells |
| `--color-danger-inv` (new) | `#ffb4ab` | `#ffd1d1`; `--color-danger` stays for light wells |
| Status on dark (new `*-inv` use) | text `live-inv #6ee7a0`, `pilot #7dd3fc`, `beta-inv #fcd47a`, `soon-inv #d1d5db` on `rgb(255 255 255 / .06)` + 1 px ring of the same hue at .35 | 9 badge recipes |

### Type (Inter only; weights 400 · 600 · 650 · 700 · 800)

| Token (existing class) | Size @1440 (clamp) | lh | tracking | Use |
|---|---|---|---|---|
| `.t-hero` | 60.8 (2.6→3.8rem) | 1.0 | −0.03em | every marketing H1 (locked home hero keeps its own) |
| `.t-h1` → rename `.t-h1-compact` | 46 (2.125→2.875rem) | 1.08 | −0.03em | legal, forms, 404, guard/careers wizards |
| `.t-h2` | 40 (2→2.5rem) | 1.08 | −0.03em | all section headings incl. home |
| `.t-h3` | 20 (1.25rem) | 1.2 | −0.012em | card titles; footer CTA heading at most 32 (`.t-h3-lg`) |
| `.t-h4` | 18 | 1.35 | 0 | list titles |
| `.t-lead` / `.t-body` / `.t-small` / `.t-caption` | 21 / 17 / 15 / 14 | 1.55 / 1.65 / 1.55 / 1.5 | 0 | text |
| `.t-kicker` | 15/650 | 1.4 | 0.005em | all eyebrows (no uppercase) |
| `.t-num` | per use, 800 | 0.9 | −0.04em | numerals |

### Spacing, radii, elevation, glass

| Token | Value | Notes |
|---|---|---|
| `.section` | 80 / 96 / 112 (unchanged) | home adopts it |
| `--space-stack-*` (new) | 8 · 16 · 24 · 32 · 48 · 64 | intra-section gaps |
| `--card-pad` (new) | 20 mobile · 32 ≥768 | all cards/panels |
| `--wrap-max` / `--wrap-pad` | 1320 / 16·24·40·48 (unchanged) | header pill, footer shell, final CTA align to the content edge |
| `--radius-pill` (new) | 999px | buttons, badges, nav pill, chips |
| `--radius-ui` | 12px (was 10; rendered 10/11/13/14/15) | inputs, choice chips, small media |
| `--radius-card` | 24px (was 14; approved marketing 24) | cards, panels, media frames, footer shell (was 18/20/21/22/25/26/28) |
| `--shadow-card` (new) | `inset 0 1px rgb(255 255 255/.10), 0 22px 60px -36px rgb(0 0 0/.6)` | replaces ~20 card shadows |
| `--shadow-float` (new) | `inset 0 1px rgb(255 255 255/.18), 0 30px 80px -30px rgb(0 0 0/.6)` | nav pill, hero glass, photo frames |
| buttons | no shadow, no glow | per DESIGN_SYSTEM |
| `--glass-nav` | `rgb(23 33 38/.72)` + `blur(24px) saturate(110%)`, border `rgb(247 252 255/.40)`; mobile solid `.92` | one recipe on all routes incl. home |
| `--glass-panel` | `rgb(23 29 33/.72)` + `blur(18px) saturate(110%)`, border `--color-line-dark` | only over photography (hero copy, captions, photo-band overlays) |
| `--surface-card` | `--color-raised` solid, no blur | every card over the graphite stage |
| Fallbacks | `.95` solid without `backdrop-filter`, under `prefers-reduced-transparency`, and < 768 except nav | unchanged rule |

**Migration order (smallest risk first):** (1) add the tokens; (2) re-point the existing `@theme` names; (3) delete override blocks file by file, re-capturing the 1440/1280/1024/390 screenshots per CLAUDE.md after each; (4) homepage `so-*` last, never touching `.so-hero` (locked). Add a CI guard that fails on new hex/rgba literals or `!important` outside `@theme`.

## 8. Evidence index

| Path (under `ws-a2/`) | Contents |
|---|---|
| `shots/vp/<route>/` | 312 viewport frames (`d1440_NN`, `m390_NN`, `l1280_NN`, `t768_NN`) |
| `shots/full/` | 48 full-page JPEGs |
| `shots/sheets/<route>__<vp>_N.jpg` | per-route contact sheets used for inspection |
| `shots/sheets/compare_heroes_d1440.jpg`, `compare_heroes_m390.jpg`, `compare_closing_cta_d1440.jpg`, `compare_404_legal.jpg` | side-by-side comparisons |
| `shots/sheets/forms_validation.jpg`, `shots/forms/` | empty-submit validation state, 7 forms × 2 widths |
| `shots/states/` | button/link base, hover, focus clips |
| `shots/sheets/images_rendered_0..3.jpg`, `images_source_assets.jpg`, `product_vs_manufacturer.jpg`, `ai_check_1.jpg` | image contact sheets |
| `shots/crop_mobile_header.jpg` | VA-13 |
| `data/*.json`, `data/analysis.md`, `data/matrix.md`, `data/states.json`, `data/imgstats.json` | raw measurements |
| `scripts/` | capture, states, analysis, image and inventory scripts (re-runnable) |

---

## Appendix A — full computed-style tables (generated, `data/analysis.md`)


### bg colours: 49 distinct computed values -> 35 clusters (dE76<3, alpha+-0.05)

| # | Representative | Members (value×count) | Uses | Routes | Nearest token (dE) | Top classes |
|---|---|---|---|---|---|---|
| 1 | `#0ea5e9` | #0ea5e9×131 | 131 | 20 | signal #0ea5e9 (0.0) | btn, s1-footer-main-cta, h-2 |
| 2 | `#282a28` | #282a28×84, #2a2c2b×4, #252725×4 | 92 | 12 | raised #1c222b (8.8) | surface-light, surface-white, scroll-mt-[72px] |
| 3 | `#eef2f4` | #eef2f4×44, #f5f7fa×40 | 84 | 20 | text-inv #f1f5f9 (1.5) | sr-only-focusable, s1-hardware-showcase-item, s1-product-well |
| 4 | `#202323/0.60` | #202323/0.60×40, #1c1e1e/0.63×19, #1a2120/0.64×6 | 65 | 20 | raised #1c222b (6.6) | wrap, li, so-panel-photo |
| 5 | `#06182b/0.80` | #06182b/0.80×48 | 48 | 5 | --s1-navy #0b1c30 (2.1) | field-input |
| 6 | `#1b2327` | #1b2327×14, #171d21×8, #202629×6, #162026×2 | 30 | 11 | raised #1c222b (3.8) | s1-legal-page, s1-glass-people-photo, split-hero |
| 7 | `#171a1b/0.86` | #171a1b/0.86×18, #171a1a/0.89×11 | 29 | 5 | base #151a21 (4.5) | div, flex, so-section-heading |
| 8 | `#0d2339/0.78` | #0d2339/0.78×18, #0e283f/0.83×10 | 28 | 9 | --s1-navy #0b1c30 (3.6) | rounded-card, overflow-hidden, m-0 |
| 9 | `#0c2b44/0.70` | #0c2b44/0.70×26 | 26 | 5 | --site-control #0c2943 (1.4) | choice, check |
| 10 | `#d5dde6` | #d5dde6×24 | 24 | 2 | line #d5dde6 (0.0) | h-2, h-px |
| 11 | `#0270a8` | #0270a8×24 | 24 | 1 | signal-ink #0270a8 (0.0) | h-1.5 |
| 12 | `#172126/0.67` | #172126/0.67×19, #182025/0.64×1 | 20 | 20 | raised #1c222b (3.7) | wrap |
| 13 | `#172126/0.87` | #172126/0.87×19, #182025/0.86×1 | 20 | 20 | raised #1c222b (3.7) | wrap |
| 14 | `#e6f4fb` | #e6f4fb×16 | 16 | 4 | signal-tint #e6f4fb (0.0) | inline-flex, rounded-full |
| 15 | `#152e3d/0.46` | #152e3d/0.46×16 | 16 | 1 | raised-2 #232b36 (5.9) | span |
| 16 | `#191d1e/0.63` | #191d1e/0.63×15 | 15 | 1 | base #151a21 (4.7) | div, so-section-heading, so-vertical-content |
| 17 | `#1a1d1e/0.73` | #1a1d1e/0.73×11 | 11 | 4 | base #151a21 (4.8) | flex, bg-raised, mb-7 |
| 18 | `#202a30` | #202a30×8 | 8 | 4 | raised-2 #232b36 (3.8) | s1-legal-content |
| 19 | `#051729/0.69` | #051729/0.69×6 | 6 | 1 | text #0b1b2b (2.6) | field-input |
| 20 | `#232b36` | #232b36×6 | 6 | 3 | raised-2 #232b36 (0.0) | photo |
| 21 | `#fbf0dc` | #fbf0dc×6 | 6 | 3 | beta-tint #fbf0dc (0.0) | shrink-0, rounded-full, inline-flex |
| 22 | `#26343c` | #26343c×6 | 6 | 3 | line-dark #2a3340 (4.2) | s1-legal-review |
| 23 | `#142228/0.49` | #142228/0.49×4, #141f23/0.48×1 | 5 | 1 | raised #1c222b (4.2) | so-image-caption, so-hero-copy |
| 24 | `#ffffff/0.09` | #ffffff/0.09×4 | 4 | 4 | white #ffffff (0.0) | flex |
| 25 | `#d9ebf8` | #d9ebf8×4 | 4 | 1 | signal-tint #e6f4fb (4.7) | grid |
| 26 | `#182c35/0.28` | #182c35/0.28×4 | 4 | 1 | raised-2 #232b36 (4.8) | btn |
| 27 | `#e8e9ec` | #e8e9ec×4 | 4 | 2 | soon-tint #e8e9ec (0.0) | inline-flex |
| 28 | `#142d35` | #142d35×2, #172f3a×1 | 3 | 1 | raised-2 #232b36 (6.6) | s1-brand-home, s1-brand-stage |
| 29 | `#b8d0b7` | #b8d0b7×2 | 2 | 1 | live-tint #e5f2e9 (16.4) | so-hero-media |
| 30 | `#32668c/0.25` | #32668c/0.25×2 | 2 | 1 | signal-ink #0270a8 (11.7) | so-status |
| 31 | `#0c2741` | #0c2741×2 | 2 | 1 | --site-control #0c2943 (1.0) | bg-[#0c2741] |
| 32 | `#0a598b/0.50` | #0a598b/0.50×2 | 2 | 1 | signal-ink #0270a8 (9.9) | choice |
| 33 | `#081a2c` | #081a2c×1 | 1 | 1 | text #0b1b2b (1.6) | s1-brand-stage |
| 34 | `#e6f4f7/0.17` | #e6f4f7/0.17×1 | 1 | 1 | signal-tint #e6f4fb (2.1) | so-hero-bar |
| 35 | `#14262c/0.61` | #14262c/0.61×1 | 1 | 1 | raised #1c222b (5.5) | so-hero-bar |

### text colours: 73 distinct computed values -> 35 clusters (dE76<3, alpha+-0.05)

| # | Representative | Members (value×count) | Uses | Routes | Nearest token (dE) | Top classes |
|---|---|---|---|---|---|---|
| 1 | `#c7d8e3` | #c7d8e3×720, #c9ddeb×222, #cbd5e1×153, #c4d6df×80, #cbddea×6, #c7d9e7×6 +2 | 1195 | 20 | --site-muted #c9ddeb (2.4) | a, t-small, t-body |
| 2 | `#f2f9ff` | #f2f9ff×322, #f1f5f9×284, #f3f9ff×180, #f4f9ff×40, #f3faff×30, #eaf6ff×18 +8 | 926 | 20 | --site-on-dark #f2f9ff (0.0) | t-h4, summary, t-h3 |
| 3 | `#e7eef0` | #e7eef0×259, #e5edf2×6 | 265 | 17 | light-2 #e9eef4 (2.2) | t-small, t-lead, t-h4 |
| 4 | `#7dd3fc` | #7dd3fc×220, #72cffa×6, #70cef8×6 | 232 | 16 | signal-300 #7dd3fc (0.0) | t-num, span, t-kicker |
| 5 | `#daeaf6` | #daeaf6×192, #dbedf8×16, #dae8f3×4, #d2e4f0×2 | 214 | 9 | signal-tint #e6f4fb (4.4) | t-small, field-label, t-body |
| 6 | `#38bdf8` | #38bdf8×180 | 180 | 20 | signal-400 #38bdf8 (0.0) | span, t-kicker, link-arrow |
| 7 | `#f2f5f5` | #f2f5f5×164, #f3f6f7×14 | 178 | 12 | light #f5f7fa (1.8) | flex, t-h2, t-h4 |
| 8 | `#0ea5e9` | #0ea5e9×134 | 134 | 20 | signal #0ea5e9 (0.0) | s1-product-signature__one |
| 9 | `#061925` | #061925×80, #071827×20, #031827×1 | 101 | 20 | text #0b1b2b (3.5) | s1-footer-main-cta, span, btn |
| 10 | `#94a3b8` | #94a3b8×84 | 84 | 20 | text-inv-3 #94a3b8 (0.0) | span, t-caption |
| 11 | `#aabecb` | #aabecb×80, #aec4d2×2 | 82 | 20 | text-inv-2 #cbd5e1 (9.6) | span, so-disclosure |
| 12 | `#0b1118` | #0b1118×75 | 75 | 19 | on-signal #0b1118 (0.0) | btn |
| 13 | `#ffffff` | #ffffff×67 | 67 | 11 | white #ffffff (0.0) | btn, strong, px-4 |
| 14 | `#8cdcff` | #8cdcff×40, #8bdcff×12 | 52 | 20 | signal-300 #7dd3fc (4.7) | s1-footer-kicker, a, so-arrow |
| 15 | `#a5e0ff` | #a5e0ff×40, #9edfff×12 | 52 | 20 | signal-300 #7dd3fc (9.7) | a, so-text-link, so-arrow |
| 16 | `#0b1b2b` | #0b1b2b×40 | 40 | 20 | text #0b1b2b (0.0) | sr-only-focusable |
| 17 | `#0270a8` | #0270a8×16 | 16 | 4 | signal-ink #0270a8 (0.0) | inline-flex, rounded-full |
| 18 | `#bdd0e0` | #bdd0e0×6, #b5cfdf×4, #b8d1e1×2, #b7cad7×2 | 14 | 1 | text-inv-2 #cbd5e1 (4.3) | span, so-community-note, s1-product-signature__name |
| 19 | `#132b3a` | #132b3a×12 | 12 | 3 | raised-2 #232b36 (5.6) | figcaption |
| 20 | `#3e5360` | #3e5360×12 | 12 | 3 | text-2 #33475b (6.8) | span |
| 21 | `#d1e0e8` | #d1e0e8×6, #d3e2eb×4 | 10 | 1 | line #d5dde6 (2.5) | p |
| 22 | `#082138` | #082138×4, #0d253a×4, #062039×1 | 9 | 2 | --s1-navy #0b1c30 (3.3) | grid, span |
| 23 | `#e2e8f0` | #e2e8f0×8 | 8 | 4 | light-2 #e9eef4 (2.4) | t-lead |
| 24 | `#92400e` | #92400e×6 | 6 | 3 | beta #92400e (0.0) | shrink-0, rounded-full, inline-flex |
| 25 | `#9bc7e3` | #9bc7e3×6 | 6 | 1 | signal-300 #7dd3fc (12.2) | span, inline-flex, so-status |
| 26 | `#aac4d6` | #aac4d6×6 | 6 | 1 | text-inv-2 #cbd5e1 (9.4) | so-disclosure |
| 27 | `#8bcaea` | #8bcaea×4 | 4 | 1 | signal-300 #7dd3fc (7.1) | span |
| 28 | `#38576d` | #38576d×4 | 4 | 1 | text-2 #33475b (7.1) | small |
| 29 | `#374151` | #374151×4 | 4 | 2 | soon #374151 (0.0) | inline-flex |
| 30 | `#fcd47a` | #fcd47a×2 | 2 | 1 | beta-tint #fbf0dc (39.4) | inline-flex |
| 31 | `#bceaff` | #bceaff×2 | 2 | 1 | --site-muted #c9ddeb (9.2) | so-eyebrow |
| 32 | `#6fd1ff` | #6fd1ff×2 | 2 | 1 | signal-300 #7dd3fc (3.5) | span |
| 33 | `#d1d5db` | #d1d5db×2 | 2 | 1 | line #d5dde6 (3.3) | inline-flex |
| 34 | `#e2eff7/0.75` | #e2eff7/0.75×1 | 1 | 1 | signal-tint #e6f4fb (1.8) | so-hero-photo-note |
| 35 | `#ffffff/0.92` | #ffffff/0.92×1 | 1 | 1 | white #ffffff (0.0) | so-hero-photo-note |

### border colours: 42 distinct computed values -> 25 clusters (dE76<3, alpha+-0.05)

| # | Representative | Members (value×count) | Uses | Routes | Nearest token (dE) | Top classes |
|---|---|---|---|---|---|---|
| 1 | `#d5dde6` | #d5dde6×176 | 176 | 10 | line #d5dde6 (0.0) | grid, border-t, t-body |
| 2 | `#f4fbff/0.43` | #f4fbff/0.43×84, #f7fcff/0.44×38, #fafcff/0.45×2, #f4fbff/0.46×1 | 125 | 20 | --site-on-dark #f2f9ff (1.2) | wrap, card, relative |
| 3 | `#daf4ff/0.28` | #daf4ff/0.28×40, #d9f0fe/0.29×40 | 80 | 20 | signal-tint #e6f4fb (4.4) | s1-premium-footer, wrap |
| 4 | `#46565f` | #46565f×60 | 60 | 4 | text-2 #33475b (9.6) | s1-legal-section, s1-legal-content, t-body |
| 5 | `#b7e1fa/0.38` | #b7e1fa/0.38×48, #c2e5fc/0.42×6 | 54 | 6 | --site-muted #c9ddeb (8.6) | field-input |
| 6 | `#b4e0f8/0.32` | #b4e0f8/0.32×26, #abdbf5/0.32×16, #b1dbf6/0.27×10 | 52 | 6 | --site-muted #c9ddeb (8.8) | span, choice, check |
| 7 | `#e0f5ff/0.18` | #e0f5ff/0.18×40 | 40 | 20 | signal-tint #e6f4fb (2.7) | s1-footer-legal |
| 8 | `#f7faf8/0.26` | #f7faf8/0.26×30 | 30 | 1 | white #ffffff (2.5) | so-section-heading, article, div |
| 9 | `#ffffff/0.34` | #ffffff/0.34×28 | 28 | 9 | white #ffffff (0.0) | btn |
| 10 | `#c7e8fa/0.29` | #c7e8fa/0.29×20, #c6e3f8/0.24×5 | 25 | 9 | --site-muted #c9ddeb (5.5) | rounded-card, overflow-hidden, flex |
| 11 | `#f2f5f5` | #f2f5f5×20 | 20 | 2 | light #f5f7fa (1.8) | border-t-2 |
| 12 | `#ebf3f6/0.30` | #ebf3f6/0.30×12, #eaf0ef/0.28×8 | 20 | 5 | text-inv #f1f5f9 (1.8) | s1-hardware-showcase-item, mb-7, mt-8 |
| 13 | `#f9fdfc/0.52` | #f9fdfc/0.52×8, #fafbfa/0.50×4, #ffffff/0.47×4, #fdfdfd/0.58×1, #f5fcff/0.55×1, #fafdff/0.54×1 | 19 | 1 | white #ffffff (1.8) | so-panel-photo, so-vertical-visual, so-image-caption |
| 14 | `#b8daef/0.14` | #b8daef/0.14×16, #b8dcf2/0.18×2 | 18 | 1 | --site-muted #c9ddeb (5.9) | li, so-community-note |
| 15 | `#80949f` | #80949f×16 | 16 | 2 | line-strong #7c8da0 (5.3) | btn |
| 16 | `#0ea5e9` | #0ea5e9×10 | 10 | 1 | signal #0ea5e9 (0.0) | btn |
| 17 | `#232a29/0.53` | #232a29/0.53×6, #232a29/0.57×2 | 8 | 4 | raised #1c222b (8.0) | s1-glass-people-photo, s1-marketplace-photo |
| 18 | `#aed8f3/0.21` | #aed8f3/0.21×6, #acd7f2/0.23×2 | 8 | 1 | --site-muted #c9ddeb (9.8) | li, so-final-cta |
| 19 | `#657782` | #657782×6 | 6 | 3 | line-strong #7c8da0 (10.0) | s1-legal-review |
| 20 | `#151a21` | #151a21×6 | 6 | 1 | base #151a21 (0.0) | grid |
| 21 | `#eff9ff/0.76` | #eff9ff/0.76×4 | 4 | 1 | --site-on-dark #f2f9ff (1.0) | btn |
| 22 | `#ffffff/0.72` | #ffffff/0.72×4 | 4 | 1 | white #ffffff (0.0) | so-hardware-product |
| 23 | `#98d5f5/0.34` | #98d5f5/0.34×2 | 2 | 1 | signal-300 #7dd3fc (7.3) | so-status |
| 24 | `#78d8ff` | #78d8ff×2 | 2 | 1 | signal-300 #7dd3fc (3.1) | choice |
| 25 | `#2a3340` | #2a3340×2 | 2 | 1 | line-dark #2a3340 (0.0) | t-small |

### Gradients (background-image, non-photo): 10 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `radial-gradient(at 85% 0%, rgba(49, 72, 80, 0.28), rgba(0, 0, 0, 0) 62%), linear-gradient(145deg, rgb(37, 43, 46), rgb(23, 29, 33))` | 114 | 14 | surface-light @contact |
| `linear-gradient(128deg, rgba(23, 34, 39, 0.65), rgba(23, 36, 41, 0.43))` | 84 | 7 | card @equipment-marketplace |
| `radial-gradient(at 20% 0px, rgba(49, 72, 80, 0.22), rgba(0, 0, 0, 0) 60%), linear-gradient(145deg, rgb(35, 42, 46), rgb(21, 27, 31))` | 40 | 20 | s1-premium-footer @contact |
| `linear-gradient(rgba(255, 255, 255, 0.09), rgba(0, 0, 0, 0.08)), none` | 19 | 19 | wrap @contact |
| `radial-gradient(at 80% 10%, rgba(49, 72, 80, 0.3), rgba(0, 0, 0, 0) 60%), linear-gradient(145deg, rgb(37, 43, 46), rgb(23, 29, 33))` | 12 | 1 | so-vertical @home |
| `linear-gradient(110deg, rgba(17, 21, 23, 0.95), rgba(19, 23, 25, 0.82)), none` | 10 | 5 | split-hero @guard-attendance-software |
| `linear-gradient(90deg, rgba(8, 24, 34, 0.09) 0%, rgba(8, 24, 34, 0.06) 35%, rgba(8, 24, 34, 0) 72%), linear-gradient(rgba(8, 24, 34, 0.07), rgba(0, 0,` | 2 | 1 | so-hero-wash @home |
| `linear-gradient(145deg, rgb(19, 46, 71), rgb(39, 73, 96) 50%, rgb(16, 39, 62))` | 2 | 1 | surface-deep @this-page-does-not-exist-a2 |
| `linear-gradient(rgba(255, 255, 255, 0.086), rgba(0, 0, 0, 0.075))` | 1 | 1 | wrap @home |
| `linear-gradient(132deg, rgba(18, 36, 41, 0.88), rgba(28, 46, 53, 0.78))` | 1 | 1 | so-hero-copy @home |

### Box-shadows: 27 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `rgba(255, 255, 255, 0.23) 0px 1px 0px 0px inset, rgba(0, 9, 19, 0.57) 0px 22px 62px -37px` | 84 | 7 | card @equipment-marketplace |
| `rgba(255, 255, 255, 0.19) 0px 1px 0px 0px inset` | 44 | 20 | wrap @contact |
| `rgba(255, 255, 255, 0.5) 0px 1px 0px 0px inset, rgba(30, 179, 249, 0.7) 0px 14px 32px -20px` | 40 | 20 | s1-footer-main-cta @contact |
| `rgba(255, 255, 255, 0.26) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.51) 0px 16px 36px -24px` | 38 | 19 | wrap @contact |
| `rgba(255, 255, 255, 0.16) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.62) 0px 20px 55px -38px` | 36 | 1 | so-section-heading @home |
| `rgba(2, 22, 43, 0.38) 0px 25px 65px -35px, rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset` | 20 | 8 | overflow-hidden @guard-attendance-software |
| `rgba(0, 0, 0, 0.7) 0px 18px 50px -32px` | 12 | 3 | s1-hardware-showcase-item @equipment-marketplace |
| `rgba(0, 10, 27, 0.62) 0px 30px 74px -35px, rgba(255, 255, 255, 0.12) 0px 1px 0px 0px inset` | 10 | 2 | mb-7 @contact |
| `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(213, 221, 230) 0px 0px 0px 1px, rgba(0, 0, 0` | 10 | 1 | rounded-ui @guard-marketplace |
| `rgba(255, 255, 255, 0.35) 0px 1px 0px 0px inset, rgba(2, 73, 111, 0.22) 0px 8px 22px 0px` | 10 | 1 | btn @home |
| `rgba(255, 255, 255, 0.23) 0px 1px 0px 0px inset, rgba(0, 9, 20, 0.62) 0px 24px 65px -42px` | 8 | 2 | mb-7 @guards_join |
| `rgba(0, 0, 0, 0.75) 0px 10px 28px -18px, rgba(255, 255, 255, 0.23) 0px 1px 0px 0px inset` | 8 | 1 | so-panel-photo @home |
| `rgba(0, 0, 0, 0.12) 0px 1px 3px 0px inset` | 6 | 1 | field-input @get-started |
| `rgba(255, 255, 255, 0.29) 0px 1px 0px 0px inset, rgba(3, 9, 9, 0.75) 0px 20px 60px -35px` | 6 | 3 | s1-glass-people-photo @guards |
| `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.753499 -0.0842682 -0.11049 / 0.3) 0px 0p` | 6 | 2 | inline-flex @home |
| `rgba(255, 255, 255, 0.47) 0px 1px 0px 0px inset, rgba(0, 9, 18, 0.54) 0px 22px 60px -30px` | 4 | 1 | so-vertical-visual @home |
| `rgba(255, 255, 255, 0.13) 0px 1px 0px 0px inset` | 4 | 1 | so-image-caption @home |
| `rgba(0, 4, 17, 0.8) 0px 22px 65px -36px` | 4 | 1 | so-hardware-product @home |
| `rgba(255, 255, 255, 0.24) 0px 1px 0px 0px inset, rgba(2, 8, 8, 0.7) 0px 20px 60px -34px` | 2 | 1 | s1-marketplace-photo @guard-marketplace |
| `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.52127 -0.0584407 -0.106228 / 0.25) 0px 0` | 2 | 1 | inline-flex @guard-marketplace |
| `rgba(255, 255, 255, 0.23) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.44) 0px 14px 36px -23px` | 2 | 1 | wrap @home |
| `rgba(14, 165, 233, 0.14) 0px 0px 0px 5px` | 2 | 1 | so-signal-dot @home |
| `rgba(255, 255, 255, 0.28) 0px 1px 0px 0px inset, rgba(1, 12, 24, 0.4) 0px -12px 40px -27px` | 2 | 1 | so-hero-bar @home |
| `rgb(234, 246, 255) 0px 0px 0px 1px inset` | 2 | 1 | choice @radios-equipment |
| `rgba(255, 255, 255, 0.35) 0px 1px 0px 0px inset, rgba(0, 87, 150, 0.23) 0px 5px 18px 0px` | 1 | 1 | btn @home |
| `rgba(255, 255, 255, 0.56) 0px 1px 0px 0px inset, rgba(255, 255, 255, 0.13) 1px 0px 0px 0px inset, rgba(5, 14, 27, 0.43) 0px 27px 75px -32px, rgba(11, ` | 1 | 1 | so-hero-copy @home |
| `rgba(255, 255, 255, 0.24) 0px 1px 0px 0px inset, rgba(0, 12, 25, 0.5) 0px 25px 56px -29px` | 1 | 1 | so-hero-copy @home |

### Backdrop-filter: 14 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `blur(18px) saturate(1.25)` | 42 | 7 | card @equipment-marketplace |
| `blur(20px) saturate(0.9)` | 40 | 20 | wrap @contact |
| `blur(27px) saturate(1.11)` | 38 | 19 | wrap @contact |
| `blur(17px) saturate(0.89)` | 25 | 11 | mb-7 @contact |
| `blur(19px) saturate(0.9)` | 18 | 1 | so-section-heading @home |
| `blur(16px)` | 7 | 3 | s1-marketplace-photo @guard-marketplace |
| `blur(17px) saturate(1.05)` | 6 | 3 | s1-glass-people-photo @guards |
| `blur(15px) saturate(1.4)` | 4 | 1 | btn @home |
| `blur(13px)` | 4 | 1 | so-image-caption @home |
| `blur(28px) saturate(1.1)` | 2 | 1 | wrap @home |
| `blur(25px) saturate(1.12)` | 1 | 1 | so-hero-copy @home |
| `blur(22px) saturate(1.12)` | 1 | 1 | so-hero-bar @home |
| `blur(24px) saturate(1.12)` | 1 | 1 | so-hero-copy @home |
| `blur(20px) saturate(1.1)` | 1 | 1 | so-hero-bar @home |

### Glass tiers actually rendered (backdrop-filter × background × radius)

| backdrop | background | radius | uses |
|---|---|---|---|
| `blur(18px) saturate(1.25)` | `#000000/0.00` | 20px | 42 |
| `blur(20px) saturate(0.9)` | `#202323/0.60` | 28px | 20 |
| `blur(20px) saturate(0.9)` | `#202323/0.60` | 22px | 20 |
| `blur(27px) saturate(1.11)` | `#172126/0.67` | 999px | 19 |
| `blur(27px) saturate(1.11)` | `#172126/0.87` | 999px | 19 |
| `blur(19px) saturate(0.9)` | `#191d1e/0.63` | 24px | 11 |
| `blur(17px) saturate(0.89)` | `#0d2339/0.78` | 20px | 9 |
| `blur(17px) saturate(0.89)` | `#1a1d1e/0.73` | 0px | 7 |
| `blur(17px) saturate(1.05)` | `#1b2327` | 25px | 6 |
| `blur(17px) saturate(0.89)` | `#0e283f/0.83` | 20px | 5 |
| `blur(17px) saturate(0.89)` | `#1a1d1e/0.73` | 20px | 4 |
| `blur(15px) saturate(1.4)` | `#182c35/0.28` | 999px | 4 |
| `blur(13px)` | `#142228/0.49` | 999px | 4 |
| `blur(19px) saturate(0.9)` | `#191d1e/0.63` | 0px | 3 |
| `blur(19px) saturate(0.9)` | `#1c1e1e/0.63` | 24px | 3 |
| `blur(16px)` | `#1b2327` | 24px | 2 |
| `blur(16px)` | `#1b2327` | 26px | 2 |
| `blur(16px)` | `#1b2327` | 21px | 2 |
| `blur(28px) saturate(1.1)` | `#182025/0.64` | 999px | 1 |
| `blur(25px) saturate(1.12)` | `#141f23/0.48` | 26px | 1 |
| `blur(22px) saturate(1.12)` | `#e6f4f7/0.17` | 18px | 1 |
| `blur(19px) saturate(0.9)` | `#191d1e/0.63` | 25px | 1 |
| `blur(28px) saturate(1.1)` | `#182025/0.86` | 999px | 1 |
| `blur(24px) saturate(1.12)` | `#000000/0.00` | 22px | 1 |
| `blur(20px) saturate(1.1)` | `#14262c/0.61` | 21px | 1 |
| `blur(16px)` | `#1b2327` | 20px | 1 |

Distinct glass recipes: 26

### Opacity < 1: 7 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `0.35` | 80 | 20 | circle @contact |
| `0.7` | 80 | 20 | circle @contact |
| `0` | 6 | 1 | so-vertical-content @home |
| `0.8` | 4 | 1 | reveal @guard-patrol-software |
| `0.52` | 2 | 1 | s1-hero-orb-fallback @home |
| `0.9` | 1 | 1 | s1-hero-globe-layer @home |
| `0.16` | 1 | 1 | s1-hero-globe-layer @home |

### Font families (text elements): 4 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `inter, "inter Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` | 1931 | 20 | sr-only-focusable @contact |
| `inter, "inter Fallback", Inter, ui-sans-serif, system-ui, sans-serif` | 1671 | 19 | t-kicker @contact |
| `inter, "inter Fallback", Inter, ui-sans-serif, sans-serif` | 388 | 16 | btn @contact |
| `inter, "inter Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif, Inter, ui-sans-serif, sans-serif` | 8 | 1 | h2 @home |

### Font weights (text elements): 15 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `400` | 1835 | 20 | flex @contact |
| `700` | 767 | 20 | font-display @contact |
| `650` | 572 | 20 | btn @contact |
| `600` | 494 | 20 | sr-only-focusable @contact |
| `800` | 124 | 9 | t-num @contact |
| `750` | 114 | 20 | s1-footer-main-cta @contact |
| `500` | 24 | 4 | span @equipment-marketplace |
| `550` | 20 | 4 | text-text @get-started |
| `850` | 14 | 1 | s1-product-signature__one @home |
| `760` | 10 | 1 | h2 @home |
| `780` | 6 | 1 | h1 @home |
| `720` | 6 | 1 | strong @home |
| `740` | 6 | 1 | h3 @home |
| `770` | 4 | 1 | h2 @home |
| `480` | 2 | 1 | so-hero-lead @home |

### Font sizes (text elements, both widths): 65 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `14.4px` | 926 | 20 | s1-product-signature__one @contact |
| `17px` | 626 | 20 | sr-only-focusable @contact |
| `14px` | 579 | 18 | t-small @contact |
| `15px` | 357 | 20 | flex @contact |
| `18px` | 257 | 19 | t-h4 @contact |
| `24px` | 157 | 20 | t-num @contact |
| `15.2px` | 120 | 20 | summary @contact |
| `16px` | 106 | 20 | text-text-2 @contact |
| `12.8px` | 86 | 20 | span @contact |
| `20px` | 66 | 18 | mt-1 @contact |
| `19px` | 66 | 20 | font-display @contact |
| `20.8px` | 63 | 20 | span @contact |
| `20.16px` | 51 | 16 | t-h3 @contact |
| `32px` | 51 | 20 | h2 @contact |
| `34px` | 41 | 15 | t-h2 @equipment-marketplace |
| `22px` | 40 | 20 | font-display @contact |
| `10px` | 40 | 20 | span @contact |
| `12.16px` | 40 | 20 | s1-footer-kicker @contact |
| `11px` | 40 | 20 | span @contact |
| `40.32px` | 37 | 11 | t-h2 @equipment-marketplace |
| `20.88px` | 24 | 16 | t-lead @contact |
| `48.96px` | 20 | 20 | h2 @contact |
| `19.2px` | 20 | 1 | so-arrow @home |
| `12px` | 12 | 2 | text-xs @get-started |
| `41.6px` | 12 | 10 | t-hero @guard-attendance-software |
| `15.52px` | 12 | 1 | p @home |
| `28px` | 10 | 3 | font-display @join_sales |
| `40px` | 8 | 3 | t-h1 @contact |
| `60.8px` | 8 | 8 | t-hero @guard-attendance-software |
| `10.72px` | 8 | 1 | span @home |
| `12.48px` | 7 | 1 | so-image-caption @home |
| `25.92px` | 7 | 1 | s1-product-signature__one @home |
| `35.2px` | 7 | 1 | h2 @home |
| `15.68px` | 6 | 1 | strong @home |
| `15.28px` | 6 | 1 | span @home |
| `20.4px` | 6 | 1 | so-arrow @home |
| `22.4px` | 6 | 1 | h3 @home |
| `13.2px` | 6 | 1 | s1-product-signature__one @home |
| `61.92px` | 5 | 1 | h2 @home |
| `44px` | 4 | 3 | font-display @guards_join |
| `36px` | 4 | 2 | font-display @guards_join |
| `12.4px` | 4 | 1 | span @home |
| `17.28px` | 4 | 1 | p @home |
| `54.72px` | 4 | 1 | h2 @home |
| `11.68px` | 4 | 1 | span @home |
| `46.08px` | 4 | 4 | t-h1 @popia |
| `11.2px` | 3 | 1 | so-status @home |
| `64.8px` | 3 | 2 | h2 @home |
| `51.2px` | 3 | 1 | font-display @join_sales |
| `50.4px` | 2 | 2 | t-h1 @contact |
| `67.68px` | 2 | 1 | h1 @home |
| `53.28px` | 2 | 1 | h2 @home |
| `17.6px` | 2 | 1 | p @home |
| `49.6px` | 2 | 1 | h1 @home |
| `16.48px` | 2 | 1 | p @home |
| `30px` | 1 | 1 | mt-2 @get-started |
| `13.6px` | 1 | 1 | so-eyebrow @home |
| `18.72px` | 1 | 1 | so-hero-lead @home |
| `21.312px` | 1 | 1 | strong @home |
| `14.88px` | 1 | 1 | so-hero-lead @home |
| … 5 more | 5 | | |

### Line heights: 122 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `20.88px` | 640 | 20 | a @contact |
| `27.2px` | 456 | 20 | sr-only-focusable @contact |
| `21.7px` | 331 | 15 | t-small @contact |
| `14.4px` | 228 | 20 | s1-product-signature__one @contact |
| `24px` | 189 | 20 | flex @contact |
| `24.3px` | 188 | 9 | t-h4 @contact |
| `21px` | 164 | 19 | t-kicker @contact |
| `24.32px` | 120 | 20 | summary @contact |
| `18.75px` | 100 | 15 | btn @contact |
| `28.05px` | 90 | 10 | t-body @equipment-marketplace |
| `20.48px` | 86 | 20 | span @contact |
| `22.4px` | 77 | 7 | figcaption @equipment-marketplace |
| `21.6px` | 62 | 6 | t-num @contact |
| `25.6px` | 60 | 20 | span @contact |
| `33.28px` | 60 | 20 | span @contact |
| `29.75px` | 54 | 4 | t-body @popia |
| `21.75px` | 50 | 4 | a @popia |
| `23.04px` | 48 | 20 | flex @contact |
| `24.5952px` | 48 | 15 | t-h3 @contact |
| `24.4px` | 48 | 15 | t-h3 @contact |
| `28.8px` | 43 | 8 | grid @guard-marketplace |
| `17.5px` | 42 | 5 | inline-flex @guard-marketplace |
| `22px` | 40 | 20 | font-display @contact |
| `10px` | 40 | 20 | span @contact |
| `19.456px` | 40 | 20 | s1-footer-kicker @contact |
| `11px` | 40 | 20 | span @contact |
| `19px` | 40 | 20 | font-display @contact |
| `43.9488px` | 37 | 11 | t-h2 @equipment-marketplace |
| `37.06px` | 37 | 11 | t-h2 @equipment-marketplace |
| `19.2px` | 30 | 1 | so-arrow @home |
| `18px` | 28 | 20 | btn @contact |
| `26.35px` | 28 | 4 | t-body @equipment-marketplace |
| `31.32px` | 20 | 12 | t-lead @contact |
| `53.3664px` | 20 | 20 | h2 @contact |
| `27px` | 20 | 12 | t-lead @contact |
| `34.88px` | 20 | 20 | h2 @contact |
| `30.4px` | 18 | 1 | text-[1.1875rem] @guards |
| `20px` | 18 | 1 | btn @home |
| `24.375px` | 12 | 6 | mt-2 @contact |
| `15px` | 12 | 3 | s1-product-signature__one @equipment-marketplace |
| … 82 more | 314 | | |

### Letter-spacing: 59 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `normal` | 3204 | 20 | sr-only-focusable @contact |
| `1.44px` | 80 | 20 | font-display @contact |
| `-0.96px` | 62 | 6 | t-num @contact |
| `0.075px` | 58 | 17 | t-kicker @contact |
| `-0.6048px` | 48 | 15 | t-h3 @contact |
| `-0.6px` | 48 | 15 | t-h3 @contact |
| `-1.462px` | 41 | 15 | t-h2 @equipment-marketplace |
| `1.32px` | 40 | 20 | font-display @contact |
| `4.2px` | 40 | 20 | span @contact |
| `1.4592px` | 40 | 20 | s1-footer-kicker @contact |
| `4.62px` | 40 | 20 | span @contact |
| `1.14px` | 40 | 20 | font-display @contact |
| `-1.73376px` | 37 | 11 | t-h2 @equipment-marketplace |
| `-1.6px` | 26 | 20 | h2 @contact |
| `-2.448px` | 20 | 20 | h2 @contact |
| `-0.72px` | 9 | 2 | font-display @guards_join |
| `-1.824px` | 8 | 8 | t-hero @guard-attendance-software |
| `-1.248px` | 8 | 8 | t-hero @guard-attendance-software |
| `-0.8px` | 8 | 1 | t-num @guard-patrol-software |
| `-1.28px` | 8 | 1 | t-num @guards |
| `0.96px` | 8 | 1 | span @home |
| `-0.56px` | 8 | 2 | strong @home |
| `0.8576px` | 8 | 1 | span @home |
| `-1.5136px` | 7 | 1 | h2 @home |
| `-0.64px` | 7 | 1 | mt-2 @radios-equipment |
| `0.648px` | 6 | 1 | so-kicker @home |
| `0.256px` | 6 | 1 | so-marketplace-kicker @home |
| `1.4px` | 6 | 1 | so-step @home |
| `-0.9632px` | 6 | 1 | h3 @home |
| `0.63px` | 6 | 1 | so-kicker @home |
| … 29 more | 65 | | |

### Text-transform (non-none): 1 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `uppercase` | 4 | 2 | text-xs @get-started |

### Text under 14px (design-system floor) — element class, size, uses

| size | class | uses | where (sample) |
|---|---|---|---|
| 12.8px | `span` | 80 | contact:d, contact:m, equipment-marketplace:d, equipment-marketplace:m |
| 10px | `span` | 40 | contact:d, contact:m, equipment-marketplace:d, equipment-marketplace:m |
| 12.16px | `s1-footer-kicker` | 40 | contact:d, contact:m, equipment-marketplace:d, equipment-marketplace:m |
| 11px | `span` | 40 | contact:d, contact:m, equipment-marketplace:d, equipment-marketplace:m |
| 12px | `span` | 8 | home:d |
| 10.72px | `span` | 8 | home:m |
| 12.8px | `so-marketplace-kicker` | 6 | home:d, home:m |
| 12.48px | `so-image-caption` | 4 | home:d, home:m |
| 11.68px | `span` | 4 | home:m |
| 13.2px | `s1-product-signature__one` | 3 | home:m |
| 13.2px | `s1-product-signature__name` | 3 | home:m |
| 12px | `text-xs font-semibold uppercase tracking-widest text-sky-300` | 2 | get-started:d, get-started:m |
| 12px | `so-hero-photo-note` | 2 | home:d, home:m |
| 12.4px | `span` | 2 | home:d, home:m |
| 12.4px | `inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 ` | 2 | home:d, home:m |
| 11.2px | `so-status` | 2 | home:d, home:m |
| 12.48px | `so-editorial-disclosure` | 2 | home:d, home:m |
| 13.6px | `so-eyebrow` | 1 | home:d |
| 11.2px | `so-eyebrow` | 1 | home:m |
| 12.48px | `so-hero-note` | 1 | home:m |

Total text elements under 14px: 251

### Border radius (non-zero): 19 distinct

| Value | Uses | Routes | Example |
|---|---|---|---|
| `999px` | 296 | 20 | wrap @contact |
| `3.35544e+07px` | 119 | 12 | grid @get-started |
| `10px` | 109 | 20 | sr-only-focusable @contact |
| `13px` | 82 | 6 | field-input @contact |
| `20px` | 69 | 17 | mb-7 @contact |
| `18px` | 68 | 14 | mb-7 @contact |
| `24px` | 38 | 5 | s1-hardware-showcase-item @equipment-marketplace |
| `14px` | 28 | 3 | object-cover @guard-marketplace |
| `22px` | 21 | 20 | wrap @contact |
| `28px` | 20 | 20 | wrap @contact |
| `50%` | 18 | 4 | input @get-started |
| `11px` | 16 | 1 | span @home |
| `25px` | 8 | 4 | s1-glass-people-photo @guards |
| `15px` | 6 | 3 | object-cover @guards |
| `8px` | 6 | 3 | s1-legal-review @popia |
| `26px` | 3 | 1 | so-hero-copy @home |
| `21px` | 3 | 1 | so-hero-bar @home |
| `17px` | 2 | 1 | so-hardware-product @home |
| `12px` | 2 | 1 | t-body @security-trust |

### Headings by route (desktop 1440 / mobile 390): tag size/weight/line-height/letter-spacing

| Route | VP | H1 | H2 sizes | H3 sizes | H4 sizes |
|---|---|---|---|---|---|
| contact | d | 50.4px/700/53.424px/-2.1672px×1 | 20.16px/700/24.5952px/-0.6048px×1; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×3 | — |
| contact | m | 40px/700/42.4px/-1.72px×1 | 20px/700/24.4px/-0.6px×1; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×3 | — |
| equipment-marketplace | d | 50.4px/700/53.424px/-2.1672px×1 | 40.32px/700/43.9488px/-1.73376px×2; 48.96px/700/53.3664px/-2.448px×1 | 20.16px/700/24.5952px/-0.6048px×4 | — |
| equipment-marketplace | m | 40px/700/42.4px/-1.72px×1 | 34px/700/37.06px/-1.462px×2; 32px/700/34.88px/-1.6px×1 | 20px/700/24.4px/-0.6px×4 | — |
| get-started | d | 30px/700/36px/normal×1 | 40.32px/700/43.9488px/-1.73376px×1; 48.96px/700/53.3664px/-2.448px×1 | — | — |
| get-started | m | 24px/700/32px/normal×1 | 34px/700/37.06px/-1.462px×1; 32px/700/34.88px/-1.6px×1 | — | — |
| guard-attendance-software | d | 60.8px/700/60.8px/-1.824px×1 | 40.32px/700/43.9488px/-1.73376px×3; 20.16px/700/24.5952px/-0.6048px×1; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×11 | — |
| guard-attendance-software | m | 41.6px/700/41.6px/-1.248px×1 | 34px/700/37.06px/-1.462px×3; 20px/700/24.4px/-0.6px×1; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×11 | — |
| guard-marketplace | d | 60.8px/700/60.8px/-1.824px×1 | 40.32px/700/43.9488px/-1.73376px×4; 20.16px/700/24.5952px/-0.6048px×2; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×10 | — |
| guard-marketplace | m | 41.6px/700/41.6px/-1.248px×1 | 34px/700/37.06px/-1.462px×4; 20px/700/24.4px/-0.6px×2; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×10 | — |
| guard-patrol-software | d | 60.8px/700/60.8px/-1.824px×1 | 40.32px/700/43.9488px/-1.73376px×4; 20.16px/700/24.5952px/-0.6048px×1; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×15 | — |
| guard-patrol-software | m | 41.6px/700/41.6px/-1.248px×1 | 34px/700/37.06px/-1.462px×4; 20px/700/24.4px/-0.6px×1; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×15 | — |
| guards | d | 60.8px/700/60.8px/-1.824px×1 | 40.32px/700/43.9488px/-1.73376px×5; 48.96px/700/53.3664px/-2.448px×1 | 19px/600/30.4px/normal×9 | — |
| guards | m | 41.6px/700/41.6px/-1.248px×1 | 34px/700/37.06px/-1.462px×5; 32px/700/34.88px/-1.6px×1 | 19px/600/30.4px/normal×9 | — |
| guards_join | d | 44px/700/47.52px/-0.88px×1 | 20px/600/32px/normal×1; 18px/600/28.8px/normal×1; 48.96px/700/53.3664px/-2.448px×1 | — | — |
| guards_join | m | 36px/700/38.88px/-0.72px×1 | 20px/600/32px/normal×1; 18px/600/28.8px/normal×1; 32px/700/34.88px/-1.6px×1 | — | — |
| home | d | 67.68px/780/66.3264px/-4.19616px×1 | 61.92px/760/65.016px/-2.66256px×3; 53.28px/770/57.0096px/-2.29104px×2; 54.72px/750/61.2864px/-2.4624px×2; 64.8px/780/68.04px/-2.7864px×1; 48.96px/700/53.3664px/-2.448px×1 | 25.92px/700/30.8448px/-0.648px×3; 22.4px/740/26.88px/-0.9632px×3 | — |
| home | m | 49.6px/780/50.096px/-3.0752px×1 | 35.2px/760/36.96px/-1.5136px×3; 35.2px/770/37.664px/-1.5136px×2; 32px/750/35.84px/-1.44px×2; 41.6px/780/43.68px/-1.7888px×1; 32px/700/34.88px/-1.6px×1 | 20.8px/700/24.752px/-0.52px×3; 22.4px/740/26.88px/-0.9632px×3 | — |
| join_sales | d | 57.6px/700/59.904px/-1.152px×1 | 51.2px/700/64px/normal×3; 18px/650/24.3px/normal×1; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×6; 20.16px/700/24.5952px/-0.6048px×2; 28px/700/35px/normal×1 | — |
| join_sales | m | 46.4px/700/48.256px/-0.928px×1 | 41.6px/700/52px/normal×3; 18px/650/24.3px/normal×1; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×6; 20px/700/24.4px/-0.6px×2; 28px/700/35px/normal×1 | — |
| popia | d | 46.08px/700/51.6096px/-1.98144px×1 | 20.16px/700/24.5952px/-0.6048px×7; 48.96px/700/53.3664px/-2.448px×1 | — | — |
| popia | m | 34px/700/38.08px/-1.462px×1 | 20px/700/24.4px/-0.6px×7; 32px/700/34.88px/-1.6px×1 | — | — |
| pricing | d | 17px/700/27.2px/normal×1 | 40.32px/700/43.9488px/-1.73376px×4; 20.16px/700/24.5952px/-0.6048px×1; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×3; 20.16px/700/24.5952px/-0.6048px×1 | — |
| pricing | m | 17px/700/27.2px/normal×1 | 34px/700/37.06px/-1.462px×4; 20px/700/24.4px/-0.6px×1; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×3; 20px/700/24.4px/-0.6px×1 | — |
| privacy | d | 46.08px/700/51.6096px/-1.98144px×1 | 20.16px/700/24.5952px/-0.6048px×5; 48.96px/700/53.3664px/-2.448px×1 | — | — |
| privacy | m | 34px/700/38.08px/-1.462px×1 | 20px/700/24.4px/-0.6px×5; 32px/700/34.88px/-1.6px×1 | — | — |
| ptt-radio-rental | d | 60.8px/700/60.8px/-1.824px×1 | 40.32px/700/43.9488px/-1.73376px×3; 20.16px/700/24.5952px/-0.6048px×1; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×10 | — |
| ptt-radio-rental | m | 41.6px/700/41.6px/-1.248px×1 | 34px/700/37.06px/-1.462px×3; 20px/700/24.4px/-0.6px×1; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×10 | — |
| radios-equipment | d | 60.8px/700/60.8px/-1.824px×1 | 40.32px/700/43.9488px/-1.73376px×2; 18px/650/24.3px/normal×1; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×4; 20.16px/700/24.5952px/-0.6048px×3 | 32px/700/33.6px/-0.64px×7 |
| radios-equipment | m | 41.6px/700/41.6px/-1.248px×1 | 34px/700/37.06px/-1.462px×2; 18px/650/24.3px/normal×1; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×4; 20px/700/24.4px/-0.6px×3 | 28px/700/29.4px/-0.56px×7 |
| security-trust | d | 46.08px/700/51.6096px/-1.98144px×1 | 20.16px/700/24.5952px/-0.6048px×8; 48.96px/700/53.3664px/-2.448px×1 | — | — |
| security-trust | m | 34px/700/38.08px/-1.462px×1 | 20px/700/24.4px/-0.6px×8; 32px/700/34.88px/-1.6px×1 | — | — |
| service | d | 64.8px/700/66.744px/-2.7864px×1 | 40.32px/700/43.9488px/-1.73376px×2; 48.96px/700/53.3664px/-2.448px×1 | 20.16px/700/24.5952px/-0.6048px×4 | — |
| service | m | 44px/700/45.32px/-1.892px×1 | 34px/700/37.06px/-1.462px×2; 32px/700/34.88px/-1.6px×1 | 20px/700/24.4px/-0.6px×4 | — |
| solutions_security | d | 60.8px/700/60.8px/-1.824px×1 | 40.32px/700/43.9488px/-1.73376px×7; 48.96px/700/53.3664px/-2.448px×1 | 18px/650/24.3px/normal×10; 20.16px/700/24.5952px/-0.6048px×1 | — |
| solutions_security | m | 41.6px/700/41.6px/-1.248px×1 | 34px/700/37.06px/-1.462px×7; 32px/700/34.88px/-1.6px×1 | 18px/650/24.3px/normal×10; 20px/700/24.4px/-0.6px×1 | — |
| terms | d | 46.08px/700/51.6096px/-1.98144px×1 | 20.16px/700/24.5952px/-0.6048px×5; 48.96px/700/53.3664px/-2.448px×1 | — | — |
| terms | m | 34px/700/38.08px/-1.462px×1 | 20px/700/24.4px/-0.6px×5; 32px/700/34.88px/-1.6px×1 | — | — |
| this-page-does-not-exist-a2 | d | 60.8px/700/60.8px/-1.824px×1 | 48.96px/700/53.3664px/-2.448px×1 | — | — |
| this-page-does-not-exist-a2 | m | 41.6px/700/41.6px/-1.248px×1 | 32px/700/34.88px/-1.6px×1 | — | — |

### H1 position (top of H1 from page top) and width

| Route | d y | d size | m y | m size | text |
|---|---|---|---|---|---|
| contact | 175 | 50.4px | 149 | 40px | Tell us what you need. We will show you the right  |
| equipment-marketplace | 173 | 50.4px | 153 | 40px | The right equipment. Ready for the field. |
| get-started | 191 | 30px | 175 | 24px | Start with what your business needs. |
| guard-attendance-software | 489 | 60.8px | 217 | 41.6px | Know who is on post, and prove it. |
| guard-marketplace | 405 | 60.8px | 222 | 41.6px | Win the contract. Then staff it from the same syst |
| guard-patrol-software | 478 | 60.8px | 217 | 41.6px | Prove the patrol was walked. |
| guards | 277 | 60.8px | 414 | 41.6px | Your work, on record. Your next job, your choice. |
| guards_join | 445 | 44px | 503 | 36px | Create your guard profile |
| home | 329 | 67.68px | 381 | 49.6px | Run your business.As one. |
| join_sales | 276 | 57.6px | 407 | 46.4px | Sell the operating systems SMEs run on. |
| popia | 175 | 46.08px | 149 | 34px | POPIA and data handling |
| pricing | 303 | 17px | 221 | 17px | R2,50per guardper day |
| privacy | 175 | 46.08px | 149 | 34px | Privacy policy |
| ptt-radio-rental | 601 | 60.8px | 217 | 41.6px | Push-to-talk radios for your security contracts. |
| radios-equipment | 461 | 60.8px | 222 | 41.6px | Buy or rent radios. Keep your team connected. |
| security-trust | 175 | 46.08px | 149 | 34px | Access, accountability and data protection. |
| service | 235 | 64.8px | 217 | 44px | 1Service |
| solutions_security | 280 | 60.8px | 449 | 41.6px | Run your security business. As one. |
| terms | 175 | 46.08px | 149 | 34px | Website terms |
| this-page-does-not-exist-a2 | 179 | 60.8px | 153 | 41.6px | We could not find that page. |

### Containers (max-width centred blocks)

| max-width | pad L | pad R | rendered w @1440 | class | uses | routes |
|---|---|---|---|---|---|---|
| 1320px | 40px | 40px | 1320 | `wrap` | 77 | 20 |
| 1290px | 23.04px | 23.04px | 1290 | `wrap` | 20 | 20 |
| 720px | 24px | 24px | 720 | `world-guard` | 1 | 1 |
| 1320px | 47.52px | 47.52px | 1320 | `wrap` | 1 | 1 |

### Section rhythm (direct children of main + header/footer)

| Route | VP | # | tag/class | y | h | pad-top | pad-bot | min-h | content top offset | empty below content | heading |
|---|---|---|---|---|---|---|---|---|---|---|---|
| contact | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| contact | d | 1 | `div.wrap` | 0 | 1208 | 138px | 80px | 0px | 138 | 80 | Tell us what you need. We will show you  |
| contact | d | 2 | `footer.s1-premium-footer` | 1208 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| contact | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| contact | m | 1 | `div.wrap` | 0 | 2442 | 112px | 48px | 0px | 112 | 48 | Tell us what you need. We will show you  |
| contact | m | 2 | `footer.s1-premium-footer` | 2442 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| equipment-marketplace | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| equipment-marketplace | d | 1 | `section.surface-deep` | 0 | 655 | 129.6px | 112px | 0px | 130 | 112 | The right equipment. Ready for the field |
| equipment-marketplace | d | 2 | `section.surface-light` | 655 | 747 | 112px | 112px | 0px | 112 | 141 | Select what the operation requires. |
| equipment-marketplace | d | 3 | `section.surface-white` | 1401 | 444 | 112px | 112px | 0px | 112 | 112 | Buying or renting? |
| equipment-marketplace | d | 4 | `footer.s1-premium-footer` | 1845 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| equipment-marketplace | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| equipment-marketplace | m | 1 | `section.surface-deep` | 0 | 1044 | 112px | 80px | 0px | 112 | 80 | The right equipment. Ready for the field |
| equipment-marketplace | m | 2 | `section.surface-light` | 1044 | 1310 | 80px | 80px | 0px | 80 | 109 | Select what the operation requires. |
| equipment-marketplace | m | 3 | `section.surface-white` | 2354 | 429 | 80px | 80px | 0px | 80 | 80 | Buying or renting? |
| equipment-marketplace | m | 4 | `footer.s1-premium-footer` | 2783 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| get-started | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| get-started | d | 1 | `div.wrap` | 0 | 1353 | 138px | 64px | 0px | 167 | 64 | Start with what your business needs. |
| get-started | d | 2 | `footer.s1-premium-footer` | 1353 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| get-started | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| get-started | m | 1 | `div.wrap` | 0 | 1962 | 112px | 40px | 0px | 135 | 40 | Start with what your business needs. |
| get-started | m | 2 | `footer.s1-premium-footer` | 1962 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| guard-attendance-software | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| guard-attendance-software | d | 1 | `section.split-hero` | 0 | 1159 | 129.6px | 0px | 0px | 258 | 319 | Know who is on post, and prove it. |
| guard-attendance-software | d | 2 | `section.surface-light` | 1159 | 685 | 112px | 112px | 0px | 112 | 112 | Attendance as a record, not a timesheet |
| guard-attendance-software | d | 3 | `section.surface-light-2` | 1844 | 679 | 112px | 112px | 0px | 112 | 112 | From roster to proof |
| guard-attendance-software | d | 4 | `section.surface-light` | 2523 | 292 | 112px | 112px | 0px | 112 | 112 | What it does not do yet |
| guard-attendance-software | d | 5 | `section.surface-deep` | 2815 | 431 | 112px | 112px | 0px | 112 | 112 | Attendance you can show your client. |
| guard-attendance-software | d | 6 | `footer.s1-premium-footer` | 3246 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| guard-attendance-software | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| guard-attendance-software | m | 1 | `section.split-hero` | 0 | 1442 | 112px | 0px | 0px | 176 | 564 | Know who is on post, and prove it. |
| guard-attendance-software | m | 2 | `section.surface-light` | 1442 | 1117 | 80px | 80px | 0px | 80 | 80 | Attendance as a record, not a timesheet |
| guard-attendance-software | m | 3 | `section.surface-light-2` | 2559 | 808 | 80px | 80px | 0px | 80 | 80 | From roster to proof |
| guard-attendance-software | m | 4 | `section.surface-light` | 3368 | 369 | 80px | 80px | 0px | 80 | 80 | What it does not do yet |
| guard-attendance-software | m | 5 | `section.surface-deep` | 3736 | 646 | 80px | 80px | 0px | 80 | 80 | Attendance you can show your client. |
| guard-attendance-software | m | 6 | `footer.s1-premium-footer` | 4382 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| guard-marketplace | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| guard-marketplace | d | 1 | `section.split-hero` | 0 | 966 | 129.6px | 0px | 0px | 268 | 161 | Win the contract. Then staff it from the |
| guard-marketplace | d | 2 | `section.surface-light` | 966 | 787 | 112px | 112px | 0px | 112 | 112 | From contract to shift, in ten steps. |
| guard-marketplace | d | 3 | `section.surface-white` | 1754 | 915 | 112px | 112px | 0px | 112 | 112 | What it will look like |
| guard-marketplace | d | 4 | `section.surface-light` | 2669 | 552 | 112px | 112px | 0px | 112 | 112 | Private by design. |
| guard-marketplace | d | 5 | `section.surface-white` | 3221 | 1111 | 112px | 112px | 0px | 112 | 112 | Register interest |
| guard-marketplace | d | 6 | `footer.s1-premium-footer` | 4332 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| guard-marketplace | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| guard-marketplace | m | 1 | `section.split-hero` | 0 | 1126 | 112px | 0px | 0px | 178 | 89 | Win the contract. Then staff it from the |
| guard-marketplace | m | 2 | `section.surface-light` | 1126 | 1515 | 80px | 80px | 0px | 80 | 80 | From contract to shift, in ten steps. |
| guard-marketplace | m | 3 | `section.surface-white` | 2641 | 1636 | 80px | 80px | 0px | 80 | 80 | What it will look like |
| guard-marketplace | m | 4 | `section.surface-light` | 4278 | 1028 | 80px | 80px | 0px | 80 | 105 | Private by design. |
| guard-marketplace | m | 5 | `section.surface-white` | 5305 | 1656 | 80px | 80px | 0px | 80 | 80 | Register interest |
| guard-marketplace | m | 6 | `footer.s1-premium-footer` | 6962 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| guard-patrol-software | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| guard-patrol-software | d | 1 | `section.split-hero` | 0 | 1138 | 129.6px | 0px | 0px | 258 | 308 | Prove the patrol was walked. |
| guard-patrol-software | d | 2 | `section.surface-white` | 1138 | 734 | 112px | 112px | 0px | 112 | 112 | From the checkpoint to the client's repo |
| guard-patrol-software | d | 3 | `section.surface-light` | 1871 | 641 | 112px | 112px | 0px | 112 | 112 | What a patrol gives you |
| guard-patrol-software | d | 4 | `section.surface-light-2` | 2513 | 679 | 112px | 112px | 0px | 112 | 112 | From route to proof |
| guard-patrol-software | d | 5 | `section.surface-light` | 3191 | 348 | 112px | 112px | 0px | 112 | 112 | What it does not do yet |
| guard-patrol-software | d | 6 | `section.surface-deep` | 3540 | 431 | 112px | 112px | 0px | 112 | 112 | Patrols that leave a record. |
| guard-patrol-software | d | 7 | `footer.s1-premium-footer` | 3971 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| guard-patrol-software | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| guard-patrol-software | m | 1 | `section.split-hero` | 0 | 1382 | 112px | 0px | 0px | 176 | 477 | Prove the patrol was walked. |
| guard-patrol-software | m | 2 | `section.surface-white` | 1382 | 1930 | 80px | 80px | 0px | 80 | 80 | From the checkpoint to the client's repo |
| guard-patrol-software | m | 3 | `section.surface-light` | 3313 | 1036 | 80px | 80px | 0px | 80 | 80 | What a patrol gives you |
| guard-patrol-software | m | 4 | `section.surface-light-2` | 4349 | 808 | 80px | 80px | 0px | 80 | 80 | From route to proof |
| guard-patrol-software | m | 5 | `section.surface-light` | 5158 | 425 | 80px | 80px | 0px | 80 | 80 | What it does not do yet |
| guard-patrol-software | m | 6 | `section.surface-deep` | 5582 | 646 | 80px | 80px | 0px | 80 | 80 | Patrols that leave a record. |
| guard-patrol-software | m | 7 | `footer.s1-premium-footer` | 6228 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| guards | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| guards | d | 1 | `section.split-hero` | 0 | 835 | 138px | 0px | 0px | 233 | 96 | Your work, on record. Your next job, you |
| guards | d | 2 | `section.scroll-mt-[72px]` | 835 | 882 | 96px | 96px | 0px | 96 | 96 | On shift: the Guard app |
| guards | d | 3 | `section.scroll-mt-[72px]` | 1717 | 400 | 96px | 96px | 0px | 96 | 96 | PSiRA: what we ask and why |
| guards | d | 4 | `section.scroll-mt-[72px]` | 2117 | 480 | 96px | 96px | 0px | 96 | 96 | Your information |
| guards | d | 5 | `section.py-16` | 2597 | 559 | 96px | 96px | 0px | 96 | 96 | How joining works |
| guards | d | 6 | `footer.s1-premium-footer` | 3156 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| guards | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| guards | m | 1 | `section.split-hero` | 0 | 1000 | 112px | 0px | 0px | 122 | 56 | Your work, on record. Your next job, you |
| guards | m | 2 | `section.scroll-mt-[72px]` | 1000 | 1687 | 64px | 64px | 0px | 64 | 64 | On shift: the Guard app |
| guards | m | 3 | `section.scroll-mt-[72px]` | 2687 | 596 | 64px | 64px | 0px | 64 | 64 | PSiRA: what we ask and why |
| guards | m | 4 | `section.scroll-mt-[72px]` | 3282 | 798 | 64px | 64px | 0px | 64 | 64 | Your information |
| guards | m | 5 | `section.py-16` | 4080 | 950 | 64px | 64px | 0px | 64 | 64 | How joining works |
| guards | m | 6 | `footer.s1-premium-footer` | 5030 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| guards_join | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| guards_join | d | 1 | `div.wrap` | 0 | 300 | 138px | 0px | 0px | 159 | 21 |  |
| guards_join | d | 2 | `div.world-guard` | 328 | 793 | 40px | 64px | 0px | 40 | 64 | Create your guard profile |
| guards_join | d | 3 | `footer.s1-premium-footer` | 1120 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| guards_join | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| guards_join | m | 1 | `div.wrap` | 0 | 374 | 112px | 0px | 0px | 133 | 21 |  |
| guards_join | m | 2 | `div.world-guard` | 402 | 986 | 24px | 64px | 0px | 24 | 64 | Create your guard profile |
| guards_join | m | 3 | `footer.s1-premium-footer` | 1388 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| home | d | 0 | `header.sticky` | 0 | 88 | 8px | 8px | 0px | 20 | 20 |  |
| home | d | 1 | `section.s1-brand-stage` | 0 | 964 | 239px | 135px | 837px | 86 | 0 | Run your business.As one. |
| home | d | 2 | `section.so-chapter` | 964 | 994 | 125px | 125px | 0px | 174 | 167 | Every part of your business.Working as o |
| home | d | 3 | `section.so-vertical` | 1958 | 1239 | 129.6px | 129.6px | 0px | 200 | 156 | A complete business vision. Built for re |
| home | d | 4 | `section.so-vertical` | 3198 | 1006 | 129.6px | 129.6px | 0px | 203 | 156 | Your service business deserves its own O |
| home | d | 5 | `section.so-ecosystem-section` | 4204 | 719 | 115.2px | 115.2px | 0px | 115 | 115 | Not another tool for one task.A better w |
| home | d | 6 | `section.so-marketplace-section` | 4922 | 1217 | 115.2px | 115.2px | 0px | 164 | 149 | When your business needs more,the next s |
| home | d | 7 | `section.so-equipment-section` | 6139 | 1083 | 129.6px | 129.6px | 0px | 200 | 156 | The right technology. For the real job. |
| home | d | 8 | `section.so-onboarding-section` | 7222 | 813 | 115.2px | 115.2px | 0px | 164 | 115 | Start with the problem.We’ll help map th |
| home | d | 9 | `section.so-final-cta` | 8035 | 715 | 144px | 144px | 0px | 194 | 193 | Ready for a smarter way to run your busi |
| home | d | 10 | `footer.s1-premium-footer` | 8750 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| home | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| home | m | 1 | `section.s1-brand-stage` | -4 | 1117 | 0px | 34px | 0px | 76 | 35 | Run your business.As one. |
| home | m | 2 | `section.so-chapter` | 1113 | 1165 | 70px | 70px | 0px | 96 | 93 | Every part of your business.Working as o |
| home | m | 3 | `section.so-vertical` | 2279 | 1479 | 70px | 70px | 0px | 71 | 74 | A complete business vision. Built for re |
| home | m | 4 | `section.so-vertical` | 3758 | 1214 | 70px | 70px | 0px | 71 | 74 | Your service business deserves its own O |
| home | m | 5 | `section.so-ecosystem-section` | 4972 | 831 | 64px | 64px | 0px | 64 | 77 | Not another tool for one task.A better w |
| home | m | 6 | `section.so-marketplace-section` | 5803 | 2141 | 64px | 64px | 0px | 90 | 87 | When your business needs more,the next s |
| home | m | 7 | `section.so-equipment-section` | 7944 | 1274 | 70px | 70px | 0px | 118 | 70 | The right technology. For the real job. |
| home | m | 8 | `section.so-onboarding-section` | 9218 | 1225 | 70px | 70px | 0px | 96 | 70 | Start with the problem.We’ll help map th |
| home | m | 9 | `section.so-final-cta` | 10443 | 716 | 70px | 70px | 0px | 97 | 96 | Ready for a smarter way to run your busi |
| home | m | 10 | `footer.s1-premium-footer` | 11159 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| join_sales | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| join_sales | d | 1 | `section.split-hero` | 0 | 772 | 138px | 0px | 0px | 201 | 101 | Sell the operating systems SMEs run on. |
| join_sales | d | 2 | `section.scroll-mt-[72px]` | 772 | 717 | 96px | 96px | 0px | 96 | 96 | The role |
| join_sales | d | 3 | `section.scroll-mt-[72px]` | 1489 | 618 | 96px | 96px | 0px | 96 | 96 | How hiring works |
| join_sales | d | 4 | `section.scroll-mt-[72px]` | 2106 | 942 | 96px | 96px | 0px | 96 | 129 | Apply |
| join_sales | d | 5 | `section.py-12` | 3048 | 142 | 48px | 48px | 0px | 48 | 48 | Already a Signal One representative? |
| join_sales | d | 6 | `footer.s1-premium-footer` | 3190 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| join_sales | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| join_sales | m | 1 | `section.split-hero` | 0 | 940 | 112px | 0px | 0px | 122 | 56 | Sell the operating systems SMEs run on. |
| join_sales | m | 2 | `section.scroll-mt-[72px]` | 940 | 1143 | 64px | 64px | 0px | 64 | 64 | The role |
| join_sales | m | 3 | `section.scroll-mt-[72px]` | 2084 | 1184 | 64px | 64px | 0px | 64 | 64 | How hiring works |
| join_sales | m | 4 | `section.scroll-mt-[72px]` | 3268 | 1232 | 64px | 64px | 0px | 64 | 85 | Apply |
| join_sales | m | 5 | `section.py-12` | 4500 | 247 | 48px | 48px | 0px | 48 | 48 | Already a Signal One representative? |
| join_sales | m | 6 | `footer.s1-premium-footer` | 4747 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| popia | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| popia | d | 1 | `article.wrap` | 0 | 1635 | 138px | 80px | 0px | 138 | 203 | POPIA and data handling |
| popia | d | 2 | `footer.s1-premium-footer` | 1635 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| popia | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| popia | m | 1 | `article.wrap` | 0 | 2546 | 112px | 48px | 0px | 112 | 208 | POPIA and data handling |
| popia | m | 2 | `footer.s1-premium-footer` | 2546 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| pricing | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| pricing | d | 1 | `section.split-hero` | 0 | 892 | 129.6px | 0px | 0px | 258 | 128 | R2,50per guardper day |
| pricing | d | 2 | `section.surface-light` | 892 | 729 | 112px | 112px | 0px | 112 | 284 | Calculate your guard cost |
| pricing | d | 3 | `section.surface-white` | 1622 | 571 | 112px | 112px | 0px | 112 | 375 | Worked examples |
| pricing | d | 4 | `section.surface-light` | 2192 | 563 | 112px | 112px | 0px | 112 | 112 | Priced separately |
| pricing | d | 5 | `section.surface-base` | 2755 | 347 | 112px | 112px | 0px | 112 | 112 | Ready to start with guard days? |
| pricing | d | 6 | `footer.s1-premium-footer` | 3101 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| pricing | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| pricing | m | 1 | `section.split-hero` | 0 | 1002 | 112px | 0px | 0px | 176 | 64 | R2,50per guardper day |
| pricing | m | 2 | `section.surface-light` | 1002 | 1235 | 80px | 80px | 0px | 101 | 612 | Calculate your guard cost |
| pricing | m | 3 | `section.surface-white` | 2237 | 552 | 80px | 80px | 0px | 80 | 367 | Worked examples |
| pricing | m | 4 | `section.surface-light` | 2789 | 811 | 80px | 80px | 0px | 80 | 80 | Priced separately |
| pricing | m | 5 | `section.surface-base` | 3600 | 473 | 80px | 80px | 0px | 80 | 80 | Ready to start with guard days? |
| pricing | m | 6 | `footer.s1-premium-footer` | 4073 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| privacy | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| privacy | d | 1 | `article.wrap` | 0 | 1432 | 138px | 80px | 0px | 138 | 262 | Privacy policy |
| privacy | d | 2 | `footer.s1-premium-footer` | 1432 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| privacy | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| privacy | m | 1 | `article.wrap` | 0 | 2298 | 112px | 48px | 0px | 112 | 327 | Privacy policy |
| privacy | m | 2 | `footer.s1-premium-footer` | 2298 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| ptt-radio-rental | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| ptt-radio-rental | d | 1 | `section.split-hero` | 0 | 1443 | 129.6px | 0px | 0px | 258 | 129 | Push-to-talk radios for your security co |
| ptt-radio-rental | d | 2 | `section.surface-light` | 1443 | 620 | 112px | 112px | 0px | 112 | 112 | What we rent |
| ptt-radio-rental | d | 3 | `section.surface-light-2` | 2063 | 588 | 112px | 112px | 0px | 112 | 112 | How the quote works |
| ptt-radio-rental | d | 4 | `section.surface-light` | 2651 | 348 | 112px | 112px | 0px | 112 | 112 | What it does not do yet |
| ptt-radio-rental | d | 5 | `section.surface-deep` | 2999 | 431 | 112px | 112px | 0px | 112 | 112 | Radios for the contract, by quote. |
| ptt-radio-rental | d | 6 | `footer.s1-premium-footer` | 3430 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| ptt-radio-rental | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| ptt-radio-rental | m | 1 | `section.split-hero` | 0 | 1744 | 112px | 0px | 0px | 176 | 65 | Push-to-talk radios for your security co |
| ptt-radio-rental | m | 2 | `section.surface-light` | 1744 | 971 | 80px | 80px | 0px | 80 | 80 | What we rent |
| ptt-radio-rental | m | 3 | `section.surface-light-2` | 2715 | 674 | 80px | 80px | 0px | 80 | 80 | How the quote works |
| ptt-radio-rental | m | 4 | `section.surface-light` | 3389 | 425 | 80px | 80px | 0px | 80 | 80 | What it does not do yet |
| ptt-radio-rental | m | 5 | `section.surface-deep` | 3814 | 700 | 80px | 80px | 0px | 80 | 80 | Radios for the contract, by quote. |
| ptt-radio-rental | m | 6 | `footer.s1-premium-footer` | 4513 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| radios-equipment | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| radios-equipment | d | 1 | `section.split-hero` | 0 | 1159 | 129.6px | 0px | 0px | 258 | 286 | Buy or rent radios. Keep your team conne |
| radios-equipment | d | 2 | `section.surface-light` | 1159 | 2887 | 112px | 112px | 0px | 112 | 145 | The catalogue |
| radios-equipment | d | 3 | `section.surface-white` | 4046 | 1830 | 112px | 112px | 0px | 112 | 112 | Request a quote |
| radios-equipment | d | 4 | `footer.s1-premium-footer` | 5876 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| radios-equipment | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| radios-equipment | m | 1 | `section.split-hero` | 0 | 1343 | 112px | 0px | 0px | 178 | 380 | Buy or rent radios. Keep your team conne |
| radios-equipment | m | 2 | `section.surface-light` | 1343 | 4586 | 80px | 80px | 0px | 80 | 105 | The catalogue |
| radios-equipment | m | 3 | `section.surface-white` | 5930 | 3026 | 80px | 80px | 0px | 80 | 80 | Request a quote |
| radios-equipment | m | 4 | `footer.s1-premium-footer` | 8955 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| security-trust | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| security-trust | d | 1 | `article.wrap` | 0 | 2070 | 138px | 80px | 0px | 138 | 247 | Access, accountability and data protecti |
| security-trust | d | 2 | `footer.s1-premium-footer` | 2070 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| security-trust | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| security-trust | m | 1 | `article.wrap` | 0 | 3196 | 112px | 48px | 0px | 112 | 253 | Access, accountability and data protecti |
| security-trust | m | 2 | `footer.s1-premium-footer` | 3196 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| service | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| service | d | 1 | `section.surface-deep` | 0 | 740 | 129.6px | 112px | 0px | 130 | 112 | 1Service |
| service | d | 2 | `section.section` | 740 | 1437 | 112px | 112px | 0px | 112 | 141 | More than a roster. The operating system |
| service | d | 3 | `section.surface-deep` | 2177 | 340 | 112px | 112px | 0px | 112 | 112 | Help shape the service-business OS. |
| service | d | 4 | `footer.s1-premium-footer` | 2517 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| service | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| service | m | 1 | `section.surface-deep` | 0 | 1072 | 112px | 80px | 0px | 112 | 81 | 1Service |
| service | m | 2 | `section.section` | 1072 | 1964 | 80px | 80px | 0px | 80 | 101 | More than a roster. The operating system |
| service | m | 3 | `section.surface-deep` | 3035 | 443 | 80px | 80px | 0px | 80 | 80 | Help shape the service-business OS. |
| service | m | 4 | `footer.s1-premium-footer` | 3478 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| solutions_security | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| solutions_security | d | 1 | `section.split-hero` | 0 | 864 | 138px | 0px | 0px | 236 | 96 | Run your security business. As one. |
| solutions_security | d | 2 | `section.surface-light` | 864 | 684 | 112px | 112px | 0px | 112 | 112 | More than guarding operations. A busines |
| solutions_security | d | 3 | `section.surface-light` | 1548 | 669 | 112px | 112px | 0px | 112 | 112 | Know which posts are short before the cl |
| solutions_security | d | 4 | `section.surface-white` | 2217 | 1029 | 112px | 112px | 0px | 112 | 112 | What the guard does, on record. |
| solutions_security | d | 5 | `section.surface-light-2` | 3246 | 579 | 112px | 112px | 0px | 112 | 342 | Every assignment checks PSiRA status. |
| solutions_security | d | 6 | `section.surface-base` | 3825 | 702 | 112px | 112px | 0px | 114 | 112 | Show the client what was delivered. |
| solutions_security | d | 7 | `section.surface-light` | 4527 | 497 | 112px | 112px | 0px | 112 | 112 | Supervisors see their sites. Nobody sees |
| solutions_security | d | 8 | `section.surface-base` | 5024 | 347 | 112px | 112px | 0px | 112 | 112 | See it on your own operation. |
| solutions_security | d | 9 | `footer.s1-premium-footer` | 5370 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| solutions_security | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| solutions_security | m | 1 | `section.split-hero` | 0 | 1095 | 112px | 0px | 0px | 122 | 56 | Run your security business. As one. |
| solutions_security | m | 2 | `section.surface-light` | 1095 | 1312 | 80px | 80px | 0px | 80 | 80 | More than guarding operations. A busines |
| solutions_security | m | 3 | `section.surface-light` | 2407 | 918 | 80px | 80px | 0px | 80 | 80 | Know which posts are short before the cl |
| solutions_security | m | 4 | `section.surface-white` | 3324 | 1506 | 80px | 80px | 0px | 80 | 80 | What the guard does, on record. |
| solutions_security | m | 5 | `section.surface-light-2` | 4830 | 848 | 80px | 80px | 0px | 80 | 657 | Every assignment checks PSiRA status. |
| solutions_security | m | 6 | `section.surface-base` | 5679 | 1227 | 80px | 80px | 0px | 82 | 627 | Show the client what was delivered. |
| solutions_security | m | 7 | `section.surface-light` | 6906 | 795 | 80px | 80px | 0px | 80 | 435 | Supervisors see their sites. Nobody sees |
| solutions_security | m | 8 | `section.surface-base` | 7701 | 473 | 80px | 80px | 0px | 80 | 80 | See it on your own operation. |
| solutions_security | m | 9 | `footer.s1-premium-footer` | 8174 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| terms | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| terms | d | 1 | `article.wrap` | 0 | 1339 | 138px | 80px | 0px | 138 | 203 | Website terms |
| terms | d | 2 | `footer.s1-premium-footer` | 1339 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| terms | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| terms | m | 1 | `article.wrap` | 0 | 2061 | 112px | 48px | 0px | 112 | 208 | Website terms |
| terms | m | 2 | `footer.s1-premium-footer` | 2061 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |
| this-page-does-not-exist-a2 | d | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 14 | 14 |  |
| this-page-does-not-exist-a2 | d | 1 | `div.wrap` | 0 | 567 | 138px | 160px | 0px | 138 | 160 | We could not find that page. |
| this-page-does-not-exist-a2 | d | 2 | `footer.s1-premium-footer` | 585 | 886 | 57.6px | 0px | 0px | 112 | 108 | Run your business. As one. |
| this-page-does-not-exist-a2 | m | 0 | `header.sticky` | 0 | 76 | 8px | 8px | 0px | 16 | 16 |  |
| this-page-does-not-exist-a2 | m | 1 | `div.wrap` | 0 | 639 | 112px | 96px | 0px | 112 | 96 | We could not find that page. |
| this-page-does-not-exist-a2 | m | 2 | `footer.s1-premium-footer` | 639 | 1419 | 24px | 0px | 0px | 52 | 161 | Run your business. As one. |