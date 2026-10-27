import { notFound } from "next/navigation";
import { getProfile } from "../../../_connect/lib/profiles";
import { VisitorIdentity } from "../../../_connect/components/VisitorIdentity";
export default async function Page({ params }: { params: Promise<{profile: string}> }) { const profile=getProfile((await params).profile); if(!profile) notFound(); return <VisitorIdentity profile={profile} />; }
