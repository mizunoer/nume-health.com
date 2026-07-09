# Nume Health — Logo usage on site

This folder and `assets/img/` follow the **Nume Health Brand Guide v1** and the **nume_health_logo_kit** (see `project documents/nume_health_logo_kit/`).

## What the site uses today

| Use | File | Notes |
|-----|------|--------|
| **Header** (light background) | `logo.svg` | Light lockup: mark + “nume” (Ocean Blue) + “health” (Slate). Min width ~120px. |
| **Footer / hero** (dark background) | `white_logo.svg` | Dark lockup: same layout, off‑white #F7FAFC. |
| **Favicon** | `../favicon.svg` | Mark only (Navy circle + Ocean Blue + Teal leaf). |

Brand colors: Navy `#0B1B2B`, Teal `#1BB6A8`, Ocean Blue `#0A5DB8`, Slate `#2E3E50`, Off‑white `#F7FAFC`.

## Logo kit and exports

- **Kit location:** `project documents/nume_health_logo_kit/`
- **Docs:** `docs/README.md` (export checklist), `docs/FILE_NAMING.md` (naming convention).
- **Manifest:** `export_manifest.csv` lists all recommended exports.

When you export from Figma/design source (see kit README):

1. **PNG lockups** (color + white) → `exports/png/logo-lockup/` at widths 4096, 2048, 1024, 512.
2. **Icon/mark PNGs** → `exports/png/icon-mark/`.
3. **Favicon PNGs** (16, 32, 48, 64) → `exports/favicon/`. The site currently uses `favicon.svg`; add `<link rel="icon" sizes="32x32" href="…">` etc. when PNGs exist.
4. **App icons** (1024, 512, 256, 180, 120) → `exports/app-icons/`.
5. **Social / OG** (1200×630) → `exports/social-og/`. Use for `og:image` and Twitter cards when the file exists.

## Variants needed for marketing pages

- **All marketing pages:** Use `logo.svg` in header and `white_logo.svg` in footer/hero (already wired in `inc/header.html` and `inc/footer.html`).
- **Landing / campaign pages:** Same; ensure hero background is Navy or dark so the white lockup is used there.
- **Social / ads:** Use the kit’s exported PNGs (logo-lockup and social-og) from `nume_health_logo_kit/exports/`; reference them in meta tags or ad platforms when you add those assets.

No logo asset in this folder should be stretched, skewed, or recolored outside the brand palette.
