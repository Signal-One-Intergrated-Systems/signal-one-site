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

function messageFor(field: Field): string {
  const v = field.validity;
  const label = labelFor(field);
  if (v.valueMissing) {
    if (field instanceof HTMLSelectElement) return "Choose " + label.toLowerCase() + ".";
    if (field.type === "checkbox") return "Tick this box to continue.";
    if (field.type === "radio") return "Choose an option for " + label.toLowerCase() + ".";
    return "Enter " + label.toLowerCase() + ".";
  }
  if (v.typeMismatch && field.type === "email") return "Enter an email address like name@company.co.za.";
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

function renderSummary(form: HTMLFormElement, problems: Array<{ field: Field; message: string }>) {
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
    link.href = "#" + (field.id || idFor(field));
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
  form.prepend(box);
  return box;
}

/** Returns true when the form may be sent; otherwise shows every problem and focuses the summary. */
export function validateBeforeSubmit(form: HTMLFormElement): boolean {
  const problems: Array<{ field: Field; message: string }> = [];
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
    problems.push({ field, message });
  }
  const summary = renderSummary(form, problems);
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
