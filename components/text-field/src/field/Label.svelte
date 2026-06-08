<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Field.Label — the floating label. Associated with the control via `for`/`id`;
  visually hidden (but kept for screen readers) in hidden-label mode.
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
    const ctx = getFieldContext();
    const styles = $derived(textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }));
</script>

<label class={styles.label()} class:sr-only={ctx.hideLabel} data-slot="label" for={ctx.inputId}
    >{@render children()}{#if ctx.required && !ctx.noAsterisk}<span data-slot="asterisk" aria-hidden="true">*</span
        >{/if}</label
>

