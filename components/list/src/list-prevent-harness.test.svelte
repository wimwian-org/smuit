<!--
  @wimwian-org/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Test harness — a selectable item whose own `onkeydown` calls preventDefault,
  so the browser-mode test can assert the row's keydown handler bails out (no
  toggle) once a consumer has already handled the event.
-->
<script lang="ts">
    import { List } from './index';

    let { onValueChange }: { onValueChange?: (value: string | string[]) => void } = $props();
</script>

<List.Root selection="multiple" value={[]} {onValueChange} aria-label="Prevent list">
    <List.Item value="ada" onkeydown={(e) => e.preventDefault()}>Ada Lovelace</List.Item>
</List.Root>
