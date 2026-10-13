"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const Experience = dynamic(() => import("./OperationsExperience"), {
  loading: () => (
    <div className="ops-demo-loading" role="status">
      <p>Opening the field-to-evidence demonstration…</p>
      <ol>
        <li>At the checkpoint</li>
        <li>The GUARD record</li>
        <li>Service evidence</li>
      </ol>
    </div>
  ),
});

/** Load the full demonstration on intent, rather than hydrating an invisible product story. */
export default function DemoLauncher({
  secondary = false,
}: {
  secondary?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const [mounted, setMounted] = useState(false);
  function warm() {
    void import("./OperationsExperience").catch(() => undefined);
  }
  function open() {
    previousOverflow.current = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    setMounted(true);
    close.current?.focus();
  }
  function dismiss() {
    dialog.current?.close();
    document.body.style.overflow = previousOverflow.current;
    setMounted(false);
    trigger.current?.focus();
  }
  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const nodes = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]",
      ),
    ).filter((node) => node.tabIndex >= 0 && node.getClientRects().length > 0);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  useEffect(
    () => () => {
      document.body.style.overflow = previousOverflow.current;
    },
    [],
  );
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`btn ${secondary ? "btn-ghost-dark" : "btn-primary"} btn-lg`}
        data-analytics-event="hero_product_proof"
        data-analytics-label="Hero primary"
        onPointerEnter={warm}
        onFocus={warm}
        onTouchStart={warm}
        onClick={open}
      >
        Experience GUARD <span aria-hidden="true">▷</span>
      </button>
      <dialog
        ref={dialog}
        className="ops-dialog"
        aria-labelledby="demo-title"
        onKeyDown={containFocus}
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
        {mounted && <Experience id="guided-demo" />}
      </dialog>
    </>
  );
}
