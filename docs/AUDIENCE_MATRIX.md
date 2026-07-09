# Audience Matrix

This is the canonical statement of how the sister sites differ. When in doubt about whether something belongs in `shared/` or in `per-site/<site>/`, this matrix is the tiebreaker: anything that varies down a column is **per-site**; anything constant across both columns is **shared**.

|  | nume-health.com | mythic-rx.com |
|---|---|---|
| **Audience** | DTC patients seeking cash-pay weight-care | Partner physicians, group practices, clinic operators |
| **Buying motion** | Patient eligibility quiz → cash-pay subscription | Practice-level partnership / referral / fulfillment relationship |
| **Primary CTAs** | "See if I qualify" / "View pricing" | "Become a partner" / "Request formulary" / "Schedule a consult" |
| **Voice** | Reassuring, plain-language, regulated patient communication | Clinical, peer-to-peer, evidence-forward, fair-balance |
| **Pricing surfaces** | Public monthly price, included items, refund/cancellation, optional first-month promo | Tier names + public-safe summary; full fee schedule under NDA / partner portal |
| **Compliance frame** | LegitScript, Google Healthcare Merchant, Meta/TikTok ad approval, consumer-health-data law | HIPAA Business Associate Agreement, partner agreements, per-state pharmacy & clinician licensing, EMR integration security, off-label claim review |
| **Channels in play** | Google Search, Meta, TikTok, organic SEO, affiliate/creator | Medical society partnerships, conferences, KOL outreach, LinkedIn for HCPs, referral programs, sales enablement, HCP-intent search |
| **Forbidden channels** | None inherent — but each must be approval-cleared | Patient-targeted creative (belongs on the DTC site, never the B2B site) |
| **Trust signals** | Licensed providers, U.S. licensed pharmacies, no insurance required, secure intake | HIPAA-aligned, named medical director, formulary transparency, clinical advisory board, peer-reviewed evidence, BAA support |
| **Forbidden content** | Before/after imagery, body-shame copy, drug-equivalency claims, generic-Ozempic language | Patient testimonials, transformation imagery, clinic identifiers in tracking events, leaked fee schedule |
| **Onboarding form fills** | Product/price/included/refund/states/prescribing-entity/SLAs/support contact (13 fields) | Partnership tier/feeStructureSummary/whiteLabelAvailable/formulary/medicalDirector/statesLicensed/EMR/BAA/partner agreement URL/HIPAA contact (B2B field set) |
| **Tracker channel guardrail rows** | Google Search / Meta / TikTok / Affiliate | LinkedIn for HCPs / Direct outreach / Conferences / HCP-intent search / Content & SEO |
| **Launch sequence** | 7-day paid-media rollout | Partner-rollout sequence (counsel → direct outreach → society/KOL → inbound HCP → conversion review → trust assets → scale) |

## What is shared (constant across both columns)

These are the parts of the system that do not change when the audience changes. They live in `shared/`.

- **The renderer.** `landing-render.js` reads `window.SITE_CONFIG` and emits via `window.siteTrack`. Logic is audience-agnostic.
- **The `data-bind` grammar.** Same five attributes (`data-bind`, `data-bind-attr`, `data-bind-list`, `data-bind-show`, `data-track`) on both sites.
- **The placeholder convention.** `[CLIENT TO CONFIRM]` renders as a yellow `lp-placeholder` highlight. Same convention on both sites.
- **The status pill grammar.** Five statuses (`pill-done`, `pill-prog`, `pill-blocked`, `pill-client`, `pill-todo`) used in both trackers.
- **The action-tracker layout.** Stat cards on top, then six numbered sections (shipped / gates / deliverables / launch sequence / dev tasks / channel guardrails). Both sites keep this shape.
- **The brand-kit folder shape.** `email/ logo/ marketing/ marks/ reversed/ social/ source/ svg/ transparent-png/ web/`. Identical structure for every brand.
- **The CSS class namespaces.** `lp-*` (landing pages), `ob-*` (onboarding), `ns-*` (next-steps tracker), `pill-*` (statuses). Brand-neutral.
- **The CSS variable naming.** `--site-*` in shared CSS. Each site aliases its brand vars to `--site-*` in its main brand stylesheet.
- **The analytics event taxonomy.** Generic event names only (`page_view`, `cta_click`, `partner_intake_started`, etc.). PHI-free and clinic-identity-free on both sites.
- **The onboarding-form export pattern.** Form autosaves to localStorage; "Export config" produces a drop-in `landing-config.js` starting with `window.SITE_CONFIG = {`.

If a future change feels like it should live in `shared/` but the matrix above shows it varies between the two columns, it doesn't belong in `shared/`. File it in `per-site/<site>/` instead.
