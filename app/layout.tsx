import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MarketingAnalytics from "./components/MarketingAnalytics";
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
    default: "Security Guard Management Software South Africa | Signal One",
    template: "%s | Signal One",
  },
  description:
    "Signal One is security guard management software for South African guarding companies, connecting attendance, patrols, incidents, SOS, control-room visibility and client proof.",
  metadataBase: new URL("https://signal-one-site.vercel.app"),
  applicationName: "Signal One",
  openGraph: {
    title: "Security Guard Management Software South Africa | Signal One",
    description:
      "Control every site, know what happened and prove the service with Signal One security operations software.",
    type: "website",
    siteName: "Signal One",
    images: [
      {
        url: "/images/industries/security.jpg",
        alt: "Signal One security operations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Guard Management Software South Africa | Signal One",
    description:
      "Control every site, know what happened and prove the service with Signal One security operations software.",
    images: ["/images/industries/security.jpg"],
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
      <body className={inter.variable + " " + geistMono.variable + " font-sans antialiased"}>
        <Header />
        <MarketingAnalytics />
        {children}
        <Footer />
      </body>
    </html>
  );
}
