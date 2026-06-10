<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
  Licensed under the MIT License.
-->
<!--
  <NumberField> — a numeric field built on <TextField>. It masks input to digits
  (decimal, or hex/binary when the value leads with 0x / 0b), binds a parsed
  `number | null`, and validates against `min`/`max` plus an optional async
  server callback on blur. Decimal input supports an optional single decimal
  point and optional locale-aware thousands grouping; the field is right-aligned
  by default.

    <NumberField label="Amount" prefix="$" decimalAllowed grouping bind:value={amount} />
-->
<script lang="ts">
    import { tick, untrack } from 'svelte';
    import TextField from './TextField.svelte';
    import type { NumberFieldProps } from './NumberFieldTypes';
    import {
        detectBase,
        localeSeparators,
        sanitize,
        format,
        toNumber,
        fromNumber,
        significantCountBefore,
        caretAfterFormat,
    } from './number-field';

    let {
        value = $bindable(null),
        min,
        max,
        decimalAllowed = false,
        decimalAccuracy = 4,
        grouping = false,
        locale = 'en-US',
        align = 'right',
        validate,
        error = false,
        errorText,
        style,
        oninput,
        onkeydown,
        onblur,
        ref = $bindable<HTMLInputElement | null>(null),
        ...rest
    }: NumberFieldProps = $props();

    const seps = $derived(localeSeparators(locale));
    const opts = $derived({
        decimalAllowed,
        decimalAccuracy,
        grouping,
        groupSeparator: seps.group,
        decimalSeparator: seps.decimal,
    });

    /** Display string shown in the input; seeded once from the initial value. */
    let display = $state(untrack(() => fromNumber(value, opts)));
    /** Message from min/max or the async callback; '' = valid. */
    let validationError = $state('');
    /** Monotonic token so a slow validation can't clobber a newer blur. */
    let validateToken = 0;
    /** Last value we emitted from typing — lets the effects below tell an external
     *  (programmatic) value change apart from our own. */
    let lastEmitted = value;

    // Reflect a programmatic value change into the display (always decimal — a bare
    // number carries no base). Skipped while typing, since the input handler keeps
    // `lastEmitted` in step with `value`.
    $effect(() => {
        if (value !== lastEmitted) {
            lastEmitted = value;
            display = fromNumber(
                value,
                untrack(() => opts),
            );
        }
    });

    // Reformat when locale / grouping / accuracy change — but only decimal input,
    // so a hex/binary entry isn't rewritten to decimal. Reads `value` untracked so
    // it never fires on a value change.
    $effect(() => {
        const o = opts;
        untrack(() => {
            /* istanbul ignore else -- guards a hex/binary display from being re-derived from the numeric value */
            if (detectBase(display) === 'decimal') display = fromNumber(value, o);
        });
    });

    const inputMode = $derived(
        detectBase(display) === 'hex'
            ? 'text'
            : decimalAllowed && detectBase(display) === 'decimal'
              ? 'decimal'
              : 'numeric',
    );
    const alignStyle = $derived(`text-align:${align};${style ?? ''}`);
    const effectiveError = $derived(error || validationError !== '');
    const effectiveErrorText = $derived(validationError !== '' ? validationError : errorText);

    // Control keys + clipboard/selection chords always pass. Printable keys are
    // limited to the alphabet of the current base: digits + a decimal point
    // (decimal), 0–9 a–f (hex), 0/1 (binary); `x`/`b` are allowed only right after
    // a lone leading `0`, to begin a hex/binary value. The oninput sanitizer is the
    // real guarantee — this just spares the caret a needless round-trip on paste.
    function handleKeydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
        const k = event.key;
        const printable = k.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
        if (printable) {
            const v = event.currentTarget.value;
            const base = detectBase(v);
            let ok: boolean;
            if (base === 'hex') ok = /[0-9a-f]/i.test(k);
            else if (base === 'binary') ok = k === '0' || k === '1';
            else if (k >= '0' && k <= '9') ok = true;
            else if (k === seps.decimal && decimalAllowed && !v.includes(seps.decimal)) ok = true;
            else ok = (k === 'x' || k === 'X' || k === 'b' || k === 'B') && v === '0'; // begin 0x / 0b
            if (!ok) event.preventDefault();
        }
        onkeydown?.(event as Parameters<NonNullable<typeof onkeydown>>[0]);
    }

    function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
        const el = event.currentTarget;
        /* istanbul ignore next -- selectionStart is non-null for a focused text input; the ?? is defensive */
        const caret = el.selectionStart ?? el.value.length;
        const base = detectBase(el.value);
        const anchor = significantCountBefore(el.value, caret, base, seps.decimal);

        const clean = sanitize(el.value, opts);
        const formatted = format(clean, opts);
        const nextCaret = caretAfterFormat(formatted, anchor, base, seps.decimal);

        display = formatted;
        value = toNumber(clean);
        lastEmitted = value; // our own change — don't let the effect reformat it
        validationError = ''; // editing clears a reported error

        tick().then(() => ref?.setSelectionRange(nextCaret, nextCaret));
        oninput?.(event as Parameters<NonNullable<typeof oninput>>[0]);
    }

    async function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
        // Normalise decimal display (drop leading zeros / trailing point); leave a
        // hex/binary entry as the user typed it.
        if (detectBase(display) === 'decimal') display = fromNumber(value, opts);

        let message = '';
        if (value != null) {
            if (min != null && value < min) message = `Must be at least ${min}.`;
            else if (max != null && value > max) message = `Must be at most ${max}.`;
        }
        if (message === '' && validate) {
            const token = ++validateToken;
            const result = await validate(value);
            /* istanbul ignore next -- only hit when a newer blur supersedes this validate mid-flight (race) */
            if (token !== validateToken) return; // superseded by a newer blur
            message = result ?? '';
        }
        validationError = message;

        onblur?.(event as Parameters<NonNullable<typeof onblur>>[0]);
    }
</script>

<TextField
    {...rest}
    bind:value={display}
    bind:ref
    inputmode={inputMode}
    style={alignStyle}
    error={effectiveError}
    errorText={effectiveErrorText}
    oninput={handleInput}
    onkeydown={handleKeydown}
    onblur={handleBlur}
/>
