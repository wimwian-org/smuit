# @wimwian-org/progress-indicator

## 0.2.0

### Minor Changes

- [#16](https://github.com/wimwian-org/smuit/pull/16) [`4cc47d9`](https://github.com/wimwian-org/smuit/commit/4cc47d991e0b871c73ae047ab9616145d930c2f6) Thanks [@wimwian](https://github.com/wimwian)! - Ship the deferred features:
    - **Circular** shape (`shape="circular"`) — an SVG ring on the same `value`/`max`
      model, sized per `size`, determinate + indeterminate.
    - **Buffer** (linear) — a secondary `buffer` channel with a faint fill and a
      dotted track beyond it.
    - **Four-colour** indeterminate (`fourColor`) — the animated indicator cycles
      through four accents (linear bar + circular ring).
    - **Label / value readout** — a built-in `label` caption and an inline `showValue`
      percentage (centred inside the ring for circular).

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

- [#1](https://github.com/wimwian-org/smuit/pull/1) [`d9ad56b`](https://github.com/wimwian-org/smuit/commit/d9ad56beaa21dcff13a50a081a76f4f47f50af6a) Thanks [@wimwian](https://github.com/wimwian)! - Add `@wimwian-org/progress-indicator` (v1) — a Material Design 3–style linear progress indicator built from the design spec on smuit design tokens. Ships determinate (`value` / `max`, the Material fraction model) and indeterminate (animated) modes, a retintable accent (neutral · primary · secondary · error · warning · success), three track heights (sm · md · lg), a `prefers-reduced-motion` fallback, and full `role="progressbar"` ARIA, with automatic light/dark theming. The circular shape, four-color mode, linear buffer, and a built-in label slot are deferred to a later release.
