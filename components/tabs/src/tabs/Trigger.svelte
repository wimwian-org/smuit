<!--
  @smuit/tabs
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Tabs.Trigger — a `<button role="tab">` (wraps `bits-ui` Tabs.Trigger). Needs a
  `value`; bits-ui owns the role, `aria-controls`, `aria-selected`, roving focus,
  and the `data-state` / `data-disabled` hooks. Renders an optional leading icon
  (inline before the label, or stacked above it per the root `iconLayout`), a
  measurable label span (the bold indicator hugs this span), and an optional
  trailing badge (a count or dot).
-->
<script lang="ts">
    import { Tabs as BitsTabs } from 'bits-ui';
    import { tabs } from '../tabs.variants';
    import { twMerge } from 'tailwind-merge';
    import { getTabsContext } from './tabs-context';
    import type { TabsTriggerProps } from '../types';

    let {
        value,
        disabled = false,
        icon,
        badge,
        class: className = '',
        ref = $bindable<HTMLButtonElement | null>(null),
        children,
        ...restProps
    }: TabsTriggerProps = $props();

    const ctx = getTabsContext();
    const styles = $derived(
        tabs({
            variant: ctx.variant,
            size: ctx.size,
            tint: ctx.tint,
            orientation: ctx.orientation,
            iconLayout: ctx.iconLayout,
        }),
    );
</script>

<BitsTabs.Trigger
    bind:ref
    {value}
    {disabled}
    class={twMerge(styles.trigger(), className)}
    data-slot="trigger"
    {...restProps}
>
    {#if icon}<span class={styles.icon()} data-slot="icon" aria-hidden="true">{@render icon()}</span>{/if}
    <span class={styles.label()} data-tabs-label data-slot="label">{@render children?.()}</span>
    {#if badge}<span class={styles.badge()} data-slot="badge">{@render badge()}</span>{/if}
</BitsTabs.Trigger>
