import { getProfile, profilePath } from "./profiles";

/**
 * Signal Connect URL authority — SC-PLAN-003, Execution 02A.
 *
 * Test origin is deliberately not permanent. Do NOT print this origin on
 * physical QR/NFC products or describe it as the released Signal One domain.
 * Promoting a production origin requires DNS and route validation and a
 * separate reviewed commit adding that exact origin to the allowlist.
 */
const VERIFIED_PREVIEW_ORIGINS = new Set([
  "https://signal-connect-v3-source-preview.vercel.app",
]);

export type VisitorLink = Readonly<{
  url: string;
  profileId: string;
  distribution: "preview-only";
}>;

/**
 * Fail closed. Never accept request headers as the origin. Caller supplies
 * the operator-configured environment value on the server.
 */
export function resolveVisitorLink(
  profileId: string,
  configuredOrigin: string | undefined,
): VisitorLink | null {
  if (!getProfile(profileId) || !configuredOrigin) return null;
  if (configuredOrigin !== configuredOrigin.trim()) return null;

  let parsed: URL;
  try {
    parsed = new URL(configuredOrigin);
  } catch {
    return null;
  }

  if (
    parsed.protocol !== "https:" ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    parsed.pathname !== "/" ||
    parsed.search !== "" ||
    parsed.hash !== "" ||
    !VERIFIED_PREVIEW_ORIGINS.has(parsed.origin)
  ) return null;

  return {
    url: parsed.origin + profilePath(profileId, "connect"),
    profileId,
    distribution: "preview-only",
  };
}
