# @smuit/ripple

Material UI–style **touch ripple** for Svelte 5. Zero dependencies, no stylesheet — a
[Web Animations API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API)
ripple delivered as a `use:ripple` action (plus a `<Ripple>` convenience component).

On pointer-down (and keyboard activation) a circle expands from the contact point to
cover the element and fades out as it grows. The host is made
`position: relative; overflow: hidden` automatically so ripples stay clipped.

## Variants

Five sizes set the expansion **duration** — geometric around `md` (600 ms, ratio ≈ 1.4),
matching the smuit theme's size ramps:

| variant | duration         |
| ------- | ---------------- |
| `xs`    | 300 ms           |
| `sm`    | 430 ms           |
| `md`    | 600 ms (default) |
| `lg`    | 840 ms           |
| `xl`    | 1180 ms          |

## Install

```sh
pnpm add @smuit/ripple
```

`svelte@^5` is a peer dependency.

## Usage

### Action — `use:ripple`

```svelte
<script>
    import { ripple } from '@smuit/ripple';
</script>

<button use:ripple={{ variant: 'lg' }}>Click me</button>

<!-- centred, custom colour & opacity -->
<div use:ripple={{ variant: 'md', color: 'var(--color-primary-500)', opacity: 0.25, center: true }}>Tap anywhere</div>
```

### Component — `<Ripple>`

For when you don't control the host element's positioning:

```svelte
<script>
    import { Ripple } from '@smuit/ripple';
</script>

<Ripple variant="xl" color="currentColor">
    <button>Ripple wraps me</button>
</Ripple>
```

## Options

| option     | type                                   | default          | description                                 |
| ---------- | -------------------------------------- | ---------------- | ------------------------------------------- |
| `variant`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`           | expansion-duration variant                  |
| `color`    | `string`                               | `'currentColor'` | ripple colour (any CSS colour)              |
| `opacity`  | `number`                               | `0.3`            | peak opacity at the start                   |
| `center`   | `boolean`                              | `false`          | emit from the centre, not the contact point |
| `disabled` | `boolean`                              | `false`          | suppress ripples                            |

## Accessibility

- Fires on `Enter` / `Space` keydown as well as pointer-down, so keyboard-activated
  controls ripple too.
- Honours `prefers-reduced-motion: reduce` — a brief, motionless fade replaces the
  expansion.

## Exports

```ts
import { ripple, Ripple, rippleVariants } from '@smuit/ripple';
import type { RippleVariant, RippleOptions } from '@smuit/ripple';
```

MIT © wimwian
