"use client";

import IntakeError from "../IntakeError";
import Link from "next/link";
import { useEffect, useRef, type FormEvent } from "react";
import { Check, Steps } from "../ui";
import { Consent, JMulti, JRadio, JSelect, JText, ReviewList } from "./fields";
import { useJourney } from "./useJourney";
import { guardDayPricePhrase, minimumPhrase } from "../../lib/pricing";

const ACCENT = "text-signal-ink";

const steps = [
  { id: "company", label: "Company" },
  { id: "contact", label: "You" },
  { id: "operation", label: "Operation" },
  { id: "start", label: "First step" },
  { id: "review", label: "Send" },
] as const;

export default function ClientOnboarding() {
  const j = useJourney({
    kind: "client",
    intent: "company-onboarding",
    storageKey: "signal-one-client-onboarding-v3",
    stepCount: steps.length,
    events: { start: "client_onboarding_start", complete: "client_onboarding_complete" },
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastStep = useRef<number | null>(null);
  const current = steps[j.stepIndex];

  useEffect(() => {
    if (!j.hydrated) return;
    if (lastStep.current !== null && lastStep.current !== j.stepIndex) headingRef.current?.focus();
    lastStep.current = j.stepIndex;
  }, [j.hydrated, j.stepIndex]);

  function onContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (current.id === "review") {
      void j.submit();
      return;
    }
    j.next();
  }

  if (j.status === "done") {
    return (
      <div role="status" className="mx-auto max-w-[760px]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-signal text-deep">
          <Check />
        </span>
        <h1 className="t-h1 mt-6">Thanks. Your onboarding request is with Signal One.</h1>
        <p className="t-lead mt-4 text-text-2">A representative will contact you to set up your company. Here is what to expect.</p>
        <div className="mt-8">
          <Steps
            items={[
              ["We contact you", "By email or phone, to confirm your company details and what you want to start with."],
              ["We set up your workspace", "Sites, posts and your first users, with you."],
              ["You buy guard days", guardDayPricePhrase + ", excl. VAT, under your customer terms. Minimum " + minimumPhrase + "."],
              ["Your guards start using the app", "On their own phones or an authorised Central Device."],
            ]}
          />
        </div>
        <Link href="/solutions/security" className="btn btn-ghost-light btn-lg mt-8">
          Explore the platform while you wait
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <aside className="lg:sticky lg:top-[104px] lg:self-start">
        <p className="t-kicker text-signal-ink">Company onboarding</p>
        <p className="mt-2 font-display text-[1.5rem] font-bold leading-tight">Set up your security company on Signal One.</p>
        <ol className="m-0 mt-6 hidden list-none p-0 lg:block" aria-label="Onboarding steps">
          {steps.map((step, index) => (
            <li
              key={step.id}
              aria-current={index === j.stepIndex ? "step" : undefined}
              className={
                "flex items-center gap-3 border-t border-line py-3 text-[1rem] " +
                (index === j.stepIndex ? "font-semibold text-text" : "text-text-2")
              }
            >
              <span
                className={
                  "grid h-7 w-7 place-items-center rounded-full text-[0.875rem] font-semibold " +
                  (index < j.stepIndex ? "bg-signal text-deep" : index === j.stepIndex ? "bg-base text-text-inv" : "bg-light-2 text-text-2")
                }
              >
                {index < j.stepIndex ? "✓" : index + 1}
              </span>
              {step.label}
            </li>
          ))}
        </ol>
        <p className="t-small mt-6 text-text-2">
          Takes about three minutes. Nothing is charged and no workspace is created until you have spoken to us.
        </p>
      </aside>

      <form onSubmit={onContinue} className="card p-5 sm:p-8">
        <p className="t-small font-semibold text-text-2 lg:hidden">
          Step {j.stepIndex + 1} of {steps.length} · {current.label}
        </p>
        <div key={current.id} className="animate-enter grid gap-6">
          {current.id === "company" ? (
            <>
              <h1 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Your company
              </h1>
              <JText j={j} name="companyName" label="Company name" required autoComplete="organization" />
              <JText j={j} name="registrationNumber" label="Company registration number" />
              <JSelect
                j={j}
                name="province"
                label="Where do you mainly operate?"
                required
                options={[
                  "Gauteng",
                  "Western Cape",
                  "KwaZulu-Natal",
                  "Eastern Cape",
                  "Free State",
                  "Limpopo",
                  "Mpumalanga",
                  "North West",
                  "Northern Cape",
                  "More than one province",
                ]}
              />
            </>
          ) : null}

          {current.id === "contact" ? (
            <>
              <h1 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Who should we speak to?
              </h1>
              <JText j={j} name="contactName" label="Your name" required autoComplete="name" />
              <JRadio
                j={j}
                name="contactRole"
                label="Your role"
                required
                accentClass={ACCENT}
                options={["Owner or director", "Operations manager", "Control room manager", "Other"]}
              />
              <JText j={j} name="email" label="Work email" type="email" required autoComplete="email" />
              <JText j={j} name="mobile" label="Mobile number" type="tel" required autoComplete="tel" placeholder="+27" />
            </>
          ) : null}

          {current.id === "operation" ? (
            <>
              <h1 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Your operation today
              </h1>
              <JRadio
                j={j}
                name="guardCount"
                label="Roughly how many guards?"
                required
                accentClass={ACCENT}
                options={["Under 25", "25 to 100", "100 to 500", "More than 500"]}
              />
              <JRadio
                j={j}
                name="siteCount"
                label="Roughly how many sites?"
                required
                accentClass={ACCENT}
                options={["1 to 5", "6 to 20", "21 to 100", "More than 100"]}
              />
              <JMulti
                j={j}
                name="currentTools"
                label="How do you run it today?"
                hint="Choose any that apply."
                accentClass={ACCENT}
                options={["WhatsApp groups", "Spreadsheets", "Paper OBs", "Phone calls", "Other software"]}
              />
            </>
          ) : null}

          {current.id === "start" ? (
            <>
              <h1 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                What do you want to start with?
              </h1>
              <JMulti
                j={j}
                name="interests"
                label="Choose any that apply"
                accentClass={ACCENT}
                columns="sm:grid-cols-1"
                options={[
                  "Signal One Security platform (guard days)",
                  "Radios, PTT, tracking or body cameras",
                  "Guard Marketplace when it launches",
                ]}
              />
              <JRadio
                j={j}
                name="nextStep"
                label="Best next step for you"
                required
                accentClass={ACCENT}
                columns="sm:grid-cols-1"
                options={["A walkthrough call", "Send me the customer terms first", "Call me to discuss"]}
              />
            </>
          ) : null}

          {current.id === "review" ? (
            <>
              <h1 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Check and send
              </h1>
              <ReviewList
                j={j}
                accentClass={ACCENT}
                groups={[
                  { step: 0, title: "Company", fields: [["companyName", "Company"], ["registrationNumber", "Registration"], ["province", "Province"]] },
                  { step: 1, title: "You", fields: [["contactName", "Name"], ["contactRole", "Role"], ["email", "Email"], ["mobile", "Mobile"]] },
                  { step: 2, title: "Operation", fields: [["guardCount", "Guards"], ["siteCount", "Sites"], ["currentTools", "Today"]] },
                  { step: 3, title: "First step", fields: [["interests", "Interested in"], ["nextStep", "Next step"]] },
                ]}
              />
              <Consent j={j}>I agree that Signal One may use these details to contact me about onboarding my company.</Consent>
              <div aria-live="polite">{j.status === "error" ? <IntakeError message={j.message} fallback={j.fallback} /> : null}</div>
            </>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {j.stepIndex > 0 ? (
            <button type="button" onClick={j.back} className="btn btn-ghost-light btn-lg">
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={j.status === "sending"} className="btn btn-primary btn-lg">
            {current.id === "review" ? (j.status === "sending" ? "Sending…" : "Send to Signal One") : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
