/*
 * @smuit/loading-indicator
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { tv, type VariantProps } from 'tailwind-variants';

/**
 * Variant / slot configuration for the loading indicator.
 *
 * The visual axes here carry only the stable base classes; the interdependent
 * geometry (container vs indicator footprint per `size`, the contained fill and
 * corner shape per `variant`, and the tint accent) lives in
 * loading-indicator.css, keyed off the `data-variant` / `data-size` /
 * `data-tint` hooks the component sets — the same CSS-driven approach as
 * `@smuit/list`. Every colour resolves through the `--li-accent` /
 * `--li-container` tokens declared there.
 */
export const loadingIndicator = tv({
    slots: {
        // inline-flex centring box; `li` carries the tokens + footprint (CSS).
        root: 'li inline-flex items-center justify-center',
        // the morphing active indicator; sized + spun in CSS.
        shape: 'li-shape',
    },
    variants: {
        // Both variants share the indicator; `contained` adds a filled, rounded
        // container (fill + radius set per data-variant in CSS).
        variant: {
            uncontained: {},
            contained: {},
        },
        // Footprint — container + indicator sizes set per data-size in CSS.
        size: {
            sm: {},
            md: {},
            lg: {},
        },
        // Tint carries no class: loading-indicator.css drives `--li-accent` /
        // `--li-container` per `[data-tint]` from the semantic surface tokens
        // (neutral grey, or `--surface-<tint>-accent`).
        tint: {
            neutral: {},
            primary: {},
            secondary: {},
            tertiary: {},
        },
    },
    defaultVariants: {
        variant: 'uncontained',
        size: 'md',
        tint: 'primary',
    },
});

export type LoadingIndicatorVariants = VariantProps<typeof loadingIndicator>;
