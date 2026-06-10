<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Field.Line — the single-line content row (.tf-input-line). Holds the
  adornments and the <input> on one fixed baseline. It is variant-invariant:
  every variant (outlined / filled / standard) reuses it unchanged — the
  variant surface and the line's placement live on .tf-container. Sibling of
  Field.Label (the label is positioned against the container, not the line).
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

<div class={styles.inputLine()} data-slot="input-line">{@render children()}</div>
