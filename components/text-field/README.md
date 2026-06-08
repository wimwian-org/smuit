# @smuit/text-field

Material Design 3–style **single-line text field** for Svelte 5, built on the smuit design
tokens. A labelled native `<input>` dressed as a **filled** or **outlined** field, with a
floating label, supporting text, prefix/suffix decorations, leading/trailing icon slots, and a
character counter — themed and dark-mode aware out of the box.

> Built from the [text-field design spec](./text-field-design.md). The field wraps a native
> `<input>` directly (there is no headless primitive for a plain text input); accessibility comes
> from the platform control plus explicit label ↔ input ↔ supporting-text wiring.

## Install

```sh
pnpm add @smuit/text-field
```

`@smuit/theme`, `svelte@^5`, and `tailwindcss@^4` are peer dependencies.

## Usage

```svelte
<script>
    import { TextField } from '@smuit/text-field';

    let email = $state('');
</script>

<TextField label="Email" bind:value={email} placeholder="you@example.com" supportingText="We never share it." />

<!-- filled, small, with decorations and a counter -->
<TextField label="Amount" variant="filled" size="sm" prefix="$" suffix=".00" maxlength={10} />

<!-- leading / trailing icon slots -->
<TextField label="Search">
    {#snippet leadingIcon()}<SearchIcon />{/snippet}
    {#snippet trailingIcon()}<button type="button" aria-label="Clear">×</button>{/snippet}
</TextField>
```

### Composition — the `Field.*` parts

`<TextField>` is a convenience wrapper over a set of composable parts. Reach for the parts
directly when you need full control over the layout. A `Field.Root` owns the shared state (id
wiring, value, disabled/readonly, size/variant/tint, focus + float, counter) and publishes it via
context to the parts beneath it.

```svelte
<script>
    import { Field } from '@smuit/text-field';
    let email = $state('');
</script>

<Field.Root bind:value={email} variant="filled" maxlength={120}>
    <Field.Box>
        <Field.Label>Email</Field.Label>
        <Field.Adornment side="leading"><MailIcon /></Field.Adornment>
        <Field.Input placeholder="you@example.com" />
        <Field.Adornment side="trailing">
            <button type="button" aria-label="Clear">×</button>
        </Field.Adornment>
    </Field.Box>
    <Field.Caption>
        <Field.Supporting>We never share it.</Field.Supporting>
        <Field.Counter />
    </Field.Caption>
</Field.Root>
```

Parts: **`Field.Root`** (shell + context), **`Field.Box`** (the surface), **`Field.Label`**,
**`Field.Adornment`** (`side="leading" | "trailing" | "prefix" | "suffix"`), **`Field.Input`**,
**`Field.Textarea`**, **`Field.Caption`** (the row below), **`Field.Supporting`**, **`Field.Counter`**.
The same parts back `<TextArea>`.

### Multi-line — `<TextArea>`

The multi-line sibling, built from the same parts with a textarea control (top-aligned geometry).
`rows` sets the initial height; `autosize` grows it with content (via `field-sizing`). No
prefix/suffix or icon adornments (not meaningful for multi-line entry).

```svelte
<script>
    import { TextArea } from '@smuit/text-field';
    let bio = $state('');
</script>

<TextArea label="Bio" bind:value={bio} rows={4} maxlength={280} supportingText="A short bio." />
<TextArea label="Notes" variant="filled" autosize placeholder="Grows as you type…" />
```

## Props

| Prop             | Type                                                  | Default      | Description                                                      |
| ---------------- | ----------------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| `label`          | `string`                                              | —            | Field label and accessible name. **Required.**                   |
| `variant`        | `'filled' \| 'outlined'`                              | `'outlined'` | Container treatment.                                             |
| `size`           | `'sm' \| 'md'`                                        | `'md'`       | Density.                                                         |
| `tint`           | `'neutral' \| 'primary' \| 'secondary' \| 'tertiary'` | `'primary'`  | Focus-accent palette (retints `--color-c-*`).                    |
| `value`          | `string`                                              | `''`         | Two-way bindable value.                                          |
| `hideLabel`      | `boolean`                                             | `false`      | Visually hide the label (kept for screen readers).               |
| `placeholder`    | `string`                                              | —            | Hint shown while empty and focused.                              |
| `supportingText` | `string`                                              | —            | Static guidance below the field.                                 |
| `prefix`         | `string`                                              | —            | Static text before the value (e.g. `$`); revealed once floated.  |
| `suffix`         | `string`                                              | —            | Static text after the value (e.g. `.00`); revealed once floated. |
| `leadingIcon`    | `Snippet`                                             | —            | Leading icon slot.                                               |
| `trailingIcon`   | `Snippet`                                             | —            | Trailing icon / action slot.                                     |
| `maxlength`      | `number`                                              | —            | Enables the character counter and soft-caps typed input.         |
| `fullWidth`      | `boolean`                                             | `false`      | Stretch to fill the available inline width.                      |
| `elevation`      | `boolean`                                             | `false`      | Resting shadow that deepens and lifts 2px on focus.              |
| `disabled`       | `boolean`                                             | `false`      | Non-interactive; excluded from submission.                       |
| `readonly`       | `boolean`                                             | `false`      | Not editable, but selectable and focusable.                      |
| `ref`            | `HTMLInputElement \| null`                            | `null`       | `bind:ref` to the underlying `<input>`.                          |

All other native `<input>` attributes (`name`, `id`, `autocomplete`, `oninput`, `onchange`, …)
pass straight through to the underlying element.

### CSS custom properties

| Variable        | Default       | Description                                                                                              |
| --------------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| `--tf-notch-bg` | `--page-bg`   | Backdrop the **outlined** floated label paints over the top border. Set it on an ancestor when the field sits on a non-page surface (e.g. a tinted card) so the notch matches that surface. |

## Scope

This is the **v1 (MVP)** release defined by the [design spec](./text-field-design.md).

**Ships now:** a composable `Field.*` part set with `<TextField>` and `<TextArea>` wrappers; filled ·
outlined variants; single-line `type="text"`; **multiline (`<TextArea>`: rows, resize, autosize)**;
floating label + hidden-label mode; placeholder and supporting text; prefix/suffix text and
leading/trailing icon slots; character counter with `maxlength` (display + soft cap, _not_
validation); small + medium density, full-width, elevation; enabled / hover / focused / populated /
read-only / disabled states; bound and uncontrolled value with `input` / `change` / `focus` /
`blur`; tint + light/dark theming; and label ↔ control ↔ supporting-text accessibility wiring.

**Deferred to a later release:** the legacy _standard_ variant; non-text input types (email,
password, number, search, tel, url, `inputmode`, `pattern`); the **validation & error system**
(`error` flag, error text, the required asterisk / `no-asterisk`, constraint validation, custom
validity, the `invalid` event) — note `maxlength` ships only as the counter's soft cap, not as
validation; select mode; a dedicated number field; and input masking.

## Accessibility

- The visible `label` is programmatically associated with the `<input>` via `for`/`id`, and
  supporting text is referenced through `aria-describedby`.
- `hideLabel` keeps the label available to screen readers (visually hidden, not removed).
- Read-only stays in the tab order and is announced as editable-but-read-only; disabled leaves the
  tab order and is excluded from submission.
- The focus indicator meets AA contrast in both light and dark via the `--color-c-*` accent.

## Acknowledgements

The design spec this component implements was synthesised from two references:

- [**MUI** Text Field](https://mui.com/material-ui/react-text-field/) (React).
- [**Material Web** text field](https://github.com/material-components/material-web/blob/main/docs/components/text-field.md).

`@smuit/text-field` is an **independent implementation** on smuit's own design tokens and Svelte 5
conventions. It does not depend on, bundle, or copy code from either project — they informed the
anatomy, behaviour, and accessibility model only (with Material Web taking precedence where the two
disagreed).

MIT © Anand Panchapakesan
