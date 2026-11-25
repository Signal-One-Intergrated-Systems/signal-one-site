export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://signalone.co.za").replace(/\/+$/, "");

export const salesEmail = "sales@signalone.co.za";

/**
 * Public contact channels the founder has already established. Source: the internal platform
 * record (lancesat-enterprise-platform docs/context/PROGRAMMES.md and PLATFORM_CHARTER.md): the
 * WhatsApp Business number is the founder's live client channel, and Signal One currently trades as
 * Lancesat Suppliers (Pty) Ltd. Never add a phone line, address, registration or VAT number here
 * until the founder supplies it.
 */
export const contact = {
  email: salesEmail,
  whatsappDisplay: "+27 60 633 5870",
  whatsappHref: "https://wa.me/27606335870",
  tradingEntity: "Lancesat Suppliers (Pty) Ltd",
} as const;

export const brand = {
  master: "Signal One: Integrated Systems",
  product: "1GUARD",
} as const;
