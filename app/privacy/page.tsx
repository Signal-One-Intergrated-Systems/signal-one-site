import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Signal One handles personal information submitted through its public website.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  ["Information we collect", "We collect information you choose to submit through enquiries, onboarding, quote requests and applications, such as names, company details, contact information and the information needed to respond to your request."],
  ["Why we use it", "We use submitted information to respond to enquiries, prepare quotes, assess applications, activate requested services, support customers and maintain an auditable business record."],
  ["Access and security", "Access to operational systems is role-controlled. The platform includes authentication, permission controls and audit logging. We do not claim security certifications that have not been independently awarded."],
  ["Sharing", "Information may be processed by contracted infrastructure, communications, payment or service providers where needed to deliver the requested service. We do not publish private guard or customer records on the public website."],
  ["Retention and rights", "Retention periods must follow the purpose of processing, contractual requirements and applicable South African law. Requests to access, correct or object to processing can be sent to sales@signalone.co.za until a dedicated privacy address is confirmed."],
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      reviewNote
      kicker="Privacy"
      title="Privacy policy"
      intro="This policy describes how Signal One handles information submitted through the public website and enquiry flows. Product-specific agreements and notices may add requirements for operational services."
      sections={sections}
    />
  );
}
