import type { FounderProfile } from "./profiles";

const escape = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, "\\$&");

export function vcard(profile: FounderProfile) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(profile.familyName)};${escape(profile.givenName)};;;`,
    `FN:${escape(profile.fullName)}`,
    `ORG:${escape(profile.organization)}`,
    `TITLE:${escape(profile.title)}`,
    `EMAIL;TYPE=WORK:${profile.publicEmail}`,
    `TEL;TYPE=CELL:${profile.whatsappPhone}`,
    `TEL;TYPE=WORK,VOICE:${profile.landlinePhone}`,
    `URL:${profile.website}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}
