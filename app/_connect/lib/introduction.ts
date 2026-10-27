import { isInterestId, type InterestId } from "./interests.ts";
export const NOTICE_VERSION = "signal-connect-exchange-2026-10-27" as const;
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type Introduction = {
  version: 2; source: "signal_connect"; presenterId: "andisiwe"; submissionId: string;
  contact: { name: string; email: string | null; phone: string | null; company: string | null };
  interests: InterestId[]; otherSpecification: string | null; message: string | null;
  consent: { purpose: "respond_to_introduction"; noticeVersion: typeof NOTICE_VERSION; affirmative: true };
  marketingConsent: { purpose: "signal_one_marketing"; noticeVersion: typeof NOTICE_VERSION; affirmative: boolean };
};
export function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }
export function exact(value: Record<string, unknown>, keys: string[]): boolean { return Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value,key)); }
function text(value: unknown, max: number, nullable = false): boolean {
  return nullable && value === null || typeof value === "string" && value === value.trim() && value.length > 0 && value.length <= max && !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/u.test(value);
}
/** Validate independently at the public server boundary. Never accept tenant, owner or timestamps. */
export function parseIntroduction(value: unknown): Introduction | null {
  if (!object(value) || !exact(value,["version","source","presenterId","submissionId","contact","interests","otherSpecification","message","consent","marketingConsent"]) ||
    value.version !== 2 || value.source !== "signal_connect" || value.presenterId !== "andisiwe" || typeof value.submissionId !== "string" || !UUID.test(value.submissionId) ||
    !object(value.contact) || !exact(value.contact,["name","email","phone","company"]) || !text(value.contact.name,160) || !text(value.contact.company,160,true) ||
    !text(value.contact.email,320,true) || !text(value.contact.phone,32,true) || value.contact.email === null && value.contact.phone === null ||
    typeof value.contact.email === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value.contact.email) ||
    typeof value.contact.phone === "string" && (!/^\+?[0-9 ()-]+$/u.test(value.contact.phone) || !/^[0-9]{7,15}$/u.test(value.contact.phone.replace(/\D/gu,""))) ||
    !Array.isArray(value.interests) || !value.interests.length || value.interests.length > 20 || !value.interests.every(isInterestId) || new Set(value.interests).size !== value.interests.length ||
    !text(value.otherSpecification,160,true) || value.otherSpecification !== null && !value.interests.includes("other") || !text(value.message,2000,true) ||
    !object(value.consent) || !exact(value.consent,["purpose","noticeVersion","affirmative"]) || value.consent.purpose !== "respond_to_introduction" || value.consent.noticeVersion !== NOTICE_VERSION || value.consent.affirmative !== true ||
    !object(value.marketingConsent) || !exact(value.marketingConsent,["purpose","noticeVersion","affirmative"]) || value.marketingConsent.purpose !== "signal_one_marketing" || value.marketingConsent.noticeVersion !== NOTICE_VERSION || typeof value.marketingConsent.affirmative !== "boolean") return null;
  return value as Introduction;
}
export type Receipt = {status:"created"|"existing";source:"signal_connect";persisted:true;recordId:string;submissionId:string};
export function isReceipt(value:unknown,id:string): value is Receipt {
  return object(value) && exact(value,["status","source","persisted","recordId","submissionId"]) && (value.status === "created" || value.status === "existing") && value.source === "signal_connect" && value.persisted === true && typeof value.recordId === "string" && UUID.test(value.recordId) && value.submissionId === id;
}
