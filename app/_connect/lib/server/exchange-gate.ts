import type { IntakeBridgeConfig } from "./intake-bridge.ts";
import { NOTICE_VERSION } from "../introduction.ts";
export type ExchangeConfig = IntakeBridgeConfig & { grantSecret?:string; privacyApproval?:string; noticeVersion?:string };
export function exchangeReady(c:ExchangeConfig):boolean {
  try {
    const u = new URL(c.receiverOrigin ?? "");
    return c.enabled === true && c.publicOrigin === "https://www.signalone.co.za" && u.protocol === "https:" && u.origin === c.receiverOrigin && !u.username && !u.password && !u.search && !u.hash && u.pathname === "/" && c.receiverOrigin === c.allowedReceiverOrigin &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(c.registrationId ?? "") && /^[A-Za-z0-9_-]{1,64}$/u.test(c.keyId ?? "") &&
      Buffer.byteLength(c.secret ?? "") >= 32 && Buffer.byteLength(c.grantSecret ?? "") >= 32 && c.grantSecret !== c.secret &&
      c.noticeVersion === NOTICE_VERSION && /^[A-Za-z0-9][A-Za-z0-9_.:/-]{2,159}$/u.test(c.privacyApproval ?? "");
  } catch { return false; }
}
/** Private operator configuration only. Unset and stale notice versions fail closed. */
export function exchangeConfig():ExchangeConfig {
  return { enabled:process.env.CONNECT_EXCHANGE_ENABLED === "true", publicOrigin:"https://www.signalone.co.za",
    internalOrigin:process.env.CONNECT_INTERNAL_ORIGIN, receiverOrigin:process.env.CONNECT_INTAKE_RECEIVER_ORIGIN,
    allowedReceiverOrigin:process.env.CONNECT_INTAKE_ALLOWED_RECEIVER_ORIGIN,registrationId:process.env.CONNECT_INTAKE_REGISTRATION_ID,
    keyId:process.env.CONNECT_INTAKE_KEY_ID,secret:process.env.CONNECT_INTAKE_SECRET,grantSecret:process.env.CONNECT_VCARD_GRANT_SECRET,
    privacyApproval:process.env.CONNECT_PRIVACY_APPROVAL,noticeVersion:process.env.CONNECT_PRIVACY_NOTICE_VERSION };
}
