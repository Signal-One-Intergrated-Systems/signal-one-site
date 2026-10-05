import type { Metadata } from "next";
import SecurityIntentPage from "../../../components/SecurityIntentPage";

export const metadata: Metadata = {
  title: "Security Client Reporting & Proof of Service",
  description:
    "Turn attendance, patrol and occurrence records into clearer security service proof for management and authorised clients with Signal One Guard.",
};

export default function ClientProofPage() {
  return (
    <SecurityIntentPage
      eyebrow="Security client reporting · Proof of service"
      title="Give the client evidence of service without exposing your internal operation."
      body="Signal One Guard brings scheduled services, verified attendance, patrol evidence and unresolved exceptions into a clearer service-proof view for management and authorised clients."
      image="/images/product-proof/proof-of-service-demo.jpg"
      imageAlt="Signal One Guard proof of service demo interface"
      outcomeTitle="Move the client conversation from reassurance to evidence."
      outcomeBody="When a client asks whether the post was covered or the patrol happened, the answer should come from the same operational record used to run the service rather than a report assembled afterwards from unrelated sources."
      features={[
        { title: "Scheduled service context", body: "Connect what was expected to what the operation recorded during service delivery." },
        { title: "Attendance evidence", body: "Use verified presence as part of the service story for the site." },
        { title: "Patrol evidence", body: "Bring verified patrol activity into the client-service record." },
        { title: "Unresolved exceptions", body: "Preserve visibility of exceptions instead of presenting a client report that hides operational context." },
      ]}
      proofTitle="Proof of service is derived from the same record used to run the work."
      proofBody="Signal One is designed to reduce the gap between operations and client reporting: the evidence shown to authorised clients originates in the same attendance, patrol and event workflows used by the security company."
      proofImage="/images/product-proof/proof-of-service-demo.jpg"
      proofImageAlt="Signal One Guard service proof demo interface"
      faqs={[
        { question: "What can Signal One show as proof of service?", answer: "The public product describes scheduled services, verified attendance, patrol evidence and unresolved exceptions brought together into a service-proof view." },
        { question: "Do clients get access to the full internal system?", answer: "No. Signal One is designed so authorised client-facing views can show service evidence without exposing the security company's full internal operating workspace." },
        { question: "Is client proof generated separately from operations?", answer: "The product principle is the opposite: service proof is derived from the same operational record used to run the work." },
        { question: "Can this replace every existing client report?", answer: "Reporting requirements vary by contract. The specific format, data and export needs should be confirmed during the evaluation." },
      ]}
    />
  );
}
