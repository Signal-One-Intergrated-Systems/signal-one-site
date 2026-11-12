/** The stored record's identifier, shown only when the receiver confirmed the save. */
export default function ReceiptReference({ reference, className = "" }: { reference: string | null; className?: string }) {
  if (!reference) return null;
  return (
    <p data-receipt-reference className={"t-small mt-3 font-semibold " + className}>
      Reference: <span className="font-mono">{reference}</span>. Keep this if you contact us about the request.
    </p>
  );
}
