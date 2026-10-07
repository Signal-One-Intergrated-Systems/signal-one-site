import type { StaticImageData } from "next/image";
import fmb920 from "../../public/images/hardware/teltonika-fmb920.webp";
import fmc920 from "../../public/images/hardware/teltonika-fmc920.webp";
import pnc360s from "../../public/images/hardware/hytera-pnc360s.webp";

export type CatalogueProduct = {
  model: string;
  type: string;
  detail: string;
  /** What it does for a security company, one line. */
  role: string;
  manufacturer?: string;
  /** First-party manufacturer image only; provenance in docs/ASSET_PROVENANCE.md. */
  image?: { src: StaticImageData; alt: string };
};

/** Rental catalogue shown on /radios-equipment, the home page and the PTT radio page. Named products only; no prices. */
export const catalogue: ReadonlyArray<{
  category: string;
  id: string;
  lead: string;
  products: ReadonlyArray<CatalogueProduct>;
  terms: string;
}> = [
  {
    category: "Radios and PTT",
    id: "radios",
    lead: "Push-to-talk over the cellular network, so a supervisor in Midrand can reach a guard in Pretoria without repeaters.",
    products: [
      {
        model: "Hytera PNC360S",
        type: "PoC radio",
        detail: "Rental. Device with push-to-talk service and data.",
        role: "Talk to every guard on a contract over the cellular network.",
        manufacturer: "Hytera",
        image: { src: pnc360s, alt: "Hytera PNC360S mini PoC radio, front view" },
      },
      { model: "P30 Lite PoC", type: "PoC radio with SOS", detail: "Rental. Communications, SOS, SIM, data and platform access.", role: "Push-to-talk with an SOS button for patrol officers." },
      { model: "E600 PoC LTE", type: "PoC LTE radio", detail: "Available by quote.", role: "PoC over LTE for sites with 4G coverage." },
      { model: "PTT platform + SIM & data", type: "Service", detail: "Monthly platform access with SIM and data for supported radios.", role: "The talk groups, SIM and data behind the radios." },
    ],
    terms: "Radio rental terms: 12, 24 or 36 months.",
  },
  {
    category: "Vehicle and asset tracking",
    id: "tracking",
    lead: "Trackers for response vehicles, supervisor cars and high-value assets, with the tracking platform quoted per device.",
    products: [
      {
        model: "FMC920",
        type: "Vehicle tracker, 2G/4G",
        detail: "For deployments that need 4G coverage.",
        role: "Know where response vehicles and supervisor cars are.",
        manufacturer: "Teltonika",
        image: { src: fmc920, alt: "Teltonika FMC920 vehicle tracker, side view" },
      },
      {
        model: "FMB920",
        type: "Vehicle tracker, 2G",
        detail: "Where the 2G network profile suits the area.",
        role: "Vehicle and asset tracking on the 2G network.",
        manufacturer: "Teltonika",
        image: { src: fmb920, alt: "Teltonika FMB920 vehicle tracker, side view" },
      },
    ],
    terms: "Device, installation and platform confirmed per deployment.",
  },
  {
    category: "Body cameras",
    id: "bodycams",
    lead: "Recorded evidence for patrols, access points and events, where a client contract asks for it.",
    products: [{ model: "SC780", type: "Body camera", detail: "Rental.", role: "Recorded evidence on patrol, at access points and at events." }],
    terms: "Quoted per deployment.",
  },
];
