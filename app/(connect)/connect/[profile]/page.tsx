import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getProfile } from "../../../_connect/lib/profiles";
import { VisitorIdentity } from "../../../_connect/components/VisitorIdentity";
import { exchangeConfig, exchangeReady } from "../../../_connect/lib/server/exchange-gate";
import { GRANT_COOKIE, validGrant } from "../../../_connect/lib/server/vcard-grant";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{profile:string}>}) {
  const profile=getProfile((await params).profile);if(!profile)notFound();
  const config=exchangeConfig(),enabled=exchangeReady(config);
  const alreadyConnected=enabled && validGrant((await cookies()).get(GRANT_COOKIE)?.value,config.grantSecret);
  return <VisitorIdentity profile={profile} exchangeEnabled={enabled} alreadyConnected={alreadyConnected}/>;
}
