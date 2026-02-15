# nume-health.com – Public site (deployable)

This folder is the **deployable site** for the DTC Telehealth patient journey (Landing → Assessment → Shop → Cart → Checkout → Thank You).

## Structure

```
public/
├── index.html              # Home (Landing 1)
├── index-2.html            # Landing 2
├── index-3.html            # Landing 3
├── assessment.html
├── shop.html
├── shop-details.html
├── cart.html
├── checkout.html
├── thank-you.html
├── login.html
├── register.html
├── reset-password.html
├── contact.html
├── recommendations.html    # Suggestions: Name, Page dropdown, Feedback, Images; Dev Notes/Status internal only
├── assets/
│   ├── css/
│   ├── js/
│   │   ├── site-config.js  # SITE_PAGES – add new pages here
│   │   └── site-nav.js     # Fills Page dropdown from SITE_PAGES
│   ├── img/
│   └── fonts/
└── inc/
    ├── header.html
    └── footer.html
```

## Getting assets from Suxnix

To get a full working demo:

1. Copy everything from `Template4/suxnix/assets/` into `public/assets/`.
2. Copy `Template4/suxnix/inc/contact.php` to `public/inc/` if you need the contact form on cPanel.
3. Copy and then rebrand the HTML pages from `Template4/suxnix/` (rename "Suxnix" → "nume-health.com", update nav links to include `assessment.html` and `thank-you.html`).

## Run locally

- Open `index.html` in a browser, or
- Use a simple static server, e.g. `npx serve public` or your editor’s “Live Server” (point root to `public`).

## Deploy

- **cPanel:** Upload the contents of `public/` to your `public_html` (or a subfolder).
- **AWS (later):** Build step optional; upload `public/` to S3 and optionally put CloudFront in front.

See repo root `README.md` for GitHub and full project info.
