import type { FounderProfile } from "../lib/profiles";
/** Presenter actions do not bypass the server-enforced reciprocal exchange. */
export function ContactExchange({profile}:{profile:FounderProfile;mode?:"visitor"|"presenter"}) {
  return <div className="actions"><a className="button secondary" href={`/connect/${profile.id}`}>Connect with Andisiwe</a><a className="contact-site-link" href={profile.website}>Visit Signal One</a></div>;
}
