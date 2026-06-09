<!--
  @smuit/tabs
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Tabs.Root — the state owner. Wraps `bits-ui` Tabs.Root (which owns the active
  `value`, the activation mode, the roving keyboard nav, the `orientation` axis,
  and the tablist/panel ARIA wiring). Publishes a TabsContext (variant / size /
  tint / orientation / iconLayout + a getter for the active value) so Tabs.List
  can position the sliding indicator on the right axis and the triggers can read
  the axes. Compose `Tabs.List` + `Tabs.Content` as children.
-->
<script lang="ts">
    import { Tabs as BitsTabs } from 'bits-ui';
    // @smuit/theme is a peerDependency; importing it here lets the bit render
    // with design tokens even when the host app hasn't imported the theme.
    import '@smuit/theme';
    import '../tabs.css';
    import { tabs } from '../tabs.variants';
    import { twMerge } from 'tailwind-merge';
    import { setTabsContext, type TabsContext } from './tabs-context';
    import type { TabsRootProps } from '../types';

    let {
        value = $bindable(undefined),
        variant = 'bold',
        size = 'md',
        tint = 'neutral',
        orientation = 'horizontal',
        iconLayout = 'inline',
        activationMode = 'automatic',
        loop = true,
        disabled = false,
        class: className = '',
        ref = $bindable(null),
        children,
        ...restProps
    }: TabsRootProps = $props();

    const ctx: TabsContext = {
        get variant() {
            return variant;
        },
        get size() {
            return size;
        },
        get tint() {
            return tint;
        },
        get orientation() {
            return orientation;
        },
        get iconLayout() {
            return iconLayout;
        },
        get value() {
            return value;
        },
    };
    setTabsContext(ctx);

    const styles = $derived(tabs({ variant, size, tint, orientation, iconLayout }));
</script>

<BitsTabs.Root
    bind:ref
    bind:value
    {orientation}
    {activationMode}
    {loop}
    {disabled}
    class={twMerge(styles.root(), className)}
    data-variant={variant}
    data-size={size}
    data-tint={tint}
    {...restProps}
>
    {@render children?.()}
</BitsTabs.Root>
