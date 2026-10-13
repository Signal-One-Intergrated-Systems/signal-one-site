"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { photos, illustrativeCaption } from "../lib/photos";

const stages = [
  {
    name: "Scan",
    title: "The action starts in the field.",
    body: "An officer scans a QR or NFC checkpoint on their own phone or an authorised Central Device.",
    note: "Choose a checkpoint method, then record the scan.",
    context: "Officer · at the checkpoint",
  },
  {
    name: "Record",
    title: "One scan. Evidence with context.",
    body: "GUARD associates the scan with its checkpoint and patrol, the capture time and applicable GPS evidence. Offline scans are saved on the phone and sent when signal returns.",
    note: "A record of the scan, rather than a message saying it happened.",
    context: "GUARD · operational record",
  },
  {
    name: "Supervise",
    title: "A record your team can act on.",
    body: "Supervisors review patrol activity and relevant exceptions in the context of their sites. A late or missed checkpoint needs review; it is not proof that the whole service failed.",
    note: "Access is limited to the supervisor’s assigned sites.",
    context: "Supervisor · authorised sites",
  },
  {
    name: "Respond",
    title: "When attention becomes action.",
    body: "The control room can acknowledge, navigate to and resolve an SOS. Delivery requires a mobile signal; offline checkpoint storage does not make SOS work offline.",
    note: "Try the signal control to see the difference.",
    context: "Control room · SOS response",
  },
  {
    name: "Prove",
    title: "Close the loop with service evidence.",
    body: "Scheduled service is assessed as proven, partly proven, unresolved or not proven, with a reason. Authorised clients can see evidence and generate reports for their own sites.",
    note: "An SOS response alone does not prove a shift or patrol was completed.",
    context: "Client · scoped proof of service",
  },
] as const;

/** Editorial explanation of validated functions. These are not product screens. */
export default function OperationsExperience({
  initial = 0,
  id = "experience",
}: {
  initial?: number;
  id?: string;
}) {
  const [active, setActive] = useState(initial);
  const [method, setMethod] = useState("QR");
  const [signal, setSignal] = useState(true);
  const [response, setResponse] = useState(0);
  const [role, setRole] = useState("Client");
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = stages[active];

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    if (root.current) observer.observe(root.current);
    const onVisibility = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || reduced || !visible || !foreground) return;
    const timer = setTimeout(() => {
      if (active < stages.length - 1) setActive(active + 1);
      else setPlaying(false);
    }, 6500);
    return () => clearTimeout(timer);
  }, [active, playing, reduced, visible, foreground]);

  function choose(index: number) {
    setPlaying(false);
    setActive(index);
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 4
          : (active + (event.key === "ArrowLeft" ? -1 : 1) + 5) % 5;
    choose(next);
    tabs.current[next]?.focus();
  }

  return (
    <div
      id={id}
      ref={root}
      className="ops-experience"
      data-playing={playing && !reduced && visible && foreground}
    >
      <div className="ops-toolbar">
        <p>
          Signal One GUARD <span> / Workflow demonstration</span>
        </p>
        {!reduced && (
          <button
            type="button"
            className="ops-text-button"
            onClick={() => {
              if (active === 4) setActive(0);
              setPlaying(!playing);
            }}
          >
            {playing ? "Pause tour" : "Play guided tour"}
            <span aria-hidden="true"> {playing ? "Ⅱ" : "▷"}</span>
          </button>
        )}
      </div>
      <div
        className="ops-tabs"
        role="tablist"
        aria-label="Operational stages"
        onKeyDown={keyboard}
      >
        {stages.map((stage, i) => (
          <button
            key={stage.name}
            ref={(node) => {
              tabs.current[i] = node;
            }}
            type="button"
            role="tab"
            id={id + "-tab-" + i}
            aria-selected={active === i}
            aria-controls={id + "-panel"}
            tabIndex={active === i ? 0 : -1}
            onClick={() => choose(i)}
          >
            <span>0{i + 1}</span>
            {stage.name}
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        id={id + "-panel"}
        role="tabpanel"
        aria-labelledby={id + "-tab-" + active}
        className="ops-stage"
      >
        <div className="ops-visual" data-stage={active}>
          <div key={active} className="ops-visual-inner">
            {active === 0 && (
              <>
                <Image
                  src={photos.guardPatrol.src}
                  alt={photos.guardPatrol.alt}
                  fill
                  sizes="(min-width: 1024px) 660px, 100vw"
                  quality={90}
                  placeholder="blur"
                  className="ops-scene-image"
                />
                <div className="ops-scan-focus" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <i />
                </div>
                <div className="ops-photo-label">
                  <span>Physical checkpoint</span>
                  <strong>
                    {method === "QR" ? "Scan the code." : "Tap the tag."}
                  </strong>
                  <small>{illustrativeCaption}</small>
                </div>
              </>
            )}
            {active === 1 && (
              <div className="ops-evidence-sheet">
                <p className="ops-sheet-kicker">
                  What a checkpoint record contains
                </p>
                <strong className="ops-sheet-title">
                  The scan
                  <br />
                  has a context.
                </strong>
                <dl>
                  {[
                    [
                      "01",
                      "Checkpoint & patrol",
                      "Which point, on which route",
                    ],
                    ["02", "Capture time", "When the action happened"],
                    ["03", "Position & accuracy", "Applicable GPS evidence"],
                    ["04", "Sync state", "Saved offline or submitted"],
                  ].map(([n, term, detail]) => (
                    <div key={n}>
                      <span>{n}</span>
                      <dt>
                        {term}
                        <small>{detail}</small>
                      </dt>
                      <dd aria-label="Associated with the record">→</dd>
                    </div>
                  ))}
                </dl>
                <p>Editorial field guide · no customer data</p>
              </div>
            )}
            {active === 2 && (
              <>
                <Image
                  src={photos.controlRoomTeam.src}
                  alt={photos.controlRoomTeam.alt}
                  fill
                  sizes="(min-width: 1024px) 660px, 100vw"
                  quality={90}
                  placeholder="blur"
                  className="ops-scene-image"
                />
                <div className="ops-supervision glass">
                  <p>
                    From a field event
                    <br />
                    to an informed decision.
                  </p>
                  <div>
                    <span>Review the record</span>
                    <span>Consider the exception</span>
                    <span>Take the next action</span>
                  </div>
                </div>
                <p className="ops-photo-caption">{illustrativeCaption}</p>
              </>
            )}
            {active === 3 && (
              <div className="ops-response-sheet">
                <p className="ops-sheet-kicker">Illustrative SOS sequence</p>
                <strong className="ops-sheet-title">
                  {signal
                    ? ["Attention.", "Acknowledged.", "Resolved."][response]
                    : "Signal required."}
                </strong>
                <div className="ops-response-path">
                  {["SOS received", "Acknowledge", "Resolve"].map((text, i) => (
                    <div key={text} data-current={signal && i <= response}>
                      <span aria-hidden="true">
                        {signal && i <= response ? "✓" : "○"}
                      </span>
                      {text}
                    </div>
                  ))}
                </div>
                <p className="ops-response-note">
                  {!signal
                    ? "The control room cannot receive this SOS without a mobile signal. Follow your site’s emergency procedure."
                    : response === 2
                      ? "The response is recorded. Service evidence is assessed separately."
                      : "With a mobile signal, the control room can act and record its response."}
                </p>
              </div>
            )}
            {active === 4 && (
              <div className="ops-evidence-sheet ops-proof-sheet">
                <p className="ops-sheet-kicker">
                  Service assessment · possible outcomes
                </p>
                <strong className="ops-sheet-title">
                  Evidence.
                  <br />
                  With a reason.
                </strong>
                <ul>
                  {["Proven", "Partly proven", "Unresolved", "Not proven"].map(
                    (text, i) => (
                      <li key={text}>
                        <span aria-hidden="true">
                          {["✓", "◐", "○", "—"][i]}
                        </span>
                        {text}
                      </li>
                    ),
                  )}
                </ul>
                <p>
                  {role === "Client"
                    ? "Client scope → only authorised sites"
                    : "Company scope → service across its clients"}
                </p>
              </div>
            )}
          </div>
          <span className="ops-context">{scene.context}</span>
        </div>
        <div className="ops-copy">
          <p className="ops-overline">
            From the field. Through the system. To evidence.
          </p>
          <h3 key={active}>{scene.title}</h3>
          <p className="ops-body">{scene.body}</p>
          <div className="ops-controls">
            {active === 0 && (
              <>
                <div className="ops-segment" aria-label="Checkpoint method">
                  {["QR", "NFC"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={method === value}
                      onClick={() => {
                        setMethod(value);
                        setPlaying(false);
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => choose(1)}
                >
                  Record the {method} scan <span aria-hidden="true">→</span>
                </button>
              </>
            )}
            {active === 3 && (
              <>
                <button
                  type="button"
                  className="ops-switch"
                  role="switch"
                  aria-checked={signal}
                  aria-label="Mobile signal"
                  onClick={() => {
                    setSignal(!signal);
                    setResponse(0);
                    setPlaying(false);
                  }}
                >
                  <span aria-hidden="true" />
                  Mobile signal {signal ? "on" : "off"}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!signal}
                  onClick={() => {
                    setResponse((response + 1) % 3);
                    setPlaying(false);
                  }}
                >
                  {
                    ["Acknowledge SOS", "Resolve SOS", "Restart SOS example"][
                      response
                    ]
                  }
                </button>
              </>
            )}
            {active === 4 && (
              <div className="ops-segment" aria-label="Proof access">
                {["Client", "Company"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={role === value}
                    onClick={() => {
                      setRole(value);
                      setPlaying(false);
                    }}
                  >
                    {value} scope
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="ops-note">{scene.note}</p>
          <div className="ops-stage-nav">
            <button
              type="button"
              className="ops-text-button"
              disabled={active === 0}
              onClick={() => choose(active - 1)}
            >
              ← Previous
            </button>
            <span>0{active + 1} / 05</span>
            {active < 4 ? (
              <button
                type="button"
                className="ops-text-button"
                onClick={() => choose(active + 1)}
              >
                Next stage →
              </button>
            ) : (
              <Link href="/contact" className="ops-text-button">
                Request a walkthrough →
              </Link>
            )}
          </div>
        </div>
      </div>
      <p className="ops-disclosure">
        Interactive editorial explanation of implemented capabilities.
        Illustrations are fictional scenes; these are not GUARD screens or a
        live operation.
      </p>
    </div>
  );
}

export function DemoLauncher() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  function dismiss() {
    dialog.current?.close();
    trigger.current?.focus();
  }
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const observer = new MutationObserver(() => {
      document.body.style.overflow = node.open ? "hidden" : "";
    });
    observer.observe(node, { attributes: true, attributeFilter: ["open"] });
    return () => {
      observer.disconnect();
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="btn btn-primary btn-lg"
        data-analytics-event="hero_product_proof"
        data-analytics-label="Hero primary"
        onClick={() => {
          dialog.current?.showModal();
          close.current?.focus();
        }}
      >
        Experience GUARD <span aria-hidden="true">▷</span>
      </button>
      <dialog
        ref={dialog}
        className="ops-dialog"
        aria-labelledby="demo-title"
        onCancel={(event) => {
          event.preventDefault();
          dismiss();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dismiss();
        }}
      >
        <div className="ops-dialog-heading">
          <h2 id="demo-title">From the checkpoint to the client.</h2>
          <button
            ref={close}
            type="button"
            className="ops-text-button"
            onClick={dismiss}
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <OperationsExperience id="guided-demo" />
      </dialog>
    </>
  );
}
