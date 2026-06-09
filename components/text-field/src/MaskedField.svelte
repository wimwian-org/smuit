<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  <MaskedField> — a pattern-masked field built on <TextField>. A `mask` template
  formats the value as the user types and binds the formatted string (`value`)
  plus, optionally, the raw token characters (`bind:unmasked`). Mask tokens:
  `#` digit · `A` letter · `*` alphanumeric · `\` escapes a token char · every
  other character is a literal separator inserted automatically.

    <MaskedField label="Phone" mask="(###) ###-####" bind:value={phone} bind:unmasked={raw} />
-->
<script lang="ts">
    import { tick, untrack } from 'svelte';
    import TextField from './TextField.svelte';
    import type { MaskedFieldProps } from './types';
    import { applyMask, unmaskedCountBefore, caretAfterMask, isDigitOnlyMask } from './mask';

    let {
        mask,
        value = $bindable(''),
        unmasked = $bindable(''),
        oninput,
        ref = $bindable<HTMLInputElement | null>(null),
        ...rest
    }: MaskedFieldProps = $props();

    /** Last masked string we emitted — lets the effect below tell an external
     *  (programmatic) value change apart from our own. */
    let lastEmitted = value;

    // Normalise the display + unmasked value on mount and whenever the mask
    // changes. Reads `value` untracked so it never fires on a value change.
    $effect(() => {
        const m = mask;
        untrack(() => {
            const r = applyMask(value, m);
            if (r.masked !== value) value = r.masked;
            if (r.unmasked !== unmasked) unmasked = r.unmasked;
            lastEmitted = r.masked;
        });
    });

    // Reflect a programmatic value change through the mask. Skipped while typing,
    // since the input handler keeps `lastEmitted` in step with `value`.
    $effect(() => {
        if (value !== lastEmitted) {
            const r = applyMask(
                value,
                untrack(() => mask),
            );
            lastEmitted = r.masked;
            if (r.masked !== value) value = r.masked;
            /* istanbul ignore next -- defensive: unmasked tracks the mask result, so it rarely differs alone */
            if (r.unmasked !== unmasked) unmasked = r.unmasked;
        }
    });

    const inputMode = $derived(isDigitOnlyMask(mask) ? 'numeric' : undefined);

    function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
        const el = event.currentTarget;
        /* istanbul ignore next -- selectionStart is non-null for a focused text input; the ?? is defensive */
        const caret = el.selectionStart ?? el.value.length;
        const anchor = unmaskedCountBefore(el.value, caret);

        const r = applyMask(el.value, mask);
        const nextCaret = caretAfterMask(r.masked, anchor);

        value = r.masked;
        unmasked = r.unmasked;
        lastEmitted = r.masked; // our own change — don't let the effect re-mask it

        tick().then(() => ref?.setSelectionRange(nextCaret, nextCaret));
        oninput?.(event as Parameters<NonNullable<typeof oninput>>[0]);
    }
</script>

<TextField {...rest} bind:value bind:ref inputmode={inputMode} oninput={handleInput} />
