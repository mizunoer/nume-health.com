# nume-health.com — compliance gates (DTC GLP-1 cash-pay)

These are the hard launch gates Nume must clear before any landing page goes live to paid traffic. Mirrored in `Marketing_Next_Steps.html` Section 2.

## Blocking gates (default `pill-blocked`)

| Gate | Owner |
|---|---|
| Healthcare counsel review of all landing-page claims and disclosures | Client / counsel |
| LegitScript / Google Healthcare Merchant Certification | Client |
| Compounded-medication disclosure approved | Client / counsel |
| Prescribing entity, network, pharmacy partners confirmed | Client |

## Awaiting client (default `pill-client`)

| Gate | Owner |
|---|---|
| State availability list confirmed | Client |
| Privacy policy / consumer health data policy / TOS / telehealth consent live | Client / counsel |
| Refund & cancellation policy documented | Client |
| Tracking events confirmed PHI-free with privacy counsel | Client / counsel |

## Promotion path

Each gate moves: `pill-blocked` → `pill-prog` (counsel actively reviewing) → `pill-done` (cleared). For client-deliverable gates: `pill-client` → `pill-prog` (drafted, in review) → `pill-done`.

## Hard rule

A page that depends on any unfiled disclosure or any uncleared certification stays gated even if every other piece of the system is ready. The action tracker's stat-card "compliance gates blocking" count must be **0** before paid traffic turns on.
