# @smuit/progress-indicator

## 0.1.2

### Patch Changes

- Fix the `repository.url` in package.json — it pointed at the non-existent
  `github.com/smuit/smuit`; corrected to `github.com/wimwian-org/smuit`.
- Updated dependencies []:
    - @smuit/theme@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`44a58ed`](https://github.com/wimwian-org/smuit/commit/44a58ed7926e4e7057b442a0839c1f76932cb1f7), [`08ace21`](https://github.com/wimwian-org/smuit/commit/08ace2175a3fac4185a76555db3bf61754712fbf)]:
    - @smuit/theme@0.1.1

## 0.1.0

### Minor Changes

- [#1](https://github.com/wimwian-org/smuit/pull/1) [`d9ad56b`](https://github.com/wimwian-org/smuit/commit/d9ad56beaa21dcff13a50a081a76f4f47f50af6a) Thanks [@wimwian](https://github.com/wimwian)! - Add `@smuit/progress-indicator` (v1) — a Material Design 3–style linear progress indicator built from the design spec on smuit design tokens. Ships determinate (`value` / `max`, the Material fraction model) and indeterminate (animated) modes, a retintable accent (neutral · primary · secondary · error · warning · success), three track heights (sm · md · lg), a `prefers-reduced-motion` fallback, and full `role="progressbar"` ARIA, with automatic light/dark theming. The circular shape, four-color mode, linear buffer, and a built-in label slot are deferred to a later release.
