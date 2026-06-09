# @wimwian-org/text-field

## 0.4.0

### Minor Changes

- [#28](https://github.com/wimwian-org/smuit/pull/28) [`7184402`](https://github.com/wimwian-org/smuit/commit/71844023933b781e157c959e670c4bbab9a7684c) Thanks [@wimwian](https://github.com/wimwian)! - Refine the text-field layout, alignment, and focus styling:
    - **Filled & standard** are 8px taller, with a 4px gap above and below the input.
    - **Outlined** input now sits on the same line above the underline as filled/standard, and the outline closes tighter (no extra centred padding); the resting label, input text, and leading icon line up consistently across all three variants.
    - **Single-colour focus** across every variant — no neutral border or focus ring shown beside the tint indicator — and hovering a focused field keeps the accent (no grey fallback).
    - **Adornments**: leading/trailing icons scale to `1em` and centre on the input baseline; the `standard` variant now correctly offsets the label past a leading icon (fixes an invalid `calc()` from a unitless `0`).
    - **Multiline**: the filled textarea grows its top fill so the floated label is covered with a gap to the text; the standard textarea lifts its floated label above the first line.

## 0.3.0

### Minor Changes

- [#21](https://github.com/wimwian-org/smuit/pull/21) [`eace46b`](https://github.com/wimwian-org/smuit/commit/eace46b957644ac2b3ecb87fbd5046b662988373) Thanks [@wimwian](https://github.com/wimwian)! - Add `PasswordField` and `MaskedField`, two more fields on the text-field
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

### Patch Changes

- Updated dependencies [[`d76d084`](https://github.com/wimwian-org/smuit/commit/d76d0849fc242807b115ab73c722c8a2db7961fd)]:
    - @wimwian-org/theme@0.1.3

## 0.2.2

### Patch Changes

- Fix the `repository.url` in package.json — it pointed at the non-existent
  `github.com/smuit/smuit`; corrected to `github.com/wimwian-org/smuit`.
- Updated dependencies []:
    - @wimwian-org/theme@0.1.2

## 0.2.1

### Patch Changes

- [#13](https://github.com/wimwian-org/smuit/pull/13) [`db0349b`](https://github.com/wimwian-org/smuit/commit/db0349b30419655a42285a3441ec2308dcf39ad0) Thanks [@wimwian](https://github.com/wimwian)! - Tighten the field vertically: `--tf-height` now fits the content (input line +
  floated-label region + bottom padding) rather than a fixed 56px — md `2.75rem`,
  sm `2.5rem`. The lifted (floated) label is now **bold** (700) instead of
  semibold.

## 0.2.0

### Minor Changes

- [#10](https://github.com/wimwian-org/smuit/pull/10) [`2892c5a`](https://github.com/wimwian-org/smuit/commit/2892c5a1a4dee020b8719c1a132ffad449f26854) Thanks [@wimwian](https://github.com/wimwian)! - Halve the field's vertical spacing for a denser layout: the single-line and
  multiline block padding, the resting/floated label insets (kept in step with the
  padding), the caption gap, and the suggestion popup/option padding are all cut by
  half. Container height and horizontal spacing are unchanged.

### Patch Changes

- Updated dependencies [[`44a58ed`](https://github.com/wimwian-org/smuit/commit/44a58ed7926e4e7057b442a0839c1f76932cb1f7), [`08ace21`](https://github.com/wimwian-org/smuit/commit/08ace2175a3fac4185a76555db3bf61754712fbf)]:
    - @wimwian-org/theme@0.1.1

## 0.1.0

### Minor Changes

- [#6](https://github.com/wimwian-org/smuit/pull/6) [`0c96825`](https://github.com/wimwian-org/smuit/commit/0c96825a5d4ffcf7aaf5817ff5127e41169d6b9c) Thanks [@wimwian](https://github.com/wimwian)! - Add `NumberField` — a numeric field built on the text-field foundation. It masks
  input to a numeric alphabet, binds a parsed `number | null`, right-aligns by
  default, and validates `min`/`max` plus an async server-validation callback, both
  run on blur.

    Input modes:
    - **Decimal** — digits, an optional single decimal point (`decimalAllowed`,
      fractional digits capped by `decimalAccuracy`, default 4), and opt-in thousands
      grouping (`grouping`). The group + decimal characters come from `locale`
      (default `en-US`; e.g. `de-DE` → `.` groups, `,` decimal).
    - **Hex** — when the entry leads with `0x`, accepts `0-9 a-f` and binds the
      parsed integer (`0xff` → 255).
    - **Binary** — when the entry leads with `0b`, accepts only `0`/`1` (`0b101` → 5).

    Props: `min`, `max`, `decimalAllowed`, `decimalAccuracy`, `grouping`, `locale`,
    `align` (`'left' | 'right'`, default `'right'`), and `validate`.

- [`a6701e9`](https://github.com/wimwian-org/smuit/commit/a6701e9c217c85d5c0352fd7d327f825d1e40930) - Add `@wimwian-org/text-field` (v1) — a Material Design 3–style single-line text field built from the design spec on smuit design tokens. Ships filled · outlined variants, a floating label plus hidden-label mode, supporting text, prefix/suffix text and leading/trailing icon slots, a character counter with a `maxlength` soft cap, small/medium density, full-width, neutral/primary/secondary/tertiary focus tints, and enabled/hover/focused/populated/read-only/disabled states, with automatic light/dark theming and label↔input↔supporting-text accessibility wiring. Validation/error state, multiline, and alternate input types are deferred to a later release.
