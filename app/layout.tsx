import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Analytics from "./components/Analytics";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { brand, salesEmail, siteUrl } from "./lib/site";
import "./globals.css";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  // "optional": the page never waits for or reflows to the web font. With the metric-matched fallback this keeps LCP and CLS low.
  display: "optional",
});

const description =
  "Security guard management software for South African security companies: sites, shifts, attendance, patrols, incidents, control room and client proof of service. R2 per guard per day, excl. VAT.";

export const metadata: Metadata = {
  title: {
    default: "Security Guard Management Software South Africa | Signal One",
    template: "%s | Signal One",
  },
  description,
  metadataBase: new URL(siteUrl),
  category: "business software",
  keywords: [
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
    title: "Signal One Security: run every site and prove the service",
    description:
      "Sites, shifts, patrols, incidents, control room and client proof of service for South African security companies. R2 per guard per day, excl. VAT.",
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
      description,
      offers: {
        "@type": "Offer",
        url: siteUrl + "/pricing",
        price: "2.00",
        priceCurrency: "ZAR",
        description: "R2 per guard per day, excluding VAT. Minimum purchase 10 guard days.",
        eligibleRegion: { "@type": "Country", name: "South Africa" },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "2.00",
          priceCurrency: "ZAR",
          unitText: "per guard per day",
          valueAddedTaxIncluded: false,
          eligibleQuantity: { "@type": "QuantitativeValue", minValue: 10, unitText: "guard days" },
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
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
