import type { Metadata } from "next";
import ClientOnboarding from "../../components/journey/ClientOnboarding";
import IntakeAvailability from "../../components/journey/IntakeAvailability";
import ProductSignature from "../../components/brand/ProductSignature";

export const metadata: Metadata = {
  title: "Request Your 14-Day Trial",
  description:
    "Tell Signal One what your company needs across 1GUARD, 1Service and connected equipment. Request a 14-day trial or walkthrough; activation is confirmed separately.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  return (
    <main id="main" className="s1-onboarding s1-scene-page s1-scene-page--trial">
      <div className="wrap py-10 md:py-16">
        {/* Plain introduction, no card: the first question follows directly (UX correction #6, VA-23). */}
        <div className="s1-onboarding-intro mb-8 max-w-3xl">
          <p className="t-kicker text-signal-300">Company registration · 14-day <ProductSignature name="GUARD" tone="dark" /> trial request</p>
          <h1 className="t-h1 mt-3">Start with what your business needs.</h1>
          <p className="t-body mt-4 text-text-inv-2">
            Choose 1GUARD, register interest in 1Service, or enquire about equipment. Eligible security companies can
            request a 14-day 1GUARD trial. A request is not an activated subscription: access, eligibility, expiry and
            any paid terms are confirmed before activation.
          </p>
        </div>
        <IntakeAvailability trial />
        <ClientOnboarding />
      </div>
    </main>
  );
}
