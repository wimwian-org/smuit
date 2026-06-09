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

test('rows take their resting fill from the --list-rest token (set per variant×tint in CSS)', () => {
    // Fill is CSS-driven, so the class is the same regardless of variant.
    expect(list().item()).toContain('bg-[var(--list-rest)]');
    expect(list({ variant: 'expressive' }).item()).toContain('bg-[var(--list-rest)]');
});

test('interactive rows get the tinted hover + pressed state layers and a pointer cursor', () => {
    const item = list({ interactive: true }).item();
    expect(item).toContain('cursor-pointer');
    expect(item).toContain('hover:bg-[var(--list-hover)]');
    expect(item).toContain('active:bg-[var(--list-press)]');
});

test('non-interactive rows have no state layer', () => {
    expect(list({ interactive: false }).item()).not.toContain('hover:bg-[var(--list-hover)]');
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
    expect(s.control()).toContain('list-control');
    expect(s.subheader()).toContain('list-subheader');
});

test('one- and two-line rows truncate the supporting line; three-line wraps it', () => {
    expect(list({ lines: 'one' }).supporting()).toContain('truncate');
    expect(list({ lines: 'two' }).supporting()).toContain('truncate');
    // Three-line clamps (in CSS) instead of truncating, and top-aligns the row.
    expect(list({ lines: 'three' }).supporting()).not.toContain('truncate');
    expect(list({ lines: 'three' }).item()).toContain('items-start');
    expect(list({ lines: 'three' }).text()).toContain('justify-start');
});

test('the row carries a morph-friendly transition that stands down under reduced motion', () => {
    const item = list().item();
    expect(item).toContain('transition-[background-color,border-radius,transform]');
    expect(item).toContain('motion-reduce:transition-none');
});
