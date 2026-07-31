# AWS Migration & Site Program Plan — nume-health.com + mythic-rx.com

_Updated 2026-07-29 after the LegitScript meeting and a review of the Workshift (fork)
track. Supersedes the 2026-07-12 draft. DNS execution details live in
[dns-cutover-plan.md](dns-cutover-plan.md) (staged 2026-07-30) — that doc is canonical for
the record-by-record cutover._

## Decisions (2026-07-29)

1. **nume-health.com is the LegitScript-certified property.** Certification prep targets
   nume only (application ≈ $975 + $2,150/yr). Mythic stays B2B and uncertified for now;
   revisit NABP for mythic if/when pharmacy credentialing matters.
2. **De-merge the sites.** Combining mythic-rx and nume-health into one working tree was a
   mistake — they diverge in audience, compliance posture, and now certification status.
   Each site gets its own repo with rebuilt code (program item 1). `sister-sites-shared`
   survives as the *conventions/reference* repo (SMS disclosure, analytics taxonomy,
   placeholder grammar) — the copy-sync cohabitation ends.
3. **Ownership split.** The **Workshift (fork)** track owns AWS backend/infra: workflow
   engine (runner deployed 2026-07-30), VPN/Pioneer, DNS execution, and site↔Workshift
   interactivity (program item 3). **This track** owns the site program (items 1, 2, 4, 5),
   LegitScript readiness, and keeping this plan coherent.

## Infrastructure status (verified 2026-07-29)

- **Static-sites merged to main** (via PRs #40 infra + #41 content; #37 closed superseded) —
  `sites/<domain>/`, the `dev-workshift-sites` CFN templates, and `deploy-sites-dev.sh`
  are on main.
- **Stack not deployed** — `dev-workshift-sites` does not exist in us-west-2 yet; no ACM
  certs exist in us-east-1. Both are the first execution steps.
- **DNS** — authoritative at Namecheap (not Squarespace); Google Workspace MX on both
  domains must not change; stray unroutable `192.168.0.1` A records to delete. Full
  sequence, target records, TTL strategy, and rollback: see dns-cutover-plan.md.
- **Forms blocker: solved in principle.** A Workshift workflow (`action.postWebhook`)
  reached the cPanel feedback API end-to-end on 2026-07-30 (real ticket created). Two
  paths: **bridge** (forms post to a subdomain that stays on cPanel) or **replace** (real
  endpoint in the API stack). Bridge is lower-risk for cutover day.
- Workflow-engine fixes (executor registration, StartExecution jsonb crash, missing
  workflow-runner → SQS FIFO + DLQ) are deployed to dev but **not merged to main** — open
  item on the fork's side.

## Cutover gates (updated)

1. ~~Open the static-sites PR~~ → done, merged (#40/#41). **New gate: run
   `./deploy-sites-dev.sh`** (needs the AWS `workshift` profile) and QA both sites on
   `*.cloudfront.net`.
2. **Forms**: pick bridge vs replace, wire it, and verify a real submission against the
   CloudFront URL. (Mythic's mail forms and nume's ticket board both ride on this.)
3. **Internal tools**: keep on cPanel behind a `tools.` subdomain (consistent with the
   bridge); port into Workshift later.
4. **Content**: compliance pages (program item 4). The nume set is also a LegitScript
   application blocker — legal pages must exist before applying.
5. **Certs + DNS** per dns-cutover-plan.md (ACM in us-east-1 covering apex + www; TTL down
   24h ahead; one domain at a time; MX untouched; verify mail in/out post-cutover).

Sequencing note: cut over the *current* static sites first, then rebuild (item 1) in the
new repos and redeploy. Blocking migration on a redesign couples two risks for no benefit.

## Program roadmap (added 2026-07-29)

### 1. Per-site repos with rebuilt sites
- Create fresh `nume-health.com` and `mythic-rx.com` repos: curated trees only (no vendor
  template bloat, no internal tooling in the public tree, no PHP).
- Rebuild pages to current best practice: semantic HTML, accessibility (WCAG AA),
  performance budgets, SEO/schema.org, shared design tokens; keep the config-driven
  content pattern (SITE_CONFIG/data-bind) or upgrade it to a small build step.
- Deploy flow: new repos become the source; `workshift-io/sites/<domain>/` stays the
  deploy artifact (vendored from the new repos), preserving the dev's
  system-of-record rule.

### 2. Compliance & onboarding checklists → Workshift template pages → marketplace
- Author base checklists: **business onboarding** (entity, licensure, domains, email/DNS,
  analytics) and **compliance** (LegitScript document list from the meeting, A2P/SMS
  disclosures, HIPAA, state telehealth rules).
- Encode them in Workshift (ResourceTypes: Checklist/ChecklistItem; template App Pages) so
  a new client/site can be provisioned with its required pages + checklists through
  Workshift rather than by hand.
- Long-term: a Workshift **marketplace** — a menu of installable feature modules (EHR,
  CRM, forms, ticketing, compliance packs) per org. Needs dev buy-in; same PR/CFN
  discipline as everything else.

### 3. Sites interactive with Workshift *(fork-owned)*
- Form submissions → Workshift workflows (webhook bridge proven; native endpoint next).
- Ticket board (`api/feedback.php` + SQLite) → Workshift ResourceType + views.
- Landing-config saves → Workshift resources instead of PHP file regeneration.
- This plan holds the interface list; the fork implements.

### 4. Compliance page coverage + dynamic defaults
- Audit both sites for required pages: privacy policy (with the mobile-opt-in-data-never-
  sold clause A2P requires), T&Cs, telehealth consent, consumer-health-data, compounding/
  FDA-status disclosures, licensing (state list), contact, refund/shipping.
- Build **default-language templates per compliance goal** (LegitScript, A2P/CTIA, state
  telehealth) as Workshift-provisionable pages with per-site overrides — this is the
  static-page precursor to item 2's provisioning flow.
- Near-term: static versions for nume now (LegitScript blocker). Draft → counsel review →
  publish.

### 5. Nume marketing landing pages (per platform)
- A landing set per acquisition channel — Google, Meta, TikTok, Microsoft — each compliant
  with that platform's GLP-1/telehealth policy: required disclosures, no drug names
  pre-certification, no "FDA-approved" claims for compounded products, cert badge once
  issued.
- Reuse the landing-config/data-bind system for fast variants; UTM/analytics taxonomy per
  the shared conventions.

## Sequence & dependencies

| Order | Work | Blocked by |
|---|---|---|
| Now | Nume legal pages (item 4 subset) | — (unblocks LegitScript application) |
| Now | Deploy sites stack + staging QA | AWS creds |
| Now | Forms bridge decision + wiring | fork's endpoint/bridge choice |
| Next | ACM certs → DNS cutover (per dns-cutover-plan.md) | stack deployed, forms solved |
| Next | LegitScript application | legal pages live, doc checklist gathered |
| Then | Per-site repo rebuild (item 1) | cutover done (don't couple) |
| Then | Landing pages (item 5) | cert issued (or policy-safe copy pre-cert) |
| Ongoing | Items 2 + 3 (Workshift checklists, interactivity, marketplace) | fork capacity, dev buy-in |
