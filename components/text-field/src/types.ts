/*
 * @wimwian-org/text-field
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import type { TextFieldVariants } from './text-field.variants';

// Common variant info shared by every field flavour. The per-component prop
// shapes live in their own `*Types.ts` files (TextFieldTypes, TextAreaTypes,
// NumberFieldTypes, PasswordFieldTypes, MaskedFieldTypes), built on these.

/** Container treatment. */
export type TextFieldVariant = NonNullable<TextFieldVariants['variant']>;
/** Density. */
export type TextFieldSize = NonNullable<TextFieldVariants['size']>;
/** Focus-accent palette (retints `--color-c-*`). */
export type TextFieldTint = NonNullable<TextFieldVariants['tint']>;

// Deferred (next): the remaining non-text input `type`s (email/search/tel/url,
// `pattern`); and select mode.
