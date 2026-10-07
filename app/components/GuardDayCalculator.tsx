"use client";

import { useId, useMemo, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { num, rand as money } from "../lib/format";
import { billableGuardDays, exVat, guardDayPrice, incVat, minimumPhrase, pricing, vatPercent } from "../lib/pricing";


function normalise(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(parsed, 100000);
}

/**
 * Pure arithmetic: guards × days × the guard-day price (lib/pricing.ts), with
 * the minimum applied. Shows the result ex VAT (the public price) and incl. VAT.
 */
export default function GuardDayCalculator({ heading = "Calculate your guard cost" }: { heading?: string }) {
  const [guards, setGuards] = useState("20");
  const [days, setDays] = useState("30");
  const tracked = useRef(false);
  const id = useId();

  function onInput() {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("guard_pricing_interaction");
  }

  const result = useMemo(() => {
    const requested = normalise(guards) * normalise(days);
    const billable = billableGuardDays(requested);
    const amount = exVat(billable);
    return {
      requested,
      billable,
      exVat: amount,
      incVat: incVat(amount),
      minimumApplied: requested > 0 && requested < pricing.minimumGuardDays,
    };
  }, [guards, days]);

  return (
    <section aria-labelledby={id + "-h"} className="card p-5 sm:p-8">
      <h3 id={id + "-h"} className="t-h3">
        {heading}
      </h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={id + "-guards"} className="field-label">
            Guards on shift
          </label>
          <input
            id={id + "-guards"}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={guards}
            onChange={(event) => {
              onInput();
              setGuards(event.target.value);
            }}
            className="field-input text-[1.375rem] font-semibold tabular"
          />
        </div>
        <div className="field">
          <label htmlFor={id + "-days"} className="field-label">
            Days of cover
          </label>
          <input
            id={id + "-days"}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={days}
            onChange={(event) => {
              onInput();
              setDays(event.target.value);
            }}
            className="field-input text-[1.375rem] font-semibold tabular"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-line pt-6" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="t-small text-text-2">Guard days</p>
            <p className="t-num mt-2 text-[2.25rem] text-text">{num(result.billable)}</p>
          </div>
          <div className="text-right">
            <p className="t-small text-text-2">Total, excl. VAT</p>
            <p className="t-num mt-2 text-[2.75rem] text-signal-600 sm:text-[3.25rem]">{money(result.exVat)}</p>
          </div>
        </div>
        <p className="t-small mt-4 text-text-2">
          {result.billable > 0
            ? num(result.billable) +
              " guard days × " +
              guardDayPrice +
              " = " +
              money(result.exVat) +
              " excl. VAT (" +
              money(result.incVat) +
              " incl. " +
              vatPercent +
              " VAT)."
            : "Enter the number of guards and days you want to cover."}
        </p>
        {result.minimumApplied ? (
          <p className="t-small mt-4 rounded-ui bg-beta-tint px-4 py-3 font-medium text-beta">
            That is {result.requested} guard {result.requested === 1 ? "day" : "days"}. The minimum purchase is {minimumPhrase}, so this estimate uses {pricing.minimumGuardDays}.
          </p>
        ) : null}
      </div>
    </section>
  );
}
