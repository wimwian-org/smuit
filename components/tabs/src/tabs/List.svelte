<!--
  @smuit/tabs
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Tabs.List — the `<div role="tablist">` (wraps `bits-ui` Tabs.List). Lays the
  triggers in a row, draws the bottom track, and renders + positions the single
  sliding active indicator: a client `$effect` keyed on the active value measures
  the active trigger (subtle → the trigger box; bold → its label span) relative to
  the list and writes the indicator's transform/width. CSS transitions the move;
  `prefers-reduced-motion` removes the transition so it snaps.
-->
<script lang="ts">
    import { Tabs as BitsTabs } from 'bits-ui';
    import { tabs } from '../tabs.variants';
    import { twMerge } from 'tailwind-merge';
    import { getTabsContext } from './tabs-context';
    import type { TabsListProps } from '../types';

    let {
        class: className = '',
        ref = $bindable<HTMLDivElement | null>(null),
        children,
        ...restProps
    }: TabsListProps = $props();

    const ctx = getTabsContext();
    const styles = $derived(tabs({ variant: ctx.variant, size: ctx.size, tint: ctx.tint }));

    // Indicator geometry, measured from the live DOM (client-only).
    let left = $state(0);
    let width = $state(0);
    let ready = $state(false);

    function measure() {
        const root = ref;
        if (!root) return;
        const active = root.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
        if (!active) {
            ready = false;
            return;
        }
        // bold hugs the label span; subtle spans the whole trigger.
        const target =
            ctx.variant === 'bold' ? (active.querySelector<HTMLElement>('[data-tabs-label]') ?? active) : active;
        const rootRect = root.getBoundingClientRect();
        const rect = target.getBoundingClientRect();
        left = rect.left - rootRect.left + root.scrollLeft;
        width = rect.width;
        ready = true;
    }

    // Re-measure when the active value / variant / size changes, on resize, and
    // after layout settles (rAF, so bits-ui's data-state is already applied).
    $effect(() => {
        void ctx.value;
        void ctx.variant;
        void ctx.size;
        const root = ref;
        if (!root) return;
        const raf = requestAnimationFrame(measure);
        const ro = new ResizeObserver(() => measure());
        ro.observe(root);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    });
</script>

<BitsTabs.List bind:ref class={twMerge(styles.list(), className)} {...restProps}>
    {@render children?.()}
    <!-- Decorative. Position is measured at runtime, so it's fed in as custom
         properties (per css-authoring Rule 5); tabs.css consumes them via var(). -->
    <span
        class={styles.indicator()}
        data-slot="indicator"
        data-ready={ready || undefined}
        aria-hidden="true"
        style:--tabs-indicator-x="{left}px"
        style:--tabs-indicator-w="{width}px"
    ></span>
</BitsTabs.List>
