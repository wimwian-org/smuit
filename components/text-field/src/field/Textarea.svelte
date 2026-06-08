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
        oninput,
        oninvalid,
        ref = $bindable<HTMLTextAreaElement | null>(null),
        ...restProps
    }: TextareaProps = $props();

    const ctx = getFieldContext();
    const styles = $derived(textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }));
    // `tf-autosize` (CSS) owns field-sizing + a rows-based min-height + overflow:
    // hidden so it grows cleanly with no scrollbar. Otherwise: manual vertical resize.
    const cls = $derived(twMerge(styles.input(), autosize ? 'tf-autosize' : 'resize-y'));

    function handleFocus(event: FocusEvent & { currentTarget: HTMLTextAreaElement }) {
        ctx.setFocused(true);
        onfocus?.(event);
    }
    function handleBlur(event: FocusEvent & { currentTarget: HTMLTextAreaElement }) {
        ctx.setFocused(false);
        onblur?.(event);
    }
    function handleInput(event: Event & { currentTarget: HTMLTextAreaElement }) {
        ctx.setInvalid(false);
        oninput?.(event as Parameters<NonNullable<typeof oninput>>[0]);
    }
    function handleInvalid(event: Event & { currentTarget: HTMLTextAreaElement }) {
        ctx.setInvalid(true);
        oninvalid?.(event as Parameters<NonNullable<typeof oninvalid>>[0]);
    }
</script>

<textarea
    bind:this={ref}
    bind:value={ctx.value}
    disabled={ctx.disabled}
    readonly={ctx.readonly}
    required={ctx.required}
    maxlength={ctx.maxlength}
    {placeholder}
    {rows}
    {...restProps}
    id={ctx.inputId}
    class={cls}
    style:--tf-rows={rows}
    data-slot="input"
    aria-describedby={ctx.describedBy}
    aria-invalid={ctx.error || undefined}
    onfocus={handleFocus}
    onblur={handleBlur}
    oninput={handleInput}
    oninvalid={handleInvalid}
></textarea>
