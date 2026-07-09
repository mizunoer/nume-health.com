# mythic-rx.com — mirror targets

This file tracks which canonical files Mythic-RX currently consumes from `sister-sites-shared/` and at which version. The Mythic-RX agent updates the "Consumed version" column when it adopts a change.

## Mirror manifest

| Shared file | Local target in Mythic-RX | Consumed version | Latest available | Notes |
|---|---|---|---|---|
| `shared/css/landing.css` | `assets/css/landing.css` | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Adopted verbatim (SHA-256 verified). `--site-*` aliases defined in `assets/css/mythic-rx.css`. |
| `shared/js/landing-render.js` | `assets/js/landing-render.js` | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Adopted verbatim (SHA-256 verified). `landing-config.js` declares `window.SITE_CONFIG = window.MRX_CONFIG = {...}`. |
| `shared/conventions/DATA_BIND_REFERENCE.md` | (read-only reference) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Reference only. Followed for `data-bind` markup on retrofitted partner pages. |
| `shared/conventions/STATUS_PILLS.md` | (read-only reference) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Reference only. Used in `Marketing_Next_Steps.html`. |
| `shared/conventions/PLACEHOLDER_GRAMMAR.md` | (read-only reference) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Reference only. `lp-placeholder` styling added to `assets/css/mythic-rx.css`. |
| `shared/conventions/BRAND_KIT_STRUCTURE.md` | (read-only reference) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Reference only. `mythic_rx_brand_kit/` mirrors canonical structure; some SVG variants are stopgaps pending designer work (documented in the kit's README). |
| `shared/conventions/DESIGN_TOKEN_NAMES.md` | (read-only reference) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Reference only. Both `--mrx-*` and the full `--site-*` alias set are defined. |
| `shared/conventions/ANALYTICS_EVENTS.md` | (read-only reference) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Reference only. `siteTrack` event names follow the B2B funnel taxonomy. |
| `shared/conventions/CSS_CLASS_NAMESPACES.md` | (read-only reference) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Reference only. `lp-*`/`ob-*`/`ns-*`/`pill-*` unchanged. |
| `shared/schemas/landing-config.b2b.template.js` | (template for `assets/js/landing-config.js`) | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Populated at `assets/js/landing-config.js`. First line: `window.SITE_CONFIG = window.MRX_CONFIG = {`. Every value `[CLIENT TO CONFIRM]` or `null` until client returns onboarding form. |
| `shared/templates/Marketing_Next_Steps.template.html` | `Marketing_Next_Steps.html` | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Built. Section 2 populated from `per-site/mythic-rx/COMPLIANCE_GATES.md`; Section 6 from the B2B column of `AUDIENCE_MATRIX.md`. All pills default to blocking / awaiting / open. |
| `shared/templates/Client_Onboarding.template.html` | `Client_Onboarding.html` | `v2026.05.22.1` (2026-05-22) | `v2026.05.22.1` | Built. localStorage key `mrx_onboarding_v1`. Export emits drop-in `landing-config.js` starting with `window.SITE_CONFIG = window.MRX_CONFIG = {`. |

## Status legend

- `never` — Mythic-RX has not yet adopted this file. Initial port.
- `vYYYY.MM.DD.N` — local copy matches that version of the shared file.
- `divergent` — local copy was changed without a proposal. Reconcile via a retroactive proposal.

## Adoption notes (initial port — 2026-05-22)

Mythic-RX completed initial adoption of `v2026.05.22.1` on 2026-05-22.

**Deviation from "fresh port" assumption:** Mythic-RX was not actually a fresh repo at port time — it had an existing public partner-physician site (`index.html`, `services.html`, `service_detail.html`, `get-started.html`, `about.html`, `faq.html`, `contact.html`, `provider-portal.html`) with real production copy. Adoption reconciled in place rather than wipe-and-recopy, per operator direction.

**Site-local files preserved during adoption:**
- `assets/css/mythic-rx.css` — defines `--mrx-*` brand vars + the canonical `--site-*` aliases, plus two legacy-template layout overrides (`.bg-attach-fixed` and `.swiperImage` `height: auto` overrides) that fix a pre-existing bug in `css/style.css` and `swiper-bundle.min.css` causing 1200px+ phantom heights on stand-alone CTA sections and the state slider. These overrides are intentionally Mythic-RX-only and stay in this site's stylesheet.
- Three canonical-URL redirect stubs (`become-a-partner.html` → `get-started.html`, `partners.html` → `services.html`, `formulary.html` → `get-started.html`) so partner-program marketing URLs resolve while the existing site keeps its established page names.

**Known mid-port state:** Every value in `assets/js/landing-config.js` is `[CLIENT TO CONFIRM]` per the adoption order. As a result, the production site currently displays yellow `lp-placeholder` highlights on bound elements (hero H1, footer phone / email / states, contact info). This is the canonical QA-loud signal per `shared/conventions/PLACEHOLDER_GRAMMAR.md` — and per that doc, also a launch-blocker. Site must not ship to public DNS until either: (a) the client returns `Client_Onboarding.html` with values, or (b) the operator seeds publicly-known Mythic-RX values into `landing-config.js`. The action tracker (`Marketing_Next_Steps.html`) Section 3 enumerates the unfilled fields.

**Filename count delta:** Brand kit's required eight SVG variants exist; three (`primary-horizontal`, `mark-only`, `reversed-horizontal`) are designer-produced; five (`stacked`, `app-icon`, `social-avatar`, `email-signature`, `website-header`) are canonical-named copies of the closest existing asset, flagged as "stopgap" in the kit's README and `brand-kit-preview.html`.

**Favicon variant:** Four single-color SVG variants exist under `mythic_rx_brand_kit/web/favicon-variants/` (off-white, primary green, dark evergreen, pure black). `ImageSelection.html` exposes a side-by-side picker. Operator selects production variant; selected file gets promoted to `mythic_rx_brand_kit/web/favicon.svg` and `assets/img/favicon.svg`. Until then, the current `favicon.svg` remains the full-color mark.

## Original-order adoption sequence

The Mythic-RX agent is on a fresh port — no legacy state to migrate. Order of adoption:

1. Stand up `mythic_rx_brand_kit/` per `shared/conventions/BRAND_KIT_STRUCTURE.md`.
2. Build `assets/css/mythic-rx.css` per `shared/conventions/DESIGN_TOKEN_NAMES.md` (both `--mrx-*` brand vars and `--site-*` aliases).
3. Drop in `shared/css/landing.css` at `assets/css/landing.css`. Mark consumed `v2026.05.22.1`.
4. Build `assets/js/landing-config.js` from `shared/schemas/landing-config.b2b.template.js`. Replace `<SITE_BRAND_PREFIX>` with `MRX_CONFIG`. Mark consumed `v2026.05.22.1`.
5. Drop in `shared/js/landing-render.js` at `assets/js/landing-render.js`. Mark consumed `v2026.05.22.1`.
6. Build `Client_Onboarding.html` from `shared/templates/Client_Onboarding.template.html` with B2B fields. Mark consumed `v2026.05.22.1`.
7. Build `Marketing_Next_Steps.html` from `shared/templates/Marketing_Next_Steps.template.html`. Populate gates from `COMPLIANCE_GATES.md`. Default all pills to blocking / awaiting / open. Mark consumed `v2026.05.22.1`.
8. Retrofit Mythic-RX's existing partner pages with `data-bind` markup. Smoke-test against the placeholder-filled `landing-config.js`.
