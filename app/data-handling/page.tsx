import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Data handling",
  description: "Confirmed Signal One data-handling controls and items still subject to operational confirmation.",
};

export default function DataHandlingPage() {
  return (
    <LegalPage
      eyebrow="Data handling"
      title="What the current platform can truthfully say about data controls."
      intro="The statements below are limited to controls evidenced in the current platform repositories. They deliberately avoid claiming certifications, penetration-test assurance or contractual service levels that have not been confirmed."
      sections={[
        {
          title: "Access control",
          content: (
            <p>Backend authorisation and role-based access controls are implemented across core platform surfaces. Guard also keeps authenticated sessions at the server boundary rather than exposing the session token to browser JavaScript.</p>
          ),
        },
        {
          title: "Transport and browser security",
          content: (
            <p>The API includes security middleware for HTTPS-oriented controls including Strict-Transport-Security and Content-Security-Policy headers. Public claims remain limited to the controls actually deployed on the relevant service.</p>
          ),
        },
        {
          title: "Stored files",
          content: (
            <p>The enterprise storage adapter supports AWS S3 with server-side AES-256 encryption and SHA-256 checksums for uploaded objects. Product-specific storage paths must be confirmed before stating that every Signal One file uses the same adapter.</p>
          ),
        },
        {
          title: "Auditability",
          content: (
            <p>Core operational platforms maintain audit records for security, administrative and business actions. The exact audit scope depends on the module and action.</p>
          ),
        },
        {
          title: "Backups and recovery",
          content: (
            <p>Database backup-restoration runbooks and restore validation procedures exist. Public backup frequency, retention, recovery-time and recovery-point commitments are not stated here until they have been checked against the currently deployed production database plan and customer agreements.</p>
          ),
        },
        {
          title: "Hosting and support commitments",
          content: (
            <p>Current Signal One services are deployed on cloud infrastructure including Railway-hosted services. Data-region, support-hour and rollout-time commitments will be stated only after they are operationally confirmed for the specific service being purchased.</p>
          ),
        },
      ]}
    />
  );
}
