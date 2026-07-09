# Health sites monorepo (Numi)

**nume-health.com** (DTC patients) and **mythic-rx.com** (B2B partner physicians) share one launch system in this repo.

- **Dev:** Namecheap cPanel (or local `npx serve`).
- **Production (later):** AWS.

---

## Repo layout

| Path | Purpose |
|------|--------|
| `sites/nume-health.com/` | **Deploy root** for nume-health.com |
| `sites/mythic-rx.com/` | **Deploy root** for mythic-rx.com (scaffold until Mythic port) |
| `shared/` | Canonical renderer, landing CSS, schemas, conventions |
| `docs/` | Project docs, deploy guide, audience matrix |
| `per-site/` | Per-brand audience + compliance (not deployed) |
| `agents/` | Cursor agent kickoff prompts |
| `Template1–4/` | Reference HTML templates (not deployed) |

See [docs/MONOREPO.md](docs/MONOREPO.md) for the full map.

---

## Quick start

**Nume (local):**

```powershell
npx serve sites/nume-health.com
```

**Deploy:** Point each domain's document root at its folder under `sites/`. See [docs/DEPLOY-LITESPEED.md](docs/DEPLOY-LITESPEED.md).

---

## Docs

- [Monorepo layout](docs/MONOREPO.md)
- [Audience matrix (DTC vs B2B)](docs/AUDIENCE_MATRIX.md)
- [Deploy on LiteSpeed / cPanel](docs/DEPLOY-LITESPEED.md)
- [Adding a page](docs/ADDING_A_PAGE.md)
- [Project outline](docs/PROJECT_OUTLINE.md)

**Mythic-RX agent:** paste [agents/MYTHIC_MONOREPO_KICKOFF.md](agents/MYTHIC_MONOREPO_KICKOFF.md) into Cursor.
