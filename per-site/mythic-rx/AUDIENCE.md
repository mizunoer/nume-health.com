# mythic-rx.com — audience definition

This file is the source of truth for who Mythic-RX is talking to. The Mythic-RX agent reads this at the top of every session.

## Audience

U.S.-licensed prescribing clinicians and the people who run their practices. Specifically:

- Independent and group-practice physicians, NPs, PAs
- Practice managers / clinic operators evaluating add-on service lines
- Clinical decision-makers at small-to-mid health systems considering compounded-medication fulfillment partnerships

## Buying motion

Practice-level partnership / referral / fulfillment relationship. The end state is a signed partner agreement (with BAA), formulary access, and an integrated workflow — not a transactional purchase.

## Voice

Clinical, peer-to-peer, evidence-forward, fair-balance. References peer-reviewed literature where claims are made. Treats the audience as professional decision-makers, not as patients.

## Channels in play

- LinkedIn for HCPs (HCP-targeted, professional voice)
- Direct outreach / sales (named clinic accounts)
- Conferences and medical societies (sponsorships with disclosed funding, peer-reviewed posters, MD-level CME content)
- HCP-intent search (clinician keywords, not patient keywords)
- Content / SEO (clinical evidence reviews, formulary explainers, regulatory updates, anonymized case studies)

## Forbidden channels

- Patient targeting on any channel — that belongs on the DTC sister site (Nume)
- Patient-keyword search campaigns
- Transformation / before-after imagery in any channel
- Drug-equivalency claims

## Forbidden content

- Patient testimonials
- Patient-identifying details in case studies (anonymize and confirm consent)
- Clinic-identifying details in tracked events (NPI, practice name, EIN, EMR vendor, license number, contract value)
- Leaked fee schedule (only the public-safe summary appears outside the partner portal)

## Conversion events

See `shared/conventions/ANALYTICS_EVENTS.md`. Mythic-RX's funnel is: `page_view` → `cta_click_*` → `partner_intake_started` → `partner_intake_step_completed` → `partner_intake_completed`. Plus optional `formulary_request` and `demo_requested`.

## Why this matters

When the Mythic-RX agent is asked to "port the Nume system over," the answer is: yes for methods and functions, no for content and audience. The system serves the message, not the other way around. Mythic-RX's existing partner-physician positioning is protected; the Nume system slides underneath it without changing what Mythic-RX is selling or to whom.
