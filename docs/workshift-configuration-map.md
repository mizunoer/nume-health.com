# Workshift configuration map, login routing, and Pioneer interoperability

_Written 2026-08-01; updated later the same day after the portal deploy and the DNS flip.
Everything here is verified against the live dev org (via MCP), the deployed AWS stacks, the
source tree, and a live probe of PioneerRx over the VPN — not inferred. Claims marked
**[MCP]** were re-verified against the live org at update time; see §7 for what the MCP can
and cannot keep current._

---

## 1. Why your login lands on the admin dashboard

**Nothing configurable decides it. It is hardcoded, because `dev.workshift.io` *is* the
admin app.** There are two completely separate auth worlds in this system, and only one of
them has routing.

### World A — staff/admin (what you are using)

- `dev.workshift.io` is the CloudFront domain of stack **`dev-workshift-web`**, which serves
  the Next.js app **`apps/workshift-admin`**.
- `apps/workshift-admin/app/page.tsx`:
  ```tsx
  const session = await auth0.getSession();
  if (session) return redirect("/app");   // ← hardcoded
  return <MainLayout><Login /></MainLayout>;
  ```
- Your identity is a row in the **`users`** table (`user.v1`), with a `role_id`.
  All four users (you, Kramer, David, Dennis) currently share the **same role**
  `d505a419-6787-430d-8293-2e37d94beadf`.
- **The Domains table plays no part in this.** Nothing about your user, role, or org changes
  where you land.

### World B — participants (the actual portal)

- `apps/workshift-frontend` reads the `Host` header → `GetFrontendPage(host)` →
  **Domain → App → App.main_activity → Activity.start_page** → renders that page.
- This is the configurable routing, and it is the mechanism the provider portal is built on.

### World B is now DEPLOYED (2026-08-01) — updated status

The original blocker table, with what changed:

| Was true this morning | Now |
|---|---|
| `apps/workshift-frontend` not referenced in any CI workflow | **Deployed.** PR #54 added stack `dev-workshift-portal` + a `deploy-portal` CI job. Live at **https://dlu0kmy8ynqbr.cloudfront.net** (dist E2LSJ3B2KP1765). It took three follow-up fixes to get the first deploy through — #57 (lazy Auth0 init; `next build` evaluates route modules with no runtime env), #58 (omit empty SAM params; `sam deploy` rejects `Key=`), and an AppBaseUrl precedence fix. |
| Only 2 junk Domain rows | **Still true [MCP].** `app1.workshift.io` → app `00000000-…` (broken) and `localhost` → "Test app with Activities". **No row points at the deployed portal's hostname, so it currently resolves no App** — after login it would render "Page not found". This is now the routing blocker. |
| Participant login merged but uncredentialed | **Still true.** The `workshift-dev` secret has 5 keys and **none** of the `WORKSHIFT_PARTICIPANT_AUTH0_*` keys (checked 2026-08-01). `/auth/login` on the live portal returns 500 by design until they exist. |

Verified live behavior: `/` → 307 to `/auth/login?returnTo=%2F` (proxy fails closed);
`/api/*` → **401 JSON, not a redirect**; the CloudFront viewer-host function, the
`x-portal-edge-secret` origin header, and `AllViewerExceptHostHeader` are all confirmed
deployed. One caveat stated honestly: the header-spoof defense is verified by construction
and local test — end-to-end verification needs a logged-in session, which needs the Auth0
credentials.

### The blank dashboard — resolved

PR #53 (merged) replaced `<div>Dashboard goes here</div>` with a `ConfigurationGuide`
component. The admin dashboard now carries the configuration guidance this doc proposed.

---

## 2. How the configuration objects actually interconnect

Verified shapes from `api/proto/admin/v1/admin.proto`:

```
Organization (implicit — every row is org-scoped)
│
├── ResourceType ──── Attribute (data_type, flags: 1=Unique 2=Searchable 4=Required)
│        │       └─── Relationship (→ another ResourceType, ONE | MANY)
│        │       └─── ResourceView  (layout + params.display_settings)
│        │                └── per-attribute mode: read / write / hidden   ← the PHI boundary
│        └─── Workflow → Node → Execution
│
├── PermissionGroup ── resource_type_ids[]   ← which TYPES a group may touch
│
├── App
│   ├── participant_type          "Doctor", "Customer", …
│   ├── user_resource_type_id     the ResourceType holding participant accounts
│   ├── user_resource_view_id     the view applied to that account record
│   ├── email_attribute_id        which attribute is the login email
│   ├── password_attribute_id     which attribute is the password
│   ├── logo                      ← BRANDING lives here (App-level)
│   ├── main_activity_id
│   └── Activity (activity_id, key, name, type, logged_out, start_page_id)
│            └── AppPage (key, params = component tree, flow = logic graph)
│
├── Domain (domain, app_id, resource_type_id)   ← host → App routing
│
└── users + roles                 ← STAFF only. Entirely separate from participants.
```

### Two structural observations worth deciding on

**Branding is on `App`, not Activity.** You remembered it as being under Activities — the
admin UI tab is `modules/admin/app/tabs/Branding.tsx`, which is a tab of the **App** form.
The only branding field in the proto is `App.logo`.

**Decision (Dallin, 2026-08-01): the "one App, many brands" premise is dropped.** Nume and
Mythic will have their setups close to identical and will share information, but their
domains stay separate and the data between them is **gated** — so they are separate Apps
(possibly separate orgs, see §2a), and per-Domain branding stops being the deciding factor.
Branding may end up in **both places** (Domain overriding App), or static pages may become a
separate App type entirely (§3). Either way the multi-brand argument no longer forces a
proto change on its own.

**`Activity.logged_out` is the anonymous-access flag.** That is the hook for public pages
(marketing, intake, "check my status") living inside an App rather than as static files.

---

## 2a. Multi-entity relationships — the model Nume + Mythic actually need

_Direction from Dallin, 2026-08-01. This is the most important architectural requirement in
this document and it is **not yet built** — captured here as the spec._

Nume (prescriber) and Mythic (503A pharmacy) are **separate entities that share data under a
contract**, not one tenant with two brands. The generalized shape:

- **Nume may add other pharmacy partners** in the future.
- **Mythic already has other physician partners.**

So the real model is **many prescribers ↔ many pharmacies**, each pair governed by a
relationship that can be **turned off** when a contract lapses. Everything below follows from
that.

### The entities and the join

```
Entity (a prescriber org OR a pharmacy org)
   │
   └── PartnerRelationship   Nume──┬──Mythic        ← 1:many on BOTH sides
            partner_a (prescriber entity)
            partner_b (pharmacy entity)
            status: pending | active | suspended | terminated   ← the kill switch
            effective_at / terminated_at
```

`PartnerRelationship.status` is the contract switch: flip it to `suspended`/`terminated` and
**all data sharing across that pair stops**, without deleting either side's records. This is
the "stop sharing if contracts lapse or are cancelled" requirement, and it must be a first-
class field, not an implicit consequence of deleting rows.

### Provider onboarding + credential approval (the flow Dallin described)

1. A physician from one of Mythic's partner practices **creates a login** (participant of a
   prescriber App).
2. They **submit credentials** — NPI, DEA, state license(s), malpractice — as a `Credential`
   record (attributes with `flags=4` required; expiries as DATETIME).
3. **Mythic staff approve** it — a status transition on the credential/provider record,
   gated to a Mythic-staff PermissionGroup. Nothing is visible downstream until approved.
4. Once approved, that provider sees patients where there is a **clear relationship**, defined
   two ways:
   - **Direct care:** prescriptions carrying that provider's **NPI** (Pioneer's RxEvents feed
     already carries `Prescribers[].NPI` and the Rx→prescriber link — so "clear relationship"
     is a join on NPI, not a manual assignment).
   - **Referral:** a patient explicitly referred to them. **⚠️ The referral mechanism does
     not exist yet and needs design** — flagged by Dallin as "a function we need to review."
     Minimum shape: a `Referral` record (from-provider, to-provider, patient, status) that
     grants scoped visibility the same way an NPI match does.

### How visibility is enforced

This is what view-scoping + relationships are for — the attribute-level enforcement primitive
is already proven (see §3 table and the role-visibility QA). What's missing is that today's
views scope by **role**, and this needs scoping by **relationship + entity**:

- a provider sees a patient only if (NPI match on an active Rx) **OR** (an active referral),
  **AND** the governing `PartnerRelationship.status = active`.
- a pharmacy (Mythic) sees everything sent to **their** pharmacy; a prescriber (Nume) sees
  their own patients across whichever pharmacies they're partnered with.

**Open platform question for Kramer:** relationship-scoped visibility is **row-level** ("this
provider ↔ this patient via this NPI/referral, gated on partner status"), whereas ResourceView
scopes **attributes within a type** and does not by itself express row-level cross-entity
rules. This likely needs relationship-aware filtering in the resource service or a dedicated
sharing-policy layer. It is the biggest unknown in the build and should be scoped before any
onboarding UI.

### Separate Apps, and possibly separate orgs

Because the entities operate independently with gated data, Nume and Mythic are **separate
Apps at minimum**. Whether they are separate **organizations** (the current hard tenant
boundary — every row is org-scoped) or one org with an `Entity` type and relationship gating
is the key modeling fork:

- **Separate orgs** gives the strongest isolation but makes cross-org sharing — the whole
  point — something the platform does not currently do; every query is org-scoped.
- **One org, many Entities** makes sharing natural but puts the entire isolation burden on
  the sharing-policy layer above.

The partner graph spans entities ("Nume may have other pharmacy partners", "Mythic already
has other physician partners"), so two static orgs can't model it anyway. Recommend **one
platform org per top-level customer with an `Entity`/`PartnerRelationship` graph inside**, and
treat cross-customer isolation as the org boundary. Confirm with Kramer.

---

## 3. Where the static sites fit — and what is missing

### Current reality

- `sites/nume-health.com/login.html` is still `<form action="#" method="post">` — a **dead
  mockup**. Same for register/reset. No link to any Workshift portal exists in either site.
- No prior session has done any work wiring static-site login to Workshift (searched all
  session transcripts).
- Both sites are static S3+CloudFront (stack `dev-workshift-sites`), staged on
  `*.cloudfront.net`, no certs, DNS not cut over.

### The natural design — updated: static pages are managed SEPARATELY from portals

_Decision, Dallin 2026-08-01._ The product boundary is now explicit: **the portal is the
product we sell; the static pages are not necessarily ours to host.**

- **Many customers will host their own marketing pages.** For them we provide **only the
  application**, reached at a subdomain: `portal.` / `app.` / `login.<theirdomain>`. Their
  page just links to it — the same one-line link as before:

  ```
  <customer marketing site>  →  <a href="https://portal.<customer>.com">
                                  ↓ Domain(portal.<customer>.com) → App → Activity → start page
  ```

- **When we DO host the static pages**, they should be managed as a **separate concern** from
  the portal — either a distinct **module**, or (cleaner in this model) a new **App `type`
  that is a static page** rather than an authenticated Activity flow. This keeps a customer's
  marketing content out of the portal App entirely, which matches how the two are sold and
  who owns them.

- **Guarantee boundary (must be stated to customers in writing):** if we do **not** manage
  their pages — security, privacy policy, T&C — then we **do not guarantee** the texting,
  marketing, and email functions. Those functions depend on compliant page content (A2P
  registration needs a published privacy policy + T&C; email deliverability and marketing
  consent chain back to the same pages). This is a contractual line, not just a technical one.

Net: the deployed `workshift-frontend` is what serves the portal at those subdomains; the
static-site question is now a **separate track** (our-hosted vs customer-hosted), not a
blocker on the portal. What's still needed to light up a real portal is a **Domain row** for
each `portal.<customer>` hostname (there are none today — §2a status) and the participant
Auth0 credentials.

### What you described putting behind that login maps cleanly onto existing primitives

These are the fields a customer fills in during onboarding. Dallin's ask: **make them easy
for the customer to enter and easy for us to manage** — so each row below should surface as a
**flagged onboarding field** (a guided "enter this" item in the admin config guide / a
customer onboarding Activity), not something an operator hand-configures per client.

| Requirement (from your list / the Kara call) | Workshift shape | Customer-entered? |
|---|---|---|
| Individual + org credentialing (NPI, DEA, license, malpractice, OIG check) | ResourceType `Credential` + `Organization`, attributes with `flags=4` (required), expiry as DATETIME, a Workflow for expiry reminders | **Yes** — the onboarding form; approval is staff-side |
| Provider preferences: scheduling, availability throttles, states licensed, visit modes | attributes on the existing `Doctor` type (or a `ProviderProfile` child) | **Yes** — provider self-service |
| Pharmacy states + their scripts | ResourceType `PharmacyLicense` (state, license no., expiry) related to `Pharmacy`; scripts already model as `Prescription` | **Yes** — pharmacy onboarding |
| Which site content they may edit | ResourceType `SiteContent` (key, value, site) + a **ResourceView per role** marking fields write/read/hidden | Only if we host their pages |
| Restricted access per participant | PermissionGroup + per-role ResourceView; the server already strips non-permitted attributes (proven in testing) | No — platform config |

Nothing here needs new platform capability (the multi-entity gating in §2a does). It needs
configuration plus the participant login that is already merged but not credentialed —
**presented as a guided onboarding flow** so entering it is the customer's job, not ours.

---

## 4. PioneerRx — API and direct database, tested live

Probed 2026-08-01 from the EC2 VPN client over the tunnel.

### Direct database connection: **works, and is genuinely useful**

`192.168.1.10,49202` · `PioneerPharmacySystem_DayOld` · SQL Server 2019 · **2,565 tables**.

The copy is **refreshing daily** — rowcounts moved between 2026-07-30 and 2026-08-01
(`Prescription.Rx` 16,997 → 17,115; `Audit.PrescriptionAudit` 519,975 → 523,555;
`Person.Person` 4,932 → 4,958). So it is a live daily snapshot, not a frozen dump.

**Why direct DB is worth keeping alongside the API:** it exposes interoperability surfaces
the REST API does not, including the raw inbound e-prescription XML and the HL7 message
queues. Recommended split:

- **API (`/api/enterprise/method/process`)** — writes and transactional reads. Authoritative.
- **Direct DB (DayOld, read-only)** — analytics, reconciliation, backfill, field discovery,
  and reading raw standard messages. Never for writes.

### Interoperability surfaces found in the schema

| Schema | Tables | What it is |
|---|---|---|
| `EScriptPioneer` | 78 | Inbound/outbound e-prescribing. `ReceivedMessage.ReceivedXml` holds the **raw NCPDP SCRIPT XML**, plus signature validation columns and `MessageVersionID` |
| `Escript` | 12 | SureScripts plumbing — `SureScripts10dot6PrescriberSearch…` shows Pioneer still carries **SCRIPT 10.6** table names. ⚠️ **Build to 2023011, not 10.6.** CMS retired 10.6 for Part D on 2020-01-01 (not backwards-compatible with 2017071), and a 2024 rule mandates exclusive **2023011** from 2028-01-01. The Pioneer schema name reflects legacy plumbing, not the version to target. See `medical-records-exchange.md` §3. |
| `Hl7` | 44 | A full **HL7 v2 interface engine**: `IncomingMessage`, `OutgoingMessage`, `Hl7Format`, `Hl7Event`, `AdmitDischargeTransfer` (ADT), `PharmacyOrder`/`PharmacyOrderDetail` (RDE/RDS), `Patient`, `Prescriber`, `Insurance`, `DiagnosisCode`, `DrugAllergy`, plus **immunization registry submission** (VXU → state IIS) |
| `Prescription.Claim` | — | NCPDP Telecom claim data: `EdiOverrideXml`, `CompoundIngredientXml`, `TransactionResponseStatus`, submitted/paid cost fields |
| `EnterpriseAPI`, `PioneerRxDataExchange`, `DataExchange`, `API` | 7/7/7/4 | the API surfaces have their own backing schemas |

### An important correction to the framing

"HL7 and EDI compliant" is imprecise for a pharmacy platform, and building to the wrong
standard is expensive. The actual governing standards, by data flow:

| Flow | Standard | Not |
|---|---|---|
| Prescriber → pharmacy (new Rx, refill req/resp, cancel, change) | **NCPDP SCRIPT** (build 2023011; Pioneer's schema still shows legacy 10.6 names) | not HL7, not X12 |
| Pharmacy → payer (claim adjudication, reversal) | **NCPDP Telecommunication D.0** | not X12 837 |
| Clinical data exchange, facility/LTC orders, ADT, immunizations | **HL7 v2.x** (and **FHIR R4** for anything modern/API-based) | — |
| Medical (not pharmacy) billing, eligibility | **X12 EDI** — 837P, 835, 270/271 | only if you bill medical |

For Nume + Mythic specifically: you are a cash-pay telehealth prescriber feeding a 503A
pharmacy. That means **NCPDP SCRIPT is the standard that matters most** (provider → pharmacy),
**HL7 v2/FHIR** for clinical records, and **NCPDP D.0** only when you start billing insurance.
X12 is likely irrelevant near-term. Being "HL7 compliant" would not by itself make an
e-prescription valid — SCRIPT would.

### Recommended structure for the EHR + pharmacy components

1. **Model the Workshift `Encounter` and `Prescription` types on the standard field sets**,
   so a mapping exists rather than a translation layer:
   - Encounter → HL7 v2 `ADT`/`ORU` + FHIR `Encounter`/`Observation` field names
   - Prescription → NCPDP SCRIPT `NewRx` segments (Patient, Prescriber, Medication,
     SIG, DaysSupply, Refills, Substitutions, DEA schedule)
2. **Keep the raw message.** Whatever the transport, store the original SCRIPT XML / HL7
   message alongside the parsed record — Pioneer does exactly this (`ReceivedXml`), and it is
   what makes disputes and audits tractable.
3. **Validate at the boundary, not in the middle.** A `NewRx` that fails SCRIPT validation
   should be rejected at ingest with a NAK, the way the RxEvents listener already NAKs
   malformed JSON.
4. **Codify vocabularies now**: NDC (drug), RxNorm (clinical drug), SNOMED/ICD-10 (dx),
   LOINC (labs), NPI/DEA (identifiers). These are the fields that make records exchangeable;
   retrofitting them later is painful.
5. **Compounded GLP-1 caveat:** compounds have no NDC. Pioneer models this with
   `CompoundIngredientXml` and `Item.ItemDrugIngredient`. Any standard-conformant message for
   your products must carry the **ingredient list**, not a single product code — this is
   the single most likely place a naive integration breaks.

---

## 4a. The e-prescribing integration as a MODULE — toward a marketplace

_Direction from Dallin, 2026-08-01: "go forward with the recommendations… this is a great
example of a module we'd want to replicate. New client? Do you need to send prescriptions?
Enable the script-send module. Eventually make this into a marketplace."_

The framing shift: the Pioneer / e-prescribing work is not a one-off Nume↔Mythic wire, it is
the **first packaged module**. Build it so it can be **switched on per customer**:

- **A module = a bundle of Workshift config + a backing service surface**, toggled per App
  (or per Entity in §2a). "Script-send" bundles: the `Prescription`/`Encounter` types modeled
  on NCPDP SCRIPT fields, the SCRIPT validation-at-boundary, the raw-message store, the
  outbound signing (per `medical-records-exchange.md` §3), and the pharmacy connection config.
- **Enablement is a flag, not a rebuild.** "New client, do you need to send prescriptions?" →
  enable the module → the client's App gains the types, views, and the send capability. This
  is exactly the replicability the §2a `Entity` model and the existing config primitives make
  possible.
- **This is the marketplace seed.** A menu of modules (script-send, credentialing, lab
  results/HL7, marketing/funnel, content management) each of which is config + a service
  surface a customer opts into. The EHR→CRM "module menu" idea in the memory notes is the same
  thing. Nothing here needs building *as* a marketplace yet — but building script-send as a
  **cleanly enable-able bundle** rather than bespoke Nume plumbing is the decision that keeps
  that door open. Marketplace packaging itself needs Kramer buy-in.

Concretely for the current build: keep the Pioneer integration service, the SCRIPT field
modeling, and the per-customer pharmacy connection config **separable** — no hardcoded
"Mythic" anywhere that a second pharmacy partner couldn't be added beside.

---

## 5. What to build next, in order

1. ~~Deploy `workshift-frontend`.~~ **DONE** (2026-08-01, PR #54 + #57/#58) — live at
   `https://dlu0kmy8ynqbr.cloudfront.net`.
2. **Participant Auth0 credentials** — now the top blocker. The `workshift-dev` secret has
   **none** of the `WORKSHIFT_PARTICIPANT_AUTH0_*` keys (verified 2026-08-01); `/auth/login`
   500s until they exist. Plus the `email_attribute_key` server change so `getParticipant()`
   can resolve a login to a Doctor record. Needs a participant Auth0 application (client id +
   secret + callback URLs) created and its keys added to the secret.
3. **Add a real Domain row** for the deployed portal hostname (and eventually
   `portal.nume-health.com` / `portal.mythic-rx.com`) and delete the 2 junk rows; delete the
   7 test Apps [MCP: 9 Apps today, only "Nume Provider Portal" + "Test app with Activities"
   are real].
4. **Model the §2a `Entity` + `PartnerRelationship` graph** and get Kramer's read on
   row-level relationship-scoped visibility — the biggest platform unknown.
5. Then: credentialing / preferences / site-content resource types per §3, surfaced as a
   **guided onboarding flow** (customer-entered), and the script-send **module** per §4a.

---

## 6. What of this is verifiable via the Workshift MCP — for keeping it current

The MCP endpoint (`https://dev-api.workshift.io/mcp`, `wsk_` key) is the source of truth for
**org configuration** and re-verifies most of this document on demand. As changes land, the
**[MCP]-marked** claims should be re-checked with these read tools rather than trusted from
memory.

| Section / claim | MCP-verifiable? | Tool(s) |
|---|---|---|
| Domain rows (junk vs real) — §1, §5.3 | **Yes** | `admin_GetDomains` |
| Apps (which are real vs test), participant_type, main_activity | **Yes** | `admin_GetApps` |
| ResourceTypes present (13 today), attributes + flags | **Yes** | `admin_GetResourceTypes`, `admin_GetResourceTypeAttributes` |
| ResourceViews + display_settings (the PHI boundary) — §2, §3 | **Yes** | `admin_GetResourceTypeViews` (filter by `id` to get params back) |
| PermissionGroups | **Yes** | `admin_GetPermissionGroups` |
| Relationships between types | **Yes** | `admin_ListRelationships` |
| Activities / AppPages (component tree, flow) | **Yes** | `admin_GetActivities`, `admin_GetAppPages`, `admin_GetAppPage` |
| Staff users + roles — §1 | **Yes** | `user_GetUsers`, `user_GetRoles` |
| Workflows | **Yes** | `workflow_ListWorkflows` |
| The MCP's own instructions now reflect this model | **Yes** | `initialize` response `instructions` (added PR #55) |
| **Deploy state** (stacks, CI jobs, `workshift-frontend` live) — §1, §5.1 | **No** | AWS CloudFormation / CI, not MCP |
| **Auth0 credential presence** — §5.2 | **No** | Secrets Manager |
| **Pioneer schema / rowcounts** — §4 | **No** | SSM → EC2 over the VPN |
| **Source-tree facts** (proxy.ts, page.tsx) — §1 | **No** | the repo |
| **§2a multi-entity model** | **Not yet** | it's a spec — nothing to verify until built |

Live snapshot taken while writing this update [MCP, 2026-08-01]: **2 Domains** (both junk),
**9 Apps** (only "Nume Provider Portal" `9ac6a4d8` and "Test app with Activities" `46358287`
are real; 7 are `testing…`/`Customer` stubs with no main activity), **13 ResourceTypes**
(Patient, Prescription, Encounter, Doctor, Claim, Allergy, Condition, Consent profile,
Message, Payment method, Customer, Resource, TestResource), **4 staff users** all on role
`d505a419`. A convenience script lives in the session scratchpad (`mcp-state.mjs`) — node +
the `.mcp.json` bearer token, since `gh`/python aren't reliably installed here.

**Recommendation:** the config half of this doc can be regenerated from the MCP any time; the
deploy/secret/Pioneer/source halves cannot and must be re-checked by hand. When they diverge,
trust the MCP for config and the live AWS/Secrets/repo for the rest.

---

## Appendix — evidence

- Login routing: `apps/workshift-admin/app/page.tsx`, `app/app/page.tsx`, `proxy.ts`
- Deploy targets: `.github/workflows/deploy-dev.yml` (`deploy-frontend` builds
  `apps/workshift-admin` → stack `dev-workshift-web` → dev.workshift.io; **`deploy-portal`
  builds `apps/workshift-frontend`** → stack `dev-workshift-portal` → the participant portal)
- Portal live state: CloudFormation `dev-workshift-portal` outputs + `curl` of the CloudFront
  domain (2026-08-01)
- Domains/Apps/Users/Types: live MCP queries against the dev org (`admin_Get*`, `user_Get*`)
- Auth0 credential gap: `secretsmanager get-secret-value --secret-id workshift-dev` (5 keys,
  no `PARTICIPANT` keys), 2026-08-01
- Pioneer: SSM commands on `i-01c372aa55b4fc184` (`dev-workshift-vpn-client`) over the
  OpenVPN tunnel; pymssql/FreeTDS (pytds fails — server requires encryption)
