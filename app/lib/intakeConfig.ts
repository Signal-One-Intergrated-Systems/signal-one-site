/**
 * Server-side intake configuration, read in ONE place so the status answer and the intake route can
 * never disagree (audit AUDW-02). Never import this from a client component: it reads the receiver's
 * URL and token, which must not reach the browser.
 */
export type IntakeKind = "client" | "guard" | "sales";

export const INTAKE_KINDS: ReadonlyArray<IntakeKind> = ["client", "guard", "sales"];

export function isIntakeKind(value: unknown): value is IntakeKind {
  return typeof value === "string" && (INTAKE_KINDS as ReadonlyArray<string>).includes(value);
}

/** The receiver URL and token, each only when set. */
export function intakeReceiver(): { url?: string; token?: string } {
  return { url: process.env.SIGNAL_ONE_INTAKE_URL || undefined, token: process.env.SIGNAL_ONE_INTAKE_TOKEN || undefined };
}

/**
 * Which kinds go to the receiver: SIGNAL_ONE_INTAKE_KINDS, comma-separated, default `client`.
 * Guard and sales applications stay on the email route until the platform has a screen where someone
 * reads them (audit L2-01): an application acknowledged as "received" that nobody can see is worse
 * than an honest email route.
 */
export function enabledIntakeKinds(): ReadonlySet<string> {
  return new Set((process.env.SIGNAL_ONE_INTAKE_KINDS || "client").split(",").map((k) => k.trim()).filter(Boolean));
}

/** True only when a submission of this kind would actually be forwarded: URL, token AND the kind enabled. */
export function onlineSubmissionAvailable(kind: IntakeKind): boolean {
  const { url, token } = intakeReceiver();
  return Boolean(url && token && enabledIntakeKinds().has(kind));
}
