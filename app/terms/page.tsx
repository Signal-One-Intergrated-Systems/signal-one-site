import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Website Terms",
  description:
    "Terms for using the Signal One public website: product information, pricing and acceptable use.",
  alternates: { canonical: "/terms" },
};

const sections = [
  ["Website information", "We aim to keep public product information accurate, but availability, hardware specifications and commercial terms are confirmed before an order or rental is accepted."],
  ["Pricing", "The public Signal One Security rate is R2 per guard per day, excluding VAT. Radios, tracking and body cameras are rental by quote only. Other services and modules are priced separately where stated."],
  ["No invented commitments", "A website statement does not create a certification, uptime commitment, service-level agreement or product capability that is not stated in the governing customer agreement."],
  ["Acceptable use", "You may not interfere with the website, attempt unauthorised access, submit unlawful content or misuse public forms and application journeys."],
  ["Intellectual property", "Signal One branding, website content and product interfaces remain subject to their respective intellectual-property rights."],
] as const;

export default function TermsPage() {
  return (
    <LegalPage
      reviewNote
      kicker="Website terms"
      title="Website terms"
      intro="These website terms govern use of the public Signal One site. Product orders, rentals, Guard access and other paid services remain subject to the applicable quotation, order, rental or service agreement."
      sections={sections}
    />
  );
}
