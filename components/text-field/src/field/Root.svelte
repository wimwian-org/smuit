<!--
  @smuit/text-field
  Copyright (c) 2026 Anand Panchapakesan
  Licensed under the MIT License.
-->
<!--
  Field.Root — the form-control shell. Owns identity + state and publishes a
  FieldContext for the parts (Label, Adornment, Input, Supporting, Counter, …),
  and renders the outer `.tf` element. Compose the parts as children.
-->
<script module lang="ts">
    // Per-instance fallback id, so the label↔control wiring works without the
    // consumer having to supply an `id`.
    let uid = 0;
</script>

<script lang="ts">
    // @smuit/theme is a peerDependency; importing it here lets the bit render
    // with design tokens even when the host app hasn't imported the theme.
    import '@smuit/theme';
    import '../text-field.css';
    import { textField } from '../text-field.variants';
    import { twMerge } from 'tailwind-merge';
    import { setFieldContext, type FieldContext } from './field-context';
    import type { Snippet } from 'svelte';
    import type { TextFieldVariant, TextFieldSize, TextFieldTint } from '../types';

    interface RootProps {
        variant?: TextFieldVariant;
        size?: TextFieldSize;
        tint?: TextFieldTint;
        fullWidth?: boolean;
        elevation?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        hideLabel?: boolean;
        maxlength?: number;
        id?: string;
        value?: string;
        class?: string;
        children: Snippet;
    }

    let {
        variant = 'outlined',
        size = 'md',
        tint = 'primary',
        fullWidth = false,
        elevation = false,
        disabled = false,
        readonly: readonlyProp = false,
        hideLabel = false,
        maxlength,
        id,
        value = $bindable(''),
        class: className = '',
        children,
    }: RootProps = $props();

    uid += 1;
    const autoId = `smuit-text-field-${uid}`;
    let focused = $state(false);
    let hasLeading = $state(false);
    let hasSupporting = $state(false);

    const ctx: FieldContext = {
        get inputId() {
            return id ?? autoId;
        },
        get supportId() {
            return `${this.inputId}-support`;
        },
        get variant() {
            return variant;
        },
        get size() {
            return size;
        },
        get tint() {
            return tint;
        },
        get disabled() {
            return disabled;
        },
        get readonly() {
            return readonlyProp;
        },
        get elevation() {
            return elevation;
        },
        get hideLabel() {
            return hideLabel;
        },
        get maxlength() {
            return maxlength;
        },
        get hasLeading() {
            return hasLeading;
        },
        get value() {
            return value;
        },
        set value(v) {
            value = v;
        },
        get floated() {
            return hideLabel || focused || value.length > 0;
        },
        get hasCounter() {
            return maxlength != null;
        },
        get describedBy() {
            return hasSupporting ? this.supportId : undefined;
        },
        setFocused(v) {
            focused = v;
        },
        setLeading(v) {
            hasLeading = v;
        },
        setSupporting(v) {
            hasSupporting = v;
        },
    };
    setFieldContext(ctx);

    const styles = $derived(textField({ variant, size, tint, fullWidth, elevation, disabled }));
</script>

<div class={twMerge(styles.root(), className)} data-tint={tint}>
    {@render children()}
</div>
