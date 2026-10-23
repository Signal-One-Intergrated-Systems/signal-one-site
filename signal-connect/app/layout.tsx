import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ConnectHeader } from "../components/ConnectHeader";
import { OfflineShell } from "../components/OfflineShell";
import "../styles/tokens.css";
import "../styles/global.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "optional" });
export const metadata: Metadata = { title: "Signal Connect | Signal One", description: "Every connection begins with a signal.", robots: { index: false, follow: false }, appleWebApp: { capable: true, title: "Signal Connect", statusBarStyle: "black-translucent" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0F131A", colorScheme: "dark" };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en-ZA" className={inter.variable}><body><a className="skip" href="#main">Skip to content</a><div className="shell"><ConnectHeader />{children}<footer>Signal One Integrated Systems</footer></div><OfflineShell /></body></html>; }
