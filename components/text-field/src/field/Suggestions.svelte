<!--
  @smuit/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Field.Suggestions — the autosuggest listbox. Renders when the field is open and
  has suggestions; keyboard nav (Up/Down/Enter/Esc) is driven from the control via
  the context, so options aren't focusable (active option via aria-activedescendant).
  Pointer-down selects without stealing focus from the input.
-->
<script lang="ts">
    import { textField } from '../text-field.variants';
    import { getFieldContext } from './field-context';

    const ctx = getFieldContext();
    const styles = $derived(
        textField({ variant: ctx.variant, size: ctx.size, tint: ctx.tint, disabled: ctx.disabled }),
    );
</script>

{#if ctx.open}
    <ul class={styles.popup()} role="listbox" id={ctx.listId} aria-label="Suggestions" data-slot="suggestions">
        {#each ctx.suggestions as suggestion, i (i)}
            <li
                class={styles.option()}
                role="option"
                id={ctx.optionId(i)}
                aria-selected={i === ctx.activeIndex}
                data-slot="option"
                onmousedown={(e) => {
                    e.preventDefault();
                    ctx.select(i);
                }}
                onmouseenter={() => ctx.setActive(i)}
            >
                {suggestion}
            </li>
        {/each}
    </ul>
{/if}
