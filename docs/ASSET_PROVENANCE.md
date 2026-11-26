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
| P30 Lite PoC | Resolved 2026-11-15: exact Hytera P30 Lite manufacturer image added; see current source register below. |
| SC780 body camera | Resolved 2026-11-15: exact Hytera SC780 manufacturer image added; see current source register below. |
| EasyTalk E600 | `public/images/hardware/easytalk-e600.png` (494×494, sha256 `37227819e549e07650c3213670563f4fae7a306cfa9ce5e3ab6f3f9e4e785160`): front view cropped from the manufacturer's "Easytalk E600 Product specification" (2024-03-01), background removed. Specifications from that sheet and the EasyTalk E600 brochure, both supplied by the founder 2026-11-26. The SOS key is marked "reserve" by the manufacturer and is not claimed; LTE band lists differ between the two documents and are not published. |

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


## 2026-11-15 — image audit implementation (current direction)

The founder requested implementation of the image audit. This supersedes earlier rules requiring a photograph under every promotional section and one photograph per process card. The approved full-scene hero, globe, logo, approved SME foreground image, pricing and motion contract remain unchanged.

- Manufacturer products lead equipment, radio and rental introductions. Home equipment features PNC360S and P30 Lite; tracking remains in the catalogue and secondary marketplace card.
- `enterprise-showroom.webp` is retired from all active marketing backgrounds. Hotel lobby/corridor are removed from general pages and the footer. These files are retained for history, not loaded into the updated compositions.
- Business-park context remains in relevant security/recruitment introductions; restaurant-dining supports 1Service; warehouse-yard supports the patrol introduction. Other marketing sections, forms, pricing and footer use quiet graphite surfaces.
- People remain framed, disclosed illustrations outside the locked hero. Repetitive/mismatched process photographs and prominent fictional security-company/device scenes have been removed or reassigned. The 1Service features use restaurant staffing/planning imagery.
- Product-proof arrays remain empty. No approved clean demo capture credentials were available during implementation; rejected historical crops and generated dashboards were not introduced. E600's manufacturer/stock identity remains unconfirmed, so its typographic tile remains.

### Newly sourced exact manufacturer images

| Model | Served file | Original | Source page | Source image | Native dimensions | Retrieved |
|---|---|---|---|---|---|---|
| Hytera P30 Lite | `public/images/hardware/hytera-p30-lite.png` | `assets/hardware/originals/hytera-p30-lite-front.png` | https://hytera.co.za/products/p30-lite | https://hytera.ae/imager/images/1827303/P30-Lite_800x800_5472332afa344033d2bf9e7b6b9d883e.png | 600 × 600 | 2026-11-15 |
| Hytera SC780 | `public/images/hardware/hytera-sc780.png` | `assets/hardware/originals/hytera-sc780-front.png` | https://hytera.co.za/products/sc780-smart-4g-body-camera | https://hytera.ae/imager/images/1653392/SC780%E6%B8%B2%E6%9F%93_%E5%85%AD%E8%A7%86%E5%9B%BE-Front-min1_2024-11-13-100123_hizp_5472332afa344033d2bf9e7b6b9d883e.png | 600 × 600 | 2026-11-15 |

Both official originals were downloaded from the assets linked by Hytera's South African product pages and visually inspected. Served PNGs are byte-for-byte copies; Next/Image performs delivery optimisation. No product details, colour, logos, proportions or accessories were altered. Usage basis remains the founder-confirmed authorised reseller status documented above; this is not a claim that separate unrestricted media rights were obtained.

Original SHA-256 values:

- `hytera-p30-lite-front.png`: `d28ce15636f8f4b20186657bdc26934d01c846f7948bfc2f640eae31e660089c`
- `hytera-sc780-front.png`: `94b1e16eeae536643b37af70e477b94baf8f69c66301b7f9a42e27ba85c5ab1b`

## 2026-11-26 — founder bright image package (light-first website)

Supplied by the founder with the light-first direction ("brighter public website, asset handoff v2"). Every file was verified against the package manifest's SHA-256 before use and copied byte-for-byte to `public/images/bright/`; Next/Image performs delivery optimisation. None is upscaled: the largest drawn size is below the native width. All are **AI-generated illustrative scenes, not actual Signal One staff, clients, facilities, inventory or software**, and are captioned or disclosed as illustrative where they appear.

| File | Native | SHA-256 | Alt text | Placed on |
|---|---|---|---|---|
| `01-restaurant-service.webp` | 1672 × 941 | `edbc5e06439248ec93a2f5ea4a5376c5583377b8ac0aabb7bb3adb7d4df57712` | Illustrative chef and server coordinating plated orders in a restaurant kitchen | `/service` hero (so "Run the day" keeps the existing approved `restaurant-staff-briefing.webp`) |
| `02-team-planning.webp` | 1672 × 941 | `50707b3833f095f39e7b726631fd731518bb0002f1f5976bc4684fa6fafe28fb` | Illustrative restaurant team reviewing staffing and daily assignments | `/service` "Manage the team" |
| `03-stock-and-margins.webp` | 1672 × 941 | `3fd79639104e498db33ea7ff235abaed426b525b993953378dbef9567bf86f57` | Illustrative kitchen team checking stock and purchasing records | `/service` "Understand the margins" |
| `04-performance-review.webp` | 1672 × 941 | `3982f49918b04b4ecba08c137f812d9f522513d47866c6ae707e5fb9c0404c82` | Illustrative restaurant managers reviewing business performance documents in daylight | `/service` "Know what to improve" |
| `05-radio-rental-workflow.webp` | 1672 × 941 | `3b4c8235a03e4002701939fe3a2c1d846119164304f61c97563cde48c1236e7d` | Illustrative team preparing communications equipment for deployment | `/ptt-radio-rental`, supporting panel beside "How the quote works", captioned "Illustrative scene · not actual rental stock" (never stock or inventory evidence) |
| `06-bright-architecture.webp` | 1774 × 887 | `4f5e3272668d64392d40890548df010fb23044494eb322bef397af4fa3fe1115` | Illustrative contemporary glass and pale concrete atrium in daylight (decorative backdrop, no alt) | Homepage business introduction backdrop, under the light veil (replaces `business-park.webp` there) |
| `07-hospitality-welcome.webp` | 1672 × 941 | `00813cc947295342c69a35cf0ea5756f33184231524226b7350fc368675a1287` | Illustrative hospitality reception professional in a sunlit lobby | Homepage "1Service staffing · Planned" card (replaces `restaurant-staff-briefing.webp` there) |
| `08-kitchen-alternative.webp` | 1672 × 941 | `7422a7f00fc8554c22ab1752d8b867e42cca1838b13a142e624c17b42b214734` | — | **Not used** (alternative to 01; never both on one page). Not copied into `public/`. |

Also placed from the existing approved editorial set (2026-10-30 package): `security-operations-review.webp` on the `/solutions/security` coverage chapter, captioned "Illustrative scene · fictional security company" (its uniforms carry fictional branding, the same open ruling as `security-site-planning`, `docs/launch/IMAGE_INVENTORY.md` #9).

Not acquired: the package guide lists Pexels source candidates (office park, restaurant, warehouse). They were not fetched (licence and dimensions unverified, not reachable from the build environment); see `docs/launch/LIGHT_THEME.md`.

Light-first treatment: photographs are no longer toned to graphite (the luminosity blend is removed) and no dark scrim is laid over them; scene backdrops sit under a light veil that clears away from the copy. The locked homepage hero and the approved SME control-room photograph are unchanged.


## Founder-approved homepage hero replacement — 2026-11-26

The founder explicitly requested the new enterprise communications scene for the homepage. The active hero is now `/images/home/approved-enterprise-communications-2026.jpg` (1672 × 941 JPEG; SHA-256 `224b5d8939787ccb3f10ec9cb33b2c1d5e1623471e8ecdea0eae1359c6f1e859`). This synthetic illustrative photograph is not evidence of actual staff, premises or customers. It replaces only the former guard-and-chef image and its descriptive alt text; the existing globe, glass, navigation, copy, responsive layout and loading priority remain unchanged. Earlier hero approvals above are historical; the previous asset is retained for rollback. The source fixture and visual tests now protect the replacement.
