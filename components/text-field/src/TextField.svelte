<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  <TextField> — a Material Design 3–style single-line text field on smuit tokens.
  A convenience wrapper that composes the Field.* parts (Root, Box, Label,
  Adornment, Input, Caption, Supporting, Counter); reach for the parts directly
  when you need full control over the composition.

    <TextField label="Email" bind:value={email} placeholder="you@example.com" />
-->
<script lang="ts">
    import * as Field from './field';
    import type { Props } from './types';

    let {
        label,
        variant = 'outlined',
        size = 'md',
        tint = 'primary',
        hideLabel = false,
        value = $bindable(''),
        supportingText,
        prefix,
        suffix,
        leadingIcon,
        trailingIcon,
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
        ref = $bindable<HTMLInputElement | null>(null),
        ...restProps
    }: Props = $props();

    const hasBottom = $derived(!!supportingText || maxlength != null || (error && !!errorText));
</script>

<Field.Root
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
        {#if leadingIcon}<Field.Adornment side="leading">{@render leadingIcon()}</Field.Adornment>{/if}
        {#if prefix}<Field.Adornment side="prefix">{prefix}</Field.Adornment>{/if}
        <Field.Input {placeholder} {onfocus} {onblur} bind:ref {...restProps} />
        {#if suffix}<Field.Adornment side="suffix">{suffix}</Field.Adornment>{/if}
        {#if trailingIcon}<Field.Adornment side="trailing">{@render trailingIcon()}</Field.Adornment>{/if}
    </Field.Box>
    {#if hasBottom}
        <Field.Caption>
            <Field.Supporting>{supportingText}</Field.Supporting>
            <Field.Counter />
        </Field.Caption>
    {/if}
</Field.Root>
