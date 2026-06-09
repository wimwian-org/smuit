/*
 * @smuit/progress-indicator
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
import type { ProgressIndicatorVariants } from './progress-indicator.variants';

/** Accent palette — drives the indicator fill and the tonal track. */
export type ProgressIndicatorTint = NonNullable<ProgressIndicatorVariants['tint']>;
/** Linear track height (`sm`/`md`/`lg`) or circular ring diameter. */
export type ProgressIndicatorSize = NonNullable<ProgressIndicatorVariants['size']>;
/** Indicator shape — `linear` bar or `circular` ring. */
export type ProgressIndicatorShape = NonNullable<ProgressIndicatorVariants['shape']>;

/**
 * Props for `ProgressIndicator` — a `role="progressbar"` linear bar or circular
 * ring. Extends the native `<div>` attributes (so `aria-label`, `id`, … flow
 * through to the progressbar element), plus the smuit value/mode and styling
 * props.
 *
 * Value model follows Material Web: `value` is a fraction of `max` (default
 * `max = 1`), so `value={0.6}` is 60%. Omit `value` (or set `indeterminate`)
 * for the animated, unknown-duration mode.
 */
export type ProgressIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** Current progress as a fraction of `max`. Omit for an indeterminate bar. @default undefined */
    value?: number | null;
    /** Upper bound for `value` (Material model). @default 1 */
    max?: number;
    /** Force the indeterminate (animated) mode. Implied when `value` is null/undefined. */
    indeterminate?: boolean;
    /** Indicator shape — `linear` bar or `circular` ring. @default "linear" */
    shape?: ProgressIndicatorShape;
    /**
     * Linear-only secondary channel (e.g. a video's buffered amount): a faint
     * accent fill up to `buffer`, with a dotted track beyond it. A fraction of
     * `max`, like `value`. Ignored for circular / indeterminate. @default undefined
     */
    buffer?: number | null;
    /**
     * Cycle the indeterminate indicator through four accent colours (Material's
     * four-colour mode). Indeterminate only. @default false
     */
    fourColor?: boolean;
    /** Render the `value` as a `42%` readout (linear caption / circular centre).
     *  Ignored when indeterminate. @default false */
    showValue?: boolean;
    /** Caption shown alongside the bar (above, for linear) / below the ring. */
    label?: Snippet;
    /** Accent palette for the indicator + tonal track. @default "primary" */
    tint?: ProgressIndicatorTint;
    /** Linear height — `sm` 4px · `md` 8px · `lg` 12px — or circular diameter
     *  (`sm` 1.5rem · `md` 2.5rem · `lg` 3.5rem). @default "md" */
    size?: ProgressIndicatorSize;
    /** `bind:ref` to the underlying progressbar `<div>`. @default null */
    ref?: HTMLDivElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};
