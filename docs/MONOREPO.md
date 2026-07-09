# Monorepo layout

Both **nume-health.com** (DTC patients) and **mythic-rx.com** (B2B partner physicians) live in this repo. Shared launch-system code is edited once under `shared/`; each site has its own deploy folder under `sites/`.

## Folder map

```
Numi/
├── shared/                      # Canonical JS/CSS/schemas — edit once, both sites copy from here
│   ├── css/landing.css
│   ├── js/landing-render.js
│   ├── schemas/
│   ├── conventions/
│   └── templates/
├── sites/
│   ├── nume-health.com/         # Deploy root for nume-health.com
│   └── mythic-rx.com/           # Deploy root for mythic-rx.com
├── per-site/                    # Audience + compliance facts per brand (not deployable)
├── agents/                      # Cursor agent kickoff docs
├── docs/
├── Template1–4/                 # Reference templates (not deployed)
└── README.md
```

## Deploy

| Domain | Document root (cPanel) |
|---|---|
| nume-health.com | `sites/nume-health.com/` |
| mythic-rx.com | `sites/mythic-rx.com/` |

After pulling on the server, point each domain at its `sites/<domain>/` folder. Do **not** use the repo root as the web root anymore.

## Local dev

```powershell
cd sites/nume-health.com
npx serve .
```

Or from repo root:

```powershell
npx serve sites/nume-health.com
```

## Updating shared code

1. Edit the file under `shared/` (e.g. `shared/js/landing-render.js`).
2. Copy into each site that uses it:
   - `sites/nume-health.com/assets/js/landing-render.js`
   - `sites/mythic-rx.com/assets/js/landing-render.js`
3. Smoke-test both sites. Add a line to `docs/SHARED_CHANGELOG.md`.

There is no separate `sister-sites-shared/` folder or sync protocol anymore — git is the source of truth.

## Site-specific vs shared

See [AUDIENCE_MATRIX.md](AUDIENCE_MATRIX.md). Rule of thumb: if it mentions a brand name, price, state list, or compliance status, it stays in `sites/<domain>/`. If it's renderer logic, CSS class names, or form export mechanics, it belongs in `shared/`.

## Mythic-RX agent

Paste [agents/MYTHIC_MONOREPO_KICKOFF.md](../agents/MYTHIC_MONOREPO_KICKOFF.md) into a Cursor window opened on this repo (`Numi/`).
