import type { StaticImageData } from "next/image";
import p30Lite from "../../public/images/hardware/hytera-p30-lite.png";
import sc780 from "../../public/images/hardware/hytera-sc780.png";
import fmb920 from "../../public/images/hardware/teltonika-fmb920.webp";
import fmc920 from "../../public/images/hardware/teltonika-fmc920.webp";
import pnc360s from "../../public/images/hardware/hytera-pnc360s.webp";
import e600 from "../../public/images/hardware/easytalk-e600.png";

export type Availability = "in_stock" | "available_for_rental" | "available_to_order" | "by_quote" | "coming_soon";
export const availabilityLabel: Record<Availability, string> = {
  in_stock: "In stock",
  available_for_rental: "Available for rental",
  available_to_order: "Available to order",
  by_quote: "By quote",
  coming_soon: "Coming soon",
};

/** The quote-form option for the E600: interest only, never an order (founder, 2026-11-27). */
export const e600InterestOption = "EasyTalk E600 (coming soon, register interest)";

export type CatalogueProduct = {
  model: string;
  type: string;
  detail: string;
  /** What it does for a security company, one line. */
  role: string;
  manufacturer?: string;
  /** First-party manufacturer image only; provenance in docs/ASSET_PROVENANCE.md. */
  image?: { src: StaticImageData; alt: string; bounds?: string };
  /**
   * Public availability. Only "by_quote" is used until Signal One's customer records (the inventory
   * authority) supply a verified state; the website never holds its own stock figures.
   */
  availability?: Availability;
  /** The quote form's option for this product, when it differs from `model` (SW-03). */
  quoteOption?: string;
  /** Manufacturer specifications, copied only from the official page named in `source` for this exact model. */
  specs?: { source: string; sourceUrl?: string; items: ReadonlyArray<readonly [string, string]> };
};

/**
 * The device's bounding box inside each manufacturer image, as a CSS `object-view-box` inset
 * (measured from the image's alpha channel). Peers are then fitted by the device, not by their
 * differently padded canvases, so radios in identical frames show at the same height (VA-20).
 * Presentation only: the photograph itself is untouched. Browsers without object-view-box fall back
 * to fitting the whole canvas.
 */
export const productBounds = {
  pnc360s: "inset(5.3% 10.2% 5.3% 10.2%)",
  p30Lite: "inset(6.8% 34.3% 6.5% 31.7%)",
  e600: "inset(5.9% 30.8% 5.9% 30.4%)",
} as const;

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
        detail: "Purchase or rental. Push-to-talk service, SIM and data are a separate monthly line.",
        role: "Talk to every guard on a contract over the cellular network.",
        manufacturer: "Hytera",
        image: { src: pnc360s, alt: "Hytera PNC360S mini PoC radio, front view", bounds: productBounds.pnc360s },
        // Hytera South Africa product page, read 2026-11-26.
        specs: { source: "Hytera South Africa", sourceUrl: "https://hytera.co.za/products/pnc360s", items: [
          ["Network", "2G, 3G and 4G push-to-talk over cellular; Wi-Fi and Bluetooth"],
          ["Rugged", "IP67; MIL-STD-810H"],
          ["Battery", "4,000 mAh, detachable"],
          ["Weight", "About 190 g with back clip"],
          ["SIM", "One nano SIM"],
          ["Location", "GPS, BeiDou, GLONASS, Galileo"],
        ] },
      },
      { model: "P30 Lite PoC", manufacturer: "Hytera", image: { src: p30Lite, alt: "Hytera P30 Lite PoC radio, front view — manufacturer image", bounds: productBounds.p30Lite }, type: "PoC radio", detail: "Purchase or rental. Push-to-talk service, SIM and data are a separate monthly line.", role: "Push-to-talk for patrol officers over the cellular network.",
        // Hytera South Africa product page, read 2026-11-26. An SOS function is not confirmed there, so it is not claimed (DR-006).
        specs: { source: "Hytera South Africa", sourceUrl: "https://hytera.co.za/products/p30-lite", items: [
          ["Network", "2G, 3G and 4G push-to-talk over cellular"],
          ["Rugged", "IP54 dust and water protection; 1.2 m drop"],
          ["Battery", "3,300 mAh"],
          ["Weight", "170 g without belt clip"],
          ["SIM", "One nano SIM"],
          ["Location", "GPS optional"],
        ] } },
      // Supplier description "P30G PRO PORTABLE POC BT,GPS" (founder, 2026-11-26): a supplier configuration of the
      // Hytera P30 family. Name only until the exact variant is confirmed: no image (never the P30 Lite's) and no
      // variant-specific specifications.
      { model: "P30G Pro", manufacturer: "Hytera", type: "PoC radio", detail: "Purchase or rental. Specification and availability confirmed in your written quote.", role: "Push-to-talk over the cellular network, from the Hytera P30 family." },
      // Not yet available (founder, 2026-11-27): regulatory approval and procurement are not complete. Shown as a
      // forthcoming product with a non-binding expression of interest; no order, deposit or payment is taken.
      { model: "E600", quoteOption: e600InterestOption, availability: "coming_soon", manufacturer: "EasyTalk", type: "PoC radio, 4G LTE", detail: "Not yet available to buy or rent. Register interest without obligation: no order, deposit or payment is taken.", role: "An affordable push-to-talk radio over 4G, for sites with LTE coverage.",
        image: { src: e600, alt: "EasyTalk E600 push-to-talk over cellular radio, front view — manufacturer image", bounds: productBounds.e600 },
        // EasyTalk E600 brochure and product specification (2024-03-01), supplied by the founder 2026-11-26.
        // Only values both documents agree on, or that one states and the other leaves blank, are listed;
        // the SOS key is marked "reserve" by the manufacturer, so it is not claimed.
        specs: { source: "EasyTalk E600 brochure and product specification", items: [
          ["Network", "4G LTE push-to-talk over cellular; no Wi-Fi or Bluetooth"],
          ["Rugged", "IP68"],
          ["Battery", "3,000 mAh, detachable"],
          ["Weight", "166 g"],
          ["SIM", "Dual micro SIM"],
          ["Location", "GPS"],
        ] } },
      { model: "PTT platform + SIM & data", type: "Service", detail: "Optional monthly service for supported radios. Or use your own SIMs.", role: "The talk groups, SIM and data behind the radios." },
    ],
    terms: "Purchase by quotation. Radio rental terms: 12, 24 or 36 months.",
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
    products: [{ model: "SC780", manufacturer: "Hytera", image: { src: sc780, alt: "Hytera SC780 body camera, front view — manufacturer image" }, type: "Body camera", detail: "Rental.", role: "Recorded evidence on patrol, at access points and at events.",
      // Hytera South Africa product page, read 2026-11-26.
      specs: { source: "Hytera South Africa", sourceUrl: "https://hytera.co.za/products/sc780-smart-4g-body-camera", items: [
        ["Rugged", "IP68; MIL-STD-810H; 1.5 m drop"],
        ["Battery", "3,200 mAh; about 10 hours"],
        ["Storage", "32 GB to 256 GB, by variant"],
        ["Screen", "2.4-inch display; front and rear cameras"],
        ["Weight", "180 g with battery"],
      ] } }],
    terms: "Quoted per deployment.",
  },
];

/**
 * Variants prepared for the catalogue but NOT published (founder directive 2026-11-26 §7). Each needs
 * its exact manufacturer model name, official datasheet and manufacturer photograph, and founder
 * confirmation of supply, before it moves into `catalogue`. Do not merge specifications across
 * P30, P30 Lite, P30 Lite Pro, P30G Pro or GPS/Bluetooth variants. Hytera South Africa had no product
 * page for either name on 2026-11-26 (its "Find a Product" page was returned for every slug tried).
 */
export const pendingVariants: ReadonlyArray<{ model: string; manufacturer: string; blockedOn: string }> = [
  { model: "P30G Pro (image and specifications)", manufacturer: "Hytera", blockedOn: "Listed by name only. Supplier: \"P30G PRO PORTABLE POC BT,GPS\"; Hytera P30 family docs: hytera.co.za/products/p-30. Exact variant to be confirmed before an image or specifications are published" },
];
