# Live contact-access correction

Candidate based on `6377e5b73611925b749419bfe71d44df55cf3bde`.

When collection is fully enabled, `/connect/andisiwe` renders no direct email,
WhatsApp or phone rows until the server validates the existing signed receipt
grant. `/present/andisiwe` uses the same server decision for the email caption.
The client receives no private contact profile. A verified persisted response
refreshes the server component so the contact rows appear alongside Save Contact.
Unconfirmed/failed responses do not reveal either. No disabled or locked controls.

When collection is disabled, business contact fallback remains available. This
correction neither installs credentials nor enables collection. Existing vCard
server authorization remains required; URL flags and forged cookies do not grant
access. Marketing routes, Inter font, portrait assets, sizing and card CSS remain
unchanged.

Qualification includes raw server HTML/RSC absence checks before persistence,
contact reveal after signed persistence, retry/unknown handling, forged-cookie
refusal and existing disabled-mode/marketing regressions. Local native TLS + HMAC
receiver + disposable PG16 evidence is distinct from actual deployed backend
qualification. Physical native contact import is a separate device gate.

Live lead activation requires production schema reconciliation, approved migration
and full LEOS governance, independent release audit, exact registered tenant/inbox
permissions, private integration credentials, verified API-pool TLS and final
privacy/retention/erasure/processor decisions. An approval-reference variable does
not establish those approvals. Until then retain the private exchange gate OFF.

Rollback to the preceding `6377e5b` release preserves current OFF-mode fallback and
conditional vCard policy. Never roll back to an unconditional-download candidate
when collection is active. No database or DNS change accompanies this website fix.
