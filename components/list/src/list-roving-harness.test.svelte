<!--
  @wimwian-org/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Test harness — a plain button List with opt-in `roving` (no selection model),
  so the browser-mode tests can drive arrow-key navigation across interactive
  rows that aren't selectable options, plus an `empty` variant (roving on, no
  interactive rows to register) for the no-targets path.
-->
<script lang="ts">
    import { List } from './index';

    let {
        empty = false,
        showFirst = true,
        onkeydown,
    }: {
        empty?: boolean;
        // When false the first row is withheld, then later shown, so it registers
        // with the roving manager out of DOM order (forcing orderedRoving to sort).
        showFirst?: boolean;
        onkeydown?: (e: KeyboardEvent) => void;
    } = $props();
</script>

<List.Root roving {onkeydown} aria-label="Roving list">
    {#if empty}
        <!-- No interactive rows: roving is on but registers nothing. -->
        <List.Item>Static one</List.Item>
        <List.Item>Static two</List.Item>
    {:else}
        {#if showFirst}
            <List.Item type="button">Button one</List.Item>
        {/if}
        <List.Item type="button">Button two</List.Item>
        <List.Item type="button">Button three</List.Item>
    {/if}
</List.Root>
