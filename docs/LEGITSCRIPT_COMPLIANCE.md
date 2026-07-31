# LegitScript Compliance Map — application + ongoing obligations

_Compiled 2026-07-31 from the [certification terms & conditions](https://www.legitscript.com/certification/healthcare-certification/terms-and-conditions/)
and the [Healthcare Merchant Certification requirements](https://www.legitscript.com/certification/healthcare-certification/#requirements),
mapped against Nume's actual state. Applicant: NUME HEALTH LLC (Telemedicine Provider),
certified website: nume-health.com. Companion to LEGITSCRIPT_MEETING_BRIEF.md._

## The 9 certification standards → our status

| # | Standard | Our status | Action needed |
|---|---|---|---|
| 1 | **Licensure & business registration** — adequate for services offered AND every jurisdiction served (prescriber + pharmacy + patient locations) | Nico licensed (NPI in hand); Sara pharmacist + pharmacy license (9/30/2027) + DEA (1/31/2028) verified. **Six non-resident state pharmacy licenses outstanding** | Owners producing; service-state list must match licensure exactly |
| 2 | **Legal compliance** — no unapproved drugs; all prescribing/dispensing authorizations | 503A compounded GLP-1 posture — counsel confirmation still open | Counsel sign-off on 503A personalization rationale ("not essentially copies") |
| 3 | **Prior discipline & history** — 10-year disclosure of criminal/regulatory/civil actions for applicant, principals, key staff, practitioners | Not yet gathered | Ask Caleb, Sean, Nico, Sara for 10-yr disclosure statements BEFORE submitting — omissions = denial/revocation |
| 4 | **Affiliates & partners** — partners (pharmacies, medical practices) "generally must be LegitScript-certified or accredited by recognized bodies" | **OPEN QUESTION** — does our 503A fulfillment pharmacy need its own cert/accreditation, or does state licensure suffice? | Ask the account manager explicitly. If partner cert is required, the referral-code program (min 20 @ $499/$1,800) becomes relevant sooner |
| 5 | **Patient services** — clear disclosure of all states/territories where services are available | Not on site yet | Licensing/service-states page in the legal-pages set (7 states: home + six pending) |
| 6 | **Privacy** — HIPAA-compliant privacy policy, all privacy laws, SSL required | **Privacy policy doesn't exist.** SSL: cPanel ok; CloudFront cutover still needs ACM certs | Legal pages (below); finish certs before review crawl if cutover happens mid-review |
| 7 | **Validity of prescription** — valid practitioner-patient relationship; telemedicine per state law; **"in-person physical examinations required before prescriptions except where expressly permitted by law"**; no pre-care prescribing | Portal encounter flow documents the relationship; per-state modality (sync video vs async) protocol not written | Written prescribing protocol per state; exclude states whose telehealth law doesn't expressly permit prescribing without in-person exam |
| 8 | **Transparency** — accurate, not misleading practices and offers | Price list public (funnel uses real pricing); refund policy not written | Refund policy page; transparent subscription terms (Google Rx recurring-billing policy also demands this) |
| 9 | **Advertising** — transparent, lawful, **no circumvention of platform policies** | Landing factory already built for ad-claim parity; no "FDA-approved" claims rule known | Claims inventory sweep before cert crawl |

## Application-stage obligations (traps)

- **Truthful, accurate, not misleading — everything.** Misleading answers = denial + they can refuse all future applications. The nonrefundable $975 is the smallest cost of a bad answer.
- **Full domain disclosure:** every domain/URL under NUME HEALTH LLC's control must be listed — not just nume-health.com. Inventory before submitting (incl. any parked variants).
- **Full affiliate disclosure** — failure to disclose is an explicit denial/revocation ground. If influencer/affiliate marketing starts later (TikTok plans), those relationships fall under this.
- **Whois must be accurate WITHOUT privacy services.** Namecheap domains default to WhoisGuard/Domain Privacy — **disable it on nume-health.com** and set real org details before they look.
- **Cannot link to non-LegitScript-approved healthcare websites.** Audit nume-health.com's outbound links — **no links to mythic-rx.com** (uncertified pharmacy site) until/unless it's certified. Check footer, "our pharmacy" mentions, provider-directory plans.
- **Auto-renewal:** annual fee auto-charges to the card on file; all fees nonrefundable, no pro-rating. Calendar the renewal date; cancel-before-renewal is the only out.

## Ongoing obligations (post-certification process to build)

- **30-day mandatory reporting** of: any licensure/business/regulatory status change in any jurisdiction; DEA registration changes; any Disciplinary Action (broadly: suspensions, probations, reprimands, warning letters, consent agreements) touching the org or practitioners. → This maps 1:1 onto the Workshift compliance-checklist program (AWS_MIGRATION_PLAN item 2): credential records already exist as resources; a workflow on credential-status change should generate the LegitScript notification task.
- **Respond promptly** to LegitScript information/correction requests — "failure to timely respond" is a revocation trigger on its own.
- **Seal usage:** home page only, unmodified, auto-refreshing (no static copy), hyperlinks only to their designated page, only after express written permission. Don't put the badge on ads/landing pages without checking the license terms ("advertising as LegitScript-certified website" is permitted wording).
- **Changes that risk re-review** (from the 7/20 call + terms): new meds, new states, site redesign, new domain. Coordinate the v1→v2 site swap and DNS cutover so the *reviewed* site is the one that stays live — don't redesign mid-review.
- **Card-brand policies** (Visa BRAM etc.) are incorporated by reference — processor compliance and cert compliance are one system.

## Referral-code program — Tyler's confirmed terms (email, 2026-08-01)

| Term | Answer |
|---|---|
| Payment | Upfront, Net 30 |
| Code life | **12 months from purchase** (no 24-mo extension); cert = 1 yr from approval date |
| Org binding | **Floating** — codes are NOT tied to orgs; assignable to partners onboarded later within the 12 months |
| What a code covers | The certification fee is **prepaid in the code**; application fee is separate per redemption |
| Renewal | Two options: (a) keep code assigned, renew through the program; (b) **reclaim the code for a different partner** — the certified org then renews directly at $2,150 (no application fee in year 2) |
| Speed | <40 codes: priority (~10 business days to analyst); ≥40: expedited (2 business days) |
| Exception pricing (below 20-code min) | **$1,850/code** cert fee; Tyler seeking approval for **$400 application fee** (vs $975 standard) and **free expedited processing for our first two applications** |
| Deadline | Commit to the purchase by **mid-August** to lock the concessions |

**Per-site math:** referral exception ≈ **$2,250** year one ($1,850 code + $400 app) vs direct $3,125 ($975 + $2,150) — saves ~$875/site, plus expedite on the first two (worth $2,500 each on the direct path). Year 2: partner renews directly at $2,150 and we reclaim the code → each code seeds a NEW partner every year while codes remain valid.

**The catch:** the 12-month shelf life prices in pipeline risk. Two codes burn immediately (nume + mythic). Every additional code is a bet that a Workshift-vertical partner reaches certification-ready within 12 months of the purchase date — unredeemed codes are presumably forfeit (all LegitScript fees are nonrefundable; confirm).

**To confirm in writing before purchase:** (1) the $400 app fee approved; (2) expedite on first two approved; (3) whether unredeemed codes have any refund/credit path; (4) exact minimum quantity for the exception; (5) that mythic-rx.com as application #2 satisfies the standard-4 partner-pharmacy question for nume's cert.

## Pre-submission checklist (blocking order)

1. Legal pages live on nume-health.com: privacy (HIPAA + SMS no-sell), ToS, telehealth consent, refund policy, service-states/licensing page. _(drafts → counsel → publish)_
2. Executed pharmacy services agreement NUME HEALTH LLC ↔ pharmacy entity (defeats the "facilitator without contractual partnership" exclusion).
3. 10-year disciplinary disclosures collected (owners, Nico, Sara).
4. Domain inventory + Whois privacy OFF + accurate registrant details.
5. Outbound-link audit (no mythic-rx.com links, no uncertified healthcare sites).
6. Claims inventory (no "FDA-approved" for compounds; pricing/refund transparency).
7. Six non-resident pharmacy licenses (or trim the launch-state list to match licensure — standard 1 requires match).
8. Ask account manager: partner-pharmacy certification requirement (standard 4) + whether marketing@nume-health.com contact changes later cause issues.
9. Then: submit with expedite ($2,500), CNP=Yes, eligibility=N/A, Company Type=Telemedicine Provider.
