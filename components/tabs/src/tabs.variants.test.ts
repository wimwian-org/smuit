/*
 * @smuit/tabs
 * Copyright (c) 2026 Anand Panchapakesan
 * Licensed under the MIT License.
 */
import { expect, test } from 'vitest';
import { tabs } from './tabs.variants';

test('slots expose the semantic class prefixes', () => {
    const s = tabs();
    expect(s.root()).toContain('tabs');
    expect(s.list()).toContain('tabs-list');
    expect(s.listWrap()).toContain('tabs-list-wrap');
    expect(s.trigger()).toContain('tabs-trigger');
    expect(s.icon()).toContain('tabs-icon');
    expect(s.label()).toContain('tabs-label');
    expect(s.badge()).toContain('tabs-badge');
    expect(s.indicator()).toContain('tabs-indicator');
    expect(s.content()).toContain('tabs-content');
    expect(s.scrollButton()).toContain('tabs-scroll-btn');
});

test('the list is the positioning context for the absolute indicator', () => {
    expect(tabs().list()).toContain('relative');
    expect(tabs().indicator()).toContain('absolute');
});

test('triggers carry the tinted hover + pressed state layers and a pointer cursor', () => {
    const trigger = tabs().trigger();
    expect(trigger).toContain('cursor-pointer');
    expect(trigger).toContain('hover:bg-[var(--tabs-hover)]');
    expect(trigger).toContain('active:bg-[var(--tabs-press)]');
});

test('size drives the trigger row height + padding', () => {
    expect(tabs({ size: 'sm' }).trigger()).toContain('h-10');
    expect(tabs({ size: 'sm' }).trigger()).toContain('px-3');
    expect(tabs({ size: 'md' }).trigger()).toContain('h-12');
    expect(tabs({ size: 'md' }).trigger()).toContain('px-4');
});

test('defaults are bold / md / neutral / horizontal / inline', () => {
    // Colour, typography, and indicator shape are CSS-driven off data hooks, so
    // the variant/tint axes carry no class — the structural defaults still apply.
    const s = tabs();
    expect(s.trigger()).toContain('h-12'); // md
    expect(s.root()).toContain('flex-col'); // horizontal
});

test('orientation flips the root + list flex axis and the wrap', () => {
    const h = tabs({ orientation: 'horizontal' });
    expect(h.root()).toContain('flex-col');
    expect(h.listWrap()).toContain('flex-row');

    const v = tabs({ orientation: 'vertical' });
    expect(v.root()).toContain('flex-row');
    expect(v.list()).toContain('flex-col');
    expect(v.listWrap()).toContain('flex-col');
});

test('stacked iconLayout makes a column trigger and raises the row height', () => {
    const inline = tabs({ iconLayout: 'inline' }).trigger();
    expect(inline).not.toContain('flex-col');

    expect(tabs({ iconLayout: 'stacked' }).trigger()).toContain('flex-col');
    // Stacked rows are taller than the inline sm/md heights.
    expect(tabs({ iconLayout: 'stacked', size: 'sm' }).trigger()).toContain('h-14');
    expect(tabs({ iconLayout: 'stacked', size: 'md' }).trigger()).toContain('h-16');
});
