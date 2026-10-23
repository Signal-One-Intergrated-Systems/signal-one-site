/**
 * Deliberately closed by default. Story review is permitted in CI or an
 * explicitly configured NON-production preview only. Public Vercel production
 * deployments cannot activate it even when a flag is copied accidentally.
 */
export function isStoryReviewEnabled(
  flag: string | undefined,
  vercelEnv: string | undefined,
): boolean {
  return flag === "enabled" && vercelEnv !== "production";
}
