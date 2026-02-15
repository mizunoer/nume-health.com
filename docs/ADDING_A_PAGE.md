# Adding a new page to nume-health.com

When you add a new page to the site, do these two things so the nav and Recommendations form stay in sync.

## 1. Add the page to `assets/js/site-config.js`

Edit `assets/js/site-config.js` (at repo root) and add one object:

```js
{ label: 'Your Page Name', url: 'your-page.html' },
```

Example: adding a "Privacy" page:

```js
{ label: 'Privacy', url: 'privacy.html' },
```

The **Page** dropdown in the main nav and the **Page** dropdown on the Recommendations form are both filled from `SITE_PAGES`, so this single change updates both.

## 2. Create the new HTML file

- Copy an existing inner page (e.g. `assessment.html` or `contact.html` at repo root).
- Rename it to your new file (e.g. `privacy.html`).
- Update the `<title>` and the `<h1>` (and any nav item that should show as active).
- Replace the main content with your new content.
- Keep the same header and footer so the design stays unified.

## Optional: update `inc/header.html` and `inc/footer.html` (at repo root)

These files are the reference copies of the header and footer. If you add a new top-level nav link, update `inc/header.html` too so future copy-paste stays correct. The live pages use inline header/footer, so you’ll need to update each page’s header if you add a new nav item that should appear on all pages.
