import type { Metadata } from "next";
import MarketingHero from "../components/MarketingHero";

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
] as const;

export default function GuardsPage() {
  return (
    <main className="min-h-screen bg-[var(--s1-bg)] px-5 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-[90rem]">
        <MarketingHero
          eyebrow="For security officers"
          title="Your shift. Your patrol. Your evidence."
          body="Signal One Guard gives officers a focused mobile workspace for assigned shifts, attendance, patrol verification, incidents, SOS and personal operational history."
          image="/images/security.jpg"
          imageAlt="Security officer working on site with a handheld radio"
          primary={{ href: "/guards/join", label: "Start guard onboarding" }}
        />

        <section className="py-14 md:py-16">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map(([title, body], index) => (
              <article key={title} className="rounded-[18px] border border-white/10 bg-[#0A0D12] p-6 transition duration-300 hover:border-[#0EA5E9]/30">
                <span className="s1-mono text-[9px] font-semibold text-[#38BDF8]">0{index + 1}</span>
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/48">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
