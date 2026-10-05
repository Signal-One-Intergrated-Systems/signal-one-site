"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

export type IntakeField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

type Attribution = {
  intent: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  landingPath: string;
  referrer: string;
  quoteConfiguration: string;
};

const emptyAttribution: Attribution = {
  intent: "",
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
  landingPath: "",
  referrer: "",
  quoteConfiguration: "",
};

export default function IntakeForm({
  kind,
  title,
  intro,
  fields,
  submitLabel,
}: {
  kind: "client" | "sales" | "guard";
  title: string;
  intro: string;
  fields: IntakeField[];
  submitLabel: string;
}) {
  const initial = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, ""])),
    [fields],
  );
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [attribution, setAttribution] = useState<Attribution>(emptyAttribution);
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const formStarted = useRef(false);

  function track(event: "lead_form_start" | "lead_form_submit") {
    const payload = JSON.stringify({
      event,
      path: window.location.pathname + window.location.search,
      label: values.intent || attribution.intent || kind,
      referrer: attribution.referrer,
      utmSource: attribution.source,
      utmMedium: attribution.medium,
      utmCampaign: attribution.campaign,
      utmTerm: attribution.term,
      utmContent: attribution.content,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/marketing-event",
        new Blob([payload], { type: "application/json" }),
      );
      return;
    }

    fetch("/api/marketing-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }

  function markFormStarted() {
    if (formStarted.current) return;
    formStarted.current = true;
    track("lead_form_start");
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const intent = params.get("intent") || "";
    const quoteConfiguration = params.get("quote") || "";
    setAttribution({
      intent,
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      term: params.get("utm_term") || "",
      content: params.get("utm_content") || "",
      landingPath: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
      quoteConfiguration,
    });

    if (intent && fields.some((field) => field.name === "intent")) {
      const intentMap: Record<string, string> = {
        demo: "Product demo",
        pricing: "Pricing / commercial proposal",
        pilot: "Pilot / first-site rollout",
        trust: "Trust / procurement / technical review",
      };
      const mapped = intentMap[intent];
      if (mapped) {
        setValues((current) => ({ ...current, intent: mapped }));
      }
    }

    if (quoteConfiguration && fields.some((field) => field.name === "need")) {
      setValues((current) => ({
        ...current,
        need: current.need || "Configured quote request: " + quoteConfiguration,
      }));
    }
  }, [fields]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || state === "sending") return;
    setState("sending");
    setMessage("");

    const enrichedData: Record<string, string> = {
      ...values,
      leadIntent: attribution.intent,
      leadUtmSource: attribution.source,
      leadUtmMedium: attribution.medium,
      leadUtmCampaign: attribution.campaign,
      leadUtmTerm: attribution.term,
      leadUtmContent: attribution.content,
      leadLandingPath: attribution.landingPath,
      leadReferrer: attribution.referrer,
      leadQuoteConfiguration: attribution.quoteConfiguration,
    };

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, data: enrichedData }),
      });
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(body.message || "We could not send this application.");
      setState("done");
      setMessage(body.message || "Application received.");
      track("lead_form_submit");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send this application.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[18px] border border-[#0EA5E9]/25 bg-[#0EA5E9]/[.065] p-8 shadow-[var(--s1-shadow-card)]">
        <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Received</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-4 text-sm leading-6 text-white/62">{message}</p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-[12px] border border-white/12 bg-[#0A0D12]/90 px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-white/26 focus:border-[#0EA5E9]/70 focus:ring-4 focus:ring-[#0EA5E9]/[.08]";

  return (
    <form onSubmit={submit} onFocusCapture={markFormStarted} className="s1-glass rounded-[18px] p-5 md:p-8">
      <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Secure enquiry</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-.025em] text-white">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/54">{intro}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.14em] text-white/42">
              {field.label}
            </span>
            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                rows={5}
                value={values[field.name] || ""}
                onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                className={fieldClass}
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                className={fieldClass}
              >
                <option value="">Select</option>
                {(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                className={fieldClass}
              />
            )}
          </label>
        ))}
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-[12px] border border-white/8 bg-black/15 p-4 text-sm leading-6 text-white/54">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-[#0EA5E9]"
        />
        <span>I consent to Signal One processing this information for responding to this enquiry, onboarding where relevant, and contacting me about Signal One.</span>
      </label>

      {message ? (
        <p role="alert" className={"mt-5 rounded-[12px] border px-4 py-3 text-sm " + (state === "error" ? "border-amber-300/20 bg-amber-300/5 text-amber-100" : "border-white/10 text-white/70")}>
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!consent || state === "sending"}
        className="s1-primary-action mt-6 w-full px-5 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
