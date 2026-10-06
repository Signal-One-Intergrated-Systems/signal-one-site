"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { trackEvent, type SignalOneEvent } from "../lib/analytics";

export type IntakeField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  hint?: string;
  autoComplete?: string;
  wide?: boolean;
};

type State = "idle" | "sending" | "done" | "error";

/**
 * Short public intake form. Posts { kind, data } to /api/intake, which
 * forwards to SIGNAL_ONE_INTAKE_URL or answers 503 while that is unset.
 */
export default function IntakeForm({
  kind = "client",
  intent,
  fields,
  submitLabel,
  events,
  consentText,
  successTitle,
  successBody,
}: {
  kind?: "client" | "guard" | "sales";
  intent: string;
  fields: IntakeField[];
  submitLabel: string;
  events: { start?: SignalOneEvent; complete: SignalOneEvent };
  consentText: string;
  successTitle: string;
  successBody: string;
}) {
  const id = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  function update(name: string, value: string) {
    if (!started.current) {
      started.current = true;
      if (events.start) trackEvent(events.start, { intent });
    }
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    if (!consent) {
      setState("error");
      setMessage("Please tick the consent box so we can reply to you.");
      return;
    }
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, data: { ...values, intent } }),
      });
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(body.message || "We could not send this. Please try again.");
      setState("done");
      trackEvent(events.complete, { intent });
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send this. Please try again.");
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="card p-6 sm:p-8">
        <p className="t-kicker text-live">Received</p>
        <h3 className="t-h3 mt-3">{successTitle}</h3>
        <p className="t-body mt-3 text-text-2">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate={false} className="card p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const fieldId = id + "-" + field.name;
          const hintId = field.hint ? fieldId + "-hint" : undefined;
          const wide = field.wide || field.type === "textarea";
          return (
            <div key={field.name} className={"field " + (wide ? "sm:col-span-2" : "")}>
              <label htmlFor={fieldId} className="field-label">
                {field.label}
                {field.required ? null : <span className="font-normal text-text-2"> (optional)</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={fieldId}
                  name={field.name}
                  required={field.required}
                  rows={4}
                  aria-describedby={hintId}
                  value={values[field.name] || ""}
                  onChange={(event) => update(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  className="field-input"
                />
              ) : field.type === "select" ? (
                <select
                  id={fieldId}
                  name={field.name}
                  required={field.required}
                  aria-describedby={hintId}
                  value={values[field.name] || ""}
                  onChange={(event) => update(field.name, event.target.value)}
                  className="field-input"
                >
                  <option value="">Choose one</option>
                  {(field.options || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={fieldId}
                  name={field.name}
                  type={field.type || "text"}
                  required={field.required}
                  autoComplete={field.autoComplete}
                  aria-describedby={hintId}
                  value={values[field.name] || ""}
                  onChange={(event) => update(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  className="field-input"
                />
              )}
              {field.hint ? (
                <p id={hintId} className="field-hint">
                  {field.hint}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <label className="check mt-6">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span className="text-text-2">{consentText}</span>
      </label>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {state === "error" && message ? <p className="field-error mt-4">{message}</p> : null}
      </div>

      <button type="submit" disabled={state === "sending"} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
