"use client";

import { useId, type ReactNode } from "react";
import type { Journey } from "./useJourney";

/** Text-like input bound to a journey value. */
export function JText({
  j,
  name,
  label,
  type = "text",
  required = false,
  hint,
  placeholder,
  autoComplete,
  inputMode,
}: {
  j: Journey;
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "month" | "date";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "url";
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {required ? null : <span className="font-normal text-text-2"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={hint ? id + "-hint" : undefined}
        value={j.values[name] || ""}
        onChange={(event) => j.set(name, event.target.value)}
        className="field-input"
      />
      {hint ? (
        <p id={id + "-hint"} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function JTextarea({
  j,
  name,
  label,
  required = false,
  hint,
  placeholder,
}: {
  j: Journey;
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {required ? null : <span className="font-normal text-text-2"> (optional)</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={4}
        placeholder={placeholder}
        aria-describedby={hint ? id + "-hint" : undefined}
        value={j.values[name] || ""}
        onChange={(event) => j.set(name, event.target.value)}
        className="field-input"
      />
      {hint ? (
        <p id={id + "-hint"} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function JSelect({
  j,
  name,
  label,
  options,
  required = false,
  hint,
}: {
  j: Journey;
  name: string;
  label: string;
  options: readonly string[];
  required?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {required ? null : <span className="font-normal text-text-2"> (optional)</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        aria-describedby={hint ? id + "-hint" : undefined}
        value={j.values[name] || ""}
        onChange={(event) => j.set(name, event.target.value)}
        className="field-input"
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={id + "-hint"} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Single choice rendered as large tiles (radio). */
export function JRadio({
  j,
  name,
  label,
  options,
  required = false,
  accentClass,
  columns = "sm:grid-cols-2",
  hint,
}: {
  j: Journey;
  name: string;
  label: string;
  options: readonly string[];
  required?: boolean;
  accentClass: string;
  columns?: string;
  hint?: string;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="field-label mb-1">
        {label}
        {required ? null : <span className="font-normal text-text-2"> (optional)</span>}
      </legend>
      {hint ? <p className="field-hint mb-2">{hint}</p> : <div className="mb-2" />}
      <div className={"grid gap-2 " + columns}>
        {options.map((option) => (
          <label key={option} className={"choice " + accentClass}>
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              checked={j.values[name] === option}
              onChange={() => j.set(name, option)}
            />
            <span className="text-text">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Multiple choice rendered as tiles (checkbox). Validation is done by the step. */
export function JMulti({
  j,
  name,
  label,
  options,
  accentClass,
  hint,
  error,
  columns = "sm:grid-cols-2",
}: {
  j: Journey;
  name: string;
  label: string;
  options: readonly string[];
  accentClass: string;
  hint?: string;
  error?: string;
  columns?: string;
}) {
  return (
    <fieldset className="m-0 border-0 p-0" aria-invalid={error ? true : undefined}>
      <legend className="field-label mb-1">{label}</legend>
      {hint ? <p className="field-hint mb-2">{hint}</p> : <div className="mb-2" />}
      <div className={"grid gap-2 " + columns}>
        {options.map((option) => (
          <label key={option} className={"choice " + accentClass}>
            <input type="checkbox" checked={j.has(name, option)} onChange={() => j.toggle(name, option)} />
            <span className="text-text">{option}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p role="alert" className="field-error mt-2">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function Consent({ j, children }: { j: Journey; children: ReactNode }) {
  return (
    <label className="check">
      <input type="checkbox" checked={j.consent} onChange={(event) => j.setConsent(event.target.checked)} />
      <span className="text-text-2">{children}</span>
    </label>
  );
}

/** Read-only summary of answers, grouped by step, with an edit link per group. */
export function ReviewList({
  j,
  groups,
  accentClass,
}: {
  j: Journey;
  groups: ReadonlyArray<{ step: number; title: string; fields: ReadonlyArray<readonly [string, string]> }>;
  accentClass: string;
}) {
  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <section key={group.title} className="rounded-card bg-white p-5 ring-1 ring-line">
          <div className="flex items-center justify-between gap-4">
            <h3 className="t-h4">{group.title}</h3>
            <button
              type="button"
              onClick={() => j.goTo(group.step)}
              className={"min-h-[44px] px-2 text-[1rem] font-semibold underline underline-offset-4 " + accentClass}
            >
              Edit<span className="sr-only"> {group.title}</span>
            </button>
          </div>
          <dl className="m-0 mt-2 grid gap-2">
            {group.fields.map(([name, label]) => (
              <div key={name} className="grid gap-0.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <dt className="t-small text-text-2">{label}</dt>
                <dd className="m-0 break-words">{j.values[name] || <span className="text-text-2">Not given</span>}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
