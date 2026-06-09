<!--
  @smuit/tabs
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!-- Test harness — a full Tabs composition driven by props. -->
<script lang="ts">
    import * as Tabs from './tabs';
    import type { TabsVariant, TabsSize, TabsTint } from './types';

    let {
        variant = undefined,
        size = undefined,
        tint = undefined,
        activationMode = undefined,
        value = 'one',
        disabledTwo = false,
        triggerClass = undefined,
    }: {
        variant?: TabsVariant;
        size?: TabsSize;
        tint?: TabsTint;
        activationMode?: 'automatic' | 'manual';
        value?: string;
        disabledTwo?: boolean;
        triggerClass?: string;
    } = $props();
</script>

<Tabs.Root {variant} {size} {tint} {activationMode} bind:value>
    <Tabs.List>
        <Tabs.Trigger value="one" class={triggerClass}>One</Tabs.Trigger>
        <Tabs.Trigger value="two" disabled={disabledTwo}>Two</Tabs.Trigger>
        <Tabs.Trigger value="three">
            {#snippet icon()}
                <svg data-testid="tab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16" /></svg>
            {/snippet}
            Three
        </Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="one">Panel one</Tabs.Content>
    <Tabs.Content value="two">Panel two</Tabs.Content>
    <Tabs.Content value="three">Panel three</Tabs.Content>
</Tabs.Root>
