# nume-health.com – DTC Telehealth Patient Journey

Demo site for the **DTC Telehealth** flow: **Social/Landing → Order Fulfillment** (from [Figma board](https://www.figma.com/board/eRdwAlQxhfkuyL7rDViiJ1/DTC-Telehealth-Patient-Journey--Social-Landing-%E2%86%92-Order-Fulfillment)).

- **Dev:** Namecheap cPanel (or local).
- **Production (later):** AWS.

---

## Repo layout

| Path | Purpose |
|------|--------|
| **Repo root** | Deployable site: index.html, index.php, .htaccess, assets/, inc/, and all .html pages. Point your domain document root here. |
| `docs/` | Project outline, clarifying questions, template evaluation, goals. |
| `public/` | Empty; site files moved to repo root. See public/README.md. |
| `Template1/` | Medilo – medical HTML template (reference). |
| `Template2/` | Clinicom – medical HTML template (reference). |
| `Template4/` | Suxnix – health supplement template; **base for shop/cart/checkout**. |

---

## Quick start

1. **Local:** Open `index.html` in a browser, or run `npx serve .` from the repo root.
2. **Deploy:** Point your domain document root at the repo root (the folder that contains index.html, assets/, and .htaccess).

---

## Deploy

- **cPanel / LiteSpeed:** Set the domain document root to this repo root. See docs/DEPLOY-LITESPEED.md.
- **GitHub:** Initialize git in the repo root, add remote, push. Use this repo as the “frontend + docs” repo.
- **AWS (later):** Static: S3 + CloudFront; or app server (EC2/ECS) if you add a backend.

---

## Docs

- [Project outline & demo rollout](docs/PROJECT_OUTLINE.md)
- [Clarifying questions (flow & scope)](docs/CLARIFYING_QUESTIONS.md)
- [Template evaluation (Cursor/VS, best template)](docs/TEMPLATE_EVALUATION.md)
- [Goals & alignment](docs/GOALS_AND_ALIGNMENT.md)

Answering the clarifying questions will lock the exact flow and copy for implementation.
