/**
 * Canonical schema — B2B partner-physician (e.g. mythic-rx.com)
 * ------------------------------------------------------------------
 * Drop into a site repo at `assets/js/landing-config.js`.
 * Replace `<SITE_BRAND_PREFIX>` with the site's existing brand-prefixed
 * config name (e.g. MRX_CONFIG). Both names alias the same object so
 * the shared renderer reads `SITE_CONFIG` while DevTools-friendly
 * debugging remains under the brand prefix.
 *
 * Anything left as `[CLIENT TO CONFIRM]` will render as a yellow
 * placeholder on every page that binds to it.
 *
 * NOTE — This is a B2B site. The audience is partner physicians and
 * clinic operators, not patients. Do NOT add patient-pricing fields,
 * patient-targeted CTAs, or patient testimonials here.
 */
window.SITE_CONFIG = window.<SITE_BRAND_PREFIX> = {

  /* ---------- Brand ---------- */
  brand: {
    name: "[CLIENT TO CONFIRM]",
    domain: "[CLIENT TO CONFIRM]",
    partnerSupportEmail: "[CLIENT TO CONFIRM]",
    partnerSupportPhone: "[CLIENT TO CONFIRM]",
    partnerSupportHours: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Partnership program ---------- */
  partnership: {
    audience: "Independent and group-practice physicians, NPs, PAs",
    propositionShort: "[CLIENT TO CONFIRM]",      // 1-line value prop
    onboardingTimeline: "[CLIENT TO CONFIRM]",    // e.g. "Most clinics fully onboarded in 7–10 business days"
    feeStructureSummary: "[CLIENT TO CONFIRM]",   // public-safe summary; full schedule under NDA
    whiteLabelAvailable: null,                    // true | false | null
    referralModel: "[CLIENT TO CONFIRM]"          // e.g. "Co-managed prescribing", "Direct fulfillment", "Referral-only"
  },

  /* ---------- Formulary ---------- */
  formulary: {
    categories: [],                               // ["Weight care (GLP-1)", "Hormone health", ...]
    medications: [],                              // [{ name, category, indication, fulfillmentNote }]
    formularyRequestUrl: "[CLIENT TO CONFIRM]"    // gated PDF / form URL
  },

  /* ---------- Clinical governance ---------- */
  clinical: {
    medicalDirector: "[CLIENT TO CONFIRM]",       // named clinical lead with credentials
    clinicalAdvisoryNote: "[CLIENT TO CONFIRM]",  // 1–2 sentence governance description
    pharmacyPartners: "[CLIENT TO CONFIRM]",      // licensure-attested description
    statesLicensed: ["[CLIENT TO CONFIRM]"],      // states where this site can fulfill
    intakeSLA: "[CLIENT TO CONFIRM]",
    fulfillmentSLA: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Integrations ---------- */
  integrations: {
    emrIntegrations: [],                          // ["EMR1","EMR2"] or [] if none yet
    apiAvailable: null,                           // true | false | null
    integrationContact: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Legal / compliance surface ---------- */
  legal: {
    baaProvided: null,                            // true | false | null — BAA on partner agreement
    partnerAgreementUrl: "[CLIENT TO CONFIRM]",   // gated link
    privacyPolicyUrl: "/privacy.html",
    termsUrl: "/terms.html",
    hipaaContact: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Trust / proof ---------- */
  trust: {
    /* Partner-relevant only. Examples: "HIPAA-aligned", "Licensed pharmacy
       partners", "Named medical director", "Peer-reviewed evidence". */
    badges: [],
    /* Anonymized, with consent only. Patient-identifying details forbidden. */
    caseStudies: [],                              // [{ practiceType, region, outcomeShort }]
    /* Press / publications mentioning the partner program (HCP-relevant). */
    pressMentions: []                             // [{ outlet, headline, url }]
  },

  /* ---------- Disclosures (counsel-approved) ---------- */
  disclosures: {
    offLabelClaim: "[CLIENT TO CONFIRM]",
    notMedicalAdvice: "[CLIENT TO CONFIRM]",
    compoundedMedication: "[CLIENT TO CONFIRM]",
    safetyShort: "[CLIENT TO CONFIRM]"
  },

  /* ---------- Page-level copy overrides ---------- */
  pages: {
    home: {
      eyebrow: "Partner program",
      h1: "[CLIENT TO CONFIRM]",
      subhead: "[CLIENT TO CONFIRM]",
      ctaPrimary: "Become a partner",
      ctaSecondary: "Request formulary"
    },
    partners: {
      eyebrow: "For physicians",
      h1: "[CLIENT TO CONFIRM]",
      subhead: "[CLIENT TO CONFIRM]",
      ctaPrimary: "Schedule a consult"
    },
    formulary: {
      eyebrow: "Formulary",
      h1: "[CLIENT TO CONFIRM]",
      subhead: "[CLIENT TO CONFIRM]"
    },
    becomePartner: {
      eyebrow: "Onboarding",
      h1: "[CLIENT TO CONFIRM]",
      subhead: "[CLIENT TO CONFIRM]",
      ctaPrimary: "Start onboarding"
    },
    contact: {
      eyebrow: "Contact",
      h1: "[CLIENT TO CONFIRM]",
      subhead: "[CLIENT TO CONFIRM]"
    }
  }
};
