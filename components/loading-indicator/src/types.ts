/*
 * @smuit/loading-indicator
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import type { HTMLAttributes } from 'svelte/elements';
import type { LoadingIndicatorVariants } from './loading-indicator.variants';

/** Visual treatment — bare shape (`uncontained`) or shape on a filled surface (`contained`). */
export type LoadingIndicatorVariant = NonNullable<LoadingIndicatorVariants['variant']>;
/** Footprint — `md` is the M3 default (48dp container / 38dp indicator). */
export type LoadingIndicatorSize = NonNullable<LoadingIndicatorVariants['size']>;
/** Accent palette — drives the indicator colour and the contained fill. */
export type LoadingIndicatorTint = NonNullable<LoadingIndicatorVariants['tint']>;

/**
 * Props for `LoadingIndicator` — the indeterminate, shape-morphing loader. Extends the native
 * `<div>` attributes (so `id`, `aria-*`, `data-*`, … flow through to the root), plus the smuit
 * variant / size / tint axes and the accessible `label`.
 */
export type LoadingIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** Bare shape (`uncontained`) or shape on a filled container (`contained`). @default "uncontained" */
    variant?: LoadingIndicatorVariant;
    /** Footprint. `md` = the M3 default (48dp / 38dp). @default "md" */
    size?: LoadingIndicatorSize;
    /** Accent palette — indicator colour + contained fill. @default "primary" */
    tint?: LoadingIndicatorTint;
    /** Accessible label announced to assistive tech (the root is a `progressbar`). @default "Loading" */
    label?: string;
    /** `bind:ref` to the underlying root `<div>` element. @default null */
    ref?: HTMLDivElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};

// Deferred (next): determinate `progress` (0–1) mode; the exact AndroidX spring-physics
// seven-shape morph; a custom `shapes` sequence prop; completion (morph-to-check) hand-off;
// configurable container shape.
