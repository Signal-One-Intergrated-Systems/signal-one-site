"use client";

import ReceiptReference from "../ReceiptReference";
import IntakeError from "../IntakeError";
import Link from "next/link";
import { useEffect, useRef, type FormEvent } from "react";
import { Check, Stepper, Steps } from "../ui";
import { Consent, JMulti, JRadio, JSelect, JText, ReviewList } from "./fields";
import { validateBeforeSubmit } from "../../lib/formValidation";
import { useJourney } from "./useJourney";
import { guardDayPricePhrase, minimumPhrase } from "../../lib/pricing";

const ACCENT = "text-accent";

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
    storageKey: "signal-one-client-onboarding-v4",
    stepCount: steps.length,
    events: { start: "client_onboarding_start", complete: "client_onboarding_complete" },
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const lastStep = useRef<number | null>(null);
  const current = steps[j.stepIndex];

  useEffect(() => {
    if (!j.hydrated) return;
    if (lastStep.current !== null && lastStep.current !== j.stepIndex) headingRef.current?.focus();
    lastStep.current = j.stepIndex;
  }, [j.hydrated, j.stepIndex]);

  function onContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Every problem on this step at once: inline messages, aria-invalid, and a focused summary (AUDW-04).
    if (!validateBeforeSubmit(event.currentTarget, { container: stepRef.current ?? event.currentTarget })) return;
    if (current.id === "review") {
      void j.submit();
      return;
    }
    j.next();
  }

  if (j.status === "done") {
    return (
      <div role="status" className="mx-auto max-w-[760px]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-signal text-on-signal">
          <Check />
        </span>
        <h2 className="t-h1 mt-6">Thanks. Your onboarding request is with Signal One.</h2>
        <ReceiptReference reference={j.reference} />
        <p className="t-lead mt-4 text-ink-2">A representative will contact you about your selected products, trial request and account setup. A trial has not started yet.</p>
        <div className="mt-8">
          <Steps
            items={[
              ["We contact you", "By email or phone, to confirm your company details and what you want to start with."],
              ["We confirm the right setup", "Security workspaces, service-business early access or equipment procurement are discussed according to your request."],
              ["Plan and trial terms", "We explain available products, any 1GUARD 14-day trial eligibility, expiry and paid terms before activation. Current Guard public pricing is " + guardDayPricePhrase + ", excl. VAT, minimum " + minimumPhrase + "."],
              ["Access follows confirmation", "Accounts and mobile access are issued only when the relevant product onboarding has been approved."],
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
        <p className="t-kicker text-accent">Company onboarding</p>
        <p className="t-h3 mt-2">Tell us what your company needs.</p>
        <div className="mt-6 hidden lg:block">
          <Stepper steps={steps.map((step) => step.label)} index={j.stepIndex} label="Onboarding steps" />
        </div>
        <p className="t-small mt-6 text-ink-2">
          Takes about three minutes. Eligible security companies can request a 14-day 1GUARD trial. 1Service is in development; equipment is quoted separately. No account or trial starts when you submit.
        </p>
      </aside>

      <form onSubmit={onContinue} noValidate className="card p-5 sm:p-8">
        {/* Below lg the aside sits above the intro copy, so the progress track sits at the top of the form instead. */}
        <div className="mb-6 lg:hidden">
          <Stepper steps={steps.map((step) => step.label)} index={j.stepIndex} label="Onboarding steps" />
        </div>
        <div ref={stepRef} key={current.id} className="animate-enter grid gap-6">
          {current.id === "company" ? (
            <>
              <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Your company
              </h2>
              <JText j={j} name="companyName" label="Company name" required autoComplete="organization" error="Enter your company name." />
              <JRadio j={j} name="businessType" label="Which best describes your operation?" required error="Choose what best describes your operation." accentClass={ACCENT}
                options={["Security services", "Restaurant or hospitality", "Other service business", "Equipment procurement"]} />
              <JText j={j} name="registrationNumber" label="Company registration number" />
              <JSelect
                j={j}
                name="province"
                label="Where do you mainly operate?"
                required
                error="Choose where you mainly operate."
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
              <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Who should we speak to?
              </h2>
              <JText j={j} name="contactName" label="Your name" required autoComplete="name" error="Enter your name." />
              <JRadio
                j={j}
                name="contactRole"
                label="Your role"
                required
                error="Choose your role."
                accentClass={ACCENT}
                options={["Owner or director", "Operations manager", "Control room manager", "Other"]}
              />
              <JText j={j} name="email" label="Work email" type="email" required autoComplete="email" error="Enter your work email address." />
              <JText j={j} name="mobile" label="Mobile number" type="tel" required autoComplete="tel" placeholder="+27" error="Enter your mobile number." />
            </>
          ) : null}

          {current.id === "operation" ? (
            <>
              <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Your operation today
              </h2>
              {j.values.businessType === "Security services" ? (
                <>
                  <JRadio j={j} name="guardCount" label="Roughly how many guards?" required error="Choose roughly how many guards you have." accentClass={ACCENT}
                    options={["Under 25", "25 to 100", "100 to 500", "More than 500"]} />
                  <JRadio j={j} name="siteCount" label="Roughly how many security sites?" required error="Choose roughly how many security sites you have." accentClass={ACCENT}
                    options={["1 to 5", "6 to 20", "21 to 100", "More than 100"]} />
                </>
              ) : (
                <>
                  <JRadio j={j} name="teamSize" label="Roughly how many people work across your operation?" required error="Choose roughly how many people work across your operation." accentClass={ACCENT}
                    options={["1 to 10", "11 to 50", "51 to 200", "More than 200"]} />
                  <JRadio j={j} name="locations" label="How many locations do you operate?" required error="Choose how many locations you operate." accentClass={ACCENT}
                    options={["1", "2 to 5", "6 to 20", "More than 20"]} />
                </>
              )}
              <JMulti
                j={j}
                name="currentTools"
                label="How do you run it today?"
                hint="Choose any that apply."
                accentClass={ACCENT}
                options={j.values.businessType === "Security services"
                  ? ["WhatsApp groups", "Spreadsheets", "Paper OBs", "Phone calls", "Other software"]
                  : ["WhatsApp groups", "Spreadsheets", "POS or booking system", "Phone calls", "Other software"]}
              />
            </>
          ) : null}

          {current.id === "start" ? (
            <>
              <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                What do you want to start with?
              </h2>
              <JMulti
                j={j}
                name="interests"
                label="Choose any that apply"
                accentClass={ACCENT}
                columns="sm:grid-cols-1"
                options={[
                  "1GUARD Security Business OS",
                  "1Service Service Business OS (in development)",
                  "14-day 1GUARD trial request",
                  "Radios, PTT, tracking or body cameras",
                  "Guard hiring marketplace access (subject to launch and eligibility)",
                ]}
              />
              <JRadio
                j={j}
                name="nextStep"
                label="Best next step for you"
                required
                error="Choose the best next step for you."
                accentClass={ACCENT}
                columns="sm:grid-cols-1"
                options={j.values.businessType === "Security services"
                  ? ["Request a 14-day 1GUARD trial (activation subject to confirmation)", "A walkthrough call", "Send me the customer terms first", "Call me to discuss"]
                  : ["Discuss 1Service development and early access", "Request an equipment quotation", "A walkthrough call", "Call me to discuss"]}
              />
            </>
          ) : null}

          {current.id === "review" ? (
            <>
              <h2 ref={headingRef} tabIndex={-1} className="t-h2 outline-none">
                Check and send
              </h2>
              <ReviewList
                j={j}
                accentClass={ACCENT}
                groups={[
                  { step: 0, title: "Company", fields: [["companyName", "Company"], ["businessType", "Operation"], ["registrationNumber", "Registration"], ["province", "Province"]] },
                  { step: 1, title: "You", fields: [["contactName", "Name"], ["contactRole", "Role"], ["email", "Email"], ["mobile", "Mobile"]] },
                  { step: 2, title: "Operation", fields: j.values.businessType === "Security services"
                    ? [["guardCount", "Guards"], ["siteCount", "Sites"], ["currentTools", "Today"]]
                    : [["teamSize", "Team size"], ["locations", "Locations"], ["currentTools", "Today"]] },
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
