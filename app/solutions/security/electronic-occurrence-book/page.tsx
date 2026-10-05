import type { Metadata } from "next";
import SecurityIntentPage from "../../../components/SecurityIntentPage";

export const metadata: Metadata = {
  title: "Electronic Occurrence Book for Security Companies",
  description:
    "Replace fragmented occurrence records with a chronological Signal One Guard operational record of incidents, exceptions, corrections and response.",
};

export default function ElectronicOccurrenceBookPage() {
  return (
    <SecurityIntentPage
      eyebrow="Electronic occurrence book · Security operations"
      title="A digital occurrence record built from the operation as it happens."
      body="Signal One Guard keeps a chronological operational record of incidents, exceptions, corrections and response so the story of the site does not have to be reconstructed after the shift."
      image="/images/industries/security.jpg"
      imageAlt="Security control room managing operational events"
      outcomeTitle="Move beyond a paper book that management only sees after the fact."
      outcomeBody="The operational value of an electronic occurrence book is not simply typing notes into a screen. It is connecting occurrences to the same people, sites, attendance, patrol and exception context used to run the security service."
      features={[
        { title: "Chronological record", body: "Keep operational events in a time-ordered record rather than scattered across paper books and messages." },
        { title: "Incidents & exceptions", body: "Capture the events that affect service delivery and require management or control-room awareness." },
        { title: "Corrections without erasing history", body: "The public product is designed around audit-preserving records rather than destructive deletion of operational history." },
        { title: "Service context", body: "Use occurrence information alongside attendance, patrol and other evidence when management or a client needs to understand what happened." },
      ]}
      proofTitle="The occurrence record should help explain the service, not become another silo."
      proofBody="Signal One connects occurrence and incident information to the wider operational picture so the control room and management can work from the same facts."
      proofImage="/images/product-proof/control-room-demo.jpg"
      proofImageAlt="Signal One Guard Control Room demo interface"
      faqs={[
        { question: "What does Signal One record in the digital occurrence workflow?", answer: "The public product describes a chronological operational record of incidents, exceptions, corrections and response." },
        { question: "Can occurrence information be deleted without history?", answer: "Signal One's public operating principles emphasise audit-preserving records. Detailed retention and correction rules should be confirmed during procurement." },
        { question: "Is the occurrence book connected to incidents?", answer: "Yes. Incident and occurrence workflows are part of the same broader Guard operating record." },
        { question: "Does Signal One claim legal or regulatory compliance for the occurrence book?", answer: "No blanket compliance claim is made on this page. Company-specific regulatory and evidentiary requirements should be confirmed during evaluation." },
      ]}
    />
  );
}
