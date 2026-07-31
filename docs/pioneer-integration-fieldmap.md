# PioneerRx → Workshift integration field map

_Drafted 2026-07-30. Source of truth = the pharmacy-supplied "RxEvents message with every
possible field" + ACK/NAK samples. Complements the two verified surfaces:_

- **RxEvents push (INBOUND, this doc):** PioneerRx POSTs a JSON message to a configured
  listener URL (`Body.Pharmacy.PharmacyRxEventsListenerURL`, e.g. `https://x.x.x.x/API/RxEvents`)
  on pharmacy events (fill status changes, etc.). We reply ACK or NAK. This is the richest,
  real-time surface and the primary one to build first.
- **Enterprise API (OUTBOUND):** `POST https://192.168.1.10/api/enterprise/method/process`
  (live) / `.../test/process` (DayOld). Auth CONFIRMED: `prx-api-key` + `prx-timestamp` +
  `prx-signature = base64(SHA512(UTF16LE(timestamp + shared-secret)))`; body
  `{MethodName, Version, ParameterCollection:[{Name,Value}]}`. Method catalog still pending
  (doc site 503; not published on the instance).
- **SQL direct read (DayOld):** `192.168.1.10,49202` DB `PioneerPharmacySystem_DayOld`, SQL
  2019, 2565 tables; `DataExport.LatestPrescription` is the best denormalized read view.

All three reach the pharmacy over the existing site-to-site VPN (EC2 `dev-workshift-vpn-client`).

---

## 1. Message envelope (every RxEvents message)

```
MessageHeader:
  Version              schema version ("2.0")
  MessageID            GUID — MUST be echoed in the ACK/NAK
  SentOnUTC            ISO-8601 UTC
  WorkStation          origin workstation name
  InitiatingEventID    numeric event trigger id (e.g. "10")
  InitiatingEventText  event trigger text (e.g. "StatusChange")  ← drives which workflow fires
Body:
  Pharmacy      (1)   store identity + the listener URL + PIC
  Employees[]         pharmacists / techs referenced by the Rx
  Prescribers[]       prescribers referenced by the Rx
  Patient       (1)   the patient (demographics + nested allergies/other-meds/categories/facility)
  Facility      (0-1) LTC facility, if the patient is in one
  Rx            (1)   the prescription + fill (prescribed/dispensed drug, status, financials)
  Claims[]            adjudication claims for this Rx (sibling of Rx under Body)
```

## 2. Response contract (our listener MUST return exactly this)

**Casing differs from the inbound message** — the response uses `Message_Header` / `Message_ID`
/ `Message_Type` (underscores), NOT the inbound camelCase. Implement literally.

- **ACK (success):**
  `{"Message_Header": {"Message_ID": "<MessageID>", "Message_Type": "ACK"}}`
- **NAK (rejected):**
  `{"Message_Header": {"Message_Type": "NAK", "Message_ID": "<id or empty>", "Error": "<reason>"}}`

Observed NAK reasons: `"Malformed Json"` (unparseable body — Message_ID empty),
`"UnknownID or missing id"` (no/blank MessageID), and free-form business rejections with the
MessageID present (sample: `"Do not like this patient"`). So NAK covers transport, identity,
and business-rule failures alike.

## 3. Keys & idempotency

- Every `*PioneerRxID` is a **GUID = the stable external key.** Upsert every entity by it.
- Empty GUID `00000000-0000-0000-0000-000000000000` means **none/null** — treat as absent.
- Dedupe processing by `MessageHeader.MessageID` (store processed IDs; a ret& re-send must not
  double-apply).
- Upsert order (FK-safe): Pharmacy → Employees → Prescribers → Facility → Patient → Rx →
  Claims → (Rx.PayMethods, Rx.Transfers).

## 4. Entity → Workshift ResourceType map

Existing org resource types (per current dev org): Patient, Prescription, Allergy, Condition,
Payment method, Claim, Consent profile, Message. **New types this feed requires:** Prescriber,
Employee (Pharmacist/Tech), Facility, Pharmacy, ExternalPharmacy (transfers).

| PioneerRx section | Workshift ResourceType | External key | Relationship |
|---|---|---|---|
| `Body.Pharmacy` | Pharmacy (org/location config) | `PharmacyPioneerRxID` | — |
| `Body.Employees[]` | Employee / Pharmacist | `EmployeePioneerRxID` | Rx → pharmacist/data-entry/filled-by |
| `Body.Prescribers[]` | Prescriber | `PrescriberPioneerRxID` | Rx → prescriber, supervisor |
| `Body.Patient` | Patient | `PatientPioneerRxID` | parent of Allergy/Rx/PayMethod |
| `Body.Patient.Allergies[]` | Allergy | (child of Patient; `Description` only) | Patient → Allergy |
| `Body.Patient.OtherMedications[]` | Condition/OtherMed | `RxNumber`+`NDC` | Patient → med history |
| `Body.Facility` | Facility | `FacilityPioneerRxID` | Patient → Facility |
| `Body.Rx` | Prescription | `RxPioneerRxID` (+ `RxFillTransactionPioneerRxID`) | → Patient, Prescriber |
| `Body.Claims[]` | Claim | `ClaimPioneerRxID` | Claim → Prescription |
| `Body.Rx.PayMethods[]` | Payment method | `PatientPayMethodID` | → Patient/Rx |
| `Body.Rx.Transfers.TransferredIn/Out` | ExternalPharmacy + transfer | `ExternalPharmacyID` | → Rx |

Log the raw envelope to the existing **Message** resource type (audit + replay), and fire the
**Rx Lifecycle workflow** off `InitiatingEventText`.

## 5. Field maps — core entities

### Patient (`Body.Patient`)
| PioneerRx field | Workshift attr | Type | Notes |
|---|---|---|---|
| `Identification.PatientPioneerRxID` | externalId | STRING (unique) | upsert key |
| `Identification.SSN` | ssn / ssn-last-4 | STRING | **PHI — minimum-necessary: prefer storing only last-4 (our CALCULATED attr), not full SSN** |
| `Name.FirstName/LastName/MiddleName/PreferredName/Suffix/Prefix` | name fields | STRING | |
| `DateOfBirth` | dob | DATE | **format is `MM/DD/YYYY` (non-ISO)** — parse explicitly |
| `Gender` | gender | STRING | text ("Female"/"Male") |
| `Email` | email | EMAIL | |
| `PhoneNumbers.PhoneNumber[]` | phones | assoc | `AreaCode`+`Number`+`Type`; `PrimaryPhoneSequenceNumber` points to primary |
| `Addresses.Address[]` | addresses | assoc | `PatientPrimary/Mailing/DeliveryAddressID` point by `AddressIDPioneerRxID` |
| `Allergies.Allergy[].Description` | Allergy.name | STRING | event carries description only |
| `OtherMedications.Medication[]` | med history | assoc | RxNumber, NDC, MedicationName, DaysSupply, RefillsRemaining, PrescriberID |
| `Categories.Category[]` / `PrimaryCategory` | tags | TAGS | e.g. "auto fill", program flags |
| `StatusTypePatientText` / `...IsActive` | status | STATUS | "Active" + boolean-string |
| `HipaaStatusTypeText`, `RxNotifyTypeText`, `DoNotEmail/Text` | consent flags | — | map to Consent profile |
| `Comments.{Informational,Critical,PointOfSale,LatestMTMAction}` | notes | TEXTBOX | **free text — may contain PHI** |
| `CreatedOnUTCDateTime`, `ChangedOnUTC` | timestamps | DATETIME | see datetime gotcha |

### Prescription (`Body.Rx`)
| PioneerRx field | Workshift attr | Notes |
|---|---|---|
| `RxPioneerRxID` | externalId (unique) | upsert key |
| `RxNumber`, `RefillNumber`, `ScriptType` | rx number / refill / type | |
| `WrittenByPrescriberPioneerRxID` / `...SupervisorPrescriberPioneerRxID` | → Prescriber assoc | |
| `MedicationPrescribed.{NDC,GCN,BrandName,GenericName,WrittenName,DrugStrength,Quantity}` | prescribed drug | |
| `MedicationDispensed.{NDC,DrugName,Quantity,DaysSupply,Manufacturer,DrugClassText}` | dispensed drug | |
| `MedicationDispensed.CompoundIngredientsDispensed.CompoundIngredient[]` | compound ingredients | **key for our compounded GLP-1s** (NDC, DrugName, Quantity, ActiveIngredient) |
| `MedicationDispensed.LabelWarnings.Warning[]` | label warnings | optional |
| `CurrentRxStatusID` / `CurrentRxStatusText` | status | e.g. 1/"Fill in Progress" — **drives patient-facing status** |
| `CurrentRxTransactionStatusID` / `...Text` | txn status | e.g. 17/"Waiting for Print" |
| `DateWritten`, `DateFilledUTC`, `ExpirationDateUTC`, `DaysSupply` | dates | |
| `QuantityRemaining`, `NumberOfRefillsAllowed/Filled`, `RefillsRemaining` | refills | |
| `DiagnosisCodes.Diagnosis[]` (`Qualifier`=ICD10, `Value`) | diagnoses | |
| `SigCode`, `DirectionsTranslatedEnglish` | directions | |
| `PharmacistPioneerRxID`, `DataEntryByPioneerRxID`, `FilledByPioneerRxID` | → Employee assocs | |
| `IngredientCost*`, `DispensingFee*`, `TotalPrice*`, `PatientPaidAmount`, `AcquisitonCost` | financials | **PHI/financial — minimum-necessary; likely skip for the patient app** |
| `MedsOnCueURL` | tracking url | **patient-facing shipment/QR link — useful for the Nume patient portal** |
| `Transfers.TransferredIn/Out` | transfer records | → ExternalPharmacy |
| `ChangedOnUTC` | timestamp | |

### Claim (`Body.Claims[]`)
| PioneerRx field | Workshift attr | Notes |
|---|---|---|
| `ClaimPioneerRxID` | externalId (unique) | upsert key |
| `BillingOrder`, `Type`, `PayorName` | claim meta | |
| `BinNumber`, `PCN`, `GroupNumber`, `PlanTypeText` | plan routing | |
| `TransactionResponseStatus` | status | `P`=paid, `R`=rejected |
| `GrossAmountSubmitted/Paid`, `PatientPayAmountPaid`, `AcquisitionCost` | amounts | financial |
| `ClaimEdiSent` / `ClaimEdiReceived` | raw NCPDP EDI | **large; do NOT store unless needed** |
| `ContractID`, `MemberBenefitID`, `NPISent` | ids | |

(Pharmacy / Employee / Prescriber / Facility maps: straightforward identity+address+phone by
their `*PioneerRxID`; see the sample. Prescriber carries NPI/DEA/StateLicense, specialty, and
`StatusTypePrescriberIsActive`.)

## 6. Parsing gotchas (implement defensively)

1. **Any element may be absent when empty** — never assume a key exists; null-check everything.
2. **Empty-GUID sentinel** `00000000-...` = null.
3. **Datetime formats are inconsistent:** some ISO-UTC with `Z` (`SentOnUTC`, most `*UTC`),
   some ISO with no offset despite a `UTC` name (`ChangedOnUTCDateTime`: `2021-10-25T20:41:25.737`),
   and **`DateOfBirth` is `MM/DD/YYYY`**. Treat `*UTC*`-named fields as UTC even without `Z`.
4. **Response casing** (`Message_Header`/`Message_ID`/`Message_Type`) ≠ inbound casing
   (`MessageHeader`/`MessageID`).
5. **Booleans come as both** `"true"/"false"` and `"0"/"1"` (sometimes on the same concept).
   Coerce both.
6. **Numbers are strings** (`"Quantity":"30.00000"`). Parse to decimal.
7. **Collections are sometimes a single object, sometimes an array** — e.g.
   `Transfers.TransferredIn.Addresses.Address` is a single object, while `Patient.Addresses.Address`
   is an array. Normalize to a list on ingest.
8. **Duplicate/variant key names across records:** e.g. `ChangedOnUTCDateTime` vs `ChangedOnUTC`
   appear on different Employee records. Accept either.
9. **The supplied sample has JSON typos** (trailing/duplicate commas, a stray `,` after the Rx
   block before `Claims`, `"MemberBenefitID:` missing a closing quote). These are documentation
   artifacts — the real feed must be valid JSON; the listener should still reject truly
   unparseable payloads with NAK `"Malformed Json"`.

## 7. Listener design (RxEvents endpoint)

- **Where:** an API Gateway route → Lambda in workshift-io (the fork's Pioneer integration
  service). The URL goes into the pharmacy's PioneerRx config as `PharmacyRxEventsListenerURL`.
- **Reachability:** PioneerRx pushes *outbound* from the pharmacy LAN. The listener must be
  internet-reachable to the pharmacy (public HTTPS, e.g. `vendor-api.workshift.io`) — OR
  reachable back through the site-to-site VPN if we prefer to keep it off the public internet.
  Decide with the pharmacy/dev.
- **Security (IMPORTANT — the push carries no auth header in the sample):** authenticate the
  sender by **source-IP allowlist** (pharmacy WAN `136.41.68.170`), a **pre-shared path token**
  in the listener URL, and/or **mutual TLS**. Do not process unauthenticated events blind.
- **Flow:** receive POST → parse JSON (fail → NAK `"Malformed Json"`) → require
  `MessageHeader.MessageID` (missing → NAK `"UnknownID or missing id"`) → dedupe by MessageID →
  upsert entities in FK order → success → ACK(MessageID). Business rejection → NAK(MessageID, reason).
- **Idempotent, ordered, and logged:** persist the raw envelope (Message resource) before
  processing so failed events can be replayed.

## 8. Minimum-necessary / PHI stance

This feed is dense PHI (SSN, DOB, address, full Rx, claim EDI, financials). For the Nume/Mythic
GLP-1 use case the patient/provider apps need: patient demographics (name, DOB, contact),
Rx identity + **status** + medication (incl. compound ingredients) + refills + prescriber +
`MedsOnCueURL`. They do **not** need: full SSN (store last-4 only), raw claim EDI, or granular
acquisition-cost financials. Scope the ingest + the SQL integration account to that subset, and
keep the raw-financial/claim detail out of patient-facing views.

## 9. Next steps for the fork

1. Update the Pioneer **emulator** to emit this envelope shape (it currently models a simpler
   REST `/pioneer/v1/GetPatient` surface) so the listener can be tested pre-VPN.
2. Build the **RxEvents listener** (parse → upsert → ACK/NAK) per §7, with the security decision made.
3. Add the missing **ResourceTypes** (Prescriber, Employee, Facility, Pharmacy, ExternalPharmacy)
   and the status/financial/MedsOnCueURL attributes on Prescription.
4. Implement the Enterprise API **signing** (§ top) in the SDK for outbound calls once PioneerRx
   supplies the method catalog.
