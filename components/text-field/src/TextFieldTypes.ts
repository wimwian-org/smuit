/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import type { HTMLInputAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { TextFieldVariant, TextFieldSize, TextFieldTint } from './types';

/**
 * Props for the text field. Extends the native `<input>` attributes (so
 * `name`, `id`, `placeholder`, `maxlength`, `disabled`, `readonly`,
 * `autocomplete`, `oninput`, `onchange`, … all flow straight through), plus the
 * smuit presentation, decoration, and helper props. Also the shared base the
 * number / password / masked field props build on.
 */
export type Props = Omit<
    HTMLInputAttributes,
    'size' | 'value' | 'prefix' | 'type' | 'disabled' | 'readonly' | 'required' | 'maxlength' | 'id'
> & {
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
    /* Curated native attributes — re-declared non-null (the `svelte/elements`
       versions allow `null`, which the field never means). */
    /** Disable the field. @default false */
    disabled?: boolean;
    /** Render the field read-only. @default false */
    readonly?: boolean;
    /** Mark the field required (native constraint + asterisk). @default false */
    required?: boolean;
    /** Maximum character count — native cap plus the character counter. */
    maxlength?: number;
    /** Field id; auto-generated when omitted (wires the label to the control). */
    id?: string;
    /** Autosuggest values shown in a listbox on focus (the consumer pre-filters).
     *  Capped by the build-time `MAX_SUGGESTIONS` constant — exceeding it throws. */
    suggestions?: string[];
    /** `bind:ref` to the underlying `<input>` element. @default null */
    ref?: HTMLInputElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};
