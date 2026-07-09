/**
 * Canonical schema — DTC patient-acquisition (e.g. nume-health.com)
 * ------------------------------------------------------------------
 * Drop into a site repo at `assets/js/landing-config.js`.
 * Replace `<SITE_BRAND_PREFIX>` with the site's existing brand-prefixed
 * config name (e.g. NUME_CONFIG). Both names alias the same object so
 * the shared renderer reads `SITE_CONFIG` while DevTools-friendly
 * debugging remains under the brand prefix.
 *
 * Anything left as `[CLIENT TO CONFIRM]` will render as a yellow
 * placeholder on every page that binds to it.
 */
window.SITE_CONFIG = window.<SITE_BRAND_PREFIX> = {

  /* ---------- Brand ---------- */
  brand: {
    name: "[CLIENT TO CONFIRM]",
    domain: "[CLIENT TO CONFIRM]",
    supportEmail: "[CLIENT TO CONFIRM]",
    supportPhone: "[CLIENT TO CONFIRM]",
    supportHours: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Base product (start with one) ---------- */
  product: {
    label: "Base plan",
    publicName: "[CLIENT TO CONFIRM]",
    medication: "[CLIENT TO CONFIRM]",
    monthlyPrice: "[CLIENT TO CONFIRM]",
    annualMonthlyPrice: null,
    firstMonthPrice: null,
    included: ["[CLIENT TO CONFIRM]"],
    refillCadence: "[CLIENT TO CONFIRM]",
    cancellation: "[CLIENT TO CONFIRM]",
    refund: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Optional second product ---------- */
  product2: null,

  /* ---------- Service availability ---------- */
  states: {
    served: ["[CLIENT TO CONFIRM]"],
    notServedNote: "If your state isn't currently supported, we'll let you know before charging anything."
  },

  /* ---------- Operations / clinical ---------- */
  clinical: {
    prescribingEntity: "[CLIENT TO CONFIRM]",
    providerNetwork: "[CLIENT TO CONFIRM]",
    pharmacyPartners: "[CLIENT TO CONFIRM]",
    labRequirement: "[CLIENT TO CONFIRM]",
    intakeSLA: "[CLIENT TO CONFIRM]",
    shippingSLA: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Trust / social proof ---------- */
  trust: {
    badges: [
      "Licensed U.S. providers",
      "U.S.-licensed pharmacy partners",
      "Secure & private intake",
      "No insurance required"
    ],
    /* Approved testimonials only. Each must have written consent on file
       with this site's legal entity. Consent is per-entity — never copy
       testimonials from a sister site. */
    testimonials: []
  },

  /* ---------- Disclosure copy (legal-reviewed before launch) ---------- */
  disclosures: {
    compoundedMedication: "[CLIENT TO CONFIRM]",
    prescriptionNotGuaranteed: "[CLIENT TO CONFIRM]",
    safetyShort: "[CLIENT TO CONFIRM]",
    privacyPolicyUrl: "/privacy.html",
    termsUrl: "/terms.html",
    telehealthConsentUrl: "/telehealth-consent.html",
    consumerHealthDataUrl: "/consumer-health-data.html"
  },

  /* ---------- Page-level copy overrides ---------- */
  pages: {
    cashPay: {
      eyebrow: "Cash-pay",
      h1: "Clinician-guided care, online.",
      subhead:
        "Start with a private eligibility assessment. Cash-pay prescription treatment options may be available after licensed provider review. No insurance required.",
      ctaPrimary: "See if I qualify",
      ctaSecondary: "View pricing"
    },
    pricing: {
      eyebrow: "Transparent pricing",
      h1: "One simple cash-pay plan.",
      subhead:
        "Provider review, medication if prescribed, supplies, shipping, and ongoing support — bundled into one monthly price."
    },
    weightCareOnline: {
      eyebrow: "Online weight-care",
      h1: "Online weight-care, reviewed by a licensed clinician.",
      subhead:
        "An education-first program. We help you understand options, confirm eligibility, and connect you to a provider who will determine whether treatment is appropriate."
    },
    switchProvider: {
      eyebrow: "Switching providers",
      h1: "Continue your plan with a new provider.",
      subhead:
        "Already in care? Share your history and we'll have a licensed clinician review your continuation plan."
    },
    faq: {
      eyebrow: "FAQs",
      h1: "Common questions about cash-pay care."
    }
  }
};
