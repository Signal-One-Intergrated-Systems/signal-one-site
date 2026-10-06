# Photography brief: commissioned documentary shoot

## Status

Every photograph on the site today is an **AI-generated environment** of a fictional guarding company. Each one is captioned "Illustrative scene". None of them depicts the Signal One product: product evidence is always a real screenshot.

This brief replaces each slot with commissioned, real South African photography.

## Rules for every frame

- **Look:** documentary-commercial in natural light. About 75–80% of frames are daylight and 20–25% are dusk or night. No staged hero poses, weapon props or aggressive stances. No red and blue light bars except where the scene genuinely needs them.
- **Places:** real South African locations, for example Johannesburg office parks, Midrand, Sandton, Centurion, Pretoria, industrial areas, logistics yards, residential estates, malls, schools, construction sites, guard houses and modest control rooms.
  - No flags, map clichés or tourist shots.
  - Not only Cape Town, and **no Table Mountain** in buyer-facing frames.
- **People:** a credible multiracial South African workforce, Black, White, Coloured, Indian and of mixed heritage, across varied ages and body types.
  - Include women guards and supervisors.
  - **Never correlate race with hierarchy.**
- **Uniforms and vehicles:** a fictional or generic guarding company. Mostly professional uniforms, not armed response, and minimal tactical gear. Signal One branding appears only on software or corporate settings.
- **Devices:** any phone, tablet or monitor that is visible must **either** face away from the camera **or** show a real Signal One capture added in post from synthetic demo data. Never a fake UI.
- **Releases:** every recognisable person must sign a model release, and every private property needs a property release. Record the fictional brand used per shoot.
- **Delivery:** RAW plus graded TIFF. Desktop masters at least 2560px on the long edge. Supply a separate 4:5 mobile crop for every hero and keep focal points marked.

## Shot list by slot

| # | Slot (file / page) | Replaces | Brief |
|---|---|---|---|
| 1 | Home hero, right (`business-park-gate-mobile`) | AI business-park gate | Morning at a Midrand or Sandton office-park boom gate. Supervisor in the foreground checking the post with an officer; a visitor's car at the boom. Portrait 4:5 and landscape 16:9. |
| 2 | Home Hire (`logistics-gate`) | AI logistics gate | Logistics yard in Germiston or Isando, mid-morning. Two officers in hi-vis checking a truck. Wide, plus a 4:5 crop. |
| 3 | Home Run, day (`office-park-access`) | AI office-park access | Centurion office park: an officer signs in a visitor at a pedestrian access point. Natural interaction, no posing. |
| 4 | Home Run, night (`estate-gate-dusk`) | AI estate at dusk (re-cropped to remove Table Mountain) | Residential estate gate in Gauteng at dusk, warm guardhouse light, an officer speaking to a resident's car. Tall 2:5 crop. |
| 5 | Security platform, patrol (`story/checkpoint`) | AI, 960px only | An officer scanning a QR or NFC checkpoint on a patrol route at a warehouse. Phone screen facing the officer. ≥2000px. |
| 6 | Guards hero (`story/female-guard`) | AI, 960px only | A woman officer at a checkpoint in early light, shot as a professional at work. Portrait 4:5, ≥1600px. |
| 7 | Careers hero (`story/sales`) | AI, 960px only | A Signal One sales representative in a real meeting with a security-company owner at their office, in Johannesburg or Pretoria. Signal One corporate setting allowed. |
| 8 | Control room (not yet used) | n/a | A modest control room for a 50–300 guard company, 2–3 operators. Monitors either show a real Signal One Control room capture with synthetic data, or face away. |
| 9 | Client proof (not yet used) | Retired fake "Irongate" dashboard | A client facilities manager and a security-company account manager at a site walk-through. No screens. |
| 10 | Equipment (not yet used) | n/a | Real product photography of the rental catalogue (Hytera PNC360S, P30 Lite, E600, FMC920, FMB920, SC780) on a neutral background and in use on site. No renders. |

## Final visual QA before publishing any frame

Check every frame for the following:
- hands and fingers
- distorted or inconsistent logos and fictional brands
- repeated faces
- overseas architecture
- blur or upscaling
- stretched aspect ratios
- weak crops at 390px and 2560px

## Product capture: curated demo tenant (needed for recapture)

The product screenshots on the site are crops of captures from a test tenant. Every region of the "My operation" roster and the proof-of-service detail list carries test labels ("SMOKE A Site", "Smoke walk-through post", "Smoke idle guard", "Realistic Late c2995a93"), raw enum codes (`EARLY_CLOCK_OUT`, `OUTSIDE_RADIUS`) and US-format dates (`9/26/2026, 5:09:38 AM`). We do not blur or edit screenshots, so those two views are **not shown** until the tenant below exists. The control-room, proof summary and people views use the cleanest regions available today.

Build one curated demo tenant, then recapture all views at 1440px wide (desktop) and 390px wide (mobile), dark theme, navigation tabs cropped out (the product tab still says "Shared site phone"; the website says Central Device).

- **Company:** a plausible mid-size South African security company, for example "Ikhaya Security Services". No "Demo", "Smoke" or "Test".
- **People:** 25–40 guards with realistic South African names across language groups, 3–4 supervisors, one company admin. Email addresses on a real-looking domain, not `.local`.
- **Sites:** four to six, named like real work: a residential estate (for example "Bryanston Estate"), an office park ("Waterfall Office Park"), a logistics yard ("Isando Logistics Yard"), a school or mall. Posts named by function: "Main gate", "Pedestrian gate", "Control room".
- **One plausible day:** day, afternoon and night shifts across the sites, one shortfall (a post short by one guard), a handful of patrols with QR/NFC checkpoints scanned on time and one missed, and **one** SOS that is acknowledged and resolved. No dozens of identical alerts.
- **Proof of service:** a week with a believable mix: mostly proven, a few partly proven or unresolved, each with a human-readable reason.
- **Dates and times:** en-ZA format (`26 Sep 2026, 05:09`, 24-hour). Product change needed if the app currently renders `M/D/YYYY h:mm AM`.
- **No raw enum codes** in any visible text. Reasons are phrased in words ("clock-out earlier than the shift end").
- **Counts:** queue sizes that a real operation would have, not 77 live SOS or 323 open items.
- **Checks before publishing:** no real names, phone numbers or emails; no test prefixes; screenshots unedited.
