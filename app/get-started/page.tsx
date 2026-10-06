import type { Metadata } from "next";
import ClientOnboarding from "../components/journey/ClientOnboarding";

export const metadata: Metadata = {
  title: "Start Company Onboarding",
  description:
    "Start onboarding your security company onto Signal One Security: company, contact, operation and what you want to start with. About three minutes.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  return (
    <main id="main" className="surface-paper">
      <div className="wrap py-10 md:py-16">
        <ClientOnboarding />
      </div>
    </main>
  );
}
