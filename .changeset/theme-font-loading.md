---
'@wimwian-org/theme': patch
---

Fix web fonts never loading from the flat theme. The `@import` font URLs in `input.css` were dropped by the generator, so `output.css` (the published `flat` entry) carried no font-loading at all and `var(--font-sans)`/`--font-mono` silently fell back to the browser default. The generator now transfers the source's `@import url(...)` rules verbatim to the top of `output.css` (ahead of all style rules, with full-`url(...)` matching so variable-axis URLs containing `;` aren't truncated). Also fixes the `--font-sans`/`--font-mono` tokens, which had the whole stack wrapped in one set of quotes (a single invalid family name); they are now proper comma-separated lists with generic fallbacks.
