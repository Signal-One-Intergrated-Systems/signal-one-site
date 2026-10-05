import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Analytics from "./components/Analytics";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";
import "./site-theme.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Signal One | Security Company Operating Platform",
    template: "%s | Signal One",
  },
  description:
    "Security guard management software for South African security companies: sites, shifts, patrols, incidents, client proof, Guard Marketplace, radios and tracking.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://signalone.co.za"),
  category: "business software",
  keywords: [
    "security guard management software South Africa",
    "security company software",
    "guard patrol software",
    "security guard attendance software",
    "security control room software",
    "PTT radio rental South Africa",
    "security tracking South Africa",
  ],
  applicationName: "Signal One",
  openGraph: {
    title: "Signal One | Security Company Operating Platform",
    description:
      "Run sites, shifts, patrols and incidents, hire guards, rent radios and tracking, and give clients proof of service.",
    type: "website",
    siteName: "Signal One",
    locale: "en_ZA",
    url: "/",
    images: ["/images/story/hero.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal One | Security Company Operating Platform",
    description:
      "Security guard management software for South African security companies, with Guard Marketplace, radios, tracking and client proof.",
    images: ["/images/story/hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#151A21",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <body className={inter.variable + " " + geistMono.variable + " antialiased"}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
