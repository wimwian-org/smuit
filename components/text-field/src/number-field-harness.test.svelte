<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!-- Test-only harness: binds NumberField's numeric value and mirrors it to the
     DOM so a test can read the parsed model value back. -->
<script lang="ts">
    import NumberField from './NumberField.svelte';
    import type { NumberFieldProps } from './types';

    let { value = $bindable<number | null>(null), ...rest }: NumberFieldProps = $props();
</script>

<NumberField bind:value {...rest} />
<output data-testid="value">{value === null ? 'null' : value}</output>
