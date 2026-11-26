"use client";

import { validateBeforeSubmit } from "../lib/formValidation";
import ReceiptReference from "./ReceiptReference";
import { FormEvent, Suspense, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "../lib/analytics";
import { submitIntake, type IntakeFallback, newIdempotencyState } from "../lib/intake";
import ConsentFields from "./ConsentFields";
import IntakeError from "./IntakeError";
import { radioQuoteTypes } from "../lib/offers";

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
  /** The sentence shown when a required answer is missing (lib/formValidation.ts, AUDW-05). */
  error?: string;
};

const categories: Record<Category, { label: string; intent: string; summary: string; fields: Field[] }> = {
  radio: {
    label: "Radios and PTT",
    intent: "equipment-rental-quote",
    summary: "PoC radios on the cellular network, with or without SIM, data and the PTT platform.",
    fields: [
      { name: "quoteType", label: "What do you need?", error: "Choose what you need.", type: "select", required: true,
        options: [...radioQuoteTypes], wide: true },
      {
        name: "product",
        label: "Radio",
        error: "Choose a radio, or Not sure yet.",
        type: "select",
        required: true,
        options: ["Hytera PNC360S", "P30 Lite PoC", "EasyTalk E600", "PTT platform + SIM only (I have radios)", "Not sure yet"],
      },
      { name: "quantity", label: "How many radios?", error: "Enter how many radios you need.", type: "number", required: true, placeholder: "e.g. 24" },
      {
        name: "rentalTerm",
        label: "Rental term",
        error: "Choose a rental term.",
        type: "radio",
        required: true,
        options: ["12 months", "24 months", "36 months"],
      },
      {
        name: "pttNeed",
        label: "SIM, data and PTT",
        error: "Choose what you need for SIM, data and PTT.",
        type: "select",
        required: true,
        options: ["Radios with SIM, data and PTT platform", "Radios only, we have SIMs", "PTT platform and SIMs for our own radios", "Not sure, advise us"],
      },
      {
        name: "deployment",
        label: "Where will they be used?",
        error: "Enter where the radios will be used.",
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
        error: "Choose what you want to track.",
        type: "radio",
        required: true,
        options: ["Vehicles", "Assets", "Both"],
      },
      { name: "quantity", label: "How many vehicles or assets?", error: "Enter how many vehicles or assets you want to track.", type: "number", required: true, placeholder: "e.g. 8" },
      {
        name: "product",
        label: "Tracker",
        error: "Choose a tracker, or Not sure.",
        type: "select",
        required: true,
        options: ["FMC920", "FMB920", "Not sure, advise us"],
      },
      { name: "region", label: "Operating region", error: "Enter the region you operate in.", type: "text", required: true, placeholder: "e.g. Gauteng, mostly Tshwane" },
      {
        name: "installation",
        label: "Do you need installation?",
        error: "Choose whether you need installation.",
        type: "radio",
        required: true,
        options: ["Yes", "No", "Not sure"],
      },
      {
        name: "visibility",
        label: "Who needs to see the positions?",
        error: "Choose who needs to see the positions.",
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
      { name: "quantity", label: "How many cameras?", error: "Enter how many cameras you need.", type: "number", required: true, placeholder: "e.g. 10" },
      {
        name: "environment",
        label: "Where will officers wear them?",
        error: "Choose where officers will wear the cameras.",
        type: "select",
        required: true,
        options: ["Patrol", "Access control", "Retail or mall", "Events", "Mixed sites"],
      },
      {
        name: "requirement",
        label: "What do you need the footage for?",
        error: "Tell us what you need the footage for.",
        type: "textarea",
        required: true,
        placeholder: "e.g. a client contract requires recorded incident handling at two retail sites",
        wide: true,
      },
    ],
  },
};

const contactFields: Field[] = [
  { name: "companyName", label: "Company", error: "Enter your company name.", type: "text", required: true },
  { name: "contactName", label: "Your name", error: "Enter your name.", type: "text", required: true },
  { name: "email", label: "Email", error: "Enter your email address.", type: "text", required: true },
  { name: "mobile", label: "Mobile", error: "Enter your mobile number.", type: "text", required: true },
];

export default function EquipmentQuoteForm() {
  return <Suspense fallback={<p role="status">Loading the quotation form…</p>}><SelectedEquipmentForm /></Suspense>;
}

function SelectedEquipmentForm() {
  const params = useSearchParams();
  const requestedCategory = params.get("category");
  const category: Category = requestedCategory === "tracking" || requestedCategory === "bodycam" ? requestedCategory : "radio";
  const product = categories[category].fields.find(field => field.name === "product")?.options?.find(option => option === params.get("product")) || "";
  const quoteType = categories.radio.fields[0].options?.find(option => option === params.get("quoteType")) || "";
  return <QuoteForm key={`${category}:${product}:${quoteType}`} initialCategory={category} initialProduct={product} initialQuoteType={quoteType} />;
}

function QuoteForm({ initialCategory, initialProduct, initialQuoteType }: { initialCategory: Category; initialProduct: string; initialQuoteType: string }) {
  const id = useId();
  const [category, setCategory] = useState<Category>(initialCategory);
  const [values, setValues] = useState<Record<string, string>>({ product: initialProduct, quoteType: initialQuoteType });
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const idempotency = useRef(newIdempotencyState());
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState<IntakeFallback | null>(null);
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const config = categories[category];
  // Rental term only where renting is on the table; radios the customer already owns need no radio choice.
  const ownRadios = values.quoteType === "Connect radios I already own";
  const fields = config.fields
    .filter(field => field.name !== "rentalTerm" || values.quoteType === "Rent radios" || values.quoteType === "Help me choose")
    .filter(field => !(ownRadios && field.name === "product"))
    .map(field => field.name === "rentalTerm" ? { ...field, required: values.quoteType === "Rent radios" } : field)
    .map(field => ownRadios && field.name === "quantity" ? { ...field, label: "How many radios do you have?" } : field)
    .map(field => ownRadios && field.name === "deployment" ? { ...field, label: "Make and model of your radios, and where they are used", placeholder: "e.g. 30 × Hytera PNC360S, 4 sites in Durban" } : field);

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
    // Every problem is shown at once, next to its field and in a summary (lib/formValidation.ts).
    if (!validateBeforeSubmit(event.currentTarget)) return;
    if (state === "sending") return;
    if (!consent) {
      setState("error");
      setMessage("Please tick the consent box so we can prepare your quote.");
      return;
    }
    setState("sending");
    setMessage("");
    setFallback(null);

    const relevant = [...fields, ...contactFields, { name: "notes" } as Field].map((field) => field.name);
    // Use the existing consultation contract for purchases; keep rental integrations compatible.
    const intent = category === "radio" && values.quoteType !== "Rent radios" ? "consultation" : config.intent;
    const data: Record<string, string> = { category: config.label, intent };
    for (const name of relevant) if (values[name]) data[name] = values[name];

    const labels = Object.fromEntries([...fields, ...contactFields].map((field) => [field.name, field.label]));
    const result = await submitIntake("client", data, { labels, marketing, idempotency: idempotency.current });
    if (!result.ok) {
      setState("error");
      setMessage(result.message);
      setFallback(result.fallback);
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }
    setReference(result.receipt.reference);
    setState("done");
    trackEvent("equipment_quote_complete", { category });
  }

  if (state === "done") {
    return (
      <div role="status" className="card p-6 sm:p-8">
        <p className="t-kicker text-live-inv">Quote request received</p>
        <h3 className="t-h3 mt-3">We have your {config.label.toLowerCase()} requirement.</h3>
        <ReceiptReference reference={reference} />
        <p className="t-body mt-3 text-text-inv-2">
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
        {field.required ? null : <span className="font-normal text-text-inv-2"> (optional)</span>}
      </>
    );

    if (field.type === "radio") {
      return (
        <fieldset key={field.name} className={"field m-0 border-0 p-0 " + "sm:col-span-2"} data-error={field.error}>
          <legend className="field-label mb-2">{label}</legend>
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
            {field.options?.map((option) => (
              <label key={option} className="choice text-signal-300">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  required={field.required}
            data-error={field.error}
                  checked={value === option}
                  onChange={() => update(field.name, option)}
                />
                <span className="text-text-inv">{option}</span>
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
            data-error={field.error}
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
            data-error={field.error}
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
            data-error={field.error}
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
    <form onSubmit={submit} noValidate className="card p-5 sm:p-8">
      <fieldset className="m-0 border-0 p-0">
        <legend className="t-h3">What do you need a quote for?</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {(Object.keys(categories) as Category[]).map((key) => (
            <label key={key} className="choice text-signal-300">
              <input
                type="radio"
                name="category"
                value={key}
                checked={category === key}
                onChange={() => {
                  markStarted();
                  setCategory(key);
                  setValues(current => ({ ...current, product: "", quantity: "", rentalTerm: "" }));
                }}
              />
              <span className="text-text-inv">{categories[key].label}</span>
            </label>
          ))}
        </div>
        <p className="t-small mt-3 text-text-inv-2">{config.summary}</p>
      </fieldset>

      <div key={category} className="animate-enter mt-8 grid gap-5 border-t border-line-dark pt-8 sm:grid-cols-2">
        {fields.map(renderField)}
      </div>

      <div className="mt-8 grid gap-5 border-t border-line-dark pt-8 sm:grid-cols-2">
        <p className="t-h4 sm:col-span-2">Where should we send the quote?</p>
        {contactFields.map(renderField)}
        {renderField({ name: "notes", label: "Anything else", type: "textarea", placeholder: "Timing, accessories, site conditions…", wide: true })}
      </div>

      <ConsentFields className="mt-6" consent={consent} onConsent={setConsent} marketing={marketing} onMarketing={setMarketing}>
        I agree that Signal One may use these details to prepare and follow up on this quote.
      </ConsentFields>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {state === "error" ? <IntakeError message={message} fallback={fallback} /> : null}
      </div>

      <button type="submit" disabled={state === "sending"} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
        {state === "sending" ? "Sending…" : "Request a quote"}
      </button>
      <p className="t-caption mt-3 text-text-inv-2">Price, availability and delivery are confirmed in your written quote. Nothing is supplied until you accept it.</p>
    </form>
  );
}
