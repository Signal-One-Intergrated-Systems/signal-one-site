"use client";

import { useEffect, useState } from "react";

/** Tell prospects the truth before they enter the trial-request journey. */
export default function IntakeAvailability() {
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
    <div role="status" className="mb-7 rounded-card border border-signal-400/40 bg-[#123652] p-5 text-text-inv shadow-lg">
      <p className="font-semibold text-[1.0625rem]">Trial requests are currently handled by email.</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-inv-2">
        Online form delivery is not connected yet. You can complete the questions below, then select the
        prefilled email link to send your request yourself. Your trial does not start automatically.
      </p>
      <a className="mt-3 inline-flex min-h-12 items-center font-semibold text-signal-400 underline underline-offset-4"
        href="mailto:sales@signalone.co.za?subject=Signal%20One%20-%2014%20Day%20Trial%20Request">
        Email Signal One directly
      </a>
    </div>
  );
}
