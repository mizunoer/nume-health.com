# Clarifying Questions – DTC Telehealth Patient Journey

These questions will lock in the exact flow and scope so the demo matches your vision. You can answer in bullet form or short paragraphs.

---

## 1. Landing & acquisition

- **Traffic source:** Is the only entry “social/ads → landing page,” or do you also have organic (SEO) or email landing pages?
- **Primary CTA:** What should the main button do? (e.g. “Start assessment,” “Book consultation,” “Shop now,” “Get prescription.”)
- **Lead capture:** Do you need email/phone capture before the assessment, or only at checkout? Any “waitlist” or “notify me” step?

---

## 2. Assessment / consultation

- **Type:** Is this a short quiz (e.g. eligibility + product fit), a telehealth “visit” booking, or both?
- **Steps:** How many steps/screens in the assessment? (e.g. 3 steps: condition → history → consent.)
- **Result:** After completion, do you show “recommended product(s)” and then send to shop, or go straight to a single product/checkout?
- **Saving progress:** For demo, is it OK if we don’t save progress (or use `localStorage` only), or do you need “resume later”?

---

## 3. Shop & product

- **Catalog:** How many products for the demo? (e.g. 1–3 products, or a full catalog.)
- **Prescription vs OTC:** Are products prescription-only (after assessment) or mixed (some OTC, some Rx)?
- **Product page:** Do you want a classic “product detail” (image, description, add to cart) or a minimal “add to cart” from listing only?

---

## 4. Cart & checkout

- **Checkout steps:** Single page or multi-step (e.g. cart → shipping → payment → confirm)?
- **Payment in demo:** Should we show a fake “Pay now” that always succeeds and shows thank-you, or a clear “Demo – no payment” message?
- **Account:** Must users register/login before checkout, or is “guest checkout” enough for the demo?
- **Prescription/approval:** Does checkout need to show “prescription approved” or “provider sign-off” for some items?

---

## 5. Post-order

- **Thank-you page:** What should it show? (e.g. order number, “we’ll email you,” next steps like “track order” or “book follow-up.”)
- **Email:** For demo, is a static thank-you page enough, or do you want a real “order confirmation email” (would need backend)?

---

## 6. Branding & content

- **Name:** Confirm “nume-health.com” for the product/site name (and any tagline).
- **Copy:** Will you supply final copy, or should we use placeholder text aligned with the Figma labels?
- **Legal:** Do you need Privacy Policy / Terms of Service / HIPAA (or other) notices in the demo, or can that wait?

---

## 7. Hosting & tech

- **cPanel (now):** Are you OK with static HTML/CSS/JS + optional PHP for contact form only for the first demo?
- **AWS (later):** Any preference? (e.g. static on S3+CloudFront vs EC2/ECS; serverless vs single app server.)
- **GitHub:** One repo for “frontend + docs” fine, or do you plan a separate backend repo later?

---

Once you answer these, the flow can be finalized and the demo structure (pages and navigation) can be fixed in the project outline and in the built template.
