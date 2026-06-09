---
'@smuit/text-field': minor
---

Add `PasswordField` and `MaskedField`, two more fields on the text-field
foundation, and let `Field.Input` take a `type`.

- **`PasswordField`** — a masked `type="password"` field with a built-in
  show/hide reveal toggle in the trailing slot (a real, focusable button with a
  toggling `aria-label` / `aria-pressed`). Defaults `autocomplete` to
  `current-password`; set `revealable={false}` to drop the toggle (e.g. a
  confirm-password or one-time-code field).
- **`MaskedField`** — a pattern-masked field. A `mask` template formats the value
  as the user types and binds the formatted `value` plus, optionally, the raw
  characters via `bind:unmasked`. Tokens: `#` digit, `A` letter, `*`
  alphanumeric, `\` escapes a token character, and every other character is a
  literal separator inserted automatically. Live formatting preserves the caret;
  a digit-only mask selects the `numeric` on-screen keyboard.
- **`Field.Input`** now accepts a `type` prop (default `"text"`), so the parts
  can compose non-text inputs.

Pure masking helpers live in `mask.ts` (node-tested); both components are
browser-tested. Adds playground demo routes + homepage links.
