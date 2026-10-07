/**
 * Env-driven acquisition links (addendum A4). A link renders only when a real
 * URL is configured; nothing here ever falls back to a placeholder.
 *
 *   GUARD_APP_ANDROID_URL  Google Play listing for Signal One Guard (https://play.google.com/...)
 *   GUARD_APP_IOS_URL      App Store listing (https://apps.apple.com/...)
 *
 * Read at build time (the guard pages are static). The Sales OS sign-in link
 * is SALES_OS_URL, read at request time in lib/careers.ts.
 */
function storeUrl(raw: string | undefined, hosts: string[]): string | null {
  const value = (raw || "").trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.includes(url.hostname) ? url.toString() : null;
  } catch {
    return null;
  }
}

export const guardApp = {
  android: storeUrl(process.env.GUARD_APP_ANDROID_URL, ["play.google.com"]),
  ios: storeUrl(process.env.GUARD_APP_IOS_URL, ["apps.apple.com"]),
};

export const guardAppAvailable = Boolean(guardApp.android || guardApp.ios);
