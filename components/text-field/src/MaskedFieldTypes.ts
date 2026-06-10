/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import type { Props } from './TextFieldTypes';

/**
 * Props for the masked field. Built on {@link Props} (so label, variant, size,
 * tint, prefix/suffix, icons, supporting/error text, etc. all flow through). A
 * `mask` template formats the value as the user types: `#` accepts a digit, `A`
 * a letter, `*` an alphanumeric, `\` escapes a token character, and every other
 * character is a literal separator inserted automatically. The bound `value` is
 * the formatted string; `unmasked` exposes the raw token characters.
 */
export type MaskedFieldProps = Omit<Props, 'suggestions'> & {
    /** Mask template — e.g. `"(###) ###-####"`. Required. */
    mask: string;
    /** Two-way bound formatted display string. @default "" */
    value?: string;
    /** Two-way bound raw value — token characters only, no literals. @default "" */
    unmasked?: string;
};
