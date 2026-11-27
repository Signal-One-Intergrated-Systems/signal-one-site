import type { PartnerBenefit } from "../lib/partners";
import { Status } from "./ui";

/** Benefit cards for a partner programme. Anything not yet operational is labelled "In development". */
export default function PartnerBenefits({ items }: { items: readonly PartnerBenefit[] }) {
  return (
    <ul className="partner-benefits m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="card flex flex-col p-5 sm:p-6" data-planned={item.planned ? "true" : undefined}>
          <h3 className="t-h4">{item.title}</h3>
          {item.planned ? (
            <p className="mt-2">
              <Status kind="soon">In development</Status>
            </p>
          ) : null}
          <p className="t-small mt-2 text-ink-2">{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}
