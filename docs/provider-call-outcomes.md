# Provider call outcomes — Kara (2026-07-21)

Source: viaim recording (54 min). Facts below are from the transcript, not the auto-summary.

## What Kara told us (the Hims & Hers model, firsthand)

### Economics
- 1099, zero benefits, at-will login. **Hims carries malpractice** for platform encounters. Hims did **not** pay for state licenses (her other telehealth employer did).
- Pay is really **per script signed, not per task**: 7–8 scripts/hour ≈ ~$100/hr pre-tax. Volume bonuses (~$25–50 extra per task after ~25 tasks) and "high volume, please hop on" promos.
- **Task mix decides viability**: weight loss was ~90% side-effect tasks (low pay) → she quit weight loss after 3–4 months. Sexual health is 70–80% prescription tasks → she stayed.

### Workflow
- Task queue: log in whenever, "next task" pops the oldest intake; provider reviews the whole intake; suggested treatment + starting dose pre-queued; ~3 titration schedule options; one click to approve.
- Follow-ups auto-generated (auto-renew unless the patient cancels); check-in questionnaires routed to whichever provider is in the queue — **continuity is random** (algorithm briefly prefers the original provider, then moves on).
- Red flags: BMI auto-flagged; some (not all) med interactions flagged — provider must still catch the rest.
- Escalation: a lead provider takes deferrals (rare — 1 or 2 ever); a separate admin/support team handles billing/IT/patient messages providers flag.
- Provider tooling is a **website** (own EMR, guidelines, training videos); the app is patient-only.
- Video visits are state-dependent; Utah requires none. She elected only no-video states on Hims, but does video for initial visits on her own license.

### Product/clinical advice
- **Skip the oral kits** (Wellbutrin/topiramate — "horrendous" side effects); semaglutide is manageable. **Hims doesn't offer tirzepatide** — we do → differentiator.
- Side effects (not platform features) are the main churn driver in weight loss.
- Labs: Hims dropped BP/lab requirements — made her uncomfortable; she wants the info but knows requiring labs shrinks the funnel.
- Top three intake fields: **past medical history, medications, allergies**; bold/highlight red flags (interactions, allergy inconsistencies).
- What she needs most: **autonomy to not prescribe** without revenue pressure.

### Portal feedback (she saw the live demo)
- One-page-per-appointment layout validated.
- **Follow-up visits: show chief complaint + updated info first** (not the full intake). **Initial consults: full intake.**
- Wants **patient history click-through** from the appointment (previous encounters/intakes/notes).
- Task/subtask nomenclature (appointments → tasks → subtasks: intake review, prescription review, flagged conditions) landed well.

## Commitments made on the call

1. Send Kara a **login** to walk the provider portal; she'll give critical feedback **free** (offered pay; she declined for now).
2. Send Kara the **GLP price list** ("extremely competitive") — she'll spread the word.
3. **Sean → Kara email** connection.
4. Invite her as an **initial provider** for the first small campaigns (couple hours at a time).
5. Timeline shared: LegitScript demo in **~3–3.5 weeks** → approval window → **launch 1–2 weeks after**. Ads: digital-first (Instagram strongest); TV lead-gen explored later.

## Build actions (added to deliverables)

- [x] Fix brand misspelling in the demo header (Numi → **Nume Health**) — caught live on the call.
- [x] Follow-up vs initial appointment views: chief-complaint-first check-in card for follow-ups; full intake for initials *(demo, 7dc47cd)*.
- [x] Patient history click-through from appointment *(demo: Patient history button → chart with nested appointments/Rx/allergies/conditions)*.
- [x] Red-flag engine *(demo: auto-computed severe allergies, chart-vs-intake inconsistency, GLP-1 comorbidities, pregnancy screen)*.
- [x] Complete the intake questionnaire content *(demo: + height/weight/BMI, pregnancy status, prior attempts)*.
- [x] Task/subtask nomenclature *(demo: Tasks card — appointments → tasks → subtasks with open/done)*.
- [x] Comorbidity highlights *(demo: E66/E11 flags)*.
- [ ] Provider comp model: per-script base with fair pay on side-effect-heavy mixes (the reason she quit Hims weight loss).
- [ ] Continuity option: patient chooses same-provider vs first-available; provider schedule edits lock until booked appointments lapse.
- [ ] Labs routing: flagged intake answers → request labs/PCP records instead of auto-disqualifying.
- [ ] Product config: no oral kits; tirzepatide on the menu.
- [ ] Provider login flow + demo credentials for Kara (blocked on the production push / login work).

## Auto-summary accuracy audit (process check)

The viaim summary is **directionally accurate — no fabrications found** — but it consistently drops the quantitative and Q&A specifics:

| Missed/glossed by the summary | Why it matters |
|---|---|
| All compensation numbers (7–8 scripts/hr ≈ $100/hr, bonus amounts, tiering) | The provider economics model |
| **Malpractice: Hims covers it** (direct answer to a prepared question) | Provider offer design |
| Hims does **not** pay for state licenses | Provider offer design |
| Sexual health 70–80% scripts vs weight loss 90% side-effect tasks (numbers) | The task-mix insight loses its teeth without them |
| "Skip oral kits" + **Hims lacks tirzepatide** | Product strategy, differentiator |
| Side effects = churn driver | Retention modeling |
| Provider tool is a website; app is patient-only; training videos exist | Portal scope |
| Her concrete IA feedback (chief-complaint-first follow-ups, history click-through) | Direct build actions |
| The brand misspelling catch | Our own action item |
| Ad channels (Instagram-first, TV later) | Marketing plan |

**Verdict:** trust the summaries for structure and to-dos; pull the transcript whenever numbers, direct answers to prepared questions, or product commitments matter. (Share links also expire in 7 days — archive transcripts you care about.)

---

# Owners follow-up call (2026-07-21, after Kara)

## Timelines stated

| When | What |
|---|---|
| **Tonight** | Dev changes push to production; DJ notifies owners when live |
| **End of next week** | Website production-ready (landing pages + insurance components); devs then shift to bugs/special-requests only |
| **Week after the production push** | Login portal + health record modules continue |
| **Now** | LegitScript application submitted (DJ has Nico's NPI/address/email) |
| **After DJ talks to devs** | Simplified marketing-setup question list → schedule next owners call |

## DJ committed to

1. Submit LegitScript (verify nothing missing beyond Nico's info).
2. Ask around: malpractice/E&O requirements, enrollment+disenrollment rules, what credentialing data lowers platform liability rates.
3. Finish provider enrollment screen — require + verify malpractice insurance; keep required compliance checks (NPI, OCR-list check, license validity); other questions org-editable on the fly.
4. Pharmacy + pharmacist + pharmacy-tech enrollment screens, prefilled from Pioneer data.
5. 1099 independent-provider enrollment materials.
6. Find out (via buddies on Ro-style platforms) whether scripts are clinic-branded or generic-to-provider; plan: patient portal shows fulfilled script + info page / packing list, or digital-only if opted in.
7. Send owners: rebranded portal link (Mythic → NuMe), portal demo link, brand options for Mythic RX (designer's rebrand offer accepted — Sean not attached to current brand).
8. Add TikTok to the channel list (likely easier approval than Meta/Google; Sarah has a large following) — pending Shannon's check on GLP visibility there.
9. Marketing email as the credential account for TikTok/Google/Meta; auto-handlers for spend-limit/routine notices; route billing→accounting, info→info.
10. Harden site/URLs; DMARC records for marketing domains at DNS cutover.
11. Simplify the 20-page feedback form into a focused question list.
12. Send enrollment links to pilot participants (everyone talked to so far; Caleb can add more).
13. Consider Kara consulting on the whole platform (owners floated part-ownership for veteran-owned government-contracting angle).

## Needed FROM the owners (reminder-email list)

1. **Sean:** resend the current price list; send it to Kara and cc DJ.
2. **Sean:** resend pharmacy credentials — Sarah's pharmacist NPI + license number(s) (+ controlled-substance license if separate), pharmacy DEA registration — for prefilling enrollment screens.
3. **Sean:** the still-unsent portal feedback.
4. **Sean:** Kara's email address (per first call) so DJ can reach out with the login.
5. **Caleb/Sean:** talk to an insurance contact — what credentialing evidence lowers liability premiums; typical malpractice cost in this discipline; confirm require-own-insurance stance at launch (offer-as-perk later).
6. **Caleb/Sean:** does the marketing email exist? If not, create it (it becomes the credential account for all ad platforms).
7. **Caleb:** ask Shannon whether GLP content/ads are currently visible on TikTok (post-restriction status).
8. **Both:** website feedback after tonight's production push; names of any additional pilot participants.

## Highest-volume testing guidance (for QA priorities)

Pharmacy techs live in the portal most (fulfillment + patient questions). Clean questionnaire answers → tech task is a button click; physicians touch only side effects. Highest question volume: membership billing, cancellations, side effects. Test those paths first.
