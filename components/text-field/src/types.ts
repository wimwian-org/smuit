/*
 * @smuit/text-field
 * Copyright (c) 2026 wimwian
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
    /** Manually paint the error state (also set by a reported constraint failure). @default false */
    error?: boolean;
    /** Message shown while in error; replaces the supporting text (empty keeps it). */
    errorText?: string;
    /** Suppress the required asterisk while keeping `required` semantics. @default false */
    noAsterisk?: boolean;
    /** Autosuggest values shown in a listbox on focus (the consumer pre-filters).
     *  Capped by the build-time `MAX_SUGGESTIONS` constant — exceeding it throws. */
    suggestions?: string[];
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
    /** Manually paint the error state (also set by a reported constraint failure). @default false */
    error?: boolean;
    /** Message shown while in error; replaces the supporting text (empty keeps it). */
    errorText?: string;
    /** Suppress the required asterisk while keeping `required` semantics. @default false */
    noAsterisk?: boolean;
    /** `bind:ref` to the underlying `<textarea>` element. @default null */
    ref?: HTMLTextAreaElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};

/**
 * Props for the number field. Built on {@link Props} (so label, variant, size,
 * tint, prefix/suffix, icons, supporting/error text, etc. all flow through), but
 * the value is the parsed numeric model rather than a string, and `min`/`max`
 * are numbers used for validation. Input is masked to a numeric alphabet: decimal
 * by default (digits, an optional single decimal point, optional thousands
 * grouping), switching to hexadecimal when the entry leads with `0x` (digits +
 * a–f) or binary with `0b` (0 and 1). The field is unsigned.
 */
export type NumberFieldProps = Omit<Props, 'value' | 'min' | 'max' | 'suggestions' | 'align'> & {
    /** Two-way bound parsed numeric value; `null` when the field is empty.
     *  `0x…`/`0b…` entries bind their parsed integer (e.g. `0xff` → 255). @default null */
    value?: number | null;
    /** Minimum allowed value, validated on blur. */
    min?: number;
    /** Maximum allowed value, validated on blur. */
    max?: number;
    /** Allow a single decimal point and fractional digits (decimal base). @default false */
    decimalAllowed?: boolean;
    /** Maximum fractional digits kept (only when `decimalAllowed`). @default 4 */
    decimalAccuracy?: number;
    /** Insert thousands group separators while typing (decimal base). @default false */
    grouping?: boolean;
    /** BCP-47 locale supplying the group + decimal separator characters
     *  (e.g. `de-DE` → `.` groups, `,` decimal). @default "en-US" */
    locale?: string;
    /** Text alignment of the value within the field. @default "right" */
    align?: 'left' | 'right';
    /**
     * Async (or sync) server-side validation, run on blur after `min`/`max` pass.
     * Return an error message to mark the field invalid, or `null`/`undefined`
     * when valid. Stale results from a superseded blur are ignored.
     */
    validate?: (value: number | null) => string | null | undefined | Promise<string | null | undefined>;
};

// Deferred (next): non-text input `type`s (email/password/search/tel/url,
// `pattern`); select mode; and input masking.
