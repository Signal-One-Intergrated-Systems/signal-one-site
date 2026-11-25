"use client";

import { useEffect, useState } from "react";

/** Tell prospects the truth before they enter the trial-request journey. */
export default function IntakeAvailability({ trial = false }: { trial?: boolean }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/intake/status", { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<{ onlineSubmissionAvailable?: boolean }> : null)
      .then((payload) => { if (active) setAvailable(payload?.onlineSubmissionAvailable === true); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, []);
  if (available !== false) return null;
  return (
    <div role="status" className="mb-7 rounded-card border border-signal-400/40 bg-raised p-5 text-text-inv">
      <p className="font-semibold text-[1.0625rem]">{trial ? "Trial requests" : "Requests"} are currently handled by email.</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-inv-2">
        Complete the questions below to prepare an email with your details, then send it from your email app.
        {trial ? " Your trial does not start automatically." : " Your request is only sent when you send that email."}
      </p>
      <a className="mt-3 inline-flex min-h-12 items-center font-semibold text-signal-300 underline underline-offset-4"
        href={trial ? "mailto:sales@signalone.co.za?subject=Signal%20One%20-%2014%20Day%20Trial%20Request" : "mailto:sales@signalone.co.za"}>
        Email Signal One directly
      </a>
    </div>
  );
}
