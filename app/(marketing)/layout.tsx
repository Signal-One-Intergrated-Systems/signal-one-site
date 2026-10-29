import type { Metadata, Viewport } from "next";
import { inter as body } from "../lib/body-font";
import Analytics from "../components/Analytics";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Reveal from "../components/Reveal";
import SceneTransition from "../components/SceneTransition";
import { guardAvailability, guardIsLive } from "../lib/guardStatus";
import { brand, salesEmail, siteUrl } from "../lib/site";
import "../globals.css";
import "../marketing-system.css";
import { guardDayPricePhrase, minimumPhrase, pricing, schemaPrice } from "../lib/pricing";


const description =
  "Signal One Integrated Systems provides 1GUARD for security operations and 1Service for service business operations, with communications, tracking and equipment solutions in South Africa.";

export const metadata: Metadata = {
  title: {
    default: "Signal One Integrated Systems | 1GUARD & 1Service",
    template: "%s | Signal One",
  },
  description,
  metadataBase: new URL(siteUrl),
  category: "business software",
  keywords: [
    "1GUARD security operations platform",
    "1Service restaurant and service operations platform",
    "security guard management software South Africa",
    "security company software South Africa",
    "guard patrol software",
    "guard attendance software",
    "security control room software",
    "guard management platform",
    "PTT radio rental South Africa",
    "vehicle tracking for security companies",
  ],
  applicationName: brand.master,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Signal One: 1GUARD, 1Service and Integrated Systems",
    description:
      description,
    type: "website",
    siteName: brand.master,
    locale: "en_ZA",
    url: "/",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal One Security: run every site and prove the service",
    description,
    
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#151a21" },
    { media: "(prefers-color-scheme: dark)", color: "#151a21" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": siteUrl + "/#organization",
      name: brand.master,
      url: siteUrl,
      email: salesEmail,
      logo: siteUrl + "/icon.png",
      areaServed: { "@type": "Country", name: "South Africa" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: salesEmail,
        areaServed: "ZA",
        availableLanguage: ["en"],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": siteUrl + "/#software",
      name: "Signal One Guard",
      alternateName: brand.product,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Security guard management software",
      operatingSystem: "Web, Android, iOS",
      publisher: { "@id": siteUrl + "/#organization" },
      description: guardIsLive ? description : description + " Signal One Guard is in pilot with its first security companies.",
      offers: {
        "@type": "Offer",
        url: siteUrl + "/pricing",
        availability: guardAvailability,
        price: schemaPrice,
        priceCurrency: pricing.currency,
        description: guardDayPricePhrase + ", excluding VAT. Minimum purchase " + minimumPhrase + ".",
        eligibleRegion: { "@type": "Country", name: "South Africa" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: schemaPrice,
          priceCurrency: pricing.currency,
          unitText: "per guard per day",
          valueAddedTaxIncluded: false,
          eligibleQuantity: { "@type": "QuantitativeValue", minValue: pricing.minimumGuardDays, unitText: "guard days" },
        },
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={body.variable}>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-3 z-[60] rounded-ui bg-light px-4 py-3 font-semibold text-text"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header />
        <SceneTransition>{children}</SceneTransition>
        <Footer />
        <Analytics />
        <Reveal />
      </body>
    </html>
  );
}
