<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Field.Box — the visible field surface (filled background or outlined frame).
  Carries the variant/size/state data hooks the CSS keys off. Holds the label,
  adornments, and control.
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
    const ctx = getFieldContext();
    const styles = $derived(
        textField({
            variant: ctx.variant,
            size: ctx.size,
            tint: ctx.tint,
            elevation: ctx.elevation,
            multiline: ctx.multiline,
            disabled: ctx.disabled,
            error: ctx.error,
        }),
    );
</script>

<div
    class={styles.container()}
    data-slot="container"
    data-variant={ctx.variant}
    data-size={ctx.size}
    data-floated={ctx.floated}
    data-disabled={ctx.disabled || undefined}
    data-readonly={ctx.readonly || undefined}
    data-elevation={ctx.elevation || undefined}
    data-multiline={ctx.multiline || undefined}
    data-hide-label={ctx.hideLabel || undefined}
    data-has-leading={ctx.hasLeading || undefined}
>
    {@render children()}
</div>
