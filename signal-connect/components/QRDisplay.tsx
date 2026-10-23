import type { VisitorLink } from "../lib/links";

/** Server component. QR and share buttons use the same resolved visitor link. */
export function QRDisplay({ profileId, visitor }: { profileId: string; visitor: VisitorLink | null }) {
  if (!visitor) {
    return (
      <div className="qr-slot" aria-label="QR sharing unavailable">
        <p className="slot-title">A connection starts here.</p>
        <p>QR sharing link is not configured.</p>
        <p className="caption">You can still save the public contact below.</p>
      </div>
    );
  }
  return (
    <div className="qr-slot">
      <p className="slot-title">Scan to connect.</p>
      {/* Native img: fixed-size, same-origin SVG QR must never be blurred or reencoded. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="qr-image"
        src={`/qr/${encodeURIComponent(profileId)}`}
        width={264}
        height={264}
        alt="QR code opening Andisiwe Satshwa’s public Signal Connect visitor page"
        decoding="sync"
      />
      <p className="caption">Point another phone’s camera at this code</p>
    </div>
  );
}
