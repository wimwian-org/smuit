# @smuit/list

## 0.1.0

### Minor Changes

- [`7d4513b`](https://github.com/wimwian-org/smuit/commit/7d4513bebbb1e55aa4ba9d25aaccf7e475608275) - Add `@smuit/list` (v1) — a Material Design 3–style list built from the design spec on smuit design tokens. Ships a composable `List.Root` / `List.Item` pair in **Baseline** and **Expressive** variants, one- and two-line rows, leading/trailing snippet slots, supporting text, and static / button / link interactivity with a hover state layer and visible focus, plus the Expressive position-based corner shape (first/middle/last/only), neutral/primary/secondary/tertiary tints, and automatic light/dark theming. Selection, three-line layout, roving keyboard navigation, reordering, subheaders, and the Expressive press shape-morph are deferred to a later release.

### Patch Changes

- [`14ee7ee`](https://github.com/wimwian-org/smuit/commit/14ee7ee0f62d799df9b1f092867adf27016cc0d8) - Make `tint` visible: a single `--list-accent` token (set per tint) now drives the resting fill, the hover/pressed state layers, and the focus outline together — previously only the keyboard focus outline was tinted, so lists looked identical regardless of tint. The default tint is now `neutral`, so un-tinted lists stay grey and explicit tints clearly stand out.
