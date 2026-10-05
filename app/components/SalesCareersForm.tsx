"use client";

import { FormEvent, useMemo, useState } from "react";

type SubmitState = "idle" | "sending" | "done" | "error";

export default function SalesCareersForm({
  vacancies,
  interviewSlots,
}: {
  vacancies: number;
  interviewSlots: string[];
}) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    experience: "",
    securityExperience: "",
    motivation: "",
    interviewSlot: "",
  });

  const slotLabels = useMemo(
    () =>
      interviewSlots.map((slot) => ({
        value: slot,
        label: new Intl.DateTimeFormat("en-ZA", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Africa/Johannesburg",
        }).format(new Date(slot)),
      })),
    [interviewSlots],
  );

  function update(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cv || !consent || state === "sending") return;
    setState("sending");
    setMessage("");

    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => data.append(key, value));
    data.append("cv", cv);
    data.append("consent", "true");

    try {
      const response = await fetch("/api/careers/sales", { method: "POST", body: data });
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(body.message || "We could not send your application.");
      setState("done");
      setMessage(body.message || "Your application has been received.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send your application.");
    }
  }

  if (vacancies <= 0) {
    return (
      <div className="rounded-[22px] border border-white/10 bg-[#0F131A] p-7 md:p-9">
        <p className="s1-eyebrow">Sales careers</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em]">No sales vacancies are open right now.</h2>
        <p className="mt-4 text-sm leading-7 text-white/58">
          This application journey only opens when Signal One has approved sales vacancies.
        </p>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="rounded-[22px] border border-[#22C55E]/25 bg-[#22C55E]/[.05] p-7 md:p-9">
        <p className="s1-eyebrow">Application received</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em]">Your application is in.</h2>
        <p className="mt-4 text-sm leading-7 text-white/62">{message}</p>
        {values.interviewSlot ? (
          <p className="mt-4 rounded-[12px] border border-white/10 bg-black/15 p-4 text-sm text-white/68">
            Requested interview time: {slotLabels.find((item) => item.value === values.interviewSlot)?.label}
          </p>
        ) : null}
      </div>
    );
  }

  const field =
    "w-full rounded-[12px] border border-white/12 bg-[#0A0D12] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/55 focus:border-[#38BDF8]/60 focus:ring-4 focus:ring-[#0EA5E9]/[.08]";

  return (
    <form onSubmit={submit} className="rounded-[22px] border border-white/10 bg-[#0F131A] p-6 shadow-[0_30px_90px_rgba(0,0,0,.28)] md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="s1-eyebrow">Internal sales role</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.03em]">Apply to join Signal One.</h2>
        </div>
        <span className="rounded-full border border-[#22C55E]/25 bg-[#22C55E]/[.06] px-3 py-1.5 text-xs font-semibold text-[#86EFAC]">
          {vacancies} vacancies open
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/58">
        This is employment recruitment for Signal One&apos;s own sales team. It is not a service that supplies sales representatives to customers.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">Full name</span>
          <input required value={values.fullName} onChange={(e) => update("fullName", e.target.value)} className={field} />
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">City / area</span>
          <input required value={values.city} onChange={(e) => update("city", e.target.value)} placeholder="Johannesburg" className={field} />
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">Email</span>
          <input required type="email" value={values.email} onChange={(e) => update("email", e.target.value)} className={field} />
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">Mobile number</span>
          <input required type="tel" value={values.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="+27" className={field} />
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">B2B sales experience</span>
          <select required value={values.experience} onChange={(e) => update("experience", e.target.value)} className={field}>
            <option value="">Select</option>
            <option>No formal experience</option>
            <option>Less than 1 year</option>
            <option>1–3 years</option>
            <option>3–5 years</option>
            <option>5+ years</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">Security-industry exposure</span>
          <select value={values.securityExperience} onChange={(e) => update("securityExperience", e.target.value)} className={field}>
            <option value="">Select</option>
            <option>None</option>
            <option>Some exposure</option>
            <option>Worked in security sales</option>
            <option>Worked in security operations</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">CV</span>
          <input
            required
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => setCv(event.target.files?.[0] || null)}
            className={field}
          />
          <span className="mt-2 block text-xs text-white/55">PDF, DOC or DOCX · maximum 5 MB.</span>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">Why Signal One?</span>
          <textarea
            required
            rows={4}
            value={values.motivation}
            onChange={(e) => update("motivation", e.target.value)}
            placeholder="Tell us briefly what you have sold, the relationships you can build and why this role fits."
            className={field}
          />
        </label>

        {slotLabels.length ? (
          <label className="sm:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/55">Available interview times</span>
            <select value={values.interviewSlot} onChange={(e) => update("interviewSlot", e.target.value)} className={field}>
              <option value="">I will choose later</option>
              {slotLabels.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
            </select>
            <span className="mt-2 block text-xs text-white/55">Only interview times published by Signal One are shown here.</span>
          </label>
        ) : (
          <div className="sm:col-span-2 rounded-[12px] border border-white/10 bg-white/[.025] p-4 text-sm leading-6 text-white/58">
            No interview times are currently published. If your application is shortlisted, Signal One will contact you when interview slots are available.
          </div>
        )}
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-[12px] border border-white/10 bg-black/15 p-4 text-sm leading-6 text-white/58">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[#0EA5E9]" />
        <span>I consent to Signal One processing my application and CV for recruitment and contacting me about this role.</span>
      </label>

      {message ? (
        <p role="alert" className={"mt-5 rounded-[12px] border px-4 py-3 text-sm " + (state === "error" ? "border-[#F59E0B]/20 bg-[#F59E0B]/[.05] text-[#FCD34D]" : "border-white/10 text-white/70")}>{message}</p>
      ) : null}

      <button
        type="submit"
        disabled={!cv || !consent || state === "sending"}
        className="s1-primary-action mt-6 w-full px-5 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "sending" ? "Sending application…" : "Submit application"}
      </button>
    </form>
  );
}
