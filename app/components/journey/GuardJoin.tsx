"use client";

import IntakeError from "../IntakeError";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check } from "../ui";
import { Consent, JMulti, JRadio, JSelect, JText, ReviewList } from "./fields";
import { useJourney } from "./useJourney";

const ACCENT = "text-field";

const provinces = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
] as const;

const steps = [
  { id: "learn", label: "Start" },
  { id: "profile", label: "Profile" },
  { id: "identity", label: "Contact" },
  { id: "psira", label: "PSiRA" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "areas", label: "Areas" },
  { id: "availability", label: "Availability" },
  { id: "review", label: "Review" },
] as const;

function StepShell({
  title,
  why,
  next,
  children,
}: {
  title: string;
  why: ReactNode;
  next: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <h1 className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">{title}</h1>
      <div className="mt-4 rounded-card bg-field-tint p-4 text-[1.0625rem] leading-relaxed">
        <span className="font-semibold">Why we ask: </span>
        {why}
      </div>
      <div className="mt-8 grid gap-6">{children}</div>
      <p className="t-small mt-8 border-t border-line pt-4 text-text-2">
        <span className="font-semibold text-text">Next: </span>
        {next}
      </p>
    </>
  );
}

export default function GuardJoin() {
  const j = useJourney({
    kind: "guard",
    intent: "guard-profile",
    storageKey: "signal-one-guard-join-v3",
    stepCount: steps.length,
    events: { start: "guard_join_start", complete: "guard_join_complete" },
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
    if (current.id === "experience" && !j.values.siteTypes) {
      setMultiError("Choose at least one type of site.");
      return;
    }
    if (current.id === "skills" && !j.values.skills) {
      setMultiError("Choose at least one skill.");
      return;
    }
    if (current.id === "availability" && !j.values.shifts) {
      setMultiError("Choose at least one shift type.");
      return;
    }
    setMultiError("");
    if (current.id === "review") {
      void j.submit();
      return;
    }
    j.next();
  }

  if (j.status === "done") {
    return (
      <div className="world-guard mx-auto max-w-[720px] px-4 py-12 sm:px-6 md:py-16">
        <div role="status">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-field text-white">
            <Check />
          </span>
          <h1 className="mt-6 font-display text-[2.25rem] font-bold leading-tight tracking-[-0.02em]">
            Thank you. Your profile is with Signal One.
          </h1>
          <p className="mt-4 text-[1.1875rem] leading-relaxed text-text-2">
            Here is what happens today.
          </p>
        </div>
        <ol className="m-0 mt-8 list-none p-0">
          {[
            ["Signal One reviews your profile", "We have saved what you sent and the Signal One team will review it."],
            ["We contact you", "Using the contact details you gave, to confirm your details and PSiRA registration. We cannot say when."],
          ].map(([title, body], index) => (
            <li key={title} className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-line py-5">
              <span className="t-num text-[1.75rem] text-field">{index + 1}</span>
              <div>
                <h2 className="text-[1.1875rem] font-semibold">{title}</h2>
                <p className="mt-1 text-[1.0625rem] text-text-2">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[1.0625rem] text-text-2">
          Guard Marketplace is not live yet. When it launches, signed-in Signal One client companies will be able to find your profile and send you a hire request, which you accept or decline. Your profile is never shown on a public website.
        </p>
        <p className="mt-4 text-[1.0625rem] text-text-2">
          Want something corrected or removed? Email{" "}
          <a href="mailto:sales@signalone.co.za" className="link-inline font-semibold text-field">
            sales@signalone.co.za
          </a>
          .
        </p>
        <Link href="/guards" className="btn btn-field btn-lg mt-8">
          Back to Signal One for guards
        </Link>
      </div>
    );
  }

  return (
    <div className="world-guard mx-auto max-w-[720px] px-4 pb-16 pt-6 sm:px-6 md:pt-10">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4 text-[1rem]">
        <p className="font-semibold">
          Step {j.stepIndex + 1} of {steps.length} · {current.label}
        </p>
        <p className="text-text-2" aria-live="polite">
          {j.hydrated ? "Saved on this phone" : ""}
        </p>
      </div>
      <div
        className="mt-3 grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(" + steps.length + ", minmax(0, 1fr))" }}
        role="progressbar"
        aria-label="Profile progress"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={j.stepIndex + 1}
        aria-valuetext={"Step " + (j.stepIndex + 1) + " of " + steps.length + ", " + current.label}
      >
        {steps.map((step, index) => (
          <span key={step.id} className={"h-2 rounded-full " + (index <= j.stepIndex ? "bg-field" : "bg-line")} />
        ))}
      </div>

      <form onSubmit={onContinue} className="mt-8">
        <div ref={headingRef} tabIndex={-1} key={current.id} className="animate-enter outline-none">
          {current.id === "learn" ? (
            <>
              <h1 className="font-display text-[2.25rem] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[2.75rem]">
                Create your guard profile
              </h1>
              <p className="mt-4 text-[1.1875rem] leading-relaxed text-text-2">
                About 5 minutes. Your answers are saved on this phone, so you can stop and come back.
              </p>
              <h2 className="mt-8 text-[1.25rem] font-semibold">Have these ready</h2>
              <ul className="m-0 mt-3 grid list-none gap-3 p-0 text-[1.0625rem]">
                {[
                  "Your PSiRA registration number, grade and expiry date",
                  "A mobile number we can reach you on",
                  "The areas you can travel to for work",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-1 text-field" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-card bg-white p-5 ring-1 ring-line">
                <h2 className="text-[1.125rem] font-semibold">Your profile is private</h2>
                <p className="mt-1 text-[1.0625rem] text-text-2">
                  We save your profile and Signal One reviews it. When Guard Marketplace launches, signed-in Signal One client companies will be able to find your profile and send you a hire request, which you accept or decline. Your profile is never shown on a public website.{" "}
                  <Link href="/guards#your-information" className="link-inline text-field">
                    How we use your information
                  </Link>
                </p>
              </div>
            </>
          ) : null}

          {current.id === "profile" ? (
            <StepShell
              title="About you"
              why="Signal One uses this to review your profile and contact you."
              next="How we contact you."
            >
              <JText j={j} name="fullName" label="Full name" required autoComplete="name" />
              <JText j={j} name="preferredName" label="What should we call you?" autoComplete="nickname" />
              <JRadio
                j={j}
                name="role"
                label="What work do you do?"
                required
                accentClass={ACCENT}
                options={["Security officer", "Supervisor", "Control room operator"]}
                columns="sm:grid-cols-1"
              />
            </StepShell>
          ) : null}

          {current.id === "identity" ? (
            <StepShell
              title="How can we reach you?"
              why="Signal One uses this to confirm your details. We use it to contact you."
              next="Your PSiRA registration."
            >
              <JText j={j} name="mobile" label="Mobile number" type="tel" required autoComplete="tel" inputMode="tel" placeholder="e.g. 082 123 4567" />
              <JText j={j} name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
              <JRadio
                j={j}
                name="contactPreference"
                label="Best way to contact you"
                required
                accentClass={ACCENT}
                options={["WhatsApp", "SMS", "Phone call", "Email"]}
              />
              <p className="t-small text-text-2">
                We do not ask for your ID number on this form. If we need to see documents, we will ask you directly.
              </p>
            </StepShell>
          ) : null}

          {current.id === "psira" ? (
            <StepShell
              title="Your PSiRA registration"
              why={
                <>
                  A company can only put you on a site if your PSiRA registration is valid. In Signal One, a missing or
                  expired registration blocks the assignment, and your grade decides which posts you can work.
                </>
              }
              next="Your experience."
            >
              <JText j={j} name="psiraNumber" label="PSiRA registration number" required inputMode="numeric" autoComplete="off" />
              <JRadio
                j={j}
                name="psiraGrade"
                label="PSiRA grade"
                required
                accentClass={ACCENT}
                options={["Grade A", "Grade B", "Grade C", "Grade D", "Grade E"]}
                columns="grid-cols-2 sm:grid-cols-3"
              />
              <JText j={j} name="psiraExpiry" label="Expiry date" type="month" required hint="Month and year, as shown on your registration." />
              <p className="t-small text-text-2">
                Signal One records these details as you give them. We do not check them with PSiRA, so please make sure
                they are correct.
              </p>
            </StepShell>
          ) : null}

          {current.id === "experience" ? (
            <StepShell
              title="Your experience"
              why="This helps Signal One review your profile."
              next="Your skills."
            >
              <JRadio
                j={j}
                name="experienceYears"
                label="Years working in security"
                required
                accentClass={ACCENT}
                options={["Less than 1 year", "1 to 2 years", "3 to 5 years", "6 to 10 years", "More than 10 years"]}
              />
              <JMulti
                j={j}
                name="siteTypes"
                label="Sites you have worked on"
                hint="Choose all that apply."
                accentClass={ACCENT}
                error={multiError}
                options={[
                  "Office park",
                  "Residential estate",
                  "Shopping centre or retail",
                  "Logistics or warehouse",
                  "Construction",
                  "School or campus",
                  "Hospital or clinic",
                  "Events",
                  "Control room",
                ]}
              />
            </StepShell>
          ) : null}

          {current.id === "skills" ? (
            <StepShell
              title="Your skills"
              why="This helps Signal One review your profile. Skills are one of the things Marketplace is planned to search on."
              next="Where you can work."
            >
              <JMulti
                j={j}
                name="skills"
                label="What can you do?"
                hint="Choose all that apply."
                accentClass={ACCENT}
                error={multiError}
                options={[
                  "Access control",
                  "Patrolling",
                  "CCTV monitoring",
                  "Control room operation",
                  "First aid",
                  "Fire safety",
                  "Reception and visitor management",
                  "Supervising a team",
                  "Driver's licence",
                ]}
              />
            </StepShell>
          ) : null}

          {current.id === "areas" ? (
            <StepShell
              title="Where can you work?"
              why="Where you can work is one of the things Marketplace is planned to search on. Nothing is shown to companies today."
              next="When you can work."
            >
              <JSelect j={j} name="province" label="Province" required options={provinces} />
              <JText j={j} name="areas" label="Areas you can travel to" required placeholder="e.g. Midrand, Tembisa, Kempton Park" />
              <JRadio
                j={j}
                name="transport"
                label="How do you get to work?"
                required
                accentClass={ACCENT}
                options={["Own transport", "Public transport", "Lift or company transport"]}
                columns="sm:grid-cols-1"
              />
            </StepShell>
          ) : null}

          {current.id === "availability" ? (
            <StepShell
              title="When can you work?"
              why="Availability is one of the things Marketplace is planned to search on. You can ask us to update it at any time."
              next="Check your answers and send."
            >
              <JRadio
                j={j}
                name="availability"
                label="When could you start?"
                required
                accentClass={ACCENT}
                options={["Now", "Within 2 weeks", "Within a month", "I am working, but open to offers"]}
              />
              <JMulti
                j={j}
                name="shifts"
                label="Shifts you can work"
                accentClass={ACCENT}
                error={multiError}
                options={["Day shifts", "Night shifts", "Weekends"]}
                columns="sm:grid-cols-3"
              />
            </StepShell>
          ) : null}

          {current.id === "review" ? (
            <>
              <h1 className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">
                Check your answers
              </h1>
              <p className="mt-3 text-[1.0625rem] text-text-2">Tap Edit to change anything.</p>
              <div className="mt-6">
                <ReviewList
                  j={j}
                  accentClass={ACCENT}
                  groups={[
                    { step: 1, title: "About you", fields: [["fullName", "Full name"], ["preferredName", "Call me"], ["role", "Work"]] },
                    { step: 2, title: "Contact", fields: [["mobile", "Mobile"], ["email", "Email"], ["contactPreference", "Contact by"]] },
                    { step: 3, title: "PSiRA", fields: [["psiraNumber", "Number"], ["psiraGrade", "Grade"], ["psiraExpiry", "Expiry"]] },
                    { step: 4, title: "Experience", fields: [["experienceYears", "Years"], ["siteTypes", "Sites"]] },
                    { step: 5, title: "Skills", fields: [["skills", "Skills"]] },
                    { step: 6, title: "Areas", fields: [["province", "Province"], ["areas", "Areas"], ["transport", "Transport"]] },
                    { step: 7, title: "Availability", fields: [["availability", "Start"], ["shifts", "Shifts"]] },
                  ]}
                />
              </div>
              <div className="mt-6 rounded-card bg-white p-5 ring-1 ring-line">
                <Consent j={j}>
                  I agree that Signal One may use this information to assess my profile and contact me, and, when Guard
                  Marketplace launches, let signed-in Signal One client companies find my profile and send me hire requests. I can ask for it to be
                  corrected or deleted at any time.
                </Consent>
              </div>
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
          <button type="submit" disabled={j.status === "sending"} className="btn btn-field btn-lg">
            {current.id === "learn"
              ? "Start my profile"
              : current.id === "review"
                ? j.status === "sending"
                  ? "Sending…"
                  : "Send my profile"
                : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
