import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
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
    default: "Signal One | Security Operations",
    template: "%s | Signal One",
  },
  description:
    "Operational control, patrol and attendance evidence, post coverage, client proof and connected services for private security companies.",
  metadataBase: new URL("https://signal-one-site.vercel.app"),
  applicationName: "Signal One",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Signal One Security Operations",
    description:
      "Control every site, know what happened and prove the service with Signal One.",
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
    title: "Signal One Security Operations",
    description:
      "Control every site, know what happened and prove the service with Signal One.",
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
    <html lang="en">
      <body className={inter.variable + " " + geistMono.variable + " font-sans antialiased"}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
