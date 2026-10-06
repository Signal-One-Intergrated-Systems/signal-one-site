"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { submitIntake, type IntakeFallback } from "../lib/intake";
import IntakeError from "./IntakeError";

type Category = "radio" | "tracking" | "bodycam";
type State = "idle" | "sending" | "done" | "error";

type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "radio";
  options?: string[];
  required?: boolean;
  hint?: string;
  placeholder?: string;
  wide?: boolean;
};

const categories: Record<Category, { label: string; intent: string; summary: string; fields: Field[] }> = {
  radio: {
    label: "Radios and PTT",
    intent: "equipment-rental-quote",
    summary: "PoC radios on the cellular network, with or without SIM, data and the PTT platform.",
    fields: [
      {
        name: "product",
        label: "Radio",
        type: "select",
        required: true,
        options: ["Hytera PNC360S", "P30 Lite PoC", "E600 PoC LTE", "PTT platform + SIM only (I have radios)", "Not sure yet"],
      },
      { name: "quantity", label: "How many radios?", type: "number", required: true, placeholder: "e.g. 24" },
      {
        name: "rentalTerm",
        label: "Rental term",
        type: "radio",
        required: true,
        options: ["12 months", "24 months", "36 months"],
      },
      {
        name: "pttNeed",
        label: "SIM, data and PTT",
        type: "select",
        required: true,
        options: ["Radios with SIM, data and PTT platform", "Radios only, we have SIMs", "PTT platform and SIMs for our own radios", "Not sure, advise us"],
      },
      {
        name: "deployment",
        label: "Where will they be used?",
        type: "text",
        required: true,
        placeholder: "e.g. 6 sites in Midrand and Centurion",
        wide: true,
      },
    ],
  },
  tracking: {
    label: "Tracking",
    intent: "tracking-quote",
    summary: "Vehicle and asset trackers, scoped to what you need to see and who needs to see it.",
    fields: [
      {
        name: "assetType",
        label: "What do you want to track?",
        type: "radio",
        required: true,
        options: ["Vehicles", "Assets", "Both"],
      },
      { name: "quantity", label: "How many vehicles or assets?", type: "number", required: true, placeholder: "e.g. 8" },
      {
        name: "product",
        label: "Tracker",
        type: "select",
        required: true,
        options: ["FMC920", "FMB920", "Not sure, advise us"],
      },
      { name: "region", label: "Operating region", type: "text", required: true, placeholder: "e.g. Gauteng, mostly Tshwane" },
      {
        name: "installation",
        label: "Do you need installation?",
        type: "radio",
        required: true,
        options: ["Yes", "No", "Not sure"],
      },
      {
        name: "visibility",
        label: "Who needs to see the positions?",
        type: "select",
        required: true,
        options: ["Our control room", "Managers and supervisors", "Control room and managers", "Not sure yet"],
      },
    ],
  },
  bodycam: {
    label: "Body cameras",
    intent: "bodycam-rental-quote",
    summary: "SC780 body-camera rental for officers on patrol, at access points or at events.",
    fields: [
      { name: "quantity", label: "How many cameras?", type: "number", required: true, placeholder: "e.g. 10" },
      {
        name: "environment",
        label: "Where will officers wear them?",
        type: "select",
        required: true,
        options: ["Patrol", "Access control", "Retail or mall", "Events", "Mixed sites"],
      },
      {
        name: "requirement",
        label: "What do you need the footage for?",
        type: "textarea",
        required: true,
        placeholder: "e.g. a client contract requires recorded incident handling at two retail sites",
        wide: true,
      },
    ],
  },
};

const contactFields: Field[] = [
  { name: "companyName", label: "Company", type: "text", required: true },
  { name: "contactName", label: "Your name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "mobile", label: "Mobile", type: "text", required: true },
];

export default function EquipmentQuoteForm() {
  const id = useId();
  const [category, setCategory] = useState<Category>("radio");
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState<IntakeFallback | null>(null);
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const config = categories[category];

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackEvent("equipment_quote_start", { category });
  }

  function update(name: string, value: string) {
    markStarted();
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    if (!consent) {
      setState("error");
      setMessage("Please tick the consent box so we can prepare your quote.");
      return;
    }
    setState("sending");
    setMessage("");
    setFallback(null);

    const relevant = [...config.fields, ...contactFields, { name: "notes" } as Field].map((field) => field.name);
    const data: Record<string, string> = { category: config.label, intent: config.intent };
    for (const name of relevant) if (values[name]) data[name] = values[name];

    const labels = Object.fromEntries([...config.fields, ...contactFields].map((field) => [field.name, field.label]));
    const result = await submitIntake("client", data, labels);
    if (!result.ok) {
      setState("error");
      setMessage(result.message);
      setFallback(result.fallback);
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }
    setState("done");
    trackEvent("equipment_quote_complete", { category });
  }

  if (state === "done") {
    return (
      <div role="status" className="card p-6 sm:p-8">
        <p className="t-kicker text-live">Quote request received</p>
        <h3 className="t-h3 mt-3">We have your {config.label.toLowerCase()} requirement.</h3>
        <p className="t-body mt-3 text-text-2">
          A Signal One representative will confirm the product, availability and terms, then send a written quote by
          email. Nothing is supplied until you accept it.
        </p>
      </div>
    );
  }

  function renderField(field: Field) {
    const fieldId = id + "-" + field.name;
    const value = values[field.name] || "";
    const label = (
      <>
        {field.label}
        {field.required ? null : <span className="font-normal text-text-2"> (optional)</span>}
      </>
    );

    if (field.type === "radio") {
      return (
        <fieldset key={field.name} className={"field m-0 border-0 p-0 " + (field.wide ? "sm:col-span-2" : "sm:col-span-2")}>
          <legend className="field-label mb-2">{label}</legend>
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
            {field.options?.map((option) => (
              <label key={option} className="choice text-signal">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  required={field.required}
                  checked={value === option}
                  onChange={() => update(field.name, option)}
                />
                <span className="text-text">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    return (
      <div key={field.name} className={"field " + (field.wide || field.type === "textarea" ? "sm:col-span-2" : "")}>
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
        {field.type === "select" ? (
          <select
            id={fieldId}
            name={field.name}
            required={field.required}
            value={value}
            onChange={(event) => update(field.name, event.target.value)}
            className="field-input"
          >
            <option value="">Choose one</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            id={fieldId}
            name={field.name}
            required={field.required}
            rows={4}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => update(field.name, event.target.value)}
            className="field-input"
          />
        ) : (
          <input
            id={fieldId}
            name={field.name}
            type={field.type === "number" ? "number" : field.name === "email" ? "email" : field.name === "mobile" ? "tel" : "text"}
            inputMode={field.type === "number" ? "numeric" : undefined}
            min={field.type === "number" ? 1 : undefined}
            autoComplete={
              field.name === "email" ? "email" : field.name === "mobile" ? "tel" : field.name === "contactName" ? "name" : field.name === "companyName" ? "organization" : undefined
            }
            required={field.required}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => update(field.name, event.target.value)}
            className="field-input"
          />
        )}
        {field.hint ? <p className="field-hint">{field.hint}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-5 sm:p-8">
      <fieldset className="m-0 border-0 p-0">
        <legend className="t-h3">What do you need a quote for?</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {(Object.keys(categories) as Category[]).map((key) => (
            <label key={key} className="choice text-signal">
              <input
                type="radio"
                name="category"
                value={key}
                checked={category === key}
                onChange={() => {
                  markStarted();
                  setCategory(key);
                }}
              />
              <span className="text-text">{categories[key].label}</span>
            </label>
          ))}
        </div>
        <p className="t-small mt-3 text-text-2">{config.summary}</p>
      </fieldset>

      <div key={category} className="animate-enter mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-2">
        {config.fields.map(renderField)}
      </div>

      <div className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-2">
        <p className="t-h4 sm:col-span-2">Where should we send the quote?</p>
        {contactFields.map(renderField)}
        {renderField({ name: "notes", label: "Anything else", type: "textarea", placeholder: "Timing, accessories, site conditions…", wide: true })}
      </div>

      <label className="check mt-6">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span className="text-text-2">I agree that Signal One may use these details to prepare and follow up on this quote.</span>
      </label>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {state === "error" ? <IntakeError message={message} fallback={fallback} /> : null}
      </div>

      <button type="submit" disabled={state === "sending"} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
        {state === "sending" ? "Sending…" : "Request a quote"}
      </button>
      <p className="t-caption mt-3 text-text-2">No prices online. We reply with a written quote; nothing is supplied until you accept it.</p>
    </form>
  );
}
