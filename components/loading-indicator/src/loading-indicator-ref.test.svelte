<!--
  @smuit/loading-indicator
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!-- Test harness: binds `ref` so a test can assert it resolves to the root element. -->
<script lang="ts">
    import LoadingIndicator from './LoadingIndicator.svelte';

    let { onref }: { onref: (el: HTMLDivElement | null) => void } = $props();
    let ref = $state<HTMLDivElement | null>(null);
    $effect(() => {
        onref(ref);
    });
</script>

<LoadingIndicator bind:ref label="Reffed" />
