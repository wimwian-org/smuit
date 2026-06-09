<!--
  @wimwian-org/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Test harness — a disabled link row (and a disabled button), so the
  browser-mode tests can assert a disabled `<a>` drops its `href`, falls out of
  the tab order, and a focused disabled row stays inert.
-->
<script lang="ts">
    import { List } from './index';
</script>

<List.Root>
    <List.Item href="/somewhere" disabled>Disabled link</List.Item>
    <List.Item type="button" disabled>Disabled button</List.Item>
</List.Root>
