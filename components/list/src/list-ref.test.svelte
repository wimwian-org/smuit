<!--
  @smuit/list
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Test harness — binds a List.Item `ref` and reports it, so the browser-mode
  test can assert the binding resolves to the underlying row element.
-->
<script lang="ts">
    import { List } from './index';

    let { onRef }: { onRef: (el: HTMLElement | null) => void } = $props();
    let itemRef = $state<HTMLElement | null>(null);

    $effect(() => {
        onRef(itemRef);
    });
</script>

<List.Root>
    <List.Item bind:ref={itemRef} href="/x">Ref item</List.Item>
</List.Root>
