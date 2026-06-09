<!--
  @wimwian-org/progress-indicator
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  Test harness — binds the ProgressIndicator `ref` and reports it, so the
  browser-mode test can assert the binding resolves to the underlying <div>.
-->
<script lang="ts">
    import { ProgressIndicator } from './index';

    let { onRef }: { onRef: (el: HTMLDivElement | null) => void } = $props();
    let elRef = $state<HTMLDivElement | null>(null);

    $effect(() => {
        onRef(elRef);
    });
</script>

<ProgressIndicator bind:ref={elRef} value={0.5} />
