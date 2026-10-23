import type { FounderProfile } from "../lib/profiles";

/** Download triggers the native vCard flow; it does not claim contact was saved. */
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
        aria-label="Save Andisiwe’s contact"
      >
        {mode === "visitor" ? "Save Contact" : "Save Andisiwe’s contact"}
      </a>
      {mode === "presenter" && (
        <a className="contact-site-link" href={profile.website}>
          Visit Signal One
        </a>
      )}
    </div>
  );
}
