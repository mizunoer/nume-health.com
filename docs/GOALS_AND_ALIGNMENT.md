# Goals & Alignment – nume-health.com DTC Telehealth

One-page summary so everything stays aligned.

---

## Goals

1. **Demo** of the DTC Telehealth patient journey: **Social/Landing → Order Fulfillment** (per Figma).
2. **Deploy** to a basic webserver now (e.g. cPanel); move to **AWS** later with no structural lock-in.
3. **Single codebase** that works well in **VS Code / Cursor**, then **GitHub**, then production.
4. **Use existing templates** where possible; Suxnix (Template4) chosen as base for shop/cart/checkout/auth.

---

## Flow (from Figma + docs)

| Step | Description | Source |
|------|-------------|--------|
| 1 | **Landing** – Social/ads entry, hero, CTA | Figma + Suxnix index |
| 2 | **Assessment / consultation** – Quiz or booking | To build (placeholder page in place) |
| 3 | **Shop** – Product listing | Suxnix shop |
| 4 | **Cart** | Suxnix cart |
| 5 | **Checkout** | Suxnix checkout |
| 6 | **Thank you / confirmation** | Suxnix or new |

---

## Decisions made

- **Template:** Suxnix (Template4) – only one with full shop/cart/checkout + login/register.
- **Project type:** Static HTML/CSS/JS (+ optional PHP for contact) – best for Cursor and simple deploy.
- **Folder:** `public/` holds the deployable site; `docs/` holds outline, questions, evaluation, this file.
- **Clarifying questions:** In `docs/CLARIFYING_QUESTIONS.md` – answers will refine flow and copy.

---

## Alignment checklist

- [x] Project outline with phased demo rollout (`PROJECT_OUTLINE.md`)
- [x] Template evaluation and Cursor/VS recommendation (`TEMPLATE_EVALUATION.md`)
- [x] Clarifying questions for flow and scope (`CLARIFYING_QUESTIONS.md`)
- [x] Goals and alignment summary (this file)
- [ ] Folder structure and initial files under `public/`
- [ ] README for run locally + deploy to cPanel + GitHub
- [ ] .gitignore for OS/editor and optional env

Once you answer the clarifying questions, we can lock the exact screens and copy and implement them in `public/`.
