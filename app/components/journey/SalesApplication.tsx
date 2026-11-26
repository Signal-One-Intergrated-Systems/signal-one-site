"use client";

import ReceiptReference from "../ReceiptReference";
import { Stepper } from "../ui";
import IntakeError from "../IntakeError";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Consent, JMulti, JRadio, JSelect, JText, JTextarea, multiTarget, ReviewList } from "./fields";
import { validateBeforeSubmit } from "../../lib/formValidation";
import { useJourney } from "./useJourney";

const ACCENT = "text-accent";

const steps = [
  { id: "role", label: "Role" },
  { id: "basics", label: "Basics" },
  { id: "experience", label: "Experience" },
  { id: "cv", label: "CV" },
  { id: "availability", label: "Availability" },
  { id: "interview", label: "Interview" },
  { id: "confirm", label: "Confirm" },
] as const;

const statusStages = [
  ["Application received", "Today"],
  ["Review", "The Signal One team reviews your application."],
  ["CV request", "If shortlisted, we email you to ask for your CV."],
  ["Interview", "We email you interview slots based on your preferences."],
  ["Decision", "We email you the outcome."],
] as const;

export default function SalesApplication({ roleCount }: { roleCount: number | null }) {
  const j = useJourney({
    kind: "sales",
    intent: "sales-representative-application",
    storageKey: "signal-one-sales-application-v3",
    stepCount: steps.length,
    events: { start: "sales_application_start", complete: "sales_application_complete" },
  });
  const [multiError, setMultiError] = useState("");
  const headingRef = useRef<HTMLDivElement>(null);
  const current = steps[j.stepIndex];
  const lastStep = useRef<number | null>(null);

  // Move focus (and the viewport) to the new step's heading whenever the step changes.
  useEffect(() => {
    if (!j.hydrated) return;
    if (lastStep.current !== null && lastStep.current !== j.stepIndex) {
      headingRef.current?.focus();
    }
    lastStep.current = j.stepIndex;
  }, [j.hydrated, j.stepIndex]);

  function onContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = "Choose at least one day.";
    const missing = current.id === "interview" && !j.values.interviewDays;
    setMultiError(missing ? message : "");
    const target = missing ? multiTarget(form, "interviewDays") : null;
    // Every problem on this step at once: inline messages, aria-invalid, and a focused summary (AUDW-04).
    if (!validateBeforeSubmit(form, { extra: target ? [{ field: target, message }] : [], container: headingRef.current ?? form })) return;
    if (current.id === "confirm") {
      void j.submit();
      return;
    }
    j.next();
  }

  if (j.status === "done") {
    return (
      <div role="status" className="rounded-card bg-surface p-6 ring-1 ring-hairline sm:p-10">
        <p className="t-kicker text-accent">Application status</p>
        <h3 className="t-h2 mt-3">Thank you. Your application is in.</h3>
        <ReceiptReference reference={j.reference} />
        <ol className="m-0 mt-8 list-none p-0">
          {statusStages.map(([stage, note], index) => (
            <li key={stage} className="grid grid-cols-[2rem_1fr] gap-4 pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className={
                  "mt-1 grid h-6 w-6 place-items-center rounded-full border-2 " +
                  (index === 0 ? "border-signal bg-signal" : "border-hairline bg-surface")
                }
              />
              <div>
                <p className="font-semibold">
                  {stage}
                  {index === 0 ? <span className="sr-only"> (current stage)</span> : null}
                </p>
                <p className="t-small text-ink-2">{note}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="t-small mt-6 border-t border-hairline pt-4 text-ink-2">
          There is no online status tracker yet. We will contact you by email at each stage.
        </p>
      </div>
    );
  }

  return (
    <div className="world-careers rounded-card bg-surface p-5 ring-1 ring-hairline sm:p-8">
      <div className="flex flex-wrap items-baseline justify-end gap-2">
        <p className="t-small text-ink-2" aria-live="polite">
          {j.hydrated ? "Your answers are saved in this browser" : ""}
        </p>
      </div>
      <div className="mt-2">
        <Stepper steps={steps.map((step) => step.label)} index={j.stepIndex} label="Application steps" />
      </div>

      <form onSubmit={onContinue} noValidate className="mt-8 border-t border-hairline pt-8">
        <div ref={headingRef} tabIndex={-1} key={current.id} className="animate-enter grid gap-6 outline-none">
          {current.id === "role" ? (
            <>
              <h3 className="t-h3">Which role are you applying for?</h3>
              <JRadio
                j={j}
                name="role"
                label="Role"
                required
                error="Choose the role you are applying for."
                accentClass={ACCENT}
                columns="sm:grid-cols-1"
                options={["Sales representative — SME business OS (security focus)"]}
                hint={roleCount ? roleCount + (roleCount === 1 ? " role open now." : " roles open now.") : undefined}
              />
              <JSelect
                j={j}
                name="region"
                label="Where would you sell?"
                required
                error="Choose where you would sell."
                options={["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"]}
              />
            </>
          ) : null}

          {current.id === "basics" ? (
            <>
              <h3 className="t-h3">The basics</h3>
              <JText j={j} name="fullName" label="Full name" required autoComplete="name" error="Enter your full name." />
              <JText j={j} name="email" label="Email" type="email" required autoComplete="email" error="Enter your email address." />
              <JText j={j} name="mobile" label="Mobile number" type="tel" required autoComplete="tel" placeholder="+27" error="Enter your mobile number." />
              <JText j={j} name="city" label="City or town" required autoComplete="address-level2" error="Enter your city or town." />
            </>
          ) : null}

          {current.id === "experience" ? (
            <>
              <h3 className="t-h3">Your experience</h3>
              <JRadio
                j={j}
                name="b2bYears"
                label="Business-to-business sales experience"
                required
                error="Choose how much business-to-business sales experience you have."
                accentClass={ACCENT}
                options={["None yet", "Under 1 year", "1 to 3 years", "3 to 5 years", "More than 5 years"]}
              />
              <JRadio
                j={j}
                name="securityExposure"
                label="Security industry experience"
                required
                error="Choose how much security industry experience you have."
                accentClass={ACCENT}
                options={["None", "Some exposure", "Security sales", "Security operations"]}
              />
              <JTextarea
                j={j}
                name="experienceSummary"
                label="What have you sold, and to whom?"
                required
                error="Tell us what you have sold, and to whom."
                placeholder="A few sentences is enough."
              />
            </>
          ) : null}

          {current.id === "cv" ? (
            <>
              <h3 className="t-h3">Your CV</h3>
              <div className="rounded-card border border-signal-400/40 bg-surface p-5">
                <p className="font-semibold">You do not need to upload anything now.</p>
                <p className="t-small mt-1 text-ink-2">
                  If you are shortlisted, we will email you and ask for your CV. That keeps your documents out of public
                  web forms.
                </p>
              </div>
              <JText j={j} name="profileUrl" label="LinkedIn or online profile" type="url" placeholder="https://" />
              <JRadio
                j={j}
                name="cvReady"
                label="Is your CV up to date?"
                required
                error="Choose whether your CV is up to date."
                accentClass={ACCENT}
                options={["Yes, ready to send", "I will update it if shortlisted"]}
              />
            </>
          ) : null}

          {current.id === "availability" ? (
            <>
              <h3 className="t-h3">When could you start?</h3>
              <JRadio
                j={j}
                name="currentStatus"
                label="Current work"
                required
                error="Choose your current work situation."
                accentClass={ACCENT}
                options={["Employed", "Self-employed", "Between roles", "Studying or graduating"]}
              />
              <JRadio
                j={j}
                name="noticePeriod"
                label="Notice period"
                required
                error="Choose your notice period."
                accentClass={ACCENT}
                options={["Available now", "2 weeks", "1 month", "More than 1 month"]}
              />
            </>
          ) : null}

          {current.id === "interview" ? (
            <>
              <h3 className="t-h3">Interview preferences</h3>
              <p className="t-body text-ink-2">
                We cannot book a slot online yet. Tell us what suits you, and we will email you specific times if you are
                shortlisted.
              </p>
              <JMulti
                j={j}
                name="interviewDays"
                label="Days that suit you"
                accentClass={ACCENT}
                error={multiError}
                columns="grid-cols-2 sm:grid-cols-3"
                options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
              />
              <JRadio
                j={j}
                name="interviewTime"
                label="Time of day"
                required
                error="Choose a time of day for an interview."
                accentClass={ACCENT}
                options={["Morning", "Afternoon", "Either"]}
                columns="sm:grid-cols-3"
              />
              <JRadio
                j={j}
                name="interviewFormat"
                label="Format"
                required
                error="Choose an interview format."
                accentClass={ACCENT}
                options={["Video call", "In person", "Either"]}
                columns="sm:grid-cols-3"
              />
            </>
          ) : null}

          {current.id === "confirm" ? (
            <>
              <h3 className="t-h3">Confirm and send</h3>
              <ReviewList
                j={j}
                accentClass={ACCENT}
                groups={[
                  { step: 0, title: "Role", fields: [["role", "Role"], ["region", "Region"]] },
                  { step: 1, title: "Basics", fields: [["fullName", "Name"], ["email", "Email"], ["mobile", "Mobile"], ["city", "City"]] },
                  {
                    step: 2,
                    title: "Experience",
                    fields: [["b2bYears", "B2B sales"], ["securityExposure", "Security industry"], ["experienceSummary", "Summary"]],
                  },
                  { step: 3, title: "CV", fields: [["profileUrl", "Profile"], ["cvReady", "CV"]] },
                  { step: 4, title: "Availability", fields: [["currentStatus", "Current work"], ["noticePeriod", "Notice"]] },
                  {
                    step: 5,
                    title: "Interview",
                    fields: [["interviewDays", "Days"], ["interviewTime", "Time"], ["interviewFormat", "Format"]],
                  },
                ]}
              />
              <Consent j={j}>
                I agree that Signal One may use this information to assess my application and contact me about it.
              </Consent>
              <div aria-live="polite">{j.status === "error" ? <IntakeError message={j.message} fallback={j.fallback} /> : null}</div>
            </>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {j.stepIndex > 0 ? (
            <button
              type="button"
              onClick={() => {
                setMultiError("");
                j.back();
              }}
              className="btn btn-ghost-light btn-lg"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={j.status === "sending"} className="btn btn-primary btn-lg">
            {current.id === "confirm" ? (j.status === "sending" ? "Sending…" : "Send application") : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
