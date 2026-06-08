/*
 * @smuit/text-field
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant / slot configuration for the text field.
 *
 * tv() owns the discrete, non-interdependent class sets: the container surface
 * per `variant`, text sizing per `size`, the focus-accent palette per `tint`
 * (a tint utility on the root retints `--color-c-*` for every slot beneath it),
 * `fullWidth`, and the dimmed `disabled` palette.
 *
 * The interdependent *geometry and motion* that ties the slots together — the
 * container height, the floating-label transition, the outlined notch, the
 * prefix/suffix reveal, and placeholder visibility — lives in text-field.css,
 * keyed off the `data-*` state hooks the component sets (a `@layer components`
 * rule cannot override a utility, so any state that toggles a property already
 * carried by a utility is expressed here, not in CSS).
 */
export const textField = tv({
    slots: {
        root: 'tf flex flex-col gap-1.5 text-left',
        container:
            'tf-container relative flex w-full items-center gap-2 transition-[background-color,border-color,box-shadow,transform] duration-150',
        label: 'tf-label pointer-events-none absolute max-w-full origin-left truncate transition-all duration-150 ease-out',
        input: 'tf-input min-w-0 flex-1 border-0 bg-transparent p-0 text-base text-g-900 outline-none',
        leading: 'tf-leading flex shrink-0 items-center text-g-600',
        trailing: 'tf-trailing flex shrink-0 items-center text-g-600',
        prefix: 'tf-prefix shrink-0 select-none text-base text-g-500',
        suffix: 'tf-suffix shrink-0 select-none text-base text-g-500',
        bottom: 'tf-bottom flex items-start justify-between gap-3 px-1',
        supporting: 'tf-supporting text-xs text-g-600',
        counter: 'tf-counter shrink-0 text-xs text-g-600 tabular-nums',
    },
    variants: {
        variant: {
            filled: {
                // items-end: bottom-align the input so the floated label has
                // clear room above it (MD filled behaviour). The focus active
                // indicator is the ::after bar in CSS (leaves box-shadow free
                // for `elevation`). Geometry in CSS.
                container: 'items-end rounded-t-md border-b border-g-400 bg-g-100 px-3.5 hover:bg-g-150',
            },
            outlined: {
                container:
                    'rounded-md border border-g-300 px-3.5 hover:border-g-500 focus-within:border-[var(--tf-accent)] focus-within:ring-2 focus-within:ring-[var(--tf-accent)]',
            },
        },
        size: {
            sm: { input: 'text-sm', prefix: 'text-sm', suffix: 'text-sm' },
            md: {},
        },
        // Tint carries no class: the field's only tinted surface is the focus
        // accent + floated label, which text-field.css drives through
        // `--tf-accent` per `[data-tint]` using the semantic surface tokens.
        // This keeps tint working under both the runtime and flat themes,
        // which name their tint utilities differently (`.secondary` vs
        // `.tint-secondary`).
        tint: {
            neutral: {},
            primary: {},
            secondary: {},
            tertiary: {},
        },
        fullWidth: {
            true: { root: 'w-full' },
            false: { root: 'inline-flex w-auto' },
        },
        disabled: {
            true: {
                container: 'pointer-events-none border-g-200 bg-g-50',
                input: 'cursor-not-allowed text-g-400',
                leading: 'text-g-300',
                trailing: 'text-g-300',
                prefix: 'text-g-300',
                suffix: 'text-g-300',
                supporting: 'text-g-400',
                counter: 'text-g-400',
            },
            false: {},
        },
        // Elevation: a resting drop shadow that deepens and lifts 2px on focus.
        // Drop shadow lives in --tw-shadow; the outlined focus ring lives in
        // --tw-ring-shadow and the filled indicator is the ::after bar, so they
        // compose rather than clobber the box-shadow.
        elevation: {
            true: { container: 'shadow-sm focus-within:-translate-y-0.5 focus-within:shadow-lg' },
            false: {},
        },
        // Multiline (textarea): top-align the control; the rest of the geometry
        // (padding, label resting position) lives in text-field.css. Declared
        // last so items-start wins the twMerge over items-center/items-end.
        multiline: {
            true: { container: 'items-start' },
            false: {},
        },
        // Error: the resting border + supporting text turn the fixed error
        // colour. The focus accent + label colours flip via --tf-accent under
        // `.tf[data-error]` in text-field.css.
        error: {
            true: {
                container: 'border-[var(--surface-error-accent)] hover:border-[var(--surface-error-accent)]',
                supporting: 'text-[var(--surface-error-fg)]',
            },
            false: {},
        },
    },
    defaultVariants: {
        variant: 'outlined',
        size: 'md',
        tint: 'primary',
        fullWidth: false,
        disabled: false,
        elevation: false,
        multiline: false,
        error: false,
    },
});

export type TextFieldVariants = VariantProps<typeof textField>;
