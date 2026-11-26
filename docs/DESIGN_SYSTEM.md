# Signal One website design constitution

This is the definitive design system for the public website (signalone.co.za). It records every rule a page must follow and where it is implemented. When a page and this document disagree, the page is wrong.

- **Source of truth for brand:** the Signal One standard, `docs/architecture/SIGNAL_ONE_QUOTATION_STANDARD.html` in the LEOS repository ("Signal One Integrated Systems: Global Stylesheet"), and `docs/BRAND.md` for the logo. The website departs from the standard only where §11 says so.
- **Implementation:** tokens and shared components in `app/globals.css` (Tailwind v4 `@theme`); page shells (scene heroes, legal pages, product showcase, catalogue, footer) in `app/marketing-system.css`; the homepage in `app/home-conversion.css`; React primitives in `app/components/ui.tsx`; the logo in `app/components/brand/`.
- **Enforcement:** `scripts/check-design-system.mjs` runs before every build (`npm run build`) and fails it on a broken rule (§12). Browser checks are in `tests/e2e/` (layout, contrast, image scale, founder lock).

History: the 2026-11-25 consolidation (workstream W1, `docs/launch/BRAND_AUDIT.md` VA-01…27) replaced three CSS override layers (293 hex literals, 579 `!important`) with this single token layer. The measured before/after is in `BRAND_AUDIT.md` §9.

---

## 1. Decisions this system rests on

| Decision | Ruling | Source |
|---|---|---|
| One dark material family | **Graphite**, not navy. The 2026-10-29 direction approved "dark navy/slate glass"; the later 2026-11-15 image-coherence update moved the site to "quiet graphite gradients". The later decision wins; navy survives only inside the founder-locked homepage hero, which is not edited. | `BRAND_AUDIT.md` VA-01; §13 below |
| The site is one dark stage | Light colours exist only for manufacturer product wells. There are no light sections (departure (c) of the 2026-10-07 brief is retired). | 2026-11-15 update |
| Restrained glass | Glass only over photography and for the floating navigation. Cards on the flat stage are solid. | §6 |
| The homepage hero is founder-locked | Its CSS is one marked block, byte-for-byte as approved; it keeps its own type, buttons and colours. Everything around it uses this system. | `CLAUDE.md`; §10 |

## 2. Colour tokens

All colours are tokens in `@theme` (`app/globals.css`). Components use the token (`bg-raised`, `var(--color-raised)`), never a literal. A new colour is a change to this table first.

### Stage (graphite)

| Token | Value | Use |
|---|---|---|
| `deep` | `#171d21` | Page background (`body`), footer surround, end of the stage gradient |
| `base` | `#1f2529` | Footer shell, mobile menu sheet, scene-hero base under photography |
| `raised` | `#252b2e` | Cards, panels, framed media background, legal reading panel |
| `raised-2` | `#2c3438` | Form controls, option tiles, typographic product wells |
| `abyss` | `#0a0d12` | Product screenshot and phone frames only |
| `line-dark` | `rgb(235 243 246 / .16)` | Every hairline and card border on the stage, chapter rules |
| `line-strong` | `#7c8da0` | Form-control borders (4.2:1 on `raised-2`, WCAG 1.4.11) |

The **stage** (`--stage`) is one gradient painted once on `<main>` (`#252b2e` → `#171d21` with a faint top-right light): sections are transparent, so there are no colour seams between them (VA-02). A chapter boundary is a 1px `line-dark` rule (`main > section + section`).

### Text

| Token | Value | Use |
|---|---|---|
| `text-inv` | `#f1f5f9` | Headings, labels, primary text |
| `text-inv-2` | `#cbd5e1` | Body copy, field hints, footer links |
| `text-inv-3` | `#94a3b8` | Captions, disclosures, legal line (≥ 5.6:1 on `raised`) |
| `text` / `text-2` | `#0b1b2b` / `#33475b` | Only inside light product wells |

Four text colours on the stage, all solid. No copy uses opacity for its grey.

### Signal blue

| Token | Value | Use |
|---|---|---|
| `signal` | `#0ea5e9` | Primary button fill, the product numeral "1", the mark's dot |
| `signal-400` | `#38bdf8` | Primary button hover, focus ring on the stage |
| `signal-300` | `#7dd3fc` | **The one accent text colour on the stage:** links, kickers, numbered steps, heading accents (8.6:1 on `raised`) |
| `signal-600`, `signal-ink`, `signal-tint` | `#0284c7`, `#0270a8`, `#e6f4fb` | Inside light wells only (focus ring, accent text, tint) |
| `on-signal` | `#0b1118` | Text on `signal` fills |

### Status and errors

| State | On the stage | In a light well |
|---|---|---|
| Live | `live-inv #6ee7a0` | `live #166534` |
| Pilot, By quote | `signal-300` | `signal-ink` |
| Beta, MVP, In development | `beta-inv #fcd47a` | `beta #92400e` |
| Coming soon, Planned | `soon-inv #d1d5db` | `soon #374151` |
| Error | `danger-inv #ffb4ab` (≈ 9:1) | `danger #b42318` |

`well #eef2f4` is the neutral product-well surface. `docs/CONTRAST.md` lists every text/background pair with its ratio.

## 3. Typography

Inter Variable only (`app/lib/body-font.ts`). Weights: 400, 600, 650, 700, 800. One scale; every heading uses a class from it, never a page-level `text-[…]` size.

| Class | Size at 390 → 1440 (≥1600) | Line height | Tracking | Use |
|---|---|---|---|---|
| `.t-hero` | 41.6 → 60.8 (62.4–72) | 1.02 | −0.03em | The H1 of every marketing page (`.t-display` is an alias) |
| `.t-h1` | 34 → 46 (50) | 1.08 | −0.03em | H1 of form, legal, wizard and 404-type pages |
| `.t-h2` | 32 → 40 (44) | 1.08 | −0.03em | Every section heading, homepage included |
| `.t-h3` | 20 (22) | 1.25 | −0.012em | Card titles, product models, form step questions |
| `.t-h4` | 18 | 1.35 | 0 | List titles, fact terms |
| `.t-lead` | 19 → 21 (22) | 1.55 | 0 | Hero and section leads |
| `.t-body` | 17 | 1.65 | 0 | Body copy |
| `.t-small` | 15 | 1.55 | 0 | Secondary copy |
| `.t-caption` | 14 | 1.5 | 0 | Captions, disclosures — **the floor** |
| `.t-kicker` | 15 / 650 | 1.4 | 0.005em | Eyebrows, sentence case, `signal-300` |
| `.t-num` | per use, 800 | 0.9 | −0.04em | Numerals (price, calculator, steps) |

Rules: nothing a visitor needs to read is under 14px (the lockup descriptor, 10/11px, is the one exception, `docs/BRAND.md`). No all-caps labels: the SIGNAL ONE / INTEGRATED SYSTEMS lockup is the only uppercase text (the founder-locked hero eyebrow is grandfathered inside the hero). Measures: `.measure` 62ch. Product names in headings, labels, text links and kickers are rendered with `ProductSignature` (blue "1", 0.06em gap; release gate `tests/e2e/product-signature.spec.ts`). On a Signal-blue filled button the blue numeral would be invisible, so filled buttons use the plain name; running body copy may use the plain name.

## 4. Space and layout

| Token | Value |
|---|---|
| Container `.wrap` | `--wrap-max` 1320 (1440 from 1600px); `--wrap-pad` 16 / 24 (640) / 40 (1024) / 48 (1600) |
| Content edge | Bordered shells (header pill, footer shell, panels) sit on the content edge via `.shell` / `calc(100% − 2 × --wrap-pad)`, never in the gutter (VA-05) |
| Section `.section` | 80 / 96 (768) / 112 (1280) vertical padding, on every page including the homepage |
| Header | `--header-h` 80px (8 + 64px pill + 8). `<main>` clears it once; a first section is pulled up under the pill so its backdrop runs behind it |
| Card padding | 20–24px mobile, 28–40px desktop (`p-6 sm:p-7`, `clamp(24px,3vw,40px)`) |
| Gaps | 8 / 12 / 16 / 24 / 32 / 48 / 64 (Tailwind `gap-2…16`) |
| Hero geometry | `PageHero` and `SplitHero` share one grid: copy column `--hero-col` (38rem, 40rem ≥1600) beside the aside or photograph from 1024px; copy first below 1024px |

Wide screens get a wider container, not taller sections.

## 5. Geometry and elevation

| Token | Value | Use |
|---|---|---|
| `--radius-ui` | 12px | Inputs, option tiles, small media, tags, legal review chip |
| `--radius-card` | 24px | Cards, panels, framed photographs, product wells, footer shell |
| pill | 999px | Buttons, header pill, badges' dot, caption chips |
| `--shadow-card` | inset 1px top light + one soft drop | Cards and framed media |
| `--shadow-float` | stronger inset + drop | Header pill and glass panels over photography |

Three radii, two shadows. Buttons have no shadow and no glow.

## 6. Material and glass

Three tiers, all tokens in `:root`:

1. **Navigation** (`--glass-nav`, `rgb(23 33 38 / .72)` + `blur(20px) saturate(110%)`): the floating header pill, identical on every route including the homepage (VA-13).
2. **Panel over photography** (`--glass-panel`, `rgb(23 29 33 / .72)` + the same blur): `.glass`, the homepage business-introduction card over its backdrop, captions over photographs.
3. **Well label** (`--glass-well`): small labels sitting on a light product well.

Everything else on the stage is a **solid card** (`.card`: `raised`, `line-dark` border, `--shadow-card`). Glass is never applied over flat colour, where it adds nothing but GPU cost (VA-09).

Fallbacks: below 768px every panel renders solid (`--glass-panel-solid`, `.95`) and only the navigation blurs; without `backdrop-filter` support and under `prefers-reduced-transparency` every surface is solid. Text on glass meets the same contrast as text on the matching solid surface.

## 7. Components

| Component | Recipe | Where |
|---|---|---|
| **Buttons** | `.btn` 48px, `.btn-lg` 56px; pill radius; 16–17px / 650. `.btn-primary` = `signal` fill + `on-signal` label, hover `signal-400`. `.btn-ghost-dark` = 1px white .34 border, hover white .08 fill (`.btn-ghost-light` is an alias). Hover changes colour only — no lift, no glow. Press moves 1px. | `globals.css`, `ButtonLink` |
| **Text link** | `.link-arrow`: `signal-300`, 650, underline 1px at 4px offset, 2px on hover, 44px target. `→` for internal destinations, `↗` only for links that leave the site. | |
| **Order** | Left-aligned groups (heroes, stacked mobile groups): primary first. Right-aligned closing groups: secondary first, primary last (nearest the reading end). One primary per view. | |
| **Status badge** | `<Status kind>` → `.badge`: a coloured dot + 14px/600 sentence-case text in the state hue (§2). Never pill-shaped, so it cannot read as a button. One component, one look on every page. | `ui.tsx` |
| **Forms** | Labels 15px/650 `text-inv`; controls ≥ 52px (56px in the guard world), 17px text, `raised-2` fill, `line-strong` border, 12px radius; focus = `signal-400` border + 3px ring; invalid = `danger-inv` border + message linked by `aria-describedby` + focused error summary (`lib/formValidation.ts`); option tiles `.choice` checked = `signal-400` border + tint. | `globals.css` |
| **Stepper** | `<Stepper>`: "Step N of M · Label" + a segmented track. The only form-progress pattern (quote, onboarding, guard profile, careers). | `ui.tsx` |
| **Numbered list** | `<Steps>`: rule-separated rows with a `t-num` 24px `signal-300` numeral. The only "how it works" pattern. Homepage sequences (01–08) use the same numeral colour and weight. | `ui.tsx` |
| **Cards** | `.card` (§6). Fact lists: `FactPanel`. | |
| **Framed media** | Every photograph of people sits in one frame: `raised` background, 1px `line-dark`, 24px radius, `--shadow-card`, natural 16:9, complete (no face crops), caption below or as a chip. Classes `.media-frame`, `.s1-glass-people-photo`, `.s1-people-main-photo`. | |
| **Product well** | `.well` / `.s1-product-well`: `well` surface, product whole with `object-contain`, one well height per showcase so peers are at the same scale. A product without a manufacturer image gets no well at all (badge, then text), never an empty placeholder box or a stand-in photograph: an empty box reads as a failed image. | |
| **Catalogue** | `.catalogue-grid`: two-up from 640px; a group with one product spans the row as a horizontal card whose well is the same width as a two-up card's (no product photo is enlarged; `tests/e2e/image-scale.spec.ts`). | `marketing-system.css` |
| **Header** | One floating pill on every route: 64px tall, on the content edge, glass tier 1, primary links 600 weight with a white .09 hover/current fill, 48px primary button. Below 1280px a full-screen menu sheet. | `Header.tsx` |
| **Footer** | Shell on the content edge, `base` surface. The closing band (heading 2rem, the `t-h2` floor, so it never out-ranks the page) appears only on pages without their own closing action (`FooterCta.tsx`). | |
| **Focus** | 3px solid `signal-400`, 3px offset, on every focusable element; `signal-600` inside light wells. | |

## 8. Photography

- **People** are framed (§7), complete, illustrative and captioned "Illustrative scene" where required (`docs/ASSET_PROVENANCE.md`). Each page's lead photograph must make the same claim as its headline: officer-facing pages show officers at work, sales pages show account conversations (VA-16).
- **One placement per people photograph** on a page, and no photograph repeats on the homepage.
- **Scene backdrops** (business park, restaurant dining, warehouse yard) appear only behind a sector introduction (`/solutions/security`, `/guards`, `/guard-marketplace`, `/service`, `/guard-patrol-software`, and the homepage business introduction and 1Service section). They are toned to the graphite family by a luminosity blend over `base` and a `--scene-wash`, so a warm or saturated source never pulls a page off-palette (VA-17).
- **Products** are genuine manufacturer images on neutral wells, never edited, recoloured or generated. Peer products in identical frames are shown at the same device height.
- **No raster renders above its source resolution** (`tests/e2e/image-scale.spec.ts`). Backdrops that still upscale (VA-18) are listed for new masters in `docs/launch/IMAGE_INVENTORY.md` §5.
- Commissioning brief: `docs/PHOTOGRAPHY_BRIEF.md`.

## 9. Motion

- The **signal-pulse** on the header mark (2.8s, header only) is part of the brand.
- The **1GUARD entry shutter** on internal navigation: 1122ms sweep (Guard's `440ms × 2.55`), opaque sealed stage, reduced-motion bypass.
- Section reveals (`Reveal.tsx`): below-the-fold cards rise 20px on phones and slide in 42px from alternate sides from 640px (`main` clips horizontally, so a waiting card never widens the page); homepage panels enter from a direction (`HomeScrollChoreography.tsx`). Never on initial layout; reduced motion shows everything still.
- Buttons and inputs: colour transitions only (160ms).
- `prefers-reduced-motion` turns all motion off, including smooth scrolling.

## 10. The founder-locked homepage hero

The hero (photograph, composition, glass card, copy, CTA buttons, globe, platform bar) is locked by the founder. Its markup is pinned by `tests/e2e/visual-mission.spec.ts` ("FOUNDERS LOCK") and its CSS is the block between `BEGIN FOUNDER-LOCKED HERO` and `END FOUNDER-LOCKED HERO` at the top of `app/home-conversion.css`. That block is the only place allowed hard-coded colours, its own type sizes, the lifting CTA and `!important`. Changes are proved with pixel diffs of the hero at 1440, 1280, 1024, 768 and 390px (header excluded). Everything below the hero uses this system.

## 11. Approved departures from the Signal One standard

- (a) **Restrained glass is allowed; glassmorphism is not.** No glow shadows, no background grids, no neon (founder, 2026-10-07).
- (b) No mono or all-caps labels, except the SIGNAL ONE / INTEGRATED SYSTEMS lockup.
- (c) ~~Light sections alternate with dark ones.~~ Retired 2026-11-15: the site is one graphite stage.
- (d) Minimum text sizes and accessibility rules stay as set out here.

### Where the standard and accessibility conflict

| Standard | Problem | Resolution |
|---|---|---|
| Accent text `#0EA5E9` on light | below 4.5:1 | `signal-ink #0270A8` inside light wells |
| Accent text on dark | `#0EA5E9` on graphite is 4.4:1 | `signal-300 #7DD3FC` (8.6:1) for text; `#0EA5E9` stays for fills and the product numeral |
| Focus ring `#0EA5E9` | 2.6:1 on light | `signal-400` on the stage, `signal-600` in wells |
| `#0B1118` on `#0EA5E9` "≥ 7:1" | measures 6.84:1 | kept (passes AA) |
| Wordmark `ONE` `#0EA5E9` on light | 2.6:1 | kept (logotype exemption) |

## 12. How this is enforced

`npm run check:design` (also `prebuild`) fails the build if any of these break: Inter only; brand geometry; header/footer lockups; shutter cadence; graphite tokens present once; the retired token layers (`--s1-*`, `--site-*`, `--marketing-*`, `--so-quiet-surface`) and `main:not(.s1-brand-home)` override scoping absent; `!important` only in the safety nets (≤ 4 in `globals.css`, none in `marketing-system.css` or below the locked hero); no colour literals in `marketing-system.css` or the homepage sections, and a budget in `globals.css`; the locked hero is one marked block; no uppercase labels; no hover lift on buttons; one 3px focus recipe; legible header navigation; one badge component; the footer heading at 2rem; this document present.

Editing rules: fix a component at its source; never append a later, more specific rule to correct an earlier one. If a page needs something the system does not have, add it here and to the tokens first.

## 13. Decision history (kept for context; superseded where stated)

## Approved 2026-10-29 premium website direction (superseding conflicting earlier website-only rules)

Founder-approved visual direction for the public marketing website: cinematic image-led presentation, Signal One dark navy/slate glass, legible solid high-contrast text, floating premium panels, consistent interaction controls and destination-specific 1GUARD glass shutter transitions. These supersede the earlier website-only prohibitions on broad dark layouts, all glass depth, and cinematic navigation. The original SVG mark, Inter typeface, blue brand colours, logo spacing, minimum accessible text size, reduced-motion support and commercial content rules remain mandatory. **Navy materials were superseded by the 2026-11-15 graphite update below; floating panels, glass navigation and the shutter remain.** Marketing glass must not leak into quotations, Sales OS or product application interfaces.

## Approved 2026-11-15 image coherence update

The image audit implementation preserves the locked homepage hero and original brand while narrowing photographic backgrounds to relevant sector introductions. Quiet graphite gradients support actual manufacturer products, software proof, process steps, forms, pricing and the footer. This supersedes the earlier requirement for a different photographic backdrop beneath every marketing section. People remain framed except for the locked hero; manufacturer hardware is shown whole with contain sizing on neutral product wells. No generated hardware is used as product evidence. See `docs/ASSET_PROVENANCE.md`.

## 2026-11-25 consolidation (W1)

One token layer (this document); graphite confirmed as the single family (§1); homepage sections moved onto the shared scale, rhythm, buttons and badges; scene backdrops toned to graphite; header unified. Before/after metrics and evidence: `docs/launch/BRAND_AUDIT.md` §9, `docs/launch/evidence/w1/`.

## Approved 2026-11-26 light-first direction

(placeholder, rewritten below)
