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

/** Andisiwe's founder identity with approved shared Signal One contact channels. */
const andisiwe: FounderProfile = {
  id: "andisiwe",
  fullName: "Andisiwe Satshwa",
  givenName: "Andisiwe",
  familyName: "Satshwa",
  title: "Founder",
  organization: "Signal One Integrated Systems",
  publicEmail: "sales@signalone.co.za",
  whatsappPhone: "+27774844280",
  landlinePhone: "+27100238698",
  website: "https://signalone.co.za",
};

export function getProfile(id: string): FounderProfile | undefined {
  return id === andisiwe.id ? andisiwe : undefined;
}

export function profilePath(id: string, mode: "present" | "connect") {
  return `/${mode}/${encodeURIComponent(id)}`;
}

/** Local display only; action links and the exported vCard retain +27 E.164 numbers. */
export function formatSouthAfricanPhone(phone: string): string {
  if (!/^\+27\d{9}$/.test(phone)) return phone;
  const local = "0" + phone.slice(3);
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}
