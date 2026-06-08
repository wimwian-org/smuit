# Text Field — Design Spec

A design breakdown (no implementation) for the `@smuit/text-field` bit: architecture,
design elements, and key behaviours. Synthesised from two references:

1. **MUI** — `components/text-field/text-field.md` (React Text Field).
2. **Material Web** — <https://github.com/material-components/material-web/blob/main/docs/components/text-field.md>.

**Precedence:** where the two clash, the **later source (Material Web) wins.** The most
material consequences of that rule are called out in [§9 Source reconciliation](#9-source-reconciliation).

---

## MVP Scope (v1)

The first release is a **single-line text entry** — filled or outlined, with a label
(including hidden-label), supporting text, **prefix/suffix text and icons**, and a **character
counter** — across the core interaction states. Everything tied to alternate input types and to
validation is deferred. This maps to the six MVP constraints — (1) no standard variant ·
(2) no multiline · (3) text only · (4) hidden-label kept · (5) validity & multiplicity out ·
(6) all §8 items out — **amended to bring the character counter (with a max length) and all
prefix/suffix decorations into v1.**

> The counter and max length are treated as **display + a soft input cap**, not as error
> validation — so they ship in v1 even though the validity/error system stays deferred.

### In scope — v1

| Area            | What ships                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Variants**    | Filled · outlined.                                                                                                                  |
| **Input**       | Single-line, `type="text"` **only** — plain vanilla text entry.                                                                     |
| **Label**       | Floating label **+ hidden-label** mode.                                                                                             |
| **Helper**      | Placeholder; **supporting text** (static guidance, no error styling).                                                               |
| **Decorations** | **Prefix/suffix text** (units, currency, domains) **and leading/trailing icons** (incl. a trailing action slot).                    |
| **Counter**     | **Character count** with **max length** — live `current / max` display; max caps input. Display + soft cap, _not_ error validation. |
| **Sizing**      | Small + medium density; full-width; standard margins; small corner shape.                                                           |
| **States**      | Enabled · hover · focused · populated · read-only · disabled.                                                                       |
| **Value**       | Controlled (bound) and uncontrolled (default) value; `input` / `change` / `focus` / `blur` events.                                  |
| **Theming**     | smuit surface/content tokens; palette tint + light/dark.                                                                            |
| **A11y**        | Label ↔ input ↔ supporting-text association; AA focus contrast.                                                                     |

### Deferred — next

| Area                         | Why it waits                                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Standard variant**         | Constraint (1); legacy underline-only variant.                                                                                                                                                                                                                                                                                            |
| **Multiline / textarea**     | Constraint (2); `rows`, autosize, the _Multiplicity_ axis (§7).                                                                                                                                                                                                                                                                           |
| **Non-text input types**     | Constraint (3); email, password, number, search, tel, url — plus `inputmode`, `pattern`, type-specific keyboards and affordances (e.g. password reveal).                                                                                                                                                                                  |
| **Validation & error state** | Constraint (5), _Validity_ axis (§5.3): the `error` flag, error text, constraint validation (`required` enforcement, `minlength`, pattern), custom validity, validity properties, and the `invalid` event. **The required marker / asterisk and `no-asterisk` move with it.** (`maxlength` itself ships in v1 as the counter's soft cap.) |
| **All of §8**                | Constraint (6); select mode, dedicated number field, masking / third-party input formatting.                                                                                                                                                                                                                                              |

> v1 ships a fully-decorated single-line text field — container, label float, supporting text,
> prefix/suffix + icons, and the character counter — wired up with theming and a11y. What's
> held back is the **input-type matrix** and the **validation/error system**; later releases
> layer those onto this base.

---

## 1. Purpose

A text field lets a user enter and edit a single value — most often a line of text, but
also email, password, search, telephone, URL, numeric, or multi-line input. It is the
atomic form control: a labelled, validatable input with optional supporting guidance,
decorations, and error feedback. It typically lives inside forms and dialogs.

---

## 2. Architecture

### 2.1 Layering

The bit follows the smuit headless-wrapping model: native behaviour and accessibility from
the platform `<input>`/`<textarea>`, smuit styling and tokens on top. Three conceptual
layers:

| Layer                  | Responsibility                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Form-control shell** | Owns identity (`id`), the label↔input↔supporting-text wiring, validity/disabled/required context, and vertical rhythm. Equivalent to MUI's `FormControl`.      |
| **Field container**    | The visible surface: filled background or outlined frame, the active indicator/outline, leading/trailing icon slots, prefix/suffix text, and the input region. |
| **Native control**     | The real `<input>` or `<textarea>` — the source of truth for value, selection, constraint validation, and form participation. Never replaced, only dressed.    |

A consumer should be able to use the whole field as one component, and (for advanced cases)
reach the underlying native element to set arbitrary attributes — MUI's "the component takes
care of the most-used properties; the rest is yours via the input slot" principle.

### 2.2 Anatomy

```
            ┌─ label (floats up when focused or populated)
            │        ┌─ leading icon         ┌─ trailing icon / action
  ┌─────────┴────────┴───────────────────────┴───────┐
  │ [icon]  Label                                     │  ← container (filled bg / outlined frame)
  │ [icon]  $  value text            .00   [👁]       │  ← prefix · input/value · suffix · action
  └───────────────────────────────────────────────────┘  ← active indicator (filled) / outline (outlined)
    Supporting text…                            12 / 50    ← supporting OR error text   ·   character counter
```

### 2.3 Parts & slots

| Part                           | Role                                        | Notes                                                                              |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Container**                  | The field's surface                         | Filled background or outlined border frame.                                        |
| **Active indicator / outline** | Focus & state emphasis                      | Filled → bottom indicator; outlined → the border (with a notch the label sits in). |
| **Label** (floating)           | Names the expected input                    | Always present; floats on focus or when populated.                                 |
| **Input / value region**       | Editable text                               | Behaves as native `<input>`/`<textarea>`.                                          |
| **Placeholder**                | Hint when empty                             | Does **not** float; disappears on input.                                           |
| **Prefix text**                | Static text before the value                | e.g. `$`.                                                                          |
| **Suffix text**                | Static text after the value                 | e.g. `.00`, `@gmail.com`, units.                                                   |
| **Leading icon** (slot)        | Context / input-method hint                 | Decorative or informative.                                                         |
| **Trailing icon** (slot)       | Action / state                              | e.g. password-reveal toggle, clear, validation glyph.                              |
| **Supporting text**            | Secondary guidance below the field          | a.k.a. helper text.                                                                |
| **Error text**                 | Replaces supporting text in the error state | See [§5.3](#53-validation--error).                                                 |
| **Character counter**          | `current / max` below the field             | Shown when a max length is set.                                                    |

> **Terminology (Material Web wins):** the text below the field is **supporting text**
> (MUI calls it _helper text_ — treated as an alias). Decorations are **leading/trailing
> icons** and **prefix/suffix text** (MUI's _start/end InputAdornment_ maps onto these).

### 2.4 State ownership

- **Value model.** Supports both a bound/controlled value and an uncontrolled default value
  (MUI's controlled vs. uncontrolled). The native control remains the value's source of truth.
- **Form participation (Material Web).** The field is form-associated: it submits under its
  `name`, restores on form reset to its default value, and contributes to the form's overall
  validity. This is canonical and takes precedence over a purely parent-managed model.
- **Inherited context.** Disabled, required, error, size, and the focus colour cascade from the
  form-control shell to the parts (mirrors MUI's `FormControl`/`useFormControl` context and
  Material Web's attributes).

---

## 3. Variants

| Variant      | Container treatment                                                                   | Status                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Filled**   | Tonal background fill; bottom **active indicator** that thickens/colours on focus.    | First-class.                                                                                                                                |
| **Outlined** | Transparent inside a **border frame**; the label notches the top border when floated. | First-class.                                                                                                                                |
| **Standard** | Underline-only, no fill or frame.                                                     | **Legacy.** Deprecated in Material Design and absent from Material Web; offer only as an opt-in compatibility variant (MUI still ships it). |

Because Material Web wins clashes, **filled and outlined are the two supported variants**;
_standard_ is explicitly legacy rather than a default. Recommended default: **outlined**
(MUI's default and the most neutral on smuit surfaces) — but this is a system choice, not a
hard rule.

The two primary variants are **functionally identical**; the choice is visual hierarchy and
density, not behaviour.

---

## 4. Design elements

### 4.1 Shape, density & sizing

- **Shape:** small/extra-small corner radius on the container.
- **Density:** at least two sizes (MUI `small` / normal). A "hidden label" mode (filled, label
  rendered outside) reduces height further.
- **Width:** intrinsic by default; a full-width mode stretches to the container.
- **Margin/rhythm:** the shell controls vertical spacing presets (none/dense/normal).
- **Multiline height:** see [§5.4](#54-multiline--textarea).

### 4.2 Typography (smuit type ramp)

| Element                  | Ramp token (suggested)                                          |
| ------------------------ | --------------------------------------------------------------- |
| Input value              | `--text-body-md`                                                |
| Floating label (resting) | `--text-body-md`; shrinks toward `--text-label-md` when floated |
| Supporting / error text  | `--text-body-sm`                                                |
| Character counter        | `--text-label-sm`, tabular numerals                             |
| Prefix / suffix          | matches the input value                                         |

### 4.3 Colour & theming (token mapping)

Material Web expresses these as `--md-*-text-field-*` tokens over the MD system palette. The
smuit equivalents resolve through the flat theme's surface/content/RAG tokens so the field
retints with the active palette and flips with light/dark automatically:

| Concept                            | Material Web token (reference)                  | smuit token (suggested)                                             |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| Filled container                   | `container-color` (`surface-container-highest`) | `--surface-bg-muted` / `--surface-bg`                               |
| Container shape                    | `container-shape` (`corner-extra-small`)        | small radius scale                                                  |
| Active indicator / outline (rest)  | outline color                                   | `--surface-border`                                                  |
| Active indicator / outline (focus) | `focus-*-color` (`primary`)                     | `--surface-accent`                                                  |
| Input & label text                 | `input-text` / `label-text` (`body-large`)      | `--surface-fg` over `--text-body-md`                                |
| Supporting text                    | supporting-text-color                           | muted `--surface-fg`                                                |
| Error indicator / text             | error (`error`)                                 | the **error** RAG palette (`--color-error-*` / `--surface-error-*`) |
| Disabled                           | reduced-opacity tokens                          | neutral/`mono` at reduced opacity                                   |

Default focus colour is the palette accent; a `color` override (MUI) can repoint focus emphasis
to another tint (e.g. `secondary`, `success`, `warning`).

---

## 5. Key behaviours

### 5.1 Floating label & populated state

- The label starts aligned with the input. It **floats** to the top edge when the field gains
  focus **or** when it holds a value, and stays floated while populated.
- In the **outlined** variant the floated label notches the top border; in **filled** it rises
  within the fill above the value.
- Placeholder text is distinct from the label: it shows only while empty and focused, and never
  floats.
- **Edge cases (MUI):** for inputs the field can't introspect for emptiness (date/time, masked,
  third-party), the float state may be wrong and overlap — expose a way to force the floated
  state. Ensure the input is wider than the label so the floated label renders cleanly.

### 5.2 Interaction states

| State                 | Treatment                                                                      |
| --------------------- | ------------------------------------------------------------------------------ |
| Enabled (rest)        | Neutral border/indicator and muted label.                                      |
| Hover                 | Slightly stronger border/indicator.                                            |
| Focused               | Accent active indicator/outline; label floated and accent-coloured.            |
| Populated (unfocused) | Label stays floated; neutral emphasis.                                         |
| Read-only             | Renders normally, value selectable, **not** editable; still focusable.         |
| Disabled              | Reduced opacity; non-interactive; excluded from submission and validation.     |
| Error                 | Error-palette indicator/label/text; optional error glyph in the trailing slot. |

### 5.3 Validation & error

- **Two ways to enter the error state:**
    1. **Manual** — an explicit `error` flag immediately paints the error styling (MUI's model).
    2. **Constraint validation (Material Web)** — native constraints (`required`, `minlength`/
       `maxlength`, `min`/`max`, `step`, `pattern`, `type=email`, `multiple`) evaluated through
       `checkValidity()` / `reportValidity()`; errors surface when reported or on submit attempt.
- **Error text replaces supporting text** while in error. Key nuance (Material Web): if the
  error text is **empty**, the supporting text keeps showing — so an explicit error flag can
  colour the field without blanking its guidance.
- **Custom validity** — a custom message can be set (`setCustomValidity`), which makes the field
  invalid and is surfaced as the validation message.
- **Exposed validity** — `validity` (ValidityState), `validationMessage`, and `willValidate`
  are readable for app-level logic.
- **Error timing.** Manual errors show instantly; constraint errors should appear on
  _report_/submit, not on every keystroke, to avoid punishing mid-typing.
- **Required & the asterisk.** `required` marks the field mandatory and renders an asterisk on
  the label; a `no-asterisk` option suppresses the glyph while keeping the semantics.

### 5.4 Multiline / textarea

- Multi-line mode renders a `<textarea>` (Material Web: `type="textarea"`; MUI: a `multiline`
  flag).
- **Sizing:** a `rows` count sets the initial visible lines (Material Web default 2; `cols` sets
  width). CSS `resize` governs user resizing.
- **Autosize (MUI enhancement, additive):** optionally grow with content, bounded by min/max
  rows. This layers on top of the textarea model rather than replacing it.

### 5.5 Input types & keyboard

- Supported `type`s: text (default), email, number, password, search, tel, url, and textarea.
- `inputmode` refines the on-screen keyboard independently of `type`; `autocomplete` enables
  browser suggestions; `pattern` constrains accepted input.
- Standard text-editing keys apply. Enter submits the owning form except inside a textarea,
  where it inserts a newline. Tab follows the form sequence.
- **`type="number"` caveat (MUI):** discouraged for general numeric entry (it accepts/strips
  stray characters and scroll-to-change is error-prone) — prefer a dedicated number field for
  validated numerics.

### 5.6 Decorations & actions

- **Prefix/suffix text** flank the value (units, currency, domains). A common pattern reveals a
  suffix only once the label has floated.
- **Leading icon** is contextual; **trailing icon** is typically an action — most notably a
  **password-visibility toggle**, or a clear/validation affordance. Trailing actions are real,
  focusable controls, not decoration.

### 5.7 Events & methods (contract)

- **Events:** `input` (per keystroke), `change` (on commit/blur), `select` (selection), `invalid`
  (failed constraint validation). `focus`/`blur` for state transitions.
- **Methods:** focus/select; selection range manipulation; `stepUp`/`stepDown` and `showPicker`
  for the relevant types; `reset`; and the validation trio `checkValidity` /
  `reportValidity` / `setCustomValidity`.

---

## 6. Accessibility

- **Label association is mandatory.** The input must be programmatically linked to its label and
  its supporting/error text — visible label tied to the input, supporting/error text referenced
  via `aria-describedby`. Providing a stable `id` is what makes this wiring work (MUI).
- **Accessible name (Material Web):** the floating `label` sets the accessible name, but
  `aria-label` overrides it; an external/standalone label should be paired with `aria-label`
  (note: `aria-labelledby` is not currently honoured by Material Web's field).
- **Error announcement:** error text lives in the supporting-text region and is announced when
  validity is reported; custom validity messages are exposed via the validation message.
- **Required:** conveyed both visually (asterisk, unless suppressed) and semantically.
- **Read-only vs disabled:** read-only stays in the tab order and is announced as editable-but-
  read-only; disabled leaves the tab order and is excluded from validation/submission.
- **Focus visibility** must meet AA contrast in both light and dark (smuit's standing rule).

---

## 7. Behavioural state matrix

| Dimension    | Values                                                            |
| ------------ | ----------------------------------------------------------------- |
| Variant      | filled · outlined · (standard, legacy)                            |
| Size         | small · medium (· hidden-label)                                   |
| Value state  | empty · populated                                                 |
| Focus        | blurred · focused                                                 |
| Interaction  | enabled · hover · read-only · disabled                            |
| Validity     | valid · error (manual) · error (constraint)                       |
| Multiplicity | single-line · multiline (fixed rows · autosize)                   |
| Decoration   | none · leading icon · trailing action · prefix · suffix · counter |
| Tint         | inherits active palette; focus colour overridable                 |

---

## 8. Out of scope (this bit)

- **Select.** MUI folds a select mode into `TextField`; Material Web keeps it separate. Follow
  Material Web — a menu/select is its own component, not a text-field mode.
- **Number field.** Validated numeric entry is a separate, dedicated component (both refs warn
  against `type="number"`).
- **Masking / third-party formatting.** Supported only insofar as the underlying native input is
  reachable; not a built-in feature.

---

## 9. Source reconciliation

Where MUI and Material Web disagree, Material Web (the later source) wins. The decisions:

| Topic                     | MUI                                   | Material Web                                                      | Resolution                                                                            |
| ------------------------- | ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Variant set               | outlined · filled · standard          | filled · outlined                                                 | **filled + outlined**; standard demoted to legacy.                                    |
| Below-field text          | "helper text"                         | "supporting text"                                                 | **supporting text** (helper = alias).                                                 |
| Decorations               | start/end `InputAdornment`            | leading/trailing icon slots + prefix/suffix text                  | **icons + prefix/suffix**.                                                            |
| Validation                | `error` flag + parent context         | native constraint validation + form participation                 | **native, form-associated validation**; manual `error` retained as an override.       |
| Error vs. supporting text | helper text shown alongside           | error text replaces supporting; empty error text keeps supporting | **Material Web replacement rule.**                                                    |
| Multiline                 | `multiline` + autosize (min/max rows) | `type="textarea"` + `rows`/`cols` + CSS resize                    | **textarea model**; autosize kept as an additive enhancement.                         |
| Character counter         | not built in                          | `maxlength` → counter                                             | **counter included.**                                                                 |
| Select mode               | part of TextField                     | separate component                                                | **excluded** from the text field.                                                     |
| Accessible name           | id-linked `<label>`                   | `label` attr, overridable by `aria-label`                         | **Material Web naming**, plus MUI's id-based label/description wiring for robustness. |
