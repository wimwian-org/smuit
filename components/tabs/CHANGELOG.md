# @smuit/tabs

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

- [#2](https://github.com/wimwian-org/smuit/pull/2) [`35bae33`](https://github.com/wimwian-org/smuit/commit/35bae33c86f8e5f0fe4586665810002689692d36) Thanks [@wimwian](https://github.com/wimwian)! - Add `@smuit/tabs` — Material Design 3 tabs for Svelte 5, backed by the headless `bits-ui` Tabs primitive on smuit design tokens. v1 ships a compound `Tabs.Root` / `Tabs.List` / `Tabs.Trigger` / `Tabs.Content` with `bold`/`subtle` variants, `sm`/`md` sizes, seven tints, optional inline leading icons, automatic/manual activation, and an animated sliding active indicator (snaps under `prefers-reduced-motion`). Built from `components/tabs/tabs-design.md`; overflow scrolling, vertical orientation, stacked icons, and badges are deferred.
