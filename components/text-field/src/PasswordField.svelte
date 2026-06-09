<!--
  @smuit/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  <PasswordField> — a password field built on the Field.* parts. Renders a masked
  `type="password"` input with a built-in show/hide reveal toggle in the trailing
  slot, and defaults `autocomplete` to "current-password". Set `revealable={false}`
  to drop the toggle (e.g. a confirm-password or one-time-code field).

    <PasswordField label="Password" bind:value={pw} />
-->
<script lang="ts">
    import * as Field from './field';
    import type { PasswordFieldProps } from './types';

    let {
        label,
        variant = 'outlined',
        size = 'md',
        tint = 'primary',
        hideLabel = false,
        value = $bindable(''),
        supportingText,
        leadingIcon,
        fullWidth = false,
        elevation = false,
        disabled = false,
        readonly = false,
        error = false,
        errorText,
        required = false,
        noAsterisk = false,
        revealable = true,
        autocomplete = 'current-password',
        placeholder,
        maxlength,
        id,
        class: className = '',
        onfocus,
        onblur,
        ref = $bindable<HTMLInputElement | null>(null),
        ...restProps
    }: PasswordFieldProps = $props();

    /** Whether the value is shown as plain text (toggled by the reveal button). */
    let revealed = $state(false);
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
        <Field.Input
            type={revealed ? 'text' : 'password'}
            {placeholder}
            {autocomplete}
            {onfocus}
            {onblur}
            bind:ref
            {...restProps}
        />
        {#if revealable}
            <Field.Adornment side="trailing">
                <button
                    type="button"
                    class="tf-reveal"
                    data-slot="reveal-toggle"
                    {disabled}
                    aria-pressed={revealed}
                    aria-label={revealed ? 'Hide password' : 'Show password'}
                    onclick={() => (revealed = !revealed)}
                >
                    {#if revealed}
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                    {:else}
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    {/if}
                </button>
            </Field.Adornment>
        {/if}
    </Field.Box>
    {#if hasBottom}
        <Field.Caption>
            <Field.Supporting>{supportingText}</Field.Supporting>
            <Field.Counter />
        </Field.Caption>
    {/if}
</Field.Root>
