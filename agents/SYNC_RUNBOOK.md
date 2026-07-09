# Sync runbook — when you've changed `shared/`

This is the operating procedure for the agent who has just landed a change in `shared/`. Run through it in order.

## 0. Confirm you're authorized to land

You have a proposal in `proposals/` that the operator approved. If you don't, stop. File a proposal first (see `proposals/README.md`).

## 1. Apply the change

- Edit the file under `shared/<path>` directly.
- The change must be brand-neutral. No "Nume", no "Mythic-RX", no specific palette hex, no specific compliance gate. Anything site-specific belongs in `per-site/<site>/`.

## 2. Bump the version

Open `CHANGELOG.md`. Add a new entry at the top:

```
## v2026.MM.DD.N — short summary

- **Files**: shared/<path>, ... (every file the change touches)
- **Summary**: what changed and why, in 1–3 sentences
- **Adoption status**:

  | Site | Status |
  |---|---|
  | nume-health.com | pending |
  | mythic-rx.com   | pending |
```

The version `vYYYY.MM.DD.N` is date-stamped; `N` increments within a single day.

## 3. Update each `per-site/<site>/MIRROR_TARGETS.md`

For each site, find the row for the file(s) you changed. Update the "latest available version" column to the new version string. Leave the "consumed version" column untouched — that flips when the site agent actually adopts.

If you've added a brand-new shared file, add a new row to each `MIRROR_TARGETS.md` with `consumed version: never` and `latest available: <new version>`.

## 4. Mark the proposal landed

In `proposals/YYYY-MM-DD-<slug>.md`, change the front-matter `status:` to `landed` and add the date. Cross-link to the changelog entry.

## 5. Notify the operator

Tell the operator:

> Landed `vYYYY.MM.DD.N` — `<one-line summary>`. Both site agents will adopt on their next session.

You do **not** edit either site repo directly. The site agents adopt under their own workflow.

## 6. (Optional) tell the next agent what to do

If the change requires a non-trivial migration on the site side (e.g. CSS-var aliases that need to be added, a config key that must be renamed), add a "Migration notes" section to the changelog entry and to `MIRROR_TARGETS.md` for the affected sites. The site agent will see it on adoption.

## Hard rules during landing

1. **One concern per land.** If a single proposal touches multiple unrelated concerns, split it into multiple proposals and land them separately.
2. **No edits to per-site files in the same land.** A `shared/` change can update `MIRROR_TARGETS.md` (latest available version), but it never updates per-site compliance status or audience definitions.
3. **No reshaping the convention docs without a migration note.** Agents and humans rely on the convention names being stable.
4. **No deletions without a "removed in vX" line in the changelog**, plus a deprecation period of at least one full sync cycle on each consuming site.
