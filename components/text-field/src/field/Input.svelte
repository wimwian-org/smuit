<!--
  @smuit/text-field
  Copyright (c) 2026 wimwian
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
        type = 'text',
        placeholder,
        onfocus,
        onblur,
        oninput,
        oninvalid,
        onkeydown,
        ref = $bindable<HTMLInputElement | null>(null),
        ...restProps
    }: InputProps = $props();

    const ctx = getFieldContext();
    const styles = $derived(
        textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }),
    );
    const activeId = $derived(ctx.open && ctx.activeIndex >= 0 ? ctx.optionId(ctx.activeIndex) : undefined);

    function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        ctx.setFocused(true);
        ctx.openList();
        onfocus?.(event);
    }
    function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        ctx.setFocused(false);
        ctx.closeList();
        onblur?.(event);
    }
    function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
        if (ctx.hasSuggestions) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                ctx.move(1);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                ctx.move(-1);
            } else if (event.key === 'Enter' && ctx.open && ctx.activeIndex >= 0) {
                event.preventDefault();
                ctx.selectActive();
            } else if (event.key === 'Escape' && ctx.open) {
                event.preventDefault();
                ctx.closeList();
            }
        }
        onkeydown?.(event);
    }
    function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
        ctx.setInvalid(false); // editing clears a reported constraint error
        oninput?.(event as Parameters<NonNullable<typeof oninput>>[0]);
    }
    function handleInvalid(event: Event & { currentTarget: HTMLInputElement }) {
        ctx.setInvalid(true); // a reported/submitted constraint failure
        oninvalid?.(event as Parameters<NonNullable<typeof oninvalid>>[0]);
    }
</script>

<input
    bind:this={ref}
    bind:value={ctx.value}
    disabled={ctx.disabled}
    readonly={ctx.readonly}
    required={ctx.required}
    maxlength={ctx.maxlength}
    {placeholder}
    {...restProps}
    id={ctx.inputId}
    {type}
    class={styles.input()}
    data-slot="input"
    aria-describedby={ctx.describedBy}
    aria-invalid={ctx.error || undefined}
    role={ctx.hasSuggestions ? 'combobox' : undefined}
    aria-autocomplete={ctx.hasSuggestions ? 'list' : undefined}
    aria-expanded={ctx.hasSuggestions ? ctx.open : undefined}
    aria-controls={ctx.hasSuggestions ? ctx.listId : undefined}
    aria-activedescendant={activeId}
    onfocus={handleFocus}
    onblur={handleBlur}
    oninput={handleInput}
    oninvalid={handleInvalid}
    onkeydown={handleKeydown}
/>
