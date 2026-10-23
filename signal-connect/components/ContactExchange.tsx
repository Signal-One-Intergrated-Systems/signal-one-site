import type { FounderProfile } from "../lib/profiles";

/** Public vCard saving is never gated by reverse exchange or discovery. */
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
      {mode === "presenter" && (
        <a className="contact-site-link" href={profile.website}>
          Visit Signal One
        </a>
      )}
    </div>
  );
}
