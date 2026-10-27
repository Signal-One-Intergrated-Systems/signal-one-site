import { notFound } from "next/navigation";
import { getProfile } from "../../../_connect/lib/profiles";
import { FounderPresenter } from "../../../_connect/components/FounderPresenter";
export default async function Page({ params }: { params: Promise<{profile: string}> }) { const profile=getProfile((await params).profile); if(!profile) notFound(); return <FounderPresenter profile={profile} />; }
