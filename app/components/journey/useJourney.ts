"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent, type SignalOneEvent } from "../../lib/analytics";
import { submitIntake, type IntakeFallback } from "../../lib/intake";

export type JourneyStatus = "idle" | "sending" | "done" | "error";

type Saved = {
  stepIndex?: number;
  values?: Record<string, string>;
  consent?: boolean;
};

/**
 * Headless multi-step journey shared by client onboarding, guard join and
 * sales applications. Each world renders its own UI on top of this.
 *
 * - Progress resumes from localStorage on this device (best effort; every
 *   storage call is wrapped so private mode or blocked storage never breaks
 *   the journey).
 * - Submits { kind, data } to /api/intake.
 * - Fires the world's start event once, on leaving the first step, and the
 *   complete event on a successful submit.
 */
export function useJourney({
  kind,
  intent,
  storageKey,
  stepCount,
  events,
}: {
  kind: "client" | "guard" | "sales";
  intent: string;
  storageKey: string;
  stepCount: number;
  events: { start: SignalOneEvent; complete: SignalOneEvent };
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<JourneyStatus>("idle");
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState<IntakeFallback | null>(null);
  const started = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        if (saved.values && typeof saved.values === "object") setValues(saved.values);
        if (typeof saved.consent === "boolean") setConsent(saved.consent);
        if (typeof saved.stepIndex === "number" && saved.stepIndex >= 0 && saved.stepIndex < stepCount) {
          setStepIndex(saved.stepIndex);
          if (saved.stepIndex > 0) started.current = true;
        }
      }
    } catch {
      // Saved progress is a convenience only.
    } finally {
      setHydrated(true);
    }
  }, [stepCount, storageKey]);

  useEffect(() => {
    if (!hydrated || status === "done") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ stepIndex, values, consent }));
    } catch {
      // The journey still works without storage.
    }
  }, [consent, hydrated, status, stepIndex, storageKey, values]);

  const set = useCallback((name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  /** Toggle an option in a multi-select value stored as "a; b; c". */
  const toggle = useCallback((name: string, option: string) => {
    setValues((current) => {
      const list = (current[name] || "").split("; ").filter(Boolean);
      const next = list.includes(option) ? list.filter((item) => item !== option) : [...list, option];
      return { ...current, [name]: next.join("; ") };
    });
  }, []);

  const has = useCallback(
    (name: string, option: string) => (values[name] || "").split("; ").includes(option),
    [values],
  );

  const goTo = useCallback(
    (index: number) => {
      setMessage("");
      setFallback(null);
      setStatus((current) => (current === "error" ? "idle" : current));
      setStepIndex(Math.max(0, Math.min(stepCount - 1, index)));
    },
    [stepCount],
  );

  const next = useCallback(() => {
    if (stepIndex === 0 && !started.current) {
      started.current = true;
      trackEvent(events.start, { kind });
    }
    goTo(stepIndex + 1);
  }, [events.start, goTo, kind, stepIndex]);

  const back = useCallback(() => goTo(stepIndex - 1), [goTo, stepIndex]);

  const submit = useCallback(async () => {
    if (status === "sending") return false;
    if (!consent) {
      setStatus("error");
      setMessage("Please tick the consent box before you send.");
      return false;
    }
    setStatus("sending");
    setMessage("");
    setFallback(null);
    const result = await submitIntake(kind, { ...values, intent });
    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      setFallback(result.fallback);
      return false;
    }
    setStatus("done");
    trackEvent(events.complete, { kind });
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Completion must not fail because storage is unavailable.
    }
    return true;
  }, [consent, events.complete, intent, kind, status, storageKey, values]);

  return {
    stepIndex,
    values,
    consent,
    setConsent,
    hydrated,
    status,
    message,
    fallback,
    set,
    toggle,
    has,
    next,
    back,
    goTo,
    submit,
  };
}

export type Journey = ReturnType<typeof useJourney>;
