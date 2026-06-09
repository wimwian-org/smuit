<!--
  @wimwian-org/tabs
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!-- Test harness — a full Tabs composition driven by props. -->
<script lang="ts">
    import * as Tabs from './tabs';
    import type { TabsVariant, TabsSize, TabsTint, TabsOrientation, TabsIconLayout } from './types';

    let {
        variant = undefined,
        size = undefined,
        tint = undefined,
        orientation = undefined,
        iconLayout = undefined,
        activationMode = undefined,
        value = 'one',
        disabledTwo = false,
        triggerClass = undefined,
        scrollable = false,
        badgeTwo = false,
        // Renders extra triggers so a constrained scrollable row genuinely
        // overflows its viewport (exercising the scroll-affordance / measure paths).
        extraTabs = 0,
    }: {
        variant?: TabsVariant;
        size?: TabsSize;
        tint?: TabsTint;
        orientation?: TabsOrientation;
        iconLayout?: TabsIconLayout;
        activationMode?: 'automatic' | 'manual';
        value?: string;
        disabledTwo?: boolean;
        triggerClass?: string;
        scrollable?: boolean;
        badgeTwo?: boolean;
        extraTabs?: number;
    } = $props();

    const extras = $derived(Array.from({ length: extraTabs }, (_, i) => `extra-${i}`));
</script>

{#snippet twoBadge()}<span data-testid="tab-badge">3</span>{/snippet}

<!-- Sets the active value programmatically (no tab focus → no native focus-scroll),
     so the bit's own scroll-active-into-view path runs against an off-view tab. -->
<button
    data-testid="set-value"
    aria-label="set active value"
    onclick={(e) => (value = (e.currentTarget as HTMLButtonElement).dataset.v ?? value)}
></button>

<Tabs.Root {variant} {size} {tint} {orientation} {iconLayout} {activationMode} bind:value>
    <Tabs.List {scrollable}>
        <Tabs.Trigger value="one" class={triggerClass}>One</Tabs.Trigger>
        <Tabs.Trigger value="two" disabled={disabledTwo} badge={badgeTwo ? twoBadge : undefined}>Two</Tabs.Trigger>
        <Tabs.Trigger value="three">
            {#snippet icon()}
                <svg data-testid="tab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16" /></svg>
            {/snippet}
            Three
        </Tabs.Trigger>
        {#each extras as v (v)}
            <Tabs.Trigger value={v}>Tab {v}</Tabs.Trigger>
        {/each}
    </Tabs.List>

    <Tabs.Content value="one">Panel one</Tabs.Content>
    <Tabs.Content value="two">Panel two</Tabs.Content>
    <Tabs.Content value="three">Panel three</Tabs.Content>
</Tabs.Root>
