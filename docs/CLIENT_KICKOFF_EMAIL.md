# Client kickoff email — GLP-1 cash-pay launch

Copy everything inside the box below into your mail client. Fill in `[Name]`, `[date]`, and your sign-off. Do not paste the markdown headers or the internal notes at the bottom.

---

## Mail headers

| | |
|---|---|
| **Subject** | Nume site is up — need your inputs before we run ads |
| **To** | [Primary contact name] |
| **Cc** | Clinical ops, marketing/finance, legal/compliance (whoever owns each on their side) |

---

## Copy from here ↓

```
Hi [Name],

The GLP-1 site is live in staging — you can click around here:
https://nume-health.com/

Pricing and a few other spots still say "confirm with client" on purpose. Those clear out once you fill in the onboarding form.

We're not turning on paid traffic until counsel and your clinical team sign off. This note is mostly what we need from you to get there.


ONBOARDING (start here — ~30–45 min if you have the numbers handy)
https://nume-health.com/Client_Onboarding.html

That form feeds every landing page. When you're done, click Save to server, add your name, and a one-line note (e.g. "confirmed pricing + FL/TX states"). One save updates the whole site.


FEEDBACK (everything else — copy tweaks, bugs, questions)
https://nume-health.com/Client_Feedback.html

Use this so requests don't get lost in email threads. Title + your name + a sentence on what you want changed is enough.

Optional launch checklist (big picture, not required to start):
https://nume-health.com/Marketing_Next_Steps.html


WHO SHOULD FILL IN WHAT

• Ops / clinical — prescribing entity, pharmacy partners, states you serve, intake and shipping timelines
• Marketing / finance — plan name, monthly price, what's included, cancel/refund language
• Legal — skim the disclosure text in onboarding; we used audit-safe defaults, change only if counsel gives you different wording

Please hold off on patient testimonials until consent and compensation disclosure are on file.


THREE THINGS STILL BLOCKING LAUNCH (on your side)

1. Counsel review of claims, pricing, and disclosures
2. Status on Google Healthcare Merchant / LegitScript
3. Clinical sign-off on entity, provider network, and pharmacy list

Reply to this thread with a sentence on each when you have an update — no formal memo needed.


COPY REMINDER

Plain, clinical, cash-pay transparent. Skip brand-drug nicknames ("generic Ozempic"), guaranteed approval language, and fast-weight-loss hooks. If you're unsure about wording, drop it on the feedback board and we'll take a look.


TIMELINE

If we can get a first complete onboarding save back by [date], we'll sweep the site for leftover placeholders and send you a short QA list.


PAGES WORTH A QUICK LOOK

• Home — https://nume-health.com/
• Pricing — https://nume-health.com/glp1-pricing.html
• Eligibility quiz — https://nume-health.com/assessment.html
• FAQ — https://nume-health.com/glp1-faq.html

Let me know if any of the links don't load on your end — we've seen DNS issues on some networks.


[Your name]
```

---

## Before you send

- Replace `[Name]`, `[date]`, and `[Your name]`.
- Remove the section labels in ALL CAPS if they feel too formal for your client — or leave them; they paste as plain text and scan well in a long email.
- Do not attach markdown, tables, or bullet symbols from this file's outer sections.

---

## Internal notes (do not send)

- Site root: `sites/nume-health.com/`
- Onboarding → `sites/nume-health.com/api/landing-config.php` → `assets/js/landing-config.js`
- Feedback → `sites/nume-health.com/api/feedback.php` → `assets/configs/feedback.json`
- Both internal pages: `noindex,nofollow`
- Optional server auth: env var `NUME_API_TOKEN`
