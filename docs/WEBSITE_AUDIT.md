# Signal One public website: audit (Phase 1)

Branch `fix/world-class-transformation`, cut from `main` @ 295f015.

This doc records the findings we acted on and the product-truth checks behind the copy. Each finding gives its status at the end of this branch.

## Routes

`/`, `/solutions/security`, `/guard-marketplace`, `/radios-equipment`, `/pricing`, `/contact`, `/get-started`, `/guards`, `/guards/join`, `/join/sales` (noindex, not in sitemap), `/security-trust`, `/privacy`, `/popia`, `/terms`, `POST /api/intake`.

- `GET /api/marketplace` has been **removed** (F4).
- The legacy redirects in `next.config.ts` are unchanged.

## Findings

| # | Finding | Action on this branch |
|---|---|---|
| F1 | `proof-client-reporting.png` is an AI-made **fake security dashboard** ("Irongate": 24 incidents, 3:41, 98.6%, 4.8/5). It shows an overseas harbour city and an all-white cast, and was used in PROVE (marked Live), GROW, the `/solutions/security` CTA and `/join/sales`. | Removed everywhere. No photo now implies Signal One software. |
| F2 | `workforce-briefing.png` and `field-radio-tracking.png` are byte-identical (md5 `776d94f6…`). One photo stood for three different things. | Neither is used. The scene also has Table Mountain and tactical vests. |
| F3 | All 7 hosted photos are AI-generated, each with a different fictional guarding brand. Three show Table Mountain, and most show tactical vests. | We use fewer photos, chosen better: 4 photographic moments on the homepage, with no duplicates and no Table Mountain. The estate dusk photo is re-cropped locally so the mountain is cut out. `docs/PHOTOGRAPHY_BRIEF.md` lists the commissioned replacements. |
| F4 | `/api/marketplace` and `MarketplacePreview.tsx` were built to publish guard profiles publicly with a "Verified" badge. The component was unmounted but the API was live. | Both deleted, and `GUARD_MARKETPLACE_*` removed from `.env.example`. Guard profiles are never published on the public site. |
| F5 | `/join/sales` hardcoded "10 current sales vacancies". | Now driven by config: `SALES_RECRUITMENT_STATUS`, `SALES_OPEN_ROLES` and `SALES_OS_URL` (see `lib/careers.ts`). There is a deliberate closed state. |
| F6 | `/get-started`, `/guards/join` and `/join/sales` were three copies of one template. | Rebuilt as three distinct experiences on top of a shared headless journey hook that keeps localStorage resume, consent, intake POST and analytics. |
| F7 | Dead weight: unused components (MarketplaceStore, FlywheelThread, PeopleSceneBriefs) and data files (`data/products.ts` with agri trackers, smart meters and "180+ countries"; `data/marketplace.ts` with fictional "D11/D12" radios). The 4 videos totalled 60 MB, and many images were unused or off-topic. | All deleted. `public/` went from **132 MB to under 1 MB**. `hero-panel.mp4` (26 MB, 4K) turned out to be a stock "hologram businessman / CONNECTIVITY" clip over a New York skyline, so it was deleted rather than compressed. |
| F8 | Analytics events were misaligned (`contact_begin`, `onboarding_begin`, …). | Aligned to the 14 events in the brief (`app/lib/analytics.ts`). |
| F9 | The design system was dark-only and leaned on glow, glass, blobs and grids, with 9–11px mono labels and 40–60% opacity body copy. | Rebuilt: light and dark surfaces, a type scale with no text under 14px for anything important, and no glow. See `docs/DESIGN_SYSTEM.md`. |
| F10 | On the homepage, product proof sat below the hero plus a bento. There were about 12 dark sections in a row, and control-room-day was used 3 times. | Rebuilt as an alternating light/dark narrative with product proof in the first third. |
| F11 | Product screenshots were 1440×5000 full-page captures shown with `object-cover`, so they cropped arbitrarily. The navigation in every capture includes a **"Shared phones"** tab plus internal tabs. | Each screenshot now has deliberate desktop and mobile crops in `public/images/product-proof/crops/`. Navigation chrome is excluded. Every crop is captioned "Synthetic demo data" and was inspected for real names and phone numbers. |
| F12 | `robots.ts` fell back to a Railway host. The color scheme was dark-only. The equipment form was generic. Form labels were 11px uppercase. | Base URL unified on `NEXT_PUBLIC_SITE_URL \|\| https://signalone.co.za`. Color scheme set to `light dark`. The equipment form adapts to the category. Labels are 15px sentence case. |

## Product-truth cross-check (code beats copy)

These were checked against `signal-one-guard` and the enterprise platform repo at their HEAD on 2026-10-06.

| Claim | Code says | Website treatment |
|---|---|---|
| Guard Marketplace = MVP | **No implementation** in either repo. Neither has browse, filter, shortlist or hire-request code. Guard does have *Workforce Exchange*: a company offers its own posts to its own guards, who accept or decline. | Presented as **MVP in development** in future tense, with a "register interest" CTA. The demo UI is labelled "Illustrative demo · synthetic data". **Decision for Simon.** |
| PSiRA rules | Number, grade and expiry are stored. A missing or expired registration blocks the assignment. Only a grade mismatch can be overridden, the override needs a reason and is audited. There is no external verification. | Stated exactly as above. There are no "Verified" badges. |
| Client portal | Client admin and viewer roles. Clients see their own sites, patrols, scans, incidents and proof of service. Viewers can generate reports. There is no live map or clock status for clients. | Live, scoped exactly as above. The live map, clock status and patrol progress are marked Coming soon. |
| Inactive client loses portal access | **Not enforced.** Only user status is checked; client status is not. | The claim is **not made** on the site. Reported to Simon as a product bug. |
| "Central Device" | The product UI says "Shared site phone" (device mode `SHARED`). | Public copy uses "Central Device" per founder decision. **Product UI wording mismatch reported.** |
| Guard days carry over, 10-day minimum | Billing is not implemented in code. | Presented as commercial terms per founder truth. Not described as an automated feature. |
| Payroll, Accounting, tracking and PTT integration | Not in Guard code. | Payroll: Coming soon. Accounting: Beta. Equipment: commercially available and quoted separately. "Commercial availability ≠ software integration" is stated. |
| Equipment catalogue and 12/24/36 terms | Present in the enterprise catalogue. | Named products listed, rental by quote. No prices shown. |
| Sales OS | Exists, staff-only, behind the shared staff login. | Never presented as part of the R2 subscription. Existing reps are linked via `SALES_OS_URL`. |
| Intake upstream | No endpoint accepts website intake. | `/api/intake` keeps returning a graceful 503 until `SIGNAL_ONE_INTAKE_URL` is set. **Backend contract missing.** |
