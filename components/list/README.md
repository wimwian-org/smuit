# @wimwian-org/list

Material Design 3–style **list** for Svelte 5, built on the smuit design tokens. A composable
`List.Root` / `List.Item` / `List.Subheader` set in two M3 design styles — **Baseline** (flat,
edge-to-edge rows with optional dividers) and **Expressive** (filled, grouped rows whose corners
morph by position) — with leading/trailing slots, one/two/three-line layouts, static / button / link
rows, a single/multi **selection** model (checkbox · radio · switch), **roving** arrow-key
navigation, and sticky section **subheaders**. Themed and dark-mode aware out of the box.

> Built from the [list design spec](./list-design.md). The list is presentational (there is no
> headless primitive for a generic list); accessibility comes from native `<ul>`/`<li>` semantics
> (`role="list"`, or `role="listbox"` with `role="option"` rows once a selection model is set) plus
> real `<a>`/`<button>` elements for interactive rows.

## Install

```sh
pnpm add @wimwian-org/list
```

`@wimwian-org/theme`, `svelte@^5`, and `tailwindcss@^4` are peer dependencies.

## Usage

```svelte
<script>
    import { List } from '@wimwian-org/list';
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

### Selection

Set `selection` to `"single"` or `"multiple"` and give each selectable row a `value`. The container
becomes a `role="listbox"`, rows become `role="option"` toggles with a trailing control, and
arrow-key roving navigation turns on automatically. Bind `value` to read/write the choice.

```svelte
<script>
    let assignee = $state('ada'); // single → string
    let labels = $state([]); // multiple → string[]
</script>

<!-- Single choice (radio control by default) -->
<List.Root selection="single" bind:value={assignee} aria-label="Assignee">
    <List.Item value="ada">Ada Lovelace</List.Item>
    <List.Item value="grace">Grace Hopper</List.Item>
</List.Root>

<!-- Multi choice (checkbox by default; here a switch), with subheaders -->
<List.Root selection="multiple" control="switch" bind:value={labels} aria-label="Labels">
    <List.Subheader sticky>Status</List.Subheader>
    <List.Item value="urgent">Urgent</List.Item>
    <List.Item value="blocked">Blocked</List.Item>
    <List.Subheader sticky>Area</List.Subheader>
    <List.Item value="design" supporting="UI & UX">Design</List.Item>
</List.Root>
```

### Composition — the `List.*` parts

`List.Root` is the container (`<ul>`); it owns the shared `variant`, `tint`, `divider`, the optional
`selection` model, and `roving`, and publishes them to the items via context. Each `List.Item` is a
row: a leading slot, the headline (children), optional supporting text, and a trailing slot. An
item's element is chosen from its props — `value` in a selectable list → `role="option"`, else
`href` → `<a>` (link), `onclick`/`type="button"` → `<button>`, otherwise a static `<div>`.
`List.Subheader` is a presentational section label between groups (in Expressive it starts a fresh
rounded group).

## Props

### `List.Root`

| Prop            | Type                                                  | Default      | Description                                                                   |
| --------------- | ----------------------------------------------------- | ------------ | ----------------------------------------------------------------------------- |
| `variant`       | `'baseline' \| 'expressive'`                          | `'baseline'` | M3 design style.                                                              |
| `tint`          | `'neutral' \| 'primary' \| 'secondary' \| 'tertiary'` | `'neutral'`  | Tint — colours the fill, hover/pressed/selected layers, and focus outline.    |
| `divider`       | `boolean`                                             | `false`      | Draw a divider between rows (baseline only).                                  |
| `selection`     | `'none' \| 'single' \| 'multiple'`                    | `'none'`     | Selection model; `single`/`multiple` turn rows with a `value` into options.   |
| `value`         | `string \| string[]`                                  | —            | `bind:value` — the selected key (single) or keys (multiple).                  |
| `control`       | `'checkbox' \| 'radio' \| 'switch'`                   | _auto_       | Default trailing control (radio for single, checkbox for multiple).           |
| `onValueChange` | `(value: string \| string[]) => void`                 | —            | Called with the next selection.                                               |
| `roving`        | `boolean`                                             | `false`      | Roving arrow-key focus across interactive rows (always on under `selection`). |
| `ref`           | `HTMLUListElement \| null`                            | `null`       | `bind:ref` to the underlying `<ul>`.                                          |
| `class`         | `string`                                              | —            | Extra classes merged onto the root.                                           |

All other native `<ul>` attributes pass straight through.

### `List.Item`

| Prop         | Type                                | Default  | Description                                                                                                                 |
| ------------ | ----------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `supporting` | `string`                            | —        | Secondary line; promotes the row to a two-line layout.                                                                      |
| `lines`      | `'one' \| 'two' \| 'three'`         | _auto_   | Override the layout (defaults to `two` when `supporting` is set; `three` clamps the supporting block to two wrapped lines). |
| `value`      | `string`                            | —        | Selection key; makes the row a `role="option"` in a selectable list.                                                        |
| `control`    | `'checkbox' \| 'radio' \| 'switch'` | _list_   | Override the trailing selection control for this row.                                                                       |
| `type`       | `'text' \| 'button' \| 'link'`      | `'text'` | Interactivity (`link` is implied by `href`, `button` by `onclick`).                                                         |
| `href`       | `string`                            | —        | Renders the row as an `<a>`.                                                                                                |
| `target`     | `string`                            | —        | Anchor target (with `href`).                                                                                                |
| `disabled`   | `boolean`                           | `false`  | Dimmed and removed from the tab/roving order.                                                                               |
| `leading`    | `Snippet`                           | —        | Leading slot (icon / avatar / image).                                                                                       |
| `trailing`   | `Snippet`                           | —        | Trailing slot (icon / short text).                                                                                          |
| `ref`        | `HTMLElement \| null`               | `null`   | `bind:ref` to the underlying row element.                                                                                   |
| `class`      | `string`                            | —        | Extra classes merged onto the row.                                                                                          |

All other native attributes (`onclick`, `id`, `aria-*`, …) pass through to the row element.

### `List.Subheader`

| Prop     | Type                    | Default | Description                                                     |
| -------- | ----------------------- | ------- | --------------------------------------------------------------- |
| `sticky` | `boolean`               | `false` | Pin to the top of the scroll container while its group scrolls. |
| `ref`    | `HTMLLIElement \| null` | `null`  | `bind:ref` to the underlying `<li>`.                            |
| `class`  | `string`                | —       | Extra classes merged onto the subheader.                        |

## Scope

**Ships now:** a composable `List.Root` / `List.Item` / `List.Subheader` set; **baseline** and
**expressive** variants; one/two/three-line items; leading/trailing snippet slots; supporting text;
static / button / link interactivity with a hover state layer and visible focus; enabled / hover /
focus / selected / disabled states; **single & multiple selection** with checkbox / radio / switch
controls and `listbox`/`option` semantics; **roving** arrow-key navigation; **section subheaders**
(optionally sticky); the Expressive position-based corner shape (including subheader-delimited
groups) and **press shape-morph**; tint + light/dark theming.

**Deferred to a later release:** drag-to-reorder and swipe actions.

## Accessibility

- `List.Root` is a `<ul role="list">`; with a `selection` model it becomes `role="listbox"`
  (`aria-multiselectable` for multiple). The explicit role keeps semantics under `display:flex`.
- Selectable rows are `role="option"` with `aria-selected`; the trailing control is a visual,
  `aria-hidden` indicator (the option row carries the selection semantics). Provide an `aria-label`
  on the root naming the choice.
- Roving navigation keeps a single row tab-reachable (`tabindex="0"`); **Arrow Up/Down** and
  **Home/End** move focus (no wrap), and **Space/Enter** toggle a focused option.
- Non-selectable interactive rows are real `<a>`/`<button>` elements, so role, focusability, and
  keyboard activation come from the platform; the headline is the accessible name. A trailing
  interactive control needs its own `aria-label`.
- Disabled items set `aria-disabled` and leave the tab/roving order.
- The focus-visible outline meets AA contrast in both light and dark via the tint accent token, and
  the Expressive press morph is gated behind `prefers-reduced-motion`.

## Acknowledgements

The design spec this component implements was synthesised from two references:

- [**Material Design 3** — Lists](https://m3.material.io/components/lists/overview) (the Baseline
  and Expressive design styles).
- [**Material Web** list](https://github.com/material-components/material-web/blob/main/docs/components/list.md).

`@wimwian-org/list` is an **independent implementation** on smuit's own design tokens and Svelte 5
conventions. It does not depend on, bundle, or copy code from either project — they informed the
anatomy, behaviour, and accessibility model only.

MIT © wimwian
