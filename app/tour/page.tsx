import type { Metadata } from "next";
import Link from "next/link";
import PlatformProof from "../components/PlatformProof";

export const metadata: Metadata = {
  title: "Product Tour",
  description:
    "Take a self-guided tour of Signal One Guard for South African security companies: control room, operations, people and service proof.",
};

const moments = [
  {
    step: "01",
    title: "Control Room",
    question: "What needs attention now?",
    body: "Bring SOS, exceptions and live site activity into one operating view so the control room can acknowledge, respond and escalate from the same context.",
  },
  {
    step: "02",
    title: "My operation",
    question: "Which sites are actually under control?",
    body: "Supervisors can work from sites, roster or map, post shortfalls, guards on duty and the items that require intervention.",
  },
  {
    step: "03",
    title: "People & access",
    question: "Who can see and operate what?",
    body: "Company administrators manage people, invitations and supervisor site scope while preserving the operational record.",
  },
  {
    step: "04",
    title: "Proof of service",
    question: "Can the service be proven?",
    body: "Scheduled services, attendance, patrol evidence and unresolved exceptions are brought together into a record that management and authorised clients can understand.",
  },
] as const;

export default function TourPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <section className="s1-glass overflow-hidden rounded-[24px] p-7 md:p-10 lg:p-12">
          <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Self-guided product tour</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-.04em] md:text-6xl">
                See how Signal One turns field activity into operational truth.
              </h1>
            </div>
            <div className="max-w-2xl">
              <p className="text-base leading-7 text-white/62">
                This tour uses controlled Signal One Guard QA/demo captures with synthetic test data. Move through the operating views at your own pace before deciding whether you want a live demonstration.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#tour" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                  Start the tour
                </a>
                <Link href="/contact?intent=demo" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                  Book a 30-minute demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {moments.map((moment) => (
              <article key={moment.step} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-6">
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{moment.step} · {moment.title}</p>
                <h2 className="mt-5 text-xl font-semibold tracking-[-.025em]">{moment.question}</h2>
                <p className="mt-3 text-sm leading-6 text-white/48">{moment.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="tour" className="scroll-mt-28 border-y border-white/10 py-20 md:py-24">
          <div className="mb-10 max-w-4xl">
            <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Interactive product proof</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-5xl">
              Move through the same operating record from control to client proof.
            </h2>
          </div>
          <PlatformProof />
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-[24px] border border-white/10 bg-white/[.025] p-7 md:p-9">
              <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">What this tour is designed to answer</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "How does the control room see exceptions?",
                  "How do supervisors see post coverage?",
                  "How is operational access controlled?",
                  "How does activity become service evidence?",
                  "What happens when field connectivity is interrupted?",
                  "How can the same record support management and clients?",
                ].map((item) => (
                  <div key={item} className="rounded-[14px] border border-white/10 bg-[#0A0D12] p-4 text-sm leading-6 text-white/58">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#0EA5E9]/25 bg-[#0EA5E9]/[.065] p-7 md:p-9">
              <p className="s1-mono text-[9px] font-semibold text-[#7DD3FC]">Next step</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em]">Put your own operation into the conversation.</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">
                A live demo is where Signal One can map these views to your sites, guard count, control-room workflow and client-service requirements.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/contact?intent=demo" className="s1-primary-action px-6 py-3 text-sm font-semibold">
                  Book a 30-minute demo
                </Link>
                <Link href="/pricing" className="s1-secondary-action px-6 py-3 text-sm font-semibold">
                  See packages
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
