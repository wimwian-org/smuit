<!--
  @wimwian-org/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Test harness — a `divider` List wrapping a context probe, so the browser-mode
  test can assert the published ListContext surfaces `divider` to descendants.
-->
<script lang="ts">
    import { List } from './index';
    import Probe from './list-context-probe.test.svelte';

    let { onDivider }: { onDivider: (divider: boolean) => void } = $props();
</script>

<List.Root divider>
    <List.Item>Row</List.Item>
    <Probe {onDivider} />
</List.Root>
