<!--
  @smuit/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Field.Adornment — a decoration flanking the value. `side`:
    leading / trailing — icon slots (trailing may hold a focusable action).
    prefix / suffix     — static text (units, currency); revealed once floated.
  Leading/prefix/suffix are hidden from assistive tech; a trailing action must
  carry its own label.
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { Snippet } from 'svelte';

    type Side = 'leading' | 'trailing' | 'prefix' | 'suffix';
    let { side, children }: { side: Side; children: Snippet } = $props();

    const ctx = getFieldContext();
    const styles = $derived(
        textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }),
    );

    // Register a leading adornment so the label start shifts past it.
    $effect(() => {
        if (side !== 'leading') return;
        ctx.setLeading(true);
        return () => ctx.setLeading(false);
    });

    // Prefix/suffix text appears only once the label has floated.
    const visible = $derived(side === 'leading' || side === 'trailing' || ctx.floated);
</script>

{#if visible}
    <span class={styles[side]()} data-slot={side} aria-hidden={side === 'trailing' ? undefined : 'true'}
        >{@render children()}</span
    >
{/if}
