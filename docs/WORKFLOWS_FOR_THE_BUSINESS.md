# Workflows for the business — capability review, live wiring, LegitScript alignment

_2026-08-02/03. Written after wiring and testing real workflows in the Nume Health
and Mythic Rx tenant orgs. Companion to [MULTI_ORG_TOPOLOGY.md](MULTI_ORG_TOPOLOGY.md)
and [LEGITSCRIPT_COMPLIANCE.md](LEGITSCRIPT_COMPLIANCE.md)._

## 1. What the engine can actually do today (verified, not assumed)

Two workflow formats coexist. The **designer `graphJson` format is the one the
runner executes** (proven live by the cPanel-bridge test; the old typed-node
format on the legacy "Rx Lifecycle" workflow was never validated). The node
registry (`api/proto/workflow/v1/nodes.json`):

| Category | Nodes | Notes |
|---|---|---|
| Trigger | `exec.onEvent` | fires on `v1.events.resource.created` (SNS→SQS→runner), scoped by the workflow's `resourceTypeId` |
| Logic | and / condition / switch / not | branching |
| Data | string / number / boolean / payload / transform / formatString / parseJson / math | templating + shaping |
| Action | **postWebhook** (url, method, **headers**, body) / **email** (from + to/subject/body pins) / delay / debug / **javascript** | the workhorses |

**Capability gaps that matter to the business** (each has a workaround today):

1. **No SMS/voice/video node** → `postWebhook` to the comms emulator now, real
   Twilio later (same shapes — swap URL + credentials).
2. **No resource-mutation node in the executed format** → workflows can notify
   about state changes but not *make* them (e.g. can't set `rx-status=notified`).
   The legacy format's `NODE_TYPE_RESOURCE` suggests intent — worth asking
   Kramer to port it into the designer registry.
3. **No cross-org node** → the Nume↔Mythic share executes via the data-sharing
   components (Kramer's named build); until then the bridge harness emulates it.
4. **Triggers are create-only** (`resource.created`) in the proven path —
   update-triggered flows (status-change watchers, the missed-refill scenario)
   need `resource.updated` events validated end-to-end.

## 2. Live workflows (created in the tenant orgs, graphJson format)

| Org | Workflow | Trigger | Action | Business scenario |
|---|---|---|---|---|
| Nume | Lead intake → marketing notification | Lead created | email → dev@mythic-rx.com | same-day follow-up on every funnel submission |
| Nume | Rx sent → patient SMS status | Prescription created | webhook → comms emulator `/sms` | patient status comms; STOP/HELP language baked into the template |
| Nume | Encounter → telehealth video room | Encounter created | webhook → comms emulator `/video/rooms` | provisions the video visit (Twilio Video shape) |
| Mythic | Rx received → order-received SMS | Prescription created | webhook → comms emulator `/sms` | pharmacy-side patient comms |
| Mythic | Claim recorded → fulfillment ops email | Claim created | email → dev@mythic-rx.com | fulfillment + payment audit trail |

The comms emulator (`/comms/v1/*`, PRs #70/#71) is Twilio-shaped: Messages,
Video Rooms, Calls; deterministic SIDs; sends logged to CloudWatch, delivered
nowhere. Swapping to production Twilio = URL + credentials, no workflow changes.

**VERIFIED LIVE 2026-08-03 04:37 UTC — all five workflows fired and COMPLETED
through the real event chain** (resource created via MCP → SNS → eventworker →
runner → action), within ~2 seconds of the writes. Emulator logs show both SMS
bodies (STOP/HELP language intact) + the provisioned video room; both emails
accepted by SES (check dev@mythic-rx.com: "[Nume CRM] New GLP-1 lead received"
and "[Mythic Rx] Fulfillment + payment recorded").

Getting there surfaced and fixed THREE platform gaps, each shipped same-day:
- **#72** — the MCP Lambda (which runs the resource server in-process) had no
  SNS env vars: every MCP-driven write silently skipped event publishing; the
  eventworker had never been invoked since deployment.
- **#73** — `action.postWebhook` never applied its `headers` property (auth'd
  targets always got 401); `action.email` ignored `from`; the runner Lambda
  had no `ses:SendEmail` policy (the email node had never once sent).
- **#74** — the eventworker's resource handlers were log-only stubs: the
  event→workflow bridge (find matching workflows by org+type+event, create
  execution with the event as initial context, enqueue) did not exist.
  `exec.onEvent` was decorative until now.

## 3. Scenario catalog → future workflows

From every discussion to date (Kramer calls, Kara call, LegitScript reviews):

| Scenario | Workflow shape | Blocked on |
|---|---|---|
| Missed-refill SMS (the original use case) | `resource.updated` on Prescription, condition on days-supply/refill dates → SMS | update-trigger validation; date math (data.math exists) |
| Appointment reminders (24h/1h) | Encounter created → delay → SMS/email | `action.delay` exists — viable NOW via emulator |
| Credential expiry → LegitScript 30-day reporting | Credential resource near-expiry → task + ops email | Credentials-as-resources (org-dashboard additions item) |
| Campaign approval gate → publish | Campaign status → approval workflow → static-site publish | content-lifecycle wiring (static sites tab shipped; publish hook TBD) |
| Lead nurture drips | Lead created → delay chain → email/SMS sequence | consent state checks (condition node on sms-consent) |
| PDMP check before controlled Rx | Encounter flow step (testosterone/ketamine program) | belongs IN the encounter flow; EPCS module decision (see medical-records doc §3a) |
| Rx status chain Nume↔Mythic↔Pioneer | share components + RxEvents listener | Kramer's component RPCs; Pioneer listener build |
| Termination/export window | Connection terminated → export-package job + notice | component RPCs + export tooling |

## 4. LegitScript alignment (their published posture + our 9-standards map)

LegitScript's healthcare certification "independently verifies practitioner
credentials, medication sourcing, and advertising accuracy," and is explicit
that certification is "the beginning of the advertising journey, not the end" —
i.e. ongoing monitoring. Their target verticals literally list our shape:
telehealth providers, **compounding pharmacies**, weight-loss clinics.

Where workflows serve the standards (numbers = our 9-standards map):

- **Std 1/licensure + 30-day reporting (ongoing):** credential records as
  resources + expiry/status-change workflows generating the LegitScript
  notification task. This is the highest-value compliance workflow to build
  next — "failure to timely respond" is a standalone revocation trigger.
- **Std 5/patient services + Std 8/transparency:** lead-intake notification
  (same-day follow-up), Rx status comms (patients always know where their
  order is), refund/subscription event notices. All wired or wireable today.
- **Std 7/valid prescription:** the encounter flow IS the documented
  practitioner-patient relationship; the E2E test shows lead → signed encounter
  → Rx with the physician decision recorded before any prescription exists
  (no pre-care prescribing).
- **Std 9/advertising + affiliates:** campaign-approval workflow gates
  publication (ad-claim parity with the landing factory); the connection model
  keeps marketing data OUT of the pharmacy (verified: zero marketing fields in
  the entire Mythic org) — clean separation when LegitScript reviews either
  entity. Partner-certification question (std 4) is still the open item with
  the account manager; the referral-code program is the hedge.
- **SMS consent:** every SMS template carries STOP/HELP language; the funnel's
  consent timestamp lives on the Lead and travels nowhere it shouldn't.

## 5. Verified E2E journey (2026-08-02 run, all-fictional data)

18 logged hops: funnel lead (utm=dtc-consumer, SMS consent) → marketing view vs
provider-minimal view (utm/email stripped server-side) → booked → patient →
signed encounter (Approved) → Rx NUME-RX-0001 → **masked share payload (0
marketing fields)** → Mythic patient + Rx → Pioneer-emulator ACK (202) →
filled + claim ($170 paid) → status back to Nume → lead converted → Pharmacy
Tech view (minimal) → **org-wide audit: zero utm/campaign/funnel occurrences in
Mythic**. Log: session scratchpad `e2e-journey-log.json`.

Boundaries that held, exactly as designed on the 8/1 call: marketing never sees
clinical, pharmacy never sees campaigns, provider sees the minimal lead
context, and the cross-org payload carries the physician group only.
