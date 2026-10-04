export type MarketplaceMode = "Buy" | "Rent" | "Subscription";

export type MarketplaceOffer = {
  mode: MarketplaceMode;
  priceLabel: string;
};

export type MarketplaceProduct = {
  id: string;
  name: string;
  category: "Radios" | "Connectivity" | "Sensors" | "Platforms";
  description: string;
  image: string;
  imageAlt: string;
  offers: MarketplaceOffer[];
  action: "cart" | "quote";
  badge?: string;
};

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "radio-d11",
    name: "Signal One D11",
    category: "Radios",
    description: "Compact professional PoC radio for hospitality, retail and light security operations.",
    image: "/images/Devices/poc/D11.jpg",
    imageAlt: "Signal One D11 push-to-talk radio",
    offers: [
      { mode: "Buy", priceLabel: "Price on request" },
      { mode: "Rent", priceLabel: "Rental quote" },
    ],
    action: "cart",
    badge: "Compact",
  },
  {
    id: "radio-d12",
    name: "Signal One D12",
    category: "Radios",
    description: "Display-equipped PoC radio with group selection for fleet, logistics and field teams.",
    image: "/images/Devices/poc/D12.jpg",
    imageAlt: "Signal One D12 push-to-talk radio",
    offers: [
      { mode: "Buy", priceLabel: "Price on request" },
      { mode: "Rent", priceLabel: "Rental quote" },
    ],
    action: "cart",
    badge: "Display",
  },
  {
    id: "radio-d21",
    name: "Signal One D21",
    category: "Radios",
    description: "Rugged IP68 PoC radio with high-capacity battery and dedicated SOS control.",
    image: "/images/Devices/poc/D21.jpg",
    imageAlt: "Signal One D21 rugged push-to-talk radio",
    offers: [
      { mode: "Buy", priceLabel: "Price on request" },
      { mode: "Rent", priceLabel: "Rental quote" },
    ],
    action: "cart",
    badge: "Rugged",
  },
  {
    id: "radio-d22",
    name: "Signal One D22",
    category: "Radios",
    description: "Smart Android PoC radio with front and rear cameras for connected field operations.",
    image: "/images/Devices/poc/D22.jpg",
    imageAlt: "Signal One D22 smart push-to-talk radio",
    offers: [
      { mode: "Buy", priceLabel: "Price on request" },
      { mode: "Rent", priceLabel: "Rental quote" },
    ],
    action: "cart",
    badge: "Smart",
  },
  {
    id: "global-iot-sim",
    name: "Signal One Global IoT SIM",
    category: "Connectivity",
    description: "Multi-network IoT connectivity for tracking, field devices and connected equipment.",
    image: "/images/products/sim-card.jpg",
    imageAlt: "Signal One IoT SIM card",
    offers: [{ mode: "Subscription", priceLabel: "Monthly plans · quote" }],
    action: "cart",
    badge: "SIM",
  },
  {
    id: "esim",
    name: "Signal One eSIM",
    category: "Connectivity",
    description: "Remote-provisioned connectivity for supported IoT deployments and managed device fleets.",
    image: "/images/products/esim-platform.jpg",
    imageAlt: "Signal One eSIM connectivity",
    offers: [{ mode: "Subscription", priceLabel: "Subscription quote" }],
    action: "cart",
    badge: "eSIM",
  },
  {
    id: "lorawan-sensors",
    name: "Signal One LoRaWAN Sensors",
    category: "Sensors",
    description: "A growing range of environmental, safety, metering and facility sensors for connected operations.",
    image: "/images/Devices/Lorawan/hero-sensors.jpg",
    imageAlt: "Signal One LoRaWAN sensor range",
    offers: [{ mode: "Buy", priceLabel: "Project pricing" }],
    action: "quote",
    badge: "Range",
  },
  {
    id: "smoke-detector",
    name: "Signal One Smart Smoke Detector",
    category: "Sensors",
    description: "Wireless photoelectric smoke detection with remote status and low-battery monitoring.",
    image: "/images/products/smoke-detector.jpg",
    imageAlt: "Signal One smart smoke detector",
    offers: [{ mode: "Buy", priceLabel: "Price on request" }],
    action: "cart",
  },
  {
    id: "energy-meter",
    name: "Signal One IoT Energy Meter",
    category: "Sensors",
    description: "DIN-rail energy monitoring for connected utility and industrial power-management projects.",
    image: "/images/products/smart-meter.jpg",
    imageAlt: "Signal One IoT energy meter",
    offers: [{ mode: "Buy", priceLabel: "Price on request" }],
    action: "cart",
  },
  {
    id: "critical-connect",
    name: "Signal One Critical Connect",
    category: "Platforms",
    description: "Managed push-to-talk communications for distributed teams using compatible Signal One devices.",
    image: "/images/platform/dispatch.jpg",
    imageAlt: "Signal One communications control platform",
    offers: [{ mode: "Subscription", priceLabel: "Service quote" }],
    action: "quote",
    badge: "Platform",
  },
];
