# nume-health.com — mirror targets

This file tracks which canonical files Nume currently consumes from `sister-sites-shared/` and at which version. The Nume agent updates the "Consumed version" column when it adopts a change.

## Mirror manifest

| Shared file | Local target in Nume | Consumed version | Latest available | Notes |
|---|---|---|---|---|
| `shared/css/landing.css` | `sites/nume-health.com/assets/css/landing.css` | `v2026.06.23.1` | `v2026.06.23.1` | Adopted from monorepo `shared/` (byte-identical). `--site-*` aliases in `assets/css/nume-health.css`. |
| `shared/js/landing-render.js` | `sites/nume-health.com/assets/js/landing-render.js` | `v2026.06.23.1` | `v2026.06.23.1` | Adopted from monorepo `shared/`. `landing-config.js` declares `window.SITE_CONFIG = window.NUME_CONFIG`. |
| `shared/conventions/DATA_BIND_REFERENCE.md` | (read-only reference) | `v2026.05.22.1` | `v2026.05.22.1` | Reference only; no mirror. |
| `shared/conventions/STATUS_PILLS.md` | (read-only reference) | `v2026.05.22.1` | `v2026.05.22.1` | Reference only. |
| `shared/conventions/PLACEHOLDER_GRAMMAR.md` | (read-only reference) | `v2026.05.22.1` | `v2026.05.22.1` | Reference only. |
| `shared/conventions/BRAND_KIT_STRUCTURE.md` | (read-only reference) | `v2026.05.22.1` | `v2026.05.22.1` | Reference only. |
| `shared/conventions/DESIGN_TOKEN_NAMES.md` | (read-only reference) | `v2026.05.22.1` | `v2026.05.22.1` | Reference only. Migration: add `--site-*` aliases in `assets/css/nume-health.css` to satisfy shared `landing.css` reads. |
| `shared/conventions/ANALYTICS_EVENTS.md` | (read-only reference) | `v2026.05.22.1` | `v2026.05.22.1` | Reference only. |
| `shared/conventions/CSS_CLASS_NAMESPACES.md` | (read-only reference) | `v2026.05.22.1` | `v2026.05.22.1` | Reference only. |
| `shared/schemas/landing-config.dtc.template.js` | (template reference for `assets/js/landing-config.js`) | `v2026.05.22.1` | `v2026.05.22.1` | Live `landing-config.js` is in Nume's repo, not here. |
| `shared/templates/Marketing_Next_Steps.template.html` | `Marketing_Next_Steps.html` | `legacy` | `v2026.05.22.1` | Live page in Nume already exists; treat shared template as a structural reference. |
| `shared/templates/Client_Onboarding.template.html` | `Client_Onboarding.html` | `legacy` | `v2026.05.22.1` | Live page in Nume already exists; treat shared template as a structural reference. |

## Status legend

- `legacy` — local copy predates shared canonicalization. Migrate at next sync.
- `vYYYY.MM.DD.N` — local copy matches that version of the shared file.
- `divergent` — local copy was changed without a proposal. Reconcile via a retroactive proposal.

## Adoption notes (current cycle)

Migration tasks the Nume agent should schedule (none are urgent — Nume is shipping today):

1. In `assets/css/nume-health.css`, add a `--site-*` alias block after the existing `--nume-*` definitions. This unblocks adopting `shared/css/landing.css` v2026.05.22.1 in a follow-up.
2. In `assets/js/landing-config.js`, add `window.SITE_CONFIG = window.NUME_CONFIG` immediately after the `NUME_CONFIG` definition. This unblocks adopting `shared/js/landing-render.js` v2026.05.22.1.
3. Once 1 and 2 are in place, swap `assets/css/landing.css` and `assets/js/landing-render.js` for the canonical versions. Smoke-test the five GLP-1 landing pages.
