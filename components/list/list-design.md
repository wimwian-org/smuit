# List — Design Spec

A design breakdown (no implementation) for the `@wimwian-org/list` bit: architecture, design elements,
and key behaviours. Synthesised from two references:

1. **Material Design 3** — Lists overview/specs (<https://m3.material.io/components/lists/overview>),
   covering **both M3 design styles: Baseline and Expressive**.
2. **Material Web** — <https://github.com/material-components/material-web/blob/main/docs/components/list.md>
   (the canonical M3 list implementation: `<md-list>` / `<md-list-item>`, its slots, item `type`s,
   and accessibility model).

**Precedence:** M3 sets the visual language (the Baseline vs. Expressive split); Material Web wins
on the concrete API surface (slot names, item `type`s, roles). Reconciliation in
[§9](#9-source-reconciliation).

---

## Scope

The list is a **two-variant** surface — **Baseline** (flat, edge-to-edge rows with optional
dividers) and **Expressive** (grouped, filled, position-rounded containers with spacing) — built
from a composable `List.Root` / `List.Item` / `List.Subheader` set. Items support a leading slot, a
headline, optional supporting text (one/two/three-line layouts), a trailing slot, and three
interactivity modes (static text, button, link). A `selection` model (single/multiple, with
checkbox / radio / switch controls and `listbox`/`option` semantics), **roving** arrow-key
navigation, sticky section **subheaders**, and the Expressive **press shape-morph** ship on top of
that base. Drag-to-reorder and swipe actions remain deferred.

> The original v1 (released as `@wimwian-org/list@0.1.x`) shipped the two variants, one/two-line rows,
> slots, and static/button/link interactivity. The selection system, three-line density, roving
> navigation, subheaders, and the Expressive press morph were layered on in a later minor — the
> tables below mark each accordingly.

### In scope

| Area              | What ships                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Variants**      | **Baseline** (flat, transparent rows, optional dividers) · **Expressive** (filled, grouped, position-based rounded containers, gaps).              |
| **Composition**   | Compound `List.Root` (`<ul>`) + `List.Item` (the `<li>` row) + `List.Subheader` (section label), content via snippets.                             |
| **Layout**        | **One-, two-, and three-line** items (headline; + supporting text; + clamped supporting block).                                                    |
| **Slots**         | **Leading** (icon / avatar / image) and **trailing** (icon / text / control) snippets; headline (children); supporting text.                       |
| **Interactivity** | **Static** (`text`, a `<div>` row) · **button** (`onclick` → `<button>`) · **link** (`href` → `<a>`), with hover state-layer + visible focus.      |
| **Selection**     | `none` / `single` / `multiple`; rows with a `value` become `role="option"` toggles with a **checkbox / radio / switch** control; `bind:value`.     |
| **Keyboard**      | **Roving** focus (Arrow Up/Down, Home/End — no wrap; Space/Enter toggle), always on under selection, opt-in via `roving` for link/button lists.    |
| **Sections**      | `List.Subheader`, optionally **sticky**; in Expressive it opens a fresh rounded group.                                                             |
| **States**        | Enabled · hover · focus-visible · **selected** · **pressed (Expressive morph)** · disabled.                                                        |
| **Theming**       | smuit surface/content tokens; tint (neutral/primary/secondary/tertiary) drives the fill/state-layers/focus accent; light/dark automatic.           |
| **A11y**          | `role="list"` (or `role="listbox"` + `option` rows under selection); native `<li>` items; real `<a>`/`<button>`; visible AA focus; reduced-motion. |

### Deferred — next

| Area                   | Why it waits                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Reordering / swipe** | Drag-to-reorder and swipe actions — a pointer-gesture + DOM-order-mutation system of its own. Still deferred. |

> The list now ships a fully-themed, accessible two-variant surface with leading/trailing slots,
> one/two/three-line rows, static/button/link interactivity, single & multiple **selection**,
> **roving** keyboard navigation, sticky **subheaders**, and the Expressive **press morph**. Only
> **drag-reorder / swipe** is held back for a later release.

---

## 1. Purpose

A list is a vertical arrangement of related items — text, icons, avatars, and actions — presented
as a continuous, scannable column. It is the workhorse layout for collections: settings rows,
contacts, navigation destinations, search results, and menus of records. Each row carries a
headline, optional supporting text, and optional leading/trailing decorations or actions.

---

## 2. Architecture

### 2.1 Layering

The bit is **presentational** — there is no headless `bits-ui` primitive for a generic list, so it
is a plain Svelte compound built on native semantics (`<ul>` / `<li>` / `<a>` / `<button>`).
Accessibility comes from those native elements plus an explicit `role="list"` (which `display:flex`
would otherwise strip). Two conceptual layers:

| Layer         | Responsibility                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Container** | `List.Root` — the `<ul role="list">`. Owns the **variant** (baseline/expressive), the **tint** (focus accent), and the optional baseline **divider**, and publishes them to the items via context.                         |
| **Item**      | `List.Item` — the `<li>` row. Reads container context; renders leading / headline+supporting / trailing; chooses its element (`<div>`/`<button>`/`<a>`) from its interactivity; owns its own `lines` and `disabled` state. |

### 2.2 Anatomy

```
  ┌──────────────────────────────────────────────────────┐
  │ [leading]   Headline                       [trailing] │  ← one-line item
  └──────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────┐
  │ [leading]   Headline                                  │  ← two-line item
  │             Supporting text                [trailing] │
  └──────────────────────────────────────────────────────┘

  Baseline:    flat rows, edge-to-edge, optional 1px divider between rows.
  Expressive:  filled rows, gaps between them, first row rounds the top, last
               rounds the bottom, middle rows squared, a lone row fully rounded.
```

### 2.3 Parts & slots

| Part                | Role                             | Notes                                                               |
| ------------------- | -------------------------------- | ------------------------------------------------------------------- |
| **`List.Root`**     | The list container               | `<ul role="list">`; sets `variant` / `tint` / `divider`.            |
| **`List.Item`**     | A list row                       | `<li>` wrapping the row element (`<div>`/`<button>`/`<a>`).         |
| **Leading** (slot)  | Context before the text          | Icon, avatar, or image; sized by the bit.                           |
| **Headline**        | Primary label (children)         | The item's accessible text.                                         |
| **Supporting text** | Secondary line                   | Optional; promotes the item to a two-line layout.                   |
| **Trailing** (slot) | Action / metadata after the text | Icon or short text; an interactive control here gets its own label. |

### 2.4 State ownership

- **Container context.** `variant`, `tint`, and `divider` cascade from `List.Root` to every
  `List.Item` (mirrors the text-field `Field.Root` context pattern).
- **Item-local.** Each item owns its `lines` (one/two; auto-derived from whether supporting text is
  present), its interactivity (`text` / `button` / `link`, derived from `href` / `type` / `onclick`),
  and its `disabled` flag.
- **Position shape (Expressive).** The first / middle / last / only-child rounding is derived from
  DOM position via CSS `:first-child` / `:last-child` / `:only-child` — no JS bookkeeping.

---

## 3. Variants

| Variant        | Container treatment                                                                                                                                                                                                 | Status       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **Baseline**   | Flat, transparent rows, edge-to-edge; an optional 1px divider separates rows. The classic M3 list.                                                                                                                  | First-class. |
| **Expressive** | Each row is a **filled** surface; rows are **separated by a gap** and form a **grouped block** whose shape morphs by position (first → rounded top, last → rounded bottom, middle → squared, lone → fully rounded). | First-class. |

The two variants are **functionally identical** — same anatomy, slots, layouts, interactivity, and
a11y. The choice is purely visual emphasis: Baseline is quiet and dense; Expressive is grouped,
shaped, and emphatic (the M3 Expressive design language). Recommended default: **baseline** (the
most neutral on smuit surfaces).

---

## 4. Design elements

### 4.1 Shape, density & sizing

- **Heights:** one-line ≈ `3.5rem` (56px), two-line ≈ `4.5rem` (72px). Leading/trailing slots sit
  within these.
- **Padding:** `1rem` inline; one-line rows centre their content, two-line rows top-align it.
- **Shape (Expressive):** a large container radius on the outer corners of the group
  (`~1rem`), a small radius on inner/middle corners. Baseline has square rows.
- **Gap (Expressive):** a small vertical gap (`~0.25rem`) separates the filled rows.

### 4.2 Typography (smuit type ramp)

| Element         | Ramp token (suggested)   |
| --------------- | ------------------------ |
| Headline        | `--text-body-md`         |
| Supporting text | `--text-body-sm`, muted  |
| Trailing text   | `--text-label-sm`, muted |

### 4.3 Colour & theming (token mapping)

Material Web expresses these as `--md-list-item-*` tokens over the MD palette. The smuit
equivalents resolve through the flat theme's surface/content tokens so the list flips with
light/dark and retints automatically.

All tint-aware surfaces derive from a single `--list-accent` token (set per `[data-tint]`), so the
tint colours the resting fill, the hover/pressed state layers, and the focus outline together.

| Concept                    | Material Web token (reference) | smuit token (suggested)                                                |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| Tint accent                | (palette primary)              | `--list-accent` (neutral → `--color-g-700`; else `--surface-*-accent`) |
| Row fill (Expressive)      | `container-color`              | `--list-rest` = `color-mix(accent 8%, --color-g-100)`                  |
| Row fill (Baseline)        | (transparent)                  | `--list-rest` = `transparent`                                          |
| Headline text              | `label-text-color`             | `--color-g-900` (`text-g-900`)                                         |
| Supporting / trailing text | `supporting-text-color`        | muted `--color-g-600`                                                  |
| Leading / trailing icon    | `leading-icon-color`           | `--color-g-600`                                                        |
| Divider (Baseline)         | `divider-color`                | `--surface-border` / `border-g-200`                                    |
| Hover state layer          | `hover-state-layer-color`      | `--list-hover` = `color-mix(accent 12–16%, rest base)`                 |
| Pressed state layer        | `pressed-state-layer-color`    | `--list-press` = `color-mix(accent 22–26%, rest base)`                 |
| Focus outline              | focus indicator                | `--list-accent`                                                        |
| Disabled                   | reduced-opacity tokens         | dimmed `--color-g-400`, `pointer-events: none`                         |

The tint defaults to **neutral** (a theme-flipping grey, so un-tinted lists stay neutral); the
`tint` prop repoints `--list-accent` to a palette accent (primary / secondary / tertiary), which
tints the fill, state layers, and focus outline together.

> **Dark mode is automatic.** The `--color-g-*` / `--surface-*` tokens flip via the `--L`/`--D`
> space-toggle bound to `html[data-theme]`. No `.dark` selector, no `prefers-color-scheme`.

---

## 5. Key behaviours

### 5.1 Variant & position shape

- `List.Root` sets `data-variant` on the `<ul>`; `List.Item` rows read it.
- **Baseline:** transparent rows; with `divider`, a 1px border separates non-last rows.
- **Expressive:** filled rows separated by a gap; the **outer** corners of the group round (first
  row's top, last row's bottom), middle rows stay squared, and a single row rounds on all corners —
  all from CSS positional selectors, so adding/removing items re-shapes the group automatically.

### 5.2 Interactivity

- An item is **static** by default (`type="text"`) and renders a `<div>` row — no hover/focus.
- Setting `href` makes it a **link** (`<a>`); providing `onclick` (or `type="button"`) makes it a
  **button** (`<button>`).
- Interactive rows get a **hover state layer**, a **pressed** layer, `cursor: pointer`, and a
  **visible focus-visible outline** in the active tint accent.

### 5.3 Interaction states

| State         | Treatment                                                                      |
| ------------- | ------------------------------------------------------------------------------ |
| Enabled       | Resting surface (transparent baseline / filled expressive), muted decorations. |
| Hover         | Hover state layer over the row (interactive only).                             |
| Focus-visible | Accent outline inset on the row (interactive only).                            |
| Pressed       | Deeper pressed state layer (interactive only).                                 |
| Disabled      | Dimmed text/icons, `pointer-events: none`, `aria-disabled`; not focusable.     |

### 5.4 Events (contract)

- Interactive items forward native events (`onclick`, `onfocus`, `onblur`, keyboard activation) via
  the underlying `<a>`/`<button>` (Enter/Space on a button, Enter on a link — native behaviour).
- `ref` binds to the row element for imperative focus.

---

## 6. Accessibility

- **List semantics.** `List.Root` is `<ul role="list">` — the explicit role keeps list semantics
  even though `display:flex` is used for layout. Items are native `<li>`.
- **Interactive rows.** Real `<a>`/`<button>` elements provide the role, focusability, and keyboard
  activation; the headline is their accessible name. A trailing interactive control must carry its
  own `aria-label`.
- **Disabled.** Disabled items set `aria-disabled` and leave the tab order (`<button disabled>`;
  `<a>` drops `href` + `tabindex="-1"`).
- **Focus visibility.** The focus-visible outline meets AA contrast in both light and dark via the
  tint accent token.

---

## 7. Behavioural state matrix

| Dimension       | Values                                                  |
| --------------- | ------------------------------------------------------- |
| Variant         | baseline · expressive                                   |
| Layout          | one-line · two-line · three-line                        |
| Interactivity   | text · button · link · option (selectable)              |
| Selection       | none · single · multiple (checkbox · radio · switch)    |
| Decoration      | none · leading · trailing · both                        |
| State           | enabled · hover · focus · selected · pressed · disabled |
| Tint            | neutral · primary · secondary · tertiary                |
| Position (exp.) | first · middle · last · only · group (subheader-split)  |

---

## 8. Out of scope (this bit)

- **Drag-reorder / swipe.** Pointer-gesture reordering and swipe actions (which mutate DOM order)
  remain a later release.
- **Menus.** An actionable popover menu is its own component, not a list mode.
- **Virtualisation.** Large-list windowing is an app/runtime concern, not built in.

---

## 9. Source reconciliation

| Topic        | Material Design 3                   | Material Web                                     | Resolution                                                           |
| ------------ | ----------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| Variant set  | Baseline & Expressive design styles | single list, token-themed                        | **baseline + expressive** as the `variant` axis (M3 visual split).   |
| Item element | —                                   | `<md-list-item type="text/button/link">`         | **`<div>`/`<button>`/`<a>`** chosen from `type`/`href`/`onclick`.    |
| Slots        | leading / trailing regions          | `start` / `end` / `headline` / `supporting-text` | **leading / trailing snippets + headline (children) + supporting**.  |
| Line count   | one / two / three-line              | one vs multi-line                                | **one / two / three-line** (three clamps the supporting block).      |
| Keyboard nav | roving focus within the list        | `activateNext/PreviousItem`                      | **roving** Arrow/Home/End focus (auto under selection; opt-in else). |
| Selection    | selectable list items               | (host-managed)                                   | **single / multiple** via `selection` + `value`; `option` rows.      |

## Acknowledgements

This spec was synthesised from **Material Design 3 — Lists** (the Baseline and Expressive design
styles) and the **Material Web** list component. `@wimwian-org/list` is an **independent implementation**
on smuit's own design tokens and Svelte 5 conventions — it does not depend on, bundle, or copy code
from either project; they informed the anatomy, behaviour, and accessibility model only.
