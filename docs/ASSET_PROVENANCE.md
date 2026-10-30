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


## Homepage original illustrative photography — 2026-10-29

The homepage now uses two original commissioned-for-this-design AI-generated illustrative scenes, not external customer photos and not software screenshots. Both were exported and checked as independent JPEG assets with aspect ratios preserved. Do not imply that the fictional people are Signal One employees or customers.

| Asset | Intended use | Provenance | Public disclosure |
| --- | --- | --- | --- |
| `public/images/home/signal-one-hero-daylight.jpg` | Homepage hero behind the existing glass globe | Original synthetic scene generated 2026-10-29 for Signal One: professional security team at a bright corporate entrance; no third-party logo or product UI | `Illustrative scene` |
| `public/images/home/service-restaurant-operations.jpg` | 1Service homepage feature and introductory /service page | Original synthetic scene generated 2026-10-29 for Signal One: professional kitchen team coordinating restaurant service; no third-party logo or product UI | `Illustrative restaurant operation` |

The homepage 1GUARD proof section uses the existing documented `control-room-team.webp` fictional scene. The equipment section uses the genuine, unaltered Hytera PNC360S and Teltonika FMB920 manufacturer assets documented above; these must not be replaced with AI-generated substitutes.

## Founder-approved hospitality + security hero — 2026-10-30

`public/images/home/approved-security-chef-daylight-2026.png` is the standalone photographic crop from the approved synthetic homepage concept. The image depicts a fictional light-brown-skinned Black woman security officer wearing a white shirt, black vest marked SECURITY and radio, collaborating with a white male chef in white uniform and chef hat outside a restaurant in clear daylight. It is not a customer testimonial, documentary photograph, or claim that either person works for Signal One. On-page caption remains `Illustrative scene`.

The production crop excludes generated browser chrome, navigation, hero copy, globe and CTA mockups: these must be rendered by the actual React components. Cropping is deliberately restricted to the people-led right-hand photograph. The image is stored locally in the repository, not hotlinked from an expiring creative-tool URL.


## Approved full-width restaurant entrance scene — 2026-10-30 (supersedes cropped hero)

The homepage primary hero now uses `public/images/home/approved-full-scene-guard-chef-2026.png` exactly as approved. SHA-256: `4d3aca7b4da412b9b37963950a7848bdca03a98d217e10401ea8bdbc6caedbd4`, 1672 × 941 PNG. This is a **synthetic illustrative photograph**, not evidence of real people employed by the business. It depicts a Black woman officer in a white shirt and black SECURITY vest, and a white chef in a toque beside a real-looking restaurant terrace.

The original approved composition deliberately reserves the left half for greenery, outdoor architecture, the animated globe and glass text. People appear farther back on the right; the whole photograph must run behind the globe at desktop widths using `object-fit: contain`, with no vignette masking or CSS zoom. Maintain the on-page "Illustrative scene" caption. No changes to other sections or product equipment images are part of this approval.


## SME security operations scene — 2026-10-30
`public/images/home/sme-security-control-room.png` is an **illustrative AI-generated scene** of a small, modern security company's monitoring office. It deliberately uses a realistic South African SME scale: three working desks, a supervisor, modest wall-mounted CCTV screens and normal business equipment. It is not an actual customer premises, authenticated product screen, or live customer proof. The on-page caption must continue to disclose its illustrative nature.

Use this photograph only in the 1GUARD homepage feature section. Do not substitute an enormous international command centre or crop in so tightly that the room appears unusually large. The founder-approved homepage hero photograph, parent logo, animated globe and the real manufacturer equipment images stay unchanged.


## Founder-approved SME security control room — 2026-10-30 replacement

The homepage 1GUARD story uses `public/images/home/approved-sme-security-control-room-2026.png` at its original 1672 × 941 dimensions (SHA-256 `b8efd081d1404ff36c1c5bc1b39d229e6598bb2cc94efe01459b9abaf9467852`). This is the exact founder-approved illustrative control-room image: three operator stations, one standing Black male supervisor and realistic CCTV equipment. The view contains no mountain landmark. It is **synthetic illustrative photography**, not a real customer site, a real dashboard screenshot or proof of commercial product functionality. Keep the visual disclosure.

The approved wide restaurant homepage hero and real manufacturer product photos are untouched.

## Scroll-entry pattern

The homepage uses `HomeScrollChoreography.tsx` with `data-motion-from` on the individual text, photography and product panels. The first content section moves from left and right, 1GUARD from top and left, and subsequent sections use a restrained rotating arrangement of left, right, top and bottom. Only transform and opacity animate; direction assignment is deliberate, not nondeterministic. Content stays visible when JS is unavailable, reduced motion is requested or IntersectionObserver is unavailable. The route transition and existing globe have separate animation systems and are not overwritten.


## Homepage contextual editorial panels — 2026-10-30

Nine compact, original **synthetic illustrative photographs** support otherwise text-only sections of the Signal One homepage. They are not documentary evidence of actual customer premises, clients or employed staff, nor are they screenshots of live software. They must remain labelled as illustrative.

| Local image | Intended meaning |
|---|---|
| `public/images/home/panels/customer-enquiry.webp` | Customer enquiry and choosing a business solution |
| `public/images/home/panels/win-work.webp` | Winning and organising an SME service contract |
| `public/images/home/panels/prove-work.webp` | Guard checking a patrol checkpoint / proof of service |
| `public/images/home/panels/manage-grow.webp` | Owner reviewing commercial performance |
| `public/images/home/panels/hire-security.webp` | Hiring an eligible security officer |
| `public/images/home/panels/hire-hospitality.webp` | Hiring restaurant / service workers |
| `public/images/home/panels/onboarding-sme.webp` | Gathering an SME's implementation requirements |
| `public/images/home/panels/team-dispatch.webp` | Planning and assigning a team |
| `public/images/home/panels/invoice-confirm.webp` | Invoice and service-start confirmation |

The product-equipment panel continues using the genuine Hytera manufacturer photograph, not a generated device. All new image assets are locally stored, WebP compressed and responsive; the original hero, 1GUARD control room and parent brand mark are unchanged.

Entrance motion slows to about 1.65 seconds for transforms and 1.35 seconds for fades on desktop; mobile runs at about 1.32 seconds. Motion remains opt-in, one-shot, with preserved reduced-motion, fallback and stable layout.


## 2026-10-30 — founder-approved field and hospitality photography, scene-first backgrounds

All **12 newly approved illustrative people photographs** were transferred from their source image files, validated, stripped of metadata and converted to responsive WebP in `public/images/editorial/`:

- `security-site-planning.webp` — security supervisors discuss site layouts
- `hotel-reception-welcome.webp` — front desk, porter and housekeeping workers serve hotel guests
- `hospitality-team-briefing.webp` — chef, waiter, housekeeper, guard and manager coordinate service
- `security-office-park-site-review.webp` — security lead and client inspect an office park
- `warehouse-security-check.webp` — security staff verify a logistics facility
- `security-access-scan.webp` — field officer and supervisor validate an access point
- `security-operations-review.webp` — SME security managers review commercial and operational records
- `security-interview-training.webp` — security recruitment and training discussion
- `restaurant-staff-briefing.webp` — chef, waiters and service team prepare a restaurant
- `cafe-team-planning.webp` — cafe manager, chef and staff plan shift operations
- `security-team-briefing.webp` — working security officers plan assignments
- `facility-reception-service.webp` — facilities workers welcome a visitor at reception

They are **synthetic illustrations, not images of actual customers or employees**. They represent distinct security, restaurant, hotel, facilities and logistics teams and their roles; no Table Mountain imagery was requested or used.

Homepage: 17 contextual panel photographs each have a different source; all 12 approved illustrations appear exactly once among the cards. Every formerly flat-navy promotional chapter gets its own real-world photo backdrop, with neutral smoked glass and accessible text on top. The approved restaurant hero, its glass globe, brand identity, and 1GUARD SME control room remain unchanged. Site marketing routes use scene-matched photography rather than flat blue; legal and privacy pages retain a document-first reading treatment. The corporate blue remains an accent and is not removed from interactive controls or the signature typographic '1'. Genuine manufacturer product images are not regenerated.


## 2026-10-30 — Approved final layering contract

**Explicit exception: the founder-approved homepage hero is LOCKED and never changes unless the founder directly instructs otherwise.** The hero uses the full-width, unaltered guard-and-chef scene `/images/home/approved-full-scene-guard-chef-2026.png`, exactly as approved on desktop, tablet and mobile, with its original globe, scene framing, copy and transparent glass panel. It must never be moved into a small glass picture frame. The lock is verified by an exact source fixture (`tests/fixtures/locked-home-hero.txt`) and browser geometry assertions. The person-free-background rule applies to **all other sections**; it does not override this hero.

Eight newly generated, visually inspected, people-free architectural photographs are installed as local responsive WebP assets in `public/images/backgrounds/`: `restaurant-courtyard`, `business-park`, `small-control-room`, `restaurant-dining`, `hotel-lobby`, `warehouse-yard`, `enterprise-showroom`, and `hotel-corridor`. All are illustrative environments, not actual customer locations.

The original approved guard-and-chef hero remains unaltered at `public/images/home/approved-full-scene-guard-chef-2026.png` and is the FULL-BLEED hero background, not a smaller image panel. It has been restored byte-for-byte from production commit `4ed7047` (prior to PR84). The SME control-room personnel remain inside the 1GUARD framed picture. Role-specific staff photos from `public/images/editorial/` and `public/images/home/panels/` remain foreground illustrations and are never to be assigned in CSS `background-image`. Product manufacturer photos stay separate.

Site marketing sections, trials, pricing, service, security and recruiting all draw their environment from the eight approved empty scenes. Legal content remains reading-focused. Smoke-glass, Signal Blue branding and the established slow, alternating, accessible scroll choreography are retained. Browser tests enforce background URLs, image enclosure, file availability, mobile overflow and existing conversion links.

When authoring a new panel: use an appropriate image of real-looking people **inside** a bordered glass media component alongside its text (except the permanently locked hero). When authoring an environment: use one of the eight photo backgrounds or a newly commissioned empty architectural photo. Never place human photography on a full-bleed section background **except the separately founder-locked homepage hero**.
