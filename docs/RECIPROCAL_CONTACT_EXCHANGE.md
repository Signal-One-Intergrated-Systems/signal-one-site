# Reciprocal Signal Connect — implementation and activation boundary

27 October 2026 (SAST). Founder approved the experience; this document is not
approval of a privacy policy, public collection, live backend migration or credentials.

## User-facing contract

Preserve the existing identity card, photograph, portrait dimensions, official
branding and Inter. When the private activation gate is satisfied, show the form
immediately below that card, without an opening toggle. Full name, phone OR email,
one or more interests and privacy acknowledgement are required. Company, message,
Other specification and independently unchecked marketing consent are optional.
Twenty founder-specified options use stable IDs in four searchable groups within
one compact checkbox dropdown. Selection chips are removable and scroll within a
bounded area. Touch, Tab, Space, Enter and Escape remain available.

The action is **Connect with Andisiwe**. A created/existing receipt with persisted
true is necessary; HTTP202, empty, malformed, unsigned, mismatched or timed-out
responses are never a saved introduction. The server verifies the receiver HMAC
before issuing a 15-minute, signed, HttpOnly, Secure, SameSite=Strict __Host cookie.
Only then is **Save Contact** rendered. GET/HEAD /contact/andisiwe independently
checks the server gate, signature, profile and expiry, rejects query bypasses,
and responds private/no-store with Vary:Cookie. Presenter has no alternative download.
There is no disabled Save button, padlock or artificial unlocking explanation.
The vCard download asks the device to import; it never claims native import occurred.

A synchronous in-flight guard prevents duplicate click requests. Unknown outcomes
retain the original UUID and exact serialized payload in memory for explicit
retry; fields stay unchanged. No PII, HMAC credentials, download grants or pending
payloads are written to localStorage/sessionStorage/IndexedDB. The only capability
is the short-lived HttpOnly cookie. After an acknowledged save, reload can restore
Save Contact while the cookie is valid. Closing/reloading an *unconfirmed* attempt
loses the in-memory form; no offline queue or cross-device recovery is claimed.
The error tells the visitor to keep the page open and retry. Further unknown-outcome
reconciliation needs an approved privacy-preserving contract, not PII browser storage.
Native no-JavaScript form submission is POST, never GET/query-string PII, and the
JSON-only handler rejects it without forwarding or issuing a receipt.

## Selected receiver contract

HMAC transport version1/path remain unchanged. Strict body version2 adds interests,
otherSpecification and separate marketingConsent with notice version
signal-connect-exchange-2026-10-27. This notice identifier is a candidate contract
version, not certification of the existing privacy-page text. Tenant comes only
from the enabled, registered server integration and active expiring key. Browser
scope/owner/tenant fields are rejected. Request limits remain 8KiB, fixed bounded
source budget and shared registration budget; nonce replay and content-bound,
tenant-scoped UUID idempotency remain receiver-authoritative. No PII application
logs. TLS receiver allowlist is exact and redirects are not followed.

One PG transaction creates one UNOWNED shared-inbox contact request, all selected
ID+label snapshots and Other text, and append-only receipt/consent proof. Marketing
false is explicitly retained as false. It does not subscribe anyone or authorise
marketing automation. Existing commerce.contact_requests.read controls the inbox;
no leads.list broadening, per-user ownership or identity/RBAC change. ClassB
migration0189 extends proof constraints/columns while preserving V1; guarded
reversal refuses to erase V2 evidence. Only disposable PG16 execution is authorised
in this packet. Prior0187/0188 local source is preserved, not assumed deployed.

## Live activation is blocked

At inspection, site main=d7f844fcd685cffef9c9b5da49c1c2c647bd955c, LEOS main=
80c6d417800047c46daff32c8cbabae5c794970e. GitHub main lacks the intake contract
file. Existing website web service lists only NEXT_PUBLIC_SITE_URL; existing
LEOS API has no intake feature/key variable names. No values were requested.
Existing privacy/POPIA pages still carry review notes and pending retention policy.

Until these are qualified, no introduction input is rendered on the live page,
POST rejects503 before reading the body or calling a transport, and vCard denies403.
The card keeps direct business mail/WhatsApp/phone details. These manual actions
are never represented as a stored introduction. QR stays review-only/noindex.
Payments, Marketplace, company activation and Guard evidence gates are untouched.

Activation prerequisites, each evidenced before collection:

- Backend independent review/full governed qualification, source admission,
  authorised migration/deployment and synthetic tenant-authorised inbox proof.
- Controller-approved notice covering reciprocal disclosure, purposes, recipient/
  processor access, cross-border handling, rights contact, retention, deletion/
  legal hold and distinct marketing choice. Existing draft is not that approval.
- Operator provisioned tenant-bound registration, expiring credential, distinct
  download-grant key, transport allowlist and monitored revocation/abuse procedure.
- Existing Railway edge compatibility and actual HTTPS receipt/cookie/retry proof;
  physical Safari/Android and native contact import remain separate device checks.

Private variables: CONNECT_EXCHANGE_ENABLED, CONNECT_PRIVACY_APPROVAL (approved
record reference), CONNECT_PRIVACY_NOTICE_VERSION, CONNECT_INTAKE_RECEIVER_ORIGIN,
CONNECT_INTAKE_ALLOWED_RECEIVER_ORIGIN, CONNECT_INTAKE_REGISTRATION_ID,
CONNECT_INTAKE_KEY_ID, CONNECT_INTAKE_SECRET, CONNECT_VCARD_GRANT_SECRET and optional
CONNECT_INTERNAL_ORIGIN. Exact public origin is source-controlled www.signalone.co.za.
Setting a flag/reference is not itself satisfaction of the prerequisites. No
production values are installed by this change. Never use NEXT_PUBLIC for secrets.

## Verification and recovery

Local evidence is under /workspace/signal-connect-reciprocal-20261027/evidence.
Fresh disposable PG16 tests and browser-driven production Next/HMAC/PG/inbox proof
are distinguished from actual post-deployment read-only HTTPS checks. The local
browser harness alone trusts a task-generated loopback certificate; receiver
native TLS validates it through that test CA. No physical device or legal approval
is inferred from desktop browser tests. Historical manual-flow tests are replaced
by guarded-flow and reciprocal persistence tests; ordinary marketing regressions
are preserved. No dependencies, marketing page, font, portrait or global card CSS
change. Complete patches include untracked new files; originals are hash-checked.

Rollback must retain collection/download containment. Original marketing-only
source c68d96604441bace329f0494bcddf2385b5745d5 and its existing Railway build
bc8f544b-9c77-4729-b775-ade41ade4907 are the safe no-Connect fallback. The intervening
d7f844 build has an unconditional vCard route and is NOT the default rollback for
this new policy. Recheck retained build availability, use the same web service,
then reconcile source with a normal recovery commit, never force-reset newer work.
No DNS/database rollback is needed because neither is changed by the website release.
