import type { ReactNode } from "react";
import { Kicker } from "./ui";

/** Plain editorial layout for policy and trust pages. */
export default function LegalPage({
  kicker,
  title,
  intro,
  sections,
  footer,
}: {
  kicker: string;
  title: string;
  intro: ReactNode;
  sections: ReadonlyArray<readonly [string, ReactNode]>;
  footer?: ReactNode;
}) {
  return (
    <main id="main" className="surface-paper">
      <article className="wrap-narrow py-12 md:py-20">
        <Kicker>{kicker}</Kicker>
        <h1 className="t-h1 mt-4">{title}</h1>
        <div className="t-lead mt-6 text-text-2">{intro}</div>
        <div className="mt-12">
          {sections.map(([heading, body]) => (
            <section key={heading} className="border-t border-line py-8">
              <h2 className="t-h3">{heading}</h2>
              <div className="t-body mt-3 text-text-2">{body}</div>
            </section>
          ))}
        </div>
        {footer ? <div className="t-body mt-4 rounded-card bg-white p-6 ring-1 ring-line">{footer}</div> : null}
      </article>
    </main>
  );
}
