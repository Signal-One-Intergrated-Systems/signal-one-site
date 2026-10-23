# Signal Connect — Andisiwe founder MVP (2026-10-23)

## Scope
The flagship public QR path is `https://signalone.co.za/connect/andisiwe`, which resolves through the Next.js route to the immersive, standalone page at `/connect/andisiwe.html`.

The presenter's Home Screen URL is:
`https://signalone.co.za/connect/andisiwe.html?presenter=1`

The QR in the presenter page points to the **visitor** URL without the presenter flag.

The story is WIN → HIRE → RUN → EQUIP → PROVE. It uses existing site photography for people and real, licensed manufacturer photography for the Hytera PNC360S device. These are illustrative operational scenes, not claims that the photographed individuals work for Signal One. The equipment manufacturer art remains unmodified.

## What works
- Founder presentation screen with permanent QR and approved Signal One branding.
- Visitor introduction, photographic five-part story, opt-out/skip and service-interest selection.
- Founder contact export as a vCard with *Founder* and only the verified public company email.
- Client-side validation and consent, public `/api/intake` submission when a receiver is configured.
- On HTTP error or network failure, visitor is explicitly told **nothing was saved** and offered a composed mailto to `sales@signalone.co.za`. No false thank-you state.
- A visitor can save Andisiwe's contact without being forced to submit a lead.

## Not ready / caveats
- The website intake relay exists, but `SIGNAL_ONE_INTAKE_URL` and `SIGNAL_ONE_INTAKE_TOKEN` require an authenticated backend receiver. Do NOT claim that it automatically enters Sales OS until tested.
- The visitor's email app must actually send the fallback email. Merely opening the fallback does not create or record a lead.
- Do not add unapproved private telephone numbers. The vCard contains the founder's identity, approved public business email and web address only.
- The iPhone Home Screen shortcut must be created after an actual public HTTPS deployment. This branch **has not deployed** the page.
- This HTML MVP is an isolated asset to preserve approved design parity; a future React refactor should preserve equivalent UI and behavior.

## Deployment / acceptance
1. Keep this in a feature branch until CI and founder review. Do not merge to production merely to preview.
2. Run `npm ci && npm run qa` using the site's documented Playwright configuration.
3. Open `/connect/andisiwe.html?presenter=1` on an iPhone 17 Pro Max and confirm readable full-screen QR.
4. Scan into `/connect/andisiwe` from a second iOS and an Android phone; verify the visitor—not presenter—view opens.
5. Test story images and all five chapters on 360px and 430px displays.
6. Save the vCard on iOS and Android; validate exact title *Founder*.
7. Verify invalid form errors, privacy consent and contact export independent of submission.
8. With no backend intake URL configured, confirm **503** fallback, **no success message** and the composed email works.
9. With a connected nonproduction intake receiver, prove real accepted submission, deduplication, lead attribution `presenterId=andisiwe`, consent and selected solutions. Verify in Sales OS before making production lead-capture claims.
10. Apply hosting/branding check policy and secure rate limits to the intake receiver before any public launch.

## Product state
Guard is Pilot unless the public config explicitly enables Live. Marketplace remains in development. Radios and hardware are quoted subject to availability. No unsupported live integration or customer figures are claimed.
