/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import type { Props } from './TextFieldTypes';

/**
 * Props for the password field. Built on {@link Props} (so label, variant, size,
 * tint, leading icon, supporting/error text, etc. all flow through), rendering a
 * masked `type="password"` input with a built-in show/hide reveal toggle in the
 * trailing slot. `autocomplete` defaults to `"current-password"`. The
 * autosuggest, prefix/suffix, and custom trailing-icon affordances of the base
 * field are dropped (not meaningful for a password).
 */
export type PasswordFieldProps = Omit<Props, 'suggestions' | 'prefix' | 'suffix' | 'trailingIcon' | 'type'> & {
    /** Show the built-in reveal (show/hide) toggle in the trailing slot. @default true */
    revealable?: boolean;
};
