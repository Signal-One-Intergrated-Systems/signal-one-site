import { resolveVisitorLink } from "../lib/links";

/** A server component: untrusted request hosts cannot influence the QR code. */
export function QRDisplay({ profileId }: { profileId: string }) {
  const visitor = resolveVisitorLink(profileId, process.env.CONNECT_PUBLIC_ORIGIN);
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
      <img
        className="qr-image"
        src={`/qr/${encodeURIComponent(profileId)}`}
        width={264}
        height={264}
        alt="QR code opening Andisiwe Satshwa’s public Signal Connect visitor page"
        decoding="sync"
      />
      <p className="caption">Preview link only · Not for printing</p>
    </div>
  );
}
