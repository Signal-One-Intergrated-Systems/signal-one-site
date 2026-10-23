import type { FounderProfile } from "../lib/profiles";
import { ContactExchange } from "./ContactExchange";
import { QRDisplay } from "./QRDisplay";

export function FounderPresenter({ profile }: { profile: FounderProfile }) {
  return (
    <main id="main" className="presenter">
      <section className="identity">
        <p className="eyebrow">Good to meet you.</p>
        <h1>{profile.fullName}</h1>
        <p className="role">{profile.title}</p>
        <p className="organisation">{profile.organization}</p>
      </section>
      <section className="exchange" aria-label="Contact exchange">
        <QRDisplay profileId={profile.id} />
        <ContactExchange profile={profile} />
        <p className="caption inbox">Company enquiries · {profile.publicEmail}</p>
      </section>
    </main>
  );
}
