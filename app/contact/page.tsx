import type { Metadata } from "next";
import Image from "next/image";
import { premiumImages } from "../lib/premiumImages";
import IntakeForm, { type IntakeField } from "../components/IntakeForm";

export const metadata: Metadata = {
  title: "Talk to Signal One",
  description: "Talk to Signal One about Guard, Guard Marketplace, PTT radios, tracking, client proof and your security operation.",
  alternates: { canonical: "/contact" },
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
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[90rem]">
        <section className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12] shadow-[var(--s1-shadow-panel)]">
          <Image
            src={premiumImages.siteOperations}
            alt="Security operations control room"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,13,18,.99)_0%,rgba(10,13,18,.95)_48%,rgba(10,13,18,.72)_100%)]" />
          <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[.78fr_1.22fr] lg:p-12">
            <div className="flex flex-col justify-between py-2">
              <div>
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Operational review</p>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] md:text-6xl">
                  Start with the operation, not a software demo.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
                  Tell us where you need stronger visibility or evidence. Signal One can then frame the relevant sites, people, workflows and rollout instead of forcing a generic product conversation.
                </p>
              </div>

              <div className="mt-10 space-y-5 border-t border-white/10 pt-7">
                {[
                  ["Coverage & staffing", "Posts, shortfalls, roster and verified presence."],
                  ["Patrol & field evidence", "Routes, checkpoints, incidents and offline field work."],
                  ["Control & client proof", "SOS, exceptions, occurrence records and service evidence."],
                ].map(([title, body]) => (
                  <div key={title}>
                    <h2 className="text-sm font-semibold text-white/86">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-white/44">{body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs leading-5 text-white/32">
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
        </section>
      </div>
    </main>
  );
}
