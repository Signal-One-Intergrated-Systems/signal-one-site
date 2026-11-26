export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://signalone.co.za").replace(/\/+$/, "");

export const salesEmail = "sales@signalone.co.za";
export const supportEmail = "support@signalone.co.za";

/**
 * Official public contact channels, approved by the founder on 2026-11-26: WhatsApp Business
 * +27 77 484 4280, sales@ for commercial enquiries, support@ for existing customers and technical
 * help. Signal One currently trades as Lancesat Suppliers (Pty) Ltd (internal platform record;
 * publication pending founder approval with the statutory disclosures). Never add a phone line,
 * address, hours, registration or VAT number here until the founder supplies and approves it.
 */
export const contact = {
  email: salesEmail,
  supportEmail,
  whatsappDisplay: "+27 77 484 4280",
  whatsappHref: "https://wa.me/27774844280",
  tradingEntity: "Lancesat Suppliers (Pty) Ltd",
} as const;

export const brand = {
  master: "Signal One: Integrated Systems",
  product: "1GUARD",
} as const;
