import { getProfile, profilePath } from "./profiles.ts";
export const CONNECT_REVIEW_ORIGIN = "https://www.signalone.co.za";
export type VisitorLink = Readonly<{ url: string; profileId: string; distribution: "review-only" }>;
export function resolveVisitorLink(profileId: string, configuredOrigin: string | undefined = CONNECT_REVIEW_ORIGIN): VisitorLink | null {
  if (!getProfile(profileId) || configuredOrigin !== CONNECT_REVIEW_ORIGIN) return null;
  return { url: CONNECT_REVIEW_ORIGIN + profilePath(profileId, "connect"), profileId, distribution: "review-only" };
}
