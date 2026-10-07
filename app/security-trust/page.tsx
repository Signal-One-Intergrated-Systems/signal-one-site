import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Security and Trust: Access Control and Audit",
  description:
    "How Signal One Security controls access, keeps audit trails and handles hosting and data. We state only what is proven: no certifications we have not been awarded.",
  alternates: { canonical: "/security-trust" },
};

const sections = [
  ["Authentication & access", "Authenticated product areas use role and permission controls. Guard also separates company, supervisor, client and guard access paths."],
  ["Audit trails", "The operating platforms record audited actions for important administrative and operational changes."],
  ["Data transport", "Public and product endpoints are served over HTTPS. Provider credentials and application secrets are stored outside public source code."],
  ["Storage", "The enterprise platform contains managed PostgreSQL and object-storage integrations. Exact customer data-location commitments remain subject to the final hosting configuration."],
  ["Backup & recovery", "Backup, restoration and recovery controls exist in the platform engineering stack. Public RPO, RTO and retention commitments are not published until they are formally approved."],
  ["POPIA", "Signal One's product design uses purpose-limited access and private operational workspaces. The final POPIA notice and operator responsibilities remain subject to legal review."],
  ["Support", "Customer support and incident handling are part of the operating model. Exact support hours and response-time commitments will be stated in the customer agreement rather than invented on the website."],
  ["Product status", "Capabilities are labelled Pilot, Live, Beta, MVP in development or Coming soon. Signal One Guard is Pilot until production is running for a first customer. A planned feature or integration is not marketed as live."],
] as const;

export default function SecurityTrustPage() {
  return (
    <LegalPage
      kicker="Security & trust"
      title="Control access. Preserve evidence. State only what is proven."
      intro="Signal One uses managed cloud infrastructure and platform controls including authentication, role-based access, tenant-aware data boundaries and audit logging. We do not claim ISO, SOC or other certifications that have not been independently awarded."
      sections={sections}
      footer={
        <>
          Procurement or security review? Contact <a href="mailto:sales@signalone.co.za" className="link-inline font-semibold text-signal-ink">sales@signalone.co.za</a>. Contractual support hours, data-location commitments, backup retention and recovery objectives are confirmed in the applicable customer agreement rather than invented on the public website.
        </>
      }
    />
  );
}
