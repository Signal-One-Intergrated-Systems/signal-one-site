export type FounderProfile = Readonly<{
  id: string;
  fullName: string;
  familyName: string;
  givenName: string;
  title: "Founder";
  organization: string;
  publicEmail: string;
  whatsappPhone: string;
  landlinePhone: string;
  website: string;
}>;

/** Andisiwe's approved public business contact details. */
const andisiwe: FounderProfile = {
  id: "andisiwe",
  fullName: "Andisiwe Satshwa",
  givenName: "Andisiwe",
  familyName: "Satshwa",
  title: "Founder",
  organization: "Signal One Integrated Systems",
  publicEmail: "andisiwe@signalone.co.za",
  whatsappPhone: "+27606335870",
  landlinePhone: "+27100231810",
  website: "https://signalone.co.za",
};

export function getProfile(id: string): FounderProfile | undefined {
  return id === andisiwe.id ? andisiwe : undefined;
}

export function profilePath(id: string, mode: "present" | "connect") {
  return `/${mode}/${encodeURIComponent(id)}`;
}
