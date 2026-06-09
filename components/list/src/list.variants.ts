/*
 * @wimwian-org/list
 * Copyright (c) 2026 wimwian
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
 * last / only-child, and subheader-delimited groups), the baseline divider, the
 * focus-visible outline, the selection controls, the subheader, and the press
 * shape-morph — lives in list.css, keyed off the `data-*` hooks the components
 * set (a `@layer components` rule cannot override a utility, so the hover state
 * layer that toggles `background-color`, already carried by the resting fill
 * utility, is expressed here, not in CSS).
 */
export const list = tv({
    slots: {
        root: 'list m-0 flex w-full list-none flex-col p-0',
        row: 'list-row',
        item: 'list-item relative flex w-full items-center gap-3 bg-[var(--list-rest)] text-left transition-[background-color,border-radius,transform] duration-150 ease-out motion-reduce:transition-none',
        leading: 'list-leading flex shrink-0 items-center text-g-600',
        text: 'list-text flex min-w-0 flex-1 flex-col justify-center gap-0.5',
        headline: 'list-headline truncate text-base text-g-900',
        supporting: 'list-supporting text-sm text-g-600',
        trailing: 'list-trailing flex shrink-0 items-center gap-2 text-sm text-g-600',
        // Selection control (checkbox / radio / switch) — drawn entirely in
        // list.css off the data-control + data-checked hooks; no class state here.
        control: 'list-control shrink-0',
        // Section label between row groups; geometry + sticky in list.css.
        subheader: 'list-subheader',
    },
    variants: {
        variant: {
            // Both variants take their resting fill from `--list-rest` (set per
            // variant×tint in list.css): baseline rests transparent, expressive
            // carries a soft tinted fill. Gap + position-based rounding also live
            // in list.css, keyed off the data-variant hook.
            baseline: {},
            expressive: {},
        },
        // Row height + supporting clamp; min-heights are keyed off data-lines in CSS.
        lines: {
            one: {},
            two: {},
            three: {},
        },
        // Interactive rows (button / link / selectable option): the hover +
        // pressed state layers must be utilities (the resting fill is a utility,
        // and a CSS @layer rule can't override it on hover). They read the tinted
        // `--list-hover` / `--list-press` (set per variant×tint in list.css). The
        // focus-visible outline is in CSS (no utility sets `outline` at rest, so
        // the cascade is clear there).
        interactive: {
            true: { item: 'cursor-pointer hover:bg-[var(--list-hover)] active:bg-[var(--list-press)]' },
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
        // Tint carries no class: list.css drives `--list-accent` per `[data-tint]`
        // (from the semantic surface tokens), which feeds the resting fill, the
        // hover/pressed state layers, and the focus outline. Works under both the
        // runtime and flat themes, which name their tint utilities differently.
        tint: {
            neutral: {},
            primary: {},
            secondary: {},
            tertiary: {},
        },
    },
    compoundVariants: [
        // One- and two-line headlines truncate to a single line; three-line rows
        // top-align and let the supporting block wrap (clamped in CSS).
        { lines: ['one', 'two'], class: { supporting: 'truncate' } },
        { lines: 'three', class: { text: 'justify-start', item: 'items-start' } },
    ],
    defaultVariants: {
        variant: 'baseline',
        lines: 'one',
        interactive: false,
        disabled: false,
        tint: 'neutral',
    },
});

export type ListVariants = VariantProps<typeof list>;
