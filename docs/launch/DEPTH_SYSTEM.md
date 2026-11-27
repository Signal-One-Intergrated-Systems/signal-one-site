# Depth system

Workstream DEPTH, 2026-11-27, branch `wip/depth` (worktree `/home/user/site-depth`), built on `claude/peaceful-johnson-azma60` @ `6728083`. The constitution is `docs/DESIGN_SYSTEM.md` ("Approved 2026-11-27 depth direction"); this file is the system, the per-route record, the asset brief and the evidence.

## 0. The direction

Founder, 2026-11-27: the light-first site "overcorrected towards white" and "lacks depth, atmosphere, visual dimension and a meaningful sense of experience". The homepage section "Every part of your business. Working as one." (architectural background, foreground photography, layered content surfaces) is the reference for depth, not a template. Wanted: "an immersive, bright, sophisticated enterprise experience" — architectural depth, natural daylight, layered compositions, refined frosted glass, directional light, soft realistic shadows, silver / ice-blue / warm-neutral surfaces, Signal blue accents, selective graphite and midnight-blue contrast, controlled gradients, meaningful section transitions. "White should be one of our materials, not the entire design." Distinct atmospheres per business area; never the same background photograph twice; depth without clutter.

## 1. Architecture: one layer on top of the role tokens

Nothing in the light-first role-token layer was replaced. The depth layer adds, in `app/globals.css` only:

| Part | Where | What it is |
|---|---|---|
| Material tokens | `:root` (`--mat-*`, `--midnight-*`, `--plinth-*`) | the colour values of every material, once |
| Light tokens | `:root` (`--sun-x`, `--sun`, `--sky`, `--warm-sun`, `--shaft`, `--edge-light`) | one light source for the whole site |
| Elevation tokens | `@theme` (`--shadow-contact`, `--shadow-card`, `--shadow-float`) | three tiers, all falling away from the light |
| Glass tokens | `:root` (`--plane`, `--glass-panel`, `--glass-panel-solid`, `--glass-nav`, `--glass-edge`) | three glass tiers plus the navigation glass |
| Veil tokens | `:root` (`--veil-strong`, `--veil-mid`, `--veil-clear`) | how a photograph is calmed under text |
| Material classes | `@layer components` (`.mat-day`, `.mat-silver`, `.mat-ice`, `.mat-stone`, `.mat-close`, `.mat-midnight`, `.mat-scene`, `.mat-signal`) | what a section names in markup |
| Surface classes | `.card` (tier 2), `.plane` (tier 1), `.glass` (tier 3), `.well` (plinth) | what a panel names in markup |

A page names one material per section (`className="section mat-silver"`); a page names its scene photograph once, in `app/marketing-system.css` (`--scene`). `PageHero` and `SplitHero` take a `material` prop; `LandingPage` maps each product journey (`security`, `attendance`, `patrol`, `radio-rental`) to its atmosphere in one table. No page carries its own gradient, shadow or colour (enforced, §9).

## 2. Materials

Light materials run **horizon → body → horizon**: they fade to the shared horizon tone (`--mat-horizon`, the light canvas `#F7F9FB`) over `min(140px, 18%)` at the top and bottom, so any two materials meet on the same tone and a section boundary never shows a seam or a rule. A section that continues the one before it (`pt-0`, same material) joins it with no fade (`:has()`), so one chapter can span two sections. On top of the body: the sun (a radial light from the top right, `--sun-x: 84%`) and a faint shaft of daylight (`--shaft`, 112°). Both only ever lighten, so **the body tone is the worst case for text** and that is what the build checks.

| Material | Body | Light | Character | Used for |
|---|---|---|---|---|
| `mat-day` | `#FFFFFF` pearl | cool sky | white as a material: breathing space between deeper chapters | field and access chapters, worked examples, categories |
| `mat-silver` | `#E6EDF2` | white sun | cool brushed silver: precise, engineered | catalogue, 1GUARD business OS, PSiRA, pricing hero, equipment hero, marketplace |
| `mat-ice` | `#E3EDF5` | Signal-blue sky | ice blue: technology, connection, calm forms | communications hero and equipment chapter, calculator, proof of service, forms |
| `mat-stone` | `#F1EBE3` | warm daylight | warm neutral stone: hospitality, people, reading | 1Service vision, About hero, legal pages, officer information, home ecosystem |
| `mat-close` | `#E3EDF5` | white sun | every page's closing band (automatic on a last section that names no material) | |
| `mat-signal` | (modifier on `mat-ice`) | | the site's one motif: a quiet coverage field of white arcs radiating from the light source, masked out before the copy | `/radios-equipment` hero, `/ptt-radio-rental` hero, homepage equipment chapter |
| `mat-scene` | an approved people-free photograph | | photographic environment under the veil (§6) | see §6 |
| `mat-midnight` | `#0F1B2B` → `#19304A` (lit corner) → `#0B1522` | Signal-blue light top right | **selective contrast**. Never a full-bleed band: a slab on the content edge, 32px radius (24px on phones), lit along its top edge, floating on the light page with a deep soft shadow. It takes the graphite text roles. | homepage 1GUARD, `/solutions/security` control room, `/radios-equipment` "What a solution can include", `/guard-marketplace` design preview (4, the enforced maximum) |

Graphite stays where it was (footer shell, product frames, the 1GUARD shutter); midnight is the new selective contrast and is part of the graphite scope (same text roles, midnight backgrounds).

## 3. Surfaces: three depth tiers

| Tier | Class | Recipe | Use |
|---|---|---|---|
| 0 Environment | `mat-*` | §2 | the section |
| 1 Plane | `.plane`, `.plane-rows` | white 70% (lets the material through faintly), white edge, lit top edge, contact shadow | grouped lists, fact panels (`FactPanel`), tables, spec and product lists, form shells |
| 2 Raised | `.card` | the same sheet with the card shadow | cards that are objects: journey cards, product cards, forms, marketplace cards |
| 3 Float | `.glass` and the homepage photo glass | frosted glass (§5) with the float shadow | only over photographs |

Panels no longer separate themselves with grey borders: a lit top edge (`--edge-light`, the restrained reflection) and a soft shadow do it. Framed people photographs float (tier 3 shadow). In a midnight or graphite scope the same tokens resolve to midnight or graphite sheets.

**Product plinth** (`.well`, `.s1-product-well`, homepage `.so-hardware-product`): lit from above (white for the top 30%) settling to silver (`#E8EEF2`) at the base, with an elliptical floor shadow under the product. The genuine manufacturer image stands on it whole; nothing about the product is altered.

## 4. Light and shadow

One sun, high on the right of every page (`--sun-x: 84%`, at the top of each section and of the midnight slab). Every drop shadow therefore falls down and slightly to the **left** (negative x): contact `-1px 3px 8px`, card `-6px 22px 44px`, float `-12px 38px 80px`, slab `-16px 48px 90px`, all in a cool graphite at 10–55%. The footer shell casts upward onto its silver ground (`--shadow-rise`). No glows, no neon; buttons keep no shadow.

## 5. Glass tiers

| Tier | Token | Value | Blur | Where |
|---|---|---|---|---|
| Plane | `--plane` | white 70% | none (no blur over gradients: cheap to scroll, VA-09) | tier 1 and 2 sheets |
| Frost | `--glass-panel` | white 86% | `blur(18px) saturate(150%)`, ≥768px only | panels over photographs (homepage introduction and its value rail, homepage 1Service copy) |
| Frost, solid | `--glass-panel-solid` | white 94% | none | the same panels below 768px, without `backdrop-filter`, and under reduced transparency |
| Navigation | `--glass-nav` | white 80% | `blur(22px) saturate(180%)` | the floating header pill |

Blur appears in exactly the named places (the build caps `backdrop-filter` declarations at 6).

## 6. Photographic environments and the veil

Each approved **people-free** environment is used **once** on the whole site (enforced):

| Scene | Page | Why |
|---|---|---|
| `bright/06-bright-architecture` | homepage business introduction | the founder's reference section, unchanged in spirit |
| `backgrounds/restaurant-courtyard` | homepage 1Service | modern service operations in daylight (was `restaurant-dining`, which also opened `/service`) |
| `backgrounds/restaurant-dining` | `/service` hero | the restaurant-first OS |
| `backgrounds/small-control-room` | `/solutions/security` hero | operational intelligence and control (was `business-park`, used on three pages) |
| `backgrounds/business-park` | `/guards` hero (veil mirrored, copy on the right) | the officer's workplace |
| `backgrounds/warehouse-yard` | `/guard-patrol-software` hero | patrol at a logistics yard |

Not used: `enterprise-showroom` (retired 2026-11-15; it shows generated devices, which must never read as stock), `hotel-lobby`, `hotel-corridor` (no page they would be honest for).

The veil has three strengths: **strong** (canvas 96%) under copy set directly on a photograph, **mid** (50%) where text sits only on frosted glass (`.scene-glass`), **clear** (22%) where no text sits. The veil holds under the copy column (computed from the hero geometry) and clears beyond it; below 1024px the copy spans the width, so the veil is even. The photograph's top and bottom dissolve into the horizon (10%), so a scene joins the materials around it; the homepage introduction starts at the hero's seam with no fade. Below-the-fold scenes still load after the page (DR-003).

## 7. Section transitions and rhythm

- Light material ↔ light material: both fade to the horizon; no rule. Two plain daylight sections still get a hairline.
- Into and out of midnight: the slab floats on the page with its own edge and shadow, so the dark never meets the light as a hard horizontal cut.
- Into the footer: the page's closing band ends on the horizon; the footer stands on a silver ground that rises from it (`horizon → silver`), and the graphite shell sits on that ground (no top rule).
- Section rhythm is unchanged (80 / 96 / 112). Motion is unchanged (existing reveals and homepage entrances, all off under reduced motion); no new scroll-linked effects were added.

## 8. Atmospheres by business area

| Area | Atmosphere | Composition |
|---|---|---|
| Signal One (home, About) | daylight architecture; layered glass over photography; one midnight slab | architecture scene → midnight 1GUARD slab → ice communications with the coverage field and plinths → courtyard 1Service under frost → stone → silver → day → closing ice |
| Communications (`/radios-equipment`, `/ptt-radio-rental`) | technological and connected: ice-blue with the coverage field radiating from the light; one midnight slab for the platform components | ice + signal hero with plinths and a fact plane → silver catalogue on plinths → midnight "What a solution can include" → day → ice close with the quote form |
| Equipment (`/equipment-marketplace`) | precise and commercially valuable: brushed silver, products on lit plinths | silver hero → day categories → ice close |
| 1GUARD (`/solutions/security`, patrol, attendance, `/guards`, marketplace, pricing) | operational intelligence and control: control-room and site environments, steel silver, midnight control slab | control-room scene → silver → midnight coverage slab → day → silver PSiRA → ice proof → day → close |
| 1Service (`/service`) | modern service operations: warm restaurant daylight and stone | dining scene → stone vision with floating photographs → close |
| Company and trust (About, Support, legal) | warm neutral reading surfaces, calm | stone / ice heroes; legal pages on stone with the reading column on a white panel |
| Forms (contact, trial, guard, careers) | calm ice / silver with the form on a raised sheet; inputs stay solid white | |

## 9. Enforcement (`npm run check:design`, runs before every build)

The design contract went from 29 to 36 checks. New, each proven by mutation (disabled → FAIL observed → restored → re-run PASS, 2026-11-27):

| Check | Reads | Mutation that turned it red |
|---|---|---|
| WCAG AA at the worst case of every material, plinth, slab, veil and glass tier — 346 computed pairs: every light text role on every light material body and on the plane over it; every graphite text role on every midnight stop, on the midnight plane and on the slab's lit corner; on each scene: veil-strong over the scene's darkest pixel, frost over veil-mid over the darkest pixel, solid glass over the darkest pixel; header text on navigation glass over black | `app/globals.css`, `docs/launch/depth-scene-floor.json` | `--mat-ice` → `#dfe9f1`; `--glass-panel` → 70%; `--glass-nav` → 60% |
| Every scene photograph is measured, unchanged since measurement (SHA-256) and used once | CSS `url()`s, `public/images`, `depth-scene-floor.json` (written by `scripts/measure-scene-floor.py`: 0.5th-percentile darkest pixel) | a scene reused on a second page; one byte appended to `warehouse-yard.webp` |
| Every shadow tier falls away from the light (x ≤ 0) | `@theme` shadows | card shadow x → +6px |
| Backdrop blur only on the named glass (≤ 6) | all three stylesheets | — |
| Midnight stays selective (≤ 4 slabs in markup) | markup | — |
| Materials come from the system (no ad-hoc gradient or photo backgrounds in markup) | markup | — |
| The depth system is documented and recorded in the constitution | this file, `DESIGN_SYSTEM.md` | — |

Existing checks kept and adjusted: graphite scope list gains `.mat-midnight`; the `globals.css` colour-literal budget rises 70 → 104 (the 31 new literals are all token declarations in `:root`; component rules gained none). Note: the worst case for text on a photograph is the photograph's darkest pixel, and every approved scene is effectively black at its darkest (`#081012`–`#281600`), so the veil-strong value had to rise from 93% to 96% — the light-first value failed accent text (4.3:1) at that worst case.

Browser tests: `tests/e2e/depth.spec.ts` (materials on every section; no scene repeated across routes; midnight is a slab on the content edge; header detached, one row, no trial button at 1024–1920 and in the mobile sheet; trial reachable inside the 1GUARD journeys; screenshot slots empty; the hero-radio interaction, skipped until the radio is mounted).

## 10. Supplementary directive (2026-11-27, same day)

| Item | State |
|---|---|
| 1 Interactive radio in the hero | **Component built, not mounted.** `app/components/HeroRadio.tsx` + `app/lib/heroRadio.ts` (genuine P30 Lite cut-out as a prop; device bounds, PTT key `x189 y204 w17 h122` and antenna tip `x340 y46` measured on the 600×600 source); a real `<Link href="/radios-equipment">` with the accessible name "Hytera P30 Lite — press to connect: explore radios and connectivity"; hover/focus tilt (transform only), PTT glow, "Press to connect" label; click/Enter/tap → 120 ms press-in, `navigator.vibrate(15)`, three rings from the antenna (~500 ms), then navigation through the site's route transition (`SceneTransition` hands over links marked `data-press-first`); reduced motion → plain immediate navigation; no JS → plain link. Styles in `app/home-conversion.css` (below the hero block). **Mounting it requires editing the founder-locked hero, which the session's permission system refused** (see §12). |
| 2 Radios-first CTA hierarchy | Done outside the hero: the homepage closing band leads with **Buy or rent radios** (primary), then Book a walkthrough, with the trial as a smaller text link; the 1GUARD section, `/solutions/security`, patrol, attendance and pricing keep "Request a 14-day trial". The hero's own buttons are unchanged (blocked with item 1). |
| 3 Header | Done: one floating glass pill detached 12px from the top and on the content edge at the sides; white 80% glass with `blur(22px) saturate(180%)`, a white edge, a lit top edge and a hairline ring; 44px link targets, 600 weight, a quiet current-page fill; **no trial button** on buyer pages (desktop and mobile sheet; the sheet's "Talk to Signal One" becomes its primary). Original logo and single-row nav kept; measured one row with no overflow at 1024–1920. |
| 4 Hero glass panel / globe hierarchy | **Blocked with item 1** (hero markup and CSS). Proposal recorded in §12. |
| 5 Genuine 1GUARD screenshots | Slots in place, empty: `app/lib/guardScreens.ts` (empty list), `app/components/GuardScreens.tsx` (renders nothing when empty), mounted in the homepage 1GUARD chapter (`home-guard`) and the `/solutions/security` control-room chapter (`guard-platform`); `home-hero` reserved. No dashboards or mock-ups anywhere. |

## 11. Asset brief: photography that would genuinely add depth

The system works with the approved set. These are the places where a new photograph would add something the materials cannot, in priority order. All: South African daylight, photographic (not illustrative render), **no people unless stated**, no logos or legible branding, no generated devices presented as products, colour graded to the bright set (≈ 5200–5800 K, saturation ≤ 0.35, lifted shadows, no crushed blacks — the veil calculation depends on the darkest pixel).

| # | Subject | Pixels / aspect | Composition (where text sits) | Placement | Light and palette |
|---|---|---|---|---|---|
| A1 | Contemporary communications environment: a calm, people-free equipment staging room or operations corridor with glass partitions, a radio charging rack and a wall-mounted handset rack, out of focus beyond the mid-ground; no device in sharp focus | 2880 × 1620 (16:9), people-free | left 45% quiet (white wall / glass / soft floor) for copy; detail on the right third | `/radios-equipment` hero (`mat-scene`, replacing `mat-ice mat-signal` there) | morning daylight from upper right; silver, ice blue, pale oak; one Signal-blue accent object allowed |
| A2 | Logistics yard at golden-hour-free daylight, wide, a perimeter fence and a pole-mounted camera, no people, no vehicles with branding | 2880 × 1620 | left 45% sky and paving for copy | `/guard-attendance-software` hero (today a silver material) | high sun from the right; cool concrete, steel, green verge |
| A3 | Masters of the existing environments at ≥ 2560 px wide (same compositions): `business-park`, `warehouse-yard`, `restaurant-dining`, `small-control-room`, `restaurant-courtyard` | 2880 × 1620 | unchanged | where they are | unchanged; regrade `restaurant-dining` to ≈ 5000 K (it is 3110 K, the warmest image on the site) |
| A4 | A sunlit modern reception / atrium, people-free, warm stone and timber, for the company story | 2880 × 1620 | right 45% quiet for copy | `/about` hero | late-morning light from the right; warm stone, timber, white |
| A5 | A higher-resolution official Hytera P30 Lite cut-out (transparent PNG, front, ≥ 1200 px tall device), the founder is sourcing it | device ≥ 1200 px tall, transparent | — | the hero radio (`lib/heroRadio.ts`: change `src`, re-measure device, PTT and antenna boxes) | manufacturer's own lighting, unedited |
| A6 | A ≥ 2880 px export of the approved hero photograph (or its replacement) | 2880 × 1620 | per the founder's choice | homepage hero | — |

## 12. Remaining issues and decisions

1. **The hero part of the supplementary directive is not done.** Rewriting the founder-locked hero (markup + CSS block) was refused by this session's permission system (auto-mode classifier: "Destructive or Unwanted Actions"), because `CLAUDE.md` makes the hero founder-locked and the authorisation reached this session only as a relayed coordinator message. Nothing in the hero was changed: `tests/fixtures/locked-home-hero.txt` and the FOUNDERS LOCK tests are untouched and pass. Ready to apply once permitted: the radio component, its CSS and its tests. Proposed composition (not implemented): photograph full-bleed `object-fit: cover`, untreated, `object-position: 0% 40%` so the three people stay right of the copy at 1024–1599 (the image is height-bound there; the woman's left edge stays at ≈ 676 px) and the copy's max width is tied to the photo's own negative space at ≥ 1600; no glass panel — dark ink copy on the sky and skyline with a light left-to-right gradient (white 82% → 0 by 52%) computed against the photograph region behind each text box at 1440/1280/1024/390; the globe as an atmospheric layer in the sky at low opacity behind the copy; the radio standing on the sunlit paving in the foreground below the copy with a contact shadow falling right (the scene's sun is from the left), ≈ 180–200 px tall; on phones the photograph as a full-width top band and the copy on the light material beneath. Its CTA order: Buy or rent radios (primary), Explore 1GUARD (secondary), trial as a text link.
2. The lower homepage (ecosystem → onboarding) and the long `/radios-equipment` catalogue are the least dimensional stretches: materials and plinths, no photography (asset A1 would change the communications page most).
3. Scene backdrops are still 1400 px masters and upscale on wide screens (VA-18, asset A3).
4. Phones: scene heroes keep an even strong veil (the copy spans the width), so the environment is barely visible there; glass panels over photographs are solid below 768px (no blur on phones by design).
5. The scroll measurement (390px, 4× CPU throttle, §13) counts main-thread long tasks and layout shift only; paint/raster cost of gradients is not measured by it.

## 13. Evidence

`docs/launch/evidence/depth/` (≈ 17 MB):

- `before/` (staging `web-staging-review-production`, captured 2026-11-27 before any change) and `after/` (this branch, local production build): full-page captures of all 21 routes at 1440, 1280, 1024 and 390 px (reduced motion; desktop archived at 35% scale, 390 at 75%; JPEG q55), named `<route>-<width>.jpg` (`home` = `/`).
- `filmstrip-<route>-<width>.jpg` in both folders: a continuous scroll with motion on, one viewport frame every 0.75 viewport height, left to right, top to bottom, for `/`, `/radios-equipment`, `/solutions/security`, `/service` and `/pricing` at 1440 and 390.
- Scroll performance (390px, 4× CPU throttle, top to bottom): 0 long tasks and CLS 0 on all five filmstrip routes, before and after.

## 14. Tests

All e2e runs under `timeout 2700 flock /tmp/claude-0/site-e2e.lock`, `PW_CHROMIUM=/opt/pw-browsers/chromium`, `--trace off`, suite ports 3100–3104/4010 cleaned before and after.

- `npm run build` (prebuild branding + design checks, postbuild rendered-truth check): RC 0; design contract **36/36**.
- Full suite on the final tree (after `git merge origin/claude/peaceful-johnson-azma60`, already up to date): **464 passed, 0 failed, 87 skipped** (84 opt-in evidence suites as before, plus the 3 hero-radio tests, which skip themselves while the radio is not mounted).
- Earlier full run on the same tree minus one class: 463 passed, 1 failed — `audw-fixes` AUDW-07 located the pricing guard-day boxes by the `rounded-card` utility the depth change had replaced with `card`; the class was restored next to `card` (no test change).
- Tests changed because this decision changed an expected value (no accessibility, contrast or truth assertion loosened): `visual-mission.spec.ts` — the scene expected on `/solutions/security` (now `small-control-room`), the homepage 1Service environment (now `restaurant-courtyard`), `/guard-marketplace` (now leads with its framed photograph, no scene), and `/guards` and `/guard-patrol-software` added to the scene assertions. New: `tests/e2e/depth.spec.ts`.
