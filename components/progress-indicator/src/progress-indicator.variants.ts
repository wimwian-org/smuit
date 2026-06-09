/*
 * @smuit/progress-indicator
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant / slot configuration for the linear progress indicator.
 *
 * tv() owns the discrete class sets: the `root` track (full-width, clipped,
 * pill-rounded) with its per-`size` height, and the `indicator` fill (the
 * accent bar). The interdependent bits live in progress-indicator.css, keyed
 * off the `data-*` hooks the component sets:
 *   - the accent + tonal track colour per `[data-tint]`,
 *   - the determinate `width` (from the inline `--progress-value`),
 *   - the indeterminate slide animation (gated on `[data-indeterminate]`),
 *   - the reduced-motion fallback.
 *
 * `tint` carries no class — the accent is a CSS token repointed per
 * `[data-tint]` (the proven `@smuit/list` pattern), so it works regardless of
 * how the theme names its tint utilities.
 */
export const progressIndicator = tv({
    slots: {
        root: 'progress relative w-full overflow-hidden rounded-full bg-[var(--progress-track)]',
        indicator: 'progress-bar absolute inset-y-0 left-0 rounded-full bg-[var(--progress-accent)]',
    },
    variants: {
        // Track height. The indeterminate segment + determinate width are CSS-driven.
        size: {
            sm: { root: 'h-1' }, // 4px — Material's default
            md: { root: 'h-2' }, // 8px
            lg: { root: 'h-3' }, // 12px
        },
        // Accent palette — carries no class; progress-indicator.css sets
        // `--progress-accent` per `[data-tint]` (and the tonal `--progress-track`
        // derives from it). Default = primary (progress is an accent element).
        tint: {
            neutral: {},
            primary: {},
            secondary: {},
            error: {},
            warning: {},
            success: {},
        },
        // Mode flag — carries no class; the determinate width vs the animated
        // segment is driven in CSS off the `[data-indeterminate]` hook.
        indeterminate: {
            true: {},
            false: {},
        },
    },
    defaultVariants: {
        size: 'md',
        tint: 'primary',
        indeterminate: false,
    },
});

export type ProgressIndicatorVariants = VariantProps<typeof progressIndicator>;
