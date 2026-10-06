# Signal One brand: logo definition

Source: the Signal One quotation standard. Reproduce it exactly; do not redesign.

## Mark

SVG, `viewBox="0 0 34 34"`, no fill on the group:

```svg
<circle cx="17" cy="17" r="15"  stroke="#0EA5E9" stroke-width="1"   opacity="0.35"/>
<circle cx="17" cy="17" r="9.5" stroke="#0EA5E9" stroke-width="1.4" opacity="0.7"/>
<circle cx="17" cy="17" r="4"   fill="#0EA5E9"/>
```

On dark surfaces the two ring strokes may use `#38BDF8`. The dot is always `#0EA5E9`.

## Wordmark and descriptor

| Part | Weight | Letter-spacing | Light surface | Dark surface |
|---|---|---|---|---|
| `SIGNAL` | 700, line-height 1 | 0.06em | `#0B1B2B` | `#F1F5F9` |
| `ONE` | 700, line-height 1 | 0.06em | `#0EA5E9` | `#38BDF8` |
| `INTEGRATED SYSTEMS` | 600, about 0.4× wordmark size, **never below 10px (11px in the footer)** | 0.42em | `#5A7184` | `#94A3B8` |

**Minimum descriptor size overrides the 0.4× ratio:** 10px in the header and 11px in the footer, so the lockup grows slightly (the descriptor is then wider than the wordmark). Letter-spacing stays 0.42em. The static SVGs use 10px.

The descriptor sits 4–5px below the wordmark (0.25× the wordmark size in `SignalOneLogo`).

## Lockup

Mark left, wordmark and descriptor right, 12px gap, vertically centred. `SignalOneLogo` takes the wordmark size in px and sets the mark to 1.6× that, so the mark matches the height of the two-line text block (header: 22px wordmark, 35px mark, 10px descriptor; footer: 24px wordmark, 38px mark, 11px descriptor).

## Pulse

The rings radiate outward from the dot:

```css
@keyframes signal-pulse { 0% { transform: scale(0.9); opacity: 0.8 } 70% { transform: scale(1.5); opacity: 0 } 100% { opacity: 0 } }
.s1-pulse::after { content: ""; position: absolute; inset: 0; border: 1px solid #0EA5E9; border-radius: 9999px; animation: signal-pulse 2.8s ease-out infinite; }
```

**Rule:** the pulse is used on the header mark only. Footer, favicon, app icons, OG image, documents and the static SVGs are always still. Under `prefers-reduced-motion: reduce` the animation is off.

## Clear space and minimum size

- Clear space on every side = half the ring diameter (outer ring 30 units of 34, so about 0.44 × the mark size).
- Minimum size: mark 20px; full lockup 120px wide.

## Light and dark

Use `tone="light"` on white, sand and paper surfaces and `tone="dark"` on ink, night and photographic surfaces. Never place the light lockup on a dark surface or the reverse.

## Never alter the mark

No new shapes, no filled square, no rotation, no outlines, no gradients, no recolouring beyond the light/dark pair above, no change to ring radii, stroke widths or opacities, and no animation other than the header pulse.

## Files

| File | Purpose |
|---|---|
| `app/components/brand/SignalOneMark.tsx` | Mark. Props: `size`, `tone`, `pulse`. |
| `app/components/brand/SignalOneLogo.tsx` | Lockup. Props: `size`, `tone`, `pulse`. |
| `public/brand/signal-one-mark.svg` | Static mark. |
| `public/brand/signal-one-logo-light.svg`, `signal-one-logo-dark.svg` | Static lockups. Text is live SVG text using Archivo, then Inter, then a system sans; outline it before sending to print. |
| `app/favicon.ico` (16/32/48), `app/icon.png` (512), `app/apple-icon.png` (180) | The dark-tone static mark on `#0B1118`. The Apple icon is a full-bleed square (iOS applies its own rounding). |
| `public/og-image.jpg` | 1200×630, dark lockup. |

The retired square "bar" icon is not part of the brand. `public/logo.svg` from git history is an old "Signal One Communications" logo and must not be used.
