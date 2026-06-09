# @smuit/theme

## 0.1.1

### Patch Changes

- [#11](https://github.com/wimwian-org/smuit/pull/11) [`44a58ed`](https://github.com/wimwian-org/smuit/commit/44a58ed7926e4e7057b442a0839c1f76932cb1f7) Thanks [@wimwian](https://github.com/wimwian)! - Every type utility (`text-<role>-<label>`) now defaults to font-weight **medium
  (500)**. Override per element with `font-semibold` / `font-bold` (or any
  `font-*` weight utility), which take precedence. The default is configurable via
  `--font-weight-default` in `input.css`.

- [#9](https://github.com/wimwian-org/smuit/pull/9) [`08ace21`](https://github.com/wimwian-org/smuit/commit/08ace2175a3fac4185a76555db3bf61754712fbf) Thanks [@wimwian](https://github.com/wimwian)! - Anchor the type ramps lower: `body` now midpoints at `0.875rem` (was `1rem`)
  and `label` at `0.75rem` (was `0.875rem`). This shifts the default
  `--text-body-*` and `--text-label-*` sizes (and their derived line-heights)
  down one notch across the scale.

## 0.1.0

### Minor Changes

- Initial release: MD3 oklch palettes, `--L`/`--D` space-toggle theming, ground/content scales, elevation tokens, tint utilities, and MD3 typescale.
