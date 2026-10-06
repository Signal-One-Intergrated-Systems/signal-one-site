import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "POPIA and Data Handling for Security Software",
  description:
    "How Signal One approaches POPIA and data handling for public enquiries, guard profiles and operational product data in security guard management software.",
  alternates: { canonical: "/popia" },
};

const sections = [
  ["Purpose limitation", "Collect information for a defined operational, commercial, onboarding or support purpose."],
  ["Least access", "Use role and tenant boundaries so users see only the information needed for their work."],
  ["Private workforce data", "Guard profiles and employment documents are never published on the public website and are not publicly browsable."],
  ["Guard profile applications", "Details a guard submits through the website are used to assess the application and contact the guard. When Guard Marketplace launches, an eligible profile is shown only to signed-in Signal One client companies, and the guard decides whether to accept any hire request. A guard can ask for their information to be corrected or deleted by emailing sales@signalone.co.za."],
  ["Auditability", "Sensitive operational actions should leave an auditable record rather than relying on informal changes."],
  ["Corrections", "Provide a process for authorised correction of inaccurate personal information."],
  ["Retention", "Retain information only for the period justified by its operational, contractual or legal purpose; the final schedule remains subject to legal review."],
] as const;

export default function PopiaPage() {
  return (
    <LegalPage
      reviewNote
      kicker="POPIA"
      title="POPIA and data handling"
      intro="Signal One is designed to minimise unnecessary exposure of operational and personal information. Product-specific privacy notices, operator responsibilities and retention requirements are confirmed in the relevant customer and service documentation."
      sections={sections}
    />
  );
}
