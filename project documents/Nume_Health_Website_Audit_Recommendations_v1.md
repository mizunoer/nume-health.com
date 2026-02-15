Nume Health (nume-health.com)
Website Audit & Recommendations
Version 1 • February 14, 2026
Audience: Workshift (development), product, and operations stakeholders.
Scope: Public site, assessment-to-checkout flow, account pages, contact, and internal suggestions page.
> **Top takeaway: The current build is a clean starter template, but it still contains placeholder copy and internal dev notes that must be removed before any paid traffic. The information architecture and copy must pivot to the GLP-1 physician-led journey and patient portal experience.**

# 1. Current Page Inventory (Observed)
| Page | Path | What it is today |
| --- | --- | --- |
| Home | /index.html | Generic DTC telehealth hero + 4-step 'How it works' |
| Landing 2 | /index-2.html | Alternate hero + 'Why thousands choose us' |
| Landing 3 | /index-3.html | Minimal hero variant |
| Assessment | /assessment.html | Single-page form (topic selector, meds, allergies) |
| Shop | /shop.html | Template catalog of 6 supplement-style 'treatments' |
| Product details | /shop-details.html | One sample product detail |
| Cart | /cart.html | Template cart |
| Checkout | /checkout.html | Template checkout w/ demo note |
| Login | /login.html | Template login |
| Register | /register.html | Template register |
| Reset password | /reset-password.html | Template reset |
| Contact | /contact.html | Contact form + a dev instruction line |
| Recommendations | /recommendations.html | Suggestion form + internal table instructions |

# 2. P0 Fixes (Do These Before Marketing)
- Remove all visible development notes/instructions from public pages (Contact + Recommendations).
- Remove 'Demo checkout — no real payment' copy, and clearly separate sandbox vs production.
- Stop claiming 'HIPAA compliant' unless you have completed the compliance work and can substantiate it; otherwise use safer language (e.g., 'Secure, privacy-first platform').
- Remove/validate any turnaround claims like 'Results in 24–48 hrs' if you cannot reliably deliver that across states and volume.
- Add required legal pages and link them everywhere: Privacy Policy, Terms of Service, Telehealth Consent, Notice of Privacy Practices (if applicable).
- Add GLP-1 safety, eligibility, and compounded medication disclosures (and ensure marketing claims are compliant).
- Hide alternative landing pages from the main navigation; use them as campaign pages only.
# 3. What Should Replace the Current 'Shop' Model
For GLP-1 programs, avoid a retail catalog vibe. Instead, present a program with plan tiers, transparent pricing, and a physician-led workflow. If you sell add-ons (labs, coaching, supplements), position them as supportive options within a plan, not the core product.
# 4. Proposed Sitemap for Nume (Public + Patient Portal)
Public marketing pages (top nav):
- Home (GLP-1 program value prop + Start Assessment)
- How it Works (steps + what happens after you apply)
- Pricing (transparent plan tiers + what's included)
- Eligibility (who qualifies, contraindications, states served)
- Safety (side effects, monitoring, dosing, what to expect)
- Reviews (outcomes + patient stories + trust signals)
- About (mission, clinical standards, pharmacy partnership approach)
- FAQ (coverage, shipping, cancellations, refills, labs)
- Blog/Guides (evergreen SEO: nutrition, GLP-1 education, plateaus)
- Support (Help Center + Contact)
Patient portal (requires login):
- Dashboard (plan status, next steps, refill date, messages)
- Visit timeline (intake, provider review, follow-ups)
- Messaging (secure chat with care team)
- Medication & dosing (current dose, instructions, education)
- Orders & shipping (tracking, history, address)
- Billing (payments, invoices, receipts, plan changes)
- Profile (identity, allergies, meds, labs, consents)
# 5. Key UX / Conversion Recommendations
- One primary CTA everywhere: Start Assessment (sticky header CTA on mobile).
- Assessment should be multi-step with progress indicator; allow save-and-resume.
- Add trust blocks above the fold: clinician review, privacy, pharmacy standards, support.
- Pricing transparency early. Most competitors convert better when pricing isn't hidden.
- Add social proof: outcomes, reviews, and clinician credibility (names, credentials, states).
- Reduce friction: clear refund/cancel policy, shipping time expectations, and what happens if not approved.
# 6. Compliance & Risk Notes (GLP-1 + Compounding)
Given current regulatory scrutiny of compounded GLP-1 marketing, ensure the site avoids risky claims and clearly explains what is and is not FDA-approved. Your copy should distinguish between FDA-approved branded options vs compounded preparations, and should never imply compounded meds are FDA-approved.
- No 'miracle' or superiority claims (weight loss results vary; avoid lifestyle benefit claims).
- Clear patient education on dosing and injection technique; include safety warnings and contraindications.
- Include state coverage and prescribing limitations up front.
- Display compounded medication disclosure where relevant (e.g., product pages, checkout, consent).
# 7. Analytics & Technical Requirements
- Event tracking: StartAssessment, AssessmentStepCompleted, AssessmentSubmitted, Approval, AddToCart/PlanSelect, CheckoutStarted, Purchase, RefillRequested.
- SEO basics: unique titles/meta descriptions per page, schema (FAQPage, Organization), clean URLs, XML sitemap, robots.txt.
- Performance: optimize hero images, defer non-critical JS, hit Core Web Vitals targets.
- Accessibility: form labels, focus states, keyboard nav, color contrast.
# 8. Page-by-Page Actions
| Area | Current issue | Recommendation |
| --- | --- | --- |
| Home | Generic telehealth copy; HIPAA claim | Rewrite for GLP-1 program; add trust, pricing teaser, compliant language |
| Landing 2/3 | Exposed in main nav; placeholder claims | Remove from nav; use as campaign pages only; rewrite per campaign |
| Assessment | Too broad; minimal consent | Multi-step GLP-1 intake + consents + ID verification + save/resume |
| Shop/Product | Retail supplement catalog | Replace with plan selection + program details; keep add-ons secondary |
| Cart/Checkout | Demo text; missing legal/compliance | Real payments; show disclosures; clear cancellation/refund policy |
| Account pages | Template UI | Integrate patient portal flows; enforce secure auth; MFA optional |
| Contact | Visible dev instruction line | Remove dev note; route to ticketing/CRM; add response-time expectations |
| Recommendations | Internal table instructions visible | Move to admin-only subpath or remove from production |
