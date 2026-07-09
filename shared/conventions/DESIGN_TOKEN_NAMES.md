# Design token names (canonical)

Every site exposes its palette and design language through CSS custom properties. The names are standardized so that shared CSS (in particular `shared/css/landing.css`) can reference variables without knowing which brand it's running under.

## Two layers of variables

### Layer 1 — brand-prefixed, site-owned

Each site's main brand stylesheet (`assets/css/<site>.css`) defines its own brand-prefixed variables:

```css
/* Nume — assets/css/nume-health.css */
:root {
  --nume-blue:        #0077B6;
  --nume-cyan:        #00A6C8;
  --nume-teal:        #12C8B8;
  /* ... */
}
```

```css
/* Mythic-RX — assets/css/mythic-rx.css */
:root {
  --mrx-blue:        #XXXXXX;
  --mrx-cyan:        #XXXXXX;
  --mrx-teal:        #XXXXXX;
  /* ... */
}
```

Brand prefixes (`--nume-*`, `--mrx-*`) are mandatory inside the site's own stylesheet. They make DevTools-driven debugging unambiguous (you can see at a glance which brand's bundle is loaded).

### Layer 2 — site-neutral, shared-CSS-facing

In the **same** stylesheet, alias every brand-prefixed variable to its `--site-*` equivalent:

```css
/* Nume — assets/css/nume-health.css, after the brand vars */
:root {
  --site-blue:          var(--nume-blue);
  --site-cyan:          var(--nume-cyan);
  --site-teal:          var(--nume-teal);
  --site-navy:          var(--nume-navy);
  --site-mint:          var(--nume-mint);
  --site-offwhite:      var(--nume-offwhite);
  --site-slate:         var(--nume-slate);
  --site-slate-gray:    var(--nume-slate-gray);
  --site-white:         var(--nume-white);
  --site-border:        var(--nume-border);

  --site-primary:       var(--nume-primary);
  --site-primary-dark:  var(--nume-primary-dark);
  --site-accent:        var(--nume-accent);
  --site-accent-dark:   var(--nume-accent-dark);
  --site-link:          var(--nume-link);
  --site-link-hover:    var(--nume-link-hover);
  --site-heading:       var(--nume-heading);
  --site-text:          var(--nume-text);
  --site-text-muted:    var(--nume-text-muted);
  --site-light:         var(--nume-light);

  --site-gradient:      var(--nume-gradient);
  --site-gradient-dark: var(--nume-gradient-dark);
  --site-shadow:        var(--nume-shadow);
  --site-shadow-hover:  var(--nume-shadow-hover);
  --site-shadow-soft:   var(--nume-shadow-soft);
  --site-radius:        var(--nume-radius);
  --site-radius-lg:     var(--nume-radius-lg);
  --site-transition:    var(--nume-transition);
}
```

## Required `--site-*` variables

Shared CSS (`shared/css/landing.css`) reads these. Every site must define every one:

| Variable | Purpose |
|---|---|
| `--site-primary` | Primary CTA, links |
| `--site-primary-dark` | Primary hover |
| `--site-accent` | Accent CTA, eyebrow text |
| `--site-accent-dark` | Accent hover |
| `--site-link` | Anchor links |
| `--site-link-hover` | Anchor link hover |
| `--site-heading` | Headings (h1–h4) |
| `--site-text` | Body text |
| `--site-slate` | Secondary body text |
| `--site-slate-gray` | Tertiary / muted body text |
| `--site-navy` | Dark backgrounds, footer |
| `--site-mint` | Soft tinted backgrounds, badges |
| `--site-offwhite` | Page background, light surfaces |
| `--site-white` | Pure white surfaces |
| `--site-border` | Hairline dividers, card borders |
| `--site-radius` | Standard corner radius (cards, buttons) |
| `--site-radius-lg` | Large corner radius (hero, large cards) |
| `--site-shadow` | Standard shadow |
| `--site-gradient` | Brand gradient (used for hero/CTA backgrounds) |
| `--site-gradient-dark` | Dark hero gradient |

## Loading order (mandatory)

```html
<link rel="stylesheet" href="assets/css/<site>.css">      <!-- defines brand + site vars -->
<link rel="stylesheet" href="assets/css/landing.css">     <!-- reads --site-* vars -->
```

If `landing.css` loads first, the variables aren't defined yet and the page falls back to browser defaults (visibly broken — useful as a smoke test).

## Why this matters

This two-layer scheme lets a single canonical `landing.css` work across every brand without per-site forks. When the shared `landing.css` adds a new variable reference (say `--site-success`), every site adds the matching alias at adoption time. No file is ever forked per brand.
