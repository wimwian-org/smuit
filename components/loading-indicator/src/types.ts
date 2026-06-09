/*
 * @wimwian-org/loading-indicator
 * Copyright (c) 2026 wimwian
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
/** Container outline (contained only) — rounded squircle-ish default, or a `squircle` / `cookie` mask. */
export type LoadingIndicatorContainerShape = NonNullable<LoadingIndicatorVariants['containerShape']>;

/**
 * Props for `LoadingIndicator` — the shape-morphing loader. Extends the native `<div>` attributes
 * (so `id`, `aria-*`, `data-*`, … flow through to the root), plus the smuit variant / size / tint
 * axes, the accessible `label`, and the determinate / custom-shape / completion controls.
 *
 * Three modes, in precedence order:
 * 1. **complete** — `complete` is `true` (or `progress >= 1`): morphs to a checkmark success state.
 * 2. **determinate** — `progress` is a number in `[0, 1]`: a sweep arc tracks the value.
 * 3. **indeterminate** (default) — `progress` is `null`: the curated (or custom) shapes morph + spin.
 */
export type LoadingIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** Bare shape (`uncontained`) or shape on a filled container (`contained`). @default "uncontained" */
    variant?: LoadingIndicatorVariant;
    /** Footprint. `md` = the M3 default (48dp / 38dp). @default "md" */
    size?: LoadingIndicatorSize;
    /** Accent palette — indicator colour + contained fill. @default "primary" */
    tint?: LoadingIndicatorTint;
    /** Container outline for the `contained` variant. @default "rounded" */
    containerShape?: LoadingIndicatorContainerShape;
    /**
     * Determinate progress in `[0, 1]` (clamped). When `null` the indicator is **indeterminate**
     * (continuous morph + spin, no `aria-valuenow`); when set, a sweep arc tracks the value and the
     * root exposes `aria-valuenow`. Reaching `1` triggers the completion hand-off. @default null
     */
    progress?: number | null;
    /**
     * Custom morph sequence — an array of SVG `d` strings sharing the curated `M + 4·C + Z`
     * structure (see `LOADING_INDICATOR_SHAPES`). Falls back to the curated set when omitted; a
     * single entry renders a static shape (no morph). Only used in indeterminate mode.
     */
    shapes?: string[];
    /**
     * Completion hand-off — when `true` (or `progress >= 1`) the indicator settles into a drawn
     * checkmark success state and clears `aria-busy`. @default false
     */
    complete?: boolean;
    /** Accessible label announced to assistive tech (the root is a `progressbar`). @default "Loading" */
    label?: string;
    /** `bind:ref` to the underlying root `<div>` element. @default null */
    ref?: HTMLDivElement | null;
    /** Extra classes merged onto the root (via tailwind-merge). */
    class?: string;
};

// Deferred (next): the exact AndroidX spring-physics seven-shape morph
// (stiffness/damping tokens, M3 easing) — v1.1 keeps the curated SVG `d` morph.
