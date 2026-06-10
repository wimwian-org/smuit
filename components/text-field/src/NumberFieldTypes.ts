/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import type { Props } from './TextFieldTypes';

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
