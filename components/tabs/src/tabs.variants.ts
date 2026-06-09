/*
 * @smuit/tabs
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant / slot configuration for tabs.
 *
 * tv() owns the discrete, non-interdependent class sets: the structural flex
 * layout per part, the trigger row height + padding per `size`, and the
 * interactive hover / pressed state-layer utilities + cursor (which must be
 * utilities — a `@layer components` rule can't override the resting `transparent`
 * fill on hover).
 *
 * The interdependent / token-driven styling — the `--tabs-accent` per
 * `[data-tint]`, the inactive→active label colour (keyed off bits-ui's
 * `data-state`), the per-variant typography, the sliding indicator shape +
 * transition + reduced-motion fallback, the bottom track, the focus-visible
 * outline, and the disabled dimming (keyed off bits-ui's `data-disabled`) —
 * lives in tabs.css, keyed off the `data-*` hooks the components set.
 */
export const tabs = tv({
    slots: {
        root: 'tabs flex flex-col',
        list: 'tabs-list relative flex items-stretch',
        trigger:
            'tabs-trigger inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap bg-transparent transition-colors duration-150 hover:bg-[var(--tabs-hover)] active:bg-[var(--tabs-press)]',
        icon: 'tabs-icon inline-flex shrink-0 items-center',
        label: 'tabs-label inline-flex items-center',
        indicator: 'tabs-indicator pointer-events-none absolute',
        content: 'tabs-content',
    },
    variants: {
        // Carries no class: tabs.css keys the per-variant typography + indicator
        // shape off the data-variant hook (font tokens / pill-vs-hairline).
        variant: {
            bold: {},
            subtle: {},
        },
        // Row height + inline padding per size; the rest is variant-independent.
        size: {
            sm: { trigger: 'h-10 px-3' },
            md: { trigger: 'h-12 px-4' },
        },
        // Carries no class: tabs.css drives `--tabs-accent` per `[data-tint]`
        // (from the semantic surface tokens), which feeds the indicator, the
        // active label/icon, the hover/pressed state layers, and the focus outline.
        tint: {
            neutral: {},
            primary: {},
            secondary: {},
            tertiary: {},
            error: {},
            warning: {},
            success: {},
        },
    },
    defaultVariants: {
        variant: 'bold',
        size: 'md',
        tint: 'neutral',
    },
});

export type TabsVariants = VariantProps<typeof tabs>;
