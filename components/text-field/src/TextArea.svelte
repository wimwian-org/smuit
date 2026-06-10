<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  <TextArea> — the multi-line sibling of <TextField>. Composes the same Field.*
  parts with a textarea control (top-aligned geometry). `rows` sets the initial
  height; `autosize` grows it with content.

    <TextArea label="Bio" bind:value={bio} rows={4} maxlength={280} />
-->
<script lang="ts">
    import * as Field from './field';
    import type { TextAreaProps } from './TextAreaTypes';

    let {
        label,
        variant = 'outlined',
        size = 'md',
        tint = 'primary',
        hideLabel = false,
        value = $bindable(''),
        supportingText,
        rows = 3,
        autosize = false,
        fullWidth = false,
        elevation = false,
        disabled = false,
        readonly = false,
        error = false,
        errorText,
        required = false,
        noAsterisk = false,
        placeholder,
        maxlength,
        id,
        class: className = '',
        onfocus,
        onblur,
        ref = $bindable<HTMLTextAreaElement | null>(null),
        ...restProps
    }: TextAreaProps = $props();

    const hasBottom = $derived(!!supportingText || maxlength != null || (error && !!errorText));
</script>

<Field.Root
    multiline
    {variant}
    {size}
    {tint}
    {fullWidth}
    {elevation}
    {disabled}
    {readonly}
    {error}
    {errorText}
    {required}
    {noAsterisk}
    {hideLabel}
    {maxlength}
    {id}
    class={className}
    bind:value
>
    <Field.Box>
        <Field.Label>{label}</Field.Label>
        <Field.Area>
            <Field.Textarea {placeholder} {rows} {autosize} {onfocus} {onblur} bind:ref {...restProps} />
        </Field.Area>
    </Field.Box>
    {#if hasBottom}
        <Field.Caption>
            <Field.Supporting>{supportingText}</Field.Supporting>
            <Field.Counter />
        </Field.Caption>
    {/if}
</Field.Root>
