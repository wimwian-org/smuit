<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Field.Counter — `current / max` character count. Renders only when the field
  has a `maxlength`. Decorative (the native maxlength conveys the cap).
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';

    const ctx = getFieldContext();
    const styles = $derived(
        textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }),
    );
    const label = $derived(`${ctx.value.length} / ${ctx.maxlength}`);
</script>

{#if ctx.hasCounter}
    <span class={styles.counter()} data-slot="counter" aria-hidden="true">{label}</span>
{/if}
