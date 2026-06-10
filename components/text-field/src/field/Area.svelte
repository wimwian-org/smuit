<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Field.Area — the multiline content region (.tf-input-area), the textarea
  sibling of Field.Line. Cleanly separated so the single-line row stays a fixed
  baseline with no multiline qualifiers: the textarea's growth and top-room live
  here, while the variant surface stays shared on .tf-container.
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
    const ctx = getFieldContext();
    const styles = $derived(
        textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }),
    );
</script>

<div class={styles.inputArea()} data-slot="input-area">{@render children()}</div>
