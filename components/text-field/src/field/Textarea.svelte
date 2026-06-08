<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Field.Textarea — the native multi-line <textarea> control. Like Field.Input
  but renders a textarea with `rows` (initial height) and CSS `resize`. With
  `autosize` it grows with content (via `field-sizing: content`, rows as the
  floor). Use inside a multiline Field.Root.
-->
<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { HTMLTextareaAttributes } from 'svelte/elements';

    type TextareaProps = Omit<HTMLTextareaAttributes, 'value'> & {
        ref?: HTMLTextAreaElement | null;
        rows?: number;
        autosize?: boolean;
    };

    let {
        placeholder,
        rows = 3,
        autosize = false,
        onfocus,
        onblur,
        ref = $bindable<HTMLTextAreaElement | null>(null),
        ...restProps
    }: TextareaProps = $props();

    const ctx = getFieldContext();
    const styles = $derived(textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }));
    const cls = $derived(
        twMerge(styles.input(), 'resize-y', autosize && 'resize-none [field-sizing:content]'),
    );

    function handleFocus(event: FocusEvent & { currentTarget: HTMLTextAreaElement }) {
        ctx.setFocused(true);
        onfocus?.(event);
    }
    function handleBlur(event: FocusEvent & { currentTarget: HTMLTextAreaElement }) {
        ctx.setFocused(false);
        onblur?.(event);
    }
</script>

<textarea
    bind:this={ref}
    bind:value={ctx.value}
    disabled={ctx.disabled}
    readonly={ctx.readonly}
    maxlength={ctx.maxlength}
    {placeholder}
    {rows}
    {...restProps}
    id={ctx.inputId}
    class={cls}
    data-slot="input"
    aria-describedby={ctx.describedBy}
    onfocus={handleFocus}
    onblur={handleBlur}
></textarea>
