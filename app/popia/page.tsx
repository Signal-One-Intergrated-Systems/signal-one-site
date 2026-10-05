import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POPIA & Data Handling",
  description: "Signal One's draft POPIA and data-handling approach for legal review.",
};

export default function PopiaPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <article className="mx-auto max-w-4xl">
        <p className="s1-eyebrow">For legal review</p>
        <h1 className="s1-display mt-5 font-semibold">POPIA & data handling</h1>
        <p className="mt-6 text-base leading-8 text-white/72">
          Signal One is designed to minimise unnecessary exposure of operational and personal information. This page is a draft operating statement and must be aligned with the final Information Officer, operator agreements, retention schedule and privacy notices.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            ["Purpose limitation", "Collect information for a defined operational, commercial, onboarding or support purpose."],
            ["Least access", "Use role and tenant boundaries so users see only the information needed for their work."],
            ["Private workforce data", "Guard profiles and employment documents are not intended to be publicly browsable."],
            ["Auditability", "Sensitive operational actions should leave an auditable record rather than relying on informal changes."],
            ["Corrections", "Provide a process for authorised correction of inaccurate personal information."],
            ["Retention", "Retain information only for the period justified by its operational, contractual or legal purpose; the final schedule remains subject to legal review."],
          ].map(([title, body]) => (
            <section key={title} className="rounded-[18px] border border-white/10 bg-[#0F131A] p-6">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">{body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
