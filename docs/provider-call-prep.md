# Provider call prep — Kara (telehealth provider, ex-Ro / Hims & Hers experience)

## Demo state (all live after cPanel Update-from-Remote + Deploy)

https://nume-health.com/workshift-pharmacy-portal-demo.html — Numi-branded care
portal on the Workshift engine. Local fallback:
`Numi/sites/nume-health.com/workshift-pharmacy-portal-demo.html`.

**Suggested path:**
1. Provider role lands on **Appointments** — 3 appointments incl. an **ad hoc
   "Requested"** slot assigned to "Next available (licensed: UT)".
2. Open the ad hoc appointment → **client marketing questionnaire** nested
   below (state, goal, health flags, GLP-1 history, pay preference, source
   campaign — consent on file).
3. **▶ Start call** → telehealth console: patient info left, intake right,
   GLP-1 diagnostic screen + clinical notes bottom.
4. **⚙ My practice** → availability/ad-hoc throttles + credentials panel
   (each credential tagged LegitScript / Google Ads / Meta Ads / Directory).
5. App switcher → **Patient Portal** ("Signed in as Wilma Flintstone") for the
   patient's side. All 33 patients are obviously-fictional characters.
6. If she asks how it's built: tick **Dev detail** to reveal the Workshift
   integration layer.

**The asks from her:** feedback on the appointment/ad-hoc workflow from a
provider seat; what an intake must show before she'd prescribe; reaction to
availability throttles; provider-naming compliance in ads.

## LegitScript talking points (from the 7/20 call — for context, not partnership)

- Certification is org-level "TSA Pre-check": they verify business license,
  provider licensure, pharmacy structure once → badge + verification link →
  eligible for Google/Meta ads and compliant payment processing. Ads
  themselves are still policed by the platforms (Google/Meta strictest).
- Campaign boundaries must stay inside FDA-permitted claims or certification
  is refused — this is also the Stripe/payment unlock.
- Provider naming plan to validate with Kara: name **licensed states** in ads
  + link to a **provider directory**; individual providers never named in ad
  creative (most-conservative competitors list every doctor + NPI — we don't
  want that).
- Availability throttling: campaigns can stop offering a provider's slots as
  they fill (protects provider time per lead) — shown in My practice.

## Questions for Kara — Ro / Hims & Hers business model

**Provider network & economics**
1. How were providers engaged — 1099 per-encounter, hourly blocks, or salaried?
   What did a typical encounter pay, and what volume per hour was expected?
2. How did they handle multi-state licensing — did they pay for/manage your
   licenses, and how many states did a typical provider carry?
3. Who carried malpractice, and how was it structured for async care?
4. What did provider onboarding/credentialing look like, and how long from
   signup to first encounter?

**Clinical workflow (what we should copy or avoid)**
5. What was the async-vs-video split? Which states forced synchronous visits,
   and how did the platform route those?
6. Walk us through their intake→prescribe flow: what did you see on screen,
   what was auto-flagged, and what did you wish the intake had asked?
7. How were red flags / disqualifiers routed — auto-reject, human review
   queue, or escalation to you?
8. What was charting like — templates, auto-generated notes, time per
   encounter? What was the most annoying part of their provider console?
9. How did refills/follow-ups work — automated cadence, provider-initiated,
   or patient-triggered? Who watched labs, and how were they ordered?
10. How were adverse events / urgent messages handled after hours?

**Marketing → clinical handoff**
11. How much marketing data (campaign, funnel answers) did providers see —
    and did it help or bias care?
12. Did providers feel pressure on approval rates? How did the platform keep
    prescribing independent of marketing (the corporate-practice-of-medicine
    line)?
13. How did Ro/Hims present providers in ads — named doctors, directory page,
    "licensed clinicians" language? What triggered compliance changes?

**Business model & retention**
14. What drove retention/LTV — subscription bundling, dose titration cadence,
    check-in touchpoints? Where did patients churn?
15. Cash-pay pricing: how did they package (monthly subscription vs per-visit
    + med)? What price points worked for GLP-1?
16. Pharmacy fulfillment: owned vs partner pharmacies, and how did compounded
    semaglutide fit before/after the FDA shift? What broke when sourcing
    changed?
17. What's the biggest thing Ro did better than Hims (and vice versa)?
18. If you were building us from scratch: the one thing you'd steal from
    them, and the one mistake you'd avoid?

**Close**
- Would she advise/consult on the provider workflow as we build?
- What would she need to see before referring provider colleagues?

## Next deliverables (staged after the call)
1. Fold her feedback into the portal (appointment/console iterations).
2. Login flow live with Pioneer data on hardened local dev → AWS demo records.
3. Role-visibility QA pass with the 33-record fictional cast (server-enforced
   views are merged; can seed the live org on request).
4. Pharmacy credentials to Sarah (pharmacist NPI + licenses) — also the
   LegitScript application prerequisites.
5. LegitScript application with expedite once PIC confirms licensure.
