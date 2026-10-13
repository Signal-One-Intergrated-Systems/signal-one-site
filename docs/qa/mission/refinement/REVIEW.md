# Visual refinement of PR #26

**Verdict: keep draft; complete benchmark and asset acceptance remains BLOCKED.** This continues `09ba68f` on the existing mission branch. It addresses the [independent review](https://github.com/Signal-One-Intergrated-Systems/signal-one-site/pull/26#pullrequestreview-5506698239); it does not restart the redesign or approve production release.

## Verified visual changes

The hero now introduces one connected physical → GUARD record → service evidence composition. The officer, phone and checkpoint remain anchored as the adjacent guide changes. The typography spans the introduction rather than competing with a small hardware overlay. Software becomes an immediately visible field guide, with QR/NFC exploration, recorded field descriptions, possible assessment outcomes and scoped-access explanations. No example scan values, customer records, realistic product screen or actual service assessment were invented.

The primary action and homepage navigation lead to this visible workflow. The original modal remains a secondary expanded walkthrough with its five stages, keyboard containment, Escape and focus restoration. The modal's cold-loading state now contains a meaningful three-step outline rather than an otherwise empty panel. Manual inline progression focuses the new explanation heading; stage tabs retain arrow/Home/End keyboard controls.

Desktop keeps the photo beside the guide. Tablet gives it a landscape row so both the officer and checkpoint remain legible. Mobile removes the headline overlay that covered the phone, aligns the stage labels and reserves consistent panel space. These decisions came from actual captures, including a tablet crop defect and 320/360px overflow discovered during refinement.

Equipment selectors now include exact approved manufacturer thumbnails, supplementing the large main image. The thumbnails exposed a grid-order bug on narrow screens; manufacturer labels now span the intended row. A further recording review showed that below-specification arrows made mobile image changes occur outside the viewport. The arrows now sit on the product presentation, and mobile thumbnail selection returns to the chosen image. Reduced motion makes this return immediate. The model-specific quote links, filters and fallback content remain. Unphotographed models remain specifications/enquiry content; hardware breadth is still incomplete.

## Motion review and evidence

The original 19.28-second recording was inspected as an actual local video, including its [frame sequence](before/motion-contact-sheet.jpg). It showed an opening white frame, a sparse modal-loading beat, photo/text scene replacement, rapid scene changes and a rushed jump into equipment. This was not an ATEX observation.

The new raw Chromium recordings preserve navigation/loading and show the inline story before the optional modal. Each has an automatically timestamped companion file:

- [Desktop recording](after/motion-1440.webm) and [interaction timestamps](after/motion-1440-timeline.json).
- [Mobile recording](after/motion-390.webm) and [interaction timestamps](after/motion-390-timeline.json).

The recordings were inspected after capture, including the [desktop frame sequence](after/motion-desktop-contact-sheet.jpg), [mobile frame sequence](after/motion-mobile-contact-sheet.jpg) and [actual recorded mobile tracker frame](after/mobile-tracker-recorded.png). The latter shows both the selected FMC920 image and its model heading while the arrows remain available on the image.

Compare: field → record changes keep the physical image in place; the one-shot connector takes 520ms; record rows arrive over 240ms with 35ms increments; expanded scene motion is 280ms rather than 420ms; equipment arrival is 300ms rather than 480ms. The recordings pause to make these state changes readable and use smooth scrolling with a settling beat, rather than showing rapid locator jumps. Nothing runs as an unsolicited autoplay sequence. Reduced motion keeps manual actions without these transitions.

## Screenshot comparison and critique

| View | Before (`09ba68f`) | Refined |
| --- | --- | --- |
| Desktop hero | [Split hero](before/hero-desktop.png) | [Visible workflow](after/hero-1440.png) |
| Mobile | [Homepage](before/home-390.png) | [Hero](after/hero-390.png), [record](after/record-390.png), [evidence](after/proof-390.png) |
| Tablet | [Homepage](before/home-768.png) | [Landscape field composition](after/hero-768.png) |
| Equipment | Existing large exact-model presentation | [Desktop](after/equipment-1440.png), [mobile](after/equipment-390.png) |

Independent implementation critique: this strengthens product discovery and preserves the physical context during interaction. The first impression now communicates a system connecting field actions to evidence instead of a photograph plus a detached device card. Mobile is deliberately composed rather than a squeezed desktop pair. The visualisations remain editorial and contain more text than genuine product captures would. The limited original photo resolution and absent authentic software assets still constrain the premium result. These limitations must not be represented as resolved by animation or automated scores.

## Outstanding acceptance and recovery

ATEX/public Signal One/preview requests remain blocked through the configured proxy. Current runtime policy is revision 24 with no custom hosts. [Exact environment configuration and recovery](NETWORK_RECOVERY.md), [observed policy](network-policy.json) and [browser attempts](network-attempts.json) identify the blocker. The ATEX draggable card, guided scenario, hardware, scrolling, transitions and depth remain unreviewed. No benchmark parity/superiority is claimed.

Approved synthetic-tenant GUARD capture access, commissioned operational photography, exact P30 Lite/SC780 imagery and E600 manufacturer confirmation remain missing. Real intake delivery, store URLs and founder preview approval remain separate business-readiness gates. The approved identity, pricing and pilot/future status remain unchanged. Production is untouched.

Final regression, state geometry and both Lighthouse methods are recorded in `VERIFICATION.md`. A green suite establishes engineering confidence; it does not close these visual acceptance dependencies.
