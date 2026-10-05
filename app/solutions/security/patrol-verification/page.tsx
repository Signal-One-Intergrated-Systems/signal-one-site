import type { Metadata } from "next";
import SecurityIntentPage from "../../../components/SecurityIntentPage";

export const metadata: Metadata = {
  title: "Guard Patrol Software South Africa",
  description:
    "Verify security patrols with Signal One Guard routes, QR or NFC checkpoints, GPS policy, offline synchronisation and operational evidence.",
};

export default function PatrolVerificationPage() {
  return (
    <SecurityIntentPage
      eyebrow="Guard patrol software · South Africa"
      title="Patrol verification that becomes operational evidence."
      body="Signal One Guard lets security teams run patrol routes and verify checkpoints with QR or NFC, apply GPS policy and keep field work moving through connectivity interruptions."
      image="/images/security.jpg"
      imageAlt="Security officer performing field patrol work"
      outcomeTitle="Know whether the patrol happened without reconstructing the shift later."
      outcomeBody="The buyer problem is not simply assigning a patrol. It is knowing whether the route was completed, where verification occurred, what exception needs attention and what evidence remains when a client asks."
      features={[
        { title: "Assigned patrol routes", body: "Structure patrol work around the routes and checkpoints expected at the operating site." },
        { title: "QR or NFC checkpoints", body: "Verify checkpoints through supported QR or NFC interactions rather than relying on handwritten confirmation." },
        { title: "GPS policy", body: "Use location policy as part of the patrol-verification workflow where configured for the operation." },
        { title: "Offline continuity", body: "Keep field patrol workflows working through connectivity loss and reconcile when connectivity returns." },
      ]}
      proofTitle="Patrol evidence should sit inside the same operating picture as attendance and exceptions."
      proofBody="Signal One is designed to connect patrol state to the wider operational record so supervisors and management do not need a separate patrol report to understand whether the site is under control."
      proofImage="/images/product-proof/my-operation-demo.jpg"
      proofImageAlt="Signal One Guard operations demo showing site oversight"
      faqs={[
        { question: "How does Signal One verify patrol checkpoints?", answer: "The public product supports patrol checkpoints verified through QR or NFC, with GPS policy available as part of the operating workflow." },
        { question: "Can guards patrol if the site loses connectivity?", answer: "Yes. Guard field workflows are designed for offline continuity and later synchronisation." },
        { question: "Does patrol verification create client evidence?", answer: "Patrol evidence can feed the wider proof-of-service record used by management and authorised client-facing views." },
        { question: "Is Signal One only a patrol app?", answer: "No. Patrol verification sits alongside attendance, incidents, SOS, occurrence records, post coverage and broader security operations." },
      ]}
    />
  );
}
