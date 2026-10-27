import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getProfile } from "../../../_connect/lib/profiles";
import { FounderPresenter } from "../../../_connect/components/FounderPresenter";
import { exchangeConfig, exchangeReady } from "../../../_connect/lib/server/exchange-gate";
import { GRANT_COOKIE, validGrant } from "../../../_connect/lib/server/vcard-grant";
export const dynamic="force-dynamic";
export default async function Page({ params }: { params: Promise<{profile: string}> }) {
  const profile=getProfile((await params).profile);if(!profile)notFound();
  const config=exchangeConfig(),enabled=exchangeReady(config);
  const connected=enabled && validGrant((await cookies()).get(GRANT_COOKIE)?.value,config.grantSecret);
  return <FounderPresenter profile={profile} showContactDetails={!enabled || connected}/>;
}
