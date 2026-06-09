<!--
  @smuit/tabs
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!-- Ref harness — surfaces a bound trigger element to the test. -->
<script lang="ts">
    import * as Tabs from './tabs';

    let { onRef }: { onRef: (el: HTMLElement) => void } = $props();
    let triggerRef = $state<HTMLButtonElement | null>(null);

    $effect(() => {
        if (triggerRef) onRef(triggerRef);
    });
</script>

<Tabs.Root value="one">
    <Tabs.List>
        <Tabs.Trigger value="one" bind:ref={triggerRef}>One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="one">Panel one</Tabs.Content>
    <Tabs.Content value="two">Panel two</Tabs.Content>
</Tabs.Root>
