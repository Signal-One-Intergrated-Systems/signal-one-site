import { notFound } from "next/navigation";
import { getProfile } from "../../../lib/profiles";
import { FounderPresenter } from "../../../components/FounderPresenter";
export default async function Presenter({ params }: { params: Promise<{ profile: string }> }) { const profile = getProfile((await params).profile); if (!profile) notFound(); return <FounderPresenter profile={profile} />; }
