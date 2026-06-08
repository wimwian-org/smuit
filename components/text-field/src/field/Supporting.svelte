<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Field.Supporting — secondary guidance below the field. Registers itself so the
  control's aria-describedby points here.
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { Snippet } from 'svelte';

    let { children }: { children?: Snippet } = $props();
    const ctx = getFieldContext();
    const styles = $derived(textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }));

    $effect(() => {
        ctx.setSupporting(true);
        return () => ctx.setSupporting(false);
    });
</script>

<span class={styles.supporting()} data-slot="supporting" id={ctx.supportId}>{@render children?.()}</span>
