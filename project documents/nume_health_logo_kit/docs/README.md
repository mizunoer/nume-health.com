# nume health — Logo Kit Template

This kit is organized to match common export needs: SVG masters, PNG logo sizes, favicons, social OG, and app icons.

## Folder map

- `exports/svg/`  
  **Primary deliverables should live here** (vector).  
  Included files here are **SVG placeholders that embed PNG** for preview only. Replace them with real SVG exports from your design source.

- `exports/png/logo-lockup/`  
  Horizontal lockup PNGs at widths: 4096 / 2048 / 1024 / 512

- `exports/png/icon-mark/`  
  Icon-only mark PNGs at max-dimension: 4096 / 2048 / 1024 / 512

- `exports/favicon/`  
  64 / 48 / 32 / 16 px PNG favicons (transparent)

- `exports/app-icons/`  
  1024 / 512 / 256 / 180 / 120 px PNG app icons

- `exports/social-og/`  
  1200×630 PNG Open Graph image

- `reference/`  
  Source image and any reference crops.

## Figma export recipe (copy/paste)

### SVG master
1. Select the *master* logo component (lockup + icon-only).
2. **Share → Download → SVG**
3. Save as:
   - `numehealth_logo_master.svg`
   - `numehealth_icon_master.svg`

### PNG logo exports (4096, 2048, 1024, 512)
1. Select the logo frame (lockup) or icon-only frame.
2. **Share → Download → PNG**
3. Set **Size** using the scale slider to hit each target (or use frames sized to 1024px and export at 4× / 2× / 1× / 0.5×).
4. Use these names:
   - `numehealth_lockup_color_w4096.png` (etc)
   - `numehealth_icon_color_4096.png` (etc)

### Favicon set (16–64px)
1. Create a 64×64 frame (or use your favicon page).
2. Place **icon-only mark** centered with comfortable padding (~10–15%).
3. Export PNG at 1× (64), then 0.75× (48), 0.5× (32), 0.25× (16).

### Social OG (1200×630)
1. Create/Use an OG frame at **1200×630**
2. Keep logo inside safe area (at least 60px margin on all sides).
3. Export PNG at 1× as `social_og_1200x630.png`

### App icon grid (1024, 512, 256, 180, 120)
1. Create frames at each size (square).
2. Center icon; keep key shapes inside ~80% of the canvas.
3. Export each as PNG:
   - `app_icon_1024.png`, `app_icon_512.png`, ...

## Notes for quality
- For small sizes (16/32px), keep details minimal and avoid thin strokes.
- Prefer exporting PNGs from SVG masters (not from screenshots), to avoid softness.
- If you ship a gradient background app icon, also ship a flat-background alternative for accessibility.

Generated on: 2026-02-15
