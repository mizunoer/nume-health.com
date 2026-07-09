# Adding a new page to nume-health.com

Site files live under **`sites/nume-health.com/`**. When you add a new page, do these two things so the nav and Recommendations form stay in sync.

## 1. Add the page to `assets/js/site-config.js`

Edit `sites/nume-health.com/assets/js/site-config.js` and add one object:

```js
{ label: 'Your Page Name', url: 'your-page.html' },
```

The **Page** dropdown in the main nav and on the Recommendations form both read from `SITE_PAGES`.

## 2. Create the new HTML file

- Copy an existing inner page (e.g. `assessment.html` or `contact.html`).
- Rename it (e.g. `privacy.html`).
- Update `<title>`, `<h1>`, and any active nav item.
- Replace main content; keep the same header and footer.

## Optional: update `inc/header.html` and `inc/footer.html`

Reference copies for copy-paste. Live pages use inline header/footer — update each page if you add a top-level nav link everywhere.
