import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trust & Deployment",
  description:
    "Review Signal One Guard access, operational-record, offline, implementation and procurement information.",
};

const principles = [
  {
    title: "Role-based operational access",
    body: "Signal One is designed so people see the operational scope appropriate to their role rather than exposing the entire company workspace to every user.",
  },
  {
    title: "Audit-preserving records",
    body: "Deactivation and corrections preserve operational history instead of treating operational evidence as disposable data.",
  },
  {
    title: "Offline field continuity",
    body: "Guard workflows are designed to continue through connectivity loss and reconcile when connectivity returns.",
  },
  {
    title: "Evidence-led client service",
    body: "Service proof is derived from the same operational record used to run attendance, patrols, incidents and exceptions.",
  },
] as const;

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <section className="s1-glass rounded-[24px] p-7 md:p-10 lg:p-12">
          <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Trust & deployment</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-.04em] md:text-6xl">
              Operational software has to survive procurement as well as the field.
            </h1>
            <div>
              <p className="max-w-2xl text-base leading-7 text-white/62">
                This page states only the deployment and operating principles currently supported by the Signal One product repository. Detailed architecture, hosting, security controls, integration requirements and contractual commitments should be verified during procurement rather than inferred from marketing copy.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact?intent=trust" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                  Request procurement discussion
                </Link>
                <Link href="/tour" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                  See product tour
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((item, index) => (
              <article key={item.title} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-7">
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">0{index + 1}</p>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-.03em]">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/52">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 py-20 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Implementation path</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">
                Move from evaluation to a controlled operating rollout.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["01 · Operational review", "Define sites, people, operating model and the first operational risks to solve."],
                ["02 · Company setup", "Create the company administration layer and controlled access."],
                ["03 · Sites & people", "Configure clients, sites, posts, supervisors, guards and operational devices."],
                ["04 · Go live", "Move attendance, patrols, exceptions and service evidence into the live workflow."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[14px] border border-white/10 bg-white/[.025] p-5">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/46">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              ["For operations", "Review attendance, patrol, occurrence, SOS, post coverage and offline field behaviour."],
              ["For IT / risk", "Confirm architecture, hosting, access, integration, backup and security requirements during technical due diligence."],
              ["For procurement", "Confirm scope, implementation, devices, support, commercial terms and any required service commitments."],
            ].map(([title, body]) => (
              <article key={title} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-6">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#0EA5E9]/25 bg-[#0EA5E9]/[.06] p-7 md:p-10">
          <p className="s1-mono text-[9px] font-semibold text-[#7DD3FC]">Procurement next step</p>
          <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-.035em] md:text-4xl">
            Bring the technical and operational questions into the same evaluation.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
            Signal One should be evaluated against the operating environment you actually run. Use the procurement discussion to identify what must be demonstrated, documented or contractually confirmed before rollout.
          </p>
          <Link href="/contact?intent=trust" className="s1-primary-action mt-7 inline-flex px-6 py-3 text-sm font-semibold">
            Request procurement discussion
          </Link>
        </section>
      </div>
    </main>
  );
}
