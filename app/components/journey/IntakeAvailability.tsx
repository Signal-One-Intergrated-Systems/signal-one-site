"use client";

import { useEffect, useState } from "react";

type Kind = "client" | "guard" | "sales";

// What each journey sends, in the visitor's words, and the subject its email fallback uses (lib/intake.ts).
const copy: Record<Kind | "trial", { what: string; sent: string; subject: string }> = {
  client: { what: "Requests", sent: "Your request is only sent when you send that email.", subject: "" },
  trial: { what: "Trial requests", sent: "Your trial does not start automatically.", subject: "Signal One - 14 Day Trial Request" },
  guard: { what: "Guard profiles", sent: "Your profile is only sent when you send that email.", subject: "Signal One website: Guard join" },
  sales: { what: "Job applications", sent: "Your application is only sent when you send that email.", subject: "Signal One website: Sales application" },
};

/**
 * Tell visitors the truth before they enter a form. Asks /api/intake/status for THIS journey's kind:
 * the receiver can be connected for sales enquiries while guard and sales applications still go by
 * email (SIGNAL_ONE_INTAKE_KINDS, audit AUDW-02), so a guard must learn that on step 1, not after step 9.
 */
export default function IntakeAvailability({ trial = false, kind = "client" }: { trial?: boolean; kind?: Kind }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/intake/status?kind=" + kind, { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<{ onlineSubmissionAvailable?: boolean }> : null)
      .then((payload) => { if (active) setAvailable(payload?.onlineSubmissionAvailable === true); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, [kind]);
  if (available !== false) return null;
  const text = copy[trial ? "trial" : kind];
  const href = "mailto:sales@signalone.co.za" + (text.subject ? "?subject=" + encodeURIComponent(text.subject) : "");
  return (
    <div role="status" data-intake-availability={kind} className="mb-7 rounded-card border border-signal-400/40 bg-raised p-5 text-text-inv">
      <p className="font-semibold text-[1.0625rem]">{text.what} are currently handled by email.</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-inv-2">
        Complete the questions below to prepare an email with your details, then send it from your email app. {text.sent}
      </p>
      <a className="mt-3 inline-flex min-h-12 items-center font-semibold text-signal-300 underline underline-offset-4" href={href}>
        Email Signal One directly
      </a>
    </div>
  );
}
