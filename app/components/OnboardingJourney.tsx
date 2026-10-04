"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from "react";

export type JourneyField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  hint?: string;
};

export type JourneyStep = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  fields?: JourneyField[];
  review?: boolean;
};

export type JourneyWorld = {
  kind: "client" | "sales" | "guard";
  storageKey: string;
  badge: string;
  welcomeTitle: string;
  welcomeBody: string;
  welcomePoints: string[];
  image: string;
  imageAlt: string;
  accent: string;
  accentRgb: string;
  completionTitle: string;
  completionBody: string;
  completionHref: string;
  completionCta: string;
};

type SubmitState = "idle" | "sending" | "done" | "error";

export default function OnboardingJourney({
  world,
  steps,
}: {
  world: JourneyWorld;
  steps: JourneyStep[];
}) {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const allFields = useMemo(
    () => steps.flatMap((step) => step.fields || []),
    [steps],
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(world.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          stepIndex?: number;
          values?: Record<string, string>;
          consent?: boolean;
        };
        if (parsed.values && typeof parsed.values === "object") setValues(parsed.values);
        if (typeof parsed.consent === "boolean") setConsent(parsed.consent);
        if (
          typeof parsed.stepIndex === "number" &&
          parsed.stepIndex >= 0 &&
          parsed.stepIndex <= steps.length
        ) {
          setStepIndex(parsed.stepIndex);
        }
      }
    } catch {
      // Local progress is a convenience only; onboarding still works without it.
    } finally {
      setHydrated(true);
    }
  }, [steps.length, world.storageKey]);

  useEffect(() => {
    if (!hydrated || state === "done") return;
    window.localStorage.setItem(
      world.storageKey,
      JSON.stringify({ stepIndex, values, consent }),
    );
  }, [consent, hydrated, state, stepIndex, values, world.storageKey]);

  const current = stepIndex === 0 ? null : steps[stepIndex - 1];
  const totalMoments = steps.length + 1;
  const progress = Math.max(4, ((stepIndex + 1) / totalMoments) * 100);

  const style = {
    "--journey-accent": world.accent,
    "--journey-accent-rgb": world.accentRgb,
    backgroundImage:
      "radial-gradient(circle at 12% 12%, rgba(" +
      world.accentRgb +
      ",.18), transparent 28%), radial-gradient(circle at 84% 22%, rgba(56,189,248,.09), transparent 24%), linear-gradient(145deg,#0A0D12 0%,#151A21 50%,#0F131A 100%)",
  } as CSSProperties;

  function update(name: string, value: string) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function next(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setMessage("");
    setStepIndex((currentIndex) => Math.min(currentIndex + 1, steps.length));
  }

  function back() {
    setMessage("");
    setStepIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  async function submit() {
    if (!consent || state === "sending") return;
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: world.kind, data: values }),
      });
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        throw new Error(body.message || "We could not send this application.");
      }
      setState("done");
      setMessage(body.message || "Your Signal One application has been received.");
      window.localStorage.removeItem(world.storageKey);
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : "We could not send this application.",
      );
    }
  }

  const panelMotion = reducedMotion
    ? { duration: 0 }
    : { duration: 0.52, ease: [0.16, 1, 0.3, 1] as const };

  if (state === "done") {
    return (
      <main
        className="relative min-h-screen overflow-hidden px-5 pb-16 pt-32 text-white md:pt-40"
        style={style}
        data-onboarding-world={world.kind}
      >
        <div className="absolute inset-0 opacity-25">
          <Image src={world.image} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[#071018]/80" />
        </div>
        <motion.section
          initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={panelMotion}
          className="relative mx-auto grid min-h-[66vh] max-w-4xl place-items-center"
        >
          <div className="w-full rounded-[24px] border border-white/12 bg-[#0A0D12]/80 p-8 text-center shadow-[0_38px_120px_rgba(0,0,0,.46)] backdrop-blur-xl md:p-14">
            <div
              className="mx-auto grid h-16 w-16 place-items-center rounded-full border text-2xl shadow-[0_0_50px_rgba(var(--journey-accent-rgb),.24)]"
              style={{ borderColor: "rgba(" + world.accentRgb + ",.42)", color: world.accent }}
            >
              ✓
            </div>
            <p className="mt-7 s1-mono text-[9px] font-semibold" style={{ color: world.accent }}>
              Signal One · Application received
            </p>
            <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-.04em] md:text-5xl">
              {world.completionTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/58">
              {message || world.completionBody}
            </p>
            <Link
              href={world.completionHref}
              className="mt-8 inline-flex rounded-[12px] px-6 py-3 text-sm font-semibold text-[#071018] transition hover:brightness-110"
              style={{ backgroundColor: world.accent }}
            >
              {world.completionCta}
            </Link>
          </div>
        </motion.section>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden px-5 pb-14 pt-28 text-white md:pt-32"
      style={style}
      data-onboarding-world={world.kind}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-full opacity-[.16] lg:w-[52%]">
          <Image
            src={world.image}
            alt={world.imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#080d13]/40 via-[#080d13]/82 to-[#080d13]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[90rem]">
        <div className="mb-5 flex items-center justify-between gap-4 text-xs text-white/42">
          <span className="font-semibold uppercase tracking-[.2em]">{world.badge}</span>
          <span>{hydrated ? "Progress saved on this device" : "Preparing your journey…"}</span>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: String(progress) + "%" }}
            transition={panelMotion}
            style={{ backgroundColor: world.accent }}
          />
        </div>

        <div className="mt-7 grid min-h-[650px] gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <aside className="relative hidden overflow-hidden rounded-[24px] border border-white/10 bg-white/[.035] lg:block">
            <Image src={world.image} alt="" fill className="object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b11] via-[#070b11]/58 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="s1-mono text-[9px] font-semibold" style={{ color: world.accent }}>
                {world.badge}
              </p>
              <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-[-.035em]">
                {stepIndex === 0 ? world.welcomeTitle : current?.title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                {stepIndex === 0 ? world.welcomeBody : current?.body}
              </p>
            </div>
          </aside>

          <section className="relative overflow-hidden rounded-[24px] border border-white/12 bg-[#0A0D12]/84 shadow-[0_34px_100px_rgba(0,0,0,.42)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 md:px-8">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalMoments }, (_, index) => (
                  <span
                    key={index}
                    className="h-1.5 rounded-full transition-[width,background-color] duration-300"
                    style={{
                      width: index === stepIndex ? 28 : 7,
                      backgroundColor:
                        index <= stepIndex ? world.accent : "rgba(255,255,255,.12)",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs tabular-nums text-white/38">
                {stepIndex === 0 ? "Welcome" : "Step " + stepIndex + " of " + steps.length}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stepIndex}
                initial={reducedMotion ? false : { opacity: 0, x: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? undefined : { opacity: 0, x: -18, filter: "blur(4px)" }}
                transition={panelMotion}
                className="min-h-[580px] p-6 md:p-9"
              >
                {stepIndex === 0 ? (
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <p className="s1-mono text-[9px] font-semibold" style={{ color: world.accent }}>
                        Welcome to Signal One
                      </p>
                      <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                        {world.welcomeTitle}
                      </h1>
                      <p className="mt-6 max-w-2xl text-base leading-7 text-white/58">
                        {world.welcomeBody}
                      </p>
                      <div className="mt-9 grid gap-3 md:grid-cols-3">
                        {world.welcomePoints.map((point, index) => (
                          <div
                            key={point}
                            className="rounded-[14px] border border-white/8 bg-white/[.035] p-4 text-sm leading-6 text-white/62"
                          >
                            <span className="mb-3 block text-xs font-semibold" style={{ color: world.accent }}>
                              0{index + 1}
                            </span>
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-10 flex items-center justify-between">
                      <span className="text-xs text-white/35">You can leave and resume later on this device.</span>
                      <button
                        type="button"
                        onClick={() => next()}
                        className="rounded-[12px] px-6 py-3 text-sm font-semibold text-[#071018] transition hover:brightness-110 active:scale-[.98]"
                        style={{ backgroundColor: world.accent }}
                      >
                        Begin
                      </button>
                    </div>
                  </div>
                ) : current?.review ? (
                  <div className="flex h-full flex-col">
                    <p className="s1-mono text-[9px] font-semibold" style={{ color: world.accent }}>
                      {current.eyebrow}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">{current.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">{current.body}</p>

                    <div className="mt-8 grid max-h-[300px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                      {allFields.map((field) => (
                        <div key={field.name} className="rounded-[14px] border border-white/8 bg-white/[.03] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-white/34">{field.label}</p>
                          <p className="mt-2 text-sm text-white/78">{values[field.name] || "Not provided"}</p>
                        </div>
                      ))}
                    </div>

                    <label className="mt-6 flex items-start gap-3 rounded-[14px] border border-white/8 bg-white/[.025] p-4 text-sm leading-6 text-white/56">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1"
                      />
                      <span>I consent to Signal One processing this information for onboarding, verification and contacting me about this application.</span>
                    </label>

                    {message ? (
                      <p
                        role="alert"
                        className="mt-4 rounded-[14px] border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm text-amber-100"
                      >
                        {message}
                      </p>
                    ) : null}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-7">
                      <button type="button" onClick={back} className="rounded-[12px] border border-white/12 px-5 py-2.5 text-sm text-white/70 hover:bg-white/5">
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => void submit()}
                        disabled={!consent || state === "sending"}
                        className="rounded-[12px] px-6 py-3 text-sm font-semibold text-[#071018] transition hover:brightness-110 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ backgroundColor: world.accent }}
                      >
                        {state === "sending" ? "Sending…" : "Submit application"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={next} className="flex h-full flex-col">
                    <div>
                      <p className="s1-mono text-[9px] font-semibold" style={{ color: world.accent }}>
                        {current?.eyebrow}
                      </p>
                      <h2 className="mt-4 text-3xl font-semibold tracking-[-.035em] md:text-4xl">{current?.title}</h2>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">{current?.body}</p>
                    </div>

                    <div className="mt-9 grid gap-5">
                      {(current?.fields || []).map((field) => (
                        <label key={field.name} className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-white/42">
                            {field.label}
                          </span>
                          {field.type === "textarea" ? (
                            <textarea
                              required={field.required}
                              rows={5}
                              value={values[field.name] || ""}
                              onChange={(event) => update(field.name, event.target.value)}
                              placeholder={field.placeholder}
                              className="w-full rounded-[14px] border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-[var(--journey-accent)] focus:ring-4 focus:ring-[rgba(var(--journey-accent-rgb),.08)]"
                            />
                          ) : field.type === "select" ? (
                            <select
                              required={field.required}
                              value={values[field.name] || ""}
                              onChange={(event) => update(field.name, event.target.value)}
                              className="w-full rounded-[14px] border border-white/10 bg-[#0A0D12] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[var(--journey-accent)] focus:ring-4 focus:ring-[rgba(var(--journey-accent-rgb),.08)]"
                            >
                              <option value="">Select</option>
                              {(field.options || []).map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type || "text"}
                              required={field.required}
                              value={values[field.name] || ""}
                              onChange={(event) => update(field.name, event.target.value)}
                              placeholder={field.placeholder}
                              className="w-full rounded-[14px] border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-[var(--journey-accent)] focus:ring-4 focus:ring-[rgba(var(--journey-accent-rgb),.08)]"
                            />
                          )}
                          {field.hint ? <span className="mt-2 block text-xs text-white/32">{field.hint}</span> : null}
                        </label>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                      <button type="button" onClick={back} className="rounded-[12px] border border-white/12 px-5 py-2.5 text-sm text-white/70 hover:bg-white/5">
                        Back
                      </button>
                      <button
                        type="submit"
                        className="rounded-[12px] px-6 py-3 text-sm font-semibold text-[#071018] transition hover:brightness-110 active:scale-[.98]"
                        style={{ backgroundColor: world.accent }}
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
}
