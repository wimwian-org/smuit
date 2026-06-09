# @wimwian-org/loading-indicator

A shape-morphing **loading indicator** for Svelte 5 — Material Design 3 Expressive's replacement for
the circular spinner — built on smuit design tokens.

The active indicator **morphs through a curated set of Material shapes** while rotating. It ships two
variants (**uncontained** and **contained**), three sizes, retinting, a `prefers-reduced-motion`
fallback, and three modes: **indeterminate** (default), **determinate** (a `progress` sweep), and a
**completion** checkmark.

```svelte
<script>
    import { LoadingIndicator } from '@wimwian-org/loading-indicator';
</script>

<!-- bare morphing shape (indeterminate) -->
<LoadingIndicator />

<!-- framed in a filled container, larger, secondary tint -->
<LoadingIndicator variant="contained" size="lg" tint="secondary" />

<!-- determinate: a sweep arc tracks progress (0→1) -->
<LoadingIndicator progress={0.6} />

<!-- completion hand-off: a success checkmark -->
<LoadingIndicator complete />

<!-- a cookie-outlined container -->
<LoadingIndicator variant="contained" containerShape="cookie" />

<!-- only while a request is in flight -->
{#if loading}
    <LoadingIndicator label="Fetching results" />
{/if}
```

## Install

Published to **GitHub Packages** under the `@wimwian-org` scope. GitHub Packages requires auth even to install, so add this to your project's `.npmrc` first:

```ini
@wimwian-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}   # a PAT with read:packages
```

```bash
pnpm add @wimwian-org/loading-indicator
```

`@wimwian-org/theme`, `svelte`, and `tailwindcss` are peer dependencies. Import the theme once in your app
so the tokens are available.

## Props

| Prop             | Type                                                  | Default         | Description                                                                        |
| ---------------- | ----------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------- |
| `variant`        | `"uncontained" \| "contained"`                        | `"uncontained"` | Bare shape, or shape on a filled, rounded container surface.                       |
| `size`           | `"sm" \| "md" \| "lg"`                                | `"md"`          | Footprint. `md` = the M3 default (48dp container / 38dp indicator).                |
| `tint`           | `"neutral" \| "primary" \| "secondary" \| "tertiary"` | `"primary"`     | Accent palette — indicator colour and contained fill.                              |
| `containerShape` | `"rounded" \| "squircle" \| "cookie"`                 | `"rounded"`     | Container outline (`contained` only).                                              |
| `progress`       | `number \| null`                                      | `null`          | Determinate value in `[0, 1]` (clamped). `null` = indeterminate; `>= 1` completes. |
| `shapes`         | `string[]`                                            | curated set     | Custom morph sequence (SVG `d` strings, `M + 4·C + Z`). One entry renders static.  |
| `complete`       | `boolean`                                             | `false`         | Completion hand-off — a success checkmark; also triggered by `progress >= 1`.      |
| `label`          | `string`                                              | `"Loading"`     | Accessible name (the root is a `progressbar`).                                     |
| `ref`            | `HTMLDivElement \| null`                              | `null`          | `bind:ref` to the root element.                                                    |
| `class`          | `string`                                              | `""`            | Extra classes merged onto the root (via tailwind-merge).                           |

All other attributes (`id`, `aria-*`, `data-*`, …) spread onto the root `<div>`.

`LOADING_INDICATOR_SHAPES` (a `{ circle, cushion, diamond, pill }` record) and
`DEFAULT_SHAPE_SEQUENCE` are exported so you can build a custom `shapes` set from the curated paths.

## Accessibility

- The root is `role="progressbar"` with an `aria-label`. **Indeterminate** (`progress` unset) omits
  `aria-valuenow` and sets `aria-busy="true"`; **determinate** exposes `aria-valuemin`/`max`/`now`
  (0–100); **completion** sets `aria-valuenow="100"` and clears `aria-busy`. The SVG art is
  `aria-hidden`.
- Honours `prefers-reduced-motion: reduce`: the morph, spin, sweep tween, and checkmark draw stop,
  leaving a single resting shape.
- The `contained` variant meets ≥3:1 indicator-on-container contrast in both light and dark.

## Theming

Colours resolve through a single `--li-accent` token (and `--li-container` for the contained fill),
set per `[data-tint]` from the theme's `--surface-*-accent` / `--surface-*-bg` tokens. Light/dark is
automatic via the `--L`/`--D` space-toggle — no `.dark` selector.

## Scope

**Ships** (in scope):

- **Variants** — `uncontained` (bare shape) and `contained` (shape on a filled surface).
- **Modes** — indeterminate (continuous morph + spin), determinate (`progress` sweep arc), and a
  completion checkmark (`complete` / `progress >= 1`).
- **Animation** — a curated Material shape morph (circle → cushion → diamond → pill) via SVG `d`
  interpolation, plus a steady rotation. An honest approximation of the AndroidX spring morph.
  Override it with a custom `shapes` sequence.
- **Sizes** — `sm` / `md` / `lg` (`md` = the M3 48dp / 38dp default).
- **Container shapes** — `rounded` (default) / `squircle` / `cookie` outlines on the contained variant.
- **Theming** — retintable (`neutral` / `primary` / `secondary` / `tertiary`); automatic light/dark.
- **Reduced motion** — a static resting shape under `prefers-reduced-motion`.

**Deferred** (next):

- **True spring-physics morph** — the exact AndroidX seven-shape spring sequence and M3 easing; the
  current morph is an honest curated-SVG approximation.

## Acknowledgements

The design was synthesised from **Material Design 3 (Expressive) — Loading indicator** and the
**Material 3 Jetpack Compose** `LoadingIndicator` / `ContainedLoadingIndicator` API (the variant
split, colour roles, polygon-morph model, and default sizing). `@wimwian-org/loading-indicator` is an
**independent implementation** on smuit's own design tokens and Svelte 5 conventions — it does not
depend on, bundle, or copy code from either project; they informed the anatomy, variants, behaviour,
and accessibility model only.

## License

MIT © wimwian
