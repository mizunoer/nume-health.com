# Dashboard architecture: Workshift Admin vs Org Dashboard

_Spec from Dallin's direction 2026-08-02, refining the 8/1 Kramer call. RESOLVED against
the full local transcripts (kramer-call-part{1,2}-full-transcript.txt) — the viaim shares
had dropped the second half of both calls._

## "The publisher" — solved from the clean transcript

viaim garbled **"under the resource types, there's a tab that's called Components"** into
"the tab that's called the publisher." Kramer's actual design (part 2, 17:25–19:55):

- The **Components tab on a resource type** is where capability components live (his
  example: a messaging component that binds "which attribute is the phone number").
- **Add a DATA-SHARING COMPONENT there**: configured with destination organization + app,
  and a **field-by-field shareable yes/no mark** over the resource's attributes.
- **Components expose nodes to the workflow editor when enabled** (messaging → a
  send-message node appears; sharing → share/sync nodes appear). Sharing executes in
  workflows, triggered by RESOURCE changes (e.g. a "share with Mythic" checkbox), never by
  app-level actions.
- Disabling app-to-app sharing disables the component in place — no deletion.
- ⚠️ Kramer: "components configuration will be available **after we add the corresponding
  backend RPCs**" — the tab is UI-only today. The component RPCs are a named build item.
- Transport: **SNS + SQS for the initial rollout; Kafka/MSK later** (explicitly decided —
  Kafka rejected for now as too slow to set up properly).

## The two-level model

```
Workshift Admin dashboard  (PLATFORM level — does not exist yet)
│   organizations, org↔org connections, sharing config, cross-org event view
│
└── Org dashboard  (dev.workshift.io today — exists, is org-scoped)
        types/views/apps/domains/workflows/users … + the additions below
```

**Today's dev.workshift.io is an ORG dashboard** — it administers exactly one organization
(the API and every query are org-scoped; there is no org switcher and **no Organization
CRUD anywhere in the protos** — verified: zero `Organization` RPCs). That gap is the
platform dashboard's reason to exist.

## Workshift Admin dashboard (new — platform level)

| Area | What it does |
|---|---|
| **Organizations** | List / create / suspend orgs. ⚠️ Requires NEW platform capability: an Organization service (CRUD + API-key issuance per org). Nothing exists today — org rows are hand-created. This is the first build item. |
| **Connections (org ↔ org relationships)** | Create a relationship between two orgs: parties, contract/NDA reference, status (`pending / active / suspended / terminated`) — status is the kill switch: non-active ⇒ nothing shared. Effective/terminated dates. On termination: a grace window where the counterparty can **export their history** (the prescriptions-download obligation from the call). |
| **Sharing configuration per connection** | Which resource types flow, in which direction, and the **per-attribute share mask** (select component → right-click → mark fields, per the call). Marketing attribution fields (utm/campaign) are explicitly part of shareable payloads — the pharmacy org must see which campaign a lead came from. |
| **Transport wiring** | Per-connection SQS queue pair (+ DLQ), provisioned when a connection activates — same CFN pattern as the workflow queues from PR #46. |
| **Cross-org event viewer** | The workflow/event view spanning a connection: which events fired, which share components triggered, payload summaries, replay from checkpoint. |
| **Platform operators** | Who can administer orgs/connections (today's `users` table is org-staff; platform admins are a level above). |
| Later | Module marketplace toggles per org (script-send, marketing/funnel, content mgmt); billing. |

## Org dashboard (dev.workshift.io — what to ADD)

Already there: configuration guide (PR #53), resource types/attributes, views, permission
groups, apps/activities/pages, domains, workflows, staff users.

**Additions at the org level:**

1. **Static pages management** (lands HERE, per Dallin — sites are org-scoped, not
   platform-scoped, and stay separate from portal Apps per Kramer):
   - Sites list: domain, deploy target (bucket/distribution), cert + domain-verification
     status, robots/sitemap state.
   - Page content: the config-driven site data (site.config pages, collections entries)
     surfaced as editable resources with the draft → preview → approve → publish lifecycle
     already built into the platform sites.
   - Campaign management: the CRM Campaign records ARE this — plus **workflow gates**
     (campaign approval → publish) so "the next person" can't skip the compliance checks.
   - Domain checklist per site: registrar/NS state, cert, verification TXTs (GSC/Meta/
     TikTok), SES identity.
2. **Shares (my org's view of connections)**: what this org shares out and receives, per
   connection — read-only projection of the platform-level config, plus per-org opt-outs.
3. **Integrations panel**: the Marketing Integration records (SES/Twilio/GSC…) as a
   first-class status board.
4. **Credentials**: provider/pharmacy credential records with expiry workflows (feeds the
   LegitScript 30-day reporting obligation).
5. **Module toggles** (org-side view of what the platform enabled).

## New org for Nume — status and playbook

**Blocked on platform capability:** there is no API to create an organization (and the MCP
key is org-scoped, so config replication needs a key issued FOR the new org).
**Ask Kramer:** create org "Nume Health" + issue a `wsk_` key for it. Then replication is
mechanical — every object and ID is documented (workshift-configuration-map.md, the
pharmacy org build, CRM_CONFIGURATION.md), and the same MCP calls rebuild it: 18 resource
types, attributes, relationships, permission groups, views, the two Apps (Provider Portal,
Marketing CRM), workflows, and the Domain row.

**Done today (staged in the current org so nothing waits):**
- `portal.nume-health.com` is LIVE end-to-end: ACM cert issued (validation via our Route 53),
  CNAME → the portal distribution, portal stack redeployed with the domain + cert bound,
  AppBaseUrl = https://portal.nume-health.com, and the **Domain row** routes the hostname to
  the "Nume Provider Portal" App. When the new org exists, the Domain row and app config
  move there; DNS/cert/stack don't change.
- Login still 500s **by design** until the participant Auth0 credentials exist
  (`WORKSHIFT_PARTICIPANT_AUTH0_*` keys — the standing top blocker, unchanged).
