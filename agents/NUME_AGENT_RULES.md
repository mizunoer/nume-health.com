# Agent rules — Nume IDE window

You are the Cursor agent working in the **Nume Health** repo (`C:\Users\Mizun\source\repos\Numi`).

## Read on every session

1. `sister-sites-shared/README.md`
2. `sister-sites-shared/AUDIENCE_MATRIX.md`
3. `sister-sites-shared/SYNC_PROTOCOL.md`
4. `sister-sites-shared/per-site/nume/AUDIENCE.md`
5. `sister-sites-shared/per-site/nume/MIRROR_TARGETS.md`

## Your audience and goal

You serve **direct-to-consumer patients** seeking cash-pay weight-care. Every change you make is filtered through whether it serves a patient acquiring care, not a physician acquiring a partnership. When in doubt, defer to the DTC column of `AUDIENCE_MATRIX.md`.

## What lives in `shared/` (read-only from Nume's perspective)

- `shared/css/landing.css` — canonical landing page CSS, brand-neutral
- `shared/js/landing-render.js` — canonical renderer
- `shared/conventions/*` — `data-bind` grammar, status pills, placeholder convention, brand-kit shape, design-token names, analytics events, CSS namespaces
- `shared/schemas/landing-config.dtc.template.js` — your config schema reference
- `shared/templates/*` — onboarding form and tracker skeletons

## What lives in Nume's repo

- Brand assets (logos, favicons, palette hex values) — `nume_health_brand_kit/`, `assets/img/`
- `assets/css/nume-health.css` — your brand stylesheet, with `--nume-*` brand vars **and** the `--site-*` aliases that shared CSS reads
- `assets/css/landing.css` — copy of the shared file (consume per `MIRROR_TARGETS.md`)
- `assets/js/landing-config.js` — your filled-in config values (`window.SITE_CONFIG = window.NUME_CONFIG = { ... }`)
- `assets/js/landing-render.js` — copy of the shared file (consume per `MIRROR_TARGETS.md`)
- All five GLP-1 landing pages (`glp1-cash-pay.html`, `glp1-pricing.html`, `weight-care-online.html`, `switch-glp1-provider.html`, `glp1-faq.html`)
- `Client_Onboarding.html`, `Marketing_Next_Steps.html`, `Update_Colors.html`, `ImageSelection.html`
- Any DTC-specific compliance artifact, content, or tracking config

## When you want to change a shared file

You don't. You **propose** a change.

1. Open `sister-sites-shared/proposals/README.md` for the proposal template.
2. Create `sister-sites-shared/proposals/YYYY-MM-DD-<slug>.md`.
3. Tell the operator. Wait for approval.
4. After approval, the proposal is landed by whichever agent is currently wearing the shared-maintainer hat. The change appears in `shared/`, with a `CHANGELOG.md` entry.
5. On your next session, you adopt the change via Workflow A in `SYNC_PROTOCOL.md`.

## When you do change Nume's local copy of a shared file

If you need a tactical fix urgently and can't wait for the proposal cycle:

1. Apply it locally in Nume.
2. Immediately file a proposal documenting that the local fix exists, with the diff. The proposal's purpose is to retroactively reconcile.
3. Mark the row in `MIRROR_TARGETS.md` as `divergent`. The agent in the Mythic-RX window will see this when reading `MIRROR_TARGETS.md` and will be able to choose: adopt your fix, or wait for the formal land.

## What you never do

- **Never read or edit files in the Mythic-RX repo.** You're in Nume's window.
- **Never copy compliance status across.** Mythic-RX's gates are unrelated to Nume's regardless of how parallel they look.
- **Never ship `[CLIENT TO CONFIRM]` to production.** Yellow placeholders in any landing page are a launch-blocker.
- **Never put PHI in `siteTrack`** or in any config field. The DTC site is the higher-risk side of this — be especially careful with quiz state, condition data, dose, BMI.
- **Never add brand-prefixed event names.** GA4 / Meta funnels span both sites; events stay generic.

## What "Done" looks like for a typical Nume task

- Code change is in Nume's repo only.
- If the change involved a shared concern, a proposal was filed.
- If it didn't, no shared file was touched.
- `MIRROR_TARGETS.md` reflects current consumed versions.
- `Marketing_Next_Steps.html` status pills updated to reflect actual progress (per `STATUS_PILLS.md`).
- A grep for `mythic|mrx|MRX_CONFIG|--mrx-` in Nume's repo returns zero results.
