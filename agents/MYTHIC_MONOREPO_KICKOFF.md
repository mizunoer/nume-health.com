# Mythic-RX agent — monorepo kickoff

> Paste this entire file as your opening message in a Cursor window opened on **`C:\Users\Mizun\source\repos\Numi`** (the monorepo). Work only inside `sites/mythic-rx.com/` unless editing `shared/` (proposals only — see below).

---

## You are

The Cursor agent for **mythic-rx.com**, working inside the **Numi monorepo**.

| Location | Path | Access |
|---|---|---|
| **Your deploy folder** | `sites/mythic-rx.com/` | Read + write |
| **Shared canonical code** | `shared/` | Read; copy into your site. Propose changes via `proposals/` if both sites need an update |
| **Nume reference site** | `sites/nume-health.com/` | Read-only — mirror structure, never copy DTC copy or Nume brand assets |
| **Audience / compliance** | `per-site/mythic-rx/` | Read-only |

Do **not** use `C:\Users\Mizun\source\repos\sister-sites-shared\` — it has been merged into this repo under `shared/`.

## Audience (non-negotiable)

Mythic-RX is **B2B**: U.S. licensed clinicians and practice operators — not patients. Do not create DTC GLP-1 patient landing pages. Do not use patient CTAs ("See if I qualify", "View pricing").

Read `per-site/mythic-rx/AUDIENCE.md` and `docs/AUDIENCE_MATRIX.md` before changing anything.

## Read order

1. `docs/MONOREPO.md`
2. `docs/AUDIENCE_MATRIX.md`
3. `per-site/mythic-rx/AUDIENCE.md`
4. `per-site/mythic-rx/COMPLIANCE_GATES.md`
5. `agents/MYTHIC_AGENT_RULES.md` (if present; otherwise follow this file)
6. All files in `shared/conventions/`
7. `shared/schemas/landing-config.b2b.template.js`
8. `shared/templates/Client_Onboarding.template.html`
9. `shared/templates/Marketing_Next_Steps.template.html`
10. Skim `sites/nume-health.com/` for working examples of onboarding, tracker, and `data-bind` usage (read-only)

Reply with a 5–10 line summary, then wait for **go**.

## Initial port — execute in order

All paths below are relative to **`sites/mythic-rx.com/`**.

1. **Brand kit** — create `mythic_rx_brand_kit/` per `shared/conventions/BRAND_KIT_STRUCTURE.md`. Regenerate assets from Mythic-RX's logo; do not copy Nume PNGs/SVGs.

2. **Web identity** — `assets/img/favicon.svg`, PNG sizes, `apple-touch-icon.png`, `android-chrome-*.png`, `og-image.png`, `site.webmanifest` at site root.

3. **Brand stylesheet** — `assets/css/mythic-rx.css` with `--mrx-*` vars plus full `--site-*` alias block per `shared/conventions/DESIGN_TOKEN_NAMES.md`.

4. **Shared landing CSS** — copy `../../shared/css/landing.css` → `assets/css/landing.css` verbatim.

5. **Landing config** — copy `../../shared/schemas/landing-config.b2b.template.js` → `assets/js/landing-config.js`. First line: `window.SITE_CONFIG = window.MRX_CONFIG = {`. All values `[CLIENT TO CONFIRM]` until client onboarding.

6. **Shared renderer** — copy `../../shared/js/landing-render.js` → `assets/js/landing-render.js` verbatim.

7. **Onboarding** — build `Client_Onboarding.html` from `shared/templates/Client_Onboarding.template.html` (B2B fields). localStorage key: `mrx_onboarding_v1`. Export emits `window.SITE_CONFIG = window.MRX_CONFIG = {`.

8. **Action tracker** — build `Marketing_Next_Steps.html` from shared template. Section 2 from `per-site/mythic-rx/COMPLIANCE_GATES.md`. Section 6 channels from B2B column in `AUDIENCE_MATRIX.md`. All pills blocking/awaiting/todo.

9. **Partner pages** — if Mythic-RX already has HTML pages in this folder, retrofit with `data-bind` markup. If starting fresh, create minimal partner-facing pages (`index.html`, `get-started.html`, `contact.html`) with B2B CTAs. Load `mythic-rx.css` **before** `landing.css`.

10. **`.htaccess`** — copy from `sites/nume-health.com/.htaccess`.

## Done when

- [ ] `npx serve sites/mythic-rx.com` serves `index.html` with no console errors
- [ ] `assets/css/landing.css` matches `shared/css/landing.css` byte-for-byte
- [ ] `assets/js/landing-render.js` matches `shared/js/landing-render.js` byte-for-byte
- [ ] Unfilled config shows yellow `lp-placeholder`, not broken layout
- [ ] From repo root: `rg "nume|NUME_CONFIG|numeTrack|--nume-|nume-health|Nume Health" sites/mythic-rx.com` returns **zero**
- [ ] `Marketing_Next_Steps.html` has no green compliance pills

## Hard rules

1. Write only under `sites/mythic-rx.com/` (and `proposals/` if proposing a shared change).
2. Never edit `sites/nume-health.com/`.
3. No DTC pages: no `glp1-cash-pay.html`, `glp1-pricing.html`, etc.
4. No Nume factual content (prices, states, entities, testimonials).
5. No inherited compliance status from Nume.
6. Keep `lp-*`, `ob-*`, `ns-*`, `pill-*` class names unchanged.

## Shared changes

If you need to change `shared/`, add `proposals/YYYY-MM-DD-slug.md` describing the change and wait for operator approval before editing `shared/`.
