import type { Metadata } from "next";
import SecurityIntentPage from "../../../components/SecurityIntentPage";

export const metadata: Metadata = {
  title: "Security Control Room Software South Africa",
  description:
    "Signal One Guard control-room software brings SOS, operational exceptions and live site activity into one operating view for security companies.",
};

export default function ControlRoomPage() {
  return (
    <SecurityIntentPage
      eyebrow="Security control room software · South Africa"
      title="Give the control room one operational picture while it is still actionable."
      body="Signal One Guard brings SOS, operational exceptions and site activity into one working view so operators can acknowledge, respond and escalate without waiting for the next manual update."
      image="/images/industries/security.jpg"
      imageAlt="Security control room operator monitoring active operations"
      outcomeTitle="Reduce the time spent assembling context from disconnected tools."
      outcomeBody="When an exception occurs, the control room needs enough context to act. Signal One is designed to surface operational state from the same record used by guards, supervisors and management."
      features={[
        { title: "SOS visibility", body: "Bring urgent guard events into the workspace used by the control room to respond." },
        { title: "Operational exceptions", body: "Surface the conditions that need attention instead of forcing operators to inspect every site manually." },
        { title: "Site activity", body: "See operating context around active sites from the same environment used for wider operations." },
        { title: "Acknowledge, respond, escalate", body: "Support the control-room workflow from awareness through response and escalation." },
      ]}
      proofTitle="The Control Room view is one layer of the same Guard operating system."
      proofBody="The goal is not another monitoring screen. It is a control-room view that connects live exceptions to the operational facts created in the field."
      proofImage="/images/product-proof/control-room-demo.jpg"
      proofImageAlt="Signal One Guard Control Room demo interface"
      faqs={[
        { question: "What can the Signal One Control Room see?", answer: "The public product describes live SOS, operational exceptions and site activity brought into one working view." },
        { question: "Is Signal One a CCTV monitoring platform?", answer: "The Guard public product is positioned around security operations, guards, sites, patrols, incidents, SOS and service evidence. CCTV requirements should be evaluated separately against the specific solution scope." },
        { question: "Can the control room work from the same information as supervisors?", answer: "Yes. Signal One is designed around one operational record shared across the appropriate role-scoped views." },
        { question: "Does the product support role-based access?", answer: "Yes. People are intended to see the operational scope appropriate to their role." },
      ]}
    />
  );
}
