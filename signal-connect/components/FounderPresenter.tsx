import type { FounderProfile } from "../lib/profiles";
import { resolveVisitorLink } from "../lib/links";
import { ContactExchange } from "./ContactExchange";
import { QRDisplay } from "./QRDisplay";
import { ShareLink } from "./ShareLink";

export function FounderPresenter({ profile }: { profile: FounderProfile }) {
  // One trusted resolution is shared by the QR and both share controls.
  const visitor = resolveVisitorLink(profile.id, process.env.CONNECT_PUBLIC_ORIGIN);

  return (
    <main id="main" className="presenter">
      <section className="identity" aria-label="Founder identity">
        <p className="eyebrow">Good to meet you.</p>
        <h1>{profile.fullName}</h1>
        <p className="role">{profile.title}</p>
        <p className="organisation">{profile.organization}</p>
      </section>
      <section className="exchange" aria-label="Contact exchange">
        <QRDisplay profileId={profile.id} visitor={visitor} />
        <ShareLink url={visitor?.url ?? null} founderName={profile.fullName} />
        <ContactExchange profile={profile} mode="presenter" />
        <p className="caption inbox">Company enquiries · {profile.publicEmail}</p>
      </section>
    </main>
  );
}
