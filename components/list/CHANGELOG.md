# @wimwian-org/list

## 0.2.0

### Minor Changes

- [#18](https://github.com/wimwian-org/smuit/pull/18) [`88f1067`](https://github.com/wimwian-org/smuit/commit/88f1067168d8d4c2062bffcb593d79f525bfcac9) Thanks [@wimwian](https://github.com/wimwian)! - Land the deferred backlog from the design spec on `@wimwian-org/list`. Adds a **selection** model — set `selection="single"` / `"multiple"` and give rows a `value` to turn the list into a `role="listbox"` of `role="option"` toggles with `aria-selected`, a trailing **checkbox / radio / switch** control (defaulting to radio for single, checkbox for multiple), and `bind:value` (a `string` or `string[]`); a **three-line** layout (`lines="three"`) that top-aligns the row and clamps the supporting block to two wrapped lines; **roving** arrow-key navigation (Arrow Up/Down + Home/End move focus without wrapping, Space/Enter toggle a focused option) that turns on automatically under a selection model and is opt-in via `roving` for plain link/button lists; a `List.Subheader` part for sticky section labels that opens a fresh rounded group in Expressive lists; and the Expressive **press shape-morph** — an interactive row rounds to the full container radius and settles on press, gated behind `prefers-reduced-motion`. The new `selected` state retints the row fill, and the Expressive position-based corner shape now respects subheader-delimited groups. All additive — existing `List.Root` / `List.Item` usage is unchanged. Drag-to-reorder and swipe actions remain deferred.

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

- [`7d4513b`](https://github.com/wimwian-org/smuit/commit/7d4513bebbb1e55aa4ba9d25aaccf7e475608275) - Add `@wimwian-org/list` (v1) — a Material Design 3–style list built from the design spec on smuit design tokens. Ships a composable `List.Root` / `List.Item` pair in **Baseline** and **Expressive** variants, one- and two-line rows, leading/trailing snippet slots, supporting text, and static / button / link interactivity with a hover state layer and visible focus, plus the Expressive position-based corner shape (first/middle/last/only), neutral/primary/secondary/tertiary tints, and automatic light/dark theming. Selection, three-line layout, roving keyboard navigation, reordering, subheaders, and the Expressive press shape-morph are deferred to a later release.

### Patch Changes

- [`14ee7ee`](https://github.com/wimwian-org/smuit/commit/14ee7ee0f62d799df9b1f092867adf27016cc0d8) - Make `tint` visible: a single `--list-accent` token (set per tint) now drives the resting fill, the hover/pressed state layers, and the focus outline together — previously only the keyboard focus outline was tinted, so lists looked identical regardless of tint. The default tint is now `neutral`, so un-tinted lists stay grey and explicit tints clearly stand out.
