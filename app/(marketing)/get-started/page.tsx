import type { Metadata } from "next";
import ClientOnboarding from "../../components/journey/ClientOnboarding";
import IntakeAvailability from "../../components/journey/IntakeAvailability";
import ProductSignature from "../../components/brand/ProductSignature";
import { guardDayPricePhrase } from "../../lib/pricing";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Request Your 14-Day Trial",
  description:
    "Tell Signal One what your company needs across 1GUARD, 1Service and connected equipment. Request a 14-day trial or walkthrough; activation is confirmed separately.",
  alternates: { canonical: "/get-started" },
});

export default function GetStartedPage() {
  return (
    <main id="main" className="s1-onboarding s1-scene-page s1-scene-page--trial">
      <div className="wrap py-10 md:py-16">
        {/* Plain introduction, no card: the first question follows directly (UX correction #6, VA-23). */}
        <div className="s1-onboarding-intro mb-8 max-w-3xl">
          <p className="t-kicker text-accent">Company registration · 14-day <ProductSignature name="GUARD" tone="dark" /> trial request</p>
          <h1 className="t-h1 mt-3">Start with what your business needs.</h1>
          <p className="t-body mt-4 text-ink-2">
            Choose 1GUARD, register interest in 1Service, or enquire about equipment. Eligible security companies can
            request a 14-day 1GUARD trial. A request is not an activated subscription.
          </p>
          <ol className="s1-trial-steps t-small mt-5 grid gap-2 text-ink-2" aria-label="How a 1GUARD trial works">
            <li><strong className="text-ink">1. You request it here.</strong> Nothing is activated and nothing is charged when you send this.</li>
            <li><strong className="text-ink">2. We confirm eligibility.</strong> 1GUARD is in pilot with security companies; we check that it fits your operation.</li>
            <li><strong className="text-ink">3. We activate access.</strong> When the 14 days start and end, and what happens to your data afterwards, are confirmed in writing before your account is opened.</li>
            <li><strong className="text-ink">4. After the trial.</strong> Continuing is your choice, on paid terms agreed with you before activation (public rate {guardDayPricePhrase}, excl. VAT).</li>
          </ol>
        </div>
        <IntakeAvailability trial />
        <ClientOnboarding />
      </div>
    </main>
  );
}
