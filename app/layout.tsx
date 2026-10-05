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
    default: "Signal One | Security Company Operating Platform",
    template: "%s | Signal One",
  },
  description:
    "Signal One gives security companies one platform to win clients, hire guards, run operations and prove their service.",
  metadataBase: new URL("https://signal-one-site.vercel.app"),
  applicationName: "Signal One",
  openGraph: {
    title: "Signal One | Security Company Operating Platform",
    description:
      "Win clients, hire guards, run operations and prove the service from one Signal One platform.",
    type: "website",
    siteName: "Signal One",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal One | Security Company Operating Platform",
    description:
      "Win clients, hire guards, run operations and prove the service from one Signal One platform.",
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
      </body>
    </html>
  );
}
