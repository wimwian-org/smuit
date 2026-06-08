<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!-- Test-only harness: composes the field via the Field.* parts directly. -->
<script lang="ts">
    import * as Field from './field';
    let { value = $bindable('') }: { value?: string } = $props();
</script>

<Field.Root bind:value maxlength={10}>
    <Field.Box>
        <Field.Label>Email</Field.Label>
        <Field.Adornment side="leading">@</Field.Adornment>
        <Field.Input placeholder="you@example.com" />
    </Field.Box>
    <Field.Caption>
        <Field.Supporting>We never share it.</Field.Supporting>
        <Field.Counter />
    </Field.Caption>
</Field.Root>
