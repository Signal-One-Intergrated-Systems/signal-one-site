import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Signal One for guards",
  description: "See how security officers work from the Signal One Guard mobile experience.",
};

const capabilities = [
  ["Your shift", "See assigned work and the operational state that matters to you."],
  ["Clock in", "Record attendance against the site and its geofence."],
  ["Patrol", "Follow assigned patrol work and verify checkpoints with QR or NFC."],
  ["Report", "Record incidents with evidence and trigger SOS when help is needed."],
  ["Offline", "Keep working through connectivity loss and synchronise when signal returns."],
  ["History", "See your own operational history without exposing other guards' information."],
];

export default function GuardsPage() {
  return (
    <main className="min-h-screen bg-[#080d13] px-5 pb-24 pt-36 text-white md:pt-44">
      <div className="mx-auto max-w-[92rem]">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0b1119] px-7 py-14 md:px-12 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,211,153,.15),transparent_25%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,.09),transparent_26%)]" />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-emerald-300">For security officers</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[.98] tracking-[-.045em] md:text-7xl">
              Your shift. Your patrol. Your evidence.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/56 md:text-lg">
              Signal One Guard gives officers a focused mobile workspace for assigned shifts, attendance, patrol verification, incidents, SOS and personal operational history.
            </p>
            <Link href="/guards/join" className="mt-8 inline-flex rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#06120d] transition hover:bg-emerald-200">
              Start guard onboarding
            </Link>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map(([title, body], index) => (
              <article key={title} className="rounded-3xl border border-white/9 bg-white/[.03] p-6">
                <span className="text-xs font-semibold text-emerald-300">0{index + 1}</span>
                <h2 className="mt-4 text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/46">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
