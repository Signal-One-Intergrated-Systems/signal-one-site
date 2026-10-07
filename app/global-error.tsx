"use client";

import "./globals.css";

/** Last-resort boundary when the root layout itself fails. Plain and on brand. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-ZA">
      <body className="surface-deep" style={{ minHeight: "100vh" }}>
        <main className="wrap py-32">
          <p className="t-kicker text-signal-400">Something went wrong</p>
          <h1 className="t-hero mt-5">Signal One is not available right now.</h1>
          <p className="t-lead measure mt-6 text-text-inv-2">
            Please try again, or email{" "}
            <a href="mailto:sales@signalone.co.za" className="link-inline font-semibold text-signal-400">
              sales@signalone.co.za
            </a>
            .
          </p>
          <button type="button" onClick={reset} className="btn btn-primary btn-lg mt-8">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
