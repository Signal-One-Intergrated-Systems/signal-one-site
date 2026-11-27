import type { IntakeFallback } from "../lib/intake";

/**
 * What a visitor sees when a submit did not reach Signal One. With an email fallback (form service not
 * connected, unconfirmed or down) it is a neutral next step with one clear button, not a red error:
 * nothing was received, and the visitor's answers are ready in an email to send (SW-08). Without a
 * fallback it is an error the visitor can fix.
 */
export default function IntakeError({ message, fallback }: { message: string; fallback: IntakeFallback | null }) {
  if (!message) return null;
  if (!fallback) {
    return (
      <div className="mt-4">
        <p className="field-error">{message}</p>
      </div>
    );
  }
  return (
    <div className="intake-fallback mt-5 rounded-card border border-line-strong bg-surface-2 p-5">
      <p className="t-body m-0 font-semibold text-ink">Your answers are ready to send by email.</p>
      <p className="t-small mt-2 text-ink-2">{message}</p>
      <a href={fallback.href} className="btn btn-primary mt-4 inline-flex">
        Open the email to send it
      </a>
      <p className="t-caption mt-3 text-ink-2">
        It opens in your email app, addressed to {fallback.email} with your answers filled in. Nothing reaches Signal One until you send it.
      </p>
    </div>
  );
}
