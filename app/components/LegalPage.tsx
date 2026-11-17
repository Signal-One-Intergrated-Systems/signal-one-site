import type { ReactNode } from "react";
import { Kicker } from "./ui";

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Editorial layout for policy and trust pages: contents on the left, text on
 * the right. Layout and typography only; the wording lives in each page.
 */
export default function LegalPage({
  kicker,
  title,
  intro,
  sections,
  footer,
  reviewNote = false,
  className = "",
}: {
  kicker: string;
  title: string;
  intro: ReactNode;
  sections: ReadonlyArray<readonly [string, ReactNode]>;
  footer?: ReactNode;
  /** Shows the "Under legal review." note at the top of the page. */
  reviewNote?: boolean;
  className?: string;
}) {
  return (
    <main id="main" className={"s1-legal-page " + className}>
      <article className="wrap py-12 md:py-16 lg:py-20">
        <div className="s1-legal-layout">
          <header className="s1-legal-header">
            <Kicker tone="dark">{kicker}</Kicker>
            <h1 className="t-h1 mt-4">{title}</h1>
            {reviewNote ? <p className="s1-legal-review">Under legal review.</p> : null}
            <nav aria-label="On this page" className="s1-legal-contents">
              <p className="t-small font-semibold">On this page</p>
              <ul>
                {sections.map(([heading]) => (
                  <li key={heading}>
                    <a href={"#" + slug(heading)}>
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          <div className="s1-legal-content">
            <div className="t-lead measure s1-legal-intro">{intro}</div>
            <div className="mt-8">
              {sections.map(([heading, body]) => (
                <section key={heading} id={slug(heading)} className="s1-legal-section">
                  <h2 className="t-h3">{heading}</h2>
                  <div className="t-body measure mt-4 s1-legal-copy">{body}</div>
                </section>
              ))}
            </div>
            {footer ? <div className="t-body measure mt-4 s1-legal-note">{footer}</div> : null}
          </div>
        </div>
      </article>
    </main>
  );
}
