<!--
  @smuit/list
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Test harness — composes List.Root + List.Item rows (static, link, button,
  disabled) so the browser-mode tests can drive a representative compound tree.
-->
<script lang="ts">
    import { List } from './index';
    import type { ListVariant, ListTint } from './types';

    let {
        variant = 'baseline',
        tint = 'neutral',
        divider = false,
        lines = undefined,
        onclick,
    }: {
        variant?: ListVariant;
        tint?: ListTint;
        divider?: boolean;
        lines?: 'one' | 'two' | 'three';
        onclick?: (e: MouseEvent) => void;
    } = $props();
</script>

<List.Root {variant} {tint} {divider}>
    <List.Item {lines} supporting="Supporting one" class="my-row">
        {#snippet leading()}<span data-testid="lead">L</span>{/snippet}
        Headline one
        {#snippet trailing()}<span data-testid="trail">T</span>{/snippet}
    </List.Item>
    <List.Item href="/somewhere">Link item</List.Item>
    <List.Item type="button" {onclick}>Button item</List.Item>
    <List.Item disabled>Disabled item</List.Item>
</List.Root>
