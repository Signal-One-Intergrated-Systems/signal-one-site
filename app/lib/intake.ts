import { salesEmail } from "./site";

export type IntakeKind = "client" | "guard" | "sales";

export type IntakeResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fallback: IntakeFallback | null };

export type IntakeFallback = { email: string; href: string };

const subjects: Record<string, string> = {
  consultation: "Consultation request",
  "company-onboarding": "Client onboarding",
  "equipment-rental-quote": "Equipment rental quote",
  "tracking-quote": "Tracking quote",
  "bodycam-rental-quote": "Body camera rental quote",
  "marketplace-interest": "Guard Marketplace interest",
  "guard-profile": "Guard join",
  "sales-representative-application": "Sales application",
};

// Mail clients and some OSes truncate very long mailto: links.
const MAX_BODY_CHARS = 1500;

/** Builds a mailto: link prefilled with the visitor's answers. */
export function buildMailto(data: Record<string, string>, labels: Record<string, string> = {}): IntakeFallback {
  const intent = data.intent || "";
  const subject = "Signal One website: " + (subjects[intent] || intent || "Enquiry");
  const lines = Object.entries(data)
    .filter(([name, value]) => name !== "intent" && value)
    .map(([name, value]) => (labels[name] || name) + ": " + value);
  let body = lines.join("\n");
  if (body.length > MAX_BODY_CHARS) body = body.slice(0, MAX_BODY_CHARS) + "\n[shortened: please add anything missing]";
  const href = "mailto:" + salesEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  return { email: salesEmail, href };
}

/**
 * POSTs to /api/intake. When the form service is unavailable (503 until an
 * upstream is configured, 502, or the network is down) the result carries a
 * mailto: fallback so a form never dead-ends.
 */
export async function submitIntake(
  kind: IntakeKind,
  data: Record<string, string>,
  labels?: Record<string, string>,
): Promise<IntakeResult> {
  const fallback = () => buildMailto(data, labels);
  try {
    const response = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, data }),
    });
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    if (response.ok) return { ok: true, message: body.message || "" };
    const unavailable = response.status >= 500;
    return {
      ok: false,
      message: body.message || "We could not send this. Please try again.",
      fallback: unavailable ? fallback() : null,
    };
  } catch {
    return { ok: false, message: "We could not reach our form service.", fallback: fallback() };
  }
}
