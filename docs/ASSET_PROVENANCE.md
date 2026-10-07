# Asset provenance

Every hardware image on the site is listed here (brief §14, addendum A5). Only first-party manufacturer media is used. Retailer images and search-engine finds are not used. Manufacturer logos and devices are shown unaltered: images are only trimmed of transparent margin, resized down and re-encoded.

**Usage basis for all rows:** authorised dealer, founder-confirmed (2026-10-07: "Signal One is an authorised/registered dealer/reseller of the products it presents"). No separate manufacturer media-kit licence terms were found or reviewed from this environment. If either manufacturer publishes media terms that conflict, those terms win and the image comes down.

| Product | Manufacturer | File | Source URL | Retrieved |
| --- | --- | --- | --- | --- |
| PNC360S Mini PoC Radio | Hytera Communications | `public/images/hardware/hytera-pnc360s.webp` | https://www.hytera.com/iwov-resources/hytera/02_products/2_main_image/en_main_pnc360s_poc_radio.png (product page https://www.hytera.com/en/product-new/lte-broadband/poc-radio/pnc360s.html) | 2026-10-07 |
| FMB920 vehicle tracker | Teltonika Telematics | `public/images/hardware/teltonika-fmb920.webp` | https://wiki.teltonika-gps.com/images/1/1e/FMB920-side-2024-01-11.png (official wiki page https://wiki.teltonika-gps.com/view/FMB920) | 2026-10-07 |
| FMC920 vehicle tracker | Teltonika Telematics | `public/images/hardware/teltonika-fmc920.webp` | https://wiki.teltonika-gps.com/images/e/eb/FMC920_QJIBO-side-2024-01-11.png (official wiki page https://wiki.teltonika-gps.com/view/FMC920) | 2026-10-07 |

Originals are kept unmodified in `assets/hardware/originals/`. They are not served.

## Shown as typographic cards (no image), and why

| Product | Reason |
| --- | --- |
| P30 Lite PoC | hytera.com (en and eu) lists the **P30**, not the P30 Lite. Showing the P30 under the P30 Lite name would show a different device under our label. Needs the P30 Lite page or media kit (hytera.co.za or the Hytera dealer portal). |
| SC780 body camera | Not listed on hytera.com/en or /eu, which show SC580, SC700 and SC880. Needs the SC780 product page or media kit. |
| E600 PoC LTE | No supplier documentation in any repository or doc confirms the manufacturer or exact branding. No image is used until the supplier documentation confirms it. |

## Domains unreachable from the build environment

- hytera.co.za, hytera.ae, hytera-europe.com, store.hytera.com: connection refused by the egress policy.
- img-cdn.hytera.com: refused. The same files are served from www.hytera.com, which was used instead.
- www.teltonika-gps.com: refused. The official wiki at wiki.teltonika-gps.com was used instead.

## Photography

The documentary photographs under `public/images/photo/` and `public/images/story/` are illustrative scenes of fictional security companies. They are captioned as such on the site and listed in `docs/PHOTOGRAPHY_BRIEF.md`. None of them is a Signal One product image.
