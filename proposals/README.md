# Proposals

A proposal is a small markdown file describing a proposed change to `shared/`. Every change to `shared/` starts here.

## Filing a proposal

Create `proposals/YYYY-MM-DD-<short-slug>.md` using the template below.

### Template

```markdown
---
status: proposed                   # proposed | approved | landed | rejected | withdrawn
filed_by: nume-agent               # nume-agent | mythic-agent | operator
filed_on: 2026-MM-DD
landed_on:                         # filled in by the shared maintainer at land time
landed_version:                    # vYYYY.MM.DD.N
---

# <one-line title>

## Summary

What is changing, in 1–3 sentences.

## Motivation

Why this change is worth shared status (vs. a local fix in one site repo).

## Files affected

- `shared/<path/to/file>` — what changes about it
- `shared/<path/to/another>` — ...

## Diff

Either paste the new file contents in full, or a unified diff. If the change is large, link to a sibling file in `proposals/<slug>/` that holds the full new version.

## Migration impact

| Site | What this site must do to adopt | Effort |
|---|---|---|
| nume-health.com | <e.g. add a `--site-success` alias in `nume-health.css`> | <small / medium / large> |
| mythic-rx.com   | ... | ... |

## Risk

Anything that could break either site at adoption time, and how to detect it. Smoke tests, things to check.

## Alternatives considered

What else was on the table; why this option won.

## Reviewer checklist

- [ ] Change is brand-neutral
- [ ] Change does not embed compliance status from any site
- [ ] Migration impact is documented per consuming site
- [ ] Adoption is non-breaking (or breaking changes are flagged with a deprecation period)
- [ ] Convention docs updated if a convention shifts
```

## Status flow

```
proposed  ──(operator approves)──►  approved  ──(maintainer lands)──►  landed
   │                                                                       │
   │                                                                       └─► CHANGELOG entry created, MIRROR_TARGETS.md latest version bumped
   │
   ├──(operator rejects)──► rejected   (kept for history)
   │
   └──(filer withdraws)──► withdrawn   (kept for history)
```

Once a proposal is `landed`, it is never edited again. Mistakes are corrected by filing a new proposal.

## What does NOT need a proposal

- Edits to a single site's repo that don't touch `shared/`. Site agents make those locally and don't notify this folder.
- Documentation typo fixes inside `proposals/` itself. Just fix them.
- Edits to `per-site/<site>/AUDIENCE.md`, `COMPLIANCE_GATES.md`, or `MIRROR_TARGETS.md` — those are owned by their site agent.

## What DOES need a proposal

- Any edit to `shared/css/`, `shared/js/`, `shared/conventions/`, `shared/schemas/`, `shared/templates/`.
- Any new file inside `shared/`.
- Renames or removals inside `shared/` (with a deprecation period).
- Any change that adds a required `--site-*` CSS variable, a required config key, or a required event name.

## Where ideas come from

- A site agent finds itself wanting to fork a shared file → proposal.
- A site agent finds itself wanting to add a feature that the sister site would also benefit from → proposal.
- The operator decides on a convention change → operator files the proposal directly, or asks an agent to draft it.
