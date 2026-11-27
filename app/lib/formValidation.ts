/**
 * Visible, accessible form validation (VA-06; research R-29–R-32; WCAG 3.3.1, 3.3.3, 4.1.2).
 *
 * The browser's own validation shows one transient tooltip on the first field and leaves every other
 * invalid field looking unchanged. Forms using this instead set `noValidate` and call
 * `validateBeforeSubmit(form)` first:
 *  - every invalid field gets `aria-invalid="true"` and a persistent message under it, linked by
 *    `aria-describedby`;
 *  - an error summary at the top of the form lists every problem as a link to its field and takes focus
 *    (the GOV.UK Design System error-summary pattern);
 *  - a message clears as soon as its field becomes valid.
 * The browser's localised constraint messages are reused, so validity rules stay in the markup
 * (`required`, `type="email"`, `min`), exactly as before.
 */
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const SUMMARY_ATTR = "data-error-summary";
const MESSAGE_ATTR = "data-field-error";

function fieldsOf(form: HTMLFormElement): Field[] {
  return Array.from(form.elements).filter(
    (el): el is Field =>
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) &&
      !el.disabled && el.type !== "hidden" && el.type !== "submit",
  );
}

function labelFor(field: Field): string {
  const label = field.labels?.[0]?.innerText || field.closest("fieldset")?.querySelector("legend")?.textContent || field.name;
  return label.replace(/\s*\(optional\)\s*/i, "").replace(/\s+/g, " ").trim();
}

/**
 * The message a field wrote for itself (`data-error` on the control, or on its fieldset for a radio
 * group). Every required field on the site carries one, so the visitor reads a natural sentence
 * ("Choose whether to buy or rent.") instead of one assembled from the label (AUDW-05).
 */
function ownMessage(field: Field): string | undefined {
  return field.dataset.error || field.closest<HTMLElement>("fieldset[data-error]")?.dataset.error || undefined;
}

/** Lower-cases the first letter of a label unless it starts an acronym ("SIM", "PSiRA", "PTT"). */
function lowerFirst(text: string): string {
  return /^[A-Z][A-Za-z]*[A-Z]/.test(text.split(" ")[0] || "") ? text : text.charAt(0).toLowerCase() + text.slice(1);
}

/** Fallback only, for a field without `data-error`: never "Choose buy or rent?." (AUDW-05). */
function generatedMessage(field: Field, label: string): string {
  if (/\?$/.test(label)) return "Answer this question: " + label;
  const name = lowerFirst(label);
  if (field instanceof HTMLSelectElement || field.type === "radio") return "Choose an option for " + name + ".";
  if (field.type === "checkbox") return "Tick this box to continue.";
  return "Enter " + name + ".";
}

function messageFor(field: Field): string {
  const v = field.validity;
  const label = labelFor(field);
  if (v.valueMissing) return ownMessage(field) || generatedMessage(field, label);
  if (v.typeMismatch && field.type === "email") return "Enter an email address like name@company.co.za.";
  if (v.typeMismatch && field.type === "url") return "Enter a web address that starts with https://.";
  if (v.rangeUnderflow && field instanceof HTMLInputElement && field.min) return "Enter " + field.min + " or more.";
  if (v.rangeUnderflow || v.rangeOverflow || v.badInput) return field.validationMessage || "Enter a valid number.";
  return field.validationMessage || "Check this answer.";
}

/** Where the message goes: after the radio/checkbox group, otherwise after the field's own wrapper. */
function anchorFor(field: Field): Element {
  if (field.type === "radio") return field.closest("fieldset") || field.parentElement || field;
  if (field.type === "checkbox") return field.closest("label") || field.parentElement || field;
  return field;
}

function idFor(field: Field): string {
  const base = (field.id || field.name || "field").replace(/[^A-Za-z0-9_-]/g, "-");
  return base + "-error";
}

function setError(field: Field, message: string | null) {
  const anchor = anchorFor(field);
  const id = idFor(field);
  let node = anchor.parentElement?.querySelector<HTMLElement>(`[${MESSAGE_ATTR}="${id}"]`) ?? null;
  const group = field.type === "radio" && field.form ? Array.from(field.form.querySelectorAll<HTMLInputElement>(`input[type=radio][name="${CSS.escape(field.name)}"]`)) : [field];
  if (!message) {
    node?.remove();
    for (const f of group) {
      // Only undo what this module set: a group the page validates itself (JMulti) keeps its own state.
      if (!(f.getAttribute("aria-describedby") || "").split(" ").includes(id)) continue;
      f.removeAttribute("aria-invalid");
      const described = (f.getAttribute("aria-describedby") || "").split(" ").filter((x) => x && x !== id);
      if (described.length) f.setAttribute("aria-describedby", described.join(" "));
      else f.removeAttribute("aria-describedby");
    }
    return;
  }
  if (!node) {
    node = document.createElement("p");
    node.className = "field-error mt-2";
    node.id = id;
    node.setAttribute(MESSAGE_ATTR, id);
    anchor.insertAdjacentElement("afterend", node);
  }
  node.textContent = message;
  for (const f of group) {
    f.setAttribute("aria-invalid", "true");
    const described = new Set((f.getAttribute("aria-describedby") || "").split(" ").filter(Boolean));
    described.add(id);
    f.setAttribute("aria-describedby", Array.from(described).join(" "));
  }
}

/**
 * A problem that native constraints cannot express, such as "choose at least one" in a group of
 * checkboxes. The caller shows its message beside the group; it is listed in the summary with the rest.
 */
export type ExtraProblem = { field: HTMLElement; message: string };

type Problem = { field: HTMLElement; message: string };

function renderSummary(form: HTMLFormElement, problems: Problem[], container: HTMLElement) {
  form.querySelector(`[${SUMMARY_ATTR}]`)?.remove();
  if (!problems.length) return null;
  const box = document.createElement("div");
  box.setAttribute(SUMMARY_ATTR, "");
  box.setAttribute("role", "alert");
  box.tabIndex = -1;
  box.className = "s1-error-summary";
  const title = document.createElement("p");
  title.className = "s1-error-summary-title";
  title.textContent = problems.length === 1 ? "There is a problem" : `There are ${problems.length} problems`;
  const list = document.createElement("ul");
  for (const { field, message } of problems) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#" + field.id;
    link.textContent = message;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      field.focus();
      field.scrollIntoView({ block: "center" });
    });
    item.appendChild(link);
    list.appendChild(item);
  }
  box.append(title, list);
  container.prepend(box);
  return box;
}

/**
 * Returns true when the form may be sent; otherwise shows every problem and focuses the summary.
 * `extra` adds problems the caller found itself (listed in document order with the rest).
 * `container` is where the summary goes (default: the top of the form). A multi-step journey passes
 * its current step, so the summary leaves with the step instead of lingering over the next one.
 */
export function validateBeforeSubmit(
  form: HTMLFormElement,
  { extra = [], container = form }: { extra?: ExtraProblem[]; container?: HTMLElement } = {},
): boolean {
  const problems: Problem[] = [];
  const seenGroups = new Set<string>();
  for (const field of fieldsOf(form)) {
    if (field.type === "radio") {
      if (seenGroups.has(field.name)) continue;
      seenGroups.add(field.name);
    }
    if (field.checkValidity()) {
      setError(field, null);
      continue;
    }
    const message = messageFor(field);
    setError(field, message);
    if (!field.id) field.id = idFor(field).replace(/-error$/, "");
    problems.push({ field, message });
  }
  for (const problem of extra) problems.push(problem);
  problems.sort((a, b) => (a.field.compareDocumentPosition(b.field) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  const summary = renderSummary(form, problems, container);
  if (summary) {
    summary.focus();
    watch(form);
    return false;
  }
  return true;
}

/** Re-checks a field as the visitor corrects it, and removes the summary once nothing is left. */
function watch(form: HTMLFormElement) {
  if (form.dataset.validationWatch) return;
  form.dataset.validationWatch = "1";
  const recheck = (event: Event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    if (field.getAttribute("aria-invalid") !== "true" && field.type !== "radio") return;
    if (field.checkValidity()) setError(field, null);
    if (!form.querySelector('[aria-invalid="true"]')) form.querySelector(`[${SUMMARY_ATTR}]`)?.remove();
  };
  form.addEventListener("input", recheck);
  form.addEventListener("change", recheck);
}
