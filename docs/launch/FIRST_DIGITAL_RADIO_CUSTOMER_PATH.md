# Shortest safe path to the first fully digital paying radio customer

2026-11-27. This is built only from findings already on record:
- `LEOS_COMMERCIAL_CAPABILITY.md` (file:line evidence);
- `LEOS_AUDIT_R2.md`;
- `COMMERCIAL_ECOSYSTEM_RECONCILIATION_2026-11-27.md`;
- `CUSTOMER_PORTAL_DOMAIN_QUALIFICATION.md`;
- the open LEOS pull requests.

No new research was done. **Nothing here is deployed or merged.**

## The journey and where each step stands

"Fully digital" here means: enquiry on the website → lead in Sales OS → written quote → online acceptance → invoice → online payment → delivery recorded, with no step done by email or on paper.

| # | Step | Mechanism | State |
|---|---|---|---|
| 1 | Customer finds the radio and asks for a quote | Website quote form (`/radios-equipment#quote`, purchase route) | **Ready on staging.** In production every form falls back to email, because no receiver is configured. |
| 2 | The enquiry becomes a lead in Sales OS, and the owner is told | LEOS intake receiver, Sales OS queue, assignment, outbox notifications | **Built, not released:** chain #749 → #750 / #751 / #752 / #754 → **#756** (audit-class; AUD-R2 PASS WITH CONDITIONS). |
| 3 | The rep sends a written quote for an outright sale | LEOS quotes (`outright_sale`); quote email with portal link (EMAIL-1) | **Works end to end** (#753 qualification PASS, on main). **GAP-EXP-1:** an expired quote can still be accepted, at a stale price. |
| 4 | The customer accepts online | Quote-acceptance magic link (72 h, single use) | On main. Needs EXP-1 fixed first. |
| 5 | Invoice raised | Conversion creates a sale invoice and a sale delivery (`quote_conversion_service.ts:741-756`, `invoice_generation_service.ts:311-345`) | On main, for outright sales only. Hybrid hardware + service does not invoice the hardware (GAP-HYB-1), so the first sale is **hardware only**. |
| 6 | The customer pays online | PayFast (once-off) and its payment notifications (ITN) | **Code exists but is switched off.** Before money flows: **GAP-PAY-1/2** must be fixed (payment refused on an unissued invoice or above the amount due, plus a payment idempotency index; audit-class, money). PayFast merchant credentials are also needed. |
| 7 | The customer sees the invoice and receipt in the portal | LEOS customer portal (`/portal/invoices`, `/quotes`, `/documents`) | Exists. Public domain `portal.signalone.co.za` is qualified with conditions: the API must move to `api.signalone.co.za` at the same time. |
| 8 | Stock and delivery | Sale delivery on conversion; stock and serials | **GAP-STOCK-1** (two stock models, nothing linked to the catalogue) and **GAP-ALLOC-2** (serial/IMEI not unique). For one first sale, delivery can be recorded against a single stock model chosen now, with serials captured once. |
| 9 | Product and price in the catalogue | LEOS catalogue product and price | Needs the exact P30 model designation and an approved selling price. No price may be invented. |

## Order of engineering work

One LEOS builder at a time; audit-class items stop for a pre-merge audit.

1. **Done (draft):** partner-applications queue, **#759**, stacked on #758, which is stacked on #756.
   - Migration 0204, class A, so the PR is audit-class.
   - Partner applications live outside the customer pipeline and metrics, with full lifecycle, owner, history and notifications.
   - Gate GREEN, with 10 mutation-proven controls.
   - #758's manifest is reconciled (8cbc05b).
   - #758 and #759 release together, after #756.
2. **#756 release qualification.** Remaining conditions:
   - Exercise the `transaction_timeout` change (258f11e2) on **PostgreSQL 18**. Production is 18; every run so far used 16, and on 17+ this setting ends the whole session, not only the transaction. I tried to run this with PG 18 binaries from npm; the session's permission system refused it. **Your call** (decision 1).
   - R2-01/R2-02: add the missing controls for the log-redaction wiring. These are S3 follow-ups and do not block the release.
   - An Architect ruling on migration numbers 0190–0194 and 0197–0203.
3. **In progress:** the money path for the first sale, GAP-EXP-1 and GAP-PAY-1/2, on branch `claude/money-path-first-sale` off main.
   - One audit-class draft PR with mutation-proven tests.
   - The expiry guard sits at quote acceptance, so Mubaraq's quote-to-contract conversion (LC01) is not touched.
4. **PayFast qualification on the sandbox:**
   - verify payment notifications against PayFast's own documented signature examples, not self-signed fixtures;
   - then a single human-armed live payment of a small amount.
5. **Stock model decision (GAP-STOCK-1),** then the P30 product, its price and the stock receipt.
6. **Portal domain move** (API and web together), then "Sign in" on the website.

Partner pipelines, dealer workspaces and managed-communications subscriptions follow. None of them is on the critical path to the first paying radio customer.

## Decisions required from the founder

1. **PostgreSQL 18 test for #756:** allow installing PG 18 test binaries (npm `@embedded-postgres`) in this session to qualify `transaction_timeout`. Alternatively, run a read-only `SHOW server_version; SHOW transaction_timeout;` on production yourself, or accept the risk with a feature flag off.
2. **Release approvals, in order:**
   - the #749–#756 chain (audit-class);
   - then #758 together with the partner queue;
   - the Architect's migration-number ruling.
3. **Receiver credential:** issue the website intake credential through the approved mechanism. Then set the website's receiver variables and run one labelled production smoke enquiry.
4. **PayFast:**
   - confirm the merchant account and provide credentials as LEOS environment secrets, never in chat;
   - choose PayFast (card or instant EFT) as the first payment method;
   - approve the first human-armed live payment.
5. **First product:**
   - the exact P30 supplier designation;
   - the approved retail price (excl. VAT) and any delivery fee;
   - whether the first sale is hardware only. Recommended: communications service quoted as a separate monthly line until hybrid invoicing (GAP-HYB-1) is fixed.
6. **Stock:** which LEOS stock model is authoritative, and when the 142 units are received into it (serials captured at receipt).
7. **Portal domain:** approve the API + web move to `signalone.co.za`, or launch the first sale on the existing portal address.
8. **Operations mailbox:** create `operations@signalone.co.za` and confirm a test message arrives.
9. **Legal:** what a VAT invoice must show. Today's invoice PDFs hard-code the registered entity's name, address, registration number and VAT number; that is required on a tax invoice but conflicts with keeping it off public pages.

## Earliest safe release points (2026-11-27)

Each release is independent unless a dependency is listed. Each needs your approval, its audit gate, and verification that both LEOS services report the pushed SHA.

| Release | Contents | Depends on | Ready when |
|---|---|---|---|
| **A. Online enquiry capture** | #749 → #756 (receiver, outbox notifications, privacy and retention, Sales OS enquiry queue) | nothing | Three things: the PostgreSQL 18 `transaction_timeout` check (decision 1); the Architect's migration-number ruling; the receiver credential. Then set the website's receiver variables and send one labelled production smoke enquiry. **Customer enquiries, quote requests and onboarding requests then reach LEOS directly, with no email fallback.** |
| **B. Partner applications** | #758 + #759 together (partner intents and the partner applications queue, migration 0204, class A) | A | Pre-merge audit of 0204 and the queue; your decision on who may approve; optional operations mailbox variable. **Must not ship #758 without #759.** |
| **C. First-sale money path** | `claude/money-path-first-sale` (GAP-EXP-1, GAP-PAY-1/2) | nothing (off main) | Build in progress, then pre-merge audit (money). Can ship before or after A. |
| **D. Online payment** | PayFast switched on, configuration only once C is live | C | Merchant credentials as LEOS secrets; a sandbox pass against PayFast's published signature examples; one human-armed live payment. |
| **E. Customer onboarding** | Today: a website onboarding request (in A), then a staff-sent client invitation (72-hour single-use link on main), then the customer portal. | A | Usable as soon as A ships. **Automatic** invitation on quote acceptance is not built; it is the next increment after C. |
| **F. Portal address** | API + web moved to `signalone.co.za` together (`CUSTOMER_PORTAL_DOMAIN_QUALIFICATION.md`) | nothing | Your approval of the infrastructure change. Not needed for the first sale if the existing address is acceptable. |
| **G. Sales OS consolidation** | `claude/sales-os-consolidation` | Built so the shell can ship from main independently. Enquiry- and partner-queue panels are capability-gated and light up after A and B. | Build in progress, then pre-merge audit (auth and roles), then your visual acceptance. Preview retirement only after G is accepted in production. |

**First paying radio customer, in order:**
- A (enquiries arrive) and C (safe money path), in either order;
- then D (PayFast);
- then the product, price and stock decisions;
- then the first sale, on the existing portal address unless F has shipped.

B and G proceed in parallel and do not block the first sale.
