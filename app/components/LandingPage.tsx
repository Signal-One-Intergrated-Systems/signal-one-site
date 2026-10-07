import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink, Check, PageHero, Steps } from "./ui";
import { priceSentence } from "../lib/pricing";

/**
 * Product-true landing page: hero, what it does, how it works, what it does
 * not do yet, and the next step. Built only from capabilities that exist.
 */
export default function LandingPage({
  kicker,
  title,
  lead,
  actions,
  aside,
  capabilitiesTitle,
  capabilities,
  stepsTitle,
  steps,
  limits,
  closing,
  related,
}: {
  kicker: string;
  title: string;
  lead: string;
  actions?: ReactNode;
  aside?: ReactNode;
  capabilitiesTitle: string;
  capabilities: ReadonlyArray<readonly [string, string]>;
  stepsTitle: string;
  steps: ReadonlyArray<readonly [string, string]>;
  limits: ReadonlyArray<string>;
  closing: string;
  related: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <main id="main">
      <PageHero kicker={kicker} title={title} lead={lead} actions={actions} aside={aside} />

      <section className="surface-light section">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 className="t-h2">{capabilitiesTitle}</h2>
          <ul className="m-0 grid list-none gap-x-12 p-0 md:grid-cols-2">
            {capabilities.map(([name, body]) => (
              <li key={name} className="border-t border-line py-6">
                <h3 className="t-h4 flex gap-3">
                  <Check className="mt-0.5 text-signal-ink" />
                  {name}
                </h3>
                <p className="t-small mt-2 text-text-2">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-light-2 section">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 className="t-h2">{stepsTitle}</h2>
          <Steps items={steps} />
        </div>
      </section>

      <section className="surface-light section">
        <div className="wrap grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <h2 className="t-h3">What it does not do yet</h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {limits.map((item) => (
              <li key={item} className="t-body text-text-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-deep section">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
          <div>
            <h2 className="t-h2">{closing}</h2>
            <p className="t-lead measure mt-5 text-text-inv-2">{priceSentence}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg">
                Talk to Signal One
              </ButtonLink>
              <ButtonLink href="/pricing#calculator" variant="ghost-dark" size="lg">
                Calculate guard cost
              </ButtonLink>
            </div>
          </div>
          <ul className="m-0 grid list-none gap-3 p-0">
            {related.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="link-arrow text-signal-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
