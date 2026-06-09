/*
 * @smuit/loading-indicator
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { expect, test } from 'vitest';
import { loadingIndicator } from './loading-indicator.variants';

test('root slot carries the base box classes', () => {
    const { root } = loadingIndicator();
    expect(root()).toContain('li');
    expect(root()).toContain('inline-flex');
    expect(root()).toContain('items-center');
    expect(root()).toContain('justify-center');
});

test('shape slot carries the indicator class', () => {
    expect(loadingIndicator().shape()).toContain('li-shape');
});

test('footprint + fill are CSS-driven, so slot classes are stable across variant/size/tint', () => {
    // The visual axes are carried as data hooks (see loading-indicator.css), not
    // tv classes — the base slots are identical regardless of the combination.
    const base = loadingIndicator().root();
    expect(loadingIndicator({ variant: 'contained' }).root()).toBe(base);
    expect(loadingIndicator({ size: 'lg' }).root()).toBe(base);
    expect(loadingIndicator({ tint: 'secondary' }).root()).toBe(base);
});

test('accepts every documented axis value without error', () => {
    for (const variant of ['uncontained', 'contained'] as const) {
        for (const size of ['sm', 'md', 'lg'] as const) {
            for (const tint of ['neutral', 'primary', 'secondary', 'tertiary'] as const) {
                const s = loadingIndicator({ variant, size, tint });
                expect(s.root()).toContain('li');
                expect(s.shape()).toContain('li-shape');
            }
        }
    }
});
