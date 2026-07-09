/**
 * nume-health.com – central page registry.
 *
 * `public: true` controls whether the page appears in the main public
 * navigation dropdown ("More"). Pages without `public: true` are still
 * available by direct URL (and listed in the recommendations form's
 * page selector) but kept out of the consumer-facing menu.
 *
 * Add new pages here; the nav and the recommendations form pick them
 * up automatically (see assets/js/site-nav.js).
 */
window.SITE_PAGES = [
  { label: 'Home',                        url: 'index.html',                  public: true,  primary: true  },
  { label: 'Plans',                       url: 'shop.html',                   public: true  },
  { label: 'Pricing',                     url: 'glp1-pricing.html',           public: true  },
  { label: 'Eligibility',                 url: 'assessment.html',             public: true  },
  { label: 'FAQ',                         url: 'glp1-faq.html',               public: true  },
  { label: 'Contact',                     url: 'contact.html',                public: true  },

  /* --- Account (kept available, not in main More dropdown) --- */
  { label: 'Login',                       url: 'login.html'                   },
  { label: 'Register',                    url: 'register.html'                },
  { label: 'Reset password',              url: 'reset-password.html'         },
  { label: 'Thank you',                   url: 'thank-you.html'              },

  /* --- Paid-traffic landing pages (not in main nav; reached via ad URLs) --- */
  { label: 'Cash-pay GLP-1 (campaign)',   url: 'glp1-cash-pay.html'           },
  { label: 'Online weight-care (social)', url: 'weight-care-online.html'      },
  { label: 'Switch GLP-1 provider',       url: 'switch-glp1-provider.html'    },

  /* --- Plan detail (legacy, soft-redirected to pricing) --- */
  { label: 'Plan detail',                 url: 'shop-details.html'            },

  /* --- Internal tooling (not for public nav) --- */
  { label: 'Client feedback (internal)',  url: 'Client_Feedback.html'         },
  { label: 'Client onboarding (internal)',url: 'Client_Onboarding.html'       },
  { label: 'Marketing tracker (internal)',url: 'Marketing_Next_Steps.html'    },
  { label: 'Color recs (internal)',       url: 'Update_Colors.html'           },
  { label: 'Image picker (internal)',     url: 'ImageSelection.html'          },
  { label: 'Recommendations (internal)',  url: 'recommendations.html'         }
];
