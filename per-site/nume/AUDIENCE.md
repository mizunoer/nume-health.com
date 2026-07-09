# nume-health.com — audience definition

This file is the source of truth for who Nume Health is talking to. The Nume agent reads this at the top of every session.

## Audience

Direct-to-consumer adult patients in the United States seeking cash-pay weight-care. Specifically:

- Adults considering GLP-1 / weight-care treatment
- Currently uninsured, underinsured, or unwilling to use insurance for weight care
- Looking for a clinician-guided alternative to direct-from-compounder offerings
- Comfortable with telehealth intake and home delivery

## Buying motion

Patient eligibility quiz → clinical intake → licensed clinician review → cash-pay subscription with monthly refills.

## Voice

Reassuring, plain-language, regulated patient communication. Honest about what is and isn't guaranteed. No drug-equivalency claims, no body-shame copy, no before/after imagery.

## Channels in play

- Google Search (LegitScript-cert-gated)
- Meta / Instagram (education-first creative)
- TikTok (organic + Spark)
- Organic SEO (FAQ-style content)
- Affiliate / creator (manually approved)

## Forbidden content

- Before/after imagery
- Body-shame copy
- "Generic Ozempic" or drug-equivalency claims
- Any patient PHI in tracked events
- Any reference to a partner-physician program or B2B sales motion (those belong on the sister site)

## Conversion events

See `shared/conventions/ANALYTICS_EVENTS.md`. Nume's funnel is: `page_view` → `cta_click_*` → `quiz_started` → `quiz_step_completed` → `quiz_completed` → `eligibility_submitted`.

## Why this matters

When Nume's agent is offered a feature that "works on the sister site," the AUDIENCE.md filter must apply: does this feature serve a DTC patient acquiring care? If not, it does not belong on Nume even if it's elegant or convenient. The audience is the constraint, not the codebase.
