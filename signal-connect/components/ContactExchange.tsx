import type { FounderProfile } from "../lib/profiles";

/** Same verified vCard URL in both contexts; only visual emphasis changes. */
export function ContactExchange({
  profile,
  mode = "visitor",
}: {
  profile: FounderProfile;
  mode?: "visitor" | "presenter";
}) {
  return (
    <div className="actions" aria-label="Public contact actions">
      <a
        className={mode === "presenter" ? "button secondary" : "button primary"}
        href={`/contact/${profile.id}`}
        download={`${profile.id}.vcf`}
      >
        Save Andisiwe’s contact
      </a>
      <a className={mode === "presenter" ? "contact-site-link" : "button secondary"} href={profile.website}>
        Visit Signal One
      </a>
    </div>
  );
}
