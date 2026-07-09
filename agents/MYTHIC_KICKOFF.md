# Mythic-RX Console — Kickoff

> Paste the entire contents of this file as your opening message in the Mythic-RX Cursor window. After the agent reads it, it can operate from the rules file and the shared folder without further hand-holding.

---

## You are

The Cursor agent for **mythic-rx.com**. You work inside the Mythic-RX repo. You have **read-only** awareness of two sister locations on this machine:

| Location | Path | Your access |
|---|---|---|
| Sister-sites shared folder | `C:\Users\Mizun\source\repos\sister-sites-shared` | **Read** for canonical code/conventions/schemas. **Never write** here directly — file proposals instead. |
| Nume reference repo | `C:\Users\Mizun\source\repos\Numi` | **Read-only** reference implementation. Never edit. |
| Mythic-RX repo | (your current working directory) | **Read + write.** This is where all your changes land. |

If your current working directory is not the Mythic-RX repo, **stop and ask the operator** before doing anything.

## Your audience and goal

Mythic-RX is a **B2B partner-physician** site. Your audience is U.S.-licensed prescribing clinicians and the people who run their practices — not patients.

You are bringing **Nume's launch system** (brand kit shape, design tokens, `data-bind` renderer, status-pill grammar, action-tracker layout, onboarding-form export pattern) over to Mythic-RX. You are **not** porting Nume's DTC patient-acquisition pages, copy, voice, or pricing. Mythic-RX's existing partner-physician positioning is protected.

If a feature serves a patient acquiring care, it does not belong on Mythic-RX. If a feature serves a clinician acquiring a partnership, it does. The audience is the constraint, not the codebase.

## Read these first (in order)

1. `C:\Users\Mizun\source\repos\sister-sites-shared\README.md`
2. `C:\Users\Mizun\source\repos\sister-sites-shared\AUDIENCE_MATRIX.md`
3. `C:\Users\Mizun\source\repos\sister-sites-shared\SYNC_PROTOCOL.md`
4. `C:\Users\Mizun\source\repos\sister-sites-shared\agents\MYTHIC_AGENT_RULES.md` *(your standing rules — re-read at the start of every session)*
5. `C:\Users\Mizun\source\repos\sister-sites-shared\per-site\mythic-rx\AUDIENCE.md`
6. `C:\Users\Mizun\source\repos\sister-sites-shared\per-site\mythic-rx\COMPLIANCE_GATES.md`
7. `C:\Users\Mizun\source\repos\sister-sites-shared\per-site\mythic-rx\MIRROR_TARGETS.md`
8. All seven docs in `C:\Users\Mizun\source\repos\sister-sites-shared\shared\conventions\`
9. `C:\Users\Mizun\source\repos\sister-sites-shared\shared\schemas\landing-config.b2b.template.js` *(your config schema — DTC version is for Nume; ignore it)*
10. `C:\Users\Mizun\source\repos\sister-sites-shared\shared\templates\Marketing_Next_Steps.template.html`
11. `C:\Users\Mizun\source\repos\sister-sites-shared\shared\templates\Client_Onboarding.template.html`

After the read pass, summarize back to the operator in 5–10 lines: who Mythic-RX serves, what files in `shared/` you'll be consuming, and what the eight-step initial-port sequence is. Wait for "go" before changing anything in the Mythic-RX repo.

## Your first task — initial port

This is the sequence already documented in `per-site/mythic-rx/MIRROR_TARGETS.md`. Execute in order. Mark each row's "Consumed version" to `v2026.05.22.1` as you complete its step.

1. **Brand kit** — stand up `mythic_rx_brand_kit/` per `shared/conventions/BRAND_KIT_STRUCTURE.md`. Mirror the folder shape Nume uses; regenerate every asset from Mythic-RX's own logo lockup. Do **not** copy Nume's PNG/SVG content.

2. **Web favicon set** — drop `favicon.svg`, the full PNG sizes, `apple-touch-icon.png`, `android-chrome-192/512.png`, `og-image.png`, `social-avatar.png`, and `site.webmanifest` into `assets/img/` (and at the repo root for `site.webmanifest`). Same filenames as Nume.

3. **Brand stylesheet** — create `assets/css/mythic-rx.css`. Define `--mrx-*` brand variables, then alias every required `--site-*` variable per `shared/conventions/DESIGN_TOKEN_NAMES.md`.

4. **Shared landing CSS** — copy `sister-sites-shared/shared/css/landing.css` to `assets/css/landing.css` verbatim. It already uses `--site-*` vars.

5. **Landing config** — copy `sister-sites-shared/shared/schemas/landing-config.b2b.template.js` to `assets/js/landing-config.js`. Replace `<SITE_BRAND_PREFIX>` with `MRX_CONFIG`. Leave every value at `[CLIENT TO CONFIRM]` until the client returns the onboarding form.

6. **Shared renderer** — copy `sister-sites-shared/shared/js/landing-render.js` to `assets/js/landing-render.js` verbatim.

7. **Onboarding form** — build `Client_Onboarding.html` from `sister-sites-shared/shared/templates/Client_Onboarding.template.html`. Field set comes from the B2B schema (Step 5). localStorage key: `mrx_onboarding_v1`. Export-config function emits `window.SITE_CONFIG = window.MRX_CONFIG = {`.

8. **Action tracker** — build `Marketing_Next_Steps.html` from `sister-sites-shared/shared/templates/Marketing_Next_Steps.template.html`. Populate Section 2 from `per-site/mythic-rx/COMPLIANCE_GATES.md`. Populate Section 6 channel guardrails from the B2B column of `AUDIENCE_MATRIX.md`. Default every pill to `pill-blocked` / `pill-client` / `pill-todo` — Mythic-RX has no green status yet.

9. **Retrofit existing partner pages** — for each Mythic-RX page that already exists (e.g. `partners.html`, `formulary.html`, `become-a-partner.html`), add `data-bind` markup so brand text, contacts, formulary, disclosures, and gated URLs flow from `MRX_CONFIG`. Keep Mythic-RX's existing headlines, structure, and CTAs unchanged. Confirm the `<head>` loads `mythic-rx.css` **before** `landing.css`.

## What "Done" looks like for the initial port

Verify all of these before reporting back:

- `mythic_rx_brand_kit/` exists with the canonical folder shape and Mythic-RX assets inside.
- `assets/img/favicon.svg` resolves and the favicon shows the Mythic-RX mark in a browser tab.
- `assets/css/mythic-rx.css` defines both `--mrx-*` brand vars and the full set of `--site-*` aliases listed in `DESIGN_TOKEN_NAMES.md`.
- `assets/css/landing.css` is byte-for-byte identical to `sister-sites-shared/shared/css/landing.css`.
- `assets/js/landing-render.js` is byte-for-byte identical to `sister-sites-shared/shared/js/landing-render.js`.
- `assets/js/landing-config.js` starts with `window.SITE_CONFIG = window.MRX_CONFIG = {` and every value is `[CLIENT TO CONFIRM]` (or `null` for genuinely-optional fields).
- `Client_Onboarding.html` autosaves drafts to `mrx_onboarding_v1` in localStorage and exports a drop-in `landing-config.js`.
- `Marketing_Next_Steps.html` uses the canonical six-section layout, the five-pill grammar, and only B2B gates / B2B channels. No Nume-specific content survives.
- Every retrofitted partner page loads in a browser with no console errors. Unfilled config values render with the yellow `lp-placeholder` highlight, not as broken UI.
- From the Mythic-RX repo root, this grep returns **zero** results:
  ```
  rg "nume|NUME_CONFIG|numeTrack|--nume-|nume-health|Nume Health|Nume Medical"
  ```
- `per-site/mythic-rx/MIRROR_TARGETS.md` "Consumed version" column shows `v2026.05.22.1` on every row that you adopted (proposals to update this file are NOT required — `MIRROR_TARGETS.md` is per-site and its site agent owns it).

## Hard rules

1. **Mythic-RX's existing goals and partner-facing copy are protected.** The port is additive — same review and rendering machinery, no change to what Mythic-RX is selling or to whom.
2. **No DTC patient pages.** Do not create `glp1-cash-pay.html`, `glp1-pricing.html`, `weight-care-online.html`, `switch-glp1-provider.html`, or `glp1-faq.html`. Those belong on Nume.
3. **No patient-targeted CTAs** ("See if I qualify", "View pricing"). Mythic-RX's CTAs are clinician-facing ("Become a partner", "Request formulary", "Schedule a consult").
4. **No factual content from Nume's config.** Prices, served states, prescribing-entity names, pharmacy partners, support contacts, testimonials, refund/cancellation language, disclosure wordings — all reset. Mythic-RX is a separate legal and operational entity.
5. **No invented compliance status.** Every gate starts at `pill-blocked` or `pill-client`. Mythic-RX has not been LegitScript-certified, BAA-templated, counsel-cleared, or licensed-by-state just because Nume is on the same path.
6. **No clinic-identity in analytics.** `mrxTrack` (and `siteTrack`) take an event-name string only. Never include partner clinic NPI, practice name, EIN, EMR vendor, license number, or contract value in event names or attributes.
7. **No edits to `sister-sites-shared/`.** If you want to change a shared file, file a proposal at `sister-sites-shared/proposals/YYYY-MM-DD-<slug>.md` per `proposals/README.md`. Wait for approval. The shared maintainer lands the change.
8. **No edits to the Nume repo.** Read-only reference. Even if you spot a bug, your job is to file an issue / message the operator — not to fix it.
9. **Keep `lp-*`, `ob-*`, `ns-*`, `pill-*` class names unchanged.** They are brand- and audience-neutral.
10. **Preserve `data-bind` / `data-bind-attr` / `data-bind-list` / `data-bind-show` / `data-track` attributes verbatim** on retrofitted pages. Only the bound paths change.

## When you're stuck or in doubt

- **Audience question?** Re-read `per-site/mythic-rx/AUDIENCE.md` and the B2B column of `AUDIENCE_MATRIX.md`. The audience always wins over codebase convenience.
- **Mechanics question?** Open the matching reference file at `C:\Users\Mizun\source\repos\Numi\<path>` (read-only) and mirror its shape. The Numi repo is the working reference implementation.
- **Compliance question?** Default to `pill-blocked` and surface it as a gate in `Marketing_Next_Steps.html`. Mythic-RX's counsel must explicitly clear every healthcare-claim and contractual artifact before any pill turns green. Never inherit cleared status from Nume.
- **Shared-vs-local question?** If something is brand-neutral and would benefit both sites, it belongs in `shared/` (file a proposal). If it's site-specific, it belongs in your repo. The matrix in `AUDIENCE_MATRIX.md` is the tiebreaker.
- **Anything else?** Ask the operator. It is always cheaper than guessing on a healthcare-marketing surface.

## What to send back after the read pass

Reply with:

```
READ COMPLETE.

Audience: <one sentence>
Files in shared/ I will consume: <list>
Initial-port sequence (8 steps): <one-line summary each>
Open questions for the operator: <list, or "none">
```

Then wait for "go" before touching the Mythic-RX repo.
