<!--
  @wimwian-org/text-field
  Copyright (c) 2026 wimwian
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
    // @wimwian-org/theme is a peerDependency; importing it here lets the bit render
    // with design tokens even when the host app hasn't imported the theme.
    import '@wimwian-org/theme';
    import '../text-field.css';
    import { textField } from '../text-field.variants';
    import { twMerge } from 'tailwind-merge';
    import { setFieldContext, type FieldContext } from './field-context';
    import { MAX_SUGGESTIONS } from '../config';
    import type { Snippet } from 'svelte';
    import type { TextFieldVariant, TextFieldSize, TextFieldTint } from '../types';

    interface RootProps {
        variant?: TextFieldVariant;
        size?: TextFieldSize;
        tint?: TextFieldTint;
        fullWidth?: boolean;
        elevation?: boolean;
        multiline?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        hideLabel?: boolean;
        error?: boolean;
        errorText?: string;
        required?: boolean;
        noAsterisk?: boolean;
        maxlength?: number;
        /** Autosuggest values shown on focus (capped by the build-time MAX_SUGGESTIONS). */
        suggestions?: string[];
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
        multiline = false,
        disabled = false,
        readonly: readonlyProp = false,
        hideLabel = false,
        error: errorProp = false,
        errorText,
        required = false,
        noAsterisk = false,
        maxlength,
        suggestions = [],
        id,
        value = $bindable(''),
        class: className = '',
        children,
    }: RootProps = $props();

    // Init-time guard against static misuse; an initial read is intentional.
    // svelte-ignore state_referenced_locally
    if (suggestions.length > MAX_SUGGESTIONS) {
        throw new Error(
            `@wimwian-org/text-field: ${suggestions.length} suggestions exceeds the build-time cap MAX_SUGGESTIONS ` +
                `(${MAX_SUGGESTIONS}). Autosuggest is for short lists — use a Select or search for long ones.`,
        );
    }

    uid += 1;
    const autoId = `smuit-text-field-${uid}`;
    let focused = $state(false);
    let hasLeading = $state(false);
    let hasSupporting = $state(false);
    let invalid = $state(false);
    let open = $state(false);
    let activeIndex = $state(-1);

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
        get multiline() {
            return multiline;
        },
        get hideLabel() {
            return hideLabel;
        },
        get error() {
            return errorProp || invalid;
        },
        get errorText() {
            return errorText;
        },
        get required() {
            return required;
        },
        get noAsterisk() {
            return noAsterisk;
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
        setInvalid(v) {
            invalid = v;
        },
        get suggestions() {
            return suggestions;
        },
        get hasSuggestions() {
            return suggestions.length > 0;
        },
        get open() {
            return open && suggestions.length > 0;
        },
        get activeIndex() {
            return activeIndex;
        },
        get listId() {
            return `${this.inputId}-listbox`;
        },
        optionId(i) {
            return `${this.inputId}-opt-${i}`;
        },
        openList() {
            if (suggestions.length) open = true;
        },
        closeList() {
            open = false;
            activeIndex = -1;
        },
        move(delta) {
            open = true;
            const n = suggestions.length;
            activeIndex = activeIndex < 0 ? (delta > 0 ? 0 : n - 1) : (activeIndex + delta + n) % n;
        },
        select(i) {
            value = suggestions[i];
            open = false;
            activeIndex = -1;
        },
        selectActive() {
            this.select(activeIndex);
        },
        setActive(i) {
            activeIndex = i;
        },
    };
    setFieldContext(ctx);

    const styles = $derived(textField({ variant, size, tint, fullWidth, elevation, disabled }));
</script>

<div class={twMerge(styles.root(), className)} data-tint={tint} data-error={ctx.error || undefined}>
    {@render children()}
</div>
