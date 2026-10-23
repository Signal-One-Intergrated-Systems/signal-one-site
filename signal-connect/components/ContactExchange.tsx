import type { FounderProfile } from "../lib/profiles";
export function ContactExchange({ profile }: { profile: FounderProfile }) { return <div className="actions"><a className="button primary" href={`/contact/${profile.id}`} download={`${profile.id}.vcf`}>Save Andisiwe’s contact</a><a className="button secondary" href={profile.website}>Visit Signal One</a></div>; }
