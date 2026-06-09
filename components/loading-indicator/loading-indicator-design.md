# Loading Indicator — Design Spec

A design breakdown (no implementation) for the `@smuit/loading-indicator` bit: architecture,
design elements, and key behaviours. Synthesised from two references:

1. **Material Design 3 (Expressive)** — Loading indicator overview/guidelines
   (<https://m3.material.io/components/loading-indicator/overview>), the M3 Expressive
   replacement for the indeterminate circular progress spinner.
2. **Material 3 / Jetpack Compose** — `LoadingIndicator` / `ContainedLoadingIndicator`
   (`androidx.compose.material3`, `@ExperimentalMaterial3ExpressiveApi`): the concrete API
   surface (variants, `indicatorColor` / `containerColor`, the polygon-morph model, default sizes).

**Precedence:** M3 sets the visual language (the shape morph, uncontained vs contained); Compose
wins on the concrete API surface (variant split, colour roles, default dp sizing). Reconciliation
in [§9](#9-source-reconciliation).

---

## MVP Scope (v1)

The first release is a **presentational, indeterminate loading indicator** — an animated **active
indicator** that continuously **morphs through a curated set of Material shapes** while rotating, in
two variants: **uncontained** (the bare morphing shape) and **contained** (the shape inside a
filled, rounded container surface). It ships three sizes, retinting, and a `prefers-reduced-motion`
fallback. Determinate (progress-driven) mode, the exact AndroidX spring-physics seven-shape morph,
and custom shape sequences are deferred.

### In scope — v1

| Area          | What ships                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Variants**  | **uncontained** (bare morphing shape) · **contained** (shape centred in a filled, rounded container surface).                        |
| **Mode**      | **Indeterminate only** — a continuous, looping morph + spin that runs while the indicator is mounted.                                |
| **Animation** | Active indicator morphs through a curated set of Material shapes (SVG `d` morph via SMIL) + a steady CSS rotation. See §4.2.         |
| **Sizes**     | `sm` (~2rem) · `md` (~3rem container / ~2.375rem indicator — the M3 48dp / 38dp default) · `lg` (~4rem).                             |
| **Theming**   | smuit content/surface tokens; retintable (neutral · primary · secondary · tertiary); light/dark automatic.                           |
| **Motion**    | `prefers-reduced-motion: reduce` fallback — morph + spin stop; the indicator rests on a single static shape.                         |
| **A11y**      | `role="progressbar"` + `aria-label` (default "Loading"), **indeterminate** (no `aria-valuenow`), `aria-busy`; the SVG art is hidden. |

### Landed in v1.1

| Area                        | What shipped                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Determinate mode**        | A `progress` (0→1, clamped) prop; a sweep arc tracks the value and the root exposes `aria-valuenow`. |
| **Completion hand-off**     | `complete` (or `progress >= 1`) settles into a drawn, success-tinted checkmark; clears `aria-busy`.  |
| **Custom shape sequence**   | A `shapes: string[]` prop overrides the curated morph set; `LOADING_INDICATOR_SHAPES` is exported.   |
| **Container shape options** | A `containerShape` prop — `rounded` (default) / `squircle` / `cookie`, via scaled CSS masks.         |

### Deferred — next

| Area                          | Why it waits                                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **True spring-physics morph** | The exact AndroidX seven-shape spring sequence (stiffness/damping tokens, M3 easing); v1 uses a curated SVG `d` morph. |

> v1 shipped a fully-themed, accessible, indeterminate loading indicator (uncontained + contained,
> three sizes, retintable, reduced-motion fallback). v1.1 layered on the **determinate progress
> mode**, **completion hand-off**, **custom shape sequences**, and **container shape options**. Only
> the **exact spring-physics morph** remains deferred — the curated SVG `d` morph stands in for it.

---

## 1. Purpose

A loading indicator signals that a short, **indeterminate** process is underway — content fetching,
a brief computation, a screen transition. In M3 Expressive it is the recommended replacement for the
indeterminate circular progress spinner for processes expected to finish in **under ~5 seconds**. Its
animated, shape-morphing form is intended to feel lively and reassuring rather than mechanical. For
longer or measurable work, or a full-width track, a (future) progress indicator is the right tool.

---

## 2. Architecture

### 2.1 Layering

The bit is **presentational** — there is no headless `bits-ui` primitive for a loading indicator, so
it is a plain Svelte component built on an inline SVG plus CSS/SVG animation. Two conceptual layers:

| Layer                | Responsibility                                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Container** (opt)  | In the `contained` variant, a filled, rounded surface that frames the indicator for high visibility on busy backgrounds.          |
| **Active indicator** | The animated SVG shape that morphs through the Material shape set and rotates. Owns the morph/spin animation and the tint colour. |

### 2.2 Anatomy

```
  uncontained                 contained
   ╭─╮                     ┌───────────┐
  ╭╯ ╰╮   ← morphing       │    ╭─╮    │  ← active indicator
  ╰╮ ╭╯     active         │   ╭╯ ╰╮   │     centred inside a
   ╰─╯       indicator     │   ╰╮ ╭╯   │     filled container
                           │    ╰─╯    │
                           └───────────┘
   shape alone, blends     shape on a filled, rounded
   into the surface        surface — visible anywhere
```

### 2.3 Parts

| Part                 | Role                          | Notes                                                                |
| -------------------- | ----------------------------- | -------------------------------------------------------------------- |
| **Active indicator** | The morphing, spinning shape  | Inline SVG `<path>`; `aria-hidden` (decorative); tinted via tokens.  |
| **Container** (opt)  | Filled frame (contained only) | A rounded surface sized larger than the indicator; soft tinted fill. |
| **Root / live area** | Screen-reader announcement    | The root element carries the `progressbar` role + `aria-label`.      |

### 2.4 State ownership

- The component is **stateless** in v1 — it animates continuously while mounted. There is no
  `progress` value (deferred), no internal toggling.
- `variant`, `size`, and `tint` are props mapped to CSS via `tailwind-variants` data hooks.
- The morph/spin is driven entirely by CSS/SVG animation. The only script state is a
  `prefers-reduced-motion` flag (read via `matchMedia`) that gates the SMIL morph.

---

## 3. Variants

| Variant         | Treatment                                                                                          | Status       |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------ |
| **uncontained** | The bare morphing active indicator on a transparent background; minimalist, blends with the UI.    | First-class. |
| **contained**   | The active indicator centred inside a **filled, rounded container** for high visibility on any bg. | First-class. |

The two variants share the same indicator, animation, sizes, tints, and a11y; the only difference is
the presence of the filled container. Recommended default: **uncontained**.

---

## 4. Design elements

### 4.1 Shape, size & sizing

| Size | Container (contained) | Active indicator | Source                       |
| ---- | --------------------- | ---------------- | ---------------------------- |
| `sm` | ~2rem (32px)          | ~1.5rem (24px)   | scaled down                  |
| `md` | ~3rem (48px)          | ~2.375rem (38px) | **M3 default** (48dp / 38dp) |
| `lg` | ~4rem (64px)          | ~3.25rem (52px)  | scaled up                    |

- Active indicator ≈ 0.8 × container; the container corner radius is large (squircle-ish — the M3
  "container shape").

### 4.2 Motion (the morph)

- **Uses a curated Material shape set:** the active indicator cycles through a small sequence of
  Material-style shapes — **circle → cushion → diamond → pill → circle** — each authored as an
  SVG `<path>` with an **identical `M + 4·C + Z` structure** so the browser can interpolate `d`
  smoothly between them.
- **Technique (v1):** an inline SVG `<path>` whose `d` is animated through the sequence via SMIL
  `<animate attributeName="d" …>`, composed with a steady CSS `rotate` spin. **This is an honest
  approximation** of the AndroidX spring-physics morph — the exact spring stiffness/damping, the M3
  easing tokens, and the full seven-shape set are **deferred** (§ Deferred).
- **Reduced motion:** under `prefers-reduced-motion: reduce`, the SMIL morph is not rendered and the
  CSS spin is disabled; the indicator rests on a single static Material shape so the loading state is
  still perceptible without motion.

### 4.3 Colour & theming (token mapping)

Compose expresses these as `indicatorColor` (primary) and `containerColor` (surface-container). The
smuit equivalents resolve through a single `--li-accent` token (set per `[data-tint]` from the
theme's semantic surface tokens), so the indicator flips with light/dark and retints automatically —
the same mechanism `@smuit/list` uses.

| Concept (Compose role)              | smuit token (suggested)                                                    |
| ----------------------------------- | -------------------------------------------------------------------------- |
| Active indicator (`indicatorColor`) | `--li-accent` (neutral → `--color-g-700`; else `--surface-<tint>-accent`). |
| Container fill (`containerColor`)   | `--li-container` = `color-mix(--li-accent 14%, --surface-<tint>-bg)`.      |
| Reduced-motion resting shape        | same indicator token, static                                               |

> **Tint axis.** The content-tint channel (`--color-c-*`) and the matching `--surface-*-accent`
> tokens cover **primary / secondary / tertiary**; **neutral** keeps a theme-flipping grey. (The
> RAG palettes — error / warning / success — drive `--color-rag-*`, a separate semantic channel not
> used here.) So this bit's `tint` axis is **neutral · primary · secondary · tertiary**, matching
> `@smuit/list`.

> **Dark mode is automatic.** The `--color-g-*` / `--surface-*` tokens flip via the `--L`/`--D`
> space-toggle bound to `html[data-theme]`. No `.dark` selector, no `prefers-color-scheme` for colour.

---

## 5. Key behaviours

### 5.1 Continuous indeterminate animation

- While mounted, the active indicator **morphs + rotates** indefinitely. There is no start/stop API
  in v1 — mounting the component starts it; unmounting (e.g. `{#if loading}`) stops it.

### 5.2 Variant rendering

- `uncontained`: renders only the SVG indicator on a transparent box sized to the indicator.
- `contained`: wraps the indicator in a filled, rounded container sized per `size`.

### 5.3 Reduced motion

- `prefers-reduced-motion: reduce` (read via `matchMedia`) drops the SMIL morph and disables the CSS
  spin; the indicator rests on one shape so the loading state stays perceptible.

### 5.4 Events / contract

- Presentational — no events. `ref` binds to the root element for measurement/imperative use.
- `restProps` spread onto the root for `id`, `data-*`, and `aria-*` overrides.

---

## 6. Accessibility

- **Role.** The root carries `role="progressbar"` with an `aria-label` (default `"Loading"`,
  overridable via the `label` prop) and **no** `aria-valuenow` — signalling an **indeterminate**
  progressbar. `aria-busy="true"` while active.
- **Decorative art.** The SVG shape is `aria-hidden="true"` / `focusable="false"`; the accessible
  name comes from the label, not the art.
- **Contrast.** The `contained` variant's indicator-on-container contrast meets **≥3:1** (non-text
  graphic) in both light and dark via the tint tokens.
- **Motion.** Honours `prefers-reduced-motion` (§5.3); no seizure-risk flashing.

---

## 7. Behavioural state matrix

| Dimension | Values                                   |
| --------- | ---------------------------------------- |
| Variant   | uncontained · contained                  |
| Size      | sm · md · lg                             |
| Tint      | neutral · primary · secondary · tertiary |
| Motion    | animating · reduced-motion (resting)     |
| Mode      | indeterminate · (determinate — deferred) |

---

## 8. Out of scope (this bit)

- **Determinate progress** — a measured 0→1 indicator is a later mode / sibling component.
- **Linear / track progress** — a separate progress-bar component, not a loading-indicator mode.
- **Toast / snackbar coupling** — composition is the app's concern, not built in.

---

## 9. Source reconciliation

| Topic       | Material Design 3 (Expressive)        | Compose `LoadingIndicator`                       | Resolution                                                         |
| ----------- | ------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| Variant set | uncontained vs contained              | `LoadingIndicator` / `ContainedLoadingIndicator` | **uncontained + contained** as the `variant` axis.                 |
| Mode        | indeterminate (and determinate)       | indeterminate + determinate overloads            | **indeterminate only** in v1; determinate deferred.                |
| Shape morph | seven Material shapes, spring physics | `polygons: List<RoundedPolygon>` morph           | **curated 4-shape sequence via SVG `d` morph** (approximation) v1. |
| Colour      | primary / surface-container           | `indicatorColor` / `containerColor`              | **`--li-accent` indicator + soft tinted container fill**.          |
| Size        | 38dp indicator / 48dp container       | `LoadingIndicatorDefaults`                       | **sm / md / lg**, `md` = the 38/48 default.                        |

## Acknowledgements

This spec was synthesised from **Material Design 3 (Expressive) — Loading indicator** and the
**Material 3 Jetpack Compose** `LoadingIndicator` / `ContainedLoadingIndicator` API.
`@smuit/loading-indicator` is an **independent implementation** on smuit's own design tokens and
Svelte 5 conventions — it does not depend on, bundle, or copy code from either project; they
informed the anatomy, variants, behaviour, and accessibility model only.
