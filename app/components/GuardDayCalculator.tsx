"use client";

import { useMemo, useState } from "react";

const PRICE_PER_GUARD_DAY = 2;
const MINIMUM_GUARD_DAYS = 10;

function normalise(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
}

function money(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GuardDayCalculator({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [guards, setGuards] = useState(50);
  const [days, setDays] = useState(30);

  const result = useMemo(() => {
    const requestedGuardDays = guards * days;
    const billableGuardDays =
      requestedGuardDays > 0
        ? Math.max(requestedGuardDays, MINIMUM_GUARD_DAYS)
        : 0;
    const subtotal = billableGuardDays * PRICE_PER_GUARD_DAY;
    const minimumApplied =
      requestedGuardDays > 0 && requestedGuardDays < MINIMUM_GUARD_DAYS;

    return {
      requestedGuardDays,
      billableGuardDays,
      subtotal,
      minimumApplied,
    };
  }, [guards, days]);

  const inputClass =
    "w-full rounded-[12px] border border-white/12 bg-[#0A0D12] px-4 py-3.5 text-lg font-semibold text-white outline-none transition focus:border-[#38BDF8]/60 focus:ring-4 focus:ring-[#0EA5E9]/[.08]";

  return (
    <div
      className={
        compact
          ? "rounded-[18px] border border-white/10 bg-[#0A0D12] p-5 md:p-6"
          : "rounded-[20px] border border-white/10 bg-[#0F131A] p-6 shadow-[0_30px_80px_rgba(0,0,0,.28)] md:p-8"
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="s1-mono mb-2 block text-[8px] text-white/38">
            Guards
          </span>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={guards}
            onChange={(event) =>
              setGuards(normalise(event.target.value, 0))
            }
            className={inputClass}
            aria-label="Number of guards"
          />
        </label>

        <label>
          <span className="s1-mono mb-2 block text-[8px] text-white/38">
            Days
          </span>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={days}
            onChange={(event) => setDays(normalise(event.target.value, 0))}
            className={inputClass}
            aria-label="Number of days"
          />
        </label>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6" aria-live="polite">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="s1-mono text-[8px] text-white/34">
              Guard days
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-.03em] text-white">
              {result.billableGuardDays.toLocaleString("en-ZA")}
            </p>
          </div>
          <div className="text-right">
            <p className="s1-mono text-[8px] text-white/34">
              Ex VAT
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-.04em] text-[#38BDF8]">
              {money(result.subtotal)}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-white/44">
          {result.billableGuardDays > 0
            ? `${result.billableGuardDays.toLocaleString("en-ZA")} × R${PRICE_PER_GUARD_DAY} per guard day`
            : "Enter the guards and days you want to cover."}
        </p>

        {result.minimumApplied ? (
          <div className="mt-4 rounded-[12px] border border-[#F59E0B]/20 bg-[#F59E0B]/[.05] px-4 py-3 text-xs leading-5 text-[#FCD34D]">
            Your calculation is {result.requestedGuardDays} guard days. The
            minimum purchase is 10 guard days, so the estimate uses 10.
          </div>
        ) : null}
      </div>

      {!compact ? (
        <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
          <div>
            <p className="s1-mono text-[8px] text-white/28">Rate</p>
            <p className="mt-2 text-sm font-semibold text-white/70">
              R2 / guard / day
            </p>
          </div>
          <div>
            <p className="s1-mono text-[8px] text-white/28">Minimum</p>
            <p className="mt-2 text-sm font-semibold text-white/70">
              10 guard days
            </p>
          </div>
          <div>
            <p className="s1-mono text-[8px] text-white/28">Unused days</p>
            <p className="mt-2 text-sm font-semibold text-white/70">
              Carry over
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
