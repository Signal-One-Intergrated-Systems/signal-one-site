# Signal Connect V3 — Execution 04A evidence and handover

**Date:** 2026-10-23
**Stage:** 04A — voluntary contact exchange through a user-controlled email draft
**Tested feature commit:** `e4359141ed14d47b951ccbb76f9fb1f4261c7663`
**CI:** https://github.com/Signal-One-Intergrated-Systems/signal-one-site/actions/runs/39986172852 — **SUCCESS**
**Screenshot/report artifact:** `signal-connect-foundation-evidence`, ID `12516245273`
**Vercel staging deployment:** `dpl_2PGGGKYSssK5naZ6PzfzW27FD6gT` — **READY**, target `staging`
**Staging visitor preview:** https://signal-connect-v3-source-preview-8unqki7e3.vercel.app/connect/andisiwe
**Stable public V3 visitor:** https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe — remains on original approved 02D build
**V2:** untouched

## Scope delivered
- `components/ExchangeDetails.tsx`: optional client-side form toggled by a real **Share my details** button. Opening it is voluntary and entirely independent of **Save Andisiwe's contact**, which remains the first and dominant visitor CTA.
- Full name, email OR phone are required. Company, interest and short message are optional. The visitor must check a separate, unambiguous consent checkbox authorising inclusion in the email.
- `lib/exchange.ts`: pure input validation and bounded, URI-encoded `mailto:` constructor addressed only to the known public company inbox. No contact scanning, localStorage, cookies, local lead POST, fake CRM writes or embedded secrets.
- **Prepare email** validates and prepares a user-controlled email composer link but does not automatically launch the email app or send data. The visitor must click **Open email app** then manually choose **Send** in their own mail app. Preparing a mailto URL is not proof of sending/delivery.
- If email app is unavailable or undesirable, **Copy email instead** uses the clipboard; denial/failure exposes a read-only, selectable message. A copy success message explicitly says to paste into an email app — not that an introduction was delivered.
- Closing the form clears name, contact info, notes, consent, prepared link and clipboard status from the component's in-memory state.
- Product interests are allowlisted options: Guard/operations, equipment, partnership, general enquiry.
- No marketing opt-in is displayed in 04A because this is not a durable marketing subscription or database collector; any future 04B opt-in will be separate and default-off.
- No server-side data collection or automated analytics events were added. Only a visitor's deliberate mail-app action can send their details outside the PWA.
- `components/ExchangeDetails.module.css` owns the local form/controls; canonical Inter, Signal Blue, 10px controls and 14px panel, 48px minimum primary actions, solid dark surfaces, visible focus, reduced-motion support.
- Old helper/secondary-card CSS rules were removed instead of accumulating overrides.

## Quality gates
CI run `39986172852` at feature SHA `e4359141` completed:
- npm ci, Node/unit contracts, lint, Next.js production build and TypeScript: PASS
- Playwright Chromium: **62 passed** across presenter, recipient, photo-led gated story and new contact-exchange tests
- New Playwright tests: invalid form, consent, valid mailto, phone-only, malformed emails, clearing data on close, successful/denied clipboard paths, no POST requests, 7 widths (320 to 1440), WCAG AA axe checks
- Existing vCard download, presenter share, image review gating, unknown profiles, QR routes, offline shell and 5 story chapter tests: PASS
- Independently decoded screenshot QR using ZBar to `https://signal-connect-v3-source-preview.vercel.app/connect/andisiwe`: PASS
- Evidence artifact stored: `12516245273`

The first 04A Playwright run passed 61/62 tests but its validation-error selector mistakenly matched Next.js's separate accessibility route-announcer alert. The assertion was corrected to target the form's own error alert; the complete pipeline then passed 62/62, no tests skipped.

## Staging and release boundaries
- Vercel staging build `dpl_2PGGGKYSssK5naZ6PzfzW27FD6gT` reports READY. Source files are exact from tested feature SHA. Stable V3 alias still points to `dpl_71xbMcLpY5bxMW7fNmgyXk3RdWYA`. V2 unchanged.
- Independent Vercel protected-page fetch cannot access the staging deployment because of connected-account permissions. READY and CI do not establish physical iPhone Safari accessibility or final visual sign-off; a reviewer must load the exact staging URL and test the email handoff.
- Stage 04A does **not** create or update Sales OS relationships, send emails, receive delivery acknowledgements, store a consent audit or create a marketing subscription. It is a functional user-controlled manual email exchange.
- Stage 04B remains separately gated by durable receiving backend, server-only credentials, input/consent audit, anti-abuse/idempotency, PII retention rules and an acknowledged end-to-end Sales OS write.
- The five-chapter photo story remains **review-only** and is not linked from the public visitor card. 03A real photography/release rights and genuine Guard report capture remain outstanding.
- Git-connected Vercel deployment pipeline and physical iOS/Android release gates remain STOP. Do not change V2 or printed QR to this staging address.

**Decision:** 04A code and automated acceptance gates GREEN; manual iOS/Android and production backend gates remain outstanding. Proceed to 04B only once verified server-side Sales OS intake and privacy terms exist.
