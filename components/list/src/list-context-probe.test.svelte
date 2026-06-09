<!--
  @wimwian-org/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Test probe — a descendant that reads the published ListContext at init and
  reports `divider`, letting the browser-mode test exercise the context getter.
-->
<script lang="ts">
    import { getListContext } from './list';

    let { onDivider }: { onDivider: (divider: boolean) => void } = $props();

    onDivider(getListContext().divider);
</script>
