/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { TextFieldVariants } from './text-field.variants';

/** Container treatment. */
export type TextFieldVariant = NonNullable<TextFieldVariants['variant']>;
/** Density. */
export type TextFieldSize = NonNullable<TextFieldVariants['size']>;
/** Focus-accent palette (retints `--color-c-*`). */
export type TextFieldTint = NonNullable<TextFieldVariants['tint']>;

/**
 * Props for the text field. Extends the native `<input>` attributes (so
 * `name`, `id`, `placeholder`, `maxlength`, `disabled`, `readonly`,
 * `autocomplete`, `oninput`, `onchange`, … all flow straight through), plus the
 * smuit presentation, decoration, and helper props.
 */
export type Props = Omit<HTMLInputAttributes, 'size' | 'value' | 'prefix' | 'type'> & {
    /** Field label and accessible name. Required. */
    label: string;
    /** Visual treatment. @default "outlined" */
    variant?: TextFieldVariant;
    /** Density. @default "md" */
    size?: TextFieldSize;
    /** Focus-accent palette (retints `--color-c-*`). @default "primary" */
    tint?: TextFieldTint;
    /** Visually hide the label (kept for screen readers). @default false */
    hideLabel?: boolean;
    /** Two-way bound value. @default "" */
    value?: string;
    /** Static guidance shown below the field. */
    supportingText?: string;
    /** Static text before the value (e.g. "$"); revealed once the label floats. */
    prefix?: string;
    /** Static text after the value (e.g. ".00"); revealed once the label floats. */
    suffix?: string;
    /** Leading icon slot (decorative; hidden from assistive tech). */
    leadingIcon?: Snippet;
    /**
     * Trailing icon / action slot. Exposed to assistive tech — if it renders an
     * interactive control (e.g. a clear button), give that control its own
     * `aria-label`.
     */
    trailingIcon?: Snippet;
    /** Stretch to fill the available inline width. @default false */
    fullWidth?: boolean;
    /** Raise the field with a resting shadow that deepens and lifts on focus. @default false */
    elevation?: boolean;
    /** `bind:ref` to the underlying `<input>` element. @default null */
    ref?: HTMLInputElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};

/**
 * Props for the multi-line text area. Extends the native `<textarea>` attributes
 * (so `name`, `id`, `placeholder`, `maxlength`, `disabled`, `readonly`, … flow
 * through), plus the smuit presentation and helper props. No prefix/suffix or
 * icon adornments (not meaningful for multi-line entry).
 */
export type TextAreaProps = Omit<HTMLTextareaAttributes, 'value' | 'cols'> & {
    /** Field label and accessible name. Required. */
    label: string;
    /** Visual treatment. @default "outlined" */
    variant?: TextFieldVariant;
    /** Density. @default "md" */
    size?: TextFieldSize;
    /** Focus-accent palette. @default "primary" */
    tint?: TextFieldTint;
    /** Visually hide the label (kept for screen readers). @default false */
    hideLabel?: boolean;
    /** Two-way bound value. @default "" */
    value?: string;
    /** Static guidance shown below the field. */
    supportingText?: string;
    /** Initial visible lines. @default 3 */
    rows?: number;
    /** Grow with content (via `field-sizing`), `rows` as the floor. @default false */
    autosize?: boolean;
    /** Stretch to fill the available inline width. @default false */
    fullWidth?: boolean;
    /** Resting shadow that deepens and lifts on focus. @default false */
    elevation?: boolean;
    /** `bind:ref` to the underlying `<textarea>` element. @default null */
    ref?: HTMLTextAreaElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};

// Deferred (next): the legacy `standard` variant; non-text input `type`s
// (email/password/number/search/tel/url, `inputmode`, `pattern`); the validation
// & error system (`error` flag, `errorText`, the required asterisk + `noAsterisk`,
// constraint validation, `setCustomValidity`, the `invalid` event) — `maxlength`
// ships only as the counter's soft cap, not as validation; select mode; a
// dedicated number field; and input masking.
