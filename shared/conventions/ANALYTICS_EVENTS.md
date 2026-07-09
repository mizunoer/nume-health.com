# Analytics events (canonical)

The renderer's tracking function (`window.siteTrack`) is intentionally minimal. It accepts a single string argument — the event name — and forwards it to `gtag` and `fbq` if either is present. No second argument exists. No object payloads exist. **By design.**

## Why

A static landing page does not have a way to know whether a value it would attach to an event constitutes PHI (for the DTC site) or partner-clinic identity (for the B2B site). The system is run for non-technical operators. The cheapest way to keep both sites compliant by default is to remove the option of attaching a payload.

If a richer event taxonomy is needed (e.g. quiz step number, partner intake stage), implement it as a **dedicated event name**, not as a `(event, payload)` pair.

## Canonical event names

Every site uses the same names where the events overlap. Brand-prefixed event names are forbidden — analytics rollups across both sites depend on shared names.

### Universal (every page on every site)

| Event | Fires when |
|---|---|
| `page_view` | Renderer initializes (every page load) |
| `cta_click` | Generic CTA click — used as a default for `data-track="cta_click"` |

### Hero / header CTAs

| Event | Fires when |
|---|---|
| `cta_click_header` | Header CTA click |
| `cta_click_hero` | Hero primary CTA |
| `cta_click_pricing` | Hero secondary CTA that scrolls to pricing / formulary |

### Conversion funnels (per audience)

DTC (Nume):

| Event | Fires when |
|---|---|
| `quiz_started` | Patient eligibility quiz first interaction |
| `quiz_step_completed` | Patient eligibility quiz step submission (no step number, no answers) |
| `quiz_completed` | Patient eligibility quiz submission |
| `eligibility_submitted` | After quiz, lead capture submitted |

B2B (Mythic-RX):

| Event | Fires when |
|---|---|
| `partner_intake_started` | Partner intake first interaction |
| `partner_intake_step_completed` | Partner intake step submission (no step number, no answers) |
| `partner_intake_completed` | Partner intake submission |
| `formulary_request` | Gated formulary request submitted |
| `demo_requested` | Demo / consult request submitted |

### Internal tools (Client_Onboarding, Marketing_Next_Steps)

These pages are internal and should not fire analytics. Do not add `data-track` attributes inside them.

## Hard rules

1. **Event name only.** No second argument, no payload object, no per-event metadata.
2. **No PHI.** The DTC site never includes BMI, condition, medication, pregnancy status, dose, or symptom data in any event name or attribute.
3. **No clinic identity.** The B2B site never includes partner clinic NPI, partner name, EIN, EMR, license number, or contract value in any event name or attribute.
4. **No PII.** No email, no phone, no IP, no device ID handed to `siteTrack`. The downstream tracker (gtag/fbq) collects ambient PII by default — that's their concern, governed by your consent banner and data-processing agreements, not ours.
5. **Names are snake_case.** Lowercase letters, digits, underscores. No hyphens, no camelCase, no spaces.
6. **Names are stable.** Renaming an event invalidates historical funnels. Add new events instead of renaming.

## Adding a new event

When a site needs a new event:

1. Confirm the event name is generic (no PHI, no clinic identity).
2. Confirm the same event name will work for the sister site (same audience-agnostic name).
3. File a proposal in `proposals/` (see `SYNC_PROTOCOL.md`).
4. On approval, add the row to this document under the appropriate section.
5. Both sites adopt at their next sync cycle — even if only one site emits the event today.

## What lives in GA4 / Meta config, not here

Conversion goals, funnel definitions, audience segments, and consent-mode wiring are configured in the GA4 / Meta admin interfaces, not in this code. The only contract this folder owns is the **event names** the page emits.
