# Public website visual and conversion audit

Review completed across 16–17 November 2026, against production baseline `ad3235b` (PR #99).

## Coverage

Complete pages were visually reviewed at 375, 768 and 1440 CSS pixels, including lower sections and footers. Screenshots were supplemented by image-loading, resolution, measured contrast, keyboard navigation, routing and local form tests. Capturing a screenshot or passing a build alone is not treated as a visual pass.

| Route | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| `/` | Reviewed | Reviewed | Reviewed |
| `/solutions/security` | Reviewed | Reviewed | Reviewed |
| `/service` | Reviewed | Reviewed | Reviewed |
| `/guard-marketplace` | Reviewed | Reviewed | Reviewed |
| `/equipment-marketplace` | Reviewed | Reviewed | Reviewed |
| `/radios-equipment` | Reviewed | Reviewed | Reviewed |
| `/ptt-radio-rental` | Reviewed | Reviewed | Reviewed |
| `/guard-patrol-software` | Reviewed | Reviewed | Reviewed |
| `/guard-attendance-software` | Reviewed | Reviewed | Reviewed |
| `/pricing` | Reviewed | Reviewed | Reviewed |
| `/contact` | Reviewed | Reviewed | Reviewed |
| `/get-started` | Reviewed | Reviewed | Reviewed |
| `/guards` | Reviewed | Reviewed | Reviewed |
| `/guards/join` | Reviewed | Reviewed | Reviewed |
| `/join/sales` | Reviewed | Reviewed | Reviewed |
| `/security-trust` | Reviewed | Reviewed | Reviewed |
| `/popia` | Reviewed | Reviewed | Reviewed |
| `/privacy` | Reviewed | Reviewed | Reviewed |
| `/terms` | Reviewed | Reviewed | Reviewed |
| `/connect/andisiwe` | Reviewed | Reviewed | Reviewed |
| `/present/andisiwe` | Reviewed | Reviewed | Reviewed |
| Missing-page / 404 state | Reviewed | Reviewed | Reviewed |

Also reviewed all company-onboarding, guard-profile and sales-application steps, review screens and email fallback states at the three widths, all five equipment form variants, and phone/tablet menus. Submission tests use synthetic data and local mocks. No live leads were submitted. Authenticated operational products are outside this public website audit.

## Corrections

| Area | Defect | Correction |
| --- | --- | --- |
| 1Service | Three shallow crops cut through heads; fourth card had no photograph. | Four complete 16:9 scenes using existing illustrative assets, consistent frames and contained images. |
| Supporting photographs | Shallow containers, masks and glare obscured scenes. | Complete photographs with consistent proportions; approved homepage hero and control-room asset retained. |
| Legal and trust pages | Light-page text palette inherited onto dark backgrounds. | Explicit dark reading surface, high-contrast copy, readable contents links and quieter review notices. |
| Backgrounds | Legacy hero rules overrode reading overlays. | Consistent dark overlays, including guard marketplace, and opaque long-form reading panels. |
| Navigation | Tablet menu and toggle used different breakpoints; focus could leave the menu. | Matching breakpoints, focus containment, Escape closure, focus return and resize scroll unlocking. |
| Small controls | Faint accents, Edit controls and progress indicators; cramped consent; dark date icon. | Readable foregrounds, inactive step colours, padded consent controls and dark-scheme month picker. |
| Tablet layouts | Guard preview labels squeezed beside actions; weekday choices overcrowded. | Stacked profile actions until desktop and three-column weekdays on wider forms. |
| Hardware | Faint homepage labels, undersized tracker image request and unreliable light-well selector. | Explicit product class and colours, corrected image sizes and consistent light product wells. |
| Radio conversion | Enquiries assumed rentals; product links lost model selection. | Buy/Rent/Compare options, conditional rental terms, model/category prefilling and correct purchase/rental payloads. |
| Rental landing page | Generic closing copy introduced guard-day pricing. | Rental-specific closing copy and a rental-prefilled quote link. |
| Copy | Repeated Planned labels, internal editorial headings and unsupported integration wording. | Clearer benefits, one planned-capability label and accurate development/quotation language. |
| Intake clarity | Visitors could reach an unavailable receiver without understanding the email route. | Availability notices explain that the prepared email must be sent by the visitor when direct intake is unavailable. No false success or automatic trial activation. |

## Commercial and image constraints

- 1GUARD remains R2.50 per guard per day excluding VAT, minimum 10 guard days, with carryover and no tiers. Trial activation requires confirmation.
- Product status remains Pilot for 1GUARD, in development for 1Service, and MVP in development for Guard Marketplace. This audit does not activate operational products.
- Radio purchases and rentals are supported; radio rental terms remain 12, 24 or 36 months. Prices, availability and delivery remain subject to quotation.
- Product images remain manufacturer-sourced. See [ASSET_PROVENANCE.md](../ASSET_PROVENANCE.md) for Hytera and Teltonika source records. No generated device substitutes were added.
- E600 has no verified manufacturer image; a compact text presentation replaces its empty image well.
- The legal-review notice remains visible; design changes do not constitute legal approval.

## Verification

```sh
npm run build
CI=1 VISUAL_AUDIT_DIR=/absolute/path/to/evidence npm run qa:run
```

`visual-audit.spec.ts` captures 66 complete page views and image/text inventories. `visual-states.spec.ts` captures journey steps, quote variants and menus. Form-only screenshots hide the fixed header during capture to avoid painting it across tall element screenshots; page and menu captures retain it. A direct viewport check confirmed the new onboarding heading remained below the fixed header after continuing.

`visual-corrections.spec.ts` protects the four complete service images, measured legal contrast, tablet menu, model-specific quote links and purchase/rental payloads. The existing release gate covers accessibility, metadata, routes, image resolution, pricing, consent, saved progress, intake failures and receipt validation. Release checks must pass before merging. Production deployment and live rendering must be verified after merging.
