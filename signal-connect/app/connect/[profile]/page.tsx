import { notFound } from "next/navigation";
import { getProfile } from "../../../lib/profiles";
import { VisitorIdentity } from "../../../components/VisitorIdentity";

export default async function Visitor({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const profile = getProfile((await params).profile);
  if (!profile) notFound();
  return <VisitorIdentity profile={profile} />;
}
