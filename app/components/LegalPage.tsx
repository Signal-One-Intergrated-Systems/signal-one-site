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
}: {
  kicker: string;
  title: string;
  intro: ReactNode;
  sections: ReadonlyArray<readonly [string, ReactNode]>;
  footer?: ReactNode;
  /** Shows the "Under legal review." note at the top of the page. */
  reviewNote?: boolean;
}) {
  return (
    <main id="main" className="surface-light">
      <article className="wrap py-16 md:py-24 lg:py-28">
        {reviewNote ? (
          <p className="t-small mb-8 inline-flex rounded-ui border border-line-strong bg-white px-4 py-2 font-semibold">
            Under legal review.
          </p>
        ) : null}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <Kicker>{kicker}</Kicker>
            <h1 className="t-h1 mt-4">{title}</h1>
            <nav aria-label="On this page" className="mt-10 hidden lg:block">
              <ul className="m-0 grid list-none gap-1 border-l border-line p-0">
                {sections.map(([heading]) => (
                  <li key={heading}>
                    <a href={"#" + slug(heading)} className="t-small block py-1.5 pl-4 text-text-2 hover:text-text">
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          <div>
            <div className="t-lead measure text-text-2">{intro}</div>
            <div className="mt-12">
              {sections.map(([heading, body]) => (
                <section key={heading} id={slug(heading)} className="scroll-mt-[96px] border-t border-line py-9">
                  <h2 className="t-h3">{heading}</h2>
                  <div className="t-body measure mt-4 text-text-2">{body}</div>
                </section>
              ))}
            </div>
            {footer ? <div className="t-body measure mt-4 rounded-card bg-white p-6 ring-1 ring-line sm:p-8">{footer}</div> : null}
          </div>
        </div>
      </article>
    </main>
  );
}
