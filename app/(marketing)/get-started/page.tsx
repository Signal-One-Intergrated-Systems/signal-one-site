import type { Metadata } from "next";
import ClientOnboarding from "../../components/journey/ClientOnboarding";
import IntakeAvailability from "../../components/journey/IntakeAvailability";

export const metadata: Metadata = {
  title: "Request Your 14-Day Trial | Signal One",
  description:
    "Tell Signal One what your company needs across 1GUARD, 1Service and connected equipment. Request a 14-day trial or walkthrough; activation is confirmed separately.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  return (
    <main id="main" className="surface-light s1-onboarding s1-premium-trial">
      <div className="wrap py-10 md:py-16"><div className="s1-onboarding-intro mb-8 rounded-card border border-white/25 bg-[#0c2741]/85 p-5 text-white shadow-xl backdrop-blur-xl md:p-7"><p className="text-xs font-semibold uppercase tracking-widest text-sky-300">Company registration · 14-day 1GUARD trial request</p><h1 className="mt-2 text-2xl font-bold md:text-3xl">Start with what your business needs.</h1><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200">Choose 1GUARD, register interest in 1Service, or enquire about equipment. Eligible security companies can request a 14-day 1GUARD trial through the registration journey below. Your request is not an activated subscription: access, eligibility, expiry and any paid terms are confirmed before activation.</p></div>
        <IntakeAvailability />
        <ClientOnboarding />
      </div>
    </main>
  );
}
