/*
 * @smuit/progress-indicator
 * Copyright (c) 2026 wimwian
 * Licensed under the MIT License.
 */
import { expect, test } from 'vitest';
import { progressIndicator } from './progress-indicator.variants';

test('root slot carries the base track classes', () => {
    const { root } = progressIndicator();
    expect(root()).toContain('progress');
    expect(root()).toContain('w-full');
    expect(root()).toContain('overflow-hidden');
    expect(root()).toContain('rounded-full');
    expect(root()).toContain('bg-[var(--progress-track)]');
});

test('indicator slot takes its fill from the --progress-accent token', () => {
    expect(progressIndicator().indicator()).toContain('bg-[var(--progress-accent)]');
    expect(progressIndicator().indicator()).toContain('absolute');
    expect(progressIndicator().indicator()).toContain('rounded-full');
});

test('defaults are md height, primary tint, determinate', () => {
    // Default size md → h-2; tint/indeterminate carry no class (CSS-driven).
    expect(progressIndicator().root()).toContain('h-2');
});

test.each([
    ['sm', 'h-1'],
    ['md', 'h-2'],
    ['lg', 'h-3'],
] as const)('size=%s sets the track height class', (size, height) => {
    expect(progressIndicator({ size }).root()).toContain(height);
});

test('tint carries no class — it is a CSS token repointed per [data-tint]', () => {
    // The accent is set in CSS off the data hook, so the class string is
    // identical across tints.
    expect(progressIndicator({ tint: 'error' }).root()).toBe(progressIndicator({ tint: 'primary' }).root());
    expect(progressIndicator({ tint: 'neutral' }).indicator()).toBe(progressIndicator({ tint: 'success' }).indicator());
});

test('indeterminate carries no class — the animation is CSS-driven off the data hook', () => {
    expect(progressIndicator({ indeterminate: true }).root()).toBe(progressIndicator({ indeterminate: false }).root());
});
