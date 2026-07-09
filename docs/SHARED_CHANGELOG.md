# sister-sites-shared — Changelog

Format: `vYYYY.MM.DD.N` — date plus an integer that increments within a single day.

Every entry lists:

- **Version**
- **File(s) changed**
- **Summary**
- **Adoption status** for each consuming site

When a site adopts the change, the site agent edits the row to flip its column from `pending` to the date of adoption.

---

## v2026.05.22.1 — initial system extraction

- **Files**: all of `shared/css/landing.css`, `shared/js/landing-render.js`, `shared/conventions/*`, `shared/schemas/*`, `shared/templates/*`
- **Summary**: First canonicalization of the system Nume shipped on 2026-05-22. Renderer reads `window.SITE_CONFIG` and emits via `window.siteTrack`. Landing CSS uses `--site-*` design tokens. Conventions (status pills, data-bind, placeholder, brand-kit shape, design-token names, analytics events, CSS namespaces) documented. Two schema templates: DTC and B2B.
- **Adoption status**:

  | Site | Status |
  |---|---|
  | nume-health.com | pending — currently uses `NUME_CONFIG` / `numeTrack` / `--nume-*`. Migration: alias `window.SITE_CONFIG = window.NUME_CONFIG` and `window.siteTrack = window.numeTrack` in `landing-config.js`, OR rename in place. Either way, no behavior change. |
  | mythic-rx.com | adopted 2026-05-22 — initial port complete. Reconciled in place over an existing public partner-physician site (not a fresh repo). See `per-site/mythic-rx/MIRROR_TARGETS.md` for adoption notes, site-local layout overrides, brand-kit variant status, and mid-port state. |
