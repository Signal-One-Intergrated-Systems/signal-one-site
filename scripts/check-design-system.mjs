import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const files = {
  global: read("app/globals.css"),
  marketing: read("app/marketing-system.css"),
  layout: read("app/(marketing)/layout.tsx"),
  header: read("app/components/Header.tsx"),
  footer: read("app/components/Footer.tsx"),
  logo: read("app/components/brand/SignalOneMark.tsx"),
  font: read("app/lib/body-font.ts"),
  docs: read("docs/DESIGN_SYSTEM.md"),
};
const checks = [
  ["Inter variable is the sole site font", files.font.includes("InterVariable.woff2") && files.font.includes('variable: "--font-body"')],
  ["Canonical brand geometry", files.logo.includes('r="15"') && files.logo.includes('r="9.5"') && files.logo.includes('r="4"')],
  ["Canonical header lockup", files.header.includes('size={22} tone="dark" pulse descriptorMin={10}')],
  ["Canonical footer lockup", files.footer.includes('size={24} tone="dark" descriptorMin={11}')],
  ["Marketing stylesheet is registered", files.layout.includes('import "../marketing-system.css";')],
  ["Legacy custom glass curtain is retired", !files.global.includes(".s1-glass-curtain") && !files.global.includes(".s1-glass-door")],
  ["Guard shutter cadence is unchanged", files.global.includes("--sg-dur-enter:440ms") && files.global.includes("--sg-dur-fast:180ms")],
  ["Component geometry uses shared tokens", ["--marketing-radius:", "--marketing-edge:", "--marketing-panel:", "--marketing-shadow:"].every(token => files.marketing.includes(token))],
  ["Shared cards reference material tokens", files.marketing.includes("background:var(--marketing-panel)!important;") && files.marketing.includes("border:1px solid var(--marketing-edge)!important;")],
  ["Single 3px marketing focus treatment", files.marketing.includes("outline:3px solid var(--marketing-focus)!important;") && !files.marketing.includes("outline:2px solid #7bd8ff")],
  ["Header navigation remains legible", files.global.includes("font-size:clamp(.875rem,1vw,1rem)!important") && files.global.includes("header.glass-nav .btn-primary {min-height:48px")],
  ["Premium design contract is documented", files.docs.includes("Approved 2026-10-29 premium website direction")],
];
const errors = checks.filter(([, pass]) => !pass).map(([description]) => description);
for (const [description, pass] of checks) {
  process.stdout.write(`${pass ? "PASS" : "FAIL"} ${description}\n`);
}
if (errors.length) {
  process.stderr.write(`Design-system contract failed (${errors.length}/${checks.length}): ${errors.join("; ")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Design-system static contract passed (${checks.length}/${checks.length}).\n`);
}
