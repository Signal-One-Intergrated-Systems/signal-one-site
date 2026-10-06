/** Rental catalogue shown on /radios-equipment and the PTT radio page. Named products only; no prices. */
export const catalogue = [
  {
    category: "Radios and PTT",
    id: "radios",
    lead: "Push-to-talk over the cellular network, so a supervisor in Midrand can reach a guard in Pretoria without repeaters.",
    products: [
      { model: "Hytera PNC360S", type: "PoC radio", detail: "Rental. Device with push-to-talk service and data." },
      { model: "P30 Lite PoC", type: "PoC radio with SOS", detail: "Rental. Communications, SOS, SIM, data and platform access." },
      { model: "E600 PoC LTE", type: "PoC LTE radio", detail: "Available by quote." },
      { model: "PTT platform + SIM & data", type: "Service", detail: "Monthly platform access with SIM and data for supported radios." },
    ],
    terms: "Radio rental terms: 12, 24 or 36 months.",
  },
  {
    category: "Vehicle and asset tracking",
    id: "tracking",
    lead: "Trackers for response vehicles, supervisor cars and high-value assets, with the tracking platform quoted per device.",
    products: [
      { model: "FMC920", type: "Vehicle tracker, 2G/4G", detail: "For deployments that need 4G coverage." },
      { model: "FMB920", type: "Vehicle tracker, 2G", detail: "Where the 2G network profile suits the area." },
    ],
    terms: "Device, installation and platform confirmed per deployment.",
  },
  {
    category: "Body cameras",
    id: "bodycams",
    lead: "Recorded evidence for patrols, access points and events, where a client contract asks for it.",
    products: [{ model: "SC780", type: "Body camera", detail: "Rental." }],
    terms: "Quoted per deployment.",
  },
] as const;
