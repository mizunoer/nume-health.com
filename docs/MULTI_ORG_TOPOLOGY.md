# Multi-org topology: Nume ↔ Mythic ↔ PioneerRx (2026-08-02)

_The tenant layout and cross-org intent, as configured live via the tenant
service. Companion to [NUME_ORG_REPLICATION.md](NUME_ORG_REPLICATION.md)._

## Organizations

| Org | ID | Role | MCP key |
|---|---|---|---|
| Local Dev | `4de436b7-cf77-4df3-afa9-6e11f750f22a` | platform/dev org (dev.workshift.io staff, junk/test config, QA seeds) | `workshift` in .mcp.json |
| **Nume Health** | `1e38339c-9509-4012-ab96-543fea9f4dc7` | DTC telehealth: Provider Portal + Marketing CRM apps, portal.nume-health.com | `workshift-nume` |
| **Mythic Rx** | `ce0d6e17-084d-4113-80c8-d97a898e2242` | 503A compounding pharmacy: clinical config only (9 types, 20 role views, 5 groups — Provider/Pharmacist/Pharmacy Tech/Billing/Patient; NO marketing objects, NO apps yet) | `workshift-mythic` |

Mythic old→new ID map: `mythic-id-map.json` (session scratchpad; commit if needed —
regenerable from db-export + the importer).

## The connection (created, PENDING)

**OrganizationConnection `e012d3d4-ac0d-4671-b357-ecf725ac4c2d`**
(Nume Health ↔ Mythic Rx), status **pending** — the master kill switch stays
off until activation, which the server refuses without contract reference +
signed BAA + NDA. The connection's `notes` field carries the canonical intent:

## PioneerRx integration path (the objectives)

```
                        ┌───────────────── NATIVE (only here) ─────────────────┐
  Nume Health  ══ conn e012d3d4 ══>  Mythic Rx  ──VPN──> PioneerRx (192.168.1.10)
  (telehealth)      (pending)       (pharmacy)           VPN tunnel LIVE
                                                          Enterprise API auth VERIFIED
                                                          RxEvents push schema mapped
```

1. **Pioneer is natively connected ONLY through Mythic.** The VPN client
   (dev-workshift-vpn-client EC2), the Enterprise API signing, and the future
   RxEvents listener all belong to the Mythic side. Nume never talks to
   Pioneer directly.
2. **Nume → Mythic (share, on Rx creation):** when a prescription is created
   in Nume, the patient + prescription records flow across the connection.
   Mythic then **creates the patient in PioneerRx** and submits the Rx.
3. **Mythic → Nume (share, on fulfillment):** fulfillment + payment status
   flow back to the prescribing workflow. Per the 8/1 call: Mythic sees the
   referring **physician group only** — never campaign or marketing data.

**What executes the flows:** the per-resource-type **data-sharing components**
(Components tab, SNS+SQS transport) — the backend RPCs Kramer named as the
next platform build. Until they land, the connection carries the contract
gate + documented intent; nothing moves.

## Static sites (feature shipped 2026-08-02, PR #69)

`StaticSite` is now a first-class org-scoped object (admin RPCs + MCP tools +
"Static Sites" tab on the org dashboard): name, apex domain, deploy bucket,
distribution, cert ARN, staged/live/retired, optional linked portal App.
Deliberately separate from Domains (routing) per the call. Seeded records:

| Org | Site | Bucket | Distribution | Cert |
|---|---|---|---|---|
| Nume Health | nume-health.com (live) | dev-workshift-site-nume-health | `EN6S5SCKVO0NZ` | `0b19b862…` (+ linked Provider Portal app `14a9b0e4…`) |
| Mythic Rx | mythic-rx.com (live) | dev-workshift-site-mythic-rx | `E2ML978ZN4Z8YY` | `0fec1512…` |

## Activation checklist (when ready to turn sharing on)

1. Contract/MSA reference between Nume Health LLC and Mythic Rx entities — counsel.
2. BAA signed (PHI flows both directions) — counsel.
3. NDA signed.
4. Edit connection `e012d3d4` → status **active** with those fields set
   (Tenants → Nume Health → Connections). Server enforces all three.
5. Data-sharing component RPCs (Kramer) + per-field share masks configured
   (Patient/Prescription: Nume→Mythic; fulfillment/payment status: Mythic→Nume).
