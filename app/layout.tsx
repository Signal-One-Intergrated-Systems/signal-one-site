import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";
import "./site-theme.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  openGraph: {
    title: "Signal One Security Operations",
    description:
      "Control every site, know what happened and prove the service with Signal One.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable + " font-sans antialiased"}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
