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
    [fields]
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
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-300">Received</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-4 text-sm leading-6 text-white/65">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[.035] p-5 shadow-2xl md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Secure intake</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">{intro}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <span className="mb-2 block text-xs font-medium uppercase tracking-[.12em] text-white/45">
              {field.label}
            </span>
            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                rows={5}
                value={values[field.name] || ""}
                onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full rounded-2xl border border-white/10 bg-[#080d13] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#39bdf8]/60"
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-[#080d13] px-4 py-3 text-sm text-white outline-none transition focus:border-[#39bdf8]/60"
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
                className="w-full rounded-2xl border border-white/10 bg-[#080d13] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#39bdf8]/60"
              />
            )}
          </label>
        ))}
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm leading-6 text-white/55">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>I consent to Signal One processing this information for onboarding, verification and contacting me about this application.</span>
      </label>

      {message ? (
        <p role="alert" className={`mt-5 rounded-xl border px-4 py-3 text-sm ${state === "error" ? "border-amber-300/20 bg-amber-300/5 text-amber-100" : "border-white/10 text-white/70"}`}>
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!consent || state === "sending"}
        className="mt-6 w-full rounded-2xl bg-[#39bdf8] px-5 py-3.5 text-sm font-semibold text-[#061019] transition hover:bg-[#7dd3fc] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
