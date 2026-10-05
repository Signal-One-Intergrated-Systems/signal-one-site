import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Draft Signal One website and commercial terms summary for legal review.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Website and commercial terms."
      intro="These draft terms are for legal review. A quote, rental agreement, platform agreement or other signed commercial document takes precedence for the products and services it covers."
      sections={[
        {
          title: "Guard pricing",
          content: (
            <p>Signal One Guard is publicly priced at R2 per guard day excluding VAT. A guard day is used when an allocated guard clocks into a scheduled shift on site. The public site does not offer Starter, Pro, Enterprise or other package tiers.</p>
          ),
        },
        {
          title: "Radios, tracking and equipment",
          content: (
            <p>Radio rentals are quote-based. Product availability, rental term, included services, installation, accessories, support, insurance or replacement terms are binding only when stated in the applicable quote or agreement. Tracking, PTT and body-camera pricing is not published on this site.</p>
          ),
        },
        {
          title: "Product status",
          content: (
            <p>Signal One distinguishes between Live, Beta, Coming soon and Not offered capabilities. A Coming soon or demo capability is not a contractual commitment that the feature is currently available.</p>
          ),
        },
        {
          title: "Acceptable use and access",
          content: (
            <p>Customers and users must use authorised accounts and may access only the organisations, sites, people and records made available to their role. Access may be restricted where required to protect the platform or comply with the applicable agreement and law.</p>
          ),
        },
        {
          title: "Legal entity",
          content: (
            <p>Signal One is a trading brand of Lancesat Suppliers (Pty) Ltd, registration 2019/543402/07, VAT 4490314061, 340 Pretoria Avenue, Ferndale, Randburg, Gauteng, 2194, South Africa.</p>
          ),
        },
      ]}
    />
  );
}
