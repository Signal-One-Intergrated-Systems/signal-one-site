import type { Metadata } from "next";
import IntakeForm, { type IntakeField } from "../../components/IntakeForm";

export const metadata: Metadata = {
  title: "Join Signal One Sales",
  description: "Apply to join the Signal One sales network and Sales OS.",
};

const fields: IntakeField[] = [
  { name: "fullName", label: "Full name", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
  { name: "city", label: "City / area", required: true, placeholder: "Johannesburg" },
  { name: "experience", label: "B2B sales experience", type: "select", required: true, options: ["No formal experience", "Less than 1 year", "1–3 years", "3–5 years", "5+ years"] },
  { name: "securityExperience", label: "Security industry exposure", type: "select", options: ["None", "Some exposure", "Worked in security sales", "Worked in security operations"] },
  { name: "employment", label: "Current work status", type: "select", required: true, options: ["Employed", "Self-employed", "Between roles", "Student / graduate", "Other"] },
  { name: "motivation", label: "Why do you want to join Signal One Sales?", type: "textarea", required: true, placeholder: "Tell us about your experience, network and what you want to build." },
];

export default function JoinSalesPage() {
  return (
    <main className="min-h-screen bg-[#080d13] px-5 pb-24 pt-36 text-white md:pt-44">
      <div className="mx-auto grid max-w-[92rem] gap-12 xl:grid-cols-[.72fr_1.28fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Signal One Sales</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] md:text-5xl">Apply. Train. Sell from Sales OS.</h1>
          <p className="mt-6 text-base leading-7 text-white/55">
            Applying here does not automatically grant staff access. Accepted applicants move through workforce setup, training, sales packs and manager approval before live leads are assigned.
          </p>
          <div className="mt-9 grid gap-3">
            {["Application & screening", "Approval and workforce setup", "Sales Academy & sales packs", "Commission setup", "Sales OS go-live"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[.025] px-4 py-3 text-sm text-white/65">
                <span className="mr-3 text-[#7dd3fc]">0{index + 1}</span>{item}
              </div>
            ))}
          </div>
        </div>
        <IntakeForm kind="sales" title="Sales application" intro="Your application enters the Signal One review process. Platform access is created only after approval." fields={fields} submitLabel="Submit sales application" />
      </div>
    </main>
  );
}
