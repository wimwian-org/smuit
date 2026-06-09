# @smuit/tabs

Material Design 3–style **tabs** for Svelte 5, built on the smuit design tokens. A composable
`Tabs.Root` / `Tabs.List` / `Tabs.Trigger` / `Tabs.Content` set in two variants — **bold** (M3
Primary: top-level, emphatic, with leading icons) and **subtle** (M3 Secondary: quieter, nested
sub-navigation) — with `sm`/`md` sizes, tint retinting, automatic/manual activation, **horizontal or
vertical** orientation, **inline or stacked** leading icons, optional **badges**, **overflow
scrolling** with prev/next affordances, and an **animated active indicator** that slides under the
active tab (snapping under `prefers-reduced-motion`). Themed and dark-mode aware out of the box.

> Built from the [tabs design spec](./tabs-design.md). Behaviour (the `tablist`/`tab`/`tabpanel`
> roles, `aria-controls`/`aria-labelledby` wiring, roving arrow-key navigation, the orientation axis,
> and activation mode) is provided by the headless [`bits-ui`](https://bits-ui.com) `Tabs` primitive;
> this package layers on the smuit theming, the variant/size/tint axes, the icon + badge slots, the
> stacked layout, the scroll affordances, and the sliding indicator.

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

| Part           | Element / role          | Notes                                                                                                                                 |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `Tabs.Root`    | `<div>`                 | State owner. `bind:value`, `variant`, `size`, `tint`, `orientation`, `iconLayout`, `activationMode`, `loop`, `disabled`.              |
| `Tabs.List`    | `<div role="tablist">`  | The trigger row/column + the track + the sliding active indicator. `scrollable` adds an overflow viewport with prev/next affordances. |
| `Tabs.Trigger` | `<button role="tab">`   | Needs a `value`. Optional `icon` snippet (inline or stacked) + label children + optional `badge` snippet; per-trigger `disabled`.     |
| `Tabs.Content` | `<div role="tabpanel">` | Needs a matching `value`. The panel shown when its tab is active.                                                                     |

### Props (axes)

| Prop             | On               | Values                                                                             | Default      |
| ---------------- | ---------------- | ---------------------------------------------------------------------------------- | ------------ |
| `variant`        | `Root`           | `bold` · `subtle`                                                                  | `bold`       |
| `size`           | `Root`           | `sm` · `md`                                                                        | `md`         |
| `tint`           | `Root`           | `neutral` · `primary` · `secondary` · `tertiary` · `error` · `warning` · `success` | `neutral`    |
| `orientation`    | `Root`           | `horizontal` · `vertical`                                                          | `horizontal` |
| `iconLayout`     | `Root`           | `inline` (icon before label) · `stacked` (icon above label, M3 stacked)            | `inline`     |
| `activationMode` | `Root`           | `automatic` (focus selects) · `manual` (Enter/Space selects)                       | `automatic`  |
| `loop`           | `Root`           | `boolean` — wrap keyboard navigation                                               | `true`       |
| `disabled`       | `Root`/`Trigger` | `boolean` (on `Root` = whole set; on `Trigger` = that tab)                         | `false`      |
| `scrollable`     | `List`           | `boolean` — overflow-scroll viewport + prev/next affordances                       | `false`      |
| `icon`           | `Trigger`        | `Snippet` — leading icon (inline or stacked per `iconLayout`)                      | —            |
| `badge`          | `Trigger`        | `Snippet` — trailing count chip; an **empty** snippet renders a dot                | —            |

## Scope

This release ships a fully-themed, accessible tab set in **both axes**:

- **Variants** — `bold` (M3 Primary) and `subtle` (M3 Secondary).
- **Sizes** — `sm` (~40px) and `md` (~48px).
- **Tints** — neutral (default) + primary/secondary/tertiary/error/warning/success, retinting the
  indicator, active label/icon, hover/pressed state layers, and focus outline together.
- **Orientation** — **horizontal** or **vertical** (the list sits beside the panel; the indicator,
  track, and roving arrow-key axis follow).
- **Trigger content** — text label + optional leading icon (**inline** before the label or
  **stacked** above it) + optional trailing **badge** (a count chip, or an empty dot).
- **Overflow scrolling** — opt a `Tabs.List` into a scroll viewport with `scrollable`; the active
  tab is kept in view and **prev/next affordance buttons** appear only while the row overflows.
- **Active indicator** — a single bar that **slides + resizes** between tabs on the active axis, with
  a `prefers-reduced-motion` **static (snap)** fallback.
- **Activation** — `automatic` or `manual`, plus `loop` keyboard wrapping.
- **States** — active · inactive · hover · focus-visible · disabled (per-trigger and whole-set).
- **A11y** — bits-ui roles + ARIA wiring, arrow-key roving + Home/End, visible AA focus.

**Deferred (next release):**

- **Dynamic tabs** (closeable / addable, with keyboard/focus reconciliation).

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
