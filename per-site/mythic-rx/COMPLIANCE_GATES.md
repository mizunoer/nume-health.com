# mythic-rx.com — compliance gates (B2B partner-physician)

These are the hard launch gates Mythic-RX must clear before its partner-facing pages go live. Mirrored in Mythic-RX's `Marketing_Next_Steps.html` Section 2.

## Blocking gates (default `pill-blocked`)

| Gate | Owner |
|---|---|
| Healthcare counsel review of all partner-facing claims and off-label / compounded language | Client / counsel |
| Per-state pharmacy and clinician licensing list confirmed for every state Mythic-RX fulfills | Client |
| Business Associate Agreement (BAA) template approved + signing process documented | Client / counsel |
| Partner agreement / SOW template approved | Client / counsel |

## Awaiting client (default `pill-client`)

| Gate | Owner |
|---|---|
| Medical director appointed; clinical-governance language approved | Client |
| Privacy policy, terms, HIPAA notice, partner-data-handling policy live | Client / counsel |
| EMR integration security review (if any integrations are claimed) | Client |
| Marketing-claim substantiation file (peer-reviewed citations, fair-balance language) | Client / counsel |

## Promotion path

Each gate moves: `pill-blocked` → `pill-prog` (counsel actively reviewing, BAA in legal review, etc.) → `pill-done` (cleared). For client-deliverable gates: `pill-client` → `pill-prog` (drafted, in review) → `pill-done`.

## Hard rules

1. **None of these gates carry over from Nume.** Even where the work looks parallel (counsel review, state list confirmation), it must be done independently for Mythic-RX's separate legal and operational entity.
2. **A green pill on Nume is not evidence of progress on Mythic-RX.** The two trackers are independent.
3. **The action tracker's stat-card "compliance gates blocking" count must be 0** before any partner-facing page goes live to outreach. Inbound partner-portal demos can run earlier with appropriate gating, but public partner pages cannot.

## Why these differ from Nume's gates

Nume is targeting patients, so its gates are DTC ad-platform certifications and consumer-facing disclosures (LegitScript, Google Healthcare Merchant, Meta/TikTok ad approvals, consumer-health-data policy). Mythic-RX is targeting clinicians, so its gates are HIPAA-vendor and contractual artifacts (BAA, partner agreement, EMR integration security, marketing-claim substantiation). Same review concept; different review surface.
