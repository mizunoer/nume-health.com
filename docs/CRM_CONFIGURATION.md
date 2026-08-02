# Marketing CRM — Workshift configuration (staged 2026-08-02)

_The "incoming gate" for Option 3 of the forms plan, and the marketing/funnel
module from the marketplace list (workshift-configuration-map.md §4a). Built
live in the dev org via MCP; everything below is verified by read-back._

## The model

```
Marketing Channel ──MANY→ Marketing Campaign ──MANY→ Lead ──MANY→ Encounter → Prescription
                              │                        │              (existing clinical flow:
                              └──MANY→ Ad Spend        └──ONE→ Patient  provider signs, Rx to
                                                                        pharmacy via Pioneer)
```

- **Lead** is the CRM's atom: every form/funnel submission, carrying the UTM
  fields + funnel answers + SMS-consent proof. Status: new → contacted →
  qualified → booked → converted / closed-lost.
- **Conversion chain:** Lead → Encounter (the physician sees the marketing
  intake on the appointment through a *minimal* view) → the existing
  Prescription flow (the Rx group / Mythic sees fulfillment). Marketing never
  sees clinical data; clinicians never see marketing economics.
- **Campaign.utm-campaign-key** (unique) ties leads to campaigns — it's the
  same `utm_campaign` the landing factory and funnel already emit.

## Object IDs (dev org)

| Object | ID |
|---|---|
| ResourceType Marketing Campaign | `bea42b64-6e94-4014-92b0-1a1c60d7c061` |
| ResourceType Lead | `9d63cda6-c4c9-4548-9f3b-981defce5736` |
| ResourceType Marketing Channel | `713c4c7c-62d7-44d1-b32a-fae50f95bbe7` |
| ResourceType Ad Spend | `47a36c3b-716e-496e-8ba3-40b668f2785f` |
| ResourceType Marketing Integration | `e2b62e96-9301-4e1b-ba10-31841f9e63cd` |
| View Marketing–Campaign (full) | `cf6ba077-158c-4e81-974d-f7c9101ee23c` |
| View Marketing–Lead (full) | `cd1a6d75-5e2a-416a-a3e0-58af2c885ce5` |
| View **Provider–Lead source (minimal, read-only)** | `ff65219f-2fd3-4827-a053-87d7cbe9454a` |
| View Marketing–Channel (full) | `27d6fc83-4495-489f-af8c-22c65e3981d9` |
| View Marketing–Ad Spend (full) | `92365047-c299-45fa-b56c-cfdd03863406` |
| View Marketing–Integration (full) | `f366ad87-dc42-4898-817c-c4e841866623` |
| PermissionGroup **Marketing CRM** (5 CRM types + Consent profile) | `c240bdad-8ab0-4946-9175-f1ab9dee5a60` |
| App **Nume Marketing CRM** (participantType Marketer) | `de347727-2301-4420-8c7e-8aed640938c7` |
| Activity Marketing (start page = Leads) | `4e834e2d-c303-4681-8d69-8ff3db5583fb` |
| Pages: leads / lead / campaigns / campaign / channels / integrations | `b2f5b2e2…` / `ed82c0cb…` / `4d86ec91…` / `b0149583…` / `065fc6a2…` / `66588971…` |

Relationships (10, both directions): Campaign↔Lead, Channel↔Campaign,
Campaign↔AdSpend, Patient↔Lead, Lead↔Encounter.

## Visibility correction from the full Kramer transcripts (2026-08-02)

The pharmacy's view of a converted lead must be **narrower than the provider's**: the
pharmacy may see that a lead came from a given **physician group**, but **NOT the campaign**
or other marketing detail ("that's not what they're paying for"). Marketing, after handoff,
sees only its originally entered info + converted-or-not. So when cross-org sharing lands:
- Provider (same org): the existing minimal view `ff65219f` (name/state/status/answers).
- Pharmacy (partner org): an even narrower share mask — source physician group + conversion
  state only; no utm, no campaign, no funnel answers.

## Enforcement — verified live

Reading Wilma Flintstone's lead through the **Provider minimal view** returns
ONLY first-name / state / status / funnel-answers / consent-timestamp; email,
phone, and every UTM field are stripped server-side — same fail-closed
mechanism as the clinical PHI views (31/31 QA suite).

## Seeded (real state, fictional people)

- **Channels:** Google Ads, Meta, TikTok (not-started — gated on LegitScript),
  SEO/Search Console (pending-verification).
- **Campaigns:** the 3 mythic campaigns from campaigns.config.js + the NuMe
  GLP-1 funnel — statuses reflect reality (SEO active, ads draft, funnel
  in-review/demo).
- **Integrations:** SES form-to-email (ACTIVE — endpoint, verification date,
  next-hop noted), Twilio A2P (pending: needs live privacy/terms), Google
  Search Console (planned).
- **Leads:** Wilma + Fred Flintstone (obviously fictional, per test-data rule).

## Option 3 next steps (in order)

1. **Lead-intake endpoint** in the API stack: public POST that validates and
   `resource_SaveResource`s a Lead (map form fields → attribute keys above;
   utm_campaign → look up Campaign by utm-campaign-key and associate).
   Then `Site.forms.endpoint` swaps one URL and every site/funnel writes
   leads instead of email. Keep the SES Lambda as the notification path
   (workflow EMAIL node or direct).
2. **New-lead workflow**: on Lead create → EMAIL notify (node type exists
   since PR #46) → later SMS when Twilio is registered.
3. **Conversion wiring**: "book appointment" in the funnel creates the
   Encounter with the Lead association; provider portal's encounter page adds
   a core:resourceview block using the Provider–Lead-source view.
4. **Spend ingest**: manual Ad Spend entries first; platform API pulls later.

## Platform bugs found while building (for Kramer)

1. **PermissionGroup update is broken**: `SavePermissionGroup` with an
   existing id does insert-before-delete on the join rows → any overlap with
   current (or soft-deleted) links violates `uniq_pg_resource`, and a failed
   attempt DELETES the group's links non-transactionally. The original
   "Marketing" group (`30417a20…`) is now empty and cannot be repopulated via
   the API — its former pairs' keys are tombstoned. Worked around with the new
   "Marketing CRM" group; the old group needs a DB-side cleanup or a server fix
   (delete-then-insert in one transaction, or upsert).
