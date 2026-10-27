/** Server transport only. Node crypto makes this module unavailable to browser
 * bundles; no client component imports it. Credentials are private route config.
 * This adapter does not activate the existing manual form or create consent. */
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { parseIntroduction, isReceipt, type Introduction } from "../introduction.ts";
export const RECEIVER_PATH = "/api/v1/integrations/signal-connect/v1/intake";
const LIMIT = 8192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type IntakeBridgeConfig = Readonly<{
  enabled: boolean;
  publicOrigin?: string;
  internalOrigin?: string;
  receiverOrigin?: string;
  allowedReceiverOrigin?: string;
  registrationId?: string;
  keyId?: string;
  secret?: string;
}>;
const hash = (raw: string) => createHash("sha256").update(raw).digest("hex");
const mac = (secret: string, raw: string) => createHmac("sha256", secret).update(raw).digest("hex");
function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function keys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  return Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
}
function httpsOrigin(value: string | undefined): string | null {
  if (!value || value !== value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash &&
      value === url.origin ? url.origin : null;
  } catch { return null; }
}
class BodyLimitError extends Error {}
async function boundedText(body: ReadableStream<Uint8Array> | null, limit: number): Promise<string> {
  if (!body) return "";
  const reader=body.getReader();const chunks:Uint8Array[]=[];let length=0;const expires=Date.now()+3000;
  try {
    while (true) {
      const result=await deadline(reader.read(),Math.max(1,expires-Date.now()),()=>{void reader.cancel().catch(()=>undefined);});if(result.done)break;
      length+=result.value.byteLength;
      if(length>limit){await reader.cancel();throw new BodyLimitError("body limit");}
      chunks.push(result.value);
    }
    const joined=new Uint8Array(length);let offset=0;
    for(const chunk of chunks){joined.set(chunk,offset);offset+=chunk.length;}
    return new TextDecoder("utf-8",{fatal:true}).decode(joined);
  } finally { reader.releaseLock(); }
}
async function deadline<T>(operation:Promise<T>, milliseconds:number, abort:()=>void):Promise<T> {
  let timer:ReturnType<typeof setTimeout>|undefined;
  try {return await Promise.race([operation,new Promise<never>((_resolve,reject)=>{timer=setTimeout(()=>{abort();reject(new Error("deadline"));},milliseconds);})]);}
  finally {if(timer)clearTimeout(timer);}
}
function reply(status:number,code:string):Response {
  return Response.json({error:{code}},{status,headers:{"Cache-Control":"no-store"}});
}

/** Production route uses default fetch. Test injection may supply a local trusted
 * HTTPS transport; it cannot alter target configuration or receipt verification.
 * Per-replica fixed-size budget, not a claim of global/per-IP rate enforcement. */
/** Optional exact Next internal URL produced behind a TLS proxy. This is private
 * operator configuration, never an origin derived from request headers. Only a
 * loopback HTTPS URL is eligible; the owned TLS edge must preserve canonical Host,
 * forwarded Host and HTTPS, and the browser Origin remains independently checked.
 */
function trustedInternalOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && ["127.0.0.1", "localhost", "[::1]"].includes(u.hostname) &&
      u.origin === value && !u.username && !u.password && u.pathname === "/" && !u.search && !u.hash ? u.origin : null;
  } catch { return null; }
}
export function createIntakeBridge(config:IntakeBridgeConfig,transport:typeof fetch=fetch):(request:Request)=>Promise<Response> {
  let windowStart=Date.now(),attempts=0;
  return async request=>{
    const receiver=httpsOrigin(config.receiverOrigin),allowed=httpsOrigin(config.allowedReceiverOrigin);
    const visitor=config.publicOrigin === "https://www.signalone.co.za" ? {url:config.publicOrigin+"/connect/andisiwe"} : null;
    const internal=trustedInternalOrigin(config.internalOrigin);
    if(config.enabled !== true || !visitor || !receiver || receiver!==allowed ||
      (config.internalOrigin !== undefined && !internal) ||
      !config.registrationId || !UUID.test(config.registrationId) || !config.keyId || !/^[A-Za-z0-9_-]{1,64}$/.test(config.keyId) ||
      !config.secret || Buffer.byteLength(config.secret)<32) return reply(503,"INTAKE_UNAVAILABLE");
    const publicOrigin=new URL(visitor.url).origin;
    const url=new URL(request.url);
    const proxyOrigin = internal !== null && url.origin === internal &&
      request.headers.get("host") === new URL(publicOrigin).host &&
      request.headers.get("x-forwarded-host") === new URL(publicOrigin).host && request.headers.get("x-forwarded-proto") === "https";
    if(request.method!=="POST" || (url.origin!==publicOrigin && !proxyOrigin) || url.search || request.headers.get("origin")!==publicOrigin ||
      request.headers.get("sec-fetch-site")==="cross-site") return reply(403,"INTAKE_DENIED");
    if(Date.now()-windowStart>=60_000){windowStart=Date.now();attempts=0;}
    if(++attempts>30){const r=reply(429,"INTAKE_RATE_LIMITED");r.headers.set("Retry-After","60");return r;}
    if(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json" || request.headers.has("content-encoding")) return reply(400,"INVALID_INTAKE");
    const length=request.headers.get("content-length");
    if(length && (!/^\d+$/.test(length)||Number(length)>LIMIT)) return reply(413,"INTAKE_TOO_LARGE");
    let input:Introduction|null;
    try {
      const raw=await boundedText(request.body,LIMIT);
      input=parseIntroduction(JSON.parse(raw));
    } catch (error) {return reply(error instanceof BodyLimitError ? 413 : 400,error instanceof BodyLimitError ? "INTAKE_TOO_LARGE" : "INVALID_INTAKE");}
    if(!input)return reply(400,"INVALID_INTAKE");
    const raw=JSON.stringify(input),bodyHash=hash(raw),timestamp=String(Math.floor(Date.now()/1000)),nonce=randomUUID();
    const registration=config.registrationId.toLowerCase(),keyId=config.keyId;
    const signature=mac(config.secret,["signal-connect-request-v1",registration,keyId,timestamp,nonce,publicOrigin,"POST",RECEIVER_PATH,bodyHash].join("\n"));
    const abort=new AbortController();
    try {
      const response=await deadline(transport(receiver+RECEIVER_PATH,{method:"POST",redirect:"manual",credentials:"omit",cache:"no-store",signal:abort.signal,
        headers:{"Content-Type":"application/json","X-S1-Integration":registration,"X-S1-Key-Id":keyId,"X-S1-Timestamp":timestamp,"X-S1-Nonce":nonce,"X-S1-Source-Origin":publicOrigin,"X-S1-Signature":signature},body:raw}),5000,()=>abort.abort());
      if(response.status!==200 && response.status!==201){await response.body?.cancel();return reply(502,"INTAKE_OUTCOME_UNKNOWN");}
      const received=await deadline(boundedText(response.body,LIMIT),5000,()=>abort.abort());
      const actual=response.headers.get("X-S1-Receipt-Signature")??"";
      const expected=mac(config.secret,["signal-connect-receipt-v1",registration,keyId,timestamp,nonce,bodyHash,String(response.status),hash(received)].join("\n"));
      if(!/^[a-f0-9]{64}$/.test(actual) || !timingSafeEqual(Buffer.from(actual,"hex"),Buffer.from(expected,"hex"))) return reply(502,"INTAKE_OUTCOME_UNKNOWN");
      const receipt:unknown=JSON.parse(received);
      if(!object(receipt)||!keys(receipt,["status","source","persisted","recordId","submissionId"])||!isReceipt(receipt,input.submissionId)||
        (response.status===201)!==(receipt.status==="created"))return reply(502,"INTAKE_OUTCOME_UNKNOWN");
      return Response.json(receipt,{status:response.status,headers:{"Cache-Control":"no-store"}});
    } catch {return reply(502,"INTAKE_OUTCOME_UNKNOWN");}
  };
}
