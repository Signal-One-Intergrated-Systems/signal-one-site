import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Draft Signal One privacy notice for legal review.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="How Signal One handles personal information."
      intro="Signal One is a trading brand of Lancesat Suppliers (Pty) Ltd. This draft explains the categories of information the website and operating services may process and the purposes for which they are used."
      sections={[
        {
          title: "Information we may collect",
          content: (
            <>
              <p>Information may include business contact details, company and onboarding information, recruitment applications and CVs, support or enquiry content, and operational records created through authorised use of Signal One services.</p>
              <p>Signal One does not use this notice to claim that every listed category is collected in every product or journey.</p>
            </>
          ),
        },
        {
          title: "Why we use it",
          content: (
            <>
              <p>We use information to respond to enquiries, process onboarding and recruitment, provide contracted services, operate authorised accounts, support security-company workflows, maintain audit records and protect the service from misuse.</p>
            </>
          ),
        },
        {
          title: "Customers, operators and data responsibility",
          content: (
            <p>Where a security company places personal information into Signal One for its own operations, the parties&apos; exact POPIA roles and processing instructions must be recorded in the applicable customer agreement and data-processing terms. The public website does not replace those written terms.</p>
          ),
        },
        {
          title: "Retention and deletion",
          content: (
            <p>Retention depends on the record, legal obligation, operational need and customer agreement. Specific retention periods must be confirmed in the applicable policy or contract before they are represented as binding public commitments.</p>
          ),
        },
        {
          title: "Your rights",
          content: (
            <p>Data subjects may request access, correction or other action available under applicable South African law. Requests must be verified before information is disclosed or changed.</p>
          ),
        },
      ]}
    />
  );
}
