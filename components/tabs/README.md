# @smuit/tabs

Material Design 3–style **tabs** for Svelte 5, built on the smuit design tokens. A composable
`Tabs.Root` / `Tabs.List` / `Tabs.Trigger` / `Tabs.Content` set in two variants — **bold** (M3
Primary: top-level, emphatic, with optional inline leading icons) and **subtle** (M3 Secondary:
quieter, nested sub-navigation) — with `sm`/`md` sizes, tint retinting, automatic/manual activation,
and an **animated active indicator** that slides under the active tab (snapping under
`prefers-reduced-motion`). Themed and dark-mode aware out of the box.

> Built from the [tabs design spec](./tabs-design.md). Behaviour (the `tablist`/`tab`/`tabpanel`
> roles, `aria-controls`/`aria-labelledby` wiring, roving arrow-key navigation, and activation mode)
> is provided by the headless [`bits-ui`](https://bits-ui.com) `Tabs` primitive; this package layers
> on the smuit theming, the variant/size/tint axes, the icon slot, and the sliding indicator.

## Install

```sh
pnpm add @smuit/tabs
```

`@smuit/theme`, `svelte@^5`, and `tailwindcss@^4` are peer dependencies. `bits-ui` is a runtime
dependency (the headless behaviour layer).

## Usage

```svelte
<script>
    import { Tabs } from '@smuit/tabs';
    let active = $state('overview');
</script>

<Tabs.Root bind:value={active} variant="bold" tint="primary">
    <Tabs.List>
        <Tabs.Trigger value="overview">
            {#snippet icon()}<HomeIcon />{/snippet}
            Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings" disabled>Settings</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="overview">…overview panel…</Tabs.Content>
    <Tabs.Content value="activity">…activity panel…</Tabs.Content>
    <Tabs.Content value="settings">…settings panel…</Tabs.Content>
</Tabs.Root>

<!-- Subtle (nested) tabs, manual activation -->
<Tabs.Root value="a" variant="subtle" size="sm" activationMode="manual">
    <Tabs.List>
        <Tabs.Trigger value="a">All</Tabs.Trigger>
        <Tabs.Trigger value="b">Starred</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="a">…</Tabs.Content>
    <Tabs.Content value="b">…</Tabs.Content>
</Tabs.Root>
```

### Parts

| Part           | Element / role          | Notes                                                                                                |
| -------------- | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `Tabs.Root`    | `<div>`                 | State owner. `bind:value`, `variant`, `size`, `tint`, `activationMode`, `loop`, `disabled`.          |
| `Tabs.List`    | `<div role="tablist">`  | The trigger row + the bottom track + the sliding active indicator.                                   |
| `Tabs.Trigger` | `<button role="tab">`   | Needs a `value`. Optional `icon` snippet (inline, leading) + label children; per-trigger `disabled`. |
| `Tabs.Content` | `<div role="tabpanel">` | Needs a matching `value`. The panel shown when its tab is active.                                    |

### Props (axes)

| Prop             | Values                                                                             | Default     |
| ---------------- | ---------------------------------------------------------------------------------- | ----------- |
| `variant`        | `bold` · `subtle`                                                                  | `bold`      |
| `size`           | `sm` · `md`                                                                        | `md`        |
| `tint`           | `neutral` · `primary` · `secondary` · `tertiary` · `error` · `warning` · `success` | `neutral`   |
| `activationMode` | `automatic` (focus selects) · `manual` (Enter/Space selects)                       | `automatic` |
| `loop`           | `boolean` — wrap keyboard navigation                                               | `true`      |
| `disabled`       | `boolean` (on `Root` = whole set; on `Trigger` = that tab)                         | `false`     |

## Scope

**v1 (this release)** ships a fully-themed, accessible, **horizontal** tab set:

- **Variants** — `bold` (M3 Primary) and `subtle` (M3 Secondary).
- **Sizes** — `sm` (~40px) and `md` (~48px).
- **Tints** — neutral (default) + primary/secondary/tertiary/error/warning/success, retinting the
  indicator, active label/icon, hover/pressed state layers, and focus outline together.
- **Trigger content** — text label + optional **inline leading icon**.
- **Active indicator** — a single bar that **slides + resizes** between tabs, with a
  `prefers-reduced-motion` **static (snap)** fallback.
- **Activation** — `automatic` or `manual`, plus `loop` keyboard wrapping.
- **States** — active · inactive · hover · focus-visible · disabled (per-trigger and whole-set).
- **A11y** — bits-ui roles + ARIA wiring, arrow-key roving + Home/End, visible AA focus.

**Deferred (next releases):**

- **Overflow / scrollable** tab bars (scroll affordances, `scrollToTab`).
- **Vertical orientation** (bits-ui supports it; v1 styles horizontal only).
- **Stacked icon layout** (icon above the label, for bold tabs).
- **Badge / count** on a tab.
- **Dynamic tabs** (closeable / addable).

## Acknowledgements

This component's design was synthesised from **Material Design 3 — Tabs** (the Primary and Secondary
tab types and the active-indicator language) and the **Material Web** tabs component
([`@material/web`](https://github.com/material-components/material-web)), with behaviour backed by the
headless [`bits-ui`](https://bits-ui.com) `Tabs` primitive.

`@smuit/tabs` is an **independent implementation** on smuit's own design tokens and Svelte 5
conventions — it does **not** depend on, bundle, or copy code from Material Design or Material Web;
those projects informed the anatomy, behaviour, and accessibility model only. `bits-ui` _is_ a
runtime dependency, used as the headless behaviour layer (the standard pattern for smuit interactive
bits).

## License

[MIT](./LICENSE) © Anand Panchapakesan
