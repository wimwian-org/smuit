# @smuit/loading-indicator

An indeterminate, shape-morphing **loading indicator** for Svelte 5 — Material Design 3 Expressive's
replacement for the indeterminate circular spinner — built on smuit design tokens.

The active indicator continuously **morphs through a curated set of Material shapes** while rotating.
It ships two variants (**uncontained** and **contained**), three sizes, retinting, and a
`prefers-reduced-motion` fallback. Indeterminate-only in v1.

```svelte
<script>
    import { LoadingIndicator } from '@smuit/loading-indicator';
</script>

<!-- bare morphing shape -->
<LoadingIndicator />

<!-- framed in a filled container, larger, secondary tint -->
<LoadingIndicator variant="contained" size="lg" tint="secondary" />

<!-- only while a request is in flight -->
{#if loading}
    <LoadingIndicator label="Fetching results" />
{/if}
```

## Install

```bash
pnpm add @smuit/loading-indicator
```

`@smuit/theme`, `svelte`, and `tailwindcss` are peer dependencies. Import the theme once in your app
so the tokens are available.

## Props

| Prop      | Type                                                  | Default         | Description                                                         |
| --------- | ----------------------------------------------------- | --------------- | ------------------------------------------------------------------- |
| `variant` | `"uncontained" \| "contained"`                        | `"uncontained"` | Bare shape, or shape on a filled, rounded container surface.        |
| `size`    | `"sm" \| "md" \| "lg"`                                | `"md"`          | Footprint. `md` = the M3 default (48dp container / 38dp indicator). |
| `tint`    | `"neutral" \| "primary" \| "secondary" \| "tertiary"` | `"primary"`     | Accent palette — indicator colour and contained fill.               |
| `label`   | `string`                                              | `"Loading"`     | Accessible name (the root is an indeterminate `progressbar`).       |
| `ref`     | `HTMLDivElement \| null`                              | `null`          | `bind:ref` to the root element.                                     |
| `class`   | `string`                                              | `""`            | Extra classes merged onto the root (via tailwind-merge).            |

All other attributes (`id`, `aria-*`, `data-*`, …) spread onto the root `<div>`.

## Accessibility

- The root is `role="progressbar"` with an `aria-label` and **no** `aria-valuenow` — an
  **indeterminate** progressbar — plus `aria-busy="true"`. The SVG art is `aria-hidden`.
- Honours `prefers-reduced-motion: reduce`: the morph and spin stop, leaving a single resting shape.
- The `contained` variant meets ≥3:1 indicator-on-container contrast in both light and dark.

## Theming

Colours resolve through a single `--li-accent` token (and `--li-container` for the contained fill),
set per `[data-tint]` from the theme's `--surface-*-accent` / `--surface-*-bg` tokens. Light/dark is
automatic via the `--L`/`--D` space-toggle — no `.dark` selector.

## Scope

**v1 ships** (in scope):

- **Variants** — `uncontained` (bare shape) and `contained` (shape on a filled, rounded surface).
- **Mode** — indeterminate only: a continuous morph + spin while mounted.
- **Animation** — a curated Material shape morph (circle → cushion → diamond → pill) via SVG `d`
  interpolation, plus a steady rotation. An honest approximation of the AndroidX spring morph.
- **Sizes** — `sm` / `md` / `lg` (`md` = the M3 48dp / 38dp default).
- **Theming** — retintable (`neutral` / `primary` / `secondary` / `tertiary`); automatic light/dark.
- **Reduced motion** — a static resting shape under `prefers-reduced-motion`.

**Deferred** (next releases):

- **Determinate mode** — a `progress` (0→1) prop where the morph / sweep tracks progress.
- **True spring-physics morph** — the exact AndroidX seven-shape spring sequence and M3 easing.
- **Custom shape sequence** — a `shapes` prop to supply a custom morph set.
- **Completion hand-off** — morph-to-checkmark / success state when loading finishes.
- **Container shape options** — configurable container shapes (squircle / cookie variants).

## Acknowledgements

The design was synthesised from **Material Design 3 (Expressive) — Loading indicator** and the
**Material 3 Jetpack Compose** `LoadingIndicator` / `ContainedLoadingIndicator` API (the variant
split, colour roles, polygon-morph model, and default sizing). `@smuit/loading-indicator` is an
**independent implementation** on smuit's own design tokens and Svelte 5 conventions — it does not
depend on, bundle, or copy code from either project; they informed the anatomy, variants, behaviour,
and accessibility model only.

## License

MIT © wimwian
