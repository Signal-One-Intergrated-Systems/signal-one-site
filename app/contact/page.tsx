import type { Metadata } from "next";
import Image from "next/image";
import IntakeForm, { type IntakeField } from "../components/IntakeForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Book a Signal One product demo, request pricing, discuss a pilot or start a procurement conversation.",
};

const fields: IntakeField[] = [
  { name: "companyName", label: "Security company", required: true, placeholder: "Company name" },
  { name: "contactName", label: "Your name", required: true, placeholder: "Full name" },
  { name: "email", label: "Business email", type: "email", required: true, placeholder: "name@company.co.za" },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
  {
    name: "intent",
    label: "What would you like to do?",
    type: "select",
    required: true,
    options: [
      "Product demo",
      "Pricing / commercial proposal",
      "Pilot / first-site rollout",
      "Trust / procurement / technical review",
      "Devices / connectivity / marketplace",
      "General discussion",
    ],
  },
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
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <section className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12] shadow-[var(--s1-shadow-panel)]">
          <Image
            src="/images/industries/security.jpg"
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
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Live evaluation</p>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] md:text-6xl">
                  Use the live conversation for fit, not basic discovery.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
                  Take the product tour and review the packages first if you want. When you are ready, tell us whether you need a demo, pricing, a pilot discussion or technical and procurement information.
                </p>
              </div>

              <div className="mt-10 space-y-5 border-t border-white/10 pt-7">
                {[
                  ["Product demo", "Map Signal One to your sites, guard count and control-room workflow."],
                  ["Commercial discussion", "Understand the package, devices, communications and rollout scope that affect pricing."],
                  ["Procurement / technical", "Identify the architecture, access, integration and contractual information your buying group needs."],
                ].map(([title, body]) => (
                  <div key={title}>
                    <h2 className="text-sm font-semibold text-white/86">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-white/44">{body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs leading-5 text-white/32">
                Signal One serves South African security operators. Final product scope, commercial terms and technical commitments are confirmed for the specific operating environment.
              </p>
            </div>

            <IntakeForm
              kind="client"
              title="Start the right conversation"
              intro="Give us enough context to prepare for the discussion. Campaign and page attribution are captured with the enquiry so Signal One can understand what brought you here."
              fields={fields}
              submitLabel="Send enquiry"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
