/**
 * Managed business communications offer: the single public source for the four ways to start, the
 * components a solution can contain, who it serves and the FAQ (founder directive 2026-11-26,
 * "Commercial offer architecture"). Quotation-based: no prices, tariffs, allowances or package
 * contents are published here until the founder approves them. Signal One's customer records are
 * authoritative for inventory and contracts; nothing here is stock or availability.
 */

/** Value sent as `quoteType` with a radio quote. "Buy radios" and "Rent radios" keep their original values. */
export type RadioQuoteType = "Buy radios" | "Rent radios" | "Connect radios I already own" | "Help me choose";
export const radioQuoteTypes: readonly RadioQuoteType[] = ["Buy radios", "Rent radios", "Connect radios I already own", "Help me choose"];

export const quoteHref = (type: RadioQuoteType) => "/radios-equipment?quoteType=" + encodeURIComponent(type) + "#quote";

export const commsJourneys: ReadonlyArray<{ id: string; title: string; summary: string; detail: string; cta: string; quoteType: RadioQuoteType }> = [
  {
    id: "buy-connect",
    title: "Buy & Connect",
    summary: "Own your radios. Choose how they connect.",
    detail: "Buy professional push-to-talk radios and add the connectivity you need: push-to-talk platform, SIM and data, set up for your teams.",
    cta: "Quote to buy",
    quoteType: "Buy radios",
  },
  {
    id: "fleet-rental",
    title: "Managed Fleet Rental",
    summary: "A radio fleet without the upfront cost.",
    detail: "Rent radios on a fixed term instead of buying the whole fleet. The term, quantities and what the rental covers are set out in your written quote.",
    cta: "Quote to rent",
    quoteType: "Rent radios",
  },
  {
    id: "own-radios",
    title: "Already Own Radios",
    summary: "Ask us to assess the radios you have.",
    detail: "Tell us the make and model. We check, device by device, whether managed push-to-talk, SIM and data can support them. Compatibility is never assumed.",
    cta: "Request an assessment",
    quoteType: "Connect radios I already own",
  },
  {
    id: "help-me-choose",
    title: "Help Me Choose",
    summary: "Not sure what you need? Start here.",
    detail: "Tell us about your team, sites and how you work today. We recommend buying, renting or a mix, and what should come with it.",
    cta: "Get a recommendation",
    quoteType: "Help me choose",
  },
];

/** What a communications solution can contain. Each is quoted individually or within an approved package. */
export const commsComponents: ReadonlyArray<readonly [string, string]> = [
  ["Radios", "Professional push-to-talk radios, bought or rented."],
  ["Push-to-talk platform", "The service your radios talk over: users, talk groups and channels."],
  ["SIM and data", "Connectivity for each radio, or use your own SIMs."],
  ["Dispatcher access", "A desk console for a control room or supervisor, where your solution needs one."],
  ["Accessories", "Chargers, earpieces, batteries, clips and carry options."],
  ["Configuration and activation", "Radios set up, talk groups created and services activated before handover."],
  ["Support", "Help for your administrators and users after go-live."],
  ["Maintenance and replacement", "How repairs, damage, loss and replacements are handled."],
];

/** Industries the managed communications offer is positioned for. Use cases only; no coverage or performance guarantees. */
export const commsIndustries: ReadonlyArray<readonly [string, string]> = [
  ["Private security", "Guards, supervisors and the control room on one talk group across every site."],
  ["Property and facilities", "Caretakers, cleaners and maintenance teams across buildings and estates."],
  ["Logistics and transport", "Drivers, depots and dispatch in contact wherever the cellular network reaches."],
  ["Warehousing", "Floor, dock and security teams coordinating shifts and deliveries."],
  ["Construction", "Site managers, foremen and security across multiple sites."],
  ["Hospitality", "Front of house, kitchen, housekeeping and security working as one team."],
  ["Event operations", "Stewards, security and production crews on shared talk groups for planned events."],
  ["Retail and commercial", "Floor staff, loss prevention and management across stores and centres."],
];

export const commsFaq: ReadonlyArray<readonly [string, string]> = [
  ["What can I buy, and what can I rent?", "Push-to-talk radios can be bought or rented; body cameras are rented; vehicle trackers are quoted per deployment. Your quote confirms the exact models, quantities and terms."],
  ["Will the radios I already own work?", "Possibly. Send the make and model and we assess them one by one. We only confirm support for devices we have checked."],
  ["What usually comes with radios?", "Whatever your solution needs: the push-to-talk platform, SIM and data, accessories, configuration and support can each be included or left out. Nothing is included unless your written quote says so."],
  ["Why is there no price list?", "Pricing depends on the radios, quantities, term and services you choose, so every solution is quoted in writing. You decide before anything is supplied."],
  ["What happens after I send a request?", "We confirm what you need and whether it fits your sites, then send a written quote with the term, quantities and price. Detailed company documents are requested only later, through secure customer onboarding, if you go ahead."],
  ["Do radios connect to 1GUARD?", "Not yet. Activating devices and viewing tracking from inside 1GUARD is coming soon. Radios work independently of 1GUARD today."],
];

/**
 * PROPOSED package, NOT published: founder directive 2026-11-26 §3. Shown nowhere until the founder
 * approves its contents, costing, compatibility and supplier arrangements. Never describe an
 * included service as free where its cost is part of the purchase price.
 */
export const proposedPackages = [
  {
    id: "buy-connect-12",
    status: "proposed" as const,
    headline: "One purchase. Twelve months connected.",
    components: ["PoC radio", "12 months push-to-talk platform access", "SIM and data within an approved allowance", "Initial configuration", "Talk-group setup", "Activation", "Renewal options at the end of the period"],
    publish: false,
  },
] as const;
