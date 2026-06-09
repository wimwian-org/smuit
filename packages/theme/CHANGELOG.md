# @wimwian-org/theme

## 0.1.3

### Patch Changes

- [#19](https://github.com/wimwian-org/smuit/pull/19) [`d76d084`](https://github.com/wimwian-org/smuit/commit/d76d0849fc242807b115ab73c722c8a2db7961fd) Thanks [@wimwian](https://github.com/wimwian)! - Darken the `solid` surface role to step **700/300** (light/dark) and shift `solid-hover` to **750/250**, for bolder solid fills. `toneOf` now computes intermediate steps on demand, so the 9-step RAG palettes (error/warning/success) resolve the 250/750 tones too.

## 0.1.2

### Patch Changes

- Fix the `repository.url` in package.json — it pointed at the non-existent
  `github.com/smuit/smuit`; corrected to `github.com/wimwian-org/smuit`.

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
