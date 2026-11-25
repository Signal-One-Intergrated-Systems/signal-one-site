# Launch-audit tools

Plain Playwright scripts used for the 2026-11-25 baseline. Run from a scratch directory (they write `shots/` and `sweep.json` to the current directory), with `axe-core` resolvable (`npm i axe-core`) for `sweep.js`.

| Script | Use |
|---|---|
| `visit.js URL W H NAME` | One page: viewport + full-page capture, headings, links, images, errors as JSON. |
| `walk.js URL W H NAME [scale]` | Scroll-walk one page a viewport at a time (what a visitor sees; triggers reveal-on-scroll). |
| `sweep.js` | Every route in `routes-sitemap.txt` (+ probes) at 8 widths: overflow, broken images, errors, small targets, axe WCAG 2.2 A/AA at 1440 and 390. Writes `sweep.json`. |
| `perf.js` | Lab LCP/CLS/FCP on a throttled Moto G4 profile. |
| `kbd.js` | Tab order and focus rings, mobile menu, 200 % text. |
| `slice.py IMG OUT CHUNK SCALE` | Cut a full-page capture into reviewable slices. |

Never submit live production forms with these tools.
