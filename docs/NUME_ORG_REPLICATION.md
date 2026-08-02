# Nume Health org — created & replicated (2026-08-02)

_The multi-org milestone: Nume Health now exists as its own Workshift tenant,
fully configured, with `portal.nume-health.com` routed to it. Everything below
was executed via the new tenant service + MCP APIs and verified by read-back._

## The org

| Object | Value |
|---|---|
| Organization **Nume Health** | `1e38339c-9509-4012-ab96-543fea9f4dc7` (status active) |
| MCP service account user | `3557f617-9b32-4f14-9ca1-d35b2f97fe25` |
| API key (metadata) | `b14e91db…`, name `config-replication`, prefix `wsk_jVwYH7Hh` |
| Key storage | second MCP server entry **`workshift-nume`** in `C:\Users\Mizun\source\.mcp.json` (plaintext lives only there) |
| Domain row | `99d5508b-2877-4d7d-b363-cb5262d480ac` → portal.nume-health.com → new Provider Portal app |
| App **Nume Provider Portal** | `14a9b0e4-c3d4-4a90-b08c-589d5ba61ef6` |
| Platform org (for `PlatformOrganizationId`) | `4de436b7-cf77-4df3-afa9-6e11f750f22a` ("Local Dev") |

Full old→new UUID map: [`nume-org-id-map.json`](nume-org-id-map.json) (types,
attributes, views, relationships, permission groups, apps, activities, pages).

## What was replicated (curated — junk left behind)

| Class | Count | Notes |
|---|---|---|
| Resource types | 16 | skipped `TestResource` + empty `Resource` |
| Attributes | 133 | keys carried over identically (verified — data copies stay valid) |
| Relationships | 27 | 1 skipped (endpoint on a skipped type) |
| Views | 30 | skipped the deliberate `QA — fail-closed probe` fixture |
| Permission groups | 6 | Provider / Pharmacist / Pharmacy Tech / Billing / Patient / Marketing CRM; skipped broken `Marketing`, `test`, zero-link groups |
| Apps | 2 | Nume Provider Portal + Nume Marketing CRM (8 junk test apps left behind) |
| Activities / pages | 2 / 12 | mainActivity + startPage wiring patched and verified |
| CRM records | 11 | 4 channels, 3 integrations, 4 campaigns (real state); fictional Flintstone leads NOT copied |

**Verified:** zero stale dev-org UUIDs in replicated page params/flow;
server-side view enforcement live in the new org (probe patient read through
the Pharmacy Tech view stripped email/name exactly per the view definition;
probe deleted after).

## Replication tooling (reusable)

Session scratchpad scripts (pattern worth keeping — they can rebuild any org):
- `mcpclient.mjs` — minimal MCP streamable-HTTP client (initialize → tools/call, SSE parsing)
- `db-export.mjs` — lossless config export via read-only SQL (MCP GETs strip `params` on views/pages — export from DB, import via MCP)
- `import-org.mjs` — curated, **resume-safe** importer (name/key-matched reuse; global uuid remap applied to every params/flow string)
- `copy-crm.mjs` — data copy with association remapping (channels → integrations → campaigns)

## Gotchas hit (platform truths)

1. **MCP read tools strip view/page `params`** even on single-id fetch — export config from the DB, not the API.
2. **`admin_GetActivities` ignores its `appId` filter** — returns all org activities. DB confirmed correct wiring; the API listing is just unfiltered (flag for Kramer).
3. **`resource_GetResource` requires `resourceTypeId`** alongside `resourceId` — id alone returns not_found.
4. **Domains can never be re-registered after deletion**: `domains_domain_key` is a full unique index but DeleteDomain soft-deletes — the tombstone still claims the hostname (SQLSTATE 23505). Worked around by purging the tombstoned row; fix chip filed (same family as the SavePermissionGroup bug).
5. `attribute.key` is honored on create when supplied — passing old keys keeps resource `data` payloads portable across orgs.

## What did NOT move / next

- **Workflows** (Rx Lifecycle etc.) — graphs embed IDs; replicate + remap when the workflow surface is needed in the new org.
- **Participant login** still blocked on `WORKSHIFT_PARTICIPANT_AUTH0_*` creds (unchanged top blocker). Portal behavior unchanged: 307 → /auth/login → 500-by-design.
- Domain resolution is by hostname across orgs — portal.nume-health.com verified serving (307) post-move; DNS/cert/portal stack untouched.
- Dev org retains: its own config, all seed/QA data, dev.workshift.io, localhost + app1 domains. It is now cleanly the *platform/dev* org; Nume Health is the first real tenant.
