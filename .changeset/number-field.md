---
'@smuit/text-field': minor
---

Add `NumberField` — a numeric field built on the text-field foundation. It masks
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
