"use client";

import Link from "next/link";
import { useEffect } from "react";
import { salesEmail } from "../lib/site";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="surface-deep">
      <div className="wrap py-16 md:py-24 lg:py-28">
        <p className="t-kicker text-accent">Something went wrong</p>
        <h1 className="t-hero mt-5">This page did not load.</h1>
        <p className="t-lead measure mt-6 text-ink-2">
          Nothing you submitted was lost: forms are only sent when you press send. Try again, or email us at{" "}
          <a href={"mailto:" + salesEmail} className="link-inline font-semibold text-accent">
            {salesEmail}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary btn-lg">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost-dark btn-lg">
            Back to the home page
          </Link>
        </div>
      </div>
    </main>
  );
}
