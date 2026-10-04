import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Signal One | Security Operations Platform",
    template: "%s | Signal One",
  },
  description:
    "Onboard your security company, build teams through the Guard Marketplace, and run security operations with Signal One.",
  metadataBase: new URL("https://signal-one-site.vercel.app"),
  openGraph: {
    title: "Signal One Security Operations",
    description:
      "Acquire work, build teams and operate security services from one connected system.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
