import Link from "next/link";
import { commsComponents, commsFaq, commsIndustries, commsJourneys, quoteHref } from "../lib/offers";

/** The four ways to start with Signal One communications. Compact: one row on desktop, a list on mobile. */
export function CommsJourneys({ headingLevel = 3, idPrefix = "journey" }: { headingLevel?: 2 | 3; idPrefix?: string }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="comms-journeys m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4" aria-label="Four ways to start">
      {commsJourneys.map((j) => (
        <li key={j.id} id={idPrefix + "-" + j.id} className="comms-journey card flex flex-col p-5 sm:p-6">
          <Heading className="t-h4">{j.title}</Heading>
          <p className="t-small mt-1 font-semibold">{j.summary}</p>
          <p className="t-small mt-2 text-ink-2">{j.detail}</p>
          <Link href={quoteHref(j.quoteType)} className="link-arrow mt-auto pt-4 text-accent"
            data-analytics-event="equipment_quote_start" data-analytics-label={"journey-" + j.id}>
            {j.cta} <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** What a communications solution can contain, as one compact definition list. */
export function CommsComponents() {
  return (
    <dl className="comms-components m-0 grid gap-x-10 gap-y-4 sm:grid-cols-2">
      {commsComponents.map(([term, detail]) => (
        <div key={term} className="border-t border-hairline pt-3">
          <dt className="t-small font-semibold">{term}</dt>
          <dd className="t-small m-0 mt-1 text-ink-2">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CommsIndustries() {
  return (
    <ul className="comms-industries m-0 grid list-none gap-x-10 gap-y-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {commsIndustries.map(([industry, use]) => (
        <li key={industry} className="border-t border-hairline pt-3">
          <p className="t-small m-0 font-semibold">{industry}</p>
          <p className="t-small m-0 mt-1 text-ink-2">{use}</p>
        </li>
      ))}
    </ul>
  );
}

export function CommsFaq() {
  return (
    <div className="comms-faq grid gap-0">
      {commsFaq.map(([q, a]) => (
        <details key={q} className="border-t border-hairline py-4">
          <summary className="t-body cursor-pointer font-semibold">{q}</summary>
          <p className="t-small mt-2 measure text-ink-2">{a}</p>
        </details>
      ))}
    </div>
  );
}
