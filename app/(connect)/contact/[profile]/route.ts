import { getProfile } from "../../../_connect/lib/profiles";
import { vcard } from "../../../_connect/lib/vcard";
import { exchangeConfig, exchangeReady } from "../../../_connect/lib/server/exchange-gate";
import { requestGrant, validGrant } from "../../../_connect/lib/server/vcard-grant";
export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:Promise<{profile:string}>}) {
  const profile=getProfile((await params).profile);
  const headers={"Cache-Control":"private, no-store","Vary":"Cookie","X-Content-Type-Options":"nosniff"};
  if(!profile)return new Response("Not found",{status:404,headers});
  const config=exchangeConfig();
  if(new URL(request.url).search || !exchangeReady(config) || !validGrant(requestGrant(request),config.grantSecret))return Response.json({error:{code:"CONTACT_EXCHANGE_REQUIRED"}},{status:403,headers});
  return new Response(vcard(profile),{headers:{...headers,"Content-Type":"text/vcard; charset=utf-8","Content-Disposition":`attachment; filename="${profile.id}.vcf"`}});
}
