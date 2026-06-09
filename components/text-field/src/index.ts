/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
export { default as TextField } from './TextField.svelte';
export { default as TextArea } from './TextArea.svelte';
export { default as NumberField } from './NumberField.svelte';
export { default as PasswordField } from './PasswordField.svelte';
export { default as MaskedField } from './MaskedField.svelte';
export * as Field from './field';
export { MAX_SUGGESTIONS } from './config';
export { textField, type TextFieldVariants } from './text-field.variants';
export type {
    Props as TextFieldProps,
    TextAreaProps,
    NumberFieldProps,
    PasswordFieldProps,
    MaskedFieldProps,
    TextFieldVariant,
    TextFieldSize,
    TextFieldTint,
} from './types';
export type { FieldContext } from './field/field-context';
