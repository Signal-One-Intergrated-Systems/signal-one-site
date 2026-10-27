import { createIntakeBridge } from "./intake-bridge.ts";
import { exchangeReady, type ExchangeConfig } from "./exchange-gate.ts";
import { isReceipt } from "../introduction.ts";
import { createGrant, GRANT_COOKIE } from "./vcard-grant.ts";
/** No body read, transport, grant or repository activity until the full private gate is armed. */
export function createReciprocalHandler(config:ExchangeConfig,transport:typeof fetch=fetch) {
  const receive=createIntakeBridge(config,transport);
  return async (request:Request):Promise<Response>=>{
    if(!exchangeReady(config))return Response.json({error:{code:"CONTACT_EXCHANGE_UNAVAILABLE"}},{status:503,headers:{"Cache-Control":"no-store"}});
    const response=await receive(request);
    if(response.status!==200 && response.status!==201)return response;
    const receipt:unknown=await response.clone().json();
    if(!receipt || typeof receipt!=="object" || !("submissionId" in receipt) || !isReceipt(receipt,String(receipt.submissionId)))return Response.json({error:{code:"INTAKE_OUTCOME_UNKNOWN"}},{status:502,headers:{"Cache-Control":"no-store"}});
    response.headers.set("Set-Cookie",`${GRANT_COOKIE}=${createGrant(receipt,config.grantSecret!)}; Path=/; Max-Age=900; Secure; HttpOnly; SameSite=Strict`);
    return response;
  };
}
