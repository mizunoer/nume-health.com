# nume-health.com – DTC Telehealth Patient Journey: Project Outline & Demo Rollout

**Target flow (from Figma):** Social/Landing → Order Fulfillment  
**Dev:** Namecheap cPanel (current) → **Production:** AWS  
**Goal:** Demo-ready site you can push to a basic webserver and later to GitHub.

---

## 1. High-Level Flow (from Figma board)

- **Social / Landing** – First touch: ads/social → landing page (awareness, lead capture).
- **Patient journey** – From landing to consultation/assessment and product selection.
- **Order fulfillment** – Cart, checkout, order confirmation (and any post-purchase steps).

Your Figma board: [DTC Telehealth Patient Journey](https://www.figma.com/board/eRdwAlQxhfkuyL7rDViiJ1/DTC-Telehealth-Patient-Journey--Social-Landing-%E2%86%92-Order-Fulfillment?node-id=0-1&t=ewaVNYLRS2QHXjwn-1) defines the exact screens and steps; implementation will follow those frames.

---

## 2. Project Outline (Phased)

### Phase 1 – Foundation (Demo-ready static site)
- [ ] Choose base template and create unified `public/` (or `src/static/`) structure.
- [ ] One landing page (hero, value prop, CTA) matching Figma.
- [ ] Navigation: Landing → Assessment/Consultation → Shop → Cart → Checkout → Thank You.
- [ ] Reuse/copy assets (CSS/JS/images) from chosen template; no backend yet.
- [ ] Contact form: either static HTML (demo) or plug into existing PHP (cPanel) or a simple serverless endpoint later.
- [ ] Deploy to current cPanel or a static host (e.g. S3 + CloudFront on AWS) for demo.

### Phase 2 – Core journey (still demo-friendly)
- [ ] Assessment/consultation flow: 1–3 step “quiz” or form (multi-page or single-page).
- [ ] Product/shop listing and product detail pages (content can be static).
- [ ] Cart (e.g. `localStorage` or session) and checkout (can be “demo mode” – no real payment).
- [ ] Thank-you / order confirmation page.
- [ ] Basic form validation and clear CTAs at each step.

### Phase 3 – Backend & AWS readiness
- [ ] Replace static/demo forms with API (e.g. Lambda + API Gateway, or app server on AWS).
- [ ] Optional: simple DB (e.g. DynamoDB or RDS) for leads/orders in demo.
- [ ] Auth if needed (e.g. Cognito) for “patient” vs “admin” later.
- [ ] CI/CD: GitHub → build → deploy to S3/CloudFront or EC2/ECS.

### Phase 4 – Polish & compliance
- [ ] Copy and layout aligned 1:1 with Figma.
- [ ] Responsive and accessibility pass.
- [ ] Privacy/Terms pages and any required consent flows (telehealth/compliance).
- [ ] Analytics/events for demo (e.g. GTM or simple event logging).

---

## 3. Demo Rollout Checklist

- [ ] Single entry URL (e.g. `https://yoursite.com` or `https://demo.yoursite.com`).
- [ ] All main journey steps clickable: Landing → Assessment → Shop → Cart → Checkout → Thank You.
- [ ] No 404s on critical paths; placeholder content where needed.
- [ ] Contact form either working (PHP on cPanel) or clearly “Demo – form disabled.”
- [ ] README with: how to run locally, how to deploy to cPanel, and later to AWS.
- [ ] `.gitignore` and minimal env/docs for future GitHub push.

---

## 4. Document References

- **Template docs (in repo):**
  - **Template4 (Suxnix):** `Template4/Documentation/index.html` – Bootstrap 5, 13 pages, PHP contact, shop/cart/checkout, login/register/reset.
  - **Template1 (Medilo):** `Template1/Medilo - Documentation/index.html` – Medical/health, SASS, multiple homes, about, doctors, blog, contact.
  - **Template2 (Clinicom):** `Template2/Clinicom v1.3.3/documentation/index.html` – 18+ HTML5 pages, 8 home variants, departments, doctors, blog.
  - **Template4 Figma:** `Template4/Figma file/Documentation/index.html` – Suxnix Figma (Health Supplement) layer/font/icon notes.

- **Figma (external):**  
  [DTC Telehealth Patient Journey – Social Landing → Order Fulfillment](https://www.figma.com/board/eRdwAlQxhfkuyL7rDViiJ1/DTC-Telehealth-Patient-Journey--Social-Landing-%E2%86%92-Order-Fulfillment?node-id=0-1&t=ewaVNYLRS2QHXjwn-1)

---

## 5. Next Steps

1. Answer clarifying questions in `docs/CLARIFYING_QUESTIONS.md` so the flow matches your product.
2. Use `docs/TEMPLATE_EVALUATION.md` to confirm template choice and Cursor/VS Code setup.
3. Build the initial folder structure and first files under `public/` (or chosen structure) and connect to GitHub when ready.
