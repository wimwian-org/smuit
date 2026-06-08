/*
 * @smuit/list
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant / slot configuration for the list.
 *
 * tv() owns the discrete, non-interdependent class sets: the row fill per
 * `variant` (transparent baseline / tonal expressive), the interactive state
 * layer + cursor, and the dimmed `disabled` palette.
 *
 * The interdependent *geometry* that ties the rows together — the row heights
 * per `lines`, the Expressive gap and **position-based corner shape** (first /
 * last / only-child), the baseline divider, and the focus-visible outline —
 * lives in list.css, keyed off the `data-*` hooks the components set (a
 * `@layer components` rule cannot override a utility, so the hover state layer
 * that toggles `background-color`, already carried by the resting fill utility,
 * is expressed here, not in CSS).
 */
export const list = tv({
    slots: {
        root: 'list m-0 flex w-full list-none flex-col p-0',
        row: 'list-row',
        item: 'list-item relative flex w-full items-center gap-3 text-left transition-colors duration-150',
        leading: 'list-leading flex shrink-0 items-center text-g-600',
        text: 'list-text flex min-w-0 flex-1 flex-col justify-center gap-0.5',
        headline: 'list-headline truncate text-base text-g-900',
        supporting: 'list-supporting truncate text-sm text-g-600',
        trailing: 'list-trailing flex shrink-0 items-center gap-2 text-sm text-g-600',
    },
    variants: {
        variant: {
            // Flat, transparent rows; the optional divider lives in list.css.
            baseline: { item: 'bg-transparent' },
            // Tonal-fill rows; the gap + position-based rounding live in list.css.
            expressive: { item: 'bg-g-100' },
        },
        // Row height + supporting line; min-heights are keyed off data-lines in CSS.
        lines: {
            one: {},
            two: {},
        },
        // Interactive rows (button / link): the hover + pressed state layers must
        // be utilities (the resting fill is a utility, and a CSS @layer rule can't
        // override it on hover). The focus-visible outline is in CSS (no utility
        // sets `outline` at rest, so the cascade is clear there).
        interactive: {
            true: { item: 'cursor-pointer hover:bg-g-150 active:bg-g-200' },
            false: {},
        },
        disabled: {
            true: {
                item: 'pointer-events-none text-g-400',
                leading: 'text-g-300',
                headline: 'text-g-400',
                supporting: 'text-g-400',
                trailing: 'text-g-300',
            },
            false: {},
        },
        // Tint carries no class: the only tinted surface is the focus-visible
        // outline, which list.css drives through `--list-accent` per `[data-tint]`
        // using the semantic surface tokens (works under both the runtime and flat
        // themes, which name their tint utilities differently).
        tint: {
            neutral: {},
            primary: {},
            secondary: {},
            tertiary: {},
        },
    },
    defaultVariants: {
        variant: 'baseline',
        lines: 'one',
        interactive: false,
        disabled: false,
        tint: 'primary',
    },
});

export type ListVariants = VariantProps<typeof list>;
