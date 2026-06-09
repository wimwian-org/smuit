# @wimwian-org/loading-indicator

## 0.2.0

### Minor Changes

- [#17](https://github.com/wimwian-org/smuit/pull/17) [`9a68d37`](https://github.com/wimwian-org/smuit/commit/9a68d374103d86dc16172c14e2e2ac54287b8631) Thanks [@wimwian](https://github.com/wimwian)! - Add the deferred loading-indicator features: a determinate `progress` (0→1) mode with a sweep arc and `aria-valuenow`, a completion hand-off (`complete` / `progress >= 1`) that settles into a success checkmark, a custom `shapes` morph sequence (with exported `LOADING_INDICATOR_SHAPES` / `DEFAULT_SHAPE_SEQUENCE`), and a `containerShape` option (`rounded` / `squircle` / `cookie`) for the contained variant. The exact AndroidX spring-physics morph remains deferred.

### Patch Changes

- Updated dependencies [[`d76d084`](https://github.com/wimwian-org/smuit/commit/d76d0849fc242807b115ab73c722c8a2db7961fd)]:
    - @wimwian-org/theme@0.1.3

## 0.1.2

### Patch Changes

- Fix the `repository.url` in package.json — it pointed at the non-existent
  `github.com/smuit/smuit`; corrected to `github.com/wimwian-org/smuit`.
- Updated dependencies []:
    - @wimwian-org/theme@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`44a58ed`](https://github.com/wimwian-org/smuit/commit/44a58ed7926e4e7057b442a0839c1f76932cb1f7), [`08ace21`](https://github.com/wimwian-org/smuit/commit/08ace2175a3fac4185a76555db3bf61754712fbf)]:
    - @wimwian-org/theme@0.1.1

## 0.1.0

### Minor Changes

- [#3](https://github.com/wimwian-org/smuit/pull/3) [`4bee9bd`](https://github.com/wimwian-org/smuit/commit/4bee9bd1eefb7c954a54b91260ab7741393fc090) Thanks [@wimwian](https://github.com/wimwian)! - Add `@wimwian-org/loading-indicator` (v1) — a Material Design 3 Expressive indeterminate loading indicator built from the design spec on smuit design tokens. The active indicator continuously morphs through a curated set of Material shapes (circle → cushion → diamond → pill) via SVG `d` interpolation while rotating. Ships `uncontained` · `contained` variants, `sm`/`md`/`lg` sizes (md = the M3 48dp/38dp default), neutral/primary/secondary/tertiary tints, automatic light/dark theming, an indeterminate `role="progressbar"` accessibility model, and a `prefers-reduced-motion` fallback that rests on a single static shape. Determinate (progress-driven) mode, the exact AndroidX spring-physics seven-shape morph, custom shape sequences, and the completion hand-off are deferred to a later release.
  </content>
