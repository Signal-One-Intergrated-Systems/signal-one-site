import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The two consent controls every public form carries.
 * - Processing: required, specific to the request being made, links the notice.
 * - Marketing: optional, separate, never pre-ticked.
 */
export default function ConsentFields({
  consent,
  onConsent,
  marketing,
  onMarketing,
  className = "",
  children,
}: {
  consent: boolean;
  onConsent: (value: boolean) => void;
  marketing: boolean;
  onMarketing: (value: boolean) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className} data-consent-fields>
      <label className="check">
        <input type="checkbox" name="consent-processing" aria-required="true" checked={consent} onChange={(event) => onConsent(event.target.checked)} />
        <span className="text-text-2">
          {children}{" "}
          <Link href="/privacy" className="underline underline-offset-2">Privacy notice</Link>
          {" · "}
          <Link href="/popia" className="underline underline-offset-2">POPIA &amp; your rights</Link>
        </span>
      </label>
      <label className="check mt-3">
        <input type="checkbox" name="consent-marketing" checked={marketing} onChange={(event) => onMarketing(event.target.checked)} />
        <span className="text-text-2">
          Optional: Signal One may also send me product news and offers. I can unsubscribe at any time.
        </span>
      </label>
    </div>
  );
}
