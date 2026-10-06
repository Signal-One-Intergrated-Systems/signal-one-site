# Signal One design system

The direction is **industrial technology, editorial design and human operations**. The site should feel premium because of its typography, composition, real product, photography, hierarchy and restraint. It must still look right with every shadow switched off.

The source of truth is `app/globals.css`, using Tailwind v4 `@theme` tokens and `@layer components`. Shared primitives live in `app/components/ui.tsx`.

## Typography

| Role | Face | Token / class | Size |
|---|---|---|---|
| Display / headings | Archivo, variable `wdth` at 88–94% | `font-display`, `.t-display` `.t-h1` `.t-h2` `.t-h3` | 40→80px · 36→64 · 30→50 · 20→24 |
| Body | Inter | `font-sans`, `.t-body` (17px / 1.65), `.t-lead` (19→21px) | |
| Small | Inter | `.t-small` (15px), `.t-caption` (14px, the floor for anything that matters) | |
| Kicker | Inter, semibold, sentence case | `.t-kicker` (15px) | Replaces the 11px mono uppercase eyebrows |
| Numbers | Archivo 800, tabular | `.t-num` | Used for the R2 price, step numbers and calculator output |
| Careers display | Fraunces (loaded only on `/join/sales`) | `font-serif` | |

Rules:
- Nothing important goes below 14px, and nothing goes below 14px at all.
- No mono text and no ALL CAPS, except the `SIGNAL ONE` wordmark.
- Body text is solid colour. There is no 30–60% opacity copy.
- Measures are `.measure` (62ch) and `.measure-tight` (46ch).

## Colour and surfaces

| Token | Hex | Use |
|---|---|---|
| `ink` | #0D1015 | Dark sections, header, footer |
| `graphite` / `graphite-2` | #161B22 / #1F252E | Alternate dark surface |
| `paper` / `paper-2` | #F6F4F0 / #ECE8E1 | Light sections (warm off-white) |
| `white` | #FFFFFF | Cards and form fields |
| `text` / `text-2` | #14181E / #4A515B | Text on light surfaces. `text-2` has ≥7:1 contrast on paper |
| `text-inv` / `text-inv-2` | #F3F4F6 / #B4BBC5 | Text on dark surfaces. `text-inv-2` has ≥9:1 contrast on ink |
| `signal` / `signal-hover` | #0369A1 / #075985 | **Accent only**: primary buttons, kickers, the R2 figure |
| `signal-bright` | #5CC6F5 | Accent on dark, and the focus ring |
| `line` / `line-dark` | #D6D0C5 / #2E3540 | Rules and borders |
| status | live / beta / soon | Product status labels, each with a tint and an `-inv` variant for dark |

Each world has its own accent:

| World | Surfaces | Accent | Character |
|---|---|---|---|
| Buyer | ink and paper alternate | `signal` | Editorial, industrial |
| Guard (`/guards*`) | `sand` (#FAF8F3) and white | `field` (#0F5A46) | Larger type, mobile-first, warm |
| Careers (`/join/sales`) | paper and `night` | `brass` (#85570F) | Fraunces serif display |

## Spacing and grid

- `.wrap` is a 1320px max container with gutters of 16px (mobile), 24px (≥640) and 40px (≥1024).
- `.section` has vertical padding of 64px, 96px (≥768) or 112px (≥1280).
- Grids are asymmetric (4/8, 5/7 and 7/5) rather than equal columns everywhere.
- Some sections are just text, an image and space. Not every section sits in a rounded rectangle.

## Components

**Buttons**
- `.btn` sets a 48px minimum height (`.btn-lg` is 56px), a 10px radius and 16px semibold text.
- Variants are `primary` (signal), `ghost-light`, `ghost-dark`, `field` and `brass`.
- Feedback is a colour change plus a 1px press. There is no glow and no lift.

**Forms**
- Labels are 15px semibold sentence case (`.field-label`).
- Inputs are at least 52px high with 17px text, which avoids iOS zoom.
- Focus shows as a signal border plus a 3px ring.
- Hints are 14px. Errors are 15px in `danger`.
- Choices use `.choice`, a tile with a native checkbox or radio inside.

**Cards**
- `.card` and `.card-dark` are for discrete items only (a form, a calculator, a product).
- Cards have a 14px radius and a 1px border, with no shadow.

**Status**
- `<Status kind="live|beta|mvp|soon|quote">` is a pill in 14px semibold.
- Use it only where it changes what a buyer expects.

**Steps**
- `<Steps>` is an ordered list with rules and big tabular numerals.

## Photography

- `<Photo>` wraps `next/image` with a blur placeholder and an honest caption.
- Every current photo is an **AI-generated environment** of a fictional guarding company. It is captioned "Illustrative scene · fictional security company" and is never used to depict the product.
- No overlay gradients except where text sits on the image (only the hero, and it doesn't use one).
- Never render a photo wider than its source. The hero is capped at 1916px, and the `public/images/story/*` images (960px) at about 480px.
- The hero has a separate mobile crop (`business-park-gate-mobile.webp`), delivered through `<picture>` / `getImageProps`.

## Screenshots

- `<ProductWindow>` is a dark frame with a bar reading "Signal One Guard · {screen}" and "Synthetic demo data".
- Images render at their **intrinsic aspect ratio**, never `object-cover`.
- `<ProofImage>` art-directs: below 768px it shows a mobile crop of the same screen, and above that the wide crop.
- Crops live in `public/images/product-proof/crops/` and exclude navigation chrome.

## Motion

- The only motion is a product-tab and step transition (`.animate-enter`, 320ms fade plus 6px rise) and colour transitions on buttons and inputs.
- There is no parallax, scroll-jacking, floating, pulsing or springs.
- `prefers-reduced-motion` turns all of it off, including smooth scrolling.
- framer-motion is no longer imported anywhere. It stays in `package.json` only until the lockfile can be regenerated.

## Accessibility baseline

- Targets are at least 44px.
- A visible 3px focus ring.
- A skip link.
- A labelled field for every input.
- Results announced with `aria-live`.
- Tabs follow the WAI-ARIA pattern with arrow, Home and End keys.
- Decorative images use `alt=""`.
