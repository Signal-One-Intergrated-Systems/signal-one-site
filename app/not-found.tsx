import type { Metadata } from "next";
import { ButtonLink, Kicker } from "./components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main" className="surface-deep">
      <div className="wrap py-24 md:py-32 lg:py-40">
        <Kicker tone="dark">Error 404</Kicker>
        <h1 className="t-hero mt-5">We could not find that page.</h1>
        <p className="t-lead measure mt-6 text-text-inv-2">
          The link may be old or mistyped. Signal One Security, pricing and contact are one click away.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to the home page
          </ButtonLink>
          <ButtonLink href="/solutions/security" variant="ghost-dark" size="lg">
            See the platform
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost-dark" size="lg">
            Talk to Signal One
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
