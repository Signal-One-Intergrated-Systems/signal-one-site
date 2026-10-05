import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security Operations Insights",
  description:
    "Signal One perspectives on security operations, control rooms, occurrence records, patrol evidence and client proof.",
};

const articles = [
  {
    href: "/insights/security-contracts-fail-quietly",
    title: "Security contracts usually fail quietly before they fail visibly",
    body: "Why post shortfalls, patrol gaps, unresolved exceptions and weak evidence should be treated as leading operational signals.",
    tag: "Operating risk",
  },
  {
    href: "/insights/control-room-exception-management",
    title: "A control room should manage exceptions, not stare at everything",
    body: "The operating principle behind moving control-room attention toward what needs intervention instead of constant manual checking.",
    tag: "Control room",
  },
  {
    href: "/insights/digital-occurrence-book",
    title: "A digital occurrence book is not just a paper book on a screen",
    body: "Why the real value comes from connecting occurrences to attendance, patrols, incidents, exceptions and service proof.",
    tag: "Operational record",
  },
] as const;

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-24 pt-32 text-white md:pt-36">
      <div className="mx-auto max-w-[90rem]">
        <section className="s1-glass rounded-[24px] p-7 md:p-10 lg:p-12">
          <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">Signal One insights</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.03] tracking-[-.04em] md:text-6xl">
            A point of view on how modern security operations should run.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/58">
            Practical perspectives for security-company owners, operations leaders and control-room teams. These articles focus on operating design rather than generic technology trends.
          </p>
        </section>

        <section className="py-20 md:py-24">
          <div className="grid gap-4 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.href} href={article.href} className="group rounded-[18px] border border-white/10 bg-[#0A0D12] p-7 transition hover:-translate-y-1 hover:border-[#0EA5E9]/35">
                <p className="s1-mono text-[9px] font-semibold text-[#38BDF8]">{article.tag}</p>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-.03em]">{article.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/48">{article.body}</p>
                <span className="mt-7 inline-flex text-sm font-semibold text-[#38BDF8] transition group-hover:translate-x-1">Read insight →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
