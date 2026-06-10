/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import type { HTMLTextareaAttributes } from 'svelte/elements';
import type { TextFieldVariant, TextFieldSize, TextFieldTint } from './types';

/**
 * Props for the multi-line text area. Extends the native `<textarea>` attributes
 * (so `name`, `id`, `placeholder`, `maxlength`, `disabled`, `readonly`, … flow
 * through), plus the smuit presentation and helper props. No prefix/suffix or
 * icon adornments (not meaningful for multi-line entry).
 */
export type TextAreaProps = Omit<
    HTMLTextareaAttributes,
    'value' | 'cols' | 'disabled' | 'readonly' | 'required' | 'maxlength' | 'id'
> & {
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
    /** `bind:ref` to the underlying `<textarea>` element. @default null */
    ref?: HTMLTextAreaElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};
