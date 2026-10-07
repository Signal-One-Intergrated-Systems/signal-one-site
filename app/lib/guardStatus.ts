/**
 * The single source of truth for the status of Signal One Guard capabilities.
 *
 * Until production exists and a first customer runs on it, every Guard
 * capability is "Pilot". To change Pilot to Live, set GUARD_STATUS=live
 * (read at build time; default pilot). Nothing else needs editing.
 * Beta, MVP in development, Coming soon and By quote are not Guard
 * capabilities and stay as they are.
 */
export type GuardStatusKind = "pilot" | "live";

export const guardStatusKind: GuardStatusKind = process.env.GUARD_STATUS === "live" ? "live" : "pilot";

export const guardIsLive = guardStatusKind === "live";

export const guardStatusLabel = guardIsLive ? "Live" : "Pilot";

/** Shown on pricing, the security solutions page and the home pricing section while in pilot. */
export const guardOnboardingLine = guardIsLive ? null : "Signal One Guard is onboarding its first pilot security companies.";

/** schema.org availability for the Guard offer. */
export const guardAvailability = guardIsLive ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability";
