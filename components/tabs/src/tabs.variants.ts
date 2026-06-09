/*
 * @smuit/tabs
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant / slot configuration for tabs.
 *
 * tv() owns the discrete, non-interdependent class sets: the structural flex
 * layout per part, the trigger row height + padding per `size`, the
 * horizontal/vertical flex direction per `orientation`, the inline/stacked
 * trigger axis per `iconLayout`, and the interactive hover / pressed
 * state-layer utilities + cursor (which must be utilities — a
 * `@layer components` rule can't override the resting `transparent` fill on
 * hover; the same is true of flex-direction, which is why orientation lives
 * here and not in tabs.css).
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
        // flex-direction is supplied by the `orientation` variant (not here),
        // so a vertical tab set can flip it — a utility, since a component-layer
        // rule can't override Tailwind's `flex-col` / `flex-row` utilities.
        root: 'tabs flex',
        // Wraps the list + prev/next scroll buttons when `Tabs.List scrollable`.
        listWrap: 'tabs-list-wrap flex',
        list: 'tabs-list relative flex items-stretch',
        trigger:
            'tabs-trigger inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap bg-transparent transition-colors duration-150 hover:bg-[var(--tabs-hover)] active:bg-[var(--tabs-press)]',
        icon: 'tabs-icon inline-flex shrink-0 items-center',
        label: 'tabs-label inline-flex items-center',
        badge: 'tabs-badge inline-flex shrink-0 items-center justify-center',
        indicator: 'tabs-indicator pointer-events-none absolute',
        content: 'tabs-content',
        // Scroll affordances (rendered only when `Tabs.List scrollable`).
        scrollButton:
            'tabs-scroll-btn inline-flex shrink-0 cursor-pointer items-center justify-center bg-transparent transition-colors duration-150 hover:bg-[var(--tabs-hover)]',
    },
    variants: {
        // Carries no class: tabs.css keys the per-variant typography + indicator
        // shape off the data-variant hook (font tokens / pill-vs-hairline).
        variant: {
            bold: {},
            subtle: {},
        },
        // Row height + inline padding per size; the rest is variant-independent.
        // (Stacked tabs override the height via compoundVariants below.)
        size: {
            sm: { trigger: 'h-10 px-3' },
            md: { trigger: 'h-12 px-4' },
        },
        // Horizontal (default): list is a row under the panel → root is a column.
        // Vertical: list is a column beside the panel → root is a row. tabs.css
        // keys the track edge + indicator axis off bits-ui's `data-orientation`.
        orientation: {
            horizontal: { root: 'flex-col', listWrap: 'flex-row items-stretch' },
            vertical: { root: 'flex-row', list: 'flex-col', listWrap: 'flex-col items-stretch' },
        },
        // Inline (default): leading icon sits before the label (a row trigger).
        // Stacked: icon sits above the label (a column trigger, M3 stacked tab).
        iconLayout: {
            inline: {},
            stacked: { trigger: 'flex-col gap-1' },
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
    compoundVariants: [
        // Stacked tabs need a taller row to seat the icon above the label (M3).
        { iconLayout: 'stacked', size: 'sm', class: { trigger: 'h-14' } },
        { iconLayout: 'stacked', size: 'md', class: { trigger: 'h-16' } },
    ],
    defaultVariants: {
        variant: 'bold',
        size: 'md',
        tint: 'neutral',
        orientation: 'horizontal',
        iconLayout: 'inline',
    },
});

export type TabsVariants = VariantProps<typeof tabs>;
