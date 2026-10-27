import { createHmac, timingSafeEqual } from "node:crypto";
import { UUID, object, exact, type Receipt } from "../introduction.ts";
export const GRANT_COOKIE = "__Host-s1-exchange";
const mac=(raw:string,key:string)=>createHmac("sha256",key).update("signal-connect-vcard-v1\n"+raw).digest("hex");
/** No names, contacts, interests or marketing choice in the HttpOnly grant. */
export function createGrant(receipt:Receipt,key:string,now=Date.now()):string {
  const raw=Buffer.from(JSON.stringify({v:1,profile:"andisiwe",record:receipt.recordId,submission:receipt.submissionId,expires:Math.floor(now/1000)+900})).toString("base64url");
  return raw+"."+mac(raw,key);
}
export function validGrant(token:string|undefined,key:string|undefined,now=Date.now()):boolean {
  if(!token || token.length>700 || !key || Buffer.byteLength(key)<32)return false;
  const parts=token.split(".");if(parts.length!==2 || !/^[a-f0-9]{64}$/u.test(parts[1]))return false;
  if(!timingSafeEqual(Buffer.from(parts[1],"hex"),Buffer.from(mac(parts[0],key),"hex")))return false;
  try {const body:unknown=JSON.parse(Buffer.from(parts[0],"base64url").toString("utf8"));return object(body) && exact(body,["v","profile","record","submission","expires"]) && body.v===1 && body.profile==="andisiwe" && typeof body.record==="string" && UUID.test(body.record) && typeof body.submission==="string" && UUID.test(body.submission) && Number.isSafeInteger(body.expires) && Number(body.expires)>Math.floor(now/1000) && Number(body.expires)<=Math.floor(now/1000)+900;}catch{return false;}
}
export function requestGrant(request:Request):string|undefined {
  const matches=(request.headers.get("cookie")??"").split(";").map(v=>v.trim()).filter(v=>v.startsWith(GRANT_COOKIE+"="));
  return matches.length===1 ? matches[0].slice(GRANT_COOKIE.length+1) : undefined;
}
