import type { Metadata, Viewport } from "next";
import { inter } from "../lib/body-font";
import { ConnectHeader } from "../_connect/components/ConnectHeader";
import "../_connect/styles/tokens.css";
import "../_connect/styles/global.css";
export const metadata: Metadata = { title: "Signal Connect | Signal One", description: "Every connection begins with a signal.", robots: { index: false, follow: false }, icons: { icon: "/icon.png", apple: "/apple-icon.png" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0F131A", colorScheme: "dark" };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en-ZA" className={inter.variable}><body><a className="skip" href="#main">Skip to content</a><div className="shell"><ConnectHeader />{children}<footer>Signal One Integrated Systems</footer></div></body></html>; }
