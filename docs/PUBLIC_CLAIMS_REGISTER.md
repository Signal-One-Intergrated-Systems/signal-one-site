# Signal One Public Claims Register

Purpose: prevent unsupported technical, compliance, performance and customer claims from entering public marketing.

A public claim should have one of these statuses:

- **Repo-demonstrated** — capability is directly represented in the current product/public repository or controlled QA evidence.
- **Vendor-source required** — claim may be valid but requires a current vendor datasheet, contract, service schedule or other authoritative source before public use.
- **Customer-evidence required** — outcome claim requires measured customer evidence and approval.
- **Do not publish** — claim is too broad, unverified or likely to imply a commitment Signal One has not established.

## Guard / security operations

| Claim | Status | Current evidence | Public-use rule |
| --- | --- | --- | --- |
| Site-linked guard clock-in / clock-out | Repo-demonstrated | Public Guard product descriptions and QA/demo flow | May publish as capability |
| Geofence policy for attendance | Repo-demonstrated | Public Guard product descriptions | May publish as configurable workflow; do not imply perfect location accuracy |
| Patrol routes and QR / NFC checkpoint verification | Repo-demonstrated | Public Guard product descriptions | May publish as capability |
| GPS policy for patrol verification | Repo-demonstrated | Public Guard product descriptions | May publish as configurable workflow |
| Offline field continuity and later synchronisation | Repo-demonstrated | Public Guard product descriptions | May publish as design behaviour; avoid unsupported sync-time guarantees |
| Incidents / occurrence records | Repo-demonstrated | Public Guard product descriptions | May publish |
| SOS and operational exception visibility | Repo-demonstrated | Public Guard product descriptions / controlled QA copy | May publish |
| Role-scoped operational access | Repo-demonstrated | Public Guard product descriptions | May publish |
| Proof-of-service views | Repo-demonstrated | Controlled QA/demo screenshots and public product copy | May publish |
| Client-facing views without full internal workspace access | Repo-demonstrated | Public product positioning | May publish as intended product behaviour |
| Payroll processing | Do not publish | No public repository evidence | Do not claim until implemented and verified |
| PSIRA verification | Do not publish | No public repository evidence | Do not claim |
| Regulatory compliance certification | Do not publish | No supporting certification in website repo | Discuss specific obligations during procurement only |

## Critical Connect / PoC

| Claim | Status | Current evidence | Public-use rule |
| --- | --- | --- | --- |
| Managed Push-to-Talk over Cellular | Repo-demonstrated | Public platform/catalogue descriptions | May publish |
| Dispatch workflow | Repo-demonstrated | Public platform copy and dispatch imagery | May publish |
| Location-aware operational workflows | Repo-demonstrated at marketing level | Public platform descriptions | May publish carefully; deployment scope must be confirmed |
| Emergency / SOS communications workflow | Repo-demonstrated at marketing level | Public platform descriptions | May publish carefully |
| Video-enabled field workflows | Vendor-source required | Public marketing copy only | Phrase as supported-device/deployment option until source exists |
| DMR / TETRA / analogue RoIP bridging | Vendor-source required | Public marketing copy only | State that gateway integration can be evaluated; verify exact supported networks before naming |
| "Carrier-grade" | Vendor-source required | No authoritative source stored in repo | Do not use until sourced |
| "MCPTT" standards compliance | Vendor-source required | No standards/certification evidence stored in repo | Do not imply certification |
| Thousands of concurrent talk groups | Vendor-source required | No authoritative source stored in repo | Removed from public copy |
| Sub-300 ms latency | Vendor-source required | No authoritative source stored in repo | Removed from public copy |
| End-to-end encryption | Vendor-source required | No authoritative security specification stored in repo | Removed from public copy |
| Device "fully certified" for Critical Connect | Vendor-source required | No certification artifact stored in repo | Removed from public copy |

## Connectivity

| Claim | Status | Current evidence | Public-use rule |
| --- | --- | --- | --- |
| Multi-network IoT connectivity options | Repo-demonstrated at catalogue level | Public connectivity/catalogue descriptions | May publish without exact counts |
| Managed connectivity / SIM services | Repo-demonstrated | Public marketplace and connectivity pages | May publish |
| eSIM options | Repo-demonstrated at catalogue level | Public marketplace | May publish subject to deployment support |
| 180+ countries | Vendor-source required | No authoritative provider coverage document stored in repo | Removed from public copy |
| 600+ networks | Vendor-source required | No authoritative provider coverage document stored in repo | Removed from public copy |
| Strongest-network / unsteered behaviour | Vendor-source required | No current provider policy stored in repo | Do not make absolute routing claim without source |
| 5G / LTE-M / NB-IoT coverage | Vendor-source required | No current service matrix stored in repo | Confirm per provider / SIM profile |
| Private APN | Vendor-source required | No current commercial/service schedule stored in repo | Phrase as a scoped option only |
| Industrial SIM temperature range | Vendor-source required | No datasheet stored in repo | Removed from public copy |

## Hardware

Model-specific specifications such as IP rating, battery capacity, camera configuration, display size and operating system must be tied to the current supplier/manufacturer datasheet before campaigns repeat them.

The website may keep a model catalogue, but any technical specification used in paid media, tenders, quotes or comparison content must reference the current product source.

## Customer outcomes

The following claim types always require the case-study evidence workflow:

- percentage reduction in reporting time;
- percentage improvement in patrol completion;
- hours saved;
- contract-retention improvement;
- faster response;
- revenue / margin improvement;
- fewer missed shifts;
- customer satisfaction improvement;
- deployment time statements;
- named-customer quotations.

Use `docs/CASE_STUDY_EVIDENCE_TEMPLATE.md` before publication.

## Claim review workflow

1. Marketing proposes the claim.
2. Product / engineering identifies the current implementation evidence.
3. Vendor or supplier documentation is attached where relevant.
4. Legal / commercial review confirms that wording does not create an unintended contractual commitment.
5. The register is updated with source and verification date.
6. Only then may the claim be reused across website, ads, proposals, social content or sales collateral.
