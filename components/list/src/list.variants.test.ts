/*
 * @smuit/list
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { expect, test } from 'vitest';
import { list } from './list.variants';

test('root slot carries the base list classes', () => {
    const { root } = list();
    expect(root()).toContain('list');
    expect(root()).toContain('flex');
    expect(root()).toContain('flex-col');
});

test('defaults to the baseline (transparent) variant', () => {
    expect(list().item()).toContain('bg-transparent');
});

test('expressive variant applies the tonal fill', () => {
    expect(list({ variant: 'expressive' }).item()).toContain('bg-g-100');
});

test('interactive rows get the hover + pressed state layers and a pointer cursor', () => {
    const item = list({ interactive: true }).item();
    expect(item).toContain('cursor-pointer');
    expect(item).toContain('hover:bg-g-150');
    expect(item).toContain('active:bg-g-200');
});

test('non-interactive rows have no state layer', () => {
    expect(list({ interactive: false }).item()).not.toContain('hover:bg-g-150');
});

test('disabled dims the row and removes pointer events', () => {
    const styles = list({ disabled: true });
    expect(styles.item()).toContain('pointer-events-none');
    expect(styles.headline()).toContain('text-g-400');
    expect(styles.supporting()).toContain('text-g-400');
});

test('slots expose the semantic class prefixes', () => {
    const s = list();
    expect(s.leading()).toContain('list-leading');
    expect(s.headline()).toContain('list-headline');
    expect(s.supporting()).toContain('list-supporting');
    expect(s.trailing()).toContain('list-trailing');
});
