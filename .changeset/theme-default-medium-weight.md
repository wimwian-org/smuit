---
'@smuit/theme': minor
---

Every type utility (`text-<role>-<label>`) now defaults to font-weight **medium
(500)**. Override per element with `font-semibold` / `font-bold` (or any
`font-*` weight utility), which take precedence. The default is configurable via
`--font-weight-default` in `input.css`.
