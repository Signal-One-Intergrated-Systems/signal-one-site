import Link from "next/link";
import type { ReactNode } from "react";

export type LegalSection = {
  title: string;
  content: ReactNode;
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-[var(--s1-surface-base)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[980px]">
        <div className="rounded-[18px] border border-[#F59E0B]/20 bg-[#F59E0B]/[.045] px-5 py-4 text-sm leading-6 text-[#FCD34D]">
          Draft for legal review. This page describes the current intended operating position and must not be read as a certification or legal opinion.
        </div>

        <header className="border-b border-white/10 py-10">
          <p className="s1-eyebrow">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/64">{intro}</p>
        </header>

        <div className="divide-y divide-white/10">
          {sections.map((section) => (
            <section key={section.title} className="py-8">
              <h2 className="text-2xl font-semibold tracking-[-.025em]">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-white/64">{section.content}</div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-[18px] border border-white/10 bg-[#0F131A] p-6">
          <p className="text-sm leading-7 text-white/64">
            Privacy or data question? Email <a className="font-semibold text-[#7DD3FC]" href="mailto:sales@signalone.co.za">sales@signalone.co.za</a>.
            Commercial enquiries can also use the <Link className="font-semibold text-[#7DD3FC]" href="/contact">Signal One contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
