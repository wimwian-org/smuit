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
            'tf-container relative flex w-full items-center gap-2 transition-[background-color,border-color,box-shadow] duration-150',
        field: 'tf-field relative flex min-w-0 flex-1 items-center gap-1',
        label: 'tf-label pointer-events-none absolute max-w-full origin-left truncate transition-all duration-150 ease-out',
        input: 'tf-input w-full min-w-0 border-0 bg-transparent p-0 text-base text-g-900 outline-none',
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
                // clear room above it (MD filled behaviour). Geometry in CSS.
                container:
                    'items-end rounded-t-md border-b border-g-400 bg-g-100 px-3.5 hover:bg-g-150 focus-within:border-[var(--tf-accent)] focus-within:shadow-[inset_0_-2px_0_0_var(--tf-accent)]',
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
    },
    defaultVariants: {
        variant: 'outlined',
        size: 'md',
        tint: 'primary',
        fullWidth: false,
        disabled: false,
    },
});

export type TextFieldVariants = VariantProps<typeof textField>;
