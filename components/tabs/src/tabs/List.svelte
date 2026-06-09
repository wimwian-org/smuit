<!--
  @smuit/tabs
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Tabs.List — the `<div role="tablist">` (wraps `bits-ui` Tabs.List). Lays the
  triggers out (a row when horizontal, a column when vertical), draws the track,
  and renders + positions the single sliding active indicator: a client `$effect`
  keyed on the active value measures the active trigger (subtle → the trigger box;
  bold → its label span) relative to the list and writes the indicator's main-axis
  offset + length. CSS transitions the move; `prefers-reduced-motion` snaps it.

  When `scrollable`, the list becomes an overflow-scroll viewport: the active tab
  is kept scrolled into view, and prev/next affordance buttons appear (only while
  the row overflows) to page the viewport along the active axis.
-->
<script lang="ts">
    import { Tabs as BitsTabs } from 'bits-ui';
    import { tabs } from '../tabs.variants';
    import { twMerge } from 'tailwind-merge';
    import { getTabsContext } from './tabs-context';
    import type { TabsListProps } from '../types';

    let {
        scrollable = false,
        class: className = '',
        ref = $bindable<HTMLDivElement | null>(null),
        children,
        ...restProps
    }: TabsListProps = $props();

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

    const isVertical = $derived(ctx.orientation === 'vertical');

    // Indicator geometry along the active axis, measured from the live DOM
    // (client-only): `pos` is the main-axis offset, `len` the main-axis length.
    let pos = $state(0);
    let len = $state(0);
    let ready = $state(false);

    // Scroll-affordance state (only meaningful when `scrollable`).
    let overflowing = $state(false);
    let canPrev = $state(false);
    let canNext = $state(false);

    const reduced = () =>
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        if (isVertical) {
            pos = rect.top - rootRect.top + root.scrollTop;
            len = rect.height;
        } else {
            pos = rect.left - rootRect.left + root.scrollLeft;
            len = rect.width;
        }
        ready = true;
    }

    function updateScroll() {
        const root = ref;
        if (!root || !scrollable) return;
        const max = isVertical ? root.scrollHeight - root.clientHeight : root.scrollWidth - root.clientWidth;
        const cur = isVertical ? root.scrollTop : root.scrollLeft;
        overflowing = max > 1;
        canPrev = cur > 1;
        canNext = cur < max - 1;
    }

    // Keep the active tab visible — scrolls only the list, never the page.
    function scrollActiveIntoView() {
        const root = ref;
        if (!root || !scrollable) return;
        const active = root.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
        if (!active) return;
        const r = root.getBoundingClientRect();
        const a = active.getBoundingClientRect();
        const behavior = reduced() ? 'auto' : 'smooth';
        if (isVertical) {
            if (a.top < r.top) root.scrollBy({ top: a.top - r.top, behavior });
            else if (a.bottom > r.bottom) root.scrollBy({ top: a.bottom - r.bottom, behavior });
        } else {
            if (a.left < r.left) root.scrollBy({ left: a.left - r.left, behavior });
            else if (a.right > r.right) root.scrollBy({ left: a.right - r.right, behavior });
        }
    }

    // Page the viewport by ~75% on a prev/next button press.
    function pageScroll(dir: -1 | 1) {
        const root = ref;
        if (!root) return;
        const behavior = reduced() ? 'auto' : 'smooth';
        if (isVertical) root.scrollBy({ top: dir * root.clientHeight * 0.75, behavior });
        else root.scrollBy({ left: dir * root.clientWidth * 0.75, behavior });
    }

    // Re-measure when the active value / variant / size / orientation changes, on
    // resize, and after layout settles (rAF, so bits-ui's data-state is applied).
    $effect(() => {
        void ctx.value;
        void ctx.variant;
        void ctx.size;
        void ctx.orientation;
        const root = ref;
        if (!root) return;
        const raf = requestAnimationFrame(() => {
            measure();
            updateScroll();
            scrollActiveIntoView();
        });
        const ro = new ResizeObserver(() => {
            measure();
            updateScroll();
        });
        ro.observe(root);
        const onScroll = () => updateScroll();
        if (scrollable) root.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            if (scrollable) root.removeEventListener('scroll', onScroll);
        };
    });
</script>

{#snippet chevron()}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
{/snippet}

{#snippet listEl()}
    <BitsTabs.List bind:ref class={twMerge(styles.list(), scrollable && 'tabs-list-scroll', className)} {...restProps}>
        {@render children?.()}
        <!-- Decorative. Position is measured at runtime, so it's fed in as custom
             properties (per css-authoring Rule 5); tabs.css consumes them via var(). -->
        <span
            class={styles.indicator()}
            data-slot="indicator"
            data-ready={ready || undefined}
            aria-hidden="true"
            style:--tabs-indicator-pos="{pos}px"
            style:--tabs-indicator-len="{len}px"
        ></span>
    </BitsTabs.List>
{/snippet}

{#if scrollable}
    <div
        class={styles.listWrap()}
        data-slot="list-wrap"
        data-orientation={ctx.orientation}
        data-overflow={overflowing || undefined}
    >
        <button
            type="button"
            class={styles.scrollButton()}
            data-slot="scroll-prev"
            data-dir="prev"
            aria-label="Scroll tabs backward"
            tabindex="-1"
            disabled={!canPrev}
            onclick={() => pageScroll(-1)}
        >
            {@render chevron()}
        </button>
        {@render listEl()}
        <button
            type="button"
            class={styles.scrollButton()}
            data-slot="scroll-next"
            data-dir="next"
            aria-label="Scroll tabs forward"
            tabindex="-1"
            disabled={!canNext}
            onclick={() => pageScroll(1)}
        >
            {@render chevron()}
        </button>
    </div>
{:else}
    {@render listEl()}
{/if}
