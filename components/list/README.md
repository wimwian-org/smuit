# @smuit/list

Material Design 3–style **list** for Svelte 5, built on the smuit design tokens. A composable
`List.Root` / `List.Item` pair in two M3 design styles — **Baseline** (flat, edge-to-edge rows with
optional dividers) and **Expressive** (filled, grouped rows whose corners morph by position) — with
leading/trailing slots, one- and two-line layouts, and static / button / link rows. Themed and
dark-mode aware out of the box.

> Built from the [list design spec](./list-design.md). The list is presentational (there is no
> headless primitive for a generic list); accessibility comes from native `<ul>`/`<li>` semantics
> (with an explicit `role="list"` so `display:flex` doesn't strip them) plus real `<a>`/`<button>`
> elements for interactive rows.

## Install

```sh
pnpm add @smuit/list
```

`@smuit/theme`, `svelte@^5`, and `tailwindcss@^4` are peer dependencies.

## Usage

```svelte
<script>
    import { List } from '@smuit/list';
</script>

<!-- Baseline (default), with a divider between rows -->
<List.Root divider>
    <List.Item supporting="Software engineer" href="/people/ada">
        {#snippet leading()}<Avatar />{/snippet}
        Ada Lovelace
        {#snippet trailing()}<ChevronIcon />{/snippet}
    </List.Item>
    <List.Item supporting="Designer" href="/people/grace">Grace Hopper</List.Item>
</List.Root>

<!-- Expressive — filled, grouped, position-rounded rows -->
<List.Root variant="expressive" tint="secondary">
    <List.Item onclick={() => save()}>Save</List.Item>
    <List.Item onclick={() => share()}>Share</List.Item>
    <List.Item disabled>Delete</List.Item>
</List.Root>
```

### Composition — the `List.*` parts

`List.Root` is the `<ul role="list">` container; it owns the shared `variant`, `tint`, and `divider`
and publishes them to the items via context. Each `List.Item` is a row: a leading slot, the headline
(children), optional supporting text, and a trailing slot. An item's element is chosen from its
props — `href` → `<a>` (link), `onclick`/`type="button"` → `<button>`, otherwise a static `<div>`.

## Props

### `List.Root`

| Prop      | Type                                                  | Default      | Description                                                       |
| --------- | ----------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| `variant` | `'baseline' \| 'expressive'`                          | `'baseline'` | M3 design style.                                                  |
| `tint`    | `'neutral' \| 'primary' \| 'secondary' \| 'tertiary'` | `'neutral'`  | Tint — colours the fill, hover/pressed layers, and focus outline. |
| `divider` | `boolean`                                             | `false`      | Draw a divider between rows (baseline only).                      |
| `ref`     | `HTMLUListElement \| null`                            | `null`       | `bind:ref` to the underlying `<ul>`.                              |
| `class`   | `string`                                              | —            | Extra classes merged onto the root.                               |

All other native `<ul>` attributes pass straight through.

### `List.Item`

| Prop         | Type                           | Default  | Description                                                         |
| ------------ | ------------------------------ | -------- | ------------------------------------------------------------------- |
| `supporting` | `string`                       | —        | Secondary line; promotes the row to a two-line layout.              |
| `lines`      | `'one' \| 'two'`               | _auto_   | Override the layout (defaults to `two` when `supporting` is set).   |
| `type`       | `'text' \| 'button' \| 'link'` | `'text'` | Interactivity (`link` is implied by `href`, `button` by `onclick`). |
| `href`       | `string`                       | —        | Renders the row as an `<a>`.                                        |
| `target`     | `string`                       | —        | Anchor target (with `href`).                                        |
| `disabled`   | `boolean`                      | `false`  | Dimmed and removed from the tab order.                              |
| `leading`    | `Snippet`                      | —        | Leading slot (icon / avatar / image).                               |
| `trailing`   | `Snippet`                      | —        | Trailing slot (icon / short text).                                  |
| `ref`        | `HTMLElement \| null`          | `null`   | `bind:ref` to the underlying row element.                           |
| `class`      | `string`                       | —        | Extra classes merged onto the row.                                  |

All other native attributes (`onclick`, `id`, `aria-*`, …) pass through to the row element.

## Scope

This is the **v1 (MVP)** release defined by the [design spec](./list-design.md).

**Ships now:** a composable `List.Root` / `List.Item` pair; **baseline** and **expressive**
variants; one- and two-line items; leading/trailing snippet slots; supporting text; static / button
/ link interactivity with a hover state layer and visible focus; enabled / hover / focus / disabled
states; the Expressive position-based corner shape (first / middle / last / only-child, derived from
DOM order); tint + light/dark theming; and `role="list"` / native-element accessibility.

**Deferred to a later release:** selection (`selected` state + checkbox / radio / switch trailing
controls and the single/multi-select model); three-line layout; roving arrow-key navigation;
drag-reorder and swipe actions; section subheaders / grouping; and the Expressive press
shape-morph animation.

## Accessibility

- `List.Root` is a `<ul role="list">` — the explicit role keeps list semantics under `display:flex`;
  items are native `<li>`.
- Interactive rows are real `<a>`/`<button>` elements, so role, focusability, and keyboard
  activation come from the platform; the headline is the accessible name. A trailing interactive
  control needs its own `aria-label`.
- Disabled items set `aria-disabled` and leave the tab order.
- The focus-visible outline meets AA contrast in both light and dark via the tint accent token.

## Acknowledgements

The design spec this component implements was synthesised from two references:

- [**Material Design 3** — Lists](https://m3.material.io/components/lists/overview) (the Baseline
  and Expressive design styles).
- [**Material Web** list](https://github.com/material-components/material-web/blob/main/docs/components/list.md).

`@smuit/list` is an **independent implementation** on smuit's own design tokens and Svelte 5
conventions. It does not depend on, bundle, or copy code from either project — they informed the
anatomy, behaviour, and accessibility model only.

MIT © wimwian
