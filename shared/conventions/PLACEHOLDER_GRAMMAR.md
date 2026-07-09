# Placeholder grammar (canonical)

The string `[CLIENT TO CONFIRM]` is the system's single placeholder convention. It is used in every site's `landing-config.js` for any value the client has not yet provided.

## Behavior

- Stored verbatim in `landing-config.js`:
  ```js
  monthlyPrice: "[CLIENT TO CONFIRM]"
  ```
- The renderer detects the substring and applies the `lp-placeholder` CSS class to the bound element. The element's `title` is set to the helper text "This value is awaiting client confirmation in landing-config.js".
- The yellow highlight makes missing values impossible to miss in QA.

## Where it appears

- Strings: `"[CLIENT TO CONFIRM]"`
- Single-element arrays as a sentinel: `["[CLIENT TO CONFIRM]"]`. The renderer's list binding skips placeholder-only arrays so the element stays at its fallback markup.
- Inside `data-bind-list-tpl` template expansions, no special handling — placeholders just render verbatim if any survive.

## Rules

1. **Use the literal string only.** Do not paraphrase to "TBD", "[client]", "TO CONFIRM", etc. The detector looks for the exact substring `[CLIENT TO CONFIRM]`.
2. **Wrap optional fields in `null`, not in placeholder strings.** If a field is genuinely optional (e.g. `firstMonthPrice` may not exist), set it to `null`. The renderer's `data-bind-show` will hide that block automatically.
3. **Never set a default value as the placeholder.** If a default exists, write the default. Placeholders are reserved for client-pending values.
4. **Onboarding forms must export placeholders for unfilled fields.** The "Export config" feature in `Client_Onboarding.html` must emit `"[CLIENT TO CONFIRM]"` for every blank required field, never an empty string.

## Visibility on production

A page that ships to production should never display `[CLIENT TO CONFIRM]` to a real visitor. The yellow placeholder highlight is intentional QA-loud styling — its presence in production is a launch-blocker.

The `Marketing_Next_Steps.html` deliverables table is the operating contract: every placeholder in `landing-config.js` corresponds to a `pill-client "Pending"` row in section 3 of the tracker.
