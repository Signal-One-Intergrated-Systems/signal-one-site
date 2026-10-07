import type { Metadata } from "next";
import ClientOnboarding from "../components/journey/ClientOnboarding";

export const metadata: Metadata = {
  title: "Start Onboarding Your Security Company",
  description:
    "Start onboarding your security company onto Signal One Security: company, contact, operation and what you want to start with. About three minutes, saved as you go.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  return (
    <main id="main" className="surface-light">
      <div className="wrap py-10 md:py-16">
        <ClientOnboarding />
      </div>
    </main>
  );
}
