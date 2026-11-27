# Signal One: website research and requirements (Workstream D, second pass)

Prepared 2026-11-25. This replaces the first-pass `docs/launch/RESEARCH.md`, which was built mostly from search excerpts.
Desk research and read-only benchmark rendering only. No repository was modified, no form was submitted on any site, and no cookie banner was accepted (banners were hidden locally with CSS for the screenshots).

## 0. Method, source status and what changed from the first pass

### 0.1 How sources were read

- **[F] Fetched directly.** The page itself was downloaded (curl through the session proxy) and its text read, or it was rendered in headless Chromium 1440×900 with Playwright. Each [F] row cites the exact URL that was read.
- **[R] Rendered.** As [F], plus a 1440×900 screenshot saved in this folder (section 5.3).
- **[Src] Source code.** Read from `raw.githubusercontent.com` at the `main` branch on 2026-11-25. Repositories were not cloned.
- **[S] Excerpt only.** The host is still outside this session's network allowlist, so only a web-search excerpt was seen. These rows are weaker. Nothing in them is stated beyond what the excerpt showed.

### 0.2 Evidence-strength labels

| Label | Meaning |
|---|---|
| **Research-supported** | Empirical usability testing or a benchmark with a stated method (for example NN/g or Baymard studies). Effect sizes are usually not published. |
| **Standard** | Normative text of WCAG 2.2 (W3C Recommendation, 12 December 2024) or Google's published Core Web Vitals thresholds. This means the requirement is verified. It does not mean the business effect is proven. |
| **Practitioner guidance** | Design-system or expert guidance without a study behind the specific claim (GOV.UK Design System, Vercel guidelines, Chrome docs advice). |
| **Hypothesis** | An inference for Signal One that no source tests. This includes every simulated-persona statement. There is **no real Signal One customer data yet.** |

### 0.3 Corrections to the first pass (important)

| First pass said | Primary source now shows | Effect |
|---|---|---|
| Hytera has **no "P30 Lite"**; the model name was suspect (DR-006). | Hytera's **EU** site has a product page "P30 Lite PoC Radio": RTOS, 2G/3G/4G, IP54, 1.2 m drop, 3,300 mAh, 170 g, optional GPS and NFC. Target sectors named: logistics, construction, hospitality, retail, property management, security. https://www.hytera.com/eu/products/poc-radio/p30-lite [R] | The model exists. The **global** range page (https://www.hytera.com/en/product-new/lte-broadband/poc-radios.html [R]) still lists only W60, P60, P50, P50 Pro, P30, P30 (C), PNC360S, PNC380 and MNC360. The SA variant, its bands and its supply route still need confirming against Signal One's supplier documents. The South African site https://www.hytera.co.za/ is not reachable from this session. |
| No manufacturer found for **"E600 PoC LTE"**. | Search excerpts suggest a **Caltta e600** PoC radio launched in June 2021: screenless, 3G/4G/Wi-Fi, 240 g, DMR interoperability. https://www.criticalcommunicationsreview.com/lte/news/105430/caltta-launches-two-new-business-productivity-enabling-push-to-talk-radios [S]. There is no Caltta primary page. | This is a **candidate** manufacturer only. Do not publish "Caltta" or any spec until the supplier invoice or datasheet confirms it (DR-006). |
| PNC360S header says "LTE/5G", but its table lists no 5G bands. | Confirmed on the rendered page. The chips read "Handheld · LTE/5G · GPS". The body copy says "2G, 3G, 4G, and WLAN networks". The frequency table lists no 5G (NR) band. https://www.hytera.com/en/product-new/lte-broadband/poc-radio/pnc360s.html [R] | Signal One must not say "5G" for the PNC360S. |
| WCAG, web.dev, GOV.UK and NN/g were read as excerpts. | All read in full ([F]); criteria text is quoted in §1.H. | Labels upgraded where the full text supports them. |
| "Single evaluator finds 35%" (NN/g) could not be confirmed. | Not re-checked; still unused. | — |

### 0.4 Still unreachable (never guessed)

| Host or page | Result | Consequence |
|---|---|---|
| www.motorolasolutions.com (WAVE PTX, rental) | **HTTP 403**, from both curl and headless Chromium (the site blocks automated clients). | Motorola appears only as a search excerpt in §5. No screenshot. |
| www.pocstars.com | The TLS certificate does not match the host (it serves `*.hostnetbv.nl`). The connection was refused and verification was **not** bypassed. | POCSTARS platform claims are not used. The HyTalk vs POCSTARS decision (DR-016) gets no research input from this pass. |
| South African firms (satlec.co.za, sefeko.co.za, netstar.co.za, cartrack.co.za, instacom.co.za, oukitel.co.za, hytera.co.za; sentiv.co.za tried as a guess) | Not in the session allowlist (connection refused, DNS ENOTFOUND). | All SA rows are **[S] excerpt-only**. |
| Gartner, PSiRA, POPIA regulator, StatCounter | Not allowed. | Buying-group survey statistics, PSiRA facts and SA device-share data are **not used** in this pass. Those topics rely on NN/g qualitative research plus Hypothesis. |
| Product and hero media on hytera.com and verkada.com | Image and video CDNs blocked. The screenshots show empty image boxes (Hytera) and a black video area (Verkada). | Layout and text are valid. Imagery cannot be judged. |

---

## 1. Findings mapped to requirements

Columns: **ID**, **Finding** (with the URL that was read), **Requirement for Signal One** (testable), **Supports** (a DR-xxx defect, or a new Q-xx requirement from §4), and **Strength**.

### 1.A B2B purchasing psychology and buying groups

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-01 | B2B decisions are "long, complex", involve "multiple people, across a corporate hierarchy and functional job roles", and buyers "share options with multiple people on their team". https://www.nngroup.com/articles/b2b-vs-b2c/ (2016) [F] | Each radio page and each quote confirmation gives a shareable, printable summary (model, key specs, term options, what is included, company identity). Test: print preview of `/radios-equipment` shows no clipped tables and no nav chrome. | Q-02 | Research-supported (qualitative) |
| R-02 | **Users** (who research) and **choosers** (who approve) need different content. Users want "specifications and details… support options after purchase… ways to justify it". Choosers want "cost, reliability, integration efforts, support contracts… ROI". Choosers "might only refer to the website as part of a final review". [same URL] | Radio pages carry two clearly separated blocks: "For your operations team" (specs, battery per shift, durability, coverage, support) and "For finance and approval" (term options, what is included, buy vs rent, company details). | DR-006, DR-016, Q-01 | Research-supported (qualitative) |
| R-03 | B2B sites must "survive the screening process… and make it to the shortlist". Visitors are rejected "because your homepage is filled with superficial blather". Sites must "include prices or you'll lose the many users doing quick research". https://www.nngroup.com/articles/b2b-convincing-decision-makers/ (2004) [F] | The homepage first viewport (hero copy is founder-locked, so this applies directly below it) and the nav must route a radio buyer to radio facts in one click. | DR-002, DR-017, DR-019 | Practitioner guidance (older expert synthesis) |
| R-04 | Offer an "advocacy kit": downloadable spec and comparison tables, product photos in use, and slides. Use web pages over PDF so advocates can copy text. [same URL] | Per model: an HTML spec table (copyable), one in-use photo when a real one exists, and a downloadable one-page summary. No invented photography. | Q-02, DR-006 | Practitioner guidance |
| R-05 | Integration, compatibility and regulatory information must be clear. "Not being able to find compatibility and integration details… is a major pain point for B2B customers." https://www.nngroup.com/articles/b2b-vs-b2c/ [F] | State which mobile networks and SIMs each radio works on, which PTT platform it uses (HyTalk or other, once decided), whether it interworks with existing DMR radios, and whether 1GUARD reads its GPS. Unknowns are shown as "to be confirmed", never guessed. | Q-12, DR-016 | Research-supported (qualitative) |
| R-06 | Gartner statistics on the share of buyers preferring rep-free buying (cited in the first pass) **could not be re-read**, because gartner.com is not allowed. | Not used as evidence. A self-serve preference is supported qualitatively by R-15 ("Most web users prefer to find information on their own"). | — | — |

### 1.B Procurement risk, supplier credibility and online trust

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-07 | Trust is communicated by four factors that are "stable throughout the years": design quality, up-front disclosure, comprehensive and current content, and connection to the rest of the web. "An isolated website that does not link to and cannot be found on third-party review sites… appears to either have something to hide or not be a fully established, stable" business. https://www.nngroup.com/articles/trustworthy-design/ (2016) [F]; origin https://www.nngroup.com/articles/communicating-trustworthiness/ (1999) [F] | Launch checklist: (1) no typos or broken links (crawl), (2) all costs and terms disclosed before the quote (R-17), (3) every listed product has specs and a real image or an honest placeholder, (4) links out to verifiable third parties (manufacturer product page, CIPC record if the founder approves, Google Business profile if one exists). | DR-006, DR-007, DR-011 | Research-supported (qualitative, multi-country) |
| R-08 | "Typos, broken links, and other mistakes quickly degrade credibility." Participants questioned sites whose content did not cover the full range offered. [trustworthy-design] | A product listed without a manufacturer or image (E600 today) is either completed with verified facts or removed. A half-specified product signals "brittle". | DR-006 | Research-supported (qualitative) |
| R-09 | "Users still expect to see company addresses, phone numbers, and email addresses on 'Contact Us' pages. Don't hide or replace these… with… forms or chat." In the study of 20 business professionals on 40 corporate sites, users "look in the top right corner of the page or down in the footer". Companies that hide contact details "are seen as evasive and unreliable". Pages should "state when associates are available… or approximations for the time it will take to receive an email response". https://www.nngroup.com/articles/contact-us-pages/ (2019) [F] | Contact link in the header (top right) and footer; `/contact` lists phone, email, physical location and hours, plus a stated reply time. Sales and support are listed separately. Every fact is founder-supplied. | DR-007, DR-012 | Research-supported (qualitative, n=20) |
| R-10 | About Us research (3 rounds, 70+ users; latest round 20 users): users want "clear, authentic, and transparent" About content, "photos of real employees and products", and plain language. They distrust curated testimonials but still read them, and cross-check third-party reviews. https://www.nngroup.com/articles/about-us-information-on-websites/ (2019) [F] | `/about` built from verified facts only: legal name, location, who runs it, what it does and does not do, real photos only. No testimonials until real, attributable and consented. | DR-011, Q-10 | Research-supported (qualitative) |
| R-11 | WCAG 2.2 **3.2.6 Consistent Help (A)**: if help mechanisms (human contact details, a contact mechanism, self-help, an automated contact) repeat across pages, "they occur in the same order relative to other page content". https://www.w3.org/TR/WCAG22/#consistent-help [F] | When phone, WhatsApp and support links are added, place them in the same position (header utility and footer) in the same order on every page, including `/guards*` and `/join/*`, which use their own headers. | Q-07, DR-007, DR-012 | Standard |
| R-12 | Hytera's own SA security case study (iMvula Group: 8,000+ officers, 2,000+ sites, 1,500 devices, 90% PNC370 PoC, on Vodacom; delivered by distributor Altron Nexus) uses a problem → solution → scale structure. https://www.hytera.com/en-industries/case-study/public-safety/hytera-poc-solution-extends-coverage-to-remote-sites-in-south-africa-for-private-security-group/ [F] | Signal One may link to this **labelled as a Hytera case study** to show that PoC is proven in SA guarding. It must never imply that this is Signal One's customer, and must not claim Hytera partner status without written confirmation (Hytera runs a public "Find a Dealer"). | Q-10 | Practitioner guidance (vendor case study) |
| R-13 | Credibility of numbers: Verkada's homepage states "More than 30,000 organizations worldwide trust Verkada" (rendered 2026-11-25). The first pass saw "33,500+" on another Verkada page [S]. https://www.verkada.com/ [R] | Any count Signal One publishes (sites, radios, guards) is sourced, dated, kept in one place, and reused from that one place. | Q-10, DR-019 | Practitioner guidance (observation) |
| R-14 | Gating: "Many organizations make the mistake of placing items such as case studies, FAQs, and product specifications behind gates." People in early stages "have lower commitment and a higher propensity to abandon forms". https://www.nngroup.com/articles/content-behind-forms/ (2015) [F] | Specs, datasheets, FAQs and terms are never behind a form. Only the quote itself asks for contact details. | Q-16 | Research-supported (qualitative) |

### 1.C Pricing, TCO, buy vs rent (financial director, operations)

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-15 | "Prospective customers want to know the price as their #1 info need on any website — including B2B sites." In NN/g studies participants left for competitors when prices were missing. Price "determines product category", is "a key component in product comparison", and is "needed for planning… even ballpark figures help". When exact cost is unrealistic, show "prices for typical scenarios, price range, or MSRP". https://www.nngroup.com/articles/show-price/ (2013) [F] | Each radio and rental page shows at least one founder-approved representative scenario (e.g. "N radios, 24 months, with SIM and data: from R__ per radio per month excl. VAT") **or** a price range. If the founder will not publish any figure, the page says plainly what drives the price and how fast a written quote arrives. Figures come from the founder only; none are invented. | Q-01, DR-016 | Research-supported (qualitative) |
| R-16 | "Choose typical-case scenarios over complex pricing calculators": in NN/g studies "most pricing tools proved complex, time-consuming, and error prone". A shipping buyer preferred "a simple table with prices for the most common types of shipments". https://www.nngroup.com/articles/show-prices-for-common-scenarios/ (2006) [F] | Do not build a rental calculator first. Publish a 3-row scenario table (small, medium and large team) × term. | Q-01 | Research-supported (qualitative) |
| R-17 | "Unexpected service fees… should be disclosed early." https://www.nngroup.com/articles/ecommerce-taxes-fees/ (2018) [F]. Up-front disclosure includes "documenting what is included in a base cost, stating any additional fees". [trustworthy-design] | The rental page has a "What is included / what costs extra" list: device, SIM and data, PTT platform licence, delivery, deposit, damage and loss, early termination, end of term. Every price states excl. or incl. VAT. Unknown terms show as "confirmed in your written quote", never omitted silently. | DR-016 | Research-supported (qualitative) |
| R-18 | Price acts as a filter: "your sales team will have to spend less time following up with leads that cannot afford your products." https://www.nngroup.com/articles/b2b-vs-b2c/ [F] | Once a representative price is published, the quote form asks no budget question. Lead quality is measured in LEOS (quote-to-order rate), not guessed. | Q-01 | Research-supported (qualitative) |
| R-19 | Benchmarks: Verkada publishes an **MSRP pricing catalogue** (dollar list prices per product, licences, "Every purchase includes…") alongside "Get quote" (https://www.verkada.com/pricing/ [R]). Samsara's "Pricing" opens a stepped qualifier, "How many vehicles or assets do you have?" (1–5 … 5,000+), with no price visible on the first screen (https://www.samsara.com/pricing [R]). | For a small new supplier, the Verkada pattern (published price plus quote) fits R-15. The Samsara pattern (a pricing label leading to a lead form) is a **misleading label**. Signal One must not label a link "Pricing" or "Prices" unless it shows a figure. | Q-01, DR-004 | Practitioner guidance (benchmark observation) |
| R-20 | Buy vs rent framing for finance: no primary source fetched on TCO psychology (gartner.com and academic hosts not allowed). | A "Buy or rent?" comparison (cash up front vs monthly, who carries repair and replacement, end-of-term options, connectivity responsibility) is a **Hypothesis**, to be validated in moderated testing (R-62) with finance participants. | Q-01, DR-016 | Hypothesis |

### 1.D Product evaluation and specification presentation

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-21 | B2B spec pages should cover five areas: **footprint, ingredients, requirements and integrations, performance, tolerances and durability** (including "IP codes"). "It's much better to provide the specifications directly on your site, without forcing prospects to email or call." https://www.nngroup.com/articles/b2b-specs/ (2016) [F] | Radio spec template: Footprint (size, weight) · Components (chipset not required; screen, SIM, battery) · Requirements (networks and bands, SIM, platform) · Performance (speaker W, GNSS, battery mAh and shift claim as the manufacturer states it) · Durability (IP rating, drop, MIL-STD, temperature). | DR-006 | Research-supported (qualitative) |
| R-22 | "Ensure that all specifications are available on the website in HTML format, not just in PDF documents." Chunk long lists into titled tables; frontload labels; use zebra striping or borders; link standards to their issuing body. [b2b-specs] | Specs are HTML tables with a PDF as a secondary download. IP67, MIL-STD-810H and "PoC" each get a one-line explanation. | DR-006, Q-13 | Research-supported (qualitative) |
| R-23 | Baymard: "50% of e-commerce sites have spec sheet designs that are difficult for users to scan". "23% of e-commerce sites don't group specs semantically". Long sheets need a **key-specs summary** at the top and groups ordered by popularity. https://baymard.com/blog/spec-sheet-scannability (2018) [F]. Baymard's 2026 guide: "single-column layout with key specs first… standardize labels, attribute ordering, and units"; "64% of ecommerce sites' spec sheets are poor or mediocre". https://baymard.com/blog/product-spec-sheet-ux-design (2026) [F] | Key-specs strip (5–6 items) on each catalogue card and at the top of each product section. Identical attribute order and units across all radios, so they can be compared side by side. | DR-006, DR-015 | Research-supported (benchmark + testing) |
| R-24 | Baymard B2B electronic components and machinery research (290+ guidelines, tested on DigiKey, Arrow and others): "technical buyers benefit from structured product tables when evaluating many specifications". The findings "differ from the needs of mobile layouts". https://baymard.com/research/b2b-electronic-components-machinery [F] (the guidelines themselves are paywalled and were not read) | A comparison table of the 2–4 radios at ≥1024 px. At 390 px it becomes stacked cards with the same attribute order (no horizontal page scroll). | DR-006 | Research-supported (summary only) |
| R-25 | The manufacturer publishes verifiable data. PNC360S: IP67, MIL-STD-810H, 1.2 m drop, 4,000 mAh ("an entire shift"), about 190 g including clip, 1.77" non-touch screen, 1 Nano-SIM, GPS/BeiDou/GLONASS/AGPS, Wi-Fi, 104×54.6×26.5 mm, and a disclaimer that specs "are subject to change". https://www.hytera.com/en/product-new/lte-broadband/poc-radio/pnc360s.html [R]. P30 Lite: IP54, 3,300 mAh, 170 g, RTOS, NFC optional. https://www.hytera.com/eu/products/poc-radio/p30-lite [R] | Copy specs only from the manufacturer page or datasheet **for the variant Signal One supplies**. Keep a per-SKU source log (URL, date, variant). Keep "about" where Hytera says "about". Repeat the manufacturer's change disclaimer. | DR-006, Q-08 | Practitioner guidance (primary manufacturer data) |
| R-26 | The Axis W120 body camera page (en-ZA) puts five benefit bullets in the first viewport and has anchor tabs (Overview / Technical specifications / Compatible products / How to buy / Support), but the "Technical specifications" section says only "please download the datasheet below. Datasheet (pdf)". https://www.axis.com/en-za/products/axis-w120-body-worn-camera [R] | Adopt the anchor-tab structure for long product pages. **Reject** PDF-only specs (contradicts R-22). | Q-13 | Practitioner guidance (benchmark) |

### 1.E Quote-request UX, forms, errors and confirmation (ethical conversion)

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-27 | Heuristic 1: "keep users informed about what is going on, through appropriate feedback within a reasonable amount of time." https://www.nngroup.com/articles/ten-usability-heuristics/ [F] | The form reports success only on a persisted LEOS receipt (already the site's rule). Until the receiver exists, the mailto fallback must say plainly that nothing has been sent yet (it does). | DR-001 | Practitioner guidance (canonical heuristic) |
| R-28 | GOV.UK confirmation pages must include "a reference number, if there is one", "details of what happens next and when", links to likely next steps, and "a way for users to save a record". "Some users will bookmark the confirmation page as a form of receipt." https://design-system.service.gov.uk/patterns/confirmation-pages/ [F] | The current in-place success card (`EquipmentQuoteForm.tsx`: "Quote request received", reference, next steps) adds: **when** (a founder-approved reply time), a printable or saveable record, and a URL that survives reload (e.g. `/quote/received?ref=`), showing no personal data. | DR-001, Q-04 | Practitioner guidance (tested in live government services) |
| R-29 | GOV.UK error summary: "Always show an error summary when there is a validation error, even if there's only one". Move focus to it. Link each error to its field. Word it the same as the inline message. Prefix the page `<title>` with "Error: ". https://design-system.service.gov.uk/components/error-summary/ [F]; https://design-system.service.gov.uk/patterns/validation/ [F] | Replace browser-native validation bubbles on all intake forms with: an error summary at the top of the form (focused, `role="alert"` child) + inline messages + "Error: " prefix in the title. | Q-03 | Practitioner guidance |
| R-30 | GOV.UK validation: "Turn off HTML5 validation." "Do not validate when the user moves away from a field. Wait until they try to move to the next part." Accept varied formats and ignore stray spaces and hyphens. Keep the entered data. [validation URL] | `noValidate` on the form, server-side and client-side validation on submit, mobile numbers accepted with spaces, `+27` or a leading 0, entered values preserved. | Q-03 | Practitioner guidance |
| R-31 | **Conflict:** Baymard tested inline validation positively ("31% don't have it", while the page body says 32%), warns against "premature validation", and says errors should be removed "as soon as the field is corrected". https://baymard.com/blog/inline-form-validation (2024) [F]. NN/g: "Ideally, all validation should be inline", as soon as the user has "finished filling in a field". https://www.nngroup.com/articles/errors-forms-design-guidelines/ (2019) [F] | Resolution for Signal One (a short form): validate on submit (GOV.UK). After the first failed submit, re-validate each errored field live and clear its message the moment it becomes valid (Baymard). Never show an error while the user is still typing in a field for the first time. Tested in R-62. | Q-03 | Research-supported (both sides); resolution is Practitioner guidance |
| R-32 | Baymard: "98% of sites… don't use error messages targeted specifically at the exact problem". Generic messages caused abandonment. https://baymard.com/blog/adaptive-validation-error-messages (2023) [F]. GOV.UK: messages say what went wrong and how to fix it, in plain English. https://design-system.service.gov.uk/components/error-message/ [F] | One specific message per failure type, e.g. "Enter a mobile number with 10 digits, like 082 123 4567", never "Invalid input". | Q-15 | Research-supported |
| R-33 | Baymard: mark **both** required and optional fields. Only 14% of sites do, and failing to do so caused "unnecessary validation errors… and even abandonments". https://baymard.com/blog/required-optional-form-fields (2018) [F]. GOV.UK: add "(optional)" to optional labels. https://design-system.service.gov.uk/patterns/question-pages/ [F] | The form already marks optional fields "(optional)". Keep that. Required fields are made evident by the "(optional)" convention plus an intro line ("All fields are required unless marked optional"). Note that Baymard warns against page-level-only statements, so the inline markers stay. | — (verified OK) | Research-supported |
| R-34 | Field count matters more than step count. The average checkout has 11.3 fields, and "17% of users have abandoned due to checkout complexity". https://baymard.com/blog/checkout-flow-average-form-fields (2024) [F]. NN/g: "shorter forms have higher conversion rates… every time you cut a question… you'll get more responses". [content-behind-forms] | Audit the radio quote form (today 6 requirement fields + 4 contact fields + consent). Keep only fields LEOS needs to price (`SITE_INTEGRATION.md`). Candidates to make optional: "Where will they be used?" if the quote can proceed without it. | Q-03 | Research-supported (e-commerce checkout; transfer to quote forms is a Hypothesis) |
| R-35 | Labels: placeholders "hurt usability more than help". https://www.nngroup.com/articles/form-design-placeholders/ (2014) [F]. On mobile, labels go **above** fields (Baymard mobile study, 18 sites). https://baymard.com/blog/mobile-form-usability-label-position (2013) [F] | Visible labels above every field (currently true). Placeholders show examples only ("e.g. 24"). | — (verified OK) | Research-supported |
| R-36 | WCAG 3.3.1 Error Identification (A): "the item that is in error is identified and the error is described to the user in text". 3.3.2 (A): "Labels or instructions are provided when content requires user input." 3.3.3 Error Suggestion (AA): "suggestions for correction are… provided". https://www.w3.org/TR/WCAG22/ [F] | Each error is text (not colour alone), tied to its field with `aria-describedby` and `aria-invalid="true"`, and includes the fix. | Q-03 | Standard |
| R-37 | WCAG 3.3.4 Error Prevention (Legal, Financial, Data) (AA): pages that "cause legal commitments or financial transactions" must be reversible, checked, or confirmed. [WCAG 2.2] | A quote request is not a commitment (the site already says "Nothing is supplied until you accept it"). Any future online acceptance of a rental contract or 1GUARD subscription must have a review-and-confirm step. | Q-04 | Standard |
| R-38 | WCAG 3.3.7 Redundant Entry (A): information already entered "in the same process" is "auto-populated, or available for the user to select". [WCAG 2.2] | Product links into the quote form pre-select category, product and buy/rent (the form already reads `?category=`). Extend this to model and term. | DR-002, Q-03 | Standard |
| R-39 | WCAG 3.3.8 Accessible Authentication (Minimum) (AA): no cognitive function test at log-in unless an alternative or mechanism exists. Note 2 names "password managers" and "copy and paste". [WCAG 2.2] | No puzzle CAPTCHA on any intake form (a honeypot plus server rate limit instead). 1GUARD and Sales OS log-ins allow paste and password managers. | DR-021 | Standard (strictly for log-ins; applied to forms as Practitioner guidance) |
| R-40 | Ethical conversion: NN/g warns that hiding price "creates a hostile shopping experience" (the Halo Effect). [show-price] The first pass's dark-pattern sources (Mathur et al. 2019; FTC 2022) were excerpt-only and were not re-read. | No fake urgency, stock counts, activity pop-ups or pre-ticked marketing consent. Marketing consent stays separate and unticked (currently true). | DR-019 | Practitioner guidance |

### 1.F Information architecture, information scent, hierarchy, cognitive load

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-41 | Users choose links by information scent: "the link label is… perhaps the most important component". Labels like "Learn more" have low scent. https://www.nngroup.com/articles/information-scent/ (2020) [F] | Nav item contains the word "Radios" (DR-002 fix). Card CTAs name the object, e.g. "PNC360S specs and quote", never a bare "Learn more" or "Enquire". | DR-002, DR-018 | Research-supported |
| R-42 | Trust research: "clever or nondescript category names" leave users unsure whether content exists. [trustworthy-design] | The `1GUARD · Equipment marketplace` kicker (DR-009) and inconsistent product names (DR-008) are scent and trust defects, not only cosmetic ones. | DR-008, DR-009 | Research-supported |
| R-43 | Heuristic 8: "Every extra unit of information… competes with the relevant units." Heuristic 4: "Users should not have to wonder whether different words… mean the same thing." [ten-usability-heuristics] | One name per product across the site, schema.org and footer. A footer CTA that matches the journey (DR-004). Do not show the radio list twice (DR-015). | DR-004, DR-008, DR-015 | Practitioner guidance |
| R-44 | Hick's law: "the more choices you present… the longer it takes them to reach a decision". It can be mitigated with grouping and ordering. https://www.nngroup.com/videos/hicks-law-long-menus/ [F]. "An excess of choices can lead to fatigue… or even… abandon the process." https://www.nngroup.com/articles/simplicity-vs-choice/ (2015) [F] | The primary nav holds ≤5 items, ordered by commercial availability (available → pilot → in development). Each page has one primary CTA; at most one secondary. | DR-002, DR-004, DR-017 | Practitioner guidance (well-established law; NN/g summary only) |
| R-45 | Fitts's law: "closer targets are faster to acquire" and "bigger targets are better". https://www.nngroup.com/articles/fitts-law/ (2022) [F] | The primary CTA sits in the first 1440×900 viewport beside the H1 (DR-005 fix). On 390 px the CTA is full-width, ≥44 px high, within thumb reach. | DR-005, DR-024 | Research-supported (classic HCI law) |
| R-46 | Progressive disclosure "defers advanced or rarely used features to a secondary screen". https://www.nngroup.com/articles/progressive-disclosure/ (2006) [F] | Catalogue card = key specs + CTA. Full spec table and FAQ in expandable sections on the product page. Nothing essential (price basis, what is included) hidden behind a toggle. | DR-006, DR-016 | Practitioner guidance |
| R-47 | Visual hierarchy is created through colour and contrast, scale and grouping. "Use no more than 3 contrast variations for complex designs. If everything is contrasted, then nothing stands out." https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ (2021) [F] | Per page: one H1 scale, one accent used for the primary CTA only, and truth-label badges (available, pilot…) in a neutral style that never competes with the CTA. | DR-005, DR-019 | Practitioner guidance |
| R-48 | Gestalt proximity: "elements near each other are perceived as related". Common region: "elements within the same boundary are perceived as related". https://www.nngroup.com/articles/gestalt-proximity/ (2020) [F]; https://www.nngroup.com/articles/common-region/ (2020) [F] | A truth label sits inside the card of the product it describes. Price basis and VAT note sit inside the same box as the figure. Captions stay inside the content container (DR-014 class of defect). | DR-014, DR-022 | Practitioner guidance |
| R-49 | Minimise cognitive load: "avoid visual clutter", "build on existing mental models", "offload tasks" (e.g. "re-display previously entered information… set a smart default"). https://www.nngroup.com/articles/minimize-cognitive-load/ (2013) [F] | Smart defaults in the quote form (rental term preselected only if the founder approves a default; otherwise none). The homepage reduces repeated "vision / planned" passages (DR-019). | DR-019, Q-03 | Practitioner guidance |
| R-50 | Aesthetic-usability effect: in Kurosu and Kashimura (CHI 1995; 252 participants, 26 ATM layouts), aesthetics correlated more strongly with *perceived* than *actual* ease of use. The effect "can mask UI problems during usability testing". https://www.nngroup.com/articles/aesthetic-usability-effect/ (2024) [F] | Judge redesigns on task success and time (R-62), not on "looks better" screenshots alone. | Q-09 | Research-supported |
| R-51 | Eyetracking: people scan in patterns including the F-pattern, "even on mobile". https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ (2017) [F] | Frontload headings and spec labels with the information-carrying word ("Battery: 4,000 mAh", not "Long-lasting power"). | DR-006 | Research-supported |

### 1.G Colour, contrast, typography, readability, brand consistency

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-52 | WCAG **1.4.3 Contrast (Minimum) (AA)**: text has "a contrast ratio of at least 4.5:1", and large-scale text 3:1. Large scale is "at least 18 point or 14 point bold". Logotypes are exempt. https://www.w3.org/TR/WCAG22/#contrast-minimum [F] | Text on the glass hero card and photo backgrounds is measured against the **worst-case pixel** behind it at all four widths. Fix around the founder-locked hero (overlay or fill), never by recomposing it. | DR-013 | Standard |
| R-53 | WCAG **1.4.11 Non-text Contrast (AA)**: UI components and their states, and graphics needed to understand content, need "at least 3:1 against adjacent color(s)". [WCAG 2.2] | Input borders, radio and checkbox outlines, focus rings, and the selected state of buy/rent choices are each ≥3:1 against their background. Disabled controls are exempt but must not be the only state shown. | DR-024, Q-03 | Standard |
| R-54 | Legibility: "Use a reasonably large default font size… Have high contrast… plain background." Readability: for a specialised B2B audience target "a reading level several steps below the audience's formal-education level". https://www.nngroup.com/articles/legibility-readability-comprehension/ (2015) [F] | Body ≥16 px, form inputs ≥16 px (this also prevents iOS zoom, R-71). Copy on radio pages is in plain operational language ("works wherever the network has signal"), with jargon glossed once. | DR-006 | Practitioner guidance |
| R-55 | Colour and brand perception: colour schemes "can brand an organization as corporate, budget, or luxury", and the brand must match the service type. [trustworthy-design] Consistency (heuristic 4). | Brand architecture (Signal One → 1GUARD, 1Service, Equipment) is applied consistently. Equipment pages use the Signal One identity, not 1GUARD's (DR-009). The Sales OS log-in uses the approved shell (DR-021). | DR-008, DR-009, DR-021 | Practitioner guidance |
| R-56 | Vercel guidelines: "Prefer APCA over WCAG 2" for contrast. https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/README.md [Src] | **Reject as the pass/fail test.** WCAG 2.2 AA is the conformance standard. APCA may be used as an extra design check only. | — | Practitioner guidance (rejected) |

### 1.H Accessible and responsive interaction (WCAG 2.2 AA, text read from the Recommendation)

| ID | Criterion text (https://www.w3.org/TR/WCAG22/, Recommendation 12 Dec 2024) [F] | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-57 | **2.4.7 Focus Visible (AA)**: "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible." | Every interactive element has a `:focus-visible` style ≥3:1 (R-53). Spot checks passed (J10). Make this a Playwright assertion per route. | Q-03 | Standard |
| R-58 | **2.4.11 Focus Not Obscured (Minimum) (AA)**: "the component is not entirely hidden due to author-created content." The Understanding doc names "sticky footers, sticky headers, and non-modal dialogs" and says a cookie banner "will fail… if it entirely obscures" focus. Fixes include "scroll padding". https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html [F] | `scroll-padding-top` ≥ header height wherever the header is sticky. Any future WhatsApp or cookie widget must not cover form fields. Test: tab through the quote form at 390 px and at 200% zoom. | Q-14 | Standard |
| R-59 | **2.5.8 Target Size (Minimum) (AA)**: "at least 24 by 24 CSS pixels" except **Spacing** (a 24 px circle on each undersized target does not intersect another target or circle), **Equivalent**, **Inline** ("in a sentence or… constrained by the line-height"), **User Agent Control**, and **Essential**. | DR-024 (81×20 px wordmark links): passes if the 24 px circles do not intersect neighbours, or as inline links within a sentence. Measure, then pad to 24 px if neither holds. House rule: primary CTAs ≥44 px. | DR-024 | Standard |
| R-60 | **3.3.1, 3.3.2, 3.3.3, 3.3.4, 3.3.7, 3.3.8**: see R-36 to R-39 (text quoted there). 3.3.5 Help and 3.3.6 Error Prevention (All) are **AAA**, so not required. | — | Q-03 | Standard |
| R-61 | **1.4.3 and 1.4.11**: see R-52 and R-53. **3.2.6 Consistent Help (A)**: see R-11. | — | — | Standard |

### 1.I Core Web Vitals and LCP diagnosis

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-62 | Thresholds: LCP "within 2.5 seconds", INP "200 milliseconds or less", CLS "0.1 or less", measured at "the 75th percentile of page loads, segmented across mobile and desktop". A page passes only if it meets all three at p75. https://web.dev/articles/vitals [F]. Poor: LCP >4 s (https://web.dev/articles/defining-core-web-vitals-thresholds [F]), INP >500 ms (https://web.dev/articles/inp [F]), CLS >0.25 (https://web.dev/articles/cls [F]). | Release gate: lab LCP ≤2.5 s on the throttled mobile profile for `/`, `/ptt-radio-rental` and `/radios-equipment`, and CLS ≤0.1. The homepage's 4.4 s lab LCP is in the "poor" band (>4 s) **if field data agrees**. | DR-003 | Standard |
| R-63 | LCP has four subparts with "no overlap or gap": **TTFB, resource load delay, resource load duration, element render delay**. In a well-optimised page TTFB is about 40%, load delay <10%, load duration about 40%, render delay <10% ("guidelines, not strict rules"). Shrinking an image "wouldn't actually improve LCP because the time would just shift to the element render delay". https://web.dev/articles/optimize-lcp [F]; "Ideally, most of the LCP time should be spent on loading the resources, not within delays." https://developer.chrome.com/docs/performance/insights/lcp-breakdown [F] | DR-003 fix procedure: record a DevTools performance trace on the throttled profile, read the LCP breakdown insight, and attack the largest **delay** subpart. With FCP 1.2 s and a 161 KB AVIF already prioritised, element render delay is the expected culprit. Do not spend effort on further image compression first. | DR-003 | Practitioner guidance (Google documentation) |
| R-64 | Render-delay causes listed by web.dev: render-blocking stylesheets or sync scripts, the LCP element not yet in the DOM (waiting for JS), "the element is being hidden by some other code", and main-thread long tasks. web.dev's LCP definition excludes "Elements with an opacity of 0". https://web.dev/articles/lcp [F] | Check whether the hero photo or its wrapper starts at `opacity:0` (entrance motion or reveal-on-scroll). If so, LCP is held until the animation reveals it. Render the hero at full opacity on first paint, and defer the globe animation until after LCP. Hero composition stays unchanged (founder lock). | DR-003, DR-020 | Practitioner guidance (mechanism stated by Google; applying it to this site is a Hypothesis until traced) |
| R-65 | Field and lab differ: Core Web Vitals "measured in JavaScript using public APIs may differ from… CrUX". [vitals] | Add RUM with the `web-vitals` library, sent to the site's own analytics endpoint (POPIA-compliant, no personal data). Report p75 by page group monthly. Never claim "fast" from lab data alone. | Q-06 | Practitioner guidance |

### 1.J Research method (GOV.UK moderated usability testing)

| ID | Finding (source) | Requirement for Signal One | Supports | Strength |
|---|---|---|---|---|
| R-66 | Moderated testing: "watch participants try to complete specific tasks… 'think aloud'". Recruit "actual or likely users". Sessions take "30 and 60 minutes", "no more than 6 one-hour sessions a day". Tasks "set a clear goal", "do not give away 'the answer'". Tell participants "you're testing the service, not them". Use "their own data and documents" where possible. Store personal data securely. https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing [F] | `USABILITY_TEST_PROTOCOL.md` runs rounds of 5–6 real or likely buyers (security owner or ops director, facilities manager, finance approver). Tasks: find a suitable radio; work out monthly cost for N radios over 24 months; request a quote (local build with `tests/e2e/mock-intake.mjs`, never production); find who the company is; find support. Pass bar (≥4 of 6 unaided) is a **Hypothesis**. | Q-09 | Practitioner guidance |
| R-67 | Use the GOV.UK question protocol: "know why you're asking every question and only ask… for information you really need". https://design-system.service.gov.uk/patterns/question-pages/ [F] | Each quote field is justified by a named LEOS use in `SITE_INTEGRATION.md`. Unjustified fields are removed (R-34). | Q-03 | Practitioner guidance |
| R-68 | NN/g: "perform a field study with a few customers to discover how your site can best support their internal processes". [b2b-convincing-decision-makers] | Before the second design round, code the real enquiries that reach LEOS (once DR-001 is live) by question type. The top 10 questions must each be answered on-site. | Q-09, DR-001 | Practitioner guidance |

---

## 2. Simulated personas (all Hypothesis, kept separate from evidence)

No real customer was observed. These rows are inputs for test recruitment and task design (R-66), not findings. The supporting evidence column cites only §1 rows.

| Persona | Hypothesised goal and decision role | Hypothesised top questions | What would make them leave (hypothesis) | Supporting evidence |
|---|---|---|---|---|
| Security company owner (often owner-operator; final decider) | Cover new or remote sites without building repeaters. Control monthly cost against contract margins. | What does a radio cost per guard post per month? Does it work at my remote sites? Is this supplier real and will they still be here in 24 months? | No price indication, no phone or address, no proof that PoC works in SA guarding. | R-15, R-09, R-12 |
| Operations or control-room director ("user" / recommender) | Reliable dispatch, GPS, emergency and lone-worker functions, shift-long battery. | Battery per shift, IP and drop rating, SOS, GPS, dispatcher console, swap time when a radio breaks. | Spec-less cards (DR-006), no support route (DR-012). | R-02, R-21, R-23 |
| Procurement officer (gatekeeper; often needs 3 quotes) | A comparable, compliant written quote. | Legal entity, registration and VAT details, quote validity, T&Cs, delivery lead time. Whether B-BBEE status is relevant is **unverified**. | No company details (DR-007, DR-011). | R-09, R-10, R-07 |
| Financial director (approver; chooser) | Predictable cost and low exposure. | Buy vs rent, total over the term, escalation, deposit, damage and loss liability, early termination, VAT. | Hidden or late fees. | R-17, R-15, R-20 |
| Property or facilities manager (estate guards, cleaners, maintenance) | Simple multi-site team communication without security jargon. | How many radios do I need? Is it easy for non-technical staff? Who do I call when one fails? | Security-only language. Hytera itself names "property management" as a PNC360S and P30 Lite sector (R-25), which suggests (Hypothesis) a non-security landing page could be justified by search demand. | R-25, R-09 |
| Google Ads visitor on mobile (any role) | Confirm in seconds that the page matches the ad. | "Radio rental", price basis, how to ask. | Slow hero, CTA below the fold. | R-62, R-45, DR-005 |

---

## 3. Open-source implementation patterns (source read, not READMEs)

All files were read from `raw.githubusercontent.com` at `main` on 2026-11-25. Target stack: Next.js 16 + Tailwind.

| Pattern and file read | What the source actually does | Verdict | Why, for Signal One |
|---|---|---|---|
| **GOV.UK Frontend error summary**: `alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/error-summary/error-summary.mjs` and `…/template.njk` | On init it calls `setFocus($root)`, which adds `tabindex="-1"` temporarily and removes it on blur, unless `disableAutoFocus`. A click on an error link finds the input by hash and scrolls to its **legend or label** (legend if the input is within half a viewport of it). It then calls `input.focus({preventScroll:true})`. The template puts `role="alert"` in a **child** `div`, "to prevent a race condition between the focusing js at the alert". | **Adapt** | Reimplement as a ~40-line React client component: focus on mount after a failed submit; `role="alert"` on an inner element; links `href="#field-id"` with the same label-scrolling behaviour, so the question stays visible above the field. Do not import govuk-frontend (Nunjucks and GOV.UK styling do not fit the brand). |
| **GOV.UK error message**: `…/components/error-message/template.njk` | A `<p class="govuk-error-message">` with a visually hidden "Error:" prefix span before the text. | **Adopt** (pattern) | Cheap and screen-reader-clear. Pair with `aria-describedby` and `aria-invalid` on the input. |
| **GOV.UK panel (confirmation)**: `…/components/panel/template.njk` | Defaults to the `govuk-panel--confirmation` variant: an `h1` title (configurable level) plus body. Action buttons render only for the *interruption* variant. The design-system page warns that links inside the green panel "will not be accessible" without contrast changes. | **Adapt** | Use the structure (H1 "Quote request received", reference in the body, next steps **outside** the coloured panel). Keep interactive elements outside the panel to avoid the contrast trap (R-53). |
| **Primer FormControl**: `primer/react/main/packages/react/src/FormControl/FormControl.tsx`, `_FormControlValidation.tsx`, `internal/components/InputValidation.tsx` | Generates `validationMessageId = ${id}-validationMessage` and `captionId`, and passes `aria-describedby` = validation + caption ids to the input. `required` and `disabled` are owned by FormControl, with dev warnings if set on the input. A radio cannot be individually required; validation shows once per group. The icon is `aria-hidden`, and the text sits in a span with the id. | **Adapt** | Copy the id-wiring contract (one source of truth for label, hint and error ids; group-level errors for radio sets like Buy/Rent) into the existing `EquipmentQuoteForm` field renderer. Do not adopt Primer itself (different design system and dependency weight). |
| **Carbon Notification**: `carbon-design-system/carbon/main/packages/react/src/components/Notification/Notification.tsx` | `InlineNotification` and `ToastNotification` default to `role="status"` and allow `alert`/`log`. `ActionableNotification` defaults to `role="alertdialog"` and wraps focus; its prop doc says moving focus "must always be true" for alertdialog. | **Adopt the role rules; reject toasts for form outcomes** | Success and failure of a quote submission must not be a transient toast. Use an in-page status region (`role="status"`) for the result and `alert` only for blocking errors. This matches R-28. |
| **Radix Dialog + FocusScope**: `radix-ui/primitives/main/packages/react/dialog/src/dialog.tsx`, `…/focus-scope/src/focus-scope.tsx` | Modal by default. `hideOthers()` aria-hides everything except the content ("better supported equivalent to setting aria-modal"). `RemoveScroll` locks the page. FocusScope focuses the first tabbable element on mount (links excluded) and **returns focus to the previously focused element** on unmount. `loop`/`trapped` wrap Tab. It warns on multiple titles. | **Adopt** (if a dialog or menu is ever needed) | Correct, maintained focus management. The site's mobile menu already returns focus on Escape (J10). Any new dialog (e.g. a spec comparison overlay) should use Radix rather than hand-rolled code. |
| **shadcn/ui dialog**: `shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/dialog.tsx` | A thin Tailwind wrapper on Radix. The close button has `sr-only` "Close", `focus:ring-2` (note: `:focus`, not `:focus-visible`) and `opacity-70` at rest. It has no padding, so the hit area equals the 16 px icon (`size-4`). | **Adapt** | Take the Radix wiring, but change it to `focus-visible:` rings, raise rest-state contrast (R-53), and give the close control ≥24 px (ideally 44 px) per R-59. Today it passes 2.5.8 only through the corner spacing exception. |
| **vercel-labs/web-interface-guidelines**: `…/main/README.md` (guidelines file) | Includes: "Prefer `:focus-visible`"; sticky elements "never cover" focused content; hit targets ≥24 px, "On mobile… 44px"; `<input>` font ≥16 px; "Don't pre-disable submit"; "Error placement… on submit, focus the first error"; "Keep submit enabled until submission starts… include an idempotency key"; "Announce async updates" via polite aria-live; "Prefer APCA"; an optional `maximum-scale=1` viewport. | **Adopt most; reject 2 items** | Adopt: focus-visible, input ≥16 px, keep submit enabled, idempotency key (already done), aria-live status. **Reject** `maximum-scale=1` (blocks zoom; conflicts with WCAG 1.4.4) and APCA as the pass/fail test (R-56). **Resolve** "focus the first error" vs GOV.UK "focus the error summary" in favour of the summary on forms with more than 3 fields (it lists all problems at once). |

---

## 4. New requirements without an existing defect (Q-xx)

| ID | Requirement (testable) | From | Owner or dependency |
|---|---|---|---|
| Q-01 | A representative price (scenario table or range, excl. VAT) on radio and rental pages, **or** an explicit statement of the price drivers plus the quote turnaround time. No "Pricing" label without a figure. | R-15, R-16, R-18, R-19, R-20 | **BLOCKED** on founder-approved figures. None may be invented. |
| Q-02 | Shareable, printable summary per radio and per quote (print CSS; copyable HTML spec table; optional one-page PDF). | R-01, R-04 | Site |
| Q-03 | Form validation rebuild: `noValidate`; error summary (focus, linked, title prefix "Error: "); inline messages with `aria-describedby` and `aria-invalid`; validate on submit, then live-clear corrected fields; specific messages; tolerant phone parsing; field audit against LEOS needs. | R-29 to R-36, R-38, R-53, R-67 | Site |
| Q-04 | Confirmation shows a reference, **when** Signal One will reply (founder-set), a saveable record, and a reload-safe URL with no personal data. Any future online contract acceptance has a review-and-confirm step. | R-28, R-37 | Site + founder (reply-time promise) |
| Q-05 | The quote form renders and submits without client JavaScript (today the Suspense fallback is "Loading the quotation form…", because `useSearchParams` gates the form). Server action or plain POST fallback. | R-27; GOV.UK progressive enhancement (Hypothesis on impact) | Site |
| Q-06 | RUM for LCP, INP and CLS (`web-vitals`), p75 by page group, no personal data. | R-65 | Site + analytics endpoint |
| Q-07 | Help mechanisms (phone, WhatsApp, support link) appear in the same relative order on every page set, including the guard and careers headers. | R-11 | After DR-007 and DR-012 facts |
| Q-08 | A per-SKU spec source log (URL or datasheet, date, regional variant) and model-name verification against supplier invoices: PNC360S (no "5G" claim), P30 Lite (EU page exists; SA variant to confirm), E600 (Caltta candidate, unconfirmed). | R-25, §0.3 | Founder or supplier |
| Q-09 | Moderated usability rounds (5–6 participants, GOV.UK method), scored on task success and time. Enquiry coding once LEOS intake is live. | R-50, R-66, R-68 | Founder (recruitment) |
| Q-10 | Proof policy: only real, consenting, attributable customers. Manufacturer case studies linked as such. Counts sourced and kept in one place. | R-10, R-12, R-13 | Founder |
| Q-11 | Coverage claims are tied to the mobile network ("works where the selected network has signal"), with an optional site-address coverage check only if Signal One will actually perform it. | R-05; Hytera "over 2G/3G/4G and WLAN" (R-25) | Founder (service decision) |
| Q-12 | A compatibility block per radio: networks and bands relevant to SA, SIM type, PTT platform, DMR interworking, 1GUARD integration status (with a truth label). | R-05 | Founder (HyTalk vs POCSTARS decision, DR-016) |
| Q-13 | Specs in HTML tables, with the PDF as secondary. Never PDF-only. | R-22, R-26 | Site |
| Q-14 | `scroll-padding-top` for sticky headers; no overlay covers focused fields; tested at 390 px and 200% zoom. | R-58 | Site |
| Q-15 | Error-message style guide (one specific message per failure type, plain English, positive, with an example of the correct format). | R-32 | Site |
| Q-16 | No gating of specs, datasheets, FAQs or terms. | R-14 | Site |

---

## 5. Benchmarks

### 5.1 Rendered benchmarks (1440×900, headless Chromium, 2026-11-25, read-only)

"First viewport" = text visible in the first 1440×900 screen (from the DOM, then checked against the screenshot).

| Site and URL | What a buyer learns in the first viewport | Product and spec presentation | Quote or rental flow | Trust signals seen | CTA strategy | Lesson for Signal One |
|---|---|---|---|---|---|---|
| **Hytera PoC overview**: https://www.hytera.com/en/product-new/lte-broadband/poc-radios.html [R] | H1 "PoC Radios", "Nationwide Real Time Communications". Category clear in one glance. | 9 model cards (W60 … MNC360). A free PoC whitepaper. Specs on product pages, not cards. | "ENQUIRY" and "Contact Hytera". No `tel:` link on the page. Dealer locator in the utility bar. | Case studies and news sections. Dealer finder. | One header CTA plus a page enquiry. | Category label = product word (R-41). Signal One's advantage over a manufacturer page is price and terms (R-15), which Hytera does not give. |
| **Hytera PNC360S**: https://www.hytera.com/en/product-new/lte-broadband/poc-radio/pnc360s.html [R] | Model name, "PoC Radio", chips "Handheld · LTE/5G · GPS", a one-paragraph description naming sectors (property management, logistics, security, hospitality, supermarkets). | 6 "Highlights" (audio, size, battery, IP67 and MIL-STD-810H, antenna, positioning), then grouped tables (Frequency / General / Environment), accessories, and a change disclaimer. | "GET A QUOTE" (primary, filled) + "EMAIL PRODUCT DETAILS" (secondary, outline). | Manufacturer authority. | Two CTAs: commit vs share-with-colleague. | **Adopt** the "email product details" secondary action as the advocacy pattern (R-04), implemented as a shareable summary (Q-02). **Avoid** the chip/table inconsistency ("5G"). |
| **Hytera P30 Lite (EU)**: https://www.hytera.com/eu/products/poc-radio/p30-lite [R] | H1 "P30 Lite PoC Radio". Positioned for "small and medium-sized enterprises" incl. "security services". | Highlights (TTS alerts, NFC "Smart Patrol", IP54/1.2 m), then 4 spec groups. | "BOOK A DEMO" + "EMAIL PRODUCT DETAILS". | — | Same two-CTA model. | Confirms the model exists (§0.3). "Smart Patrol" via NFC overlaps 1GUARD's patrol story: a **Hypothesis** worth testing as a bundle message, claimable only if verified to work with 1GUARD. |
| **Samsara home**: https://www.samsara.com/ [R] | H1 "OPERATOR GRADE. PROVEN IN THE FIELD." Sub: "Improve safety, lower costs, and transform your operations." | Solution-led sections, not specs. | Header and hero CTA "Check our prices" leads to a qualifier with no price (see the next row). | Named customer outcomes with figures (e.g. "City of El Paso recovers $1.3M… reduces accidents by 29%"; vendor-reported). "Rated No. 1 in Fleet Management… on G2". | One repeated CTA. | Quantified, named outcomes are strong proof, but only usable with real Signal One customers (Q-10). |
| **Samsara pricing**: https://www.samsara.com/pricing [R] | "How many vehicles or assets do you have?" with 5 range buttons, a progress bar at 0%, a disabled "Next", and a testimonial. | — | Multi-step lead qualifier behind a "Pricing" label. | Testimonial (CEO, named utility). | Gate. | **Reject** for Signal One: the label promises a price the page withholds (R-19, R-14). |
| **Verkada home**: https://www.verkada.com/ [R] | First screen is mostly a hero video area (black in this session because the media host was blocked). The H1 "Introducing Verkada Transportation" sits at the bottom edge: a launch announcement, not the core offer. | Product families further down. | "Get demo" (header, filled). 30-day trial: "one device and full access to the Command management platform". | "More than 30,000 organizations worldwide trust Verkada". `tel:` link present. | Demo + trial. | Shows the risk of a media-led first viewport: if media is slow or blocked, the buyer sees nothing (cf. DR-003). |
| **Verkada pricing**: https://www.verkada.com/pricing/ [R] | H1 "Pricing", "Every purchase includes: AI-based analytics, Unlimited users, Automatic updates, 24/7 technical support". | **Published MSRP catalogue** by product line (cameras, access control, intercom…) with dollar prices and licence lines. | "Pricing catalog" + "Get quote". | Transparency itself. | Price first, quote second. | **Adopt** the "what every purchase includes" list (R-17) and the price-then-quote order (Q-01). |
| **Axis W120 body camera (en-ZA)**: https://www.axis.com/en-za/products/axis-w120-body-worn-camera [R] | H1 product name plus 5 benefit bullets (LTE/4G live streaming, location tracking, image, sound, encryption) and a description in the first viewport. | Anchor tabs: Overview / Technical specifications / Compatible products / How to buy / Support. **Specs = PDF datasheet only.** | "Where to buy" → partners. "Contact us". | 5-year warranty offer. Partner network. SA locale. | Route to resellers. | Adopt the anchor tabs and the benefit bullets. Reject PDF-only specs (R-26). |
| **Stripe home**: https://stripe.com/ [R] | H1 one sentence covering what and for whom ("Financial infrastructure to grow your revenue. Accept payments, handle business banking…"). | n/a | "Start now" + "Contact sales". | Logos and scale further down. | Self-serve + sales side by side. | A one-sentence offer H1 with a self-serve and an assisted CTA pair. For Signal One: "Request a quote" + call/WhatsApp (once DR-007 facts exist). |
| **Linear home**: https://linear.app/ [R] | H1 "The product development system for teams and agents" + "Purpose-built for planning and building products." | n/a | "Sign up", "Contact", "Pricing" in the nav. | — | Minimal, two-level hierarchy. | Restraint: one claim, one subline, few accents (R-47). |
| **Motorola Solutions** (WAVE PTX, rental) | **Unreachable: HTTP 403** to curl and headless Chromium. | — | The first-pass excerpt noted a regional rental service page and datasheets [S]. | — | — | Not benchmarked in this pass. |
| **POCSTARS** | **Unreachable: TLS certificate mismatch.** | — | — | — | — | Not benchmarked. |

### 5.2 South African radio and security-technology firms (all **excerpt-only [S]**; hosts not allowed)

| Firm | What the excerpt shows | Price, rental and trust | Lesson |
|---|---|---|---|
| **Satlec**: https://satlec.co.za/products/hytera-p50 , https://satlec.co.za/products/hytera-pnc460 | E-commerce product pages for Hytera PoC radios. "Range: Talk Across South Africa". | P50 listed at R2,795. The PNC460 page shows "R 1.00", which looks like a data-entry placeholder (excerpt). Buy online; no rental seen. | A local seller publishes PoC prices (supports Q-01). Placeholder prices damage credibility (R-08). |
| **Sefeko**: https://www.sefeko.co.za/ , https://www.sefeko.co.za/aboutus/ | Guard-monitoring handset ("Radio simplicity with cellular range. Full-featured Guard Monitoring Module included."), control-room software, SA-made. | Claims "over 500 top South African companies", origins in 2009. Rental terms not found. | The closest local competitor to a **radio + 1GUARD** bundle. Its claims are vendor marketing and unverified. |
| **Sentiv** (Hytera PTToC partner): https://engineeringnews.co.za/article/sentiv-helps-distributed-teams-modernise-field-communications-with-hytera-push-to-talk-over-cellular-2026-07-28 | Trade-press article (July 2026) on bringing Hytera PTToC to security and field-service teams. | Own site not reached. | A direct local competitor for Hytera PoC sales. Its site should be benchmarked once the host is allowed. |
| **Tec Africa**: https://www.tecafrica.co.za/products/smart-ptt-hytera-mnc580-base-vehicle-sim-card-two-way-radio | Product listing for a Hytera MNC580 SIM-card vehicle/base radio. | Not seen. | Another local online seller of Hytera PoC. |
| **Hytera / iMvula (SA reference)**: case-study URL in R-12 [F] | 2,000+ sites, 8,000+ officers, PNC370 on Vodacom. | Distributor: Altron Nexus. | Proof that PoC suits SA guarding. Use only as labelled third-party evidence (R-12). |

Not re-verified this pass (first-pass excerpts only, kept out of requirements): Netstar "from R173/month", Cartrack's cost guide, and the Radio Trunk directory listing.

### 5.3 Screenshots saved (1440×900)

All files are in `/tmp/claude-0/-home-user/880ad5ad-058b-5c40-9bba-4c19903c0d78/scratchpad/ws-d/`. Caveat: Hytera product images and Verkada hero video did not load (CDN hosts blocked), and cookie banners were hidden locally.

| File | Page |
|---|---|
| `bench-hytera-poc-1440.png` | Hytera PoC overview |
| `bench-hytera-pnc360s-1440.png` | Hytera PNC360S product page |
| `bench-hytera-p30lite-eu-1440.png` | Hytera EU P30 Lite product page |
| `bench-samsara-home-1440.png` | Samsara homepage |
| `bench-samsara-pricing-1440.png` | Samsara "pricing" qualifier |
| `bench-verkada-home-1440.png` | Verkada homepage |
| `bench-verkada-pricing-1440.png` | Verkada MSRP pricing |
| `bench-axis-w120-1440.png` | Axis W120 body camera (en-ZA) |
| `bench-stripe-home-1440.png` | Stripe homepage |
| `bench-linear-home-1440.png` | Linear homepage |

---

## 6. Where sources disagree, and the resolution used

| Topic | Source A | Source B | Resolution for Signal One |
|---|---|---|---|
| When to validate | GOV.UK: validate on submit, not on blur; turn off HTML5 validation (R-30) | Baymard and NN/g: inline validation reduces errors; avoid premature validation (R-31) | Submit-time first; then live re-validation of errored fields only. Confirm in testing (Q-09). |
| Where focus goes on error | GOV.UK: the error summary (R-29) | Vercel: the first errored field (§3) | Error summary (the form has more than 3 fields and the summary lists every problem). |
| Pricing on B2B sites | NN/g: show price or typical scenarios (R-15) | Samsara: a qualifier behind a "Pricing" label (R-19) | Follow NN/g and Verkada. Never a "Pricing" label without a figure. |
| Contrast metric | WCAG 2.2 1.4.3 / 1.4.11 (R-52, R-53) | Vercel: prefer APCA (R-56) | WCAG is the gate; APCA is advisory only. |
| Target size | WCAG 2.5.8: 24 px with exceptions (R-59) | Vercel: 44 px on mobile | 24 px conformance floor; 44 px house rule for primary CTAs and nav. |
| Baymard inline-validation statistic | Headline "31% Don't Have It" | Body "32% of sites… fail to provide any field validation" | Cite as "about one third". Do not quote a precise figure. |

---

## 7. Priority order (for planning)

1. **R-27/R-28 → DR-001, Q-04**: server-persisted intake with a receipt, reference, reply time and saveable confirmation.
2. **R-09/R-10/R-11 → DR-007, DR-011, DR-012, Q-07**: founder-verified contact, About and Support, placed consistently.
3. **R-15/R-16/R-17 → Q-01, DR-016**: representative price or range plus "what is included / extra", excl. VAT.
4. **R-21/R-22/R-23/R-25 → DR-006, Q-08, Q-13**: HTML key-specs and grouped tables from verified datasheets; fix the model-name facts (P30 Lite exists; E600 unconfirmed; no "5G").
5. **R-41/R-44/R-45 → DR-002, DR-005, DR-017**: radios in the nav and above the fold, one primary CTA.
6. **R-63/R-64 → DR-003, DR-020**: trace the LCP subparts; remove opacity-0 entrance from the LCP element.
7. **R-29 to R-36 → Q-03, Q-15**: accessible validation with an error summary.
8. **R-58/R-59 → Q-14, DR-024**: focus not obscured; target sizes measured.
9. **R-02/R-04 → Q-02**: advocacy summary for choosers.
10. **R-66 → Q-09**: moderated rounds with real buyers before calling any of the above "proven".

---

## 8. Source register

### 8.1 Fetched directly [F] or rendered [R] (2026-11-25)

**NN/g**
- https://www.nngroup.com/articles/ten-usability-heuristics/
- https://www.nngroup.com/articles/b2b-vs-b2c/
- https://www.nngroup.com/articles/b2b-convincing-decision-makers/
- https://www.nngroup.com/articles/show-price/
- https://www.nngroup.com/articles/show-prices-for-common-scenarios/
- https://www.nngroup.com/articles/b2b-specs/
- https://www.nngroup.com/articles/content-behind-forms/
- https://www.nngroup.com/articles/trustworthy-design/
- https://www.nngroup.com/articles/communicating-trustworthiness/
- https://www.nngroup.com/articles/contact-us-pages/
- https://www.nngroup.com/articles/about-us-information-on-websites/
- https://www.nngroup.com/articles/information-scent/
- https://www.nngroup.com/articles/progressive-disclosure/
- https://www.nngroup.com/articles/fitts-law/
- https://www.nngroup.com/videos/hicks-law-long-menus/
- https://www.nngroup.com/articles/simplicity-vs-choice/
- https://www.nngroup.com/articles/gestalt-proximity/
- https://www.nngroup.com/articles/common-region/
- https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- https://www.nngroup.com/articles/minimize-cognitive-load/
- https://www.nngroup.com/articles/errors-forms-design-guidelines/
- https://www.nngroup.com/articles/error-message-guidelines/
- https://www.nngroup.com/articles/web-form-design/
- https://www.nngroup.com/articles/form-design-placeholders/
- https://www.nngroup.com/articles/legibility-readability-comprehension/
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- https://www.nngroup.com/articles/aesthetic-usability-effect/
- https://www.nngroup.com/articles/ecommerce-taxes-fees/

**Baymard**
- https://baymard.com/blog/spec-sheet-scannability
- https://baymard.com/blog/product-spec-sheet-ux-design
- https://baymard.com/blog/inline-form-validation
- https://baymard.com/blog/adaptive-validation-error-messages
- https://baymard.com/blog/required-optional-form-fields
- https://baymard.com/blog/checkout-flow-average-form-fields
- https://baymard.com/blog/mobile-form-usability-label-position
- https://baymard.com/research/b2b-electronic-components-machinery (summary page only; the guidelines are paywalled)

**W3C**
- https://www.w3.org/TR/WCAG22/ (1.4.3, 1.4.11, 2.4.7, 2.4.11, 2.5.8, 3.2.6, 3.3.1–3.3.8, and the definition of large scale)
- https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html

**Google**
- https://web.dev/articles/vitals
- https://web.dev/articles/lcp
- https://web.dev/articles/optimize-lcp
- https://web.dev/articles/inp
- https://web.dev/articles/cls
- https://web.dev/articles/defining-core-web-vitals-thresholds
- https://developer.chrome.com/docs/performance/insights/lcp-breakdown
- https://developer.chrome.com/docs/devtools/performance/overview

**GOV.UK**
- https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing
- https://www.gov.uk/service-manual/user-research/find-user-research-participants
- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/components/error-message/
- https://design-system.service.gov.uk/components/error-summary/
- https://design-system.service.gov.uk/patterns/validation/
- https://design-system.service.gov.uk/patterns/confirmation-pages/
- https://design-system.service.gov.uk/components/panel/

**Benchmarks:** the URLs in §5.1 plus the Hytera iMvula case study (R-12).

**Source code [Src]** (raw.githubusercontent.com, `main`)
- alphagov/govuk-frontend: error-summary `.mjs` and `.njk`, error-message `.njk`, panel `.njk`, `common/index.mjs` (`setFocus`)
- primer/react: `FormControl.tsx`, `_FormControlValidation.tsx`, `internal/components/InputValidation.tsx`
- carbon-design-system/carbon: `Notification.tsx`
- radix-ui/primitives: `dialog.tsx`, `focus-scope.tsx`
- shadcn-ui/ui: `apps/v4/registry/new-york-v4/ui/dialog.tsx`
- vercel-labs/web-interface-guidelines: `README.md`

**Signal One (read-only, for verification):** `app/components/EquipmentQuoteForm.tsx` (field list, `(optional)` marking, success card with reference, Suspense fallback).

### 8.2 Excerpt only [S], or unreachable

- **Unreachable:** motorolasolutions.com (403); pocstars.com (TLS mismatch).
- **Excerpt only:** satlec.co.za, sefeko.co.za, engineeringnews.co.za (Sentiv), tecafrica.co.za, criticalcommunicationsreview.com (Caltta e600).
- **Not allowed and not used:** gartner.com, psira.co.za, hytera.co.za, netstar.co.za, cartrack.co.za.
- **Needed to finish the SA benchmark directly:** satlec.co.za, www.sefeko.co.za, www.netstar.co.za, www.hytera.co.za, plus Sentiv's own domain (not confirmed by search). A working POCSTARS URL is needed from the founder or supplier.
