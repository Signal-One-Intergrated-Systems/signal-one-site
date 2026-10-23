"use client";

import { useState } from "react";

type ShareLinkProps = {
  url: string | null;
  founderName: string;
};

/**
 * Direct user activation is preserved for Web Share/Clipboard.
 * Cancelling the native share sheet does not imply an error.
 */
export function ShareLink({ url, founderName }: ShareLinkProps) {
  const [status, setStatus] = useState("");
  const [revealUrl, setRevealUrl] = useState(false);

  if (!url) {
    return <p className="share-unavailable" role="status">Sharing is unavailable until the preview link is configured.</p>;
  }

  const reveal = () => {
    setRevealUrl(true);
    setStatus("Use the link below to share this card.");
  };

  function copyLink() {
    setStatus("");
    if (!navigator.clipboard?.writeText) {
      reveal();
      return;
    }
    // Invoke the clipboard within this click, not after awaiting state changes.
    void navigator.clipboard.writeText(url!).then(() => {
      setRevealUrl(false);
      setStatus("Link copied.");
    }).catch(reveal);
  }

  function shareLink() {
    setStatus("");
    if (!navigator.share) {
      copyLink();
      return;
    }
    // Call navigator.share synchronously in the trusted click event.
    void navigator.share({
      title: `${founderName} · Signal One Integrated Systems`,
      text: `Connect with ${founderName} from Signal One Integrated Systems.`,
      url,
    }).then(() => {
      setStatus("");
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (typeof error === "object" && error !== null && "name" in error && error.name === "AbortError") return;
      reveal();
    });
  }

  return (
    <div className="share-controls" aria-label="Share this visitor card">
      <div className="share-actions">
        <button type="button" className="button primary" onClick={shareLink}>Share link</button>
        <button type="button" className="button secondary" onClick={copyLink}>Copy link</button>
      </div>
      <p className="share-status caption" role="status" aria-live="polite">{status}</p>
      {revealUrl && (
        <div className="share-fallback">
          <label htmlFor="visitor-share-url">Visitor link</label>
          <input id="visitor-share-url" type="text" readOnly value={url} onFocus={event => event.currentTarget.select()} />
        </div>
      )}
      <a className="preview-link" href={url} target="_blank" rel="noopener noreferrer">
        Preview the visitor card <span aria-hidden="true">↗</span>
      </a>
      <p className="caption preview-warning">Preview URL only · Not for printed QR or NFC cards</p>
    </div>
  );
}
