---
'@wimwian-org/text-field': minor
---

Refactor the field into a content-node structure: a new `Field.Line` (single-line row) and `Field.Area` (textarea region) sit inside `Field.Box`, so the variant lives only on the container and the content row is variant-invariant (every variant reuses one baseline row; the per-variant icon-alignment hack is gone).

Breaking (headless `Field.*` composition only — the `<TextField>` / `<TextArea>` / `<NumberField>` / `<PasswordField>` / `<MaskedField>` wrappers are unchanged): wrap the adornments + control in `Field.Line` (or `Field.Area` for a textarea) instead of placing them directly in `Field.Box`. Without the wrapper the row loses its gap and baseline.

```svelte
<Field.Box>
    <Field.Label>Email</Field.Label>
    <Field.Line>
        <Field.Adornment side="leading"><MailIcon /></Field.Adornment>
        <Field.Input />
    </Field.Line>
</Field.Box>
```
