# Sending and receiving medical records

_Drafted 2026-08-01. Companion to [`pioneer-integration-fieldmap.md`](pioneer-integration-fieldmap.md)
(the PioneerRx feed) and [`workshift-configuration-map.md`](workshift-configuration-map.md)._

**The one-sentence answer:** medical records move over three different rails depending on *what*
you are moving — **HL7 v2** for machine-to-machine clinical feeds (labs), **C-CDA over Direct**
for "here is this patient's chart" sent to another provider, and **FHIR R4** for API access
(patient apps, modern partners). Prescriptions are **not** medical records and do not use any of
these — they use NCPDP SCRIPT. Build one canonical internal model and treat every one of these as
an edge adapter.

---

## 1. First, the scoping that saves the most work

Three things are true about Nume/Mythic that eliminate large chunks of the standards landscape:

| | Consequence |
|---|---|
| **Cash-pay, no insurance billing** | X12 **837/835 are out of scope entirely.** No claims, no remittance. Do not build them. (270/271 eligibility only matters if you ever verify benefits; 278 prior-auth only if you bill.) |
| ~~GLP-1s are not controlled substances~~ **Testosterone and ketamine are Schedule III** | **EPCS IS required** — see §3a. This reverses an earlier assumption in this document. It is the single largest compliance item in the eRx build and it has a hard external deadline. |
| **Not an ONC-certified EHR** | You are not *obligated* to expose a FHIR API or meet USCDI. You may still choose to — but it is a business decision, not a compliance deadline. |

What is **not** optional: the HIPAA **Right of Access** — a patient can demand their record, and you
must produce it, in the form they request if you can readily produce it, within 30 days. That alone
requires a patient-facing export path (§5).

---

## 2. The rails, and what each is actually for

### HL7 v2.x — point-to-point clinical feeds
Pipe-delimited messages over **MLLP** (a TCP framing protocol), almost always across a VPN.
Every message gets an `MSA` acknowledgement. This is the workhorse of lab and hospital interfaces
and it is not going away.

| Message | Carries | Relevance here |
|---|---|---|
| `ORU^R01` | **Observation result** — lab results | **Primary inbound need.** A1c, CMP, lipids, TSH, hCG. |
| `ORM^O01` / `OML^O21` | Order | Outbound lab orders, if you order electronically |
| `ADT^A04/A08` | Demographics, encounters | Only if you interface with a facility |
| `RDE` / `RDS` | Pharmacy encoded order / dispense | Pioneer uses its own JSON instead — see §4 |
| `MDM^T02` | Document | Occasionally used to move a report |

**Shape** (an `ORU` result, trimmed):
```
MSH|^~\&|LABCORP|LAB|NUME|NUME|20260801120000||ORU^R01|MSG00001|P|2.5.1
PID|1||MRN12345^^^NUME^MR||DOE^JANE||19850214|F|||123 MAIN ST^^SLC^UT^84101
OBR|1||ACC9981|4548-4^Hemoglobin A1c^LN|||20260731080000
OBX|1|NM|4548-4^Hemoglobin A1c^LN||6.8|%|4.0-5.6|H|||F
```
The pieces that matter: **LOINC** codes identify the test (`4548-4`), the `H` flags abnormal, and
`F` means final (vs `P` preliminary or `C` corrected — **you must handle corrections**, they
overwrite a result a clinician may have already acted on).

### C-CDA — the actual "medical record" as a document
Consolidated CDA is XML. The document type you care about is the **CCD (Continuity of Care
Document)**: a patient summary containing problems, medications, allergies, results, vitals,
immunizations, procedures. When someone says "send me the records," a CCD is the standards-based
answer. Others exist (Referral Note, Discharge Summary, Progress Note).

The data elements a CCD is expected to contain are defined by **USCDI**. Even uncertified, USCDI is
the right checklist for "what belongs in a record export."

### Direct Secure Messaging — how a document gets there
S/MIME-encrypted messaging over the **DirectTrust** network. Addresses look like
`intake@direct.numehealth.com`. You get one from a **HISP** (Health Information Service Provider);
you do not build this. The HISP handles certificates, trust anchors, and delivery.

This is the pragmatic answer to "how do we send a patient's records to their PCP." It is push-based,
provider-to-provider, and universally accepted.

### FHIR R4 — the API rail
REST + JSON. Resources map cleanly to what Workshift already models:

| FHIR resource | Nume concept |
|---|---|
| `Patient` | Patient |
| `Condition` | diagnosis / problem |
| `MedicationRequest` | the prescription as *ordered* |
| `MedicationDispense` | the fill (Pioneer's RxEvents) |
| `Observation` | lab result, vitals, weight |
| `AllergyIntolerance` | allergy |
| `DocumentReference` | a stored PDF/CCD |
| `Encounter` | a visit |

**US Core** profiles constrain these for the US. `$everything` on a Patient and the Bulk Data
`$export` operation are the standard "give me the whole record" operations.

### Query networks — TEFCA / Carequality / CommonWell
These answer "find this patient's records anywhere in the country." You join through a vendor, not
directly. **TEFCA** (QHINs) is the federal framework; **Carequality** and **CommonWell** are the
established networks and now interoperate. Realistically: buy access if and when retrieving outside
history becomes a clinical requirement. It is a heavier lift than the other rails and is the one
most safely deferred.

---

## 3. Prescriptions are a separate world — do not conflate them

This is the correction worth being explicit about, because it changes what gets built.

**NCPDP SCRIPT** is the eRx standard — `NewRx`, `RxRenewalRequest`, `RxChangeRequest`, `CancelRx`,
`RxFill`, and `RxHistoryRequest` (medication history). It rides the **Surescripts** network in
practice. It is not HL7 and not interchangeable with it.

⚠️ **Version — build to 2023011, not 10.6 and not 2017071.** An earlier note in this project cited
SCRIPT **10.6**. That is a retired standard: CMS adopted 2017071 and retired 10.6 for Part D
effective **January 1, 2020** (rule CMS-4182-F), and the two are *not* fully backwards compatible.
But 2017071 is now itself on the way out — a 2024 CMS final rule opened a transition period on
**July 17, 2024** during which either version may be used, and requires **exclusive use of version
2023011 beginning January 1, 2028**, when 2017071 expires for HHS purposes.

Since Nume has not built eRx yet, there is no reason to implement 2017071 and then migrate inside
~17 months. **Target 2023011.**

_Nuance: these CMS mandates bind **Medicare Part D**, and Nume is cash-pay, so they do not apply to
Nume directly. They matter anyway because Surescripts and every pharmacy system follow them —
PioneerRx included. The network sets the version in practice, so verify the exact version against
current Surescripts certification before implementation (§7)._

Two related standards carry earlier deadlines if formulary/benefit features are ever added:
NCPDP **Formulary & Benefit v60** and **Real-Time Prescription Benefit v13**, both required from
**January 1, 2027**. Cash-pay makes these irrelevant today — noted only so they are not a surprise.

**NCPDP Telecom D.0** is the pharmacy *claim* standard (pharmacy ↔ PBM). Cash-pay ⇒ out of scope,
though PioneerRx will still surface claim structures in its feed because the software supports
insurance workflows generally.

## 3a. EPCS — required, and it reshapes the eRx build

Testosterone and ketamine are both **Schedule III**. Prescribing them electronically means
complying with **DEA 21 CFR Part 1311**, which is a different order of difficulty from ordinary
eRx. The requirements:

| Requirement | What it means in practice |
|---|---|
| **Identity proofing to NIST SP 800-63 IAL2** | Each prescriber is proofed before they can sign. Individual practitioners go through a CSP/certificate authority; institutional practitioners through the registrant's credentialing process. Not a form — a vetted identity event. |
| **Two-factor at the moment of signing** (§1311.115) | Two of know/have/are, re-authenticated for **each signing event** — not a session login. The "have" factor must be a separate hard token or a cryptographic device app. |
| **Two-person logical access control** | The person who grants signing privileges cannot be the person who uses them. Access-control changes are themselves signed with the two-factor credential. |
| **Third-party certification or audit of the application** | The EPCS application must be audited/certified against Part 1311 **before go-live**, and **re-certified every two years or on any change to EPCS functionality**. |
| **Signed, archived records + auditable events** | Digital signature on the prescription, retention, logged auditable events, and periodic review of controlled-substance logs. |

**The consequence for architecture: do not build EPCS into Workshift.** That last row is the
decisive one — a home-grown signing path would put Workshift itself into a recurring third-party
certification cycle, re-triggered by any change to that code. The standard move is to embed a
**certified EPCS module** (DrFirst, NewCrop, Veradigm, ScriptSure and similar) and let Workshift
own the chart, the queue, and fulfillment visibility while the certified component owns identity
proofing, token handling, signing, and its own audit. Workshift stores the *result* — prescription
record, status, audit references.

### ⏰ The date that actually constrains this
Under the **Ryan Haight Act**, prescribing a controlled substance via telemedicine normally
requires a prior in-person evaluation. The COVID-era flexibility waiving that has been extended
four times; the current extension runs **January 1 – December 31, 2026**. The DEA's Special
Registration for Telemedicine framework was proposed **January 17, 2025** and **has not been
finalized**.

So as of today (August 2026) a full-telehealth Schedule III program is permissible — but the
authority for it **expires December 31, 2026**, roughly five months out, and what replaces it is
unknown. Treat that as a planning constraint, not a background detail: verify the current status
before committing a launch date for testosterone or ketamine, and design the intake so an
in-person-evaluation requirement (or a special registration) can be switched on without a rebuild.

### Two more things specific to this formulary
- **PDMP checks.** Most states require querying the prescription drug monitoring program before
  prescribing a controlled substance. That is another integration (state PDMP or a gateway such as
  Bamboo Health), and it is a *precondition to prescribing*, so it belongs in the provider's
  encounter flow — not a back-office batch.
- **Compounded ketamine is a flagged area.** The FDA warned specifically about compounded ketamine
  in February 2022 (nasal spray) and again in **October 2023** covering sublingual/oral forms,
  calling out **telehealth platforms supplying it for at-home use without monitoring** for
  sedation, dissociation, and vital-sign changes. Ketamine is not FDA-approved for any psychiatric
  indication. Since Mythic is a 503A compounding pharmacy and Nume is a telehealth platform, this
  describes the exact configuration the FDA named. That is a clinical-protocol and legal question
  well before it is an engineering one — raise it with counsel early, and expect it to affect the
  LegitScript application currently in flight (adding controlled substances changes that posture;
  confirm with them rather than assuming the GLP-1-only analysis carries over).

_No online campaigns for these reduces ad-platform and marketing-review exposure — it does not
reduce any of the above. DEA, state, and FDA obligations attach to prescribing and dispensing,
not to advertising._

### Fulfillment visibility in the portal
The requirement that providers see **everything fulfilled in the portal** is well served by what is
already mapped: PioneerRx's RxEvents push is the fulfillment feed (see the field map), and
`InitiatingEventText` drives status transitions. Two additions for controlled substances:

1. Model fulfillment as `MedicationDispense` distinct from `MedicationRequest`, so "prescribed" and
   "dispensed" are never conflated — for a Schedule III that distinction is an audit artifact, not
   a UI nicety.
2. Give controlled-substance prescriptions their own **ResourceView** for each role. The same
   server-enforced minimum-necessary boundary described in §6 applies, and the audit expectations
   here are higher than for GLP-1s.

### The Nume → Mythic question
Because Nume prescribes and Mythic dispenses, there are two options:

1. **Through Surescripts** — the prescription is a normal, network-transmitted eRx. Cleanest for
   audit and provider credibility, and it works identically when a patient chooses an outside
   pharmacy. Requires enrollment and certification.
2. **Direct interface into PioneerRx** — lower friction, but it is a private integration between
   two related entities. It must still produce a legally valid prescription record, and it does not
   generalize to outside pharmacies.

Recommendation: **plan for Surescripts** as the real path and treat any direct Pioneer interface as
an interim optimization, not the architecture. A prescriber sending Rx only to the affiliated
pharmacy via a private channel invites both compliance questions and vendor lock-in.

---

## 4. Where PioneerRx actually sits

PioneerRx's RxEvents feed is **proprietary JSON, not HL7** (see the field map doc). That is fine —
but it means Pioneer is an *adapter*, not a standards rail. Conceptually its payload maps to:

- `Body.Patient` → `Patient`
- `Body.Rx` → `MedicationRequest` (as prescribed) + `MedicationDispense` (the fill)
- `Body.Claims[]` → out of scope (cash-pay)
- `Body.Prescribers[]` → `Practitioner`

Normalizing Pioneer into FHIR-shaped internal resources at ingest is what makes the record
exportable later. If Pioneer's JSON becomes the internal model, every future rail becomes a
bespoke translation from a vendor format.

---

## 5. What to actually build, in order

**Principle: one canonical internal model, adapters at every edge.** Model the internal record on
**FHIR R4 resource shapes** as Workshift ResourceTypes. Never let a wire format (HL7 pipes,
Pioneer JSON, CDA XML) *be* the internal model — you will get one of them, then be unable to speak
the others.

```
   HL7 v2 ORU  ─┐                                    ┌─→  C-CDA CCD  ──→ Direct (HISP)
   Pioneer JSON ─┼─→  [ adapter ]  →  Workshift  ──→ ─┼─→  FHIR R4 API
   NCPDP SCRIPT ─┘      (canonical, FHIR-shaped)      └─→  PDF (patient Right of Access)
```

| Order | Build | Why first |
|---|---|---|
| 1 | **Patient record export** — CCD + human-readable PDF | HIPAA Right of Access is a live obligation today. Nothing else is legally forcing. |
| 2 | **Lab results inbound** (`ORU^R01`, or a vendor API) | Clinically required to run a GLP-1 program safely. Handle `P`/`F`/`C` status and abnormal flags. |
| 3 | **Direct address via a HISP** | Unblocks sending records to any outside provider. Bought, not built — days, not months. |
| 4 | **eRx via NCPDP SCRIPT 2023011, with a certified EPCS module** | The real prescribing path; the interim Pioneer interface is technical debt until this exists. Build 2023011 directly — 2017071 expires Jan 1, 2028. **Select the EPCS vendor before designing the prescribing flow** (§3a) — it constrains identity, auth, and signing, so retrofitting it is a rewrite. Long lead time: identity-proof every prescriber, plus a Part 1311 certification before go-live. |
| 4b | **PDMP query in the encounter flow** | Required in most states before prescribing a controlled substance, and it gates the prescribe action rather than following it. |
| 5 | **FHIR R4 read API** | Enables partners and patient apps. Do it once the internal model has settled. |
| 6 | **Network query (TEFCA/Carequality)** | Highest cost, lowest immediate return. Defer deliberately. |

### Buy vs. build
Build the **adapters and the canonical model** — that is your product and it is where Workshift's
value is. Buy the **trust infrastructure**: HISP/Direct, Surescripts connectivity, and network
query access all require organizational identity proofing and certificate management that is not
worth reproducing. Vendors like Health Gorilla, Redox, Metriport, or Particle sit in front of
several of these rails at once and are worth pricing before committing to any direct interface.

---

## 6. How this lands in Workshift specifically

Workshift already has the two primitives this needs:

**ResourceTypes as the canonical model.** Add the FHIR-shaped types the exchange rails require —
`Practitioner`, `Observation` (lab result), `DocumentReference`, `Encounter` — alongside the
existing Patient/Prescription/Allergy/Condition. Key every externally-sourced record by its source
identifier (the Pioneer GUID pattern already established) so ingest is idempotent.

**ResourceViews as the minimum-necessary boundary.** This matters more here than anywhere else in
the system. Records exchange is exactly where over-disclosure happens, and Workshift enforces view
scoping **server-side** — attributes absent from a view's `display_settings` never leave the API,
and enforcement fails closed. So:

- a **patient export view** exposes the patient's own full record,
- a **referral view** exposes what a receiving provider needs,
- a **pharmacy view** exposes what Mythic needs to dispense,

and none of them can leak past their view even if a page or an integration asks for more. Build the
export paths *through* views rather than reading resources directly — that is what makes
"minimum necessary" an architectural guarantee instead of a code-review promise.

---

## Sources

CMS e-prescribing standards and the SCRIPT version timeline:

- [E-Prescribing Standards and Requirements — CMS](https://www.cms.gov/medicare/regulations-guidance/electronic-prescribing/adopted-standard-and-transactions)
- [E-Prescribing — CMS](https://www.cms.gov/medicare/regulations-guidance/electronic-prescribing)
- [42 CFR 423.160 — Standards for electronic prescribing (eCFR)](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-423/subpart-D/section-423.160)
- [NCPDP SCRIPT Version 2017071 implementation timeline (NCPDP)](https://ncpdp.org/NCPDP/media/pdf/NCPDP_SCRIPT_Version_2017071_Timline__Implementation.pdf)
- [The CMS Proposed Update to NCPDP SCRIPT — Surescripts](https://surescripts.com/news-center/intelligence-in-action/access-security-and-performance/the-cms-proposed-update-to-ncpdp-script-let-s-talk-timing-and-consistency)

EPCS, DEA telemedicine, and compounded ketamine:

- [21 CFR Part 1311 — Requirements for Electronic Orders and Prescriptions (eCFR)](https://www.ecfr.gov/current/title-21/chapter-II/part-1311)
- [DEA Diversion Control — EPCS Q&A](https://www.deadiversion.usdoj.gov/faq/epcs-faq.html)
- [Fourth Temporary Extension of COVID-19 Telemedicine Flexibilities (Federal Register, 2025-12-31)](https://www.federalregister.gov/documents/2025/12/31/2025-24123/fourth-temporary-extension-of-covid-19-telemedicine-flexibilities-for-prescription-of-controlled)
- [DEA extends telemedicine flexibilities for 2026 — McDermott+](https://www.mcdermottplus.com/insights/dea-extends-telemedicine-flexibilities-for-controlled-substance-prescribing-for-2026/)
- [FDA warns about potential risks associated with compounded ketamine](https://www.fda.gov/drugs/human-drug-compounding/fda-warns-patients-and-health-care-providers-about-potential-risks-associated-compounded-ketamine)
- [FDA Issues New Warning Regarding Compounded Ketamine — Foley & Lardner](https://www.foley.com/insights/publications/2023/10/fda-issues-new-warning-compounded-ketamine/)

**Workflows for the acknowledgement contracts.** Every one of these rails is
send → acknowledge → possibly correct. HL7 has `MSA` ACK/NAK, Pioneer has its
`Message_Header`/`Message_Type` ACK/NAK (already specified in the field map), NCPDP has status
responses. Model these uniformly: persist the raw inbound envelope before processing, dedupe by
message id, and make replay possible. The Pioneer listener design in §7 of the field map is the
right template for all of them.

---

## 7. Open decisions

0. **Controlled substances — the critical path.** Adding testosterone/ketamine makes EPCS, PDMP,
   and the DEA telemedicine question gating rather than optional. Three things need owners now:
   pick a certified EPCS vendor (it constrains the prescribing flow's design), start prescriber
   identity proofing (long lead time), and get counsel's read on compounded ketamine via telehealth
   plus what the **December 31, 2026** expiry of the telemedicine flexibility means for the launch
   plan. Also re-confirm the LegitScript posture — the in-flight application was scoped to GLP-1s.
1. **Surescripts enrollment** — start it or accept the direct-Pioneer interface as the medium-term
   path? This gates item 4 and has a long lead time. Controlled substances make the private-Pioneer
   interface materially less defensible.
2. **Lab partner** — direct HL7 interface with Labcorp/Quest, or a vendor API? Direct is cheaper
   per-test and slower to stand up.
3. **HISP selection** — needed for any outbound records; low cost, so worth doing early.
4. **Does Nume ever want to be an ONC-certified EHR?** If yes, USCDI compliance and a FHIR API
   become requirements with deadlines rather than choices, and that should shape the model now.
5. **Confirm the SCRIPT version** against current Surescripts certification before implementation.
   This document asserts **2023011** on the basis of the CMS transition rule (exclusive use from
   January 1, 2028); confirm Surescripts supports it for new connections today rather than taking
   it on faith. If they still certify only 2017071, that changes the sequencing — not the target.
