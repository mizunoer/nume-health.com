# Proposal: Mythic-RX 503A + DOPL compliance gates

**Date:** 2026-05-22  
**Site:** mythic-rx.com  
**Target:** `per-site/mythic-rx/COMPLIANCE_GATES.md`, `Marketing_Next_Steps.template.html` hard-gate boilerplate

## Summary

Document that Mythic-RX is a **503A compounding pharmacy** with **Utah DOPL** as home-state regulator, and that all partner-facing copy flows through **healthcare counsel** before gates clear.

## Proposed changes to `COMPLIANCE_GATES.md`

1. Add opening paragraph:

> Mythic-RX operates as a **503A compounding pharmacy** serving partner clinics and prescribers (B2B). Primary pharmacy licensure is through the **Utah Division of Professional Licensing (DOPL)**. Multi-state fulfillment requires independent attestation per state—not inferred from Utah status alone.

2. Merge/clarify licensing gate row:

| Gate | Owner |
|---|---|
| Utah DOPL pharmacy license current; per-state licensure list confirmed for every fulfillment state | Client / ops + counsel |

3. Add workflow note under **Hard rules**:

> Counsel review is the decision-of-record for all partner claims, disclosures, BAA/partner agreements, and public licensure language. Engineering placeholders (`[CLIENT TO CONFIRM]`) are not approved copy.

## Already implemented in Mythic-RX repo

- `docs/COMPLIANCE_NOTES.md`
- `Marketing_Next_Steps.html` callouts + gate wording
- `assets/js/landing-config.js` — `clinical.pharmacyDesignation`, counsel comments
- `Client_Onboarding.html` Section 6 hint

## Approval

- [ ] Operator accepts proposal
- [ ] Land in `per-site/mythic-rx/COMPLIANCE_GATES.md` on next shared-folder sync
