/*
 * @smuit/progress-indicator
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import type { HTMLAttributes } from 'svelte/elements';
import type { ProgressIndicatorVariants } from './progress-indicator.variants';

/** Accent palette — drives the indicator fill and the tonal track. */
export type ProgressIndicatorTint = NonNullable<ProgressIndicatorVariants['tint']>;
/** Track height — `sm` 4px · `md` 8px · `lg` 12px. */
export type ProgressIndicatorSize = NonNullable<ProgressIndicatorVariants['size']>;

/**
 * Props for `ProgressIndicator` — the `<div role="progressbar">` linear bar.
 * Extends the native `<div>` attributes (so `aria-label`, `id`, … flow through
 * to the root), plus the smuit value/mode and styling props.
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
    /** Accent palette for the indicator + tonal track. @default "primary" */
    tint?: ProgressIndicatorTint;
    /** Track height — `sm` 4px · `md` 8px · `lg` 12px. @default "md" */
    size?: ProgressIndicatorSize;
    /** `bind:ref` to the underlying `<div>`. @default null */
    ref?: HTMLDivElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};

// Deferred (next): circular shape (`shape="circular"` + ring size / stroke-width
// tokens); four-color indeterminate mode; linear `buffer` value + buffer-dots
// track; a built-in label / inline value-text slot.
