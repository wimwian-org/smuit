/*
 * @wimwian-org/loading-indicator
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */

/**
 * The curated Material-shape morph set. Each path shares an identical
 * `M + 4·C + Z` structure on a 24×24 viewBox, so the browser interpolates `d`
 * smoothly between any two of them. An honest approximation of the AndroidX
 * spring-physics morph (the exact seven-shape spring sequence stays deferred).
 *
 * Exported so consumers can supply a subset (or extend it) through the
 * `shapes` prop — every custom shape must keep the same command structure to
 * morph cleanly.
 */
export const LOADING_INDICATOR_SHAPES = {
    circle: 'M 12 2 C 17.52 2 22 6.48 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 C 2 6.48 6.48 2 12 2 Z',
    cushion: 'M 12 2 C 21.2 2 22 2.8 22 12 C 22 21.2 21.2 22 12 22 C 2.8 22 2 21.2 2 12 C 2 2.8 2.8 2 12 2 Z',
    diamond: 'M 12 2 C 14 2 22 10 22 12 C 22 14 14 22 12 22 C 10 22 2 14 2 12 C 2 10 10 2 12 2 Z',
    pill: 'M 12 5 C 18.08 5 23 8.13 23 12 C 23 15.87 18.08 19 12 19 C 5.92 19 1 15.87 1 12 C 1 8.13 5.92 5 12 5 Z',
} as const;

/** The default morph sequence — circle → cushion → diamond → pill (loops back to circle). */
export const DEFAULT_SHAPE_SEQUENCE: readonly string[] = [
    LOADING_INDICATOR_SHAPES.circle,
    LOADING_INDICATOR_SHAPES.cushion,
    LOADING_INDICATOR_SHAPES.diamond,
    LOADING_INDICATOR_SHAPES.pill,
];

/** Checkmark stroke path (24×24) for the completion hand-off — drawn, not filled. */
export const CHECK_PATH = 'M 6 12.5 L 10.5 17 L 18 7.5';
