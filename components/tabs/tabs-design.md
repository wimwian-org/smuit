# Tabs — Design Spec

A design breakdown (no implementation) for the `@smuit/tabs` bit: architecture, design elements,
and key behaviours. Synthesised from three references:

1. **Material Design 3** — Tabs overview/specs (<https://m3.material.io/components/tabs/overview>),
   covering the **Primary** and **Secondary** tab types and the active-indicator visual language.
2. **Material Web** — <https://github.com/material-components/material-web/blob/main/docs/components/tabs.md>
   (the canonical M3 tabs implementation: `<md-tabs>` / `<md-primary-tab>` / `<md-secondary-tab>`,
   its `active` / `activeTabIndex` / `auto-activate` model, icon slots, and accessibility notes).
3. **bits-ui Tabs** — <https://bits-ui.com/docs/components/tabs> (the headless primitive that backs
   this bit: `Tabs.Root` / `Tabs.List` / `Tabs.Trigger` / `Tabs.Content`, `activationMode`,
   `orientation`, `loop`, and the `data-state` / `data-orientation` / `data-disabled` hooks).

**Precedence:** M3 sets the visual language (the two tab types, the active indicator); Material Web
informs the API surface and a11y model; **bits-ui owns the behaviour** (roles, roving keyboard nav,
activation mode, panel association). Reconciliation in [§9](#9-source-reconciliation).

> **Naming note.** The two M3 tab _types_ (Primary / Secondary) map onto a smuit `variant` axis
> named **`bold` / `subtle`** — deliberately distinct from the _tint_ names (`primary`, `secondary`,
> …) so the two axes never collide. `bold` ≙ M3 Primary; `subtle` ≙ M3 Secondary.

---

## MVP Scope (v1)

The first release is a **two-variant, horizontal tab set** — **bold** (M3 Primary: top-level,
bolder, optional inline leading icon) and **subtle** (M3 Secondary: nested, quieter) — built as a
compound `Tabs.Root` / `Tabs.List` / `Tabs.Trigger` / `Tabs.Content` wrapping the headless
**bits-ui Tabs** primitive. Triggers carry a text label and an optional inline leading icon, and an
**animated active indicator** slides under the active trigger (with a static reduced-motion
fallback). Activation is automatic (focus-activates) or manual. Tints retint the indicator, the
active label, the state layers, and the focus outline together. Overflow scrolling, vertical
orientation, stacked icons, and badges are deferred.

### In scope — v1

| Area                 | What ships                                                                                                                                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Variants**         | **bold** (M3 Primary — top-level, `label-lg`, optional inline leading icon, rounded indicator hugging the label) · **subtle** (M3 Secondary — nested, `label-md`, text-only, hairline indicator across the trigger). Default **bold**.              |
| **Composition**      | Compound `Tabs.Root` (state owner) + `Tabs.List` (`role="tablist"` + indicator) + `Tabs.Trigger` (`role="tab"`) + `Tabs.Content` (`role="tabpanel"`) — wrapping bits-ui.                                                                            |
| **Sizes**            | **sm** (~40px row) and **md** (~48px row, default).                                                                                                                                                                                                 |
| **Tints**            | neutral (default) · primary · secondary · tertiary · error · warning · success — drives indicator, active label/icon, state layers, focus outline together.                                                                                         |
| **Orientation**      | **Horizontal** only.                                                                                                                                                                                                                                |
| **Trigger content**  | Text label (children) + **optional inline leading icon** snippet.                                                                                                                                                                                   |
| **Active indicator** | A single indicator that **slides + resizes** to track the active trigger (`transform`/`width` transition); **`prefers-reduced-motion` → it snaps** (static). bold = rounded bar hugging the label; subtle = full-width hairline across the trigger. |
| **Activation**       | `activationMode` **automatic** (default; focus selects) or **manual** (Enter/Space selects) — passed through to bits-ui. `loop` keyboard wrapping.                                                                                                  |
| **States**           | active · inactive · hover · focus-visible · disabled (per-trigger `disabled` and whole-set `disabled`).                                                                                                                                             |
| **Theming**          | smuit surface/content tokens; a single `--tabs-accent` per `[data-tint]`; light/dark automatic.                                                                                                                                                     |
| **A11y**             | bits-ui roles (`tablist`/`tab`/`tabpanel`), `aria-controls`/`aria-labelledby` wiring, arrow-key roving + Home/End, visible AA focus, `data-disabled` (not opacity).                                                                                 |

### Deferred — next

| Area                           | Why it waits                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Overflow / scrollable bars** | Material Web's `scrollToTab()` + scroll-affordance buttons for tab bars that exceed their container width. |
| **Vertical orientation**       | bits-ui supports `orientation="vertical"`; v1 styles horizontal only (the indicator + layout differ).      |
| **Stacked icon layout**        | bold tabs with the icon **above** the label (M3 stacked tab); v1 ships inline leading icons only.          |
| **Badge / count on a tab**     | A numeric/dot badge on a trigger.                                                                          |
| **Dynamic tabs**               | Closeable / addable tabs and their keyboard/focus reconciliation.                                          |

> v1 ships a fully-themed, accessible two-variant horizontal tab set with sm/md sizes, inline
> leading icons, tint retinting, automatic/manual activation, and an **animated sliding indicator
> with a reduced-motion fallback** — all behaviour delegated to bits-ui. Held back are **overflow
> scrolling**, **vertical orientation**, **stacked icons**, and **badges**; later releases layer
> those onto this base.

---

## 1. Purpose

Tabs organise groups of related content at the same level of hierarchy, letting a user switch
between sibling views without leaving the page. A tab set presents a row of selectable labels (the
tablist), exactly one of which is active at a time, and reveals the matching content panel below.
It is the workhorse for sectioned views: settings categories, profile sub-pages, dashboards, and
detail-record panels.

---

## 2. Architecture

### 2.1 Layering

The bit is a **headless-backed wrapper** — there _is_ a `bits-ui` primitive (`Tabs`) for this
behaviour, so we wrap it exactly like the project's other interactive bits. bits-ui owns the
accessibility tree (`tablist` / `tab` / `tabpanel` roles, `aria-controls` / `aria-labelledby`
wiring), the **roving keyboard navigation** (arrow keys + Home/End + `loop`), the **activation
mode** (automatic on focus vs. manual on Enter/Space), and the active-value state. The bit layers
on smuit theming, the variant/size/tint axes, the sliding active indicator, and the icon slot.

| Layer       | Responsibility                                                                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Root**    | `Tabs.Root` — wraps `bits-ui Tabs.Root`. Owns `value` (`bind:`-able active tab), `variant`, `size`, `tint`, `activationMode`, `loop`, `disabled`; publishes variant/size/tint + the active value (getter) to descendants via context. |
| **List**    | `Tabs.List` — wraps `bits-ui Tabs.List` (`role="tablist"`). Lays the triggers in a row, draws the bottom **track** hairline, and renders + positions the single sliding **active indicator**.                                         |
| **Trigger** | `Tabs.Trigger` — wraps `bits-ui Tabs.Trigger` (`role="tab"`, a `<button>`). Renders the optional leading icon + a measurable label span, hover/focus state layers, and its own `disabled`.                                            |
| **Content** | `Tabs.Content` — wraps `bits-ui Tabs.Content` (`role="tabpanel"`). The panel shown when its `value` matches the active tab.                                                                                                           |

### 2.2 Anatomy

```
  ┌─────────────────────────────────────────────────────────────┐
  │  [icon] Label      Label*       Label        Label           │  ← Tabs.List (role=tablist)
  │  ▔▔▔▔▔▔▔▔▔▔▔▔▔      ═══════                                   │  ← active indicator (slides to active*)
  ├─────────────────────────────────────────────────────────────┤  ← track hairline
  │                                                               │
  │   Active panel content                                        │  ← Tabs.Content (role=tabpanel)
  │                                                               │
  └─────────────────────────────────────────────────────────────┘

  bold:    label-lg, optional inline leading icon, rounded (pill) indicator hugging the label.
  subtle:  label-md, text only, thin full-width-of-trigger hairline indicator.
  * = active trigger; the single indicator slides + resizes between triggers.
```

### 2.3 Parts & slots

| Part                    | Role / element             | Notes                                                                             |
| ----------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| **`Tabs.Root`**         | container `<div>`          | bits-ui Root; sets `value` / `variant` / `size` / `tint` / `activationMode`.      |
| **`Tabs.List`**         | `<div role="tablist">`     | bits-ui List; the trigger row + track + sliding indicator.                        |
| **`Tabs.Trigger`**      | `<button role="tab">`      | bits-ui Trigger; needs a `value`; renders leading icon + a measurable label span. |
| **Leading icon** (slot) | snippet inside the trigger | Optional; inline before the label. Stacked (above-label) layout is deferred.      |
| **Label**               | children of the trigger    | The tab's accessible name; wrapped in a measurable span for the bold indicator.   |
| **`Tabs.Content`**      | `<div role="tabpanel">`    | bits-ui Content; needs a matching `value`.                                        |

### 2.4 State ownership

- **bits-ui owns** the active `value` (controlled via `bind:value` or uncontrolled), the roving
  focus, the activation mode, and the role/ARIA wiring across triggers ↔ panels.
- **Root context.** `variant`, `size`, `tint`, and a **getter for the active value** cascade from
  `Tabs.Root` to descendants (mirrors the `List.Root` / `Field.Root` context pattern).
- **Trigger-local.** Each trigger owns its `value`, its optional `disabled`, and exposes a
  measurable label span; bits-ui sets `data-state="active"` on the active one.
- **Active indicator (List-owned).** `Tabs.List` renders **one** absolutely-positioned indicator
  and, in a client `$effect` keyed on the active value (plus a `ResizeObserver`), measures the
  active trigger (subtle) or its label span (bold) relative to the list and writes the indicator's
  `transform`/`width`. CSS transitions the move; `prefers-reduced-motion: reduce` removes the
  transition so it snaps (the static fallback).

---

## 3. Variants

| Variant    | M3 type   | Treatment                                                                                                                                                          | Status       |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| **bold**   | Primary   | Top-level tabs (under app bars). Bolder `label-lg`, supports an **inline leading icon**, and a **rounded** indicator hugging the label. The emphatic, default tab. | First-class. |
| **subtle** | Secondary | Nested tabs within content. Quieter `label-md`, **text only**, and a thin hairline indicator across the trigger. Sub-divides a panel.                              | First-class. |

The two variants are **functionally identical** — same compound parts, behaviour, activation,
keyboard model, and a11y. The choice is visual emphasis and hierarchy: `bold` for the top-level
switch, `subtle` for nested sub-navigation. Recommended default: **bold**.

---

## 4. Design elements

### 4.1 Shape, density & sizing

- **Row height:** `md` ≈ `3rem` (48px), `sm` ≈ `2.5rem` (40px). The track hairline sits on the
  bottom edge of the list.
- **Trigger padding:** `~1rem` inline; the leading icon sits `0.5rem` before the label.
- **Active indicator:** `bold` → a **rounded** bar (`rounded-full`, ~3px tall) sized to the **label
  span**. `subtle` → a thin (~2px) bar sized to the **full trigger width**. A single indicator
  element slides + resizes between triggers via a `transform`/`width` transition.
- **Track:** a 1px hairline along the bottom of `Tabs.List`, separating the tablist from the panel.

### 4.2 Typography (smuit type ramp)

| Element      | Ramp token (suggested)                   |
| ------------ | ---------------------------------------- |
| bold label   | `--text-label-lg`                        |
| subtle label | `--text-label-md`                        |
| Active label | same ramp, accent colour + weight        |
| Leading icon | sized to the label cap-height (`1.25em`) |

### 4.3 Colour & theming (token mapping)

Material Web expresses these as `--md-primary-tab-*` / `--md-secondary-tab-*` tokens over the MD
palette. The smuit equivalents resolve through the flat theme's surface/content tokens so tabs flip
with light/dark and retint automatically. All tint-aware surfaces derive from a single
`--tabs-accent` token (set per `[data-tint]`), so the tint colours the active indicator, the active
label/icon, the hover/pressed state layers, and the focus outline together.

| Concept             | Material Web token (reference) | smuit token (suggested)                                                                  |
| ------------------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| Tint accent         | (palette primary)              | `--tabs-accent` (neutral → `--color-g-900`; else `--surface-*-accent` / `--color-c-600`) |
| Active indicator    | `active-indicator-color`       | `--tabs-accent`                                                                          |
| Active label / icon | `active-label-text-color`      | `--tabs-accent`                                                                          |
| Inactive label      | `label-text-color`             | muted `--color-g-600` (`text-g-600`)                                                     |
| Inactive icon       | `icon-color`                   | `--color-g-600`                                                                          |
| List background     | `container-color`              | transparent over `var(--surface-bg)`                                                     |
| Track / divider     | `divider-color`                | `--surface-border` / `border-g-200`                                                      |
| Hover state layer   | `hover-state-layer-color`      | `--tabs-hover` = `color-mix(accent 8–12%, transparent)`                                  |
| Pressed state layer | `pressed-state-layer-color`    | `--tabs-press` = `color-mix(accent 14–18%, transparent)`                                 |
| Focus outline       | focus indicator                | `--tabs-accent` (`outline-c-500` when tinted)                                            |
| Disabled            | reduced-opacity tokens         | dimmed `--color-g-400`, `pointer-events: none`, `data-disabled`                          |

The tint defaults to **neutral** (a theme-flipping grey, so un-tinted tabs stay neutral); the
`tint` prop repoints `--tabs-accent` to a palette accent, which tints the indicator, active label,
state layers, and focus outline together.

> **Dark mode is automatic.** The `--color-g-*` / `--surface-*` tokens flip via the `--L`/`--D`
> space-toggle bound to `html[data-theme]`. No `.dark` selector, no `prefers-color-scheme`.

---

## 5. Key behaviours

### 5.1 Selection & activation

- The active tab is bits-ui's `value`, exposed on `Tabs.Root` as a `bind:value`-able prop
  (controlled) or left uncontrolled with an initial value.
- **`activationMode="automatic"`** (default): arrow-keying to a tab focuses _and_ activates it,
  revealing its panel. **`activationMode="manual"`**: arrow keys move focus only; Enter/Space
  activates. Both are passed straight through to bits-ui.
- `onValueChange` forwards every active-tab change.

### 5.2 Active indicator (animated, with static fallback)

- `Tabs.List` renders a single indicator element and positions it under the active trigger by
  measuring geometry (the **label span** for `bold`, the **trigger box** for `subtle`) relative to
  the list, in a client `$effect` keyed on the active value, re-run on resize via a `ResizeObserver`
  and after layout (`requestAnimationFrame`).
- The indicator **slides and resizes** between triggers via a CSS `transform` + `width` transition.
- Under **`prefers-reduced-motion: reduce`** the transition is removed, so the indicator snaps —
  the static fallback. Before the first measurement it is hidden (no SSR flash).

### 5.3 Interaction states

| State         | Treatment                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Inactive      | Muted `--color-g-600` label/icon, indicator elsewhere.                                                                                      |
| Active        | Accent label/icon (`--tabs-accent`) + the indicator under it.                                                                               |
| Hover         | Hover state layer over the trigger; cursor pointer.                                                                                         |
| Focus-visible | Accent outline on the trigger (bits-ui manages the roving focus target).                                                                    |
| Pressed       | Deeper pressed state layer.                                                                                                                 |
| Disabled      | Dimmed text/icon, `pointer-events: none`, `data-disabled`; removed from roving order (per-trigger), or whole set disabled from `Tabs.Root`. |

### 5.4 Events & binding (contract)

- `bind:value` on `Tabs.Root` for two-way active-tab binding; `onValueChange` callback for one-way.
- Triggers forward native events (`onclick`, `onfocus`, `onblur`) via the underlying `<button>`;
  keyboard activation (Enter/Space, arrows, Home/End) is bits-ui's.
- `ref` binds to each part's root element for imperative access.

---

## 6. Accessibility

- **Roles & wiring (bits-ui).** `Tabs.List` is `role="tablist"`, each `Tabs.Trigger` is
  `role="tab"`, each `Tabs.Content` is `role="tabpanel"`. bits-ui wires `aria-controls` (tab →
  panel), `aria-labelledby` (panel → tab), `aria-selected`, and `tabindex` roving automatically —
  **do not re-add these**.
- **Keyboard.** Arrow Left/Right move between tabs (roving focus), Home/End jump to first/last,
  `loop` wraps; activation per `activationMode`. All provided by bits-ui.
- **Icon-only / ambiguous tabs.** If a tab has no visible text label, the consumer must supply an
  `aria-label` (forwarded via `restProps`). v1's triggers ship with a text label by default.
- **Disabled.** Disabled triggers set `data-disabled` and leave the roving order; styling dims via
  token, **not** raw opacity.
- **Motion.** The sliding indicator honours `prefers-reduced-motion: reduce` (snaps instead of
  sliding).
- **Focus visibility.** The focus-visible outline meets AA contrast in both light and dark via the
  `--tabs-accent` token.

---

## 7. Behavioural state matrix

| Dimension       | Values                                                               |
| --------------- | -------------------------------------------------------------------- |
| Variant         | bold · subtle                                                        |
| Size            | sm · md                                                              |
| State           | inactive · active · hover · focus · pressed · disabled               |
| Trigger content | label · leading-icon + label                                         |
| Activation      | automatic · manual                                                   |
| Tint            | neutral · primary · secondary · tertiary · error · warning · success |
| Orientation     | horizontal · (vertical, deferred)                                    |

---

## 8. Out of scope (this bit)

- **Overflow scrolling.** Scrollable tab bars with scroll-into-view affordances (`scrollToTab()`)
  are a later release; v1 assumes the tab row fits its container.
- **Vertical orientation.** bits-ui supports it; v1 styles horizontal only.
- **Stacked icons, badges, dynamic (closeable/addable) tabs** — see the Deferred table.
- **Routing integration.** Binding the active tab to the URL is an app concern, not built in
  (the consumer wires `bind:value` to their router).

---

## 9. Source reconciliation

| Topic            | Material Design 3 / Material Web                        | bits-ui Tabs                          | Resolution                                                                       |
| ---------------- | ------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| Variant set      | Primary vs. Secondary tab types                         | (unstyled, single primitive)          | **`bold` + `subtle`** as the `variant` axis (M3 visual split, smuit-named).      |
| Composition      | `<md-tabs>` + `<md-*-tab>` (active panels host-managed) | `Root`/`List`/`Trigger`/`Content`     | **wrap bits-ui's four parts** — they own panels too (Material Web does not).     |
| Selection model  | `active` attr / `activeTabIndex` (index)                | `value` (string id) + `bind:value`    | **bits-ui `value`** (string-keyed; more robust than index).                      |
| Activation       | `auto-activate` attribute                               | `activationMode: automatic \| manual` | **bits-ui `activationMode`**, passed through `Tabs.Root`.                        |
| Keyboard / roles | aria notes, host-wired                                  | full tablist roving + ARIA wiring     | **bits-ui** owns roles, roving focus, `aria-controls`/`labelledby`.              |
| Active indicator | animated sliding bar                                    | (unstyled `data-state`)               | **animated sliding indicator** measured in `Tabs.List`; reduced-motion → static. |
| Icon layout      | inline or stacked (above label)                         | —                                     | **inline leading icon** in v1; stacked deferred.                                 |
| Overflow scroll  | `scrollToTab()` + scroll buttons                        | —                                     | **deferred**; v1 assumes the row fits.                                           |

## Acknowledgements

This spec was synthesised from **Material Design 3 — Tabs** (the Primary and Secondary tab types
and the active-indicator language) and the **Material Web** tabs component, with behaviour backed by
the headless **bits-ui Tabs** primitive. `@smuit/tabs` is an **independent implementation** on
smuit's own design tokens and Svelte 5 conventions — it does not depend on, bundle, or copy code
from Material Design or Material Web; they informed the anatomy, behaviour, and accessibility model
only. (bits-ui _is_ a runtime dependency, as the headless behaviour layer — the standard pattern for
smuit interactive bits.)
