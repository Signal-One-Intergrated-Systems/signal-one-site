import type { IntakeFallback } from "../lib/intake";

/** Error text for a failed submit, with a prefilled email fallback when the form service is down. */
export default function IntakeError({ message, fallback }: { message: string; fallback: IntakeFallback | null }) {
  if (!message) return null;
  return (
    <div className="mt-4">
      <p className="field-error">{message}</p>
      {fallback ? (
        <p className="t-body mt-2">
          Nothing was lost. Email us at{" "}
          <a href={fallback.href} className="font-semibold underline underline-offset-2">
            {fallback.email}
          </a>{" "}
          and your answers will be filled in for you to send.
        </p>
      ) : null}
    </div>
  );
}
