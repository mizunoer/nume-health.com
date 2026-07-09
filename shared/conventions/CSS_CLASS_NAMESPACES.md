# CSS class namespaces (canonical)

Every shared component uses a stable class-name prefix. Prefixes are brand- and audience-neutral and **never** rename per site.

| Prefix | Owner file | Used in | Purpose |
|---|---|---|---|
| `lp-*` | `shared/css/landing.css` | All landing pages on every site | Landing-page system: hero, trust, sections, pricing cards, steps, callouts, FAQ, footer, sticky CTA, disclosure, placeholder |
| `ob-*` | site-local (Client_Onboarding.html `<style>`) | Onboarding form on every site | Onboarding-form system: progress bar, sections, fields, checkbox lists, accordion, export button |
| `ns-*` | site-local (Marketing_Next_Steps.html `<style>`) | Action tracker on every site | Tracker system: hero, stat cards, sections, link grid, callouts, week grid, day cards |
| `pill-*` | shared, applied across `ns-*` and any other status tables | Tracker tables, status displays | Five-status pill grammar — see `STATUS_PILLS.md` |
| `tg-*` | third-party (Suxnix template) | Pages built on the Suxnix template | Vendor-template variables — site-local override but **never** renamed |

## Hard rules

1. **Do not rename prefixes per brand.** A site that renames `lp-*` to `nume-lp-*` or `mrx-lp-*` forks every shared CSS rule and breaks the reuse contract.
2. **New components introduced in `shared/` must declare their prefix here.** If a new shared component arrives in `shared/css/` (say, a partner-portal block called "pp"), it gets a row in this table at landing time.
3. **Site-local components use site-local prefixes that don't collide.** If Mythic-RX adds an HCP-only widget, name it `mrx-*` (in its own brand-prefixed namespace) and keep it inside the Mythic-RX repo. Do not promote `mrx-*` into `shared/`.
4. **`pill-*` is the only prefix shared between landing pages and internal tools.** This is intentional — status communicates the same thing wherever it appears.

## Why this matters

The `lp-*` namespace is what makes every landing page brandable. If the prefix were `nume-lp-*`, you couldn't drop the same CSS into Mythic-RX without a rename pass, which is exactly the friction `shared/` exists to eliminate.
