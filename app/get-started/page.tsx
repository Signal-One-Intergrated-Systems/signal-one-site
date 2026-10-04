import type { Metadata } from "next";
import IntakeForm, { type IntakeField } from "../components/IntakeForm";

export const metadata: Metadata = {
  title: "Onboard your security company",
  description: "Start your Signal One company onboarding and prepare your Guard operation.",
};

const fields: IntakeField[] = [
  { name: "companyName", label: "Company name", required: true, placeholder: "ABC Security (Pty) Ltd" },
  { name: "registrationNumber", label: "Company registration number", placeholder: "Optional at first step" },
  { name: "contactName", label: "Primary contact", required: true, placeholder: "Full name" },
  { name: "email", label: "Business email", type: "email", required: true, placeholder: "name@company.co.za" },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
  { name: "province", label: "Primary province", type: "select", required: true, options: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Multiple provinces"] },
  { name: "guardCount", label: "Approximate guard count", type: "number", placeholder: "e.g. 120" },
  { name: "siteCount", label: "Approximate site count", type: "number", placeholder: "e.g. 18" },
  { name: "need", label: "What do you need from Signal One?", type: "textarea", required: true, placeholder: "Guard management, control room, workforce, PTT, tracking, devices, CCTV, sales support…" },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-[#080d13] px-5 pb-24 pt-36 text-white md:pt-44">
      <div className="mx-auto grid max-w-[92rem] gap-12 xl:grid-cols-[.72fr_1.28fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Company onboarding</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] md:text-5xl">Start your Signal One operation.</h1>
          <p className="mt-6 text-base leading-7 text-white/55">
            This starts the commercial and operational onboarding process. Your company is reviewed in LEOS first; approved companies are then provisioned into Guard with a company administrator.
          </p>
          <div className="mt-9 space-y-4">
            {[
              ["1", "Company profile", "Tell us who you are and what you operate."],
              ["2", "Verification & commercial setup", "Signal One reviews the company, requirements and commercial relationship."],
              ["3", "Guard activation", "Your company, initial administrator and operational setup are provisioned into Guard."],
              ["4", "Go live", "Add sites, people, devices and staffing requirements."],
            ].map(([number, title, body]) => (
              <div key={number} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-xs text-[#7dd3fc]">{number}</span>
                <div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-white/40">{body}</p></div>
              </div>
            ))}
          </div>
        </div>
        <IntakeForm kind="client" title="Company onboarding request" intro="Submit the first-stage company profile. We do not create an unrestricted Guard tenant directly from an anonymous website request." fields={fields} submitLabel="Start company onboarding" />
      </div>
    </main>
  );
}
