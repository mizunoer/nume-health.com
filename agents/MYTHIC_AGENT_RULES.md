# Agent rules — Mythic-RX IDE window

You are the Cursor agent working in the **Mythic-RX** repo (location TBD; sibling to `C:\Users\Mizun\source\repos\Numi`).

## Read on every session

1. `sister-sites-shared/README.md`
2. `sister-sites-shared/AUDIENCE_MATRIX.md`
3. `sister-sites-shared/SYNC_PROTOCOL.md`
4. `sister-sites-shared/per-site/mythic-rx/AUDIENCE.md`
5. `sister-sites-shared/per-site/mythic-rx/MIRROR_TARGETS.md`
6. `sister-sites-shared/per-site/mythic-rx/COMPLIANCE_GATES.md`

## Your audience and goal

You serve **partner physicians and clinic operators**. Every change you make is filtered through whether it serves a clinician acquiring a partnership, not a patient acquiring care. When in doubt, defer to the B2B column of `AUDIENCE_MATRIX.md`.

You do **not** port Nume's DTC content. You adopt Nume's *system* — the renderer, the design tokens, the status grammar, the action-tracker layout — and apply it to Mythic-RX's existing partner-physician positioning.

## What lives in `shared/` (read-only from Mythic-RX's perspective)

- `shared/css/landing.css` — canonical landing page CSS, brand-neutral
- `shared/js/landing-render.js` — canonical renderer
- `shared/conventions/*` — `data-bind` grammar, status pills, placeholder convention, brand-kit shape, design-token names, analytics events, CSS namespaces
- `shared/schemas/landing-config.b2b.template.js` — your config schema reference
- `shared/templates/*` — onboarding form and tracker skeletons

## What lives in Mythic-RX's repo

- Brand assets (logos, favicons, palette hex values) — `mythic_rx_brand_kit/`, `assets/img/`
- `assets/css/mythic-rx.css` — your brand stylesheet, with `--mrx-*` brand vars **and** the `--site-*` aliases that shared CSS reads
- `assets/css/landing.css` — copy of the shared file (consume per `MIRROR_TARGETS.md`)
- `assets/js/landing-config.js` — your filled-in config values (`window.SITE_CONFIG = window.MRX_CONFIG = { ... }`)
- `assets/js/landing-render.js` — copy of the shared file (consume per `MIRROR_TARGETS.md`)
- Mythic-RX's existing partner-facing pages (e.g. `partners.html`, `formulary.html`, `become-a-partner.html`) retrofitted with `data-bind` markup
- `Client_Onboarding.html`, `Marketing_Next_Steps.html`, `Update_Colors.html`, `ImageSelection.html` — branded for Mythic-RX, with B2B field set in the onboarding form and B2B gate set in the tracker
- All B2B-specific compliance artifacts and content

## What you do **not** create on Mythic-RX

- DTC patient-acquisition pages (`glp1-cash-pay.html`, `glp1-pricing.html`, `weight-care-online.html`, `switch-glp1-provider.html`, `glp1-faq.html`). Those belong on Nume.
- Patient-targeted CTAs ("See if I qualify", "View pricing").
- Patient testimonials.
- Consumer-facing pricing surfaces. Mythic-RX exposes only a tier-name + public-safe summary; full fee schedule lives behind a partner portal / NDA.

## When you want to change a shared file

You don't. You **propose** a change. Same workflow as Nume — see `SYNC_PROTOCOL.md`.

## When you do change Mythic-RX's local copy of a shared file

If you need a tactical fix urgently:

1. Apply it locally in Mythic-RX.
2. Immediately file a proposal documenting that the local fix exists, with the diff.
3. Mark the row in `MIRROR_TARGETS.md` as `divergent`.

## What you never do

- **Never read or edit files in the Nume repo.** You're in Mythic-RX's window.
- **Never copy compliance status across.** Nume's gates are unrelated to yours.
- **Never copy testimonials, prescribing entity names, pharmacy partners, served states, or pricing from Nume.** Each site is a separate legal and operational entity.
- **Never include partner clinic identity** (NPI, practice name, EIN, EMR vendor, license number, contract value) in any analytics event or config field. The B2B site is the higher-risk side for clinic-confidentiality leaks — treat partner identity the way Nume treats patient PHI.
- **Never ship `[CLIENT TO CONFIRM]` to production.** Yellow placeholders are a launch-blocker.
- **Never add patient-targeted creative** to any channel guardrail row. Patient targeting belongs on Nume; the B2B site stays HCP-only.

## What "Done" looks like for a typical Mythic-RX task

- Code change is in Mythic-RX's repo only.
- If the change involved a shared concern, a proposal was filed.
- If it didn't, no shared file was touched.
- `MIRROR_TARGETS.md` reflects current consumed versions.
- `Marketing_Next_Steps.html` status pills reflect Mythic-RX's actual progress, not Nume's. Default state for new gates is `pill-blocked` or `pill-client`.
- A grep for `nume|NUME_CONFIG|numeTrack|--nume-|nume-health` in Mythic-RX's repo returns zero results.
