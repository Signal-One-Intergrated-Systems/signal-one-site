export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://signalone.co.za").replace(/\/+$/, "");

export const salesEmail = "sales@signalone.co.za";

export const brand = {
  master: "Signal One: Integrated Systems",
  product: "Signal One Security",
} as const;
