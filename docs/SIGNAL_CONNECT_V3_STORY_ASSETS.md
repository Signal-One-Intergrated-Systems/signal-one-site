# Signal Connect V3 — Execution 03A Asset Register & Editorial Freeze

**Freeze date:** 23 October 2026
**Phase:** 03A · **Public story approval: BLOCKED**
**Authority:** `docs/SIGNAL_CONNECT_V3_EXPERIENCE_ARCHITECTURE.md`, `docs/SIGNAL_CONNECT_V3_SURGICAL_EXECUTION_PLAN.md`, `docs/PHOTOGRAPHY_BRIEF.md`, `docs/ASSET_PROVENANCE.md`, `docs/FOUNDER_BRIEF_2026-10-07.md`.
**Story copy source:** `signal-connect/lib/story.ts`.
**Current status (23 October 2026):** Execution 03B is implemented. Following owner approval of the photography direction, illustrative scene imagery was integrated into a **separate staging review** with explicit fictional/manufacturer-source labels. See `docs/SIGNAL_CONNECT_V3_PHOTOGRAPHY_REVIEW_EVIDENCE.md`. This does not approve real-world provenance, third-party usage rights or public story release.

## 1. Primary finding — image origin and actual product proof

The site's people photographs are **AI-generated illustrative scenes of fictional security companies**, not documentary photographs of actual operations. This is explicitly stated in the repository's `docs/PHOTOGRAPHY_BRIEF.md` and `docs/ASSET_PROVENANCE.md`. They feature fictitious company wordmarks. In particular they must NOT be labelled "actual Signal One employees", "our guards", "real client", "live operations", or "client proof". These pictures are placed only in `signal-connect/assets/story/reference/`, outside Next.js's `public/`, so they cannot accidentally appear as public chapter evidence.

The site has also **withdrawn all older Signal One Guard product-proof screenshot crops**: `app/lib/productProof.ts` explicitly sets `shots: []` after audit found demo data labels, US date formats, raw codes and test-domain artifacts. No valid RUN/PROVE screenshot is available for reuse. Never reintroduce retired cropped screenshots from git history or fabricate dashboard art.

Real device artwork is available for Hytera PNC360S and Teltonika FMC920. Both copies are byte-identical to the manufacturer's imagery used by the existing site, and are provisionally staged under `signal-connect/public/media/hardware/`. `docs/ASSET_PROVENANCE.md` states the dealer's asserted authorization but **no separate manufacturer image license terms were reviewed**; product visuals remain conditional on approved usage rights and no changes to actual model/logo.

## 2. Five chapter media candidates — binary verified

All listed image sizes and dimensions are from the committed WebP binaries (RIFF header). Every staged item is **byte-for-byte reused from an existing repo Git blob**; no resize, upscaling, generative editing, alpha flattening or new compression has been applied.

| Chapter | Staged file under `signal-connect/` | Native px | Bytes | Upstream file | Provenance | Verdict |
|---|---|---:|---:|---|---|---|
| **WIN** | `assets/story/reference/win-illustrative.webp` | 1672 × 731 | 118,530 | `public/images/photo/team-briefing.webp` | AI-generated fictional guarding-company team/equipment briefing, not a founder-to-prospect sales meeting | **BLOCKED** — wrong activity; acquire authentic sales discussion |
| **HIRE** | `assets/story/reference/hire-illustrative.webp` | 1448 × 1086 | 115,730 | `public/images/photo/warehouse-security.webp` | AI-generated fictional security logistics checkpoint, not recruitment or onboarding | **BLOCKED** — wrong activity; acquire real supervisor/people onboarding |
| **RUN** | `assets/story/reference/run-illustrative.webp` | 960 × 540 | 31,486 | `public/images/story/checkpoint.webp` | AI-generated fictional checkpoint scan; correct action but insufficient for premium wide hero | **BLOCKED** — source too small, no verified Guard capture |
| **EQUIP** | `public/media/hardware/hytera-pnc360s.webp` | 539 × 1043 | 44,962 | `public/images/hardware/hytera-pnc360s.webp` | Official Hytera manufacturer radio image, copied identically | **CONDITIONAL** — manufacturer media-use approval; do not scale above native |
| **PROVE** | `assets/story/reference/prove-illustrative.webp` | 1170 × 751 | 90,446 | `public/images/photo/control-room-team.webp` | AI-generated fictional control room, with imagined screens, not a genuine Guard proof-of-service report | **BLOCKED** — need safe genuine proof screenshot and/or commissioned review scene |

**EQUIP secondary hardware:** `public/media/hardware/teltonika-fmc920.webp` 1359 × 667, 62,134 bytes, byte-identical to `public/images/hardware/teltonika-fmc920.webp`; official manufacturer source. This is a separate device option, **not** a forced second inset card or an alleged live integrated tracking feature.

**Manufacturer primary sources:**
- Hytera PNC360S: https://www.hytera.com/en/product-new/lte-broadband/poc-radio/pnc360s.html and https://www.hytera.com/iwov-resources/hytera/02_products/2_main_image/en_main_pnc360s_poc_radio.png
- Teltonika FMC920: https://wiki.teltonika-gps.com/view/FMC920 and https://wiki.teltonika-gps.com/images/e/eb/FMC920_QJIBO-side-2024-01-11.png

These manufacturer sites substantiate *device features*, not Signal One platform integration or image-usage rights. Hytera confirms PNC360S PoC, LTE/Wi-Fi and position-related manufacturer capabilities; Teltonika describes FMC920 as a 4G Cat 1 vehicle GNSS tracker. **Neither verifies a released Signal One PTT/tracking integration.**

## 3. Frozen editorial copy — supported by typed source

### 01 WIN
**Headline:** From first contact to opportunity.

**Body:** Signal One's sales workspace is being developed to bring enquiries, quotations and follow-ups into a clearer commercial journey.

**Product disclosure:** Sales workspace in development; not presented as a customer-live product.

**Replacement photography:** Real meeting between a Signal One representative and security-company owner/director in a plausible Johannesburg/Pretoria business setting. Clearly visible human exchange; no staged heroic pose. Any laptop display shows a **verified** synthetic Sales OS capture or is angled away. Include an approved release for people/location.

### 02 HIRE
**Headline:** Put the right people behind the promise.

**Body:** Hiring and workforce readiness should connect to the work that needs to be delivered. Guard Marketplace is part of that vision.

**Product disclosure:** Guard Marketplace is in development, not a live recruitment or booking service.

**Replacement photography:** South African guard supervisor onboarding or briefing a mixed-gender team before shift; real location and releases. Illustrate people readiness, not a falsely live matching marketplace. Avoid tactical/armed-response tropes.

### 03 RUN
**Headline:** Make field operations visible.

**Body:** Signal One Guard is being built around shifts, checkpoint scans, incident capture and control-room oversight, creating an operational trail.

**Product disclosure:** Guard is in demo/staging and must not be described as generally launched.

**Replacement photography:** Real uniformed officer using an NFC/QR checkpoint at a logistics gate, estate or office park, device screen facing away. Photo at least 2560px longest edge for masters; a deliberate mobile 4:5 crop. If a second product visual is used, source it from an approved staged **synthetic tenant screenshot**, never fake UI.

### 04 EQUIP
**Headline:** Equip people for the work.

**Body:** Professional push-to-talk radios and vehicle trackers support connected field operations. Hardware supply and future software integrations are separate offerings.

**Product disclosure:** Shown: genuine manufacturer device imagery. Do not imply integrated PTT or tracking is live.

**Visual:** Treat the Hytera PNC360S as the single main device, or make Teltonika FMC920 an alternative separate chapter image variant. Show manufacturer mark intact, no artificial screen compositing, no false colour/shadow under device, never upscale beyond 539px intrinsic radio width. For a high-end in-use scene, commission real device photography with the exact model.

### 05 PROVE
**Headline:** Turn activity into evidence.

**Body:** Shift records, checkpoint events and incidents can support clearer service reporting—so clients can understand what was delivered.

**Product disclosure:** Proof-of-service screens require approved captures from a synthetic demo tenant; no verified production-client report is available.

**Replacement photography:** Facilities manager plus account manager reviewing site service with an actual unedited Guard proof-of-service capture produced from a clean synthetic demo tenant. If safe approved data are unavailable, use real photography with every screen facing away and label any narrative depiction as illustrative; don't fake a report.

## 4. Framing and crop specifications for 03B

- **Source of truth:** no AI image in `assets/story/reference` may be imported/rendered by a public route. The typed `storyChapters` object has `approvedMediaPath: null` for **all** scenes. `publicStoryMediaApproved` returns `false`.
- **Mobile:** target a 4:5 portrait crop for documentary photography, respecting faces/hand positions. Keep critical subjects inside a central-safe focal region; a 390px-wide screen must not decapitate people or cut off the demonstration. Hero should cover its single continuous card with no inset second rounded rectangle.
- **Desktop:** use a source that supports the actual rendered display at native pixels; no CSS upscaling, distorted portrait hardware, or forced object-cover for cut-out products.
- **Narrative:** one scene, one image, 1–2 sentences, explicit chapter navigation. Editorial headline ≠ a claims-of-availability badge.
- **Geometry:** one 14px card with flush media edge; canonical 10px controls, no multiple rounded glass panels, no fake phone outline.
- **Rendering:** Next/Image or vetted media pipeline with bundled local paths, fixed intrinsic dimensions and correct `sizes`; meaningful alt text, media dark fallback, optional safe crop focal point, actual PNG/WEBP MIME on HTTP 200.
- **No decorative movement:** story media transitions ≤320ms; reduced-motion disables; no image zoom, parallax on faces, perpetual shine, fake metallic texture or CSS override stack.
- **Performance:** output modern AVIF/WebP per target width from sufficiently large clean master, with high-quality 4:5 mobile crop. Current reference binary staging is **not** a replacement for the 2560px originals.
- **Photography quality:** model/property releases; natural South African context; believable anatomy, hands, words, devices and uniforms; fictional partner/guarding companies must not be misrepresented as customers.
- **Marketing product claims:** Guard and Sales OS currently under development; Guard Marketplace coming soon; PTT/bodycam/tracking integration not claimable as released. Follow up with engineering/product owners before launch.

## 5. Sign-off matrix

| Gate | WIN | HIRE | RUN | EQUIP | PROVE |
|---|---|---|---|---|---|
| Source binary exists locally | YES (reference only) | YES (reference only) | YES (reference only) | YES (manufacturer) | YES (reference only) |
| Correct real-world activity | NO | NO | PARTIAL (fictional) | YES, device | NO |
| Authenticated photographic origin / rights | NO | NO | NO | **Conditional** official manufacturer, no media-kit terms reviewed | NO |
| Resolution supports premium final display | NO final master | NO final master | NO (960px) | **Limited** radio 539px width | NO final master |
| Actual Signal One product proof available | NO | N/A, Marketplace not live | NO approved demo screenshots | Not an integrated UI | NO approved demo screenshots |
| Approved for public story | **NO** | **NO** | **NO** | **NO — conditional** | **NO** |

**03A result: EDITORIAL FROZEN / MEDIA PROVENANCE COMPLETE / FINAL VISUAL-ASSET GATE RED.**

Do not move directly into the polished 03B story based on these provisional images. The immediate dependency is real purpose-matched photography for WIN/HIRE/RUN/PROVE, plus an approved clean Guard proof capture, and confirmed manufacturer media-use rights. A source-correct sample can be composited/tested as a private preview only **with explicit illustrative labelling** and without pretending the experience is release-ready.

## 6. Release/integration boundary

This execution modifies no presenter, visitor, animation, CSS, backend, Vercel config, V2 or public production route. The two vendor product images are staged in V3 `public/media/hardware/` but **not linked or displayed by any V3 public page**. Real-world media are intentionally staged outside `public/`.

Next **separate** mission before 03B design: acquire and inspect approved originals, capture real synthetic demo software evidence and update `storyChapters` paths/status only after independent review. The underlying card/QR/vCard/Share flow remains stable.


## 7. Subsequent review status — still not production photography

The later photo-led staging review uses the four existing illustrative people/operations binaries and the conditional manufacturer Hytera device image behind a non-production server gate. This lets the founder evaluate composition, typography, focus and transitions before commissioning real replacements. **The 03A final-media release matrix above stays RED.** The approval to proceed is creative approval, not independent rights/release documentation.
