"use client";

import { FormEvent, useState } from "react";

type QuoteState = "idle" | "sending" | "done" | "error";

const products = [
  "Hytera PNC360S",
  "Hytera P30",
  "Caltta e600",
  "Vehicle tracking",
  "Asset tracking",
  "Other / mixed requirement",
] as const;

const periods = ["12 months", "24 months", "36 months"] as const;

export default function EquipmentQuoteForm() {
  const [state, setState] = useState<QuoteState>("idle");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [values, setValues] = useState({
    companyName: "",
    contactName: "",
    email: "",
    mobile: "",
    product: products[0] as string,
    quantity: "1",
    rentalPeriod: periods[0],
    notes: "",
  });

  const isTracking = values.product === "Vehicle tracking" || values.product === "Asset tracking";

  function update(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || state === "sending") return;

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "client",
          data: {
            ...values,
            rentalPeriod: isTracking ? "" : values.rentalPeriod,
            intent: isTracking ? "tracking-quote" : "equipment-rental-quote",
          },
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(body.message || "We could not send the quote request.");
      }

      setState("done");
      setMessage(
        body.message ||
          "Your quote request has been received. Signal One will confirm availability, rental terms and pricing.",
      );
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not send the quote request.",
      );
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[18px] border border-[#22C55E]/20 bg-[#22C55E]/[.045] p-7">
        <p className="s1-mono text-[8px] font-semibold text-[#86EFAC]">
          Quote request received
        </p>
        <h3 className="mt-4 text-2xl font-semibold">We have your requirement.</h3>
        <p className="mt-3 text-sm leading-7 text-white/70">{message}</p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-[12px] border border-white/12 bg-[#0A0D12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-[#38BDF8]/60 focus:ring-4 focus:ring-[#0EA5E9]/[.08]";

  return (
    <form onSubmit={submit} className="rounded-[20px] border border-white/10 bg-[#0F131A] p-6 md:p-8">
      <p className="s1-eyebrow">Rental quote</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-.03em]">
        Tell us what the contract needs.
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/66">
        Signal One confirms availability, final product specification and commercial terms before any rental is accepted.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
            Company
          </span>
          <input
            required
            value={values.companyName}
            onChange={(event) => update("companyName", event.target.value)}
            placeholder="Security company"
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
            Contact person
          </span>
          <input
            required
            value={values.contactName}
            onChange={(event) => update("contactName", event.target.value)}
            placeholder="Full name"
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
            Email
          </span>
          <input
            required
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="name@company.co.za"
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
            Phone
          </span>
          <input
            required
            type="tel"
            value={values.mobile}
            onChange={(event) => update("mobile", event.target.value)}
            placeholder="+27"
            className={fieldClass}
          />
        </label>

        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
            Product
          </span>
          <select
            value={values.product}
            onChange={(event) => update("product", event.target.value)}
            className={fieldClass}
          >
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
            Quantity
          </span>
          <input
            required
            min="1"
            step="1"
            type="number"
            inputMode="numeric"
            value={values.quantity}
            onChange={(event) => update("quantity", event.target.value)}
            className={fieldClass}
          />
        </label>

        {isTracking ? (
          <div className="sm:col-span-2 rounded-[12px] border border-[#38BDF8]/18 bg-[#0EA5E9]/[.04] px-4 py-3 text-sm leading-6 text-white/70">
            Tracking is scoped by deployment. Tell us the vehicle or asset count,
            operating area and required visibility in the notes below; commercial
            terms are confirmed in the quote.
          </div>
        ) : (
          <label className="sm:col-span-2">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
              Rental period
            </span>
            <select
              value={values.rentalPeriod}
              onChange={(event) => update("rentalPeriod", event.target.value)}
              className={fieldClass}
            >
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="sm:col-span-2">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[.12em] text-white/70">
            Notes
          </span>
          <textarea
            rows={4}
            value={values.notes}
            onChange={(event) => update("notes", event.target.value)}
            placeholder="Sites, use case, deployment timing, accessories or other requirements."
            className={fieldClass}
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-[12px] border border-white/8 bg-black/15 p-4 text-sm leading-6 text-white/68">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1 accent-[#0EA5E9]"
        />
        <span>
          I consent to Signal One processing these details to prepare and follow
          up on this rental quote.
        </span>
      </label>

      {message ? (
        <p
          role="alert"
          className={
            "mt-5 rounded-[12px] border px-4 py-3 text-sm " +
            (state === "error"
              ? "border-[#F59E0B]/20 bg-[#F59E0B]/[.05] text-[#FCD34D]"
              : "border-white/10 text-white/70")
          }
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!consent || state === "sending"}
        className="s1-primary-action mt-6 w-full px-5 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "sending" ? "Sending…" : "Request rental quote"}
      </button>
    </form>
  );
}
