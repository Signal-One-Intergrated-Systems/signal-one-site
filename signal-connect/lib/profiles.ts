export type FounderProfile = Readonly<{ id: string; fullName: string; familyName: string; givenName: string; title: "Founder"; organization: string; publicEmail: string; website: string }>;
// Public company inbox verified in canonical app/lib/site.ts. No personal phone supplied.
const andisiwe: FounderProfile = { id: "andisiwe", fullName: "Andisiwe Satshwa", givenName: "Andisiwe", familyName: "Satshwa", title: "Founder", organization: "Signal One Integrated Systems", publicEmail: "sales@signalone.co.za", website: "https://signalone.co.za" };
export function getProfile(id: string): FounderProfile | undefined { return id === andisiwe.id ? andisiwe : undefined; }
export function profilePath(id: string, mode: "present" | "connect") { return `/${mode}/${encodeURIComponent(id)}`; }
