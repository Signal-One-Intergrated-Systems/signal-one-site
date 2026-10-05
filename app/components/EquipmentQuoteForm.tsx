"use client";

import { FormEvent, useMemo, useState } from "react";

type QuoteState = "idle" | "sending" | "done" | "error";
type ProductKind = "radio-rental" | "bodycam-rental" | "sale" | "subscription" | "tracking" | "mixed";

const products = [
  { value: "RENT-PNC360S", label: "PNC360S PoC radio rental", kind: "radio-rental" },
  { value: "RENT-P30LITE", label: "P30 Lite PoC radio rental", kind: "radio-rental" },
  { value: "HYTERA-P30-PRO", label: "Hytera P30 Pro radio purchase", kind: "sale" },
  { value: "HYTERA-P30-LITE", label: "Hytera P30 Lite radio purchase", kind: "sale" },
  { value: "E600-POC-LTE", label: "E600 PoC LTE radio purchase", kind: "sale" },
  { value: "PTT-PLATFORM-SIM", label: "PTT platform access + SIM and data", kind: "subscription" },
  { value: "FMC920", label: "FMC920 vehicle tracker", kind: "tracking" },
  { value: "FMB920", label: "FMB920 vehicle tracker", kind: "tracking" },
  { value: "TRACKER-PLATFORM-M", label: "Tracker platform subscription", kind: "tracking" },
  { value: "SC780-BODYCAM-RENTAL", label: "SC780 body camera rental", kind: "bodycam-rental" },
  { value: "OTHER", label: "Other / mixed requirement", kind: "mixed" },
] as const satisfies ReadonlyArray<{ value: string; label: string; kind: ProductKind }>;

const radioPeriods = ["12 months", "24 months", "36 months"] as const;

export default function EquipmentQuoteForm() {
  const [state, setState] = useState<QuoteState>("idle");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [values, setValues] = useState({
    companyName: "",
    contactName: "",
    email: "",
    mobile: "",
    product: products[0].value,
    quantity: "1",
    rentalPeriod: radioPeriods[0],
    notes: "",
  });

  const selectedProduct = useMemo(
    () => products.find((item) => item.value === values.product) || products[0],
    [values.product],
  );
  const showRentalPeriod =
    selectedProduct.kind === "radio-rental" || selectedProduct.kind === "bodycam-rental";
  const periods =
    selectedProduct.kind === "bodycam-rental" ? (["24 months"] as const) : radioPeriods;

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
            companyName: values.companyName,
            contactName: values.contactName,
            email: values.email,
            mobile: values.mobile,
            productCode: selectedProduct.value,
            product: selectedProduct.label,
            quantity: values.quantity,
            rentalPeriod: showRentalPeriod ? values.rentalPeriod : null,
            notes: values.notes,
            intent: "equipment-quote",
          },
        }),
      });

      const body = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(body.message || "We could not send the quote request.");
      }

      setState("done");
      setMessage(
        body.message ||
          "Your request has been received. Signal One will confirm product fit, availability and commercial terms.",
      );
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : "We could not send the quote request.",
      );
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[18px] border border-[#22C55E]/20 bg-[#22C55E]/[.045] p-7">
        <p className="s1-mono font-semibold text-[#86EFAC]">Quote request received</p>
        <h3 className="mt-4 text-2xl font-semibold">We have your requirement.</h3>
        <p className="mt-3 text-sm leading-7 text-white/55">{message}</p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-[12px] border border-white/12 bg-[#0A0D12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/55 focus:border-[#38BDF8]/60 focus:ring-4 focus:ring-[#0EA5E9]/[.08]";

  return (
    <form onSubmit={submit} className="rounded-[20px] border border-white/10 bg-[#0F131A] p-6 md:p-8">
      <p className="s1-eyebrow">Radios & tracking quote</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-.03em]">
        Tell us what the contract needs.
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/55">
        Choose from the current Signal One commercial catalogue. We confirm stock,
        deployment fit and the final commercial terms before an order or rental is accepted.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Company</span>
          <input required value={values.companyName} onChange={(event) => update("companyName", event.target.value)} placeholder="Security company" className={fieldClass} />
        </label>

        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Contact person</span>
          <input required value={values.contactName} onChange={(event) => update("contactName", event.target.value)} placeholder="Full name" className={fieldClass} />
        </label>

        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Email</span>
          <input required type="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder="name@company.co.za" className={fieldClass} />
        </label>

        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Phone</span>
          <input required type="tel" value={values.mobile} onChange={(event) => update("mobile", event.target.value)} placeholder="+27" className={fieldClass} />
        </label>

        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Product</span>
          <select
            value={values.product}
            onChange={(event) => {
              update("product", event.target.value);
              const next = products.find((item) => item.value === event.target.value);
              if (next?.kind === "bodycam-rental") update("rentalPeriod", "24 months");
            }}
            className={fieldClass}
          >
            {products.map((product) => (
              <option key={product.value} value={product.value}>{product.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Quantity</span>
          <input required min="1" step="1" type="number" inputMode="numeric" value={values.quantity} onChange={(event) => update("quantity", event.target.value)} className={fieldClass} />
        </label>

        {showRentalPeriod ? (
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Rental period</span>
            <select value={values.rentalPeriod} onChange={(event) => update("rentalPeriod", event.target.value)} className={fieldClass}>
              {periods.map((period) => <option key={period} value={period}>{period}</option>)}
            </select>
          </label>
        ) : (
          <div className="sm:col-span-2 rounded-[12px] border border-white/10 bg-white/[.025] px-4 py-3 text-sm leading-6 text-white/58">
            No radio-rental term is forced for this selection. Signal One will confirm the relevant purchase,
            subscription or tracking terms in the quote.
          </div>
        )}

        <label className="sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-white/55">Notes</span>
          <textarea
            rows={4}
            value={values.notes}
            onChange={(event) => update("notes", event.target.value)}
            placeholder="Sites, use case, deployment timing, accessories or other requirements."
            className={fieldClass}
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-[12px] border border-white/8 bg-black/15 p-4 text-sm leading-6 text-white/58">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-[#0EA5E9]" />
        <span>I consent to Signal One processing these details to prepare and follow up on this quote.</span>
      </label>

      {message ? (
        <p role="alert" className={"mt-5 rounded-[12px] border px-4 py-3 text-sm " + (state === "error" ? "border-[#F59E0B]/20 bg-[#F59E0B]/[.05] text-[#FCD34D]" : "border-white/10 text-white/70")}>
          {message}
        </p>
      ) : null}

      <button type="submit" disabled={!consent || state === "sending"} className="s1-primary-action mt-6 w-full px-5 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">
        {state === "sending" ? "Sending…" : "Request quote"}
      </button>
    </form>
  );
}
