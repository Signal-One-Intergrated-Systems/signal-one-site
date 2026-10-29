import type { Metadata } from "next";
import ClientOnboarding from "../../components/journey/ClientOnboarding";

export const metadata: Metadata = {
  title: "Get 14 day free trial | Signal One",
  description:
    "Tell Signal One what your company needs across 1GUARD, 1Service and connected equipment. Request your 14-day trial or a walkthrough; activation is confirmed separately.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  return (
    <main id="main" className="surface-light s1-onboarding">
      <div className="wrap py-10 md:py-16"><div className="s1-onboarding-intro mb-8 rounded-card border border-white/25 bg-[#0c2741]/85 p-5 text-white shadow-xl backdrop-blur-xl md:p-7"><p className="text-xs font-semibold uppercase tracking-widest text-sky-300">1GUARD · 14-day free trial request</p><h1 className="mt-2 text-2xl font-bold md:text-3xl">Get 14 days to discover a more connected security operation.</h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200">Start with 1GUARD and tell us about your sites and team. You can also ask about equipment or the planned 1Service platform. This form requests a trial; access, eligibility, expiry and any paid terms are confirmed before activation.</p></div>
        <ClientOnboarding />
      </div>
    </main>
  );
}
