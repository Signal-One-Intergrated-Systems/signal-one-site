/**
 * A mailto link that stays readable without JavaScript. Cloudflare's Email Address Obfuscation
 * replaces addresses in HTML with a script-decoded placeholder ("[email protected]"), so visitors
 * with JavaScript off saw no address (independent review, 2026-11). Cloudflare leaves anything
 * between <!--email_off--> and <!--/email_off--> untouched, and React cannot emit comments, so the
 * link is rendered as static markup. Only trusted, hard-coded addresses are passed in.
 */
const SAFE = /^[a-z0-9.+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const escape = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function EmailLink({ email, subject, className, label }: { email: string; subject?: string; className?: string; label?: string }) {
  if (!SAFE.test(email)) throw new Error("EmailLink: unexpected address");
  const href = "mailto:" + email + (subject ? "?subject=" + encodeURIComponent(subject) : "");
  const html = `<!--email_off--><a href="${escape(href)}"${className ? ` class="${escape(className)}"` : ""}>${escape(label ?? email)}</a><!--/email_off-->`;
  return <span className="contents" dangerouslySetInnerHTML={{ __html: html }} />;
}
