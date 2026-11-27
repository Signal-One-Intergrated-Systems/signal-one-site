# Stock receiving readiness: 142 Hytera P30 Pro, Monday 30 November 2026

Read-only review of LEOS `origin/main` @ `151936f4`, 2026-11-27. The founder rules that LEOS is the authoritative inventory system and that incoming stock is never shown as physically available until receipt is verified.

## Verdict: NOT READY. One operating rule applies until the fix ships

**Do not mark the purchase order RECEIVED in LEOS.**

That status change runs `ProcurementInventoryBridgeService`, wired live, which does three things:

1. It creates one `inventory_items` row per unit: **142 rows, status `available`**. Each row has an invented serial `PO-<po>-<item>-<n>`, type `OTHER` and no IMEI. See `procurement_inventory_bridge_service.ts:91-112` and `drizzle_inventory_repository.ts:207`.
2. Those serials cannot be corrected later: neither the update schema nor the repository accepts a serial change.
3. It also generates a draft accounts-payable bill (`procurement_route_service.ts:268-290`).

Verified by reading the code at those lines.

**Safe for Monday without new code:**
- Create the PO and its single line of 142 units through the API: `POST /procurement/purchase-orders`, then `/items`, then submit, approve and issue it. The procurement page cannot add lines or issue a PO.
- Keep it at **ISSUED**.
- Physically quarantine the boxes until LEOS can receive them properly.
- The approver must hold `procurement.purchase_orders.approve`: `platform_admin` or `super_admin`. A procurement officer cannot approve their own PO, by design.

## What LEOS has and lacks

| Need | State on main | Evidence |
|---|---|---|
| PO with lines | Exists (API). UI creates the header only. | `procurement.routes.ts:108, 281`; `procurement/page.tsx:80-100` |
| Partial receipt, ordered vs received | **Missing.** RECEIVED is terminal and all-or-nothing. | `procurement_route_service.ts:217-228` |
| A radio stock model with an IMEI field | `governing_assets` (`asset_type` "radio", `imei`). `inventory_items` has no radio type and no IMEI. | `asset_governance.ts:76-113`; `inventory.schemas.ts:23-31` |
| Unique serial and IMEI (GAP-ALLOC-2) | **Missing** on `governing_assets`: both indexes are non-unique and there is no duplicate check. | `asset_governance.ts:105-110`; `asset_governance_service.ts:99-100` |
| Bulk serial/IMEI capture | **Missing.** One unit at a time. | `asset-governance/page.tsx:89-188` |
| "Received, pending verification" state | **Missing** in every model. A new asset always starts as `inventory`. | `asset_governance.ts:32-41` |
| Who can register radios | `assets.create` is held by `super_admin` only. | `packages/rbac/src/matrix.ts` |
| Reserve one unit for a sale | `asset_assignments` exists, but it does not check the asset's status or existing assignments, and has no unique guard. A sale delivery is linked to no unit. | `asset_assignment_service.ts:147-177`; `0143_sale_deliveries.sql:37-49` |
| Catalogue link (GAP-STOCK-1) | **Missing.** Stock rows hold only a free-text model. | `governing_assets.model`; `purchase_order_items.product_code` is unused |

## Smallest build that meets the founder's rule (audit-class: migration and auth)

1. **Receipt against the PO.**
   - A new receipt table: a goods-received note linked to the PO line, recording quantity ordered vs received and any discrepancy.
   - An atomic bulk endpoint that registers radios as `governing_assets` (model "Hytera P30 Pro") from pasted or CSV serial/IMEI rows.
   - Partial receipt allowed.
2. **Uniqueness.** Partial unique indexes on `governing_assets` (tenant_id, serial_number) and (tenant_id, imei) where not deleted. Check existing rows for duplicates first.
3. **Pending verification.**
   - A new asset status, `pending_inspection`, set on receipt.
   - A verify transition into `inventory`, under a named permission.
   - Only verified units count as available.
4. **Stop the placeholder units.** The PO→inventory bridge must no longer create `available` placeholder rows for serialised radio lines.
5. **Permissions.**
   - `inventory_manager` gets receive and register.
   - Verification goes to a named role.
   - The founder's separation of duties applies: whoever receives should not also verify. **Your decision:** may one person do both for this first delivery?
6. **Allocation guard.** An asset can be reserved for at most one live assignment, and only from `inventory`. Then link a sale delivery to its unit.

Items 1–5 are needed for Monday; item 6 is needed for the first sale.

**Sequencing.** This follows the money-path build that is finishing now, under the one-LEOS-builder rule. It is audit-class, so it stops for a pre-merge audit. Release needs the same gate and the deploy check that both services report the pushed SHA.

**If it is not live by Monday:** the radios stay quarantined and the PO stays at ISSUED. No stock appears in LEOS, which is truthful.
