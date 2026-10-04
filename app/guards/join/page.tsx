import type { Metadata } from "next";
import IntakeForm, { type IntakeField } from "../../components/IntakeForm";

export const metadata: Metadata = {
  title: "Join the Guard Marketplace",
  description: "Create a Guard Marketplace application and control whether your professional profile is visible to employers.",
};

const fields: IntakeField[] = [
  { name: "fullName", label: "Full name", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
  { name: "mobile", label: "Mobile number", type: "tel", required: true, placeholder: "+27" },
  { name: "psiraNumber", label: "PSIRA number", required: true, placeholder: "Registration number" },
  { name: "grade", label: "PSIRA grade", type: "select", required: true, options: ["Grade A", "Grade B", "Grade C", "Grade D", "Grade E", "Other / pending"] },
  { name: "experienceYears", label: "Years of security experience", type: "number", placeholder: "e.g. 4" },
  { name: "areas", label: "Preferred work areas", required: true, placeholder: "Randburg, Sandton, Midrand…" },
  { name: "skills", label: "Skills and experience", type: "textarea", required: true, placeholder: "Access control, patrol, CCTV, control room, armed response, retail, estates…" },
];

export default function GuardJoinPage() {
  return (
    <main className="min-h-screen bg-[#080d13] px-5 pb-24 pt-36 text-white md:pt-44">
      <div className="mx-auto grid max-w-[92rem] gap-12 xl:grid-cols-[.72fr_1.28fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#39bdf8]">Guard Marketplace</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] md:text-5xl">Create your opportunity profile.</h1>
          <p className="mt-6 text-base leading-7 text-white/55">
            Your Guard operational record remains private. Marketplace visibility is separate and opt-in: only approved professional fields are eligible to appear publicly.
          </p>
          <div className="mt-9 rounded-3xl border border-white/10 bg-white/[.025] p-6">
            <p className="text-sm font-semibold">Public marketplace never needs to expose:</p>
            <p className="mt-3 text-sm leading-6 text-white/42">ID numbers, residential address, personal documents, exact live location, internal incident history, disciplinary records or private Guard operational data.</p>
          </div>
        </div>
        <IntakeForm kind="guard" title="Guard Marketplace application" intro="Signal One verifies marketplace eligibility before a profile can be published. You control whether the profile is available for opportunities." fields={fields} submitLabel="Submit guard application" />
      </div>
    </main>
  );
}
