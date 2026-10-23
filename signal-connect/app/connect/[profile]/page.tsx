import { notFound } from "next/navigation";
import { getProfile } from "../../../lib/profiles";
import { ContactExchange } from "../../../components/ContactExchange";
export default async function Visitor({ params }: { params: Promise<{ profile: string }> }) { const profile = getProfile((await params).profile); if (!profile) notFound(); return <main id="main" className="visitor"><p className="eyebrow">An introduction from {profile.fullName}</p><h1>Every connection begins with a signal.</h1><p className="lead">Meet Signal One Integrated Systems.</p><p>The interactive introduction is being prepared. For now, save Andisiwe’s contact or explore Signal One.</p><ContactExchange profile={profile} /><p className="caption">No personal details are collected on this page.</p></main>; }
