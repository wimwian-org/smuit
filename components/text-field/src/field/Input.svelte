<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Field.Input — the native single-line <input> control. Reads identity, value,
  and state from the field context; forwards focus/blur and any native input
  attributes.
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { HTMLInputAttributes } from 'svelte/elements';

    type InputProps = Omit<HTMLInputAttributes, 'value' | 'size'> & {
        ref?: HTMLInputElement | null;
    };

    let {
        placeholder,
        onfocus,
        onblur,
        ref = $bindable<HTMLInputElement | null>(null),
        ...restProps
    }: InputProps = $props();

    const ctx = getFieldContext();
    const styles = $derived(textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }));

    function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        ctx.setFocused(true);
        onfocus?.(event);
    }
    function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        ctx.setFocused(false);
        onblur?.(event);
    }
</script>

<input
    bind:this={ref}
    bind:value={ctx.value}
    disabled={ctx.disabled}
    readonly={ctx.readonly}
    maxlength={ctx.maxlength}
    {placeholder}
    {...restProps}
    id={ctx.inputId}
    type="text"
    class={styles.input()}
    data-slot="input"
    aria-describedby={ctx.describedBy}
    onfocus={handleFocus}
    onblur={handleBlur}
/>
