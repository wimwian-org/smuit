<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!-- Test-only harness: binds MaskedField's value + unmasked and mirrors them to
     the DOM so a test can read both back. -->
<script lang="ts">
    import MaskedField from './MaskedField.svelte';
    import type { MaskedFieldProps } from './MaskedFieldTypes';

    let { value = $bindable(''), unmasked = $bindable(''), ...rest }: MaskedFieldProps = $props();
</script>

<MaskedField bind:value bind:unmasked {...rest} />
<output data-testid="value">{value}</output>
<output data-testid="unmasked">{unmasked}</output>
