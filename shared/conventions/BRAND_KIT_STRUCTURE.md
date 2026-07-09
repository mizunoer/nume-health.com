# Brand-kit folder structure (canonical)

Every site uses the same brand-kit folder layout under `<repo>/<site>_brand_kit/` (e.g. `nume_health_brand_kit/`, `mythic_rx_brand_kit/`). This makes it possible to have one set of asset-pipeline scripts, one onboarding tool, and one image-selection tool that work across every brand we add.

## Required folders

```
<site>_brand_kit/
├─ README.md                # purpose, contents, where each asset is consumed
├─ brand-kit-preview.html   # visual contact sheet (every variant rendered)
├─ email/                   # signature variants (300w, 600w transparent PNGs)
├─ logo/                    # primary brand logo, all formats and sizes
├─ marketing/               # 1200w hero / banner sizes, transparent + on-color
├─ marks/                   # mark-only (no wordmark), transparent variants
├─ reversed/                # reversed-on-dark variants
├─ social/                  # 1080² social avatars, 1200×630 covers
├─ source/                  # original composite + AI/PSD/Figma source
├─ svg/                     # canonical SVGs (one per variant)
└─ transparent-png/         # PNGs of every SVG variant
└─ web/                     # favicon set + manifest + brand css
```

## SVG variants (canonical names)

Each site's brand kit must contain these eight SVGs at `svg/<site>-<variant>.svg`:

1. `<site>-primary-horizontal.svg` — wordmark + mark, horizontal lockup, color
2. `<site>-stacked.svg` — wordmark + mark, stacked, color
3. `<site>-mark-only.svg` — mark with no wordmark
4. `<site>-reversed-horizontal.svg` — for placement on dark backgrounds
5. `<site>-app-icon.svg` — square / iOS-style icon
6. `<site>-email-signature.svg` — narrow email-signature lockup
7. `<site>-social-avatar.svg` — square social-profile lockup
8. `<site>-website-header.svg` — header logo at the size used in the site nav

For each SVG, a matching PNG must exist in `transparent-png/`. The PNG sizes that production consumes (header logo, app icon, social avatar) are also exported into `web/` and `assets/img/` at the production filenames.

## Web folder (`<site>_brand_kit/web/`)

The web folder is the contract between the brand kit and the production site:

```
web/
├─ favicon.ico
├─ favicon.svg                       # single-color version, source of truth
├─ favicon-16x16.png
├─ favicon-32x32.png
├─ favicon-48x48.png
├─ favicon-64x64.png
├─ favicon-128x128.png
├─ favicon-256x256.png
├─ apple-touch-icon.png              # 180×180
├─ android-chrome-192x192.png
├─ android-chrome-512x512.png
├─ site.webmanifest                  # name + short_name + theme + bg + icons
├─ website-header-logo-320w.png
├─ website-header-logo-480w.png
└─ <site>-brand.css                  # :root with --<site>-* CSS variables
```

The site's `assets/img/` directory mirrors the relevant subset of `web/` (favicon + apple-touch + android-chrome + og-image + social-avatar + email-signature + the website-header logo PNGs + a copy of `favicon.svg`).

## Naming rules

- Lowercase, hyphenated, with the site slug as a prefix on every artifact (`nume-health-*.svg`, `mythic-rx-*.svg`).
- Sizes go at the end (`-1080.png`, `-1200x630.png`, `-300w.png`).
- "Reversed" means "for dark backgrounds." Always export both a transparent reversed variant and a reversed-on-navy filled variant.
- "Compact" means the wordmark has been tightened to a square aspect ratio (used in social).

## Why this matters

When the onboarding tool, image-selection tool, or favicon-generation script is improved on one site, it can be promoted into `shared/` and consumed by every site without rewriting it per brand — because every brand kit has the same shape.
