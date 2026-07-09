# `data-bind` grammar (canonical)

`shared/js/landing-render.js` is a small dependency-free template engine that hydrates static HTML from a single config object on `window.SITE_CONFIG`. Both sites use it identically.

## Lifecycle

1. The page loads with **fallback default copy** baked into every bound element. Nothing breaks if the script never runs.
2. The site's `landing-config.js` runs first. It sets `window.SITE_CONFIG` (and optionally aliases `window.NUME_CONFIG` / `window.MRX_CONFIG` to the same object for DevTools).
3. `landing-render.js` runs after. On `DOMContentLoaded` it walks the DOM and overwrites bound elements with config values.
4. Missing values leave the fallback copy untouched.
5. Values that contain `[CLIENT TO CONFIRM]` render with the `lp-placeholder` class so QA spots them immediately.

## Directives

### `data-bind="path.to.value"`

```html
<span data-bind="product.monthlyPrice">$XXX</span>
```

Reads `SITE_CONFIG.product.monthlyPrice`. String → text content. Array → joined with `, `.

### `data-bind-attr="attr1:path1; attr2:path2"`

```html
<a data-bind-attr="href:disclosures.privacyPolicyUrl">Privacy</a>
```

Sets the named HTML attribute(s). Placeholder values are skipped — the existing attribute stays as the fallback.

### `data-bind-list="path"` + `data-bind-list-tpl="<li>{value}</li>"`

For arrays of strings:

```html
<ul data-bind-list="product.included" data-bind-list-tpl="<li>{value}</li>"></ul>
```

For arrays of objects, use `{key}` per property:

```html
<ul data-bind-list="trust.testimonials"
    data-bind-list-tpl='<li><blockquote>{quote}</blockquote><cite>{author} — {meta}</cite></li>'></ul>
```

If the list is empty or contains only placeholders, the element is left untouched.

### `data-bind-show="path"`

```html
<div data-bind-show="product.firstMonthPrice">First-month promo: <span data-bind="product.firstMonthPrice"></span></div>
```

Hides the element with `style.display = "none"` when the value is null, empty, an empty array, or a placeholder.

### `data-track="event_name"`

```html
<a class="lp-btn" data-track="cta_click_hero">Get started</a>
```

Click events bubble to the document; `siteTrack(eventName)` forwards to `gtag` and `fbq` if present, then logs to `console.debug`. **No PHI. No clinic identity.** Event name only — there is no second argument by design. See `ANALYTICS_EVENTS.md`.

## Authoring rules

- **Always include a fallback** inside the bound element. It must read correctly even if the renderer never runs (SEO + JS-disabled).
- **Never put PHI or clinic identity in the config.** It's a static JS file shipped to every visitor.
- **List templates are inline-only.** Only `{value}` and `{key}` substitutions are supported.
- **Use `data-bind-show`** for any block that should disappear when its data is missing — don't leave empty headings or empty `<p>` tags onscreen.
