"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

const steps = ["Field action", "GUARD record", "Service evidence"];

/** A field guide to verified capabilities, never a substitute product screen. */
export default function HomeWorkflow({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("QR");
  const [client, setClient] = useState(true);
  const heading = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef(false);
  useEffect(() => {
    if (pendingFocus.current) {
      heading.current?.focus({ preventScroll: true });
      pendingFocus.current = false;
    }
  }, [step]);
  function advance(index: number) {
    pendingFocus.current = true;
    setStep(index);
  }
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function choose(index: number) {
    setStep(index);
    tabs.current[index]?.focus({ preventScroll: true });
  }
  function keys(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    choose(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 2
          : (step + (event.key === "ArrowRight" ? 1 : -1) + 3) % 3,
    );
  }
  return (
    <div
      id="home-workflow"
      tabIndex={-1}
      className="home-workflow"
      data-step={step}
    >
      <div
        className="home-workflow-tabs"
        role="tablist"
        aria-label="From field action to service evidence"
        onKeyDown={keys}
      >
        {steps.map((name, i) => (
          <button
            key={name}
            ref={(node) => {
              tabs.current[i] = node;
            }}
            type="button"
            role="tab"
            id={`home-workflow-tab-${i}`}
            aria-controls="home-workflow-panel"
            aria-selected={step === i}
            tabIndex={step === i ? 0 : -1}
            onClick={() => choose(i)}
          >
            <span>0{i + 1}</span>
            {name}
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      <div
        className="home-workflow-stage"
        id="home-workflow-panel"
        role="tabpanel"
        aria-labelledby={`home-workflow-tab-${step}`}
      >
        <div className="home-workflow-field">
          {children}
          <div className="home-field-label">
            <span>Physical operation</span>
            <strong>
              One checkpoint.
              <br />A connected record.
            </strong>
          </div>
          <div className="home-signal-path" aria-hidden="true">
            <i key={step} />
          </div>
        </div>
        <div className="home-workflow-guide">
          <p className="home-guide-label">
            Signal One GUARD <span> / capability guide</span>
          </p>
          <div className="home-guide-content" key={step}>
            {step === 0 && (
              <>
                <p className="home-guide-number">01 / At the checkpoint</p>
                <h2 ref={heading} tabIndex={-1}>
                  The action becomes
                  <br />
                  part of the record.
                </h2>
                <p>
                  Scan a QR code or tap an NFC tag on your own phone or an
                  authorised Central Device.
                </p>
                <div
                  className="home-method"
                  aria-label="Explore checkpoint methods"
                >
                  {["QR", "NFC"].map((value) => (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={method === value}
                      onClick={() => setMethod(value)}
                    >
                      {value === "QR" ? "QR code" : "NFC tag"}
                    </button>
                  ))}
                </div>
                <p className="home-method-note">
                  {method === "QR"
                    ? "Identify the checkpoint with the camera."
                    : "Identify the checkpoint with a tag tap."}{" "}
                  Offline scans stay on the phone until signal returns.
                </p>
                <button
                  className="home-guide-next"
                  type="button"
                  onClick={() => advance(1)}
                >
                  Follow the {method} record <span aria-hidden="true">→</span>
                </button>
              </>
            )}
            {step === 1 && (
              <>
                <p className="home-guide-number">02 / What GUARD records</p>
                <h2 ref={heading} tabIndex={-1}>
                  More than
                  <br />
                  “I was here.”
                </h2>
                <dl className="home-record-fields">
                  {[
                    ["Checkpoint & patrol", "Where the scan belongs"],
                    ["Capture time", "When the action happened"],
                    ["Position & accuracy", "Applicable GPS evidence"],
                    ["Sync state", "Saved offline or submitted"],
                  ].map(([term, detail], i) => (
                    <div key={term}>
                      <dt>
                        <span aria-hidden="true">0{i + 1}</span>
                        {term}
                      </dt>
                      <dd>{detail}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  className="home-guide-next"
                  type="button"
                  onClick={() => advance(2)}
                >
                  Follow the service evidence <span aria-hidden="true">→</span>
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <p className="home-guide-number">
                  03 / Assessment, with a reason
                </p>
                <h2 ref={heading} tabIndex={-1}>
                  Evidence your
                  <br />
                  client can use.
                </h2>
                <p>
                  A checkpoint scan contributes evidence. Scheduled service is
                  assessed separately, with a reason for the outcome.
                </p>
                <ul
                  className="home-proof-outcomes"
                  aria-label="Possible service assessments"
                >
                  {["Proven", "Partly proven", "Unresolved", "Not proven"].map(
                    (text) => (
                      <li key={text}>{text}</li>
                    ),
                  )}
                </ul>
                <button
                  className="home-scope"
                  type="button"
                  aria-pressed={!client}
                  onClick={() => setClient(!client)}
                >
                  {client ? "Client scope" : "Company scope"}{" "}
                  <span aria-hidden="true">⇄</span>
                </button>
                <p className="home-method-note">
                  {client
                    ? "Clients see evidence and generate reports for their authorised sites."
                    : "The company reviews service evidence across its clients."}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="home-workflow-disclosure">
        An interactive explanation of implemented capabilities. No live records
        or software screenshots.
      </p>
    </div>
  );
}
