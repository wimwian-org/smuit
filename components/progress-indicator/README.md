# @smuit/progress-indicator

A Material Design 3–style **linear progress indicator** for Svelte 5, built on
[`@smuit/theme`](../../packages/theme) design tokens. Determinate and indeterminate modes,
retintable, three track heights, dark-mode-automatic, and accessible.

```svelte
<script>
    import { ProgressIndicator } from '@smuit/progress-indicator';
</script>

<!-- determinate — value is a fraction of max (default max = 1) -->
<ProgressIndicator value={0.6} aria-label="Loading" />

<!-- indeterminate — omit value, or set `indeterminate` -->
<ProgressIndicator indeterminate aria-label="Working" />

<!-- retinted + sized -->
<ProgressIndicator value={0.3} max={1} tint="error" size="lg" aria-label="Upload" />
```

## Install

```bash
pnpm add @smuit/progress-indicator
```

Peer dependencies: `@smuit/theme`, `svelte` ^5, `tailwindcss` ^4. Import the theme once at your
app root (`@import '@smuit/theme';`).

## Props

| Prop            | Type                                                             | Default     | Notes                                                                       |
| --------------- | ---------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `value`         | `number \| null`                                                 | `undefined` | Progress as a **fraction of `max`** (Material model). Omit ⇒ indeterminate. |
| `max`           | `number`                                                         | `1`         | Upper bound for `value`.                                                    |
| `indeterminate` | `boolean`                                                        | —           | Force the animated mode. Implied when `value` is null/undefined.            |
| `tint`          | `neutral \| primary \| secondary \| error \| warning \| success` | `primary`   | Accent for the indicator + tonal track.                                     |
| `size`          | `sm \| md \| lg`                                                 | `md`        | Track height — 4 / 8 / 12px.                                                |
| `ref`           | `HTMLDivElement \| null`                                         | `null`      | `bind:ref` to the root `<div>`.                                             |
| `class`         | `string`                                                         | `''`        | Extra classes, merged via `tailwind-merge`.                                 |

All other attributes (`aria-label`, `id`, …) are forwarded to the root `<div role="progressbar">`.

### Value model

`value` is a **fraction of `max`** — `value={0.6}` with the default `max={1}` is 60%; `value={50}`
with `max={200}` is 25%. This follows Material Web (not MUI's 0–100 percentage). Values are clamped
into `[0, max]`.

## Accessibility

- Renders `role="progressbar"`. Determinate bars expose `aria-valuenow` / `aria-valuemin` /
  `aria-valuemax` and a human `aria-valuetext` (e.g. `"60%"`); indeterminate bars omit
  `aria-valuenow` so assistive tech announces a busy/indeterminate state.
- A progress bar has **no intrinsic label** — supply one via `aria-label` or `aria-labelledby`.
- The indeterminate animation respects `prefers-reduced-motion: reduce` (a gentle opacity pulse
  replaces the slide).
- AA contrast holds in both light and dark — the accent and tonal track read theme tokens that
  flip automatically.

## Scope

**v1 (this release)** ships the **linear** indicator only:

- ✅ **Linear** track + indicator
- ✅ **Determinate** (`value` / `max`) and **indeterminate** (animated) modes
- ✅ `tint` (neutral · primary · secondary · error · warning · success), `size` (sm · md · lg)
- ✅ `prefers-reduced-motion` fallback, full ARIA

**Deferred — next:**

- ⛔ **Circular** indicator (ring shape, size/stroke tokens)
- ⛔ **Four-color** indeterminate mode
- ⛔ Linear **buffer** value + buffer-dots track
- ⛔ Built-in label / inline value-text slot

See [`progress-indicator-design.md`](./progress-indicator-design.md) for the full design spec and
MVP rationale.

## Acknowledgements

`@smuit/progress-indicator` is an **independent implementation** on smuit design tokens and
Svelte 5 runes. Its design is **synthesised from**:

- **Material Web** — [`<md-linear-progress>` / `<md-circular-progress>`](https://github.com/material-components/material-web/blob/main/docs/components/progress.md)
  (the visual model, `value`/`max` numeric model, and token vocabulary), and
- **MUI** — `LinearProgress` / `CircularProgress` (API ergonomics, the determinate/indeterminate
  vocabulary).

It does **not** depend on, vendor, or copy `@material/*` or `@mui/*` — those projects are credited
as design references only.

## License

MIT © Anand Panchapakesan
