<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Field.Supporting — secondary guidance below the field. Registers itself so the
  control's aria-describedby points here. In the error state it shows the error
  text instead — unless the error text is empty, in which case the guidance keeps
  showing (Material Web's replacement rule).
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { Snippet } from 'svelte';

    let { children }: { children?: Snippet } = $props();
    const ctx = getFieldContext();
    const styles = $derived(
        textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled, error: ctx.error }),
    );
    const showError = $derived(ctx.error && !!ctx.errorText);

    $effect(() => {
        ctx.setSupporting(true);
        return () => ctx.setSupporting(false);
    });
</script>

<span class={styles.supporting()} data-slot="supporting" id={ctx.supportId}>
    {#if showError}{ctx.errorText}{:else}{@render children?.()}{/if}
</span>
