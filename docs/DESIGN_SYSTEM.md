# Signal One website design constitution

This is the definitive design system for the public website (signalone.co.za). It records every rule a page must follow and where it is implemented. When a page and this document disagree, the page is wrong.

- **Source of truth for brand:** the Signal One standard, `docs/architecture/SIGNAL_ONE_QUOTATION_STANDARD.html` in the LEOS repository ("Signal One Integrated Systems: Global Stylesheet"), and `docs/BRAND.md` for the logo. The website departs from the standard only where §11 says so.
- **Implementation:** tokens and shared components in `app/globals.css` (Tailwind v4 `@theme`); page shells (scene heroes, legal pages, product showcase, catalogue, communications offer, footer) in `app/marketing-system.css`; the homepage in `app/home-conversion.css`; React primitives in `app/components/ui.tsx`; the logo in `app/components/brand/`.
- **Enforcement:** `scripts/check-design-system.mjs` runs before every build (`npm run build`) and fails it on a broken rule (§12), including a computed WCAG contrast check of every role pair. Browser checks are in `tests/e2e/` (layout, contrast, image scale, founder lock).
- **Evidence for the light-first change:** `docs/launch/LIGHT_THEME.md`, screenshots in `docs/launch/evidence/light/`.

History: the 2026-11-25 consolidation (W1) replaced three CSS override layers with one token layer. The **2026-11-26 light-first direction** kept that single layer and turned it into role tokens on two palettes (§2), so the whole site moved from a graphite stage to light surfaces without a second set of component recipes.

---

## 1. Decisions this system rests on

| Decision | Ruling | Source |
|---|---|---|
| **Light-first** | The public website is predominantly white, off-white and light-neutral, with dark readable type and Signal blue accents. It reads as a welcoming enterprise technology and communications company, not an operations centre. Roughly 65–80% of non-photographic page area is light. | Founder, 2026-11-26 |
| Graphite is selective | Graphite is a **scope**, not a stage. It is allowed only in the places named in the scope selector (§2, enforced): the footer shell, the homepage 1GUARD operations chapter, the 1GUARD control-room chapter on `/solutions/security` (`.tone-graphite`, at most four uses in markup), and product screenshot/phone frames. The 1GUARD entry shutter keeps its graphite glass (it is the 1GUARD product's motion, `signal-one-guard`). | Founder, 2026-11-26 |
| The internal products keep their look | The light website must not leak into, or borrow from, Sales OS or the 1GUARD operational shell; their dark-glass direction is unchanged. | Founder, 2026-11-26 |
| Restrained glass | Glass only for the floating navigation and over photography. Cards on flat colour are solid. | §6 |
| Photography keeps its daylight | No dark scrims and no luminosity toning over photographs. Scene backdrops sit under a light veil that is strongest under the copy and clears beyond it. | Founder, 2026-11-26; §8 |
| The homepage hero is founder-locked | Its CSS is one marked block, byte-for-byte as approved; it keeps its own type, buttons and colours (navy glass over the approved photograph). Everything around it uses this system. | `CLAUDE.md`; §10 |

## 2. Colour tokens

Components use **role tokens** only (`bg-surface`, `text-ink-2`, `border-hairline`, `var(--color-accent)`), never a literal. The roles are declared once in `@theme` pointing at the light palette; the graphite scope and the product-well scope re-point the same roles, so every component is correct on light, in graphite and inside a well without a dark-specific class. Values live once, in the two palettes in `:root` (`--light-*`, `--graphite-*`). A new colour is a change to these tables first.

### Roles

| Role (utility) | Light (default) | Graphite scope | Use |
|---|---|---|---|
| `canvas` | `#F7F9FB` | `#1E272D` | Page background; a graphite chapter's background |
| `surface` | `#FFFFFF` | `#263138` | Cards, panels, form controls, mobile menu sheet |
| `surface-2` | `#EDF3F7` | `#2E3A42` | The page's closing band, sunken fills, hovers, typographic wells |
| `ink` | `#18242D` | `#F1F5F9` | Headings, labels, primary text |
| `ink-2` | `#435566` | `#CBD5E1` | Body copy, hints |
| `ink-3` | `#56677A` | `#A3B1C0` | Captions, disclosures, legal line |
| `accent` | `#0270A8` (signal-ink) | `#7DD3FC` (signal-300) | **The one accent text colour:** links, kickers, numerals, heading accents |
| `hairline` | `#DCE4EA` | white 16% | Every border and rule |
| `line-strong` | `#75879A` | `#7C8DA0` | Form-control borders (WCAG 1.4.11) |
| `focus` | `#0284C7` (signal-600) | `#38BDF8` (signal-400) | The 3px focus ring |
| `live` / `beta` / `soon` / `danger` | `#166534` / `#92400E` / `#4B5563` / `#B42318` | `#6EE7A0` / `#FCD47A` / `#D1D5DB` / `#FFB4AB` | Status badges and errors |

Measured ratios (all ≥ 4.5:1 for text, ≥ 3:1 for borders and focus; recomputed by the build): ink 14.1, ink-2 6.9, ink-3 5.2, accent 4.8 on `surface-2` (the weakest light background); graphite ink-3 5.3 and accent 7.0 on graphite `surface-2`. Full list: `docs/CONTRAST.md`.

### Fixed brand colours (the same everywhere)

| Token | Value | Use |
|---|---|---|
| `signal` | `#0EA5E9` | Primary button fill, the product numeral "1", the mark's dot. **Never text on light** (2.8:1). |
| `signal-400` | `#38BDF8` | Primary button hover; focus in graphite |
| `signal-600` / `signal-ink` | `#0284C7` / `#0270A8` | Focus on light / accent text on light |
| `signal-300` | `#7DD3FC` | Accent text in graphite |
| `on-signal` | `#0B1118` | Text on a `signal` fill (6.8:1). The bright Signal blue keeps dark text; there is no white-on-bright-blue. |
| `well` | `#EEF2F5` | Manufacturer product well |
| `abyss` | `#0A0D12` | Product screenshot and phone frames |

The **page light** (`--stage`) is painted once on `<main>`: white at the top with a faint Signal-blue daylight from the top right, settling to `canvas`. Sections are transparent (no colour seams); a chapter boundary is a 1px `hairline` rule. A page's last section (its closing action) sits on `surface-2`, so the page ends on a calm band before the graphite footer.

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
| `.t-kicker` | 15 / 650 | 1.4 | 0.005em | Eyebrows, sentence case, `accent` |
| `.t-num` | per use, 800 | 0.9 | −0.04em | Numerals (price, calculator, steps) |

Rules: nothing a visitor needs to read is under 14px (the lockup descriptor, 10/11px, is the one exception, `docs/BRAND.md`). No all-caps labels: the SIGNAL ONE / INTEGRATED SYSTEMS lockup is the only uppercase text (the founder-locked hero eyebrow is grandfathered inside the hero). Measures: `.measure` 62ch. Product names in headings, labels, text links and kickers are rendered with `ProductSignature` (blue "1", 0.06em gap; release gate `tests/e2e/product-signature.spec.ts`). On a Signal-blue filled button the blue numeral would be invisible, so filled buttons use the plain name.

## 4. Space and layout

| Token | Value |
|---|---|
| Container `.wrap` | `--wrap-max` 1320 (1440 from 1600px); `--wrap-pad` 16 / 24 (640) / 40 (1024) / 48 (1600) |
| Content edge | Bordered shells (header pill, footer shell, panels) sit on the content edge via `.shell` / `calc(100% − 2 × --wrap-pad)`, never in the gutter (VA-05) |
| Section `.section` | 80 / 96 (768) / 112 (1280) vertical padding, on every page including the homepage |
| Header | `--header-h` 80px (8 + 64px pill + 8). `<main>` clears it once; a first section is pulled up under the pill so its backdrop runs behind it |
| Card padding | 20–24px mobile, 28–40px desktop |
| Gaps | 8 / 12 / 16 / 24 / 32 / 48 / 64 |
| Hero geometry | `PageHero` and `SplitHero` share one grid: copy column `--hero-col` (38rem, 40rem ≥1600) beside the aside or photograph from 1024px; copy first below 1024px |

Use the space: a heading column that would otherwise sit empty beside a long list may carry the section's supporting photograph (`LandingPage` `stepsVisual`, the 1GUARD coverage chapter).

## 5. Geometry and elevation

| Token | Value | Use |
|---|---|---|
| `--radius-ui` | 12px | Inputs, option tiles, small media, tags, journey links |
| `--radius-card` | 24px | Cards, panels, framed photographs, product wells, footer shell |
| pill | 999px | Buttons, header pill, caption chips |
| `--shadow-card` | soft, cool, low (light); inset light + drop (graphite) | Cards and framed media |
| `--shadow-float` | a little stronger | Header pill and glass panels over photography |

Three radii, two shadows. Buttons have no shadow and no glow. On light, a card is separated by its hairline and a soft shadow, not by a heavy border.

## 6. Material and glass

1. **Navigation** (`--glass-nav`, white 86% + `blur(20px) saturate(140%)`): the floating header pill, identical on every route including the homepage, carrying the light-surface lockup (VA-13).
2. **Panel over photography** (`--glass-panel`, white 80% + the same blur; solid 94% below 768px): `.glass`, the homepage business-introduction card over its backdrop, caption chips (`.photo-chip`, `.so-image-caption`).
3. **Well label** (`--glass-well`): small labels sitting on a light product well.

Everything else is a **solid card** (`.card`: `surface`, `hairline` border, `--shadow-card`). Glass is never applied over flat colour (VA-09). Inside a graphite scope the same tiers resolve to graphite glass. Without `backdrop-filter` support, below 768px and under `prefers-reduced-transparency` panels are solid. Text on glass meets the same contrast as text on the matching solid surface.

## 7. Components

| Component | Recipe | Where |
|---|---|---|
| **Buttons** | `.btn` 48px, `.btn-lg` 56px; pill radius; 16–17px / 650. `.btn-primary` = `signal` fill + `on-signal` label, hover `signal-400`. `.btn-ghost-dark` (alias `.btn-ghost-light`) = 1px `--ghost-border` (`#B5C3CE` on light, white 34% in graphite), `ink` label, hover `--ghost-hover` fill. Hover changes colour only — no lift, no glow. Press moves 1px. | `globals.css`, `ButtonLink` |
| **Text link** | `.link-arrow`: `accent`, 650, underline 1px at 4px offset, 2px on hover, 44px target. `→` internal, `↗` only for links that leave the site. | |
| **Order** | Left-aligned groups: primary first. Right-aligned closing groups: secondary first, primary last. One primary per view. | |
| **Status badge** | `<Status kind>` → `.badge`: a coloured dot + 14px/600 sentence-case text in the state role (§2). Never pill-shaped. | `ui.tsx` |
| **Forms** | Labels 15px/650 `ink`; controls ≥ 52px (56px in the guard world), 17px text, white `surface` fill, `line-strong` border, 12px radius; focus = `focus` border + 3px ring; invalid = `danger` border + message linked by `aria-describedby` + focused error summary on a 6% `danger` tint; option tiles `.choice` hover `surface-2`, checked = `focus` border + 10% Signal tint. | `globals.css` |
| **Stepper** | `<Stepper>`: "Step N of M · Label" + a segmented track (done `signal`, current `signal-600`, to-do outlined). | `ui.tsx` |
| **Numbered list** | `<Steps>`: rule-separated rows with a `t-num` 24px `accent` numeral. Homepage sequences (01–08) use the same numeral colour. | `ui.tsx` |
| **Cards** | `.card` (§6). Fact lists: `FactPanel`. | |
| **Framed media** | Every photograph of people sits in one frame: `surface` background, 1px `hairline`, 24px radius, `--shadow-card`, natural 16:9, complete (no face crops), caption below or as a light chip. | `.media-frame`, `.s1-glass-people-photo`, `.s1-people-main-photo` |
| **Product well** | `.well` / `.s1-product-well`: `well` surface, product whole with `object-contain`, one well height per showcase. A product without a manufacturer image gets no well at all. Wells are light inside graphite too (well scope). | |
| **Communications offer** | `/radios-equipment`: journeys as four compact cards (no shadow), components and industries as ruled definition lists, FAQ as native `details` with a 44px summary and a `+` that turns to `×`; product specifications as a ruled `.hardware-specs` block inside the card. Homepage `.so-journey-links`: four compact two-up links, never cards. | `marketing-system.css`, `home-conversion.css` |
| **Header** | One floating light-glass pill on every route: 64px, content edge, light lockup, links 600 weight with a `surface-2` hover/current fill, 48px primary button. Below 1280px a full-screen white menu sheet. | `Header.tsx` |
| **Footer** | Graphite shell (graphite scope) on the content edge, dark-tone lockup, contact block, link groups. The closing band appears only on pages without their own closing action (`FooterCta.tsx`). | |
| **Focus** | 3px solid `focus`, 3px offset, on every focusable element. | |

## 8. Photography

- **People** are framed (§7), complete, illustrative and captioned or disclosed as illustrative (`docs/ASSET_PROVENANCE.md`). Each page's lead photograph must make the same claim as its headline (VA-16).
- **Daylight is kept.** No dark overlay reduces a photograph's brightness; no CSS recolouring of people. Caption chips are light glass.
- **One placement per people photograph** on a page, and no photograph repeats on the homepage.
- **Scene backdrops** (business park, restaurant dining, warehouse yard, the bright architecture accent) appear only behind a sector introduction and the homepage business introduction and 1Service section. They keep their natural colour under a light veil (`--veil-strong` under the copy column, `--veil-clear` beyond it; even below 1024px where the copy spans the width).
- **The bright package** (2026-11-26) is placed by commercial relevance, not exhaustively: `docs/ASSET_PROVENANCE.md` lists each file, its hash and its page.
- **Products** are genuine manufacturer images on neutral wells, never edited, recoloured or generated.
- **No raster renders above its source resolution** (`tests/e2e/image-scale.spec.ts`).

## 9. Motion

- The **signal-pulse** on the header mark (2.8s, header only) is part of the brand.
- The **1GUARD entry shutter** on internal navigation: 1122ms sweep, graphite glass over an opaque sealed stage, reduced-motion bypass. It stays graphite: it is the 1GUARD product's motion.
- Section reveals (`Reveal.tsx`) and homepage panel entrances (`HomeScrollChoreography.tsx`): never on initial layout; reduced motion shows everything still.
- Buttons and inputs: colour transitions only (160ms). `prefers-reduced-motion` turns all motion off.

## 10. The founder-locked homepage hero

The hero (photograph, composition, glass card, copy, CTA buttons, globe, platform bar) is locked by the founder. Its markup is pinned by `tests/e2e/visual-mission.spec.ts` ("FOUNDERS LOCK") and its CSS is the block between `BEGIN FOUNDER-LOCKED HERO` and `END FOUNDER-LOCKED HERO` at the top of `app/home-conversion.css`. That block is the only place allowed hard-coded colours, its own type sizes, the lifting CTA and `!important`. The light-first change did not edit it; the sections below it take the role `ink` explicitly because the locked block sets a light text colour on `.so-home`.

## 11. Approved departures from the Signal One standard

- (a) **Restrained glass is allowed; glassmorphism is not.** No glow shadows, no background grids, no neon (founder, 2026-10-07).
- (b) No mono or all-caps labels, except the SIGNAL ONE / INTEGRATED SYSTEMS lockup.
- (c) Light surfaces with selective graphite chapters (restored 2026-11-26 in the light-first form of §1; the 2026-11-15 "one graphite stage" is retired).
- (d) Minimum text sizes and accessibility rules stay as set out here.

### Where the standard and accessibility conflict

| Standard | Problem | Resolution |
|---|---|---|
| Accent text `#0EA5E9` on light | 2.8:1 | `accent` = `signal-ink #0270A8` (4.8–5.4:1) |
| Accent text on graphite | `#0EA5E9` 4.4:1 | `accent` = `signal-300 #7DD3FC` in the graphite scope |
| Focus ring `#0EA5E9` | 2.6:1 on light | `focus` = `signal-600` on light, `signal-400` in graphite |
| `#0B1118` on `#0EA5E9` "≥ 7:1" | measures 6.84:1 | kept (passes AA) |
| Wordmark `ONE` `#0EA5E9` on light | 2.6:1 | kept (logotype exemption) |

## 12. How this is enforced

`npm run check:design` (also `prebuild`) fails the build if any of these break: Inter only; brand geometry; header lockup light-tone, footer lockup dark-tone; shutter cadence; the light palette is the page (`html`/`body` on `canvas`/`ink`, `color-scheme: light`); every role declared once in `@theme` pointing at the light palette and re-pointed in the graphite scope; graphite only in the approved scopes (and ≤ 4 `tone-graphite` uses in markup); **computed WCAG AA for every role pair on every background, in both palettes**; retired token names (the graphite-stage names, `--s1-*`, `--site-*`, `--marketing-*`, `--so-quiet-surface`) and retired utilities (`text-text-inv*`, `bg-raised*`, `*-line-dark`, `text-signal-300`, `text-signal`) absent; the scene veil is light and nothing tones photographs to luminosity; no override scoping; `!important` only in the safety nets (≤ 4 in `globals.css`, none in `marketing-system.css` or below the locked hero); no colour literals in `marketing-system.css` or the homepage sections, and a budget in `globals.css`; the locked hero is one marked block; no uppercase labels; no hover lift on buttons; one 3px focus recipe; legible header navigation; one badge component; the footer heading at 2rem; this document records the light-first decision.

Editing rules: fix a component at its source; never append a later, more specific rule to correct an earlier one. If a page needs something the system does not have, add it here and to the tokens first. A new graphite place is a founder decision and a change to the scope selector and §1.

## 13. Decision history (kept for context; superseded where stated)

The 2026-11-26 light-first direction (§1, and its entry at the end of this section) supersedes the graphite-stage rulings below wherever they conflict.

## Approved 2026-10-29 premium website direction (superseding conflicting earlier website-only rules)

Founder-approved visual direction for the public marketing website: cinematic image-led presentation, Signal One dark navy/slate glass, legible solid high-contrast text, floating premium panels, consistent interaction controls and destination-specific 1GUARD glass shutter transitions. These supersede the earlier website-only prohibitions on broad dark layouts, all glass depth, and cinematic navigation. The original SVG mark, Inter typeface, blue brand colours, logo spacing, minimum accessible text size, reduced-motion support and commercial content rules remain mandatory. **Navy materials were superseded by the 2026-11-15 graphite update below; floating panels, glass navigation and the shutter remain.** Marketing glass must not leak into quotations, Sales OS or product application interfaces.

## Approved 2026-11-15 image coherence update

The image audit implementation preserves the locked homepage hero and original brand while narrowing photographic backgrounds to relevant sector introductions. Quiet graphite gradients support actual manufacturer products, software proof, process steps, forms, pricing and the footer. This supersedes the earlier requirement for a different photographic backdrop beneath every marketing section. People remain framed except for the locked hero; manufacturer hardware is shown whole with contain sizing on neutral product wells. No generated hardware is used as product evidence. See `docs/ASSET_PROVENANCE.md`.

## 2026-11-25 consolidation (W1)

One token layer (this document); graphite confirmed as the single family (§1); homepage sections moved onto the shared scale, rhythm, buttons and badges; scene backdrops toned to graphite; header unified. Before/after metrics and evidence: `docs/launch/BRAND_AUDIT.md` §9, `docs/launch/evidence/w1/`.

## Approved 2026-11-26 light-first direction

Founder: "The current website remains too dark for the intended Signal One brand. The public website must feel like a premium, welcoming enterprise technology and communications company, rather than an exclusively security-focused operations centre. Use predominantly white, off-white and light neutral surfaces, dark readable typography, Signal One blue accents and selectively positioned graphite sections. Integrate the supplied photography package where appropriate. Do not merely invert existing colours. … Avoid dark overlays that unnecessarily reduce the brightness of photographs. Preserve the approved homepage hero photograph, animated globe, control-room photograph and corporate identity. Do not change the approved Sales OS or 1GUARD operational design direction."

Implemented 2026-11-26 (workstream THEME, branch `wip/light-theme`): the single token layer became role tokens on a light palette and a graphite scope (§1–2); the header became light glass with the light lockup; forms, cards, badges and focus moved to the light roles; scene photographs lost their luminosity toning and dark wash in favour of a light veil; the footer, the homepage 1GUARD chapter and the 1GUARD control-room chapter are the graphite places; the founder's bright image package was placed by relevance (§8). Supersedes the 2026-11-15 "one graphite stage" and the graphite parts of the 2026-11-25 consolidation. Evidence and per-route notes: `docs/launch/LIGHT_THEME.md`.
