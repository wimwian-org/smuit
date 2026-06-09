<!--
  @wimwian-org/list
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Test harness — a selectable List with subheader-delimited groups and a disabled
  row, so the browser-mode tests can drive selection, the trailing controls,
  roving keyboard navigation, and the subheader part.
-->
<script lang="ts">
    import { List } from './index';
    import type { ListSelection, ListControl } from './types';

    let {
        selection = 'single',
        control,
        roving = false,
        variant = 'baseline',
        value = $bindable(),
        onValueChange,
    }: {
        selection?: ListSelection;
        control?: ListControl;
        roving?: boolean;
        variant?: 'baseline' | 'expressive';
        value?: string | string[];
        onValueChange?: (value: string | string[]) => void;
    } = $props();
</script>

<List.Root {selection} {control} {roving} {variant} bind:value {onValueChange} aria-label="Pick people">
    <List.Subheader>Pioneers</List.Subheader>
    <List.Item value="ada">Ada Lovelace</List.Item>
    <List.Item value="grace" supporting="Computer scientist">Grace Hopper</List.Item>
    <List.Subheader sticky>More</List.Subheader>
    <List.Item value="alan">Alan Turing</List.Item>
    <List.Item value="edsger" disabled>Edsger Dijkstra</List.Item>
</List.Root>
