import type { Metadata } from "next";
import SecurityIntentPage from "../../../components/SecurityIntentPage";

export const metadata: Metadata = {
  title: "Security Guard Management Software South Africa",
  description:
    "Signal One Guard is security guard management software for South African guarding companies, connecting attendance, patrols, incidents, SOS, control-room visibility and service proof.",
};

export default function GuardManagementPage() {
  return (
    <SecurityIntentPage
      eyebrow="Security guard management software · South Africa"
      title="Run the guard force from one operational record."
      body="Signal One Guard connects the frontline work a South African security company needs to see and prove: attendance, posts, patrols, incidents, SOS, operational exceptions and client-facing service evidence."
      image="/images/industries/security.jpg"
      imageAlt="Security control room supporting guard operations"
      outcomeTitle="Replace fragmented operational facts with one working picture."
      outcomeBody="Guard management is not only knowing where a guard is. The operating problem is connecting what was scheduled, who was present, what patrol work happened, what exceptions occurred and what evidence remains for management and the client."
      features={[
        { title: "Site-linked attendance", body: "Record clock-in and clock-out against the operating site with geofence policy and an evidence trail." },
        { title: "Patrol verification", body: "Run assigned routes and checkpoints using QR or NFC verification, GPS policy and offline synchronisation." },
        { title: "Incidents, SOS & exceptions", body: "Keep operational events and urgent exceptions visible to the people responsible for response." },
        { title: "Service proof", body: "Use the same operational record to support management oversight and authorised client-facing proof." },
      ]}
      proofTitle="Management, control and client proof use the same operational facts."
      proofBody="Signal One Guard is designed so the record created in the field can support supervisors and control-room teams without rebuilding the story later from paper, spreadsheets or chat messages."
      proofImage="/images/product-proof/my-operation-demo.jpg"
      proofImageAlt="Signal One Guard My operation demo interface"
      faqs={[
        { question: "What does Signal One Guard manage?", answer: "The public product supports assigned shifts, site-linked attendance, patrol verification, incidents, SOS, post and exception visibility, occurrence records, role-scoped access and proof-of-service workflows." },
        { question: "Is Signal One designed for South African security companies?", answer: "Yes. The commercial website is positioned for South African guarding companies. Regulatory, contractual and company-specific compliance responsibilities should still be confirmed during procurement and implementation." },
        { question: "Does it work when connectivity is interrupted?", answer: "Guard field workflows are designed for offline continuity and synchronisation when connectivity returns." },
        { question: "Can clients see the internal operating system?", answer: "Signal One is designed to provide authorised client-facing service views without exposing the security company's full internal operating workspace." },
      ]}
    />
  );
}
