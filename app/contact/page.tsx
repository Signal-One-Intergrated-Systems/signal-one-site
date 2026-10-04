import type { Metadata } from "next";
import IntakeForm, { type IntakeField } from "../components/IntakeForm";

export const metadata: Metadata = {
  title: "Operational review",
  description: "Talk to Signal One about your security operation, sites, control room and service evidence.",
};

const fields: IntakeField[] = [
  { name: "companyName", label: "Security company", required: true, placeholder: "Company name" },
  { name: "contactName", label: "Your name", required: true, placeholder: "Full name" },
  { name: "email", label: "Business email", type: "email", required: true, placeholder: "name@company.co.za" },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
  {
    name: "need",
    label: "What do you need better control of?",
    type: "textarea",
    required: true,
    placeholder: "For example: post coverage, attendance, patrol proof, Control Room visibility, client reporting, devices or a multi-site rollout.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-40 text-white md:pt-48">
      <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[.72fr_1.28fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[var(--s1-accent)]">Operational review</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.045em] md:text-6xl">
            Start with the operation, not a software demo.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/56">
            Tell us where you need stronger visibility or evidence. Signal One can then frame the relevant sites, people, workflows and rollout instead of forcing a generic product conversation.
          </p>

          <div className="mt-10 space-y-5 border-t border-white/[.08] pt-7">
            {[
              ["Coverage & staffing", "Posts, shortfalls, roster and verified presence."],
              ["Patrol & field evidence", "Routes, checkpoints, incidents and offline field work."],
              ["Control & client proof", "SOS, exceptions, occurrence records and service evidence."],
            ].map(([title, body]) => (
              <div key={title}>
                <h2 className="text-sm font-semibold text-white/84">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-white/40">{body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs leading-5 text-white/30">
            Signal One serves South African security operators. Company and rollout details are confirmed directly during onboarding rather than inferred from a public form.
          </p>
        </div>

        <IntakeForm
          kind="client"
          title="Request an operational review"
          intro="Give us enough context to understand the operational problem. This does not create platform access or commit you to a rollout."
          fields={fields}
          submitLabel="Request review"
        />
      </div>
    </main>
  );
}
