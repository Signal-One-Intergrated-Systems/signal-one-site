# Signal One website design system

**Source of truth: the Signal One standard**, `docs/architecture/SIGNAL_ONE_QUOTATION_STANDARD.html` in `lancesatsuppliers-ux/lancesat-enterprise-platform` ("Signal One Integrated Systems: Global Stylesheet"). The website uses that system. It departs from it only where listed under "Approved website departures". The tokens below are as implemented in `app/globals.css` (Tailwind v4 `@theme`); shared primitives are in `app/components/ui.tsx` and the logo in `app/components/brand/` (see `docs/BRAND.md`).

The standard repo was not readable from the session that did this reconciliation, so the token values came from the founder's brief, which copies them from the standard. If a value there differs from the stylesheet, the stylesheet wins and this file should be corrected.

## Tokens as implemented

### Signal blue

| Token | Hex | Use |
|---|---|---|
| `signal` | #0EA5E9 | Brand accent: primary button fill, dot of the mark, kickers and links on dark (via `signal-400`), status accents |
| `signal-600` | #0284C7 | Hover or pressed fills, focus ring on light surfaces, large numerals on light surfaces (R2, calculator, steps) |
| `signal-400` | #38BDF8 | Accent text on dark surfaces, primary button hover |
| `signal-300` | #7DD3FC | Faint accent, text selection |
| `signal-ink` | #0270A8 | Accent text and links on light surfaces (see "Where the standard and accessibility conflict") |
| `signal-tint` | #E6F4FB | Tint behind accent pills and callouts |
| `on-signal` | #0B1118 | Text on `signal` fills |

### Surfaces

| Token | Hex | Use |
|---|---|---|
| `base` | #151A21 | Dark sections, header |
| `deep` | #0F131A | Heroes, deepest dark sections |
| `raised` / `raised-2` | #1C222B / #232B36 | Cards and panels on dark, photo placeholder |
| `abyss` | #0A0D12 | Product and phone frames |
| `line-dark` | #2A3340 | Rules and borders on dark |
| `light` / `light-2` | #F5F7FA / #E9EEF4 | Light sections (cool neutral) |
| `white` | #FFFFFF | Cards and form fields |
| `line` | #D5DDE6 | Rules and borders on light |
| `line-strong` | #7C8DA0 | Input and button borders on light (3:1 against white) |

### Text

| Token | Hex | Use |
|---|---|---|
| `text` / `text-2` | #0B1B2B / #33475B | Headings and body on light |
| `text-inv` | #F1F5F9 | Headings on dark |
| `text-inv-2` | #CBD5E1 | Body on dark |
| `text-inv-3` | #94A3B8 | Muted and captions on dark |

All text colours are solid. No copy uses opacity to get its grey.

Status colours (`live`, `beta`, `soon`, `danger`, each with a tint and an inverse for dark) are unchanged and used only on product-status pills and form errors.

### Typography

Inter only, as in the standard.

| Role | Class | Notes |
|---|---|---|
| Display and headings | `font-display`, `.t-display` `.t-h1` `.t-h2` `.t-h3` | Inter 700, tracking about -0.03em. `font-display` is an alias for Inter |
| Body | `.t-body` (17px), `.t-lead` (19 to 21px) | |
| Small | `.t-small` (15px), `.t-caption` (14px, the floor) | |
| Kicker | `.t-kicker` | Inter 650, sentence case |
| Numerals | `.t-num` | Inter 800, tabular and lining figures. R2 figure, steps, calculator |

Rules: nothing important under 14px (the lockup descriptor is the one exception, 10px header and 11px footer, see `docs/BRAND.md`); measures are `.measure` (62ch) and `.measure-tight` (46ch).

### Components

- **Buttons** (`.btn`): 48px minimum (`.btn-lg` 56px). `.btn-primary` is `signal` with `on-signal` text, hover `signal-400`, no glow and no lift. `.btn-ghost-light` and `.btn-ghost-dark` for secondary actions.
- **Forms**: 15px semibold labels, inputs at least 52px high with 17px text, `line-strong` borders, `signal-600` focus border plus a 3px ring. Errors in `danger`.
- **Cards**: `.card` (light) and `.card-dark` (`raised`), 14px radius, 1px border, no shadow.
- **Focus**: 3px `signal-600` outline with 3px offset on every focusable element.
- **Product frames**: `ProductWindow` (browser frame from md up, phone frame below) on `abyss`.
- **Layout**: `.wrap` 1320px max (1440px from 1600px, set by `--wrap-max`/`--wrap-pad`); `.section` 80, 96 (md) and 112px (xl) vertical padding. Desktop type steps up at 1600px by a measured amount (`.t-hero` at most 4.5rem, `.t-h2` 3.5rem, `.t-lead` 1.375rem). Wide screens get a wider container, not taller sections. No raster image renders above its source resolution (QA: `tests/e2e/image-scale.spec.ts`). Worlds (buyer, guard, careers) are distinguished by layout, type scale, photography and tone, not by accent colours.

### Glass

Precision glass: a slightly translucent optical surface over **real content** (photography, product screens, the page under the sticky navigation). Never whole pages of translucent cards, never over flat colour where it adds nothing.

- **Utilities**: `.glass` (dark), `.glass-light` (light), `.glass-nav` (sticky navigation). Defined in `app/globals.css`.
- **Where**: the sticky navigation; the home hero information panel; status overlays on photo bands; hardware cards; selective screenshot framing; floating contextual controls.
- **Desktop (768px+)**: `blur(16–18px) saturate(140–150%)`, dark surface at 72% (nav 84%), white at 78%, 1px hairline border, 1px inner top highlight, one soft shadow. No coloured glow.
- **Mobile (<768px)**: only the navigation blurs (8px, 94% opacity). Every other glass surface renders solid (95–96% opacity, no backdrop filter), so blurred layers never stack and low-end Android scrolls smoothly.
- **Fallbacks**: without `backdrop-filter` support, and under `prefers-reduced-transparency`, every glass surface is solid. Opacities are high enough that a surface stays readable even if the blur is dropped. Both must still look finished.
- **Text on glass** keeps the same contrast rules as text on the matching solid surface.

### Motion

- The **signal-pulse** on the header logo mark is part of the brand: a ring radiating from the dot, 2.8s ease-out, infinite, header mark only. It is off under `prefers-reduced-motion`.
- Everything else is minimal: `.animate-enter` (320ms fade and 6px rise) on tabs and steps, and colour transitions on buttons and inputs.
- `prefers-reduced-motion` turns all motion off, including smooth scrolling.

## Approved website departures

The website departs from the Signal One standard in these ways only:

- (a) **Restrained glass is allowed; glassmorphism is not.** No glow shadows, no background grids, no neon. See "Glass" below. (Founder direction, 2026-10-07, `docs/FOUNDER_BRIEF_2026-10-07.md` §3. This replaces the earlier "no glassmorphism" rule; do not strip glass out again without a new founder decision.)
- (b) No mono or ALL-CAPS labels, except the SIGNAL ONE / INTEGRATED SYSTEMS lockup.
- (c) Light sections alternate with dark ones.
- (d) Minimum text sizes and accessibility rules stay as set out here.

## Where the standard and accessibility conflict

Resolved in favour of accessibility, with the smallest possible change:

| Standard | Problem | Resolution |
|---|---|---|
| Accent text `#0EA5E9` / link `#0284C7` on light | 2.6 to 2.8:1 and 3.8 to 4.1:1, below the 4.5:1 AA minimum for text | Accent text on light uses `signal-ink` #0270A8 (at least 4.6:1 on every light surface). `signal-600` #0284C7 is used only for large numerals (3:1 is enough) |
| Focus ring `#0EA5E9` | 2.6:1 against light surfaces, below the 3:1 non-text minimum | Ring is `signal-600` (3.8:1) on light surfaces |
| `#0B1118` text on `#0EA5E9` described as at least 7:1 | Measures 6.84:1 | Kept as specified (it passes AA, and the standard's own colours); not forced to 7:1 |
| Wordmark `ONE` `#0EA5E9` on light | 2.6:1 | Kept: logotypes are exempt from the text-contrast rules, and the lockup must not be altered |

`docs/CONTRAST.md` lists every text and background pair in use with its measured ratio.
