# @smuit/text-field

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

- [`a6701e9`](https://github.com/wimwian-org/smuit/commit/a6701e9c217c85d5c0352fd7d327f825d1e40930) - Add `@smuit/text-field` (v1) — a Material Design 3–style single-line text field built from the design spec on smuit design tokens. Ships filled · outlined variants, a floating label plus hidden-label mode, supporting text, prefix/suffix text and leading/trailing icon slots, a character counter with a `maxlength` soft cap, small/medium density, full-width, neutral/primary/secondary/tertiary focus tints, and enabled/hover/focused/populated/read-only/disabled states, with automatic light/dark theming and label↔input↔supporting-text accessibility wiring. Validation/error state, multiline, and alternate input types are deferred to a later release.
