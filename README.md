# nume-health.com – DTC Telehealth Patient Journey

Demo site for the **DTC Telehealth** flow: **Social/Landing → Order Fulfillment** (from [Figma board](https://www.figma.com/board/eRdwAlQxhfkuyL7rDViiJ1/DTC-Telehealth-Patient-Journey--Social-Landing-%E2%86%92-Order-Fulfillment)).

- **Dev:** Namecheap cPanel (or local).
- **Production (later):** AWS.

---

## Repo layout

| Path | Purpose |
|------|--------|
| `public/` | Deployable site (HTML, CSS, JS, assets). Point your webserver or S3 at this. |
| `docs/` | Project outline, clarifying questions, template evaluation, goals. |
| `Template1/` | Medilo – medical HTML template (reference). |
| `Template2/` | Clinicom – medical HTML template (reference). |
| `Template4/` | Suxnix – health supplement template; **base for shop/cart/checkout**. |

---

## Quick start

1. **Landing + placeholders:** Open `public/index.html` in a browser. Use the nav to open Assessment, Shop, Cart, Checkout, Thank You (placeholders or Suxnix pages once copied).
2. **Full demo (with Suxnix UI):** Copy `Template4/suxnix/assets/` into `public/assets/`, then copy and rebrand the Suxnix HTML pages into `public/` (see `public/README.md`).
3. **Local server (optional):** From repo root run `npx serve public` and open the URL shown.

---

## Deploy

- **cPanel:** Upload contents of `public/` to `public_html` (or a subfolder). If using the contact form, ensure PHP is available and copy `inc/contact.php` from Suxnix.
- **GitHub:** Initialize git in the repo root, add remote, push. Use this repo as the “frontend + docs” repo.
- **AWS (later):** Static: S3 + CloudFront; or app server (EC2/ECS) if you add a backend.

---

## Docs

- [Project outline & demo rollout](docs/PROJECT_OUTLINE.md)
- [Clarifying questions (flow & scope)](docs/CLARIFYING_QUESTIONS.md)
- [Template evaluation (Cursor/VS, best template)](docs/TEMPLATE_EVALUATION.md)
- [Goals & alignment](docs/GOALS_AND_ALIGNMENT.md)

Answering the clarifying questions will lock the exact flow and copy for implementation.
