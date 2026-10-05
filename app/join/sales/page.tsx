import type { Metadata } from "next";
import SalesCareersForm from "../../components/SalesCareersForm";

export const metadata: Metadata = {
  title: "Sales careers",
  description: "Apply for an open internal sales representative role at Signal One.",
};

function interviewSlots() {
  return (process.env.SIGNAL_ONE_SALES_INTERVIEW_SLOTS || "")
    .split("|")
    .map((value) => value.trim())
    .filter((value) => value && Number.isFinite(Date.parse(value)));
}

export default function JoinSalesPage() {
  const vacancies = Math.max(0, Number.parseInt(process.env.SIGNAL_ONE_SALES_VACANCIES || "10", 10) || 0);
  const slots = interviewSlots();

  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[1280px]">
        <section className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end md:pb-16">
          <div>
            <p className="s1-eyebrow">Careers at Signal One</p>
            <h1 className="s1-display mt-5 max-w-4xl font-semibold">
              Sell a product you can
              <span className="block text-[#38BDF8]">show working.</span>
            </h1>
          </div>
          <div>
            <p className="text-lg leading-8 text-white/64">
              Signal One is currently recruiting {vacancies} sales representative{vacancies === 1 ? "" : "s"}.
              These are internal Signal One roles. Our customers do not receive outsourced sales representatives.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/55">
              Successful applicants work inside Signal One&apos;s Sales OS for prospects, leads, follow-ups,
              quotes and customer conversations.
            </p>
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start md:py-16">
          <div>
            <p className="s1-eyebrow">Application journey</p>
            <h2 className="s1-h2 mt-5 font-semibold">Apply only while a vacancy is open.</h2>
            <div className="mt-7 space-y-5 border-t border-white/10 pt-7">
              {[
                ["01", "Basic information", "Tell us who you are, where you are based and how to reach you."],
                ["02", "Sales background", "Give us your B2B and security-industry experience."],
                ["03", "Upload your CV", "Attach the CV you want the recruitment team to review."],
                ["04", "Choose an interview time", "If interview slots have been published, you can request one with the application."],
              ].map(([number, title, body]) => (
                <div key={number} className="grid grid-cols-[36px_1fr] gap-4">
                  <span className="s1-mono pt-1 text-[#38BDF8]">{number}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/82">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/55">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SalesCareersForm vacancies={vacancies} interviewSlots={slots} />
        </section>
      </div>
    </main>
  );
}
