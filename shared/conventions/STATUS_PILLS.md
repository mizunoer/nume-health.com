# Status pill grammar (canonical)

The action tracker on every site uses the same five pill statuses. Same colors, same semantics.

| Class | Label | Meaning | When to use |
|---|---|---|---|
| `pill-done` | Done | Completed and verified | Gate cleared, deliverable shipped, dev task merged + verified |
| `pill-prog` | In progress | Actively being worked | Counsel reviewing this week, dev task in branch, partial deliverable |
| `pill-blocked` | Blocking | Hard launch gate that has not cleared | Counsel review pending, certification not granted, BAA template not approved |
| `pill-client` | Awaiting client / Pending | Waiting on client input or sign-off | Onboarding form field unfilled, partner agreement not yet executed, content awaiting client review |
| `pill-todo` | Open | Scheduled work that has not started | Future dev task, planned feature, item on backlog |

## Color semantics (defined in each site's CSS, identical hexes recommended)

```css
.pill-done    { background: #DCFCE7; color: #166534; }
.pill-prog    { background: #DBEAFE; color: #1E3A8A; }
.pill-blocked { background: #FEE2E2; color: #991B1B; }
.pill-client  { background: #FEF3C7; color: #92400E; }
.pill-todo    { background: #E2E8F0; color: #334155; }
```

## Usage rules

1. **Pills represent a site's actual current state, not aspiration.** Do not flip a pill to `pill-done` because the *concept* has been completed on a sister site. Status is per-site.
2. **A single pill per row.** Do not stack pills.
3. **`pill-blocked` requires an owner column** that names who must clear the gate (counsel, client, ops, engineering).
4. **`pill-client` requires a "what we need" column** that names the specific deliverable.
5. **`pill-prog` should include a date** for when the in-progress work is expected to complete (e.g. "In progress · ETA Fri").
6. **Promotion path**: `pill-todo` → `pill-prog` → `pill-done`. Or `pill-blocked` → `pill-prog` → `pill-done` once the gate clears. Or `pill-client` → `pill-prog` → `pill-done` once the client delivers.
7. **Demotion path**: rare — happens when a `pill-done` row regresses (failed audit, retracted approval). Demote with a date and reason in an adjacent column or a tracker note.

## Anti-patterns

- A six-pill grammar. Resist adding `pill-warn`, `pill-info`, `pill-deferred`. Map them onto the five above:
  - "Warning, partially complete" → `pill-prog` with a note.
  - "Deferred" → `pill-todo` with a date.
  - "Info-only" → no pill; use a callout instead.
- Color customization per site. Both sites use the same five hexes so cross-site reviews look identical.
- Pills outside the action tracker. The grammar is for the tracker page (`Marketing_Next_Steps.html`). Other internal pages can use the same classes if they show the same five statuses, but consumer-facing landing pages should not.
