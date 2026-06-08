<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  <TextField> — a Material Design 3–style single-line text field on smuit tokens.
  Dresses a native <input> as a filled or outlined field with a floating label,
  supporting text, prefix/suffix + icon slots, and a character counter.

    <TextField label="Email" bind:value={email} placeholder="you@example.com" />
-->
<script module lang="ts">
    // Per-instance fallback id, so the label↔input wiring works without the
    // consumer having to supply an `id`.
    let uid = 0;
</script>

<script lang="ts">
    // @smuit/theme is a peerDependency; importing it here lets the bit render
    // with design tokens even when the host app hasn't imported the theme.
    import '@smuit/theme';
    import './text-field.css';
    import { textField } from './text-field.variants';
    import { twMerge } from 'tailwind-merge';
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
        disabled = false,
        readonly = false,
        placeholder,
        maxlength,
        id,
        class: className = '',
        onfocus,
        onblur,
        ref = $bindable<HTMLInputElement | null>(null),
        ...restProps
    }: Props = $props();

    uid += 1;
    const autoId = `smuit-text-field-${uid}`;
    const inputId = $derived(id ?? autoId);
    const supportId = $derived(`${inputId}-support`);

    let focused = $state(false);
    const populated = $derived(value.length > 0);
    // The label floats when the field is focused, holds a value, or has no
    // visible label of its own (hidden-label mode shows the placeholder instead).
    const floated = $derived(hideLabel || focused || populated);
    const hasCounter = $derived(maxlength != null);
    const hasBottom = $derived(!!supportingText || hasCounter);
    const counterLabel = $derived(`${value.length} / ${maxlength}`);

    const styles = $derived(textField({ variant, size, tint, fullWidth, disabled }));

    function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        focused = true;
        onfocus?.(event);
    }
    function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        focused = false;
        onblur?.(event);
    }
</script>

<div class={twMerge(styles.root(), className)} data-tint={tint}>
    <div
        class={styles.container()}
        data-slot="container"
        data-variant={variant}
        data-size={size}
        data-floated={floated}
        data-disabled={disabled || undefined}
        data-readonly={readonly || undefined}
        data-hide-label={hideLabel || undefined}
        data-has-leading={leadingIcon ? true : undefined}
    >
        <label class={styles.label()} class:sr-only={hideLabel} data-slot="label" for={inputId}>{label}</label>

        {#if leadingIcon}
            <span class={styles.leading()} data-slot="leading" aria-hidden="true">{@render leadingIcon()}</span>
        {/if}

        <div class={styles.field()} data-slot="field">
            {#if prefix && floated}
                <span class={styles.prefix()} data-slot="prefix" aria-hidden="true">{prefix}</span>
            {/if}

            <input
                bind:this={ref}
                bind:value
                {disabled}
                {readonly}
                {maxlength}
                {placeholder}
                {...restProps}
                id={inputId}
                type="text"
                class={styles.input()}
                data-slot="input"
                aria-describedby={supportingText ? supportId : undefined}
                onfocus={handleFocus}
                onblur={handleBlur}
            />

            {#if suffix && floated}
                <span class={styles.suffix()} data-slot="suffix" aria-hidden="true">{suffix}</span>
            {/if}
        </div>

        {#if trailingIcon}
            <span class={styles.trailing()} data-slot="trailing">{@render trailingIcon()}</span>
        {/if}
    </div>

    {#if hasBottom}
        <div class={styles.bottom()} data-slot="bottom">
            <span class={styles.supporting()} data-slot="supporting" id={supportId}>{supportingText ?? ''}</span>
            {#if hasCounter}
                <span class={styles.counter()} data-slot="counter" aria-hidden="true">{counterLabel}</span>
            {/if}
        </div>
    {/if}
</div>
