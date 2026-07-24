# Project status — Nume Health / Workshift platform (2026-07-25)

One-page truth for "where are we." Verified against live repos and URLs, not memory.

## What is DONE and verified

### Workshift platform (shared repo, all merged to main)
- **`core:resourceview` page component** — pages can render a record through a saved view (the missing piece for post-login screens). PR #38.
- **View-level access control, server-enforced** — per-attribute read-only / hidden / write, driven by the view designer; hidden data never leaves the API; fail-closed; merge-on-update. PR #39.
- **CALCULATED attributes** — safe formula templates (`{attr-key|filter}`), evaluated at read time, never persisted/writable; Formula field in the admin. PR #39. *Needs `db:migrate` before use.*
- **Static-sites stacks** — S3+CloudFront CloudFormation for nume-health.com + mythic-rx.com with curated vendored content; cert params optional for staging. PRs #40/#41. *Not yet deployed (script exists: `deploy-sites-dev.sh`).*
- **Pioneer API emulator** — LIVE at `dev-api.workshift.io/pioneer/v1/*` (verified: auth-enforcing). PioneerRx-shaped patients/Rx events, fixture creds. Integration work is unblocked without the VPN. PR #42.
- **Integration VPC + OpenVPN endpoint (CFN)** — ready to deploy; pharmacy UniFi peers as OpenVPN client. Runbook: `workshift-io/api/resource/network/README.md`. *Blocked on PKI secret + pharmacy network facts.*
- Dev org config (via MCP): 8 pharmacy resource types, relationships, 6 permission groups, 20 designer-format views, Rx-lifecycle workflow, seeded fictional records.
- Note: developer "David" has active `DAVID-WSHFT-23-*` branches — client/server work in flight; coordinate before touching adjacent areas.

### Nume portal demo (the stakeholder-facing mockup)
- Live at https://nume-health.com/workshift-pharmacy-portal-demo.html — **but one deploy behind** (see Immediate actions).
- Latest build (in repo, pushed): Nume rebrand + palette; appointments-first provider view incl. ad hoc; marketing-intake questionnaire (full assessment fields incl. BMI); **Kara's feedback folded in** — chief-complaint-first follow-ups, patient-history click-through, auto-computed clinical flags (severe allergies, chart-vs-intake inconsistency, comorbidities), tasks/subtasks card; Start-call telehealth console; provider My-practice (availability throttles + ad-compliance credentials); dev-detail toggle; 33 obviously-fictional patients.

### Compliance & marketing
- SMS/A2P: canonical CTIA disclosure on mythic contact + nume contact/assessment (live, 200). Convention doc in `sister-sites-shared`.
- Mythic privacy policy carries SMS no-sell language (verified). **Nume `/privacy.html` + `/terms.html` still don't exist — A2P blocker.**
- LegitScript: pricing/process known; application being submitted with Nico's info.

### Intelligence captured (docs/)
- `provider-call-prep.md`, `provider-call-outcomes.md` (Kara's Hims model + feedback + owners follow-up + summary-accuracy audits), this file.

## IMMEDIATE actions (you, this week)

1. **cPanel Deploy for nume-health.com** — live demo still shows the misspelled "Numi" brand Kara flagged and lacks her feedback build-out. One Update-from-Remote + Deploy fixes it.
2. **Send the reminder email to Caleb/Sean** (drafted in chat / see call-outcomes doc): price list→Kara cc you, pharmacy credentials, Sean's portal feedback, Kara's email, insurance questions, marketing email, Shannon's TikTok check.
3. **Submit LegitScript** (you said "I'm gonna submit") — with expedite ($2,500 → ~2 business days vs ~8-week queue) given the 3–3.5-week ad-demo commitment.
4. **Send owners**: rebranded portal link, demo link, Mythic RX brand options (committed on the follow-up call).
5. **Notify owners of the production push** you promised "tonight" on 7/21 (confirm it happened).

## DEVELOPMENT next steps (priority order)

1. **Provider login flow** (critical path — Kara is waiting for credentials): Pioneer data on hardened local dev → delete → AWS with demo records. The emulator + resourceview + view-enforcement are the building blocks, all merged.
2. **Real portal = demo parity**: rebuild the demo's provider screens (tasks queue, flags, check-in-first) as Workshift AppPages using `core:resourceview`; wire `resource_view_id` into calls so server-side minimum-necessary is exercised.
3. **Run `db:migrate` on dev** (Params column) → convert `ssn-last-4` to a real CALCULATED attribute.
4. **Role-visibility QA seed**: 50–60 fictional records in the dev org (cast exists; MCP seeding ready on request).
5. **Enrollment screens**: provider (malpractice verification + NPI/OCR/license checks), pharmacy/pharmacist/tech prefilled from Pioneer — your follow-up-call commitments.
6. **Pioneer integration service** (proto→Go→TS SDK→workflow nodes) pointed at the emulator; swap to VPN later.
7. **Marketing ops**: marketing-email auto-handlers, billing→accounting routing; DMARC records at DNS cutover.
8. Deploy `dev-workshift-sites` stack (staging URLs, no certs needed) when ready to move sites off cPanel.

## OUTSIDE VENDORS — who, what, status

| Vendor | What's needed | Status / blocker |
|---|---|---|
| **LegitScript** | Application + expedite; business license, provider licensure (Nico now, Kara later), 503A pharmacy structure | You have their pricing + referral-code terms; submitting now. Gates the ~3-week ad-demo date |
| **CallTower / Twilio (A2P)** | Re-review of mythic contact page (disclosure fixed + live); register campaign with canonical opt-in text; nume campaign blocked on privacy/terms pages | Mythic ready for re-review; nume blocked |
| **Google / Meta ads** | Post-LegitScript ad accounts; provider-directory page to link from ads; marketing email as credential account | Blocked on LegitScript + marketing email |
| **TikTok ads** | Account under marketing email; confirm GLP policy status (Shannon checking) | Pending Shannon; likely easier than Meta/Google |
| **Payment processor (high-risk, not Stripe)** | Underwriting for compounded GLP-1; LegitScript cert is the prerequisite; e.g. Corepay/Omega-type processors | Start after LegitScript submission |
| **Malpractice/E&O insurer** | Quote for platform E&O + what credentialing evidence (NPI/OCR/license checks — built) lowers premium; per-discipline malpractice cost | Owners have the ask; you're asking platform contacts about enrollment norms |
| **PioneerRx / pharmacy IT** | VPN peering: pharmacy LAN CIDR, static WAN IP, UniFi OpenVPN client setup, client cert install; Pioneer API credentials | CFN + runbook ready; needs pharmacy network facts + PKI ceremony |
| **cPanel/Namecheap (legacy)** | Keep pulling deploys until DNS cutover to AWS; then retire | Active; cutover after sites stack + certs |
| **Counsel** | Nume privacy/terms (with SMS no-sell clause), 503A GLP-1 posture confirmation, refund policy language | Drafts can be prepared from mythic's approved language |

## STAKEHOLDERS — who owes what

| Who | Owes / needs |
|---|---|
| **Caleb & Sean (owners)** | Price list (→Kara, cc you), pharmacy credentials (Sarah NPI/licenses/DEA), Sean's portal feedback, Kara's email, insurance-contact answers, marketing email, website feedback post-push, extra pilot names |
| **Kara (provider advisor)** | Owed: portal login + price list. Will give: free critical portal feedback; candidate initial provider; possible platform consult (owners floated equity for veteran-owned contracting angle) |
| **Kramer + dev team (Workshift)** | Run `db:migrate`; coordinate around David's branches; heads-up on future `NODE_TYPE_SMS` idea; PKI secret creation before network-stack deploy |
| **Sarah (pharmacist)** | Credentials package (also LegitScript prerequisite); pharmacy enrollment data |
| **Nico (prescriber)** | Info in hand for LegitScript |
| **Shannon** | TikTok GLP visibility check |
| **Alan/board** | Outline of links + info (promised on the 7/16 call — still open) |

## WHAT NEEDS TESTING (matrix)

| Area | Test | How / who |
|---|---|---|
| **Role visibility (HIPAA)** | No role sees beyond its view — esp. Tech↛SSN, Marketing↛any PHI — with 50–60 records | Server-side: API calls with `resource_view_id` per role (I can script against dev). Then human pass; outsourced QA (~$2k Filipino team quote) as fallback |
| **View enforcement edge cases** | View-scoped update can't wipe hidden fields; misconfigured view fails closed; cross-type view rejected | API-level tests vs dev (scriptable now) |
| **CALCULATED** | Post-migration: formula renders, not persisted, not writable | After Kramer runs db:migrate |
| **Emulator ↔ integration** | Pull patient/Rx from emulator; push Rx event; "fluence test" both directions | When integration service lands; emulator is live today |
| **Highest-volume paths** (owners call) | Tech fulfillment flow; questionnaire→one-click physician approve; billing/cancellation/side-effect routing | Pilot users in dev portal once login works |
| **Login flow security** | Hardened local dev with real Pioneer data, then delete; pen-style checks before AWS | Your existing plan; QA vendor optional |
| **Demo walkthrough** | Every click-path (now fully drill-down-safe); popup allowed for call console | Done by me this week; re-verify after each deploy |
| **Workflow runner** | Rx-lifecycle workflow via JSON tester (StartExecution + logs) | Needs webhook node repointed to safe echo first (approved approach pending) |
| **A2P re-review** | CallTower re-check of live mythic contact page | After you request re-review |
| **VPN** | Tunnel up, pharmacy-unifi connected, Pioneer host reachable, SG locked to /32 | After PKI + pharmacy facts; runbook has the commands |

## TIMELINE ANCHORS (your public commitments)
- Ad-campaign **demo in ~3–3.5 weeks** from 7/21 → **~Aug 12–15**
- Approval window, then **launch 1–2 weeks after**
- Website production-ready **end of next week** (from 7/21 → ~Aug 1); portal/health-record the week after
- Small first campaigns, couple hours at a time, Kara as candidate initial provider
