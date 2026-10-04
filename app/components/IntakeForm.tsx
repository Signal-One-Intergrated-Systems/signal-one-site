"use client";

import { FormEvent, useMemo, useState } from "react";

export type IntakeField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
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
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || state === "sending") return;
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, data: values }),
      });
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(body.message || "We could not send this application.");
      setState("done");
      setMessage(body.message || "Application received.");
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
    <form onSubmit={submit} className="s1-glass rounded-[18px] p-5 md:p-8">
      <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Secure intake</p>
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
        <span>I consent to Signal One processing this information for onboarding, verification and contacting me about this application.</span>
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
