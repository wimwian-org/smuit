<!--
  @smuit/tabs
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Tabs.Content — a `<div role="tabpanel">` (wraps `bits-ui` Tabs.Content). Needs a
  `value` matching its trigger; bits-ui owns the `aria-labelledby` wiring and the
  show/hide of inactive panels. Shown when its tab is active.
-->
<script lang="ts">
    import { Tabs as BitsTabs } from 'bits-ui';
    import { tabs } from '../tabs.variants';
    import { twMerge } from 'tailwind-merge';
    import { getTabsContext } from './tabs-context';
    import type { TabsContentProps } from '../types';

    let {
        value,
        class: className = '',
        ref = $bindable<HTMLDivElement | null>(null),
        children,
        ...restProps
    }: TabsContentProps = $props();

    const ctx = getTabsContext();
    const styles = $derived(tabs({ variant: ctx.variant, size: ctx.size, tint: ctx.tint }));
</script>

<BitsTabs.Content bind:ref {value} class={twMerge(styles.content(), className)} data-slot="content" {...restProps}>
    {@render children?.()}
</BitsTabs.Content>
