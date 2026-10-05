import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "POPIA",
  description: "Draft Signal One POPIA and operator-position notice for legal review.",
};

export default function PopiaPage() {
  return (
    <LegalPage
      eyebrow="POPIA"
      title="POPIA responsibilities are defined by the data relationship."
      intro="Signal One is designed for South African operations, but this page does not claim a certification of compliance. The final responsibilities of Signal One and each customer must be reflected in the signed commercial and data-processing documents."
      sections={[
        {
          title: "Customer operational data",
          content: (
            <p>Security companies may process guard, employee, site, client and incident information through Signal One. Where Signal One processes personal information on a customer&apos;s behalf, written operator terms and processing instructions are required before the public site should make stronger compliance claims.</p>
          ),
        },
        {
          title: "Access and accountability",
          content: (
            <p>The platform uses authenticated access, role-based permissions and audit records to restrict and record access to operational functions. Those technical controls support, but do not by themselves establish, legal compliance.</p>
          ),
        },
        {
          title: "Body-camera and location data",
          content: (
            <p>Body-camera footage and location information can be particularly sensitive operational data. Product-specific retention, access, lawful-purpose and employee/client notices must be agreed before deployment. No universal retention period is promised on this website.</p>
          ),
        },
        {
          title: "Incident handling",
          content: (
            <p>Security and privacy incidents are handled through operational investigation and audit records. Any statutory notification obligations are assessed against the facts of the incident and applicable law.</p>
          ),
        },
      ]}
    />
  );
}
