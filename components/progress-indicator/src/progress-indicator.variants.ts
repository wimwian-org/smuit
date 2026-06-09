/*
 * @smuit/progress-indicator
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant / slot configuration for the progress indicator (linear + circular).
 *
 * tv() owns the discrete class sets: the `root` (the `role="progressbar"`
 * element) per `shape`, the `indicator` (the accent bar / ring arc), the
 * optional `field` wrapper + `label`/`value` text, and the linear track height
 * per `size`. The interdependent bits live in progress-indicator.css, keyed off
 * the `data-*` hooks the component sets:
 *   - the accent + tonal track colour per `[data-tint]`,
 *   - the determinate linear `width` / circular `stroke-dashoffset`,
 *   - the indeterminate slide / spin animation (gated on `[data-indeterminate]`),
 *   - the `[data-four-color]` colour cycle, the linear `buffer`, the
 *     `prefers-reduced-motion` fallback, and the circular ring geometry per
 *     `[data-shape='circular'][data-size]`.
 *
 * `tint` carries no class — the accent is a CSS token repointed per
 * `[data-tint]` (the proven `@smuit/list` pattern), so it works regardless of
 * how the theme names its tint utilities.
 */
export const progressIndicator = tv({
    slots: {
        // The role="progressbar" element. Per-shape geometry below.
        root: 'progress relative',
        // The accent bar (linear) or the foreground ring arc (circular).
        indicator: 'progress-bar',
        // Optional wrapper when a label / value readout is shown.
        field: 'progress-field inline-flex flex-col gap-1',
        // Caption row above a linear bar (label left, value right).
        label: 'progress-label flex items-baseline justify-between gap-3 text-label-sm font-medium text-c-700',
        // The numeric "42%" readout (linear caption or circular centre).
        value: 'progress-value tabular-nums',
    },
    variants: {
        shape: {
            linear: {
                root: 'block w-full overflow-hidden rounded-full bg-[var(--progress-track)]',
                indicator: 'absolute inset-y-0 left-0 rounded-full bg-[var(--progress-accent)]',
            },
            circular: {
                // A square box; the SVG ring + optional centred value sit inside.
                root: 'inline-grid place-items-center',
                indicator: '',
            },
        },
        // Linear track height (applied via compoundVariants). Circular maps `size`
        // to a ring diameter + stroke in CSS (`[data-shape='circular'][data-size]`).
        size: { sm: {}, md: {}, lg: {} },
        // Accent palette — carries no class; progress-indicator.css sets
        // `--progress-accent` per `[data-tint]`. Default = primary.
        tint: { neutral: {}, primary: {}, secondary: {}, error: {}, warning: {}, success: {} },
        // Mode flag — carries no class; CSS drives the determinate vs animated
        // form off the `[data-indeterminate]` hook.
        indeterminate: { true: {}, false: {} },
        // Four-colour indeterminate cycle — CSS-driven off `[data-four-color]`.
        fourColor: { true: {}, false: {} },
    },
    compoundVariants: [
        // Linear track heights — Material's 4 / 8 / 12px.
        { shape: 'linear', size: 'sm', class: { root: 'h-1' } },
        { shape: 'linear', size: 'md', class: { root: 'h-2' } },
        { shape: 'linear', size: 'lg', class: { root: 'h-3' } },
    ],
    defaultVariants: {
        shape: 'linear',
        size: 'md',
        tint: 'primary',
        indeterminate: false,
        fourColor: false,
    },
});

export type ProgressIndicatorVariants = VariantProps<typeof progressIndicator>;
