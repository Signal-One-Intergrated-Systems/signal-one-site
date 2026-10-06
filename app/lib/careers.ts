/**
 * Sales recruitment configuration (server-side env, read at request time).
 *
 *   SALES_RECRUITMENT_STATUS = open | closed   (unset → open)
 *   SALES_OPEN_ROLES        = positive integer (unset → no count shown)
 *   SALES_OS_URL            = https URL of the authenticated Sales OS sign-in
 *                             for existing representatives (unset → placeholder)
 *
 * There is no vacancy-admin backend yet; see docs/WEBSITE_AUDIT.md.
 */
export type CareersConfig = {
  status: "open" | "closed";
  openRoles: number | null;
  salesOsUrl: string | null;
};

export function getCareersConfig(): CareersConfig {
  const rawStatus = (process.env.SALES_RECRUITMENT_STATUS || "").trim().toLowerCase();
  const status = rawStatus === "closed" ? "closed" : "open";

  const parsedRoles = Number.parseInt((process.env.SALES_OPEN_ROLES || "").trim(), 10);
  const openRoles = Number.isFinite(parsedRoles) && parsedRoles > 0 ? parsedRoles : null;

  const rawUrl = (process.env.SALES_OS_URL || "").trim();
  let salesOsUrl: string | null = null;
  if (rawUrl) {
    try {
      const url = new URL(rawUrl);
      if (url.protocol === "https:") salesOsUrl = url.toString();
    } catch {
      salesOsUrl = null;
    }
  }

  return { status, openRoles, salesOsUrl };
}
