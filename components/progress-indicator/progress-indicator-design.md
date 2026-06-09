# Progress Indicator — Design Spec

A design breakdown (no implementation) for the `@smuit/progress-indicator` bit: architecture,
anatomy, design elements, and key behaviours. Synthesised from two references:

1. **Material Web** — <https://github.com/material-components/material-web/blob/main/docs/components/progress.md>
   (`<md-linear-progress>` / `<md-circular-progress>`).
2. **MUI** — React `<LinearProgress>` / `<CircularProgress>` (for API ergonomics and the
   `determinate` / `indeterminate` / `buffer` vocabulary).

**Precedence:** where the two clash, the **earlier source (Material Web) wins** — it owns the
visual model, the token vocabulary, and the `value` / `max` numeric model. MUI is consulted only
for prop ergonomics (e.g. the human-readable mode names). The most material consequence is the
**`value` model**: Material's `value` is a fraction of `max` (default `max = 1`), **not** MUI's
0–100 percentage. Material wins → `value ∈ [0, max]`, `max` defaults to `1`.

---

## MVP Scope (v1)

The first release is the **linear** progress indicator only — a horizontal track with an active
indicator — in its two essential modes: **determinate** (a known fraction) and **indeterminate**
(unknown duration, animated). It is retintable, comes in three track heights, and is fully
labelled for assistive tech. Everything tied to the circular shape and to the richer Material
animations is deferred.

### In scope — v1

| Area        | What ships                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| **Shape**   | **Linear** only — a horizontal track + active indicator.                                                            |
| **Modes**   | **Determinate** (`value` / `max`) **and indeterminate** (animated, no `value`).                                     |
| **Value**   | Material model — `value ∈ [0, max]`, `max` defaults to `1`. Omitting `value` ⇒ indeterminate.                       |
| **Sizing**  | Three track heights — `sm` / `md` / `lg`. Full-width by default (fills its container).                              |
| **Theming** | Retintable accent via `tint` (neutral · primary · secondary · error · warning · success); light/dark via tokens.    |
| **Motion**  | One indeterminate slide animation; `prefers-reduced-motion` honoured (gentler fallback, activity still shown).      |
| **A11y**    | `role="progressbar"`, `aria-valuenow/min/max` (determinate), busy/indeterminate semantics, consumer-supplied label. |

### Deferred — next

| Area                        | Why it waits                                                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Circular indicator**      | The `<md-circular-progress>` shape — SVG ring, `size` token, stroke width. A second component on the same `value`/`max` model.          |
| **Four-color mode**         | Material's `four-color` indeterminate (cycles primary / primary-container / tertiary / tertiary-container). Needs extra palette tokens. |
| **Buffer (linear)**         | Material's `buffer` value + buffer-dots track. A second numeric channel layered on the determinate base.                                |
| **Label / value text slot** | A built-in caption or inline `12%` readout. v1 stays a bare bar; consumers wrap their own label.                                        |

> v1 ships a fully-themed, accessible **linear bar** in both determinate and indeterminate modes,
> with a clean seam to add the circular shape, four-color, and buffer next.

---

## 1. Purpose

A progress indicator communicates the status of an ongoing process — loading an app, submitting a
form, fetching data. **Determinate** indicators show how far along a known-length operation is;
**indeterminate** indicators signal that work is happening without estimating its length. It is a
purely presentational, non-interactive status element.

---

## 2. Architecture

### 2.1 Layering

The bit is **presentational** — there is no headless `bits-ui` primitive to wrap (no focus
management, no keyboard model, no roving state). It is a single styled element that owns its ARIA
`progressbar` semantics and its animation. Two conceptual layers:

| Layer         | Responsibility                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| **Track**     | The full-width inactive rail — the backdrop the indicator runs along. Establishes height + shape.     |
| **Indicator** | The active fill. Determinate ⇒ width = `value / max`. Indeterminate ⇒ a segment that animates across. |

No native form element backs it (unlike `<progress>`, which we deliberately avoid: `<progress>` is
hard to style cross-browser and its indeterminate animation isn't controllable). We render `<div>`s
with explicit ARIA instead — the Material Web approach.

### 2.2 Anatomy

```
  determinate (value = 0.6, max = 1):
  ┌───────────────────────────────────────────────┐
  │█████████████████████████████░░░░░░░░░░░░░░░░░░░░│  ← track (inactive rail)
  └──────────────── indicator ────────────────────┘     indicator fills 60%

  indeterminate:
  ┌───────────────────────────────────────────────┐
  │░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░│  → a segment slides L→R, repeating
  └───────────────────────────────────────────────┘
```

### 2.3 Parts

| Part          | Role                           | Notes                                                                                            |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Root**      | `role="progressbar"` host      | Carries ARIA, `data-*` state hooks, height, shape, full width. Owns the track.                   |
| **Track**     | Inactive backdrop rail         | A tonal tint of the accent (cohesive, theme-flipping). Pill-rounded ends.                        |
| **Indicator** | Active fill / animated segment | Solid accent. Determinate: `width` from `--progress-value`. Indeterminate: animated `transform`. |

The track and indicator are two stacked elements under one root; v1 needs **no compound export** —
a single `<ProgressIndicator>` component is enough.

### 2.4 State ownership

The consumer owns `value` / `max` (controlled). The component derives one piece of state: whether
it is **indeterminate** — `true` when `indeterminate` is set _or_ when `value` is `null`/`undefined`.
That single boolean drives the ARIA shape and the animation class. There is no internal mutable
state, no disabled state (a progress bar is never "disabled" — it's shown or it isn't).

---

## 3. Design elements (axes)

The `tv()` config carries the discrete class sets; the determinate width is an inline custom
property, and the indeterminate animation lives in CSS keyed off a `data-indeterminate` hook.

| Axis                        | Values                                                                | Default   | Drives                                                            |
| --------------------------- | --------------------------------------------------------------------- | --------- | ----------------------------------------------------------------- |
| **`tint`**                  | `neutral` · `primary` · `secondary` · `error` · `warning` · `success` | `primary` | The accent (`--progress-accent`) feeding indicator + tonal track. |
| **`size`**                  | `sm` · `md` · `lg`                                                    | `md`      | Track **height** (and the indeterminate segment proportion).      |
| **`indeterminate`** (state) | `true` · `false`                                                      | `false`   | tv toggle: determinate width vs the animated segment class.       |

**Sizes** (track height): `sm` = 4px (Material's default), `md` = 8px, `lg` = 12px. Default `md`
gives a slightly bolder bar than Material's 4px baseline — sized to read clearly on this design
system; `sm` recovers the Material default.

**No `variant` axis in v1.** Linear progress has a single visual treatment (pill-rounded track +
indicator); the determinate/indeterminate split is a _mode_, not a visual variant. A square/flat
`variant` could be added later but isn't needed for the MVP.

**Default tint = `primary`.** Unlike most smuit bits (which default `neutral`), a progress
indicator is inherently an accent element in Material — primary is the expected resting look. A
consumer retints to `error` (a failing upload), `success`, etc.

---

## 4. Key behaviours

1. **Determinate fill.** `width` of the indicator = `clamp(value / max, 0, 1)` as a percentage,
   set via an inline `--progress-value` custom property the CSS consumes. Transitions smoothly
   (`transition: width`) as `value` updates.
2. **Indeterminate slide.** When indeterminate, the indicator becomes a fixed-proportion segment
   that translates across the track on a repeating ease, conveying activity. A single keyframe
   animation (not Material's two-bar choreography — that's the richer deferred animation).
3. **Mode inference.** `indeterminate` is `true` when the `indeterminate` prop is set, or when
   `value == null`. Setting a numeric `value` makes it determinate.
4. **Reduced motion.** Under `@media (prefers-reduced-motion: reduce)`, the slide is replaced by a
   gentler in-place opacity pulse — activity is still signalled, vestibular triggers are not.
5. **Full-width, fluid.** The bar fills its container's inline size; height is fixed per `size`.

---

## 5. Accessibility

- **Role:** `role="progressbar"` on the root.
- **Determinate:** `aria-valuenow={value}`, `aria-valuemin={0}`, `aria-valuemax={max}`. Optionally a
  human `aria-valuetext` (e.g. `"60%"`) — nice-to-have, included.
- **Indeterminate:** **omit** `aria-valuenow` so assistive tech announces an indeterminate/busy
  state rather than a bogus number. `aria-valuemin`/`max` may still be present.
- **Labelling:** a progress bar has no intrinsic text, so the **consumer must supply a name** via
  `aria-label` or `aria-labelledby` (passed straight through `restProps`). The README documents
  this; Material Web makes the same requirement.
- **Contrast:** the accent indicator against the tonal track meets AA in both light and dark
  (tokens flip automatically); no token is hard-coded.

---

## 6. Token mapping (design role → smuit token)

Following the `@smuit/list` pattern: a `--progress-accent` token is set per `[data-tint]` from the
**semantic surface tokens** (theme-independent, flips light/dark), and the track + indicator derive
from it. No literals, no `.dark` selector.

| Design role (Material)                  | smuit token / class                                                           |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| active-indicator-color (primary)        | `--progress-accent` → `var(--surface-primary-accent)` (per `[data-tint]`)     |
| · neutral tint                          | `--progress-accent` → `var(--color-g-700)` (theme-flipping grey)              |
| · error / warning / success tints       | `var(--surface-error-accent)` / `…-warning-accent` / `…-success-accent`       |
| track-color (surface-container-highest) | tonal: `color-mix(in srgb, var(--progress-accent) 24%, transparent)`          |
| track-height                            | `--progress-height` per `size` (4 / 8 / 12px)                                 |
| track-shape                             | `rounded-full` (pill) on both track and indicator                             |
| determinate value                       | inline `--progress-value` (0–1) → `width: calc(var(--progress-value) * 100%)` |
| indeterminate animation                 | `@keyframes` in `progress-indicator.css`, gated on `data-indeterminate`       |

> **Dark mode is automatic** via the `--surface-*` / `--color-g-*` token flip. No `.dark` selector,
> no `@media (prefers-color-scheme: dark)`.

---

## 7. File plan (Phase 5)

```
components/progress-indicator/
├── package.json            @smuit/progress-indicator (no bits-ui; no upstream @mui/@material)
├── tsconfig.json           copied from a sibling
├── README.md               + Scope section + Acknowledgements (Material Web, MUI)
├── LICENSE · CHANGELOG.md
└── src/
    ├── ProgressIndicator.svelte        root; role=progressbar; ARIA; data hooks
    ├── progress-indicator.variants.ts  tv(): tint · size · indeterminate
    ├── progress-indicator.css          @reference theme; @layer components; tokens-first; keyframes
    ├── types.ts                        Props (HTMLAttributes<HTMLDivElement> + axes); // Deferred (next): …
    ├── index.ts                        re-exports
    ├── ProgressIndicator.test.ts       browser-mode: modes · tints · sizes · ARIA · ref
    └── progress-indicator.variants.test.ts   class-string assertions per axis
```

Plus the demo route `apps/playground/src/routes/progress-indicator/+page.svelte` and a homepage
`sections` entry.

---

## 8. Source reconciliation

| Topic        | Material Web                          | MUI                      | Resolution (Material wins)                                          |
| ------------ | ------------------------------------- | ------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Value model  | `value ∈ [0, max]`, `max` default `1` | `value` 0–100            | **Material**: fraction of `max`, `max` default `1`.                 |
| Mode naming  | `indeterminate` boolean attr          | `variant="determinate    | indeterminate"`                                                     | **`indeterminate` boolean** (Material), inferred from missing `value` (MUI ergonomics). |
| Track tone   | neutral surface-container             | tonal alpha of the color | **Tonal accent alpha** — cohesive + retints with tint.              |
| Default look | primary, 4px                          | primary                  | primary accent; default height `md`=8px (`sm`=4 recovers Material). |

---

## 9. Acknowledgements

`@smuit/progress-indicator` is an **independent implementation** built on smuit design tokens and
Svelte 5 runes. It is **synthesised from** the design of Material Web's progress components and
MUI's `LinearProgress` for API ergonomics — it does **not** depend on, vendor, or copy
`@material/*` or `@mui/*`. Those projects are credited as design references only.
